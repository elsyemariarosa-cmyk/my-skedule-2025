export type ClassType = 'reguler' | 'rpl';

export interface StudentClass {
  id: string;
  name: string;
  type: ClassType;
  code: string; // e.g., "REG-A", "REG-B", "RPL-1"  
  description: string;
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
    maxCapacity: 25,
    currentCapacity: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'RPL 1',
    type: 'rpl',
    code: 'RPL-1', 
    description: 'Kelas Recognisi Pembelajaran Lampau',
    maxCapacity: 30,
    currentCapacity: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];