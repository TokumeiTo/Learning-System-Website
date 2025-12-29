import { Box } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

type CalendarViewProps = {
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
};

export default function CalendarView({
    value,
    onChange,
}: CalendarViewProps) {
    return (
        <Box
            sx={{
                borderRadius: 2,
                boxShadow: 5,
                bgcolor: "background.paper",
                width: '480px',
                minHeight: '480px',
            }}
        >
            <DateCalendar
                value={value}
                onChange={onChange}
                sx={{
                    transform: "scale(1.5)",      // 1.5 = 150% bigger
                    transformOrigin: "top",
                }}
            />
        </Box>
    );
}
