export type ActivityType = 
  | 'kuliah'           // Regular classes
  | 'uts'              // Midterm exams
  | 'uas'              // Final exams
  | 'seminar-proposal' // Proposal seminars
  | 'seminar-hasil'    // Results seminars
  | 'ujian-tesis'      // Thesis exams
  | 'residensi';       // Residency

export interface ScheduleItem {
  id: string;
  title: string;
  type: ActivityType;
  day: 'friday' | 'saturday';
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  semester: 1 | 2 | 3 | 4;
  instructor?: string;
  room?: string;
  description?: string;
  color?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export const ACTIVITY_TYPES: Record<ActivityType, { 
  label: string; 
  color: string; 
  description: string 
}> = {
  'kuliah': {
    label: 'Kuliah',
    color: 'bg-primary text-primary-foreground',
    description: 'Perkuliahan reguler'
  },
  'uts': {
    label: 'UTS',
    color: 'bg-medical text-medical-foreground',
    description: 'Ujian Tengah Semester'
  },
  'uas': {
    label: 'UAS',
    color: 'bg-academic text-academic-foreground',
    description: 'Ujian Akhir Semester'
  },
  'seminar-proposal': {
    label: 'Seminar Proposal',
    color: 'bg-accent text-accent-foreground',
    description: 'Seminar Proposal Tesis'
  },
  'seminar-hasil': {
    label: 'Seminar Hasil',
    color: 'bg-secondary text-secondary-foreground',
    description: 'Seminar Hasil Penelitian'
  },
  'ujian-tesis': {
    label: 'Ujian Tesis',
    color: 'bg-destructive text-destructive-foreground',
    description: 'Ujian Akhir Tesis'
  },
  'residensi': {
    label: 'Residensi',
    color: 'bg-muted text-muted-foreground',
    description: 'Program Residensi'
  }
};

// Time slots for Friday (13:00 - 21:00) and Saturday (08:00 - 18:00)
export const FRIDAY_TIME_SLOTS: TimeSlot[] = [
  { start: '13:00', end: '15:00', label: '13:00 - 15:00' },
  { start: '15:00', end: '17:00', label: '15:00 - 17:00' },
  { start: '17:00', end: '19:00', label: '17:00 - 19:00' },
  { start: '19:00', end: '21:00', label: '19:00 - 21:00' }
];

export const SATURDAY_TIME_SLOTS: TimeSlot[] = [
  { start: '08:00', end: '10:00', label: '08:00 - 10:00' },
  { start: '10:00', end: '12:00', label: '10:00 - 12:00' },
  { start: '12:00', end: '14:00', label: '12:00 - 14:00' },
  { start: '14:00', end: '16:00', label: '14:00 - 16:00' },
  { start: '16:00', end: '18:00', label: '16:00 - 18:00' }
];