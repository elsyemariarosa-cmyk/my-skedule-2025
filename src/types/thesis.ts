export type ThesisActivityType = 'seminar-proposal' | 'seminar-hasil' | 'ujian-tesis';
export type ExamMode = 'online' | 'offline';

export interface ThesisActivity {
  id: string;
  activityType: ThesisActivityType;
  studentName: string;
  studentId?: string;
  supervisor1: string;
  supervisor2: string;
  examDate: string;
  examTime: string;
  examLocation: string;
  examMode: ExamMode;
  semester: 1 | 2 | 3 | 4;
  academicYear: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getThesisActivityTypeLabel = (type: ThesisActivityType): string => {
  const labels = {
    'seminar-proposal': 'Seminar Proposal',
    'seminar-hasil': 'Seminar Hasil',
    'ujian-tesis': 'Ujian Tesis'
  };
  return labels[type];
};

export const getThesisActivityTypeColor = (type: ThesisActivityType): string => {
  const colors = {
    'seminar-proposal': 'bg-blue-500 text-white',
    'seminar-hasil': 'bg-orange-500 text-white',
    'ujian-tesis': 'bg-red-500 text-white'
  };
  return colors[type];
};

export const getExamModeLabel = (mode: ExamMode): string => {
  const labels = {
    online: 'Online',
    offline: 'Offline'
  };
  return labels[mode];
};

export const getExamModeColor = (mode: ExamMode): string => {
  const colors = {
    online: 'bg-green-500 text-white',
    offline: 'bg-gray-500 text-white'
  };
  return colors[mode];
};

// Sample data for development
export const SAMPLE_THESIS_ACTIVITIES: ThesisActivity[] = [
  {
    id: '1',
    activityType: 'seminar-proposal',
    studentName: 'Ahmad Fauzi',
    studentId: '20210001',
    supervisor1: 'Dr. Ahmad Susilo, M.Kes',
    supervisor2: 'Prof. Dr. Siti Rahayu, M.M',
    examDate: '2024-11-15',
    examTime: '09:00',
    examLocation: 'Ruang Seminar 1',
    examMode: 'offline',
    semester: 3,
    academicYear: '2024/2025',
    notes: 'Seminar proposal tentang Manajemen Kualitas RS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    activityType: 'seminar-hasil',
    studentName: 'Siti Nurhaliza',
    studentId: '20200002',
    supervisor1: 'Prof. Dr. Budi Santoso, M.Kes',
    supervisor2: 'Dr. Maya Indira, M.M',
    examDate: '2024-12-10',
    examTime: '14:00',
    examLocation: 'Via Zoom Meeting',
    examMode: 'online',
    semester: 4,
    academicYear: '2024/2025',
    notes: 'Seminar hasil penelitian tentang Sistem Informasi RS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    activityType: 'ujian-tesis',
    studentName: 'Budi Hermawan',
    studentId: '20190003',
    supervisor1: 'Dr. Ahmad Susilo, M.Kes',
    supervisor2: 'Dr. Retno Astuti, M.M',
    examDate: '2024-12-20',
    examTime: '10:00',
    examLocation: 'Ruang Sidang Utama',
    examMode: 'offline',
    semester: 4,
    academicYear: '2024/2025',
    notes: 'Ujian tesis dengan judul: Analisis Efektivitas Manajemen SDM RS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];