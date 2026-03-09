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
public enum JLPTLevel { N5, N4, N3, N2, N1 }

public enum QuizSourceType 
{ 
    Onomatopoeia, 
    Kanji, 
    Grammar, 
    Vocabulary 
}