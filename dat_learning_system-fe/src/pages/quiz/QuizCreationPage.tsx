import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Stack, MenuItem, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { saveTestContent } from '../../api/test.api';
import { uploadMediaFile } from '../../api/filemanager.api'; // Don't forget this!
import type { Test, Question, QuizType } from '../../types_interfaces/test';
import QuestionCard from '../../components/quiz/QuestionCard';
import PageLayout from '../../components/layout/PageLayout';
import MessagePopup from '../../components/feedback/MessagePopup';

const QuizCreationPage = ({ contentId = null }: { contentId?: string | null }) => {
  const [isSaving, setIsSaving] = useState(false); // Fix 1: Added missing state
  const [test, setTest] = useState<Test>({
    title: '',
    passingGrade: 50,
    isGlobal: true,
    category: 'Grammar',
    jlptLevel: 'N5',
    questions: []
  });

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
    if (!test.title) return showMsg("Please enter a test title", "warning");

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
      await saveTestContent(contentId, finalPayload);
      showMsg("Test Published Successfully!", "success");
    } catch (err) {
      console.error(err);
      showMsg("Failed to save. Check your connection or file sizes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout>
      <Box sx={{ p: 4, maxWidth: 850, mx: 'auto' }}>
        <MessagePopup {...popup} onClose={handleClosePopup} />

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Test Configuration</Typography>

          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                sx={{ flex: 3 }}
                label="Test Title"
                value={test.title}
                onChange={(e) => setTest({ ...test, title: e.target.value })}
              />
              <TextField
                sx={{ flex: 1 }}
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
        </Paper>

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
    </PageLayout>
  );
};

export default QuizCreationPage;