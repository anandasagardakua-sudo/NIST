export type Language = 'en' | 'hi' | 'or' | 'te' | 'bn';

export interface Student {
  regNo: string;
  rollNo: string;
  name: string;
  branch: string;
  semester: number;
  section: string;
  cgpa: number;
  attendance: number;
  photo: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  duration: string;
  type: 'Mid-Sem' | 'End-Sem' | 'Practical';
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  matches: { opponent: string; date: string; result?: string; status: 'upcoming' | 'past' }[];
  roster: string[];
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  stipend: string;
  duration: string;
  deadline: string;
  location: string;
  tags: string[];
  isRead: boolean;
  isNotified: boolean;
}

export type View = 'dashboard' | 'ai' | 'exams' | 'sports' | 'internships' | 'settings';
