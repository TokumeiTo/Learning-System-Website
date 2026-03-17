import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Divider, Link, TextField, IconButton, Alert, List, ListItem, ListItemText,
  Stack, Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { submitClasswork, gradeClassworkSubmission } from '../../api/classwork.api';
import type { ClassworkItem, AdminSubmissionView } from '../../types_interfaces/classwork';
import fileToBase64 from '../../utils/fileToBase64';

interface Props {
  item: ClassworkItem;
  open: boolean;
  onClose: () => void;
  isEditMode: boolean;
  onRefresh: () => void;
}

const ClassworkDetailModal = ({ item, open, onClose, isEditMode, onRefresh }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Admin Grading State
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmissionView | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);

  const isAssignment = item.itemType === 'Assignment';
  const isPastDue = item.dueDate ? dayjs().isAfter(dayjs(item.dueDate)) : false;
  const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(selectedSubmission?.fileUrl || "");

  // Logic to detect the "Auto-Fail" injected by the backend
  const isAutoFailed = item.mySubmission?.grade === 0 &&
    item.mySubmission?.feedback?.includes("System: Failed");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleStudentSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      const base64 = await fileToBase64(file);
      await submitClasswork({ classworkItemId: item.id, body: base64, fileName: file.name });
      onRefresh();
      onClose();
    } catch (error) { console.error("Submission failed", error); }
    finally { setSubmitting(false); }
  };

  const startGrading = (submission: AdminSubmissionView) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade ?? 0);
    setFeedback(submission.feedback ?? '');
  };

  const handleAdminGrade = async () => {
    if (!selectedSubmission) return;
    setIsGrading(true);
    try {
      await gradeClassworkSubmission(selectedSubmission.id, { grade, feedback });

      // 1. Trigger the parent refresh (updates the 'item' prop)
      onRefresh();

      // 2. Update the local 'selectedSubmission' so the UI reflects changes immediately
      setSelectedSubmission({
        ...selectedSubmission,
        grade: grade,
        feedback: feedback
      });

    } catch (error) {
      console.error("Grading failed", error);
    } finally {
      setIsGrading(false);
    }
  };

  const getGradeConfig = (score: number | null | undefined) => {
    if (score === null || score === undefined) return { letter: 'N/A', color: '#94a3b8' };
    if (score >= 90) return { letter: 'A', color: '#10b981' };
    if (score >= 80) return { letter: 'B', color: '#3b82f6' };
    if (score >= 70) return { letter: 'C', color: '#fbbf24' };
    if (score >= 60) return { letter: 'D', color: '#f59e0b' };
    if (score >= 50) return { letter: 'E', color: '#f43f5e' };
    return { letter: 'F', color: '#f87171' };
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
      PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>

      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            {isAssignment ? `Due: ${item.dueDate ? dayjs(item.dueDate).format('DD MMM, hh:mm A') : 'No Date'}` : 'Learning Material'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, whiteSpace: 'pre-wrap' }}>
          {item.description || "No description provided."}
        </Typography>

        {/* --- SHARED RESOURCES --- */}
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#818cf8' }}>Resources</Typography>
        <Stack spacing={1} sx={{ mb: 3 }}>
          {item.resources.map(res => (
            <Box key={res.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }} />
              <Link href={res.resourceUrl} target="_blank" sx={{ color: '#4ade80', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                {res.displayName}
              </Link>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* --- ADMIN REVIEW INTERFACE --- */}
        {isEditMode && isAssignment && (
          <Box>
            <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 700 }}>
              Review Submissions ({item.allSubmissions?.length || 0})
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1, height: '380px' }}>
              <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                <List disablePadding>
                  {item.allSubmissions?.map((sub) => {
                    const config = getGradeConfig(sub.grade); // Call it here
                    return (
                      <ListItem
                        key={sub.id}
                        onClick={() => startGrading(sub)}
                        sx={{
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          bgcolor: selectedSubmission?.id === sub.id ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <ListItemText
                          primary={sub.studentName}
                          secondary={sub.grade !== null ? `Grade: ${config.letter} (${sub.grade})` : 'Pending Review'}
                          primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem', color: config.color }} // Use config color
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>

              {selectedSubmission ? (
                <Box sx={{ flex: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{selectedSubmission.studentName}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                      Student Submission: <b>{selectedSubmission.fileName}</b>
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      {/* VIEW BUTTON: Only show if it IS an image */}
                      {isImage && (
                        <Button
                          size="small"
                          variant="outlined"
                          href={`${import.meta.env.VITE_API_URL}${selectedSubmission.fileUrl}`}
                          target="_blank"
                          startIcon={<AttachFileIcon />}
                          sx={{ color: '#818cf8', borderColor: '#818cf8' }}
                        >
                          View
                        </Button>
                      )}

                      {/* DOWNLOAD BUTTON: Only show if it is NOT an image */}
                      {!isImage && (
                        <Button
                          size="small"
                          variant="contained"
                          href={`${import.meta.env.VITE_API_URL}${selectedSubmission.fileUrl}`}
                          download={selectedSubmission.fileName}
                          startIcon={<CloudUploadIcon sx={{ transform: 'rotate(180deg)' }} />}
                          sx={{ bgcolor: '#4ade80', '&:hover': { bgcolor: '#22c55e' } }}
                        >
                          Download
                        </Button>
                      )}
                    </Stack>
                  </Box>
                  <TextField label="Grade (0-100)" type="number" fullWidth size="small" sx={{ mb: 2, input: { color: 'white' } }}
                    value={grade} onChange={(e) => setGrade(Number(e.target.value))} />
                  <TextField label="Feedback" multiline rows={3} fullWidth sx={{ mb: 2, textarea: { color: 'white' } }}
                    value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAdminGrade}
                    disabled={isGrading}
                    sx={{ bgcolor: '#4ade80', '&:hover': { bgcolor: '#22c55e' } }}
                  >
                    {isGrading ? "Saving..." : "Save Grade"}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>Select a student from the list to grade</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}

        {/* --- STUDENT VIEW INTERFACE --- */}
        {!isEditMode && isAssignment && (
          <Box>
            {isAutoFailed && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid #f87171' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Status: FAIL (F)</Typography>
                <Typography variant="caption">{item.mySubmission?.feedback}</Typography>
              </Alert>
            )}

            {item.mySubmission && !isAutoFailed && (
              <Box sx={{
                p: 2, mb: 2,
                bgcolor: 'rgba(129, 140, 248, 0.05)',
                borderRadius: 2,
                borderLeft: `4px solid ${getGradeConfig(item.mySubmission.grade).color}` // Dynamic border
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ color: getGradeConfig(item.mySubmission.grade).color, fontWeight: 700 }}>
                    Points: {item.mySubmission.grade ?? 'Pending Review'}
                  </Typography>

                  {item.mySubmission.grade !== null && (
                    <Chip
                      label={getGradeConfig(item.mySubmission.grade).letter} // Shows A, B, C, etc.
                      size="small"
                      sx={{
                        bgcolor: `${getGradeConfig(item.mySubmission.grade).color}20`,
                        color: getGradeConfig(item.mySubmission.grade).color,
                        border: `1px solid ${getGradeConfig(item.mySubmission.grade).color}`,
                        fontWeight: 800
                      }}
                    />
                  )}
                </Stack>
                <Box sx={{ mt: 2, mb: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                    <AttachFileIcon sx={{ fontSize: 18, color: '#818cf8' }} />
                    <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                      {item.mySubmission.fileName}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="text"
                    href={`${import.meta.env.VITE_API_URL}${item.mySubmission.fileUrl}`}
                    target="_blank"
                    sx={{ color: '#4ade80', fontSize: '0.7rem', minWidth: 'auto' }}
                  >
                    Check My File
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                  "{item.mySubmission.feedback || 'Waiting for instructor feedback...'}"
                </Typography>
              </Box>
            )}

            {!isAutoFailed && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{item.mySubmission ? "Update Submission" : "Upload Your Work"}</Typography>
                <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadIcon />}
                  sx={{ py: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {file ? file.name : (item.mySubmission ? "Replace existing file" : "Choose File (PDF/Docx)")}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#1e293b' }}>
        {!isEditMode && isAssignment && !isAutoFailed && (
          <Button onClick={handleStudentSubmit} disabled={!file || submitting || isPastDue} variant="contained" fullWidth sx={{ bgcolor: '#818cf8' }}>
            {submitting ? "Processing..." : (item.mySubmission ? "Resubmit Work" : "Turn In")}
          </Button>
        )}
        {(isEditMode || !isAssignment || isAutoFailed) && (
          <Button onClick={onClose} fullWidth variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ClassworkDetailModal;