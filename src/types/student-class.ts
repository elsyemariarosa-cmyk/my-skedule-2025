export type ClassType = 'reguler' | 'rpl';

export interface StudentClass {
  id: string;
  name: string;
  type: ClassType;
  code: string; // e.g., "Reg-A1", "Reg-B1", "RPL-1"  
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

// Default classes - separate classes for different semesters
export const DEFAULT_STUDENT_CLASSES: StudentClass[] = [
  // Semester 1 Classes
  {
    id: '1',
    name: 'Reguler A1 - Semester 1',
    type: 'reguler',
    code: 'Reg-A1-S1',
    description: 'Kelas Reguler A1 Semester 1',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Reguler B1 - Semester 1',
    type: 'reguler',
    code: 'Reg-B1-S1',
    description: 'Kelas Reguler B1 Semester 1',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 18,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Reguler C1 - Semester 1', 
    type: 'reguler',
    code: 'Reg-C1-S1',
    description: 'Kelas Reguler C1 Semester 1',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 22,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Reguler D1 - Semester 1',
    type: 'reguler',
    code: 'Reg-D1-S1',
    description: 'Kelas Reguler D1 Semester 1',
    academicYearBatch: '2024/2025',
    maxCapacity: 25,
    currentCapacity: 23,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Semester 3 Classes
  {
    id: '4',
    name: 'Reguler A1 - Semester 3',
    type: 'reguler', 
    code: 'Reg-A1-S3',
    description: 'Kelas Reguler A1 Semester 3',
    academicYearBatch: '2023/2024',
    maxCapacity: 25,
    currentCapacity: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Reguler B1 - Semester 3',
    type: 'reguler', 
    code: 'Reg-B1-S3',
    description: 'Kelas Reguler B1 Semester 3',
    academicYearBatch: '2023/2024',
    maxCapacity: 25,
    currentCapacity: 19,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Reguler C1 - Semester 3',
    type: 'reguler', 
    code: 'Reg-C1-S3',
    description: 'Kelas Reguler C1 Semester 3',
    academicYearBatch: '2023/2024',
    maxCapacity: 25,
    currentCapacity: 21,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Reguler D1 - Semester 3',
    type: 'reguler',
    code: 'Reg-D1-S3',
    description: 'Kelas Reguler D1 Semester 3',
    academicYearBatch: '2023/2024',
    maxCapacity: 25,
    currentCapacity: 17,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // RPL Classes
  {
    id: '7',
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
    id: '8',
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
  }
];