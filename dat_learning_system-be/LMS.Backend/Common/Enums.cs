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
public enum QuizDisplayMode 
{ 
    KanjiReading,   // Input: お「かね」 -> Correct Answer: 金 (Character)
    MeaningMatch,   // Input: 「休みましょう」 -> Correct Answer: 休みましょう (Word)
    GrammarStar,    // Input: ＿ ＿ ★ ＿ -> Correct Answer: parts[2]
    ContextFill,    // Input: 私の部屋は（ ）です -> Correct Answer: アパート (Word)
    SynonymMatch    // Input: 毎晩 -> Correct Answer: 夜はいつも (Meaning)
}