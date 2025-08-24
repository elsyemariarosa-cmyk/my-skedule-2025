export type ExecutionStatus = 'scheduled' | 'completed' | 'cancelled' | 'postponed';
export type InstructorAttendance = 'present' | 'absent' | 'substitute';

export interface ScheduleExecution {
  scheduleItemId: string;
  executionDate: string;
  status: ExecutionStatus;
  instructorAttendance: InstructorAttendance;
  actualStartTime?: string;
  actualEndTime?: string;
  attendanceCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringStats {
  totalScheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  postponedSessions: number;
  executionPercentage: number;
  instructorPresentSessions: number;
  instructorAbsentSessions: number;
  instructorSubstituteSessions: number;
  instructorAttendancePercentage: number;
}

export interface InstructorStats {
  instructorName: string;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  substituteSessions: number;
  attendancePercentage: number;
}

export interface ClassStats {
  classId: string;
  className: string;
  totalSessions: number;
  completedSessions: number;
  executionPercentage: number;
}

export interface SemesterStats {
  semester: 1 | 2 | 3 | 4;
  totalSessions: number;
  completedSessions: number;
  executionPercentage: number;
  instructorAttendancePercentage: number;
}

export const getExecutionStatusLabel = (status: ExecutionStatus): string => {
  const labels = {
    scheduled: 'Terjadwal',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    postponed: 'Ditunda'
  };
  return labels[status];
};

export const getInstructorAttendanceLabel = (attendance: InstructorAttendance): string => {
  const labels = {
    present: 'Hadir',
    absent: 'Tidak Hadir',
    substitute: 'Dosen Pengganti'
  };
  return labels[attendance];
};

export const getExecutionStatusColor = (status: ExecutionStatus): string => {
  const colors = {
    scheduled: 'bg-blue-500 text-white',
    completed: 'bg-green-500 text-white',
    cancelled: 'bg-red-500 text-white',
    postponed: 'bg-yellow-500 text-white'
  };
  return colors[status];
};

export const getInstructorAttendanceColor = (attendance: InstructorAttendance): string => {
  const colors = {
    present: 'bg-green-500 text-white',
    absent: 'bg-red-500 text-white',
    substitute: 'bg-orange-500 text-white'
  };
  return colors[attendance];
};