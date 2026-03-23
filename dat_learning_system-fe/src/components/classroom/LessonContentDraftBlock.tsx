import { useMemo, useState, type ChangeEvent } from 'react';
import {
    Box, Stack, Paper, TextField, IconButton, Button,
    ToggleButtonGroup, ToggleButton, Typography,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    Delete, DragIndicator, CloudUpload,
    Link as LinkIcon
} from '@mui/icons-material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TestBuilder from './TestBuilder';
import ReactQuill from 'react-quill-new';

const textModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],           // This adds H1, H2, H3 dropdown
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const DraftBlock = ({ block, updateBlock, removeBlock }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.tempId });
    const [inputMethod, setInputMethod] = useState<'upload' | 'link'>('link');
    const [isChartEditMode, setIsChartEditMode] = useState(false);

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
            reader.onloadend = () => {
                updateBlock(block.tempId, {
                    body: reader.result as string,
                    fileName: file.name
                });
            }
            reader.readAsDataURL(file);
        }
    };

    // Inside DraftBlock
    const isBase64 = useMemo(() => block.body?.startsWith('data:'), [block.body]);
    const isSavedFile = useMemo(() => block.body?.startsWith('/uploads/'), [block.body]);

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            sx={{
                p: 2, bgcolor: '#1e293b', border: '1px solid',
                borderColor: isDragging ? '#6366f1' : '#334155',
            }}
        >
            <Stack direction="row" spacing={2}>
                <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                    <DragIndicator sx={{ color: 'rgba(255,255,255,0.2)' }} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    {/* --- UNIVERSAL TEXT TYPE --- */}
                    {block.contentType === 'text' && (
                        <Box sx={{
                            bgcolor: '#0f172a',
                            borderRadius: 2,
                            border: '1px solid #334155',
                            '.ql-toolbar': {
                                border: 'none',
                                borderBottom: '1px solid #334155',
                                bgcolor: '#1e293b',
                                borderRadius: '8px 8px 0 0'
                            },
                            '.ql-container': { border: 'none', minHeight: '120px' },
                            '.ql-editor': { color: 'white', fontSize: '1.05rem', lineHeight: 1.6 },
                            // Making the toolbar icons visible on dark background
                            '.ql-snow .ql-stroke': { stroke: '#cbd5e1' },
                            '.ql-snow .ql-fill': { fill: '#cbd5e1' },
                            '.ql-snow .ql-picker': { color: '#cbd5e1' }
                        }}>
                            <ReactQuill
                                theme="snow"
                                modules={textModules}
                                value={block.body}
                                onChange={(content) => {
                                    // If it's just an empty paragraph, save it as empty string
                                    const value = content === '<p><br></p>' ? '' : content;
                                    updateBlock(block.tempId, { body: value });
                                }}
                                placeholder="Start typing your lesson content..."
                            />
                        </Box>
                    )}

                    {/* --- CHART / TABLE TYPE --- */}
                    {block.contentType === 'chart' && (() => {
                        const tableData: string[][] = JSON.parse(block.body || '[[""]]');

                        const updateCell = (rowIndex: number, colIndex: number, value: string) => {
                            const newData = [...tableData];
                            newData[rowIndex][colIndex] = value;
                            updateBlock(block.tempId, { body: JSON.stringify(newData) });
                        };

                        const addRow = () => {
                            const newRow = new Array(tableData[0].length).fill('');
                            updateBlock(block.tempId, { body: JSON.stringify([...tableData, newRow]) });
                        };

                        const addColumn = () => {
                            const newData = tableData.map(row => [...row, '']);
                            updateBlock(block.tempId, { body: JSON.stringify(newData) });
                        };

                        // Updated functions here
                        const removeRow = (rIdx: number) => {
                            if (tableData.length <= 1) return;
                            const newData = tableData.filter((_, index) => index !== rIdx);
                            updateBlock(block.tempId, { body: JSON.stringify(newData) });
                        };

                        const removeColumn = (cIdx: number) => {
                            if (tableData[0].length <= 1) return;
                            const newData = tableData.map(row => row.filter((_, index) => index !== cIdx));
                            updateBlock(block.tempId, { body: JSON.stringify(newData) });
                        };

                        return (
                            <Box sx={{ mt: 2, overflowX: 'auto' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#6366f1', display: 'flex', alignItems: 'center', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        <Box component="span" sx={{ width: 4, height: 14, bgcolor: '#6366f1', mr: 1, borderRadius: 1 }} />
                                        Lesson Data Grid
                                    </Typography>

                                    {/* Toggle for Edit Mode */}
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                size="small"
                                                checked={isChartEditMode}
                                                onChange={(e) => setIsChartEditMode(e.target.checked)}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#818cf8' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#818cf8' }
                                                }}
                                            />
                                        }
                                        label={<Typography sx={{ fontSize: '0.75rem', color: isChartEditMode ? '#818cf8' : '#64748b', fontWeight: 600 }}>Modify Layout</Typography>}
                                    />
                                </Stack>

                                <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', bgcolor: '#0f172a' }}>
                                    <tbody>
                                        {/* Column Header Actions - Only visible in Edit Mode */}
                                        {isChartEditMode && (
                                            <Box component="tr" sx={{ bgcolor: 'rgba(244, 63, 94, 0.05)' }}>
                                                {tableData[0].map((_, cIdx) => (
                                                    <Box component="td" key={cIdx} sx={{ textAlign: 'center', py: 0.5, borderRight: '1px solid #334155' }}>
                                                        <IconButton size="small" onClick={() => removeColumn(cIdx)} sx={{ color: '#f43f5e' }}>
                                                            <Delete sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                                <Box component="td" />
                                            </Box>
                                        )}

                                        {tableData.map((row, rIdx) => (
                                            <Box component="tr" key={rIdx} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                {row.map((cell, cIdx) => (
                                                    <Box component="td" key={cIdx} sx={{ borderBottom: '1px solid #1e293b', borderRight: '1px solid #1e293b', p: 0 }}>
                                                        <TextField
                                                            fullWidth
                                                            variant="standard"
                                                            value={cell}
                                                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                                                            InputProps={{
                                                                disableUnderline: true,
                                                                sx: {
                                                                    color: rIdx === 0 ? '#818cf8' : '#cbd5e1',
                                                                    fontSize: '0.8rem',
                                                                    px: 2,
                                                                    py: 1,
                                                                    fontWeight: rIdx === 0 ? 800 : 400,
                                                                    '&:focus-within': { bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                ))}

                                                {/* Row Action - Only visible in Edit Mode */}
                                                {isChartEditMode && (
                                                    <Box component="td" sx={{ borderBottom: '1px solid #1e293b', width: 44, textAlign: 'center', bgcolor: 'rgba(244, 63, 94, 0.05)' }}>
                                                        <IconButton size="small" onClick={() => removeRow(rIdx)} sx={{ color: '#f43f5e' }}>
                                                            <Delete sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </tbody>
                                </Box>

                                {/* Footer Actions - Shown only when Layout is being modified */}
                                {isChartEditMode && (
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={addRow}
                                            sx={{ borderColor: '#334155', color: '#818cf8', textTransform: 'none', fontSize: '0.75rem' }}
                                        >
                                            + Add Row
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={addColumn}
                                            sx={{ borderColor: '#334155', color: '#818cf8', textTransform: 'none', fontSize: '0.75rem' }}
                                        >
                                            + Add Column
                                        </Button>
                                    </Stack>
                                )}
                            </Box>
                        );
                    })()}

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
                                    // ... existing TextField props ...
                                    placeholder={block.contentType === 'image' ? "Paste Image URL..." : "Paste Video URL..."}
                                    value={block.body}
                                    onChange={(e) => updateBlock(block.tempId, { body: e.target.value, fileName: undefined })}
                                />
                            ) : (
                                <Button
                                    component="label"
                                // ... existing Button style props ...
                                >
                                    <Stack alignItems="center" spacing={1}>
                                        <CloudUpload fontSize="large" />
                                        <Typography variant="caption">
                                            {block.fileName ? `Selected: ${block.fileName}` : `Click to Upload ${block.contentType}`}
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
                                        <Box
                                            component="img"
                                            src={isSavedFile ? block.body.startsWith('http') ? block.body : `${import.meta.env.VITE_API_URL}${block.body}` : block.body}

                                            sx={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <Box sx={{ aspectRatio: '16/9' }}>
                                            {isBase64 || isSavedFile || block.body.startsWith('blob:') ? (
                                                <video src={block.body} controls width="100%" />
                                            ) : (
                                                <iframe
                                                    width="100%" height="100%"
                                                    src={block.body.includes('youtube.com')
                                                        ? block.body.replace("watch?v=", "embed/").split('&')[0]
                                                        : block.body}
                                                    frameBorder="0" allowFullScreen
                                                />
                                            )}
                                        </Box>
                                    )}

                                    <IconButton
                                        size="small"
                                        onClick={() => updateBlock(block.tempId, { body: '', fileName: undefined })}
                                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {/* --- FILE / DOCUMENT TYPE --- */}
                    {block.contentType === 'file' && (
                        <Stack spacing={2}>
                            <Button
                                component="label"
                                variant="outlined"
                                sx={{
                                    py: 4, border: '2px dashed #334155', borderRadius: 2,
                                    color: 'white', textTransform: 'none',
                                    '&:hover': { border: '2px dashed #6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                }}
                            >
                                <Stack alignItems="center" spacing={1}>
                                    <CloudUpload fontSize="large" sx={{ color: '#6366f1' }} />
                                    <Typography variant="body1" fontWeight={600}>
                                        {block.fileName ? "Change Document" : "Upload Document"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                                        PDF, DOCX, XLSX, etc.
                                    </Typography>
                                </Stack>
                                <input
                                    type="file" hidden
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                    onChange={handleFileChange}
                                />
                            </Button>

                            {block.body && (
                                <Box sx={{ mt: 2 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            bgcolor: '#0f172a',
                                            border: '1px solid rgba(99, 102, 241, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            borderRadius: 2
                                        }}
                                    >
                                        {/* Dynamic Icon Box */}
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: 'flex',
                                            bgcolor: block.fileName?.endsWith('.pdf') ? 'rgba(239, 68, 68, 0.1)' :
                                                block.fileName?.match(/\.(xls|xlsx)$/) ? 'rgba(34, 197, 94, 0.1)' :
                                                    'rgba(99, 102, 241, 0.1)'
                                        }}>
                                            <FilePresentIcon sx={{
                                                color: block.fileName?.endsWith('.pdf') ? '#ef4444' :
                                                    block.fileName?.match(/\.(xls|xlsx)$/) ? '#22c55e' :
                                                        '#6366f1'
                                            }} />
                                        </Box>

                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="subtitle2" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                                                {block.fileName || (isSavedFile ? block.body.split('/').pop() : "Untitled Document")}
                                            </Typography>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
                                                    {block.fileName?.split('.').pop() || 'FILE'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#475569' }}>•</Typography>
                                                <Typography variant="caption" sx={{ color: isBase64 ? '#fbbf24' : '#22c55e' }}>
                                                    {isBase64 ? "Pending Save" : "Saved"}
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <IconButton
                                            size="small"
                                            onClick={() => updateBlock(block.tempId, { body: '', fileName: undefined })}
                                            sx={{
                                                color: '#64748b',
                                                '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' }
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {/* --- TEST TYPE (QUIZ CREATOR) --- */}
                    {block.contentType === 'test' && (
                        <TestBuilder
                            initialData={block.test} // Pass the structured test object
                            onSave={(updatedTest) => {
                                updateBlock(block.tempId, {
                                    test: {
                                        ...updatedTest,
                                        passingGrade: Number(updatedTest.passingGrade || 70)
                                    },
                                    body: ''
                                });
                            }}
                        />
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