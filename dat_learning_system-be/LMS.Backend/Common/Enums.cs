namespace LMS.Backend.Common;

public enum Position
{
    SuperAdmin,
    DivHead,
    DepHead,
    SecHead,
    ProjectManager,
    Employee,
    Admin,
    Auditor
}

public enum OrgLevel
{
    Division,
    Department,
    Section,
    Team
}
public enum CourseStatus { Published, Draft, Closed }
public enum CourseBadge { Beginner, Intermediate, Advanced }