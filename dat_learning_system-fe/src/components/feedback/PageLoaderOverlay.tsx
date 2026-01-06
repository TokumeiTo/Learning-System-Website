import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AppLoader from "./AppLoader";

type Props = {
  visible: boolean;
};

export default function PageLoaderOverlay({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              width: "100px",
              height: "100px",
              bgcolor: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppLoader />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
