// Activity types are now dynamic and managed by the user
export type ActivityType = string;

export interface ScheduleItem {
  id: string;
  title: string;
  type: ActivityType;
  day: 'friday' | 'saturday';
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
  'workshop': {
    label: 'Workshop',
    color: 'bg-purple-700 text-purple-50',
    description: 'Workshop dan pelatihan khusus'
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
  'diskusi-panel': {
    label: 'Diskusi Panel',
    color: 'bg-indigo-800 text-indigo-50',
    description: 'Panel diskusi dengan praktisi dan ahli'
  },
  'evaluasi-kinerja': {
    label: 'Evaluasi Kinerja',
    color: 'bg-violet-700 text-violet-50',
    description: 'Evaluasi dan penilaian kinerja mahasiswa'
  },
  'seminar-khusus': {
    label: 'Seminar Khusus',
    color: 'bg-violet-800 text-violet-50',
    description: 'Seminar dengan topik khusus dan terkini'
  },
  'praktikum': {
    label: 'Praktikum',
    color: 'bg-fuchsia-700 text-fuchsia-50',
    description: 'Kegiatan praktikum dan simulasi'
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