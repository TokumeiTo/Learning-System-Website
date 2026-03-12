import { Box, Paper, Typography, Button } from '@mui/material';
import {
    Description as FileIcon,
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon,
    Download as DownloadIcon,
    Terminal as RawIcon
} from '@mui/icons-material';

interface FileDownloadCardProps {
    fileUrl: string;
    onDownload: (url: string) => void;
}

const FileDownloadCard = ({ fileUrl, onDownload }: FileDownloadCardProps) => {
    const fileName = fileUrl.split('/').pop() || 'Document';
    const extension = fileName.split('.').pop()?.toLowerCase();

    // Map extensions to Icons and Colors
    const getFileMeta = () => {
        switch (extension) {
            case 'pdf':
                return { icon: <PdfIcon />, color: '#ef4444', label: 'PDF Document' };
            case 'xlsx':
            case 'xls':
            case 'csv':
                return { icon: <ExcelIcon />, color: '#22c55e', label: 'Excel Spreadsheet' };
            case 'docx':
            case 'doc':
                return { icon: <FileIcon />, color: '#3b82f6', label: 'Word Document' };
            default:
                return { icon: <RawIcon />, color: '#64748b', label: 'File' };
        }
    };

    const meta = getFileMeta();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                    borderColor: meta.color,
                }
            }}
        >
            <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: meta.color,
                display: 'flex',
                boxShadow: `0 0 15px ${meta.color}44`,
                // Apply the color to the child icon here
                '& .MuiSvgIcon-root': { color: 'white' }
            }}>
                {meta.icon}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                    {fileName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {meta.label}
                </Typography>
            </Box>

            <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => onDownload(fileUrl)}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: meta.color }
                }}
            >
                Download
            </Button>
        </Paper>
    );
};

export default FileDownloadCard;