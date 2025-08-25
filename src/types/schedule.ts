// Activity types are now dynamic and managed by the user
export type ActivityType = string;

export interface ScheduleItem {
  id: string;
  title: string;
  type: ActivityType;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  semester: 1 | 2 | 3 | 4;
  instructor?: string;
  substituteInstructor?: string;
  room?: string;
  description?: string;
  color?: string;
  classIds?: string[]; // Array of student class IDs
  // Residency-specific fields
  residencyStartDate?: string;
  residencyEndDate?: string;
  residencyCountry?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export interface ActivityTypeConfig {
  label: string;
  color: string;
  description: string;
}

// Default activity types - can be customized by users
export const DEFAULT_ACTIVITY_TYPES: Record<string, ActivityTypeConfig> = {
  'kuliah-tatap-muka': {
    label: 'Kuliah Tatap Muka',
    color: 'bg-red-700 text-red-50',
    description: 'Perkuliahan tatap muka reguler'
  },
  'tutorial': {
    label: 'Diskusi Kelompok Kecil (Tutorial)',
    color: 'bg-rose-700 text-rose-50',
    description: 'Diskusi kelompok kecil dan tutorial'
  },
  'skill-lab': {
    label: 'Skill Lab',
    color: 'bg-pink-700 text-pink-50',
    description: 'Laboratorium keterampilan praktis'
  },
  'fst': {
    label: 'Field Site Teaching (FST)',
    color: 'bg-red-800 text-red-50',
    description: 'Pengajaran di lokasi lapangan'
  },
  'project-learning': {
    label: 'Project Learning',
    color: 'bg-rose-800 text-rose-50',
    description: 'Pembelajaran berbasis proyek'
  },
  'tambahan': {
    label: 'Tambahan',
    color: 'bg-pink-800 text-pink-50',
    description: 'Kegiatan pembelajaran tambahan'
  },
  'uts': {
    label: 'UTS',
    color: 'bg-red-900 text-red-50',
    description: 'Ujian Tengah Semester'
  },
  'uas': {
    label: 'UAS',
    color: 'bg-rose-900 text-rose-50',
    description: 'Ujian Akhir Semester'
  },
  'seminar-proposal': {
    label: 'Seminar Proposal',
    color: 'bg-pink-900 text-pink-50',
    description: 'Seminar Proposal Tesis'
  },
  'seminar-hasil': {
    label: 'Seminar Hasil',
    color: 'bg-red-600 text-red-50',
    description: 'Seminar Hasil Penelitian'
  },
  'ujian-tesis': {
    label: 'Ujian Tesis',
    color: 'bg-rose-600 text-rose-50',
    description: 'Ujian Akhir Tesis'
  },
  'residensi': {
    label: 'Residensi',
    color: 'bg-pink-600 text-pink-50',
    description: 'Program Residensi'
  },
  'kunjungan-lapangan': {
    label: 'Kunjungan Lapangan',
    color: 'bg-purple-800 text-purple-50',
    description: 'Kunjungan ke rumah sakit dan fasilitas kesehatan'
  },
  'presentasi-kasus': {
    label: 'Presentasi Kasus',
    color: 'bg-indigo-700 text-indigo-50',
    description: 'Presentasi dan diskusi kasus manajemen RS'
  },
  'evaluasi-kinerja': {
    label: 'Evaluasi Kinerja',
    color: 'bg-violet-700 text-violet-50',
    description: 'Evaluasi dan penilaian kinerja mahasiswa'
  },
};

// Predefined time slots for all days of the week
export const MONDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

export const TUESDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

export const WEDNESDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

export const THURSDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

export const FRIDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "13:00", end: "14:40", label: "13:00 - 14:40" },
  { start: "14:50", end: "16:30", label: "14:50 - 16:30" },
  { start: "16:40", end: "18:20", label: "16:40 - 18:20" },
  { start: "19:00", end: "20:40", label: "19:00 - 20:40" }
];

export const SATURDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

export const SUNDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:40", label: "08:00 - 09:40" },
  { start: "09:50", end: "11:30", label: "09:50 - 11:30" },
  { start: "12:30", end: "14:10", label: "12:30 - 14:10" },
  { start: "14:20", end: "16:00", label: "14:20 - 16:00" },
  { start: "16:10", end: "17:50", label: "16:10 - 17:50" }
];

// Map days to their time slots
export const DAY_TIME_SLOTS = {
  monday: MONDAY_TIME_SLOTS,
  tuesday: TUESDAY_TIME_SLOTS,
  wednesday: WEDNESDAY_TIME_SLOTS,
  thursday: THURSDAY_TIME_SLOTS,
  friday: FRIDAY_TIME_SLOTS,
  saturday: SATURDAY_TIME_SLOTS,
  sunday: SUNDAY_TIME_SLOTS
} as const;

// Day labels in Indonesian
export const DAY_LABELS = {
  monday: 'Senin',
  tuesday: 'Selasa', 
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu'
} as const;