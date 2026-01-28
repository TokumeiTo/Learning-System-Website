import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, Typography, Collapse, Paper, List, ListItem, 
  CircularProgress, Alert, Divider 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { MdChevronRight, MdExpandMore, MdBusiness, MdAccountTree, MdGroups, MdHub } from 'react-icons/md';
import { fetchOrgHierarchy } from '../../api/org.api';
import type { OrgUnit } from '../../types/org';

// --- Recursive Node ---
const TreeNode: React.FC<{ node: OrgUnit }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(node.level < 1);
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = (level: number) => {
    switch (level) {
      case 0: return <MdBusiness size={22} color="#1976d2" />; // Division
      case 1: return <MdAccountTree size={20} color="#2e7d32" />; // Department
      case 2: return <MdHub size={18} color="#9c27b0" />; // Section
      default: return <MdGroups size={18} color="#ed6c02" />; // Team
    }
  };

  return (
    <Box sx={{ ml: node.level === 0 ? 0 : 3, mt: 1 }}>
      <Paper
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.02)' }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          cursor: hasChildren ? 'pointer' : 'default',
        }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <Box sx={{ width: 24, display: 'flex', alignItems: 'center' }}>
          {hasChildren && (isOpen ? <MdExpandMore /> : <MdChevronRight />)}
        </Box>
        
        <Box sx={{ mr: 1.5, display: 'flex' }}>{getIcon(node.level)}</Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: node.level === 0 ? 700 : 500 }}>
            {node.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Level {node.level} • ID: {node.id}
          </Typography>
        </Box>
      </Paper>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <Collapse in={isOpen}>
            <Box sx={{ borderLeft: '1px dashed #ccc', ml: 1.5, pl: 0.5 }}>
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
  const { data, isLoading, error } = useQuery({
    queryKey: ['org-hierarchy'],
    queryFn: fetchOrgHierarchy
  });

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error">Failed to load hierarchy data.</Alert>;

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Organization Chart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visual representation of Divisions, Departments, and Teams.
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />

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