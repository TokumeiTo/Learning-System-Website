import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, Box } from '@mui/material';
import { 
    AssignmentOutlined as AssignmentIcon, 
    InsertDriveFileOutlined as FileIcon, 
    CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import type { ClassworkItem } from '../../types_interfaces/classwork';

interface Props {
    items: ClassworkItem[];
    isEditMode: boolean;
    onSelect: (item: ClassworkItem) => void; // New prop for modal interaction
}

const ClassworkItemList = ({ items, isEditMode, onSelect }: Props) => {
    
    /**
     * Renders the status of an assignment (Graded, Submitted, or Missing).
     * Resources do not show a status badge.
     */
    const getStatusBadge = (item: ClassworkItem) => {
        if (item.itemType === 'Resource') return null;

        const submission = item.mySubmission;

        // 1. Graded Status
        if (submission?.grade !== null && submission?.grade !== undefined) {
            return (
                <Chip 
                    label={`${submission.grade}/${item.maxPoints}`} 
                    size="small" 
                    sx={{ 
                        bgcolor: 'rgba(74, 222, 128, 0.1)', 
                        color: '#4ade80', 
                        fontWeight: 800, 
                        fontSize: '0.65rem',
                        border: '1px solid rgba(74, 222, 128, 0.2)'
                    }} 
                />
            );
        }

        // 2. Turned In Status
        if (submission) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700 }}>Turned in</Typography>
                    <CheckCircleIcon sx={{ fontSize: 14, color: '#818cf8' }} />
                </Box>
            );
        }

        // 3. Missing Status
        return (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                Missing
            </Typography>
        );
    };

    return (
        <List sx={{ py: 0 }}>
            {items.map((item) => (
                <ListItem 
                    key={item.id} 
                    disablePadding 
                    sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                    <ListItemButton 
                        onClick={() => onSelect(item)}
                        sx={{ 
                            py: 1.5, 
                            px: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'rgba(129, 140, 248, 0.04)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.itemType === 'Assignment' ? (
                                <AssignmentIcon sx={{ color: '#fbbf24', fontSize: 18 }} />
                            ) : (
                                <FileIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
                            )}
                        </ListItemIcon>
                        
                        <ListItemText
                            primary={
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'rgba(255,255,255,0.9)', 
                                        fontWeight: 500, 
                                        fontSize: '0.825rem',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            }
                            secondary={
                                item.dueDate && (
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>
                                        Due: {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </Typography>
                                )
                            }
                        />

                        <Box sx={{ ml: 1 }}>
                            {getStatusBadge(item)}
                        </Box>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default ClassworkItemList;