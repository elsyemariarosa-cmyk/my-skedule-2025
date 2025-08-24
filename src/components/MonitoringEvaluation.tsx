import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart3, PieChart as PieChartIcon, Users, BookOpen, Calendar, UserCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { ScheduleItem, ActivityTypeConfig } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { SemesterType, SEMESTER_MAPPING } from "@/types/master-schedule";
import { ScheduleExecution, MonitoringStats, InstructorStats, ClassStats, SemesterStats, getExecutionStatusLabel, getInstructorAttendanceLabel } from "@/types/monitoring";

interface MonitoringEvaluationProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleItems: ScheduleItem[];
  activityTypes: Record<string, ActivityTypeConfig>;
  studentClasses: StudentClass[];
  selectedSemesterType: SemesterType;
  selectedAcademicYear: string;
}

// Sample execution data - in real app this would come from backend
const generateSampleExecutions = (scheduleItems: ScheduleItem[]): ScheduleExecution[] => {
  const executions: ScheduleExecution[] = [];
  const statuses = ['completed', 'scheduled', 'cancelled', 'postponed'] as const;
  const attendances = ['present', 'absent', 'substitute'] as const;
  
  scheduleItems.forEach((item, index) => {
    // Generate multiple executions per schedule item (simulating weekly sessions)
    for (let week = 1; week <= 8; week++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const attendance = status === 'completed' ? 
        attendances[Math.floor(Math.random() * attendances.length)] : 
        'present';
      
      executions.push({
        scheduleItemId: item.id,
        executionDate: new Date(2024, 0, week * 7).toISOString(),
        status,
        instructorAttendance: attendance,
        actualStartTime: status === 'completed' ? item.startTime : undefined,
        actualEndTime: status === 'completed' ? item.endTime : undefined,
        attendanceCount: status === 'completed' ? Math.floor(Math.random() * 25) + 10 : undefined,
        notes: status === 'cancelled' ? 'Libur nasional' : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });
  
  return executions;
};

const MAROON_COLORS = ['#800020', '#A0002A', '#C2185B', '#E91E63', '#AD1457'];

export function MonitoringEvaluation({
  isOpen,
  onClose,
  scheduleItems,
  activityTypes,
  studentClasses,
  selectedSemesterType,
  selectedAcademicYear
}: MonitoringEvaluationProps) {
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  
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

  // Calculate monitoring statistics
  const monitoringStats = useMemo((): MonitoringStats => {
    const totalSessions = executions.length;
    const completedSessions = executions.filter(e => e.status === 'completed').length;
    const cancelledSessions = executions.filter(e => e.status === 'cancelled').length;
    const postponedSessions = executions.filter(e => e.status === 'postponed').length;
    
    const completedExecutions = executions.filter(e => e.status === 'completed');
    const instructorPresentSessions = completedExecutions.filter(e => e.instructorAttendance === 'present').length;
    const instructorAbsentSessions = completedExecutions.filter(e => e.instructorAttendance === 'absent').length;
    const instructorSubstituteSessions = completedExecutions.filter(e => e.instructorAttendance === 'substitute').length;
    
    return {
      totalScheduledSessions: totalSessions,
      completedSessions,
      cancelledSessions,
      postponedSessions,
      executionPercentage: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      instructorPresentSessions,
      instructorAbsentSessions,
      instructorSubstituteSessions,
      instructorAttendancePercentage: completedSessions > 0 ? Math.round((instructorPresentSessions / completedSessions) * 100) : 0
    };
  }, [executions]);

  // Calculate instructor statistics
  const instructorStats = useMemo((): InstructorStats[] => {
    const instructorMap = new Map<string, {
      total: number;
      present: number;
      absent: number;
      substitute: number;
    }>();

    filteredScheduleItems.forEach(item => {
      if (item.instructor) {
        const itemExecutions = executions.filter(e => e.scheduleItemId === item.id && e.status === 'completed');
        
        if (!instructorMap.has(item.instructor)) {
          instructorMap.set(item.instructor, { total: 0, present: 0, absent: 0, substitute: 0 });
        }
        
        const stats = instructorMap.get(item.instructor)!;
        stats.total += itemExecutions.length;
        
        itemExecutions.forEach(exec => {
          if (exec.instructorAttendance === 'present') stats.present++;
          else if (exec.instructorAttendance === 'absent') stats.absent++;
          else if (exec.instructorAttendance === 'substitute') stats.substitute++;
        });
      }
    });

    return Array.from(instructorMap.entries()).map(([name, stats]) => ({
      instructorName: name,
      totalSessions: stats.total,
      presentSessions: stats.present,
      absentSessions: stats.absent,
      substituteSessions: stats.substitute,
      attendancePercentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    }));
  }, [filteredScheduleItems, executions]);

  // Calculate semester statistics
  const semesterStats = useMemo((): SemesterStats[] => {
    const allowedSemesters = SEMESTER_MAPPING[selectedSemesterType];
    
    return allowedSemesters.map(semester => {
      const semesterItems = filteredScheduleItems.filter(item => item.semester === semester);
      const semesterExecutions = executions.filter(exec => 
        semesterItems.some(item => item.id === exec.scheduleItemId)
      );
      
      const completedSessions = semesterExecutions.filter(e => e.status === 'completed').length;
      const completedWithInstructor = semesterExecutions.filter(e => 
        e.status === 'completed' && e.instructorAttendance === 'present'
      ).length;
      
      return {
        semester,
        totalSessions: semesterExecutions.length,
        completedSessions,
        executionPercentage: semesterExecutions.length > 0 ? Math.round((completedSessions / semesterExecutions.length) * 100) : 0,
        instructorAttendancePercentage: completedSessions > 0 ? Math.round((completedWithInstructor / completedSessions) * 100) : 0
      };
    });
  }, [filteredScheduleItems, executions, selectedSemesterType]);

  // Chart data
  const executionChartData = [
    { name: 'Selesai', value: monitoringStats.completedSessions, color: '#800020' },
    { name: 'Terjadwal', value: monitoringStats.totalScheduledSessions - monitoringStats.completedSessions - monitoringStats.cancelledSessions - monitoringStats.postponedSessions, color: '#A0002A' },
    { name: 'Dibatalkan', value: monitoringStats.cancelledSessions, color: '#DC143C' },
    { name: 'Ditunda', value: monitoringStats.postponedSessions, color: '#C2185B' }
  ];

  const instructorAttendanceData = [
    { name: 'Hadir', value: monitoringStats.instructorPresentSessions, color: '#800020' },
    { name: 'Tidak Hadir', value: monitoringStats.instructorAbsentSessions, color: '#DC143C' },
    { name: 'Pengganti', value: monitoringStats.instructorSubstituteSessions, color: '#C2185B' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Monitoring dan Evaluasi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter */}
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

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sesi</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitoringStats.totalScheduledSessions}</div>
                <p className="text-xs text-muted-foreground">Sesi terjadwal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pelaksanaan</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-maroon-500">{monitoringStats.executionPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {monitoringStats.completedSessions} dari {monitoringStats.totalScheduledSessions} sesi
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kehadiran Dosen</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-maroon-600">{monitoringStats.instructorAttendancePercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {monitoringStats.instructorPresentSessions} dari {monitoringStats.completedSessions} sesi
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dibatalkan/Ditunda</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-maroon-700">
                  {monitoringStats.cancelledSessions + monitoringStats.postponedSessions}
                </div>
                <p className="text-xs text-muted-foreground">Sesi bermasalah</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="execution">Pelaksanaan</TabsTrigger>
              <TabsTrigger value="instructors">Dosen</TabsTrigger>
              <TabsTrigger value="semesters">Per Semester</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Status Pelaksanaan Perkuliahan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {executionChartData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.value}</span>
                            <div className="w-20">
                              <Progress 
                                value={(item.value / monitoringStats.totalScheduledSessions) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Kehadiran Dosen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {instructorAttendanceData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.value}</span>
                            <div className="w-20">
                              <Progress 
                                value={monitoringStats.completedSessions > 0 ? (item.value / monitoringStats.completedSessions) * 100 : 0} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="execution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Pelaksanaan Perkuliahan</CardTitle>
                  <CardDescription>
                    Tingkat pelaksanaan perkuliahan per semester
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {semesterStats.map((stats) => (
                      <div key={stats.semester} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Semester {stats.semester}</span>
                          <span className="text-sm text-muted-foreground">
                            {stats.completedSessions}/{stats.totalSessions} sesi ({stats.executionPercentage}%)
                          </span>
                        </div>
                        <Progress value={stats.executionPercentage} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Kehadiran Dosen</CardTitle>
                  <CardDescription>
                    Persentase kehadiran per dosen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {instructorStats.map((stats, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{stats.instructorName}</span>
                          <div className="text-sm text-muted-foreground flex gap-4">
                            <span>Hadir: {stats.presentSessions}</span>
                            <span>Tidak Hadir: {stats.absentSessions}</span>
                            <span>Pengganti: {stats.substituteSessions}</span>
                            <span className="font-medium">({stats.attendancePercentage}%)</span>
                          </div>
                        </div>
                        <Progress value={stats.attendancePercentage} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="semesters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Perbandingan Antar Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {semesterStats.map((stats) => (
                      <div key={stats.semester} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Semester {stats.semester}</h4>
                          <Badge variant="outline">{stats.totalSessions} total sesi</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Pelaksanaan</span>
                              <span className="font-medium text-primary">{stats.executionPercentage}%</span>
                            </div>
                            <Progress value={stats.executionPercentage} className="h-3" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Kehadiran Dosen</span>
                              <span className="font-medium text-medical">{stats.instructorAttendancePercentage}%</span>
                            </div>
                            <Progress value={stats.instructorAttendancePercentage} className="h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}