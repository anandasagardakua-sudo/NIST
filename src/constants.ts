import { Exam, Internship, Sport, Student } from './types';

export const MOCK_STUDENT: Student = {
  regNo: '2201234',
  rollNo: '22CSE042',
  name: 'Adrishika Parida',
  branch: 'Computer Science & Engineering',
  semester: 6,
  section: 'A',
  cgpa: 8.92,
  attendance: 72, // Below 75% to show warning
  photo: 'https://picsum.photos/seed/student/200/200',
};

export const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    subject: 'Artificial Intelligence',
    date: '2026-03-25',
    time: '10:00 AM',
    venue: 'Gallery 1',
    duration: '3 Hours',
    type: 'End-Sem',
  },
  {
    id: '2',
    subject: 'Compiler Design',
    date: '2026-03-27',
    time: '02:00 PM',
    venue: 'Gallery 3',
    duration: '3 Hours',
    type: 'End-Sem',
  },
  {
    id: '3',
    subject: 'Cloud Computing',
    date: '2026-03-20', // Tomorrow relative to Mar 19
    time: '10:00 AM',
    venue: 'Lab 5',
    duration: '2 Hours',
    type: 'Practical',
  },
  {
    id: '4',
    subject: 'Machine Learning',
    date: '2026-03-19', // Today
    time: '02:00 PM',
    venue: 'Gallery 2',
    duration: '3 Hours',
    type: 'End-Sem',
  },
];

export const MOCK_SPORTS: Sport[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    matches: [
      { opponent: 'VSSUT Burla', date: '2026-04-05', status: 'upcoming' },
      { opponent: 'KIIT University', date: '2026-03-10', result: 'Won by 4 wickets', status: 'past' },
    ],
    roster: ['Rahul S.', 'Amit K.', 'Vikram M.', 'Suresh P.'],
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    matches: [
      { opponent: 'OUTR Bhubaneswar', date: '2026-04-12', status: 'upcoming' },
    ],
    roster: ['John D.', 'Sam K.', 'Leo M.'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    matches: [],
    roster: [],
  },
];

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineering Intern',
    stipend: '₹80,000/mo',
    duration: '3 Months',
    deadline: '2026-04-01',
    location: 'Bangalore / Remote',
    tags: ['CSE', 'Remote', 'High Stipend'],
    isRead: false,
    isNotified: false,
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'Product Management Intern',
    stipend: '₹75,000/mo',
    duration: '2 Months',
    deadline: '2026-03-25',
    location: 'Hyderabad',
    tags: ['All-branches', 'On-site'],
    isRead: true,
    isNotified: false,
  },
  {
    id: '3',
    company: 'Tesla',
    role: 'Hardware Engineering Intern',
    stipend: '$5,000/mo',
    duration: '6 Months',
    deadline: '2026-05-15',
    location: 'Palo Alto (Hybrid)',
    tags: ['ECE', 'Hybrid'],
    isRead: false,
    isNotified: true,
  },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
];
