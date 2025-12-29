import PageLayout from "../../components/layout/PageLayout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Mock data for enrolled courses
const enrolledCourses = [
  { id: 1, title: "React Basics", progress: 45 },
  { id: 2, title: "TypeScript Deep Dive", progress: 70 },
  { id: 3, title: "Effective Communication", progress: 20 },
];

export const Dashboard = () => {
  return (
    <PageLayout>
<<<<<<< HEAD
      <div style={{ maxWidth: 900, margin: "50px auto", padding: "0 20px" }}>
=======
<<<<<<< HEAD
      <div style={{ maxWidth: 900, margin: "50px auto" }}>
=======
      <div style={{ maxWidth: 900, margin: "50px auto", padding: "0 20px" }}>
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
        <Typography variant="h4" gutterBottom color="primary">
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="primary">
          Here’s your current learning progress:
        </Typography>

        {/* Flex container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {enrolledCourses.map((course) => (
            <Box
              key={course.id}
              sx={{
                flex: "1 1 calc(33.333% - 16px)", // 3 cards per row with gap
                minWidth: 250, // responsive breakpoint
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ my: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Progress: {course.progress}%
                  </Typography>
                  <Button variant="contained" size="small" sx={{ mt: 1 }}>
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </div>
    </PageLayout>
  );
};
