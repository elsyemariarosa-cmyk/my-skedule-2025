import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, User, MapPin } from "lucide-react";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { id } from "date-fns/locale";
import { ScheduleItem, ActivityTypeConfig } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { SemesterType, SEMESTER_MAPPING } from "@/types/master-schedule";
import { ScheduleExecution, getExecutionStatusLabel, getExecutionStatusColor, getInstructorAttendanceLabel, getInstructorAttendanceColor } from "@/types/monitoring";

interface MonitoringCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleItems: ScheduleItem[];
  activityTypes: Record<string, ActivityTypeConfig>;
  studentClasses: StudentClass[];
  selectedSemesterType: SemesterType;
  selectedAcademicYear: string;
}

// Sample execution data generator
const generateSampleExecutions = (scheduleItems: ScheduleItem[]): ScheduleExecution[] => {
  const executions: ScheduleExecution[] = [];
  const statuses = ['completed', 'scheduled', 'cancelled', 'postponed'] as const;
  const attendances = ['present', 'absent', 'substitute'] as const;
  
  scheduleItems.forEach((item) => {
    // Generate executions for each week in the current month
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Find matching days for all days of the week in the month
    const matchingDays = daysInMonth.filter(date => {
      const dayName = format(date, 'EEEE').toLowerCase();
      const dayMapping = {
        'monday': 'monday',
        'tuesday': 'tuesday', 
        'wednesday': 'wednesday',
        'thursday': 'thursday',
        'friday': 'friday',
        'saturday': 'saturday',
        'sunday': 'sunday'
      };
      return dayMapping[dayName as keyof typeof dayMapping] === item.day;
    });
    
    matchingDays.forEach((date, index) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const attendance = status === 'completed' ? 
        attendances[Math.floor(Math.random() * attendances.length)] : 
        'present';
      
      executions.push({
        scheduleItemId: item.id,
        executionDate: date.toISOString(),
        status,
        instructorAttendance: attendance,
        actualStartTime: status === 'completed' ? item.startTime : undefined,
        actualEndTime: status === 'completed' ? item.endTime : undefined,
        attendanceCount: status === 'completed' ? Math.floor(Math.random() * 25) + 10 : undefined,
        notes: status === 'cancelled' ? 'Libur nasional' : status === 'postponed' ? 'Dijadwal ulang' : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  });
  
  return executions;
};

export function MonitoringCalendar({
  isOpen,
  onClose,
  scheduleItems,
  activityTypes,
  studentClasses,
  selectedSemesterType,
  selectedAcademicYear
}: MonitoringCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'detail'>('calendar');

  // Filter schedule items based on selected semester type
  const filteredScheduleItems = useMemo(() => {
    const allowedSemesters = SEMESTER_MAPPING[selectedSemesterType];
    return scheduleItems.filter(item => {
      if (selectedSemesterFilter === 'all') {
        return allowedSemesters.includes(item.semester);
      }
      return item.semester === parseInt(selectedSemesterFilter);
    });
  }, [scheduleItems, selectedSemesterType, selectedSemesterFilter]);

  const executions = useMemo(() => generateSampleExecutions(filteredScheduleItems), [filteredScheduleItems]);

  // Get executions for a specific date
  const getExecutionsForDate = (date: Date) => {
    return executions.filter(execution => 
      isSameDay(parseISO(execution.executionDate), date)
    ).map(execution => {
      const scheduleItem = filteredScheduleItems.find(item => item.id === execution.scheduleItemId);
      return {
        ...execution,
        scheduleItem
      };
    });
  };

  // Get executions for selected date
  const selectedDateExecutions = getExecutionsForDate(selectedDate);

  // Custom day content for calendar
  const dayContent = (date: Date) => {
    const dayExecutions = getExecutionsForDate(date);
    if (dayExecutions.length === 0) return null;
    
    const statusCounts = dayExecutions.reduce((acc, exec) => {
      acc[exec.status] = (acc[exec.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
        <div className="text-xs font-medium">{format(date, 'd')}</div>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`w-1.5 h-1.5 rounded-full ${getExecutionStatusColor(status as any).split(' ')[0]}`}
              title={`${getExecutionStatusLabel(status as any)}: ${count}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Kalender Monitoring dan Evaluasi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter Semester:</span>
                <Select value={selectedSemesterFilter} onValueChange={setSelectedSemesterFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {SEMESTER_MAPPING[selectedSemesterType].map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-sm">
                Tahun Akademik: {selectedAcademicYear}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Kalender
              </Button>
              <Button
                variant={viewMode === 'detail' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detail')}
              >
                Detail
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Kalender Pelaksanaan</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-medium">
                        {format(selectedDate, 'MMMM yyyy', { locale: id })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={selectedDate}
                    onMonthChange={setSelectedDate}
                    className="w-full"
                    components={{
                      Day: ({ date, ...props }) => (
                        <div className="relative w-full h-full">
                          <button {...props} className="relative w-full h-full p-2 hover:bg-accent rounded-md">
                            {dayContent(date)}
                          </button>
                        </div>
                      )
                    }}
                  />
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Keterangan Status:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <span>Selesai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span>Terjadwal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span>Dibatalkan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                        <span>Ditunda</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Detail {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateExecutions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Tidak ada jadwal pada tanggal ini
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateExecutions.map((execution, index) => {
                        const { scheduleItem } = execution;
                        if (!scheduleItem) return null;
                        
                        const activityType = activityTypes[scheduleItem.type];
                        const studentClass = studentClasses.find(c => scheduleItem.classIds?.includes(c.id));
                        
                        return (
                          <div key={index} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{scheduleItem.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {activityType?.label}
                                </p>
                              </div>
                              <Badge className={getExecutionStatusColor(execution.status)}>
                                {getExecutionStatusLabel(execution.status)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{scheduleItem.startTime} - {scheduleItem.endTime}</span>
                              </div>
                              
                              {scheduleItem.instructor && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>{scheduleItem.instructor}</span>
                                  {execution.status === 'completed' && (
                                    <Badge 
                                      className={getInstructorAttendanceColor(execution.instructorAttendance)}
                                    >
                                      {getInstructorAttendanceLabel(execution.instructorAttendance)}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              {scheduleItem.room && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{scheduleItem.room}</span>
                                </div>
                              )}
                              
                              {studentClass && (
                                <div className="text-xs text-muted-foreground">
                                  Kelas: {studentClass.name}
                                </div>
                              )}
                              
                              {execution.attendanceCount && (
                                <div className="text-xs text-muted-foreground">
                                  Kehadiran: {execution.attendanceCount} mahasiswa
                                </div>
                              )}
                              
                              {execution.notes && (
                                <div className="text-xs bg-muted p-2 rounded">
                                  <strong>Catatan:</strong> {execution.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Summary for selected date */}
              {selectedDateExecutions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ringkasan Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Sesi:</span>
                        <span className="font-medium">{selectedDateExecutions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Selesai:</span>
                        <span className="font-medium text-green-600">
                          {selectedDateExecutions.filter(e => e.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dibatalkan:</span>
                        <span className="font-medium text-red-600">
                          {selectedDateExecutions.filter(e => e.status === 'cancelled').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ditunda:</span>
                        <span className="font-medium text-yellow-600">
                          {selectedDateExecutions.filter(e => e.status === 'postponed').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}