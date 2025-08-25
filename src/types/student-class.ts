export type ClassType = 'reguler' | 'rpl';

export interface StudentClass {
  id: string;
  name: string;
  type: ClassType;
  code: string; // e.g., "REG-A", "REG-B", "RPL-1"  
  description: string;
  academicYearBatch: string; // e.g., "2024/2025"
  maxCapacity?: number;
  currentCapacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTypeConfig {
  label: string;
  description: string;
  color: string;
  defaultPrefix: string;
}

export const CLASS_TYPE_CONFIG: Record<ClassType, ClassTypeConfig> = {
  reguler: {
    label: 'Kelas Reguler',
    description: 'Mahasiswa program reguler',
    color: 'bg-primary text-primary-foreground',
    defaultPrefix: 'REG'
  },
  rpl: {
    label: 'Kelas RPL',
    description: 'Recognisi Pembelajaran Lampau',
    color: 'bg-academic text-academic-foreground', 
    defaultPrefix: 'RPL'
  }
};

export const getClassTypeLabel = (type: ClassType): string => {
  return CLASS_TYPE_CONFIG[type].label;
};

export const getClassTypeColor = (type: ClassType): string => {
  return CLASS_TYPE_CONFIG[type].color;
};

// Default classes - can be customized by users
export const DEFAULT_STUDENT_CLASSES: StudentClass[] = [
  {
    id: '1',
    name: 'Reguler A',
    type: 'reguler',
    code: 'REG-A',
    description: 'Kelas Reguler A',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Reguler B',
    type: 'reguler',
    code: 'REG-B',
    description: 'Kelas Reguler B',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 18,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Reguler C', 
    type: 'reguler',
    code: 'REG-C',
    description: 'Kelas Reguler C',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 22,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Reguler D',
    type: 'reguler', 
    code: 'REG-D',
    description: 'Kelas Reguler D',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Reguler E',
    type: 'reguler', 
    code: 'REG-E',
    description: 'Kelas Reguler E',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 19,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Reguler F',
    type: 'reguler', 
    code: 'REG-F',
    description: 'Kelas Reguler F',
    academicYearBatch: '2025/2026',
    maxCapacity: 25,
    currentCapacity: 21,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Reguler G',
    type: 'reguler', 
    code: 'REG-G',
    description: 'Kelas Reguler G',
    academicYearBatch: '2025/2026',
    maxCapacity: 25,
    currentCapacity: 17,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Reguler H',
    type: 'reguler', 
    code: 'REG-H',
    description: 'Kelas Reguler H',
    academicYearBatch: '2025/2026',
    maxCapacity: 25,
    currentCapacity: 23,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'RPL 1',
    type: 'rpl',
    code: 'RPL-1', 
    description: 'Kelas Recognisi Pembelajaran Lampau 1',
    academicYearBatch: '2024/2025',
    maxCapacity: 30,
    currentCapacity: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'RPL 2',
    type: 'rpl',
    code: 'RPL-2', 
    description: 'Kelas Recognisi Pembelajaran Lampau 2',
    academicYearBatch: '2024/2025',
    maxCapacity: 30,
    currentCapacity: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'RPL 3',
    type: 'rpl',
    code: 'RPL-3', 
    description: 'Kelas Recognisi Pembelajaran Lampau 3',
    academicYearBatch: '2025/2026',
    maxCapacity: 30,
    currentCapacity: 18,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];