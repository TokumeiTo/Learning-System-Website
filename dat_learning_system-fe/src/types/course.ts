export interface Course {
  id: string;
  category: "Japanese" | "IT" | "English" | "Custom"; // Category
  title: string;
  isMandatory: boolean; // Mandatory?
  thumbnail: string; // CourseProfileImage
  description: string;
  certificationImage: string; // Certification
  totalHours: number;
  rating: number; // Rating
  badge: "Beginner" | "Intermediate" | "Advanced"; // Badge
  enrolledCount: number; // Users Count
  status: "Published" | "Draft";
}