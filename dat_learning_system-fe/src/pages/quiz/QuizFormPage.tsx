import { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Stack, MenuItem, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { checkTestName, fetchQuizById, saveTestContent } from '../../api/test.api';
import { uploadMediaFile } from '../../api/filemanager.api'; // Don't forget this!
import type { Test, Question, QuizType } from '../../types_interfaces/test';
import QuestionCard from '../../components/quiz/QuestionCard';
import PageLayout from '../../components/layout/PageLayout';
import MessagePopup from '../../components/feedback/MessagePopup';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../../components/feedback/ConfirmModal';

const QuizFormPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test>({
    title: '',
    passingGrade: 50,
    isGlobal: true,
    category: 'Grammar',
    jlptLevel: 'N5',
    questions: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [versionMessage, setVersionMessage] = useState("");
  const navigate = useNavigate();

  const [localTitle, setLocalTitle] = useState(test.title);

  // EDIT MODE CHANGE
  useEffect(() => {
    if (testId) {
      const loadTestData = async () => {
        try {
          const data = await fetchQuizById(testId);
          // Add tempIds to questions so your Sort/Remove logic doesn't break
          const mappedQuestions = data.questions.map(q => ({
            ...q,
            tempId: q.id || Date.now() + Math.random()
          }));
          setTest({ ...data, questions: mappedQuestions });
        } catch (err) {
          showMsg("Failed to load quiz data", "error");
        }
      };
      loadTestData();
    }
  }, [testId]);

  useEffect(() => {
    setLocalTitle(test.title);
  }, [test.title]);

  const [popup, setPopup] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: '', severity: 'info' });

  const showMsg = (msg: string, sev: "success" | "error" | "info" | "warning" = "info") => {
    setPopup({ open: true, message: msg, severity: sev });
  };

  const handleClosePopup = () => setPopup({ ...popup, open: false });

  const addQuestion = (type: QuizType) => {
    const newQuestion: Question & { tempId: number } = {
      tempId: Date.now(), // Fix 3: Unique key for rendering
      questionText: '',
      type: type,
      points: 10,
      sortOrder: test.questions.length + 1,
      mediaUrl: '',
      options: Array(4).fill(null).map(() => ({ optionText: '', isCorrect: false, isImageOption: type === "MediaOption" }))
    };
    setTest(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const handleSave = async () => {
    const finalTitle = localTitle || test.title;
    if (!finalTitle) return showMsg("Please enter a test title", "warning");

    setIsSaving(true);

    setIsSaving(true);
    try {
      const uploadedQuestions = await Promise.all(test.questions.map(async (q: any) => {
        let mediaUrl = q.mediaUrl;

        // Upload main question media
        if (q.pendingFile instanceof File) {
          const folder = q.pendingFile.type.startsWith('audio/') ? 'audio' : 'images';
          mediaUrl = await uploadMediaFile(q.pendingFile, folder);
        }

        // Upload option media
        const updatedOptions = await Promise.all(q.options.map(async (opt: any) => {
          if (opt.pendingFile instanceof File) {
            const optUrl = await uploadMediaFile(opt.pendingFile, 'images');
            // Clean up: return object without the local File/Blob
            const { pendingFile, ...rest } = opt;
            return { ...rest, optionText: optUrl };
          }
          return opt;
        }));

        // Clean up: remove temp properties before sending to backend
        const { pendingFile, tempId, ...cleanQuestion } = q;
        return {
          ...cleanQuestion,
          mediaUrl,
          options: updatedOptions
        };
      }));

      const finalPayload = { ...test, questions: uploadedQuestions };
      await saveTestContent(testId || null, finalPayload);
      showMsg(testId ? "Version Updated Successfully!" : "Test Published Successfully!", "success");
    } catch (err) {
      console.error(err);
      showMsg("Failed to save. Check your connection or file sizes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckName = async (titleToCheck?: string) => {
    const currentTitle = titleToCheck || test.title;

    if (testId || !currentTitle) return;

    try {
      const result = await checkTestName(currentTitle, test.isGlobal);
      if (result.exists) {
        setVersionMessage(result.message);
        setConfirmOpen(true);
      }
    } catch (err) {
      console.error("Name check failed", err);
    }
  };

  const handleConfirmVersion = () => {
    setConfirmOpen(false);
  };

  return (
    <PageLayout>
      <Box sx={{ px: 4, mx: 'auto' }}>
        <Box sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{testId ? `Editnig: ${test.title}` : "Publishing New Test"}</Typography>
            <Button onClick={() => navigate('/admin/quizzes')}>Back to List</Button>
          </Box>


          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                sx={{ flex: 3 }}
                label="Test Title"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => handleCheckName(localTitle)}
                helperText={testId ? "Editing existing version" : "Tab out to check availability"}
              />
              <TextField
                sx={{ width:'80px' }}
                type="number" label="Passing %"
                value={test.passingGrade}
                onChange={(e) => setTest({ ...test, passingGrade: Number(e.target.value) })}
              />
            </Stack>

            {test.isGlobal && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  select fullWidth label="JLPT Level"
                  value={test.jlptLevel || ''}
                  onChange={(e) => setTest({ ...test, jlptLevel: e.target.value })}
                >
                  {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select fullWidth label="Category"
                  value={test.category || ''}
                  onChange={(e) => setTest({ ...test, category: e.target.value })}
                >
                  {['Grammar', 'Vocabulary', 'Listening', 'Reading'].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            )}
          </Stack>
        </Box>

        <Stack spacing={3}>
          {test.questions.map((q: any, idx) => (
            <QuestionCard
              key={q.tempId || idx} // Fix 3: Use stable key
              question={q}
              index={idx}
              onUpdate={(updatedQ: Question) => {
                setTest(prev => {
                  const newQs = [...prev.questions];
                  newQs[idx] = updatedQ;
                  return { ...prev, questions: newQs };
                });
              }}
              onRemove={() => setTest(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== idx)
              }))}
            />
          ))}
        </Stack>

        <Paper sx={{ p: 2, mt: 4, border: '1px dashed gray', textAlign: 'center' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>ADD NEW QUESTION</Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addQuestion("MultipleChoice")}>Text Quiz</Button>
            <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={() => addQuestion("StarPuzzle")}>Star Puzzle</Button>
            <Button variant="outlined" color="success" startIcon={<AddIcon />} onClick={() => addQuestion("MediaOption")}>Image Options</Button>
          </Stack>
        </Paper>

        <Button
          fullWidth variant="contained" size="large"
          disabled={isSaving} // Prevent double clicks
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ mt: 6, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          onClick={handleSave}
        >
          {isSaving ? "Uploading Files..." : "Publish Test to Hikari Learning"}
        </Button>
      </Box>

      <MessagePopup {...popup} onClose={handleClosePopup} />
      <ConfirmModal
        open={confirmOpen}
        title="Existing Quiz Found"
        message={versionMessage}
        confirmColor="warning"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmVersion} // The user clicked "Confirm" after the 2s wait
      />
    </PageLayout>
  );
};

export default QuizFormPage;