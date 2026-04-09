import React, { useState, useEffect, memo } from 'react';
import {
  Box, Card, CardContent, CardHeader, Divider, IconButton, Radio,
  Stack, TextField, Typography, Button, Paper, Tooltip, alpha, useTheme, Avatar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import StarIcon from '@mui/icons-material/Star';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReactQuill from 'react-quill-new';

const SmoothOptionInput = ({ value, onSave, placeholder, endAdornment }: any) => {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <TextField
      fullWidth size="small" placeholder={placeholder}
      value={local} onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onSave(local)} InputProps={{ endAdornment }}
    />
  );
};

const QuestionCard = ({ question, index, onUpdate, onRemove }: any) => {
  const theme = useTheme();
  
  // Dynamic styling based on type
  const isStar = question.type === "StarPuzzle";
  const isImageQuiz = question.type === "ImageOptions";
  const typeColor = isStar ? theme.palette.secondary.main : isImageQuiz ? theme.palette.success.main : theme.palette.primary.main;

  const fastUpdate = (fields: any) => onUpdate({ ...question, ...fields });

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) fastUpdate({ pendingFile: file, mediaUrl: URL.createObjectURL(file) });
  };

  return (
    <Card variant="outlined" sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${alpha(typeColor, 0.2)}` }}>
      {/* --- CLEAN MODERN HEADER --- */}
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        px: 2, py: 1, bgcolor: alpha(typeColor, 0.05), borderBottom: `1px solid ${alpha(typeColor, 0.1)}` 
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: typeColor, width: 28, height: 28, fontSize: '0.875rem', fontWeight: 'bold' }}>
            {index + 1}
          </Avatar>
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: typeColor, textTransform: 'uppercase', letterSpacing: 1 }}>
            {question.type?.replace(/([A-Z])/g, ' $1').trim() || "General Question"}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField 
            label="Points" type="number" size="small" variant="standard"
            defaultValue={question.points || 10}
            onBlur={(e) => fastUpdate({ points: Number(e.target.value) })}
            sx={{ width: 60, '& .MuiInput-root': { fontSize: '0.875rem', fontWeight: 'bold' } }}
          />
          <IconButton onClick={onRemove} size="small" sx={{ color: theme.palette.error.light }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          
          {/* --- COMPACT MEDIA UPLOAD --- */}
          <Box sx={{ 
            display: 'flex', alignItems: 'center', gap: 2, p: 1.5, 
            borderRadius: '8px', border: '1px dashed', borderColor: question.mediaUrl ? typeColor : 'divider',
            bgcolor: alpha(typeColor, 0.02)
          }}>
            {question.mediaUrl ? (
              <Box sx={{ position: 'relative' }}>
                <img src={question.mediaUrl} style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }} alt="" />
                <IconButton 
                  size="small" onClick={() => fastUpdate({ mediaUrl: '', pendingFile: null })}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, width: 20, height: 20 }}
                >
                  <ClearIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ) : (
              <Avatar sx={{ bgcolor: 'divider', width: 40, height: 40 }}><HelpOutlineIcon /></Avatar>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block">
                QUESTION MEDIA
              </Typography>
              <Button size="small" component="label" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none', p: 0 }}>
                {question.mediaUrl ? "Change File" : "Upload Audio or Image"}
                <input type="file" hidden accept="audio/*,image/*" onChange={handleMediaChange} />
              </Button>
            </Box>
          </Box>

          {/* --- MAIN CONTENT (QUILL) --- */}
          <Box>
            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              READING PASSAGE / QUESTION TEXT
            </Typography>
            <Box sx={{
              borderRadius: '8px', border: '1px solid', borderColor: 'divider', overflow: 'hidden',
              '& .ql-toolbar': { bgcolor: alpha(theme.palette.action.hover, 0.5), border: 'none', borderBottom: '1px solid', borderColor: 'divider' },
              '& .ql-container': { border: 'none', minHeight: '200px', fontSize: '1rem' }
            }}>
              <ReactQuill theme="snow" value={question.questionText} onChange={(val) => fastUpdate({ questionText: val })} />
            </Box>
          </Box>

          {/* --- OPTIONS SECTION --- */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={900} color="text.secondary">ANSWER OPTIONS</Typography>
            {question.options.map((opt: any, oIdx: number) => {
              const isCorrectSlot = isStar ? oIdx === 2 : !!opt.isCorrect;
              return (
                <Stack key={oIdx} direction="row" spacing={2} alignItems="center">
                  {isStar ? (
                    <Box sx={{ 
                      width: 32, height: 32, borderRadius: '50%', border: '2px solid', 
                      borderColor: isCorrectSlot ? 'secondary.main' : 'divider',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isCorrectSlot ? alpha(theme.palette.secondary.main, 0.1) : 'transparent'
                    }}>
                      {isCorrectSlot ? <StarIcon sx={{ fontSize: 18 }} color="secondary" /> : <Typography variant="caption" fontWeight="bold">{oIdx + 1}</Typography>}
                    </Box>
                  ) : (
                    <Radio checked={isCorrectSlot} size="small" color="primary"
                      onChange={() => fastUpdate({ options: question.options.map((o: any, i: number) => ({ ...o, isCorrect: i === oIdx })) })} 
                    />
                  )}

                  <Box sx={{ flex: 1 }}>
                    {opt.isImageOption ? (
                      <Paper variant="outlined" sx={{ px: 1.5, py: 0.5, display: 'flex', gap: 2, alignItems: 'center', borderRadius: '8px' }}>
                         <img src={opt.optionText || ''} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, backgroundColor: '#eee' }} alt="" />
                         <Button variant="text" size="small" component="label" sx={{ flex: 1, justifyContent: 'flex-start' }}>
                           Upload Image <input type="file" hidden accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const newOps = [...question.options];
                               newOps[oIdx] = { ...newOps[oIdx], isImageOption: true, pendingFile: file, optionText: URL.createObjectURL(file) };
                               fastUpdate({ options: newOps });
                             }
                           }} />
                         </Button>
                         <IconButton size="small" onClick={() => {
                           const newOps = [...question.options];
                           newOps[oIdx] = { ...newOps[oIdx], isImageOption: false, optionText: '' };
                           fastUpdate({ options: newOps });
                         }}><TextFieldsIcon fontSize="small"/></IconButton>
                      </Paper>
                    ) : (
                      <SmoothOptionInput
                        placeholder={`Option ${oIdx + 1}`} value={opt.optionText}
                        onSave={(val: string) => {
                          const newOps = [...question.options];
                          newOps[oIdx].optionText = val;
                          if (isStar) newOps.forEach((o, i) => o.isCorrect = (i === 2));
                          fastUpdate({ options: newOps });
                        }}
                        endAdornment={<IconButton size="small" onClick={() => {
                          const newOps = [...question.options];
                          newOps[oIdx].isImageOption = true;
                          fastUpdate({ options: newOps });
                        }}><ImageIcon fontSize="small" /></IconButton>}
                      />
                    )}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default memo(QuestionCard);