export type SemesterType = 'ganjil' | 'genap';

export interface AcademicYear {
  id: string;
  year: string; // Format: "2024/2025"
  isActive: boolean;
}

export interface DailySession {
  sessionNumber: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface AcademicActivity {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYear: string;
  semesterType: SemesterType;
  isActive: boolean;
  // New fields for daily sessions
  hasWeekendSessions?: boolean; // Friday or Saturday activities
  dailySessions?: DailySession[];
  activeDays?: ('friday' | 'saturday')[];
  createdAt: string;
  updatedAt: string;
}

export interface MasterSchedule {
  id: string;
  academicYear: string;
  semesterType: SemesterType;
  semester: 1 | 2 | 3 | 4;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const SEMESTER_MAPPING = {
  ganjil: [1, 3] as (1 | 2 | 3 | 4)[],
  genap: [2, 4] as (1 | 2 | 3 | 4)[]
} as const;

export const getSemesterType = (semester: 1 | 2 | 3 | 4): SemesterType => {
  return [1, 3].includes(semester) ? 'ganjil' : 'genap';
};

export const getSemesterLabel = (semesterType: SemesterType): string => {
  return semesterType === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap';
};

export const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based to 1-based
  
  // Academic year starts in July (month 7)
  if (currentMonth >= 7) {
    return `${currentYear}/${currentYear + 1}`;
  } else {
    return `${currentYear - 1}/${currentYear}`;
  }
};

export const getCurrentSemesterType = (): SemesterType => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 0-based to 1-based
  
  // Semester Ganjil: July - December (7-12)
  // Semester Genap: January - June (1-6)
  return currentMonth >= 7 ? 'ganjil' : 'genap';
};

// Default weekend sessions (3 sessions x 150 minutes each)
export const DEFAULT_WEEKEND_SESSIONS: DailySession[] = [
  { sessionNumber: 1, startTime: "13:00", endTime: "15:30", duration: 150 },
  { sessionNumber: 2, startTime: "15:40", endTime: "18:10", duration: 150 },
  { sessionNumber: 3, startTime: "19:00", endTime: "21:30", duration: 150 }
];

export const SATURDAY_SESSIONS: DailySession[] = [
  { sessionNumber: 1, startTime: "08:00", endTime: "10:30", duration: 150 },
  { sessionNumber: 2, startTime: "10:40", endTime: "13:10", duration: 150 },
  { sessionNumber: 3, startTime: "13:20", endTime: "15:50", duration: 150 }
];