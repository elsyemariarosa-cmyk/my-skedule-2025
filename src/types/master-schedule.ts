export type SemesterType = 'ganjil' | 'genap';

export interface AcademicYear {
  id: string;
  year: string; // Format: "2024/2025"
  isActive: boolean;
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