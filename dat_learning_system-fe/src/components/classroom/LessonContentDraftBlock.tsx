import { useState, type ChangeEvent } from 'react';
import {
    Box, Stack, Paper, TextField, IconButton, Button,
    ToggleButtonGroup, ToggleButton, Typography, Divider, Checkbox
} from '@mui/material';
import {
    Delete, DragIndicator, YouTube, CloudUpload,
    Link as LinkIcon, Add, Quiz, Ballot
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraftBlock = ({ block, updateBlock, removeBlock }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.tempId });
    const [inputMethod, setInputMethod] = useState<'upload' | 'link'>('link');

    // Helper to handle JSON body for tests
    const quizData = block.contentType === 'test' ? JSON.parse(block.body) : { questions: [], passingGrade: 70 };

    const updateQuiz = (newData: any) => {
        updateBlock(block.tempId, JSON.stringify(newData));
    };

    const addQuestion = () => {
        const newQuestions = [...quizData.questions, { question: '', options: ['', ''], correctAnswer: '' }];
        updateQuiz({ ...quizData, questions: newQuestions });
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '20px',
        zIndex: isDragging ? 1000 : 1,
        position: 'relative' as const,
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => updateBlock(block.tempId, reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            sx={{
                p: 2, bgcolor: '#1e293b', border: '1px solid',
                borderColor: isDragging ? '#6366f1' : '#334155',
                boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.4)' : 'none'
            }}
        >
            <Stack direction="row" spacing={2}>
                <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                    <DragIndicator sx={{ color: 'rgba(255,255,255,0.2)' }} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    {/* --- TEXT TYPE --- */}
                    {block.contentType === 'text' && (
                        <TextField
                            multiline fullWidth variant="standard"
                            placeholder="Write your lesson text..."
                            value={block.body}
                            onChange={(e) => updateBlock(block.tempId, e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                sx: { color: 'white', lineHeight: 1.7, fontSize: '1.05rem' }
                            }}
                        />
                    )}

                    {/* --- MEDIA TYPES (IMAGE & VIDEO) --- */}

                    {(block.contentType === 'image' || block.contentType === 'video') && (

                        <Stack spacing={2}>

                            {/* Toggle Selector */}

                            <ToggleButtonGroup

                                value={inputMethod}

                                exclusive

                                size="small"

                                onChange={(_, val) => val && setInputMethod(val)}

                                sx={{ alignSelf: 'flex-start', bgcolor: '#0f172a' }}

                            >

                                <ToggleButton value="link" sx={{ color: 'white', px: 2 }}>

                                    <LinkIcon sx={{ mr: 1, fontSize: 18 }} /> Link

                                </ToggleButton>

                                <ToggleButton value="upload" sx={{ color: 'white', px: 2 }}>

                                    <CloudUpload sx={{ mr: 1, fontSize: 18 }} /> Upload

                                </ToggleButton>

                            </ToggleButtonGroup>



                            {inputMethod === 'link' ? (

                                <TextField

                                    fullWidth size="small"

                                    sx={{

                                        // Targets the actual text you type

                                        "& .MuiInputBase-input": {

                                            color: "white",

                                        },

                                        // Targets the placeholder text

                                        "& .MuiInputBase-input::placeholder": {

                                            color: "rgba(255, 255, 255, 0.5)",

                                            opacity: 1, // Firefox fix

                                        },

                                        // Targets the border/outline (if you're using outlined variant)

                                        "& .MuiOutlinedInput-root": {

                                            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },

                                            "&:hover fieldset": { borderColor: "white" },

                                        }

                                    }}

                                    placeholder={block.contentType === 'image' ? "Paste Image URL..." : "Paste Video URL (YouTube/Video)..."}

                                    value={block.body}

                                    onChange={(e) => updateBlock(block.tempId, e.target.value)}

                                    InputProps={{

                                        startAdornment: block.contentType === 'video' ?

                                            <YouTube sx={{ mr: 1, color: '#ef4444' }} /> :

                                            <LinkIcon sx={{ mr: 1, opacity: 0.5, color: 'white' }} />

                                    }}

                                />

                            ) : (

                                <Button

                                    component="label"

                                    variant="outlined"

                                    fullWidth

                                    sx={{

                                        py: 4, borderStyle: 'dashed',

                                        color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.2)',

                                        '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)' }

                                    }}

                                >

                                    <Stack alignItems="center" spacing={1}>

                                        <CloudUpload fontSize="large" />

                                        <Typography variant="caption">

                                            Click or Drag {block.contentType === 'image' ? 'Image' : 'Video'} to Upload

                                        </Typography>

                                    </Stack>

                                    <input

                                        type="file" hidden

                                        accept={block.contentType === 'image' ? "image/*" : "video/*"}

                                        onChange={handleFileChange}

                                    />

                                </Button>

                            )}



                            {/* PREVIEW AREA */}

                            {block.body && (

                                <Box sx={{ mt: 2, position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>

                                    {block.contentType === 'image' ? (

                                        <Box component="img" src={block.body} sx={{ width: '100%', maxHeight: 400, objectFit: 'contain' }} />

                                    ) : (

                                        <Box sx={{ aspectRatio: '16/9' }}>

                                            {block.body.startsWith('data:video') || block.body.startsWith('blob:') ? (

                                                <video src={block.body} controls width="100%" />

                                            ) : (

                                                <iframe

                                                    width="100%" height="100%"

                                                    src={block.body.replace("watch?v=", "embed/")}

                                                    frameBorder="0" allowFullScreen

                                                />

                                            )}

                                        </Box>

                                    )}

                                    <IconButton

                                        size="small"

                                        onClick={() => updateBlock(block.tempId, '')}

                                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'black' } }}

                                    >

                                        <Delete fontSize="small" />

                                    </IconButton>

                                </Box>

                            )}

                        </Stack>

                    )}

                    {/* --- TEST TYPE (QUIZ CREATOR) --- */}
                    {block.contentType === 'test' && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                <Quiz sx={{ color: '#818cf8' }} />
                                <Typography sx={{ color: 'white', fontWeight: 700 }}>Test Creator</Typography>
                                <TextField
                                    label="Passing %"
                                    type="number"
                                    size="small"
                                    value={quizData.passingGrade}
                                    onChange={(e) => updateQuiz({ ...quizData, passingGrade: Number(e.target.value) })}
                                    sx={{
                                        width: 100,
                                        "& .MuiInputBase-input": { color: 'white' },
                                        "& .MuiInputLabel-root": { color: 'rgba(255,255,255,0.5)' }
                                    }}
                                />
                            </Stack>

                            <Stack spacing={3}>
                                {quizData.questions.map((q: any, qIdx: number) => (
                                    <Box key={qIdx} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, position: 'relative' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                const newQs = quizData.questions.filter((_: any, i: number) => i !== qIdx);
                                                updateQuiz({ ...quizData, questions: newQs });
                                            }}
                                            sx={{ position: 'absolute', right: 5, top: 5, color: '#f43f5e' }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>

                                        <TextField
                                            fullWidth variant="standard"
                                            placeholder={`Question ${qIdx + 1}`}
                                            value={q.question}
                                            onChange={(e) => {
                                                const newQs = [...quizData.questions];
                                                newQs[qIdx].question = e.target.value;
                                                updateQuiz({ ...quizData, questions: newQs });
                                            }}
                                            sx={{ mb: 2, "& .MuiInputBase-input": { color: '#818cf8', fontWeight: 600 } }}
                                        />

                                        <Stack spacing={1}>
                                            {q.options.map((opt: string, oIdx: number) => (
                                                <Stack key={oIdx} direction="row" alignItems="center" spacing={1}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={q.correctAnswer === opt && opt !== ''}
                                                        onChange={() => {
                                                            const newQs = [...quizData.questions];
                                                            newQs[qIdx].correctAnswer = opt;
                                                            updateQuiz({ ...quizData, questions: newQs });
                                                        }}
                                                        sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#10b981' } }}
                                                    />
                                                    <TextField
                                                        fullWidth size="small"
                                                        placeholder={`Option ${oIdx + 1}`}
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newQs = [...quizData.questions];
                                                            newQs[qIdx].options[oIdx] = e.target.value;
                                                            // Auto-update correctAnswer if we're editing the currently correct one
                                                            if (q.correctAnswer === opt) newQs[qIdx].correctAnswer = e.target.value;
                                                            updateQuiz({ ...quizData, questions: newQs });
                                                        }}
                                                        sx={{ "& .MuiInputBase-input": { color: 'white', fontSize: '0.9rem' } }}
                                                    />
                                                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.2)' }}
                                                        onClick={() => {
                                                            const newQs = [...quizData.questions];
                                                            newQs[qIdx].options = q.options.filter((_: any, i: number) => i !== oIdx);
                                                            updateQuiz({ ...quizData, questions: newQs });
                                                        }}
                                                    >
                                                        <Delete fontSize="inherit" />
                                                    </IconButton>
                                                </Stack>
                                            ))}
                                            <Button
                                                startIcon={<Add />}
                                                size="small"
                                                onClick={() => {
                                                    const newQs = [...quizData.questions];
                                                    newQs[qIdx].options.push('');
                                                    updateQuiz({ ...quizData, questions: newQs });
                                                }}
                                                sx={{ alignSelf: 'flex-start', color: '#818cf8', textTransform: 'none' }}
                                            >
                                                Add Option
                                            </Button>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>

                            <Button
                                fullWidth startIcon={<Ballot />}
                                onClick={addQuestion}
                                sx={{ mt: 2, py: 1, border: '1px dashed #475569', color: '#94a3b8', textTransform: 'none' }}
                            >
                                Add Question
                            </Button>
                        </Box>
                    )}
                </Box>

                <IconButton onClick={() => removeBlock(block.tempId)} sx={{ color: '#ef4444', alignSelf: 'flex-start' }}>
                    <Delete fontSize="small" />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default DraftBlock;