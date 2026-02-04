import React from 'react';
import { Card, Stack, Box, Typography, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { BookmarkBorder, InfoOutlined, VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Props {
  item: any;
  index: number;
}

const ResultCard: React.FC<Props> = ({ item, index }) => {
  // 1. Correctly determine the display word and the reading fallback
  const mainEntry = item.japanese?.[0];
  const displayWord = mainEntry?.word || mainEntry?.reading;
  const secondaryReading = mainEntry?.word ? mainEntry?.reading : null;

  // 2. Safely get alternative forms
  const otherForms = item.japanese?.slice(1) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        mb: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="start">
          <Box>
            <Stack direction="row" spacing={2} alignItems="baseline">
              <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                {displayWord}
              </Typography>
              {secondaryReading && (
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: '1.2rem' }}>
                  {secondaryReading}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5, gap: 1 }}>
              {item.is_common && (
                <Chip label="Common" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, borderRadius: 1.5 }} />
              )}
              {item.jlpt?.map((level: string) => (
                <Chip
                  key={level}
                  label={level.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: 1.5, borderColor: 'primary.light' }}
                />
              ))}
              {otherForms.length > 0 && (
                <Tooltip title={otherForms.map((f: any) => `${f.word || f.reading}`).join(', ')}>
                  <Chip
                    icon={<InfoOutlined style={{ fontSize: '14px' }} />}
                    label={`${otherForms.length} other forms`}
                    size="small"
                    sx={{ borderRadius: 1.5, cursor: 'help' }}
                  />
                </Tooltip>
              )}
            </Stack>
          </Box>
          <Stack direction="row">
            <IconButton color="primary" size="small"><VolumeUp /></IconButton>
            <IconButton size="small"><BookmarkBorder /></IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, opacity: 0.6 }} />

        {item.senses?.map((sense: any, sIdx: number) => (
          <Box key={sIdx} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
            {/* Parts of Speech - Handling long text strings */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {sense.parts_of_speech?.map((pos: string, pIdx: number) => (
                <Typography
                  key={pIdx}
                  variant="caption"
                  sx={{
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    color: 'primary.main',
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    fontWeight: 700,
                    fontSize: '0.65rem'
                  }}
                >
                  {pos}
                </Typography>
              ))}
              {sense.tags?.map((tag: string) => (
                <Typography key={tag} variant="caption" sx={{ color: 'secondary.main', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                  • {tag}
                </Typography>
              ))}
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start' }}>
              <Typography component="span" sx={{ color: 'primary.light', mr: 1.5, fontWeight: 900, minWidth: '20px' }}>
                {sIdx + 1}
              </Typography>
              {sense.english_definitions?.join('; ')}
            </Typography>

            {/* Supplemental Info */}
            {sense.info?.map((info: string, iIdx: number) => (
              <Typography key={iIdx} variant="caption" display="block" sx={{ color: 'text.secondary', mt: 0.5, pl: 4, fontStyle: 'italic' }}>
                Note: {info}
              </Typography>
            ))}
          </Box>
        ))}
      </Card>
    </motion.div>
  );
};

export default ResultCard;