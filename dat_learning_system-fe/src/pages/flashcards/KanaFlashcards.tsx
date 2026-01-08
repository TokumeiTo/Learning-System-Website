import { Box, Typography, Paper } from "@mui/material";
import KanaCard from "../../components/flashcards/KanaCard";
import { hiraganaList, katakanaList } from "../../mocks/kana.mock";

export default function KanaFlashcards() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Hiragana */}
      <Paper
        elevation={10}
        sx={{
          p: 3,
          maxWidth: 650,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography sx={{ fontSize: { xs: '20px', lg: '30px' }, mb: 2, textAlign: "center" }}>
          Hiragana
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {hiraganaList.map((kana) => (
            <Box
              key={kana.id}
              sx={{
                flex: "1 1 calc(20% - 16px)",
                minWidth: { md: 100, xs: 50 },
              }}
            >
              <KanaCard kana={kana} />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Katakana */}
      <Paper
        elevation={10}
        sx={{
          p: 3,
          maxWidth: 650,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography sx={{ fontSize: { xs: '20px', lg: '30px' }, mb: 2, textAlign: "center" }}>
          Katakana
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {katakanaList.map((kana) => (
            <Box
              key={kana.id}
              sx={{
                flex: "1 1 calc(20% - 16px)",
                minWidth: { md: 100, xs: 50 },
              }}
            >
              <KanaCard kana={kana} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
