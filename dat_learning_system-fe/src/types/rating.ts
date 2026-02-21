/**
 * Data required to submit a new rating or update an existing one.
 * Matches the 'SubmitRatingDto' in our C# backend.
 */
export interface SubmitRatingDto {
    score: number;      // 1-5 stars
    comment?: string;   // Optional feedback
}

/**
 * Standard response for rating operations.
 */
export interface RatingResponse {
    message: string;
}

/**
 * If you decide to fetch a list of reviews for a course later,
 * you can use this structure.
 */
export interface CourseReview {
    id: string;
    userName: string;
    score: number;
    comment?: string;
    createdAt: string;
}