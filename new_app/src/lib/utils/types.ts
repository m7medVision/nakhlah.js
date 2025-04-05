// Course types for the SvelteKit implementation
export interface Course {
  slug: string;
  title: string;
  content: string;
  snippet: string;
  order: number;
}

export interface CourseGroup {
  courses: Course[];
  order: number;
  label: string;
  lableSlug: string;
}

export interface CourseAttributes {
  title: string;
  snippet: string;
  order: number;
}

export interface Student {
  sessionId: string;
  completedCourses: string[];
}

export interface Result {
  ok: boolean;
}