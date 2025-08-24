export type ExamType = 'uts' | 'uas';

export interface ExamItem {
  id: string;
  courseCode: string;
  courseName: string;
  examType: ExamType;
  examDate: string;
  examTime: string;
  coordinator: string;
  semester: 1 | 2 | 3 | 4;
  academicYear: string;
  room?: string;
  duration?: number; // in minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getExamTypeLabel = (type: ExamType): string => {
  const labels = {
    uts: 'UTS (Ujian Tengah Semester)',
    uas: 'UAS (Ujian Akhir Semester)'
  };
  return labels[type];
};

export const getExamTypeColor = (type: ExamType): string => {
  const colors = {
    uts: 'bg-blue-500 text-white',
    uas: 'bg-red-500 text-white'
  };
  return colors[type];
};

// Sample data for development
export const SAMPLE_EXAMS: ExamItem[] = [
  {
    id: '1',
    courseCode: 'MARS101',
    courseName: 'Manajemen Strategis RS',
    examType: 'uts',
    examDate: '2024-10-15',
    examTime: '09:00',
    coordinator: 'Dr. Ahmad Susilo, M.Kes',
    semester: 1,
    academicYear: '2024/2025',
    room: 'Ruang 201',
    duration: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    courseCode: 'MARS102',
    courseName: 'Sistem Informasi Manajemen RS',
    examType: 'uas',
    examDate: '2024-12-20',
    examTime: '13:00',
    coordinator: 'Prof. Dr. Siti Rahayu, M.M',
    semester: 1,
    academicYear: '2024/2025',
    room: 'Lab Komputer 1',
    duration: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];