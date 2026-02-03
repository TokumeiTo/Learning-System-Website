import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    Box, Typography, Collapse, Paper, List, ListItem, 
    CircularProgress, Alert, Divider, useTheme 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { MdChevronRight, MdExpandMore, MdBusiness, MdAccountTree, MdGroups, MdHub } from 'react-icons/md';
import { fetchOrgHierarchy } from '../../api/org.api';
import type { OrgUnit } from '../../types/org';

// --- Recursive Node ---
const TreeNode: React.FC<{ node: OrgUnit }> = ({ node }) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(node.level < 1);
    const hasChildren = node.children && node.children.length > 0;

    const getIcon = (level: number) => {
        switch (level) {
            case 0: return <MdBusiness size={22} color={theme.palette.primary.main} />; // Division
            case 1: return <MdAccountTree size={20} color={theme.palette.success.main} />; // Department
            case 2: return <MdHub size={18} color={theme.palette.secondary.main} />; // Section
            default: return <MdGroups size={18} color={theme.palette.warning.main} />; // Team
        }
    };

    return (
        <Box sx={{ ml: node.level === 0 ? 0 : 3, mt: 1 }}>
            <Paper
                elevation={0}
                component={motion.div}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ 
                    scale: 1.005, 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' 
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3, // Increased to match the dashboard style
                    cursor: hasChildren ? 'pointer' : 'default',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                    }
                }}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                <Box sx={{ width: 24, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    {hasChildren && (isOpen ? <MdExpandMore size={20} /> : <MdChevronRight size={20} />)}
                </Box>
                
                <Box sx={{ mr: 1.5, display: 'flex' }}>{getIcon(node.level)}</Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {node.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Level {node.level} • ID: {node.id}
                    </Typography>
                </Box>
            </Paper>

            <AnimatePresence>
                {hasChildren && isOpen && (
                    <Collapse in={isOpen}>
                        <Box sx={{ 
                            borderLeft: `1px dashed ${theme.palette.divider}`, 
                            ml: 1.5, 
                            pl: 0.5,
                            mt: 0.5
                        }}>
                            {node.children.map((child) => (
                                <TreeNode key={child.id} node={child} />
                            ))}
                        </Box>
                    </Collapse>
                )}
            </AnimatePresence>
        </Box>
    );
};

// --- Main Hierarchy View ---
export const OrgUnitHierarchy: React.FC = () => {
    const theme = useTheme();
    const { data, isLoading, error } = useQuery({
        queryKey: ['org-hierarchy'],
        queryFn: fetchOrgHierarchy
    });

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 10 }}>
            <CircularProgress size={32} />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Failed to load hierarchy data. Please check your connection.
        </Alert>
    );

    return (
        <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
            {/* Note: I removed the duplicate Title/Typography here because the parent OrgPage 
                already provides the page title. This keeps the component modular. */}
            
            <List disablePadding>
                {data?.map((rootNode) => (
                    <ListItem key={rootNode.id} disablePadding sx={{ display: 'block', mb: 2 }}>
                        <TreeNode node={rootNode} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};