import { Box, Typography, Card } from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import PageLayout from "../../components/layout/PageLayout";
import CalendarView from "../../components/calendar/CalendarView";

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    return (
        <PageLayout>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: 'wrap',
                    padding: 2,
                    gap: 3,
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                {/* Left: Calendar */}
                <Box>
                    <CalendarView
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                </Box>

                {/* Right: Event list */}
                <Box>
                    <Card elevation={5} sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Events on{" "}
                            {selectedDate
                                ? selectedDate.format("YYYY-MM-DD")
                                : "—"}
                        </Typography>

                        <Typography color="text.secondary">
                            No events yet.
                        </Typography>
                    </Card>
                </Box>
            </Box>
        </PageLayout>
    );
}
