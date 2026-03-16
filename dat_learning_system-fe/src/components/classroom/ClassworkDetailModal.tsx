import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, Link, TextField, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { submitClasswork, gradeClassworkSubmission } from '../../api/classwork.api';
import type { ClassworkItem } from '../../types_interfaces/classwork';
import fileToBase64 from '../../utils/fileToBase64';

interface Props {
  item: ClassworkItem;
  open: boolean;
  onClose: () => void;
  isEditMode: boolean; // True if Admin/Teacher
  onRefresh: () => void; // To reload data after action
}

const ClassworkDetailModal = ({ item, open, onClose, isEditMode, onRefresh }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Grading state (Admin only)
  const [grade, setGrade] = useState<number>(item.mySubmission?.grade ?? 0);
  const [feedback, setFeedback] = useState<string>(item.mySubmission?.feedback ?? '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleStudentSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      const base64 = await fileToBase64(file);
      await submitClasswork({
        classworkItemId: item.id,
        body: base64,
        fileName: file.name
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminGrade = async () => {
    if (!item.mySubmission) return;
    try {
      await gradeClassworkSubmission(item.mySubmission.id, { grade, feedback });
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Grading failed", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" 
      PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
      
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {/* Description & Resources */}
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          {item.description || "No description provided."}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, color: '#818cf8' }}>Resources</Typography>
        {item.resources.map(res => (
          <Box key={res.id} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachFileIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }} />
            <Link href={res.resourceUrl} target="_blank" sx={{ color: '#4ade80', fontSize: '0.85rem' }}>
              {res.displayName}
            </Link>
          </Box>
        ))}

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* --- Logic: Student Submission Area --- */}
        {!isEditMode && item.itemType === 'Assignment' && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Work</Typography>
            {item.mySubmission && (
               <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, mb: 2 }}>
                  <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.4)' }}>Last Submitted</Typography>
                  <Link href={item.mySubmission.fileUrl} target="_blank" sx={{ color: '#818cf8' }}>{item.mySubmission.fileName}</Link>
               </Box>
            )}
            
            <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadIcon />} sx={{ py: 2, borderStyle: 'dashed' }}>
              {file ? file.name : "Upload File (PDF/Docx/Xlsx)"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
        )}

        {/* --- Logic: Admin Grading Area --- */}
        {isEditMode && item.mySubmission && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Grading - Student Submission</Typography>
            <Link href={item.mySubmission.fileUrl} target="_blank" sx={{ mb: 2, display: 'block' }}>View Student File</Link>
            
            <TextField 
              label="Grade" type="number" fullWidth size="small"
              value={grade} onChange={(e) => setGrade(Number(e.target.value))}
              sx={{ mb: 2, input: { color: 'white' }, "& .MuiInputLabel-root": { color: 'rgba(255,255,255,0.5)' } }}
            />
            <TextField 
              label="Feedback" multiline rows={3} fullWidth
              value={feedback} onChange={(e) => setFeedback(e.target.value)}
              sx={{ mb: 2, textarea: { color: 'white' }, "& .MuiInputLabel-root": { color: 'rgba(255,255,255,0.5)' } }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!isEditMode ? (
          <Button 
            onClick={handleStudentSubmit} 
            disabled={!file || submitting} 
            variant="contained" 
            fullWidth 
            sx={{ bgcolor: '#818cf8', '&:hover': { bgcolor: '#6366f1' } }}
          >
            {item.mySubmission ? "Resubmit Work" : "Turn In"}
          </Button>
        ) : (
          <Button onClick={handleAdminGrade} variant="contained" color="success" fullWidth>
            Save Grade
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ClassworkDetailModal;