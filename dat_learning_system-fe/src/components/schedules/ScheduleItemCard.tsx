import { Card, Chip, Typography, Stack } from "@mui/material";
import type { ScheduleItem } from "../../types/schedule";

type Props = {
  item: ScheduleItem;
};

export default function ScheduleItemCard({ item }: Props) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} mb={1}>
        <Chip label={item.level} color="primary" size="small" />
        <Chip label={item.category} size="small" />
        <Chip
          label={item.type}
          size="small"
          color={item.completed ? "success" : "default"}
        />
      </Stack>

      <Typography variant="h6">{item.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        Status: {item.completed ? "Completed" : "Pending"}
      </Typography>
    </Card>
  );
}
