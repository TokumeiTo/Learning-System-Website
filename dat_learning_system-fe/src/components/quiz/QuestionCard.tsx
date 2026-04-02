import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, CardHeader, Divider, IconButton, Radio,
  Stack, TextField, Typography, Button, Paper, Tooltip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';

// --- SUB-COMPONENT FOR SMOOTH TYPING ---
const SmoothTextField = ({ value, label, onSave, placeholder, endAdornment }: any) => {
  const [localValue, setLocalValue] = useState(value);

  // Keep local in sync if the parent changes (e.g. switching types)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      // Only trigger the heavy parent update when user finished typing
      onBlur={() => onSave(localValue)}
      InputProps={{ endAdornment }}
    />
  );
};

const QuestionCard = ({ question, index, onUpdate, onRemove }: any) => {

  const fastUpdate = (fields: any) => onUpdate({ ...question, ...fields });

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fastUpdate({
      pendingFile: file,
      mediaUrl: URL.createObjectURL(file)
    });
  };

  const handleOptionFileChange = (e: React.ChangeEvent<HTMLInputElement>, oIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newOptions = [...question.options];
    newOptions[oIdx] = {
      ...newOptions[oIdx],
      isImageOption: true,
      pendingFile: file,
      optionText: URL.createObjectURL(file)
    };
    fastUpdate({ options: newOptions });
  };

  const toggleOptionType = (oIdx: number) => {
    const newOptions = [...question.options];
    const isCurrentlyImage = !!newOptions[oIdx].isImageOption;

    newOptions[oIdx] = {
      ...newOptions[oIdx],
      isImageOption: !isCurrentlyImage,
      optionText: '', 
      pendingFile: null 
    };
    fastUpdate({ options: newOptions });
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader
        sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}
        title={<Typography variant="subtitle1" fontWeight="bold">Question {index + 1}</Typography>}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField type="number" size="small" label="Pts" sx={{ width: 70 }}
              defaultValue={question.points || 10}
              onBlur={(e) => fastUpdate({ points: Number(e.target.value) })}
            />
            <IconButton onClick={onRemove}><DeleteIcon color="error" /></IconButton>
          </Stack>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          
          {/* SMOOTH QUESTION TEXT */}
          <SmoothTextField 
            label="Question Text"
            value={question.questionText}
            onSave={(val: string) => fastUpdate({ questionText: val })}
          />

          {/* QUESTION MEDIA SECTION */}
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
            {question.mediaUrl ? (
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                {question.mediaUrl.match(/\.(jpg|jpeg|png|gif|blob)/i) || question.mediaUrl.startsWith('blob:') ? (
                  <img src={question.mediaUrl} style={{ height: 80, borderRadius: 4 }} alt="Preview" />
                ) : (
                  <audio src={question.mediaUrl} controls />
                )}
                <IconButton color="error" size="small" onClick={() => fastUpdate({ mediaUrl: '', pendingFile: null })}>
                  <ClearIcon />
                </IconButton>
              </Stack>
            ) : (
              <Button variant="text" component="label" startIcon={<CloudUploadIcon />}>
                Add Question Media (Audio/Image)
                <input type="file" hidden accept="audio/*,image/*" onChange={handleMainFileChange} />
              </Button>
            )}
          </Box>

          {/* ANSWER OPTIONS SECTION */}
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">ANSWER OPTIONS</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {question.options.map((opt: any, oIdx: number) => (
                <Stack key={oIdx} direction="row" spacing={1} alignItems="flex-start">
                  <Radio 
                    checked={!!opt.isCorrect} 
                    sx={{ mt: 0.5 }}
                    onChange={() => {
                      const newOps = question.options.map((o: any, i: number) => ({ ...o, isCorrect: i === oIdx }));
                      fastUpdate({ options: newOps });
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    {opt.isImageOption ? (
                      <Paper variant="outlined" sx={{ p: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{
                          width: 60, height: 60, border: '1px solid gray', borderRadius: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: '#f5f5f5'
                        }}>
                          {opt.optionText ? (
                            <img src={opt.optionText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          ) : (
                            <ImageIcon color="disabled" />
                          )}
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                          <Button variant="outlined" component="label" size="small" fullWidth startIcon={<CloudUploadIcon />}>
                            Upload
                            <input type="file" hidden accept="image/*" onChange={(e) => handleOptionFileChange(e, oIdx)} />
                          </Button>
                          <Tooltip title="Switch to Text">
                            <IconButton size="small" onClick={() => toggleOptionType(oIdx)}><TextFieldsIcon /></IconButton>
                          </Tooltip>
                        </Stack>
                      </Paper>
                    ) : (
                      <SmoothTextField 
                        placeholder={`Option ${oIdx + 1} (Text)`}
                        value={opt.optionText}
                        onSave={(val: string) => {
                          const newOps = [...question.options];
                          newOps[oIdx].optionText = val;
                          fastUpdate({ options: newOps });
                        }}
                        endAdornment={
                          <Tooltip title="Switch to Image">
                            <IconButton size="small" onClick={() => toggleOptionType(oIdx)}>
                              <ImageIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;