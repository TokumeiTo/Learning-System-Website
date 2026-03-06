import { Card, CardActionArea, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { type Kanji } from "../../types_interfaces/kanji";
import { motion } from "framer-motion";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
  kanji: Kanji;
  onClick: () => void;
};

export default function KanjiCard({ kanji, onClick }: Props) {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the modal when clicking copy
    navigator.clipboard.writeText(kanji.character);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card elevation={3} sx={{ minWidth: 180, position: "relative", overflow: "visible" }}>
        {/* Copy Button - Hidden by default, visible on hover via CSS or just keep it subtle */}
        <Tooltip title="Copy Character">
          <IconButton 
            onClick={handleCopy}
            size="small"
            sx={{ 
              position: "absolute", 
              top: 5, 
              right: 5, 
              zIndex: 2,
              opacity: 0.6,
              "&:hover": { opacity: 1 }
            }}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <CardActionArea onClick={onClick} sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Furigana Romaji */}
            <Typography 
              variant="caption" 
              sx={{ color: "text.secondary", fontSize: 12, mb: -0.5 }}
            >
              {kanji.romaji || <Box sx={{ height: 18 }} />} {/* Placeholder if empty */}
            </Typography>

            {/* Main Character */}
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {kanji.character}
            </Typography>

            {/* Meaning */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {kanji.meaning}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}