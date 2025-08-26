import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { ActivityTypeConfig } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { id as idLocale } from "date-fns/locale";

interface MonthlyLecture {
  id: string;
  classId: string;
  courseName: string;
  instructor: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM-HH:MM format
  activityType: string;
  room?: string;
  description?: string;
  semester: 1 | 2 | 3 | 4;
}

interface MonthlyScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  studentClasses: StudentClass[];
  activityTypes: Record<string, ActivityTypeConfig>;
}

// Color schemes for different classes
const CLASS_COLORS = {
  'Reg-A1-S1': 'border-l-4 border-l-primary bg-primary/5',
  'Reg-B1-S1': 'border-l-4 border-l-blue bg-blue-light',
  'Reg-C1-S1': 'border-l-4 border-l-green bg-green-light',
  'Reg-A1-S3': 'border-l-4 border-l-purple bg-purple-light',
  'Reg-B1-S3': 'border-l-4 border-l-orange bg-orange-light',
  'Reg-C1-S3': 'border-l-4 border-l-teal bg-teal-light',
  'RPL-1': 'border-l-4 border-l-indigo bg-indigo-light',
  'RPL-2': 'border-l-4 border-l-academic bg-academic-light'
};

const getClassColor = (classCode: string) => {
  return CLASS_COLORS[classCode as keyof typeof CLASS_COLORS] || 'border-l-4 border-l-muted bg-muted/5';
};

export function MonthlySchedule({
  isOpen,
  onClose,
  studentClasses,
  activityTypes
}: MonthlyScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [monthlyLectures, setMonthlyLectures] = useState<MonthlyLecture[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<MonthlyLecture | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 3 | 4>(3);
  const [formData, setFormData] = useState({
    classId: '',
    courseName: '',
    instructor: '',
    date: '',
    time: '',
    activityType: '',
    room: '',
    description: '',
    semester: 3 as 1 | 2 | 3 | 4
  });
  const { toast } = useToast();

  // Load lectures from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mars-monthly-lectures');
    if (saved) {
      setMonthlyLectures(JSON.parse(saved));
    } else if (studentClasses.length > 0) {
      // Add sample monthly data
      const activeClasses = studentClasses.filter(c => c.isActive);
      if (activeClasses.length > 0) {
        const sampleData: MonthlyLecture[] = [];
        
        activeClasses.forEach((studentClass, classIndex) => {
          // Create sample lectures for different dates
          const dates = [
            '2024-08-30', '2024-09-06', '2024-09-13', '2024-09-20', '2024-09-27',
            '2024-10-04', '2024-10-11', '2024-10-18', '2024-10-25',
            '2024-11-01', '2024-11-08', '2024-11-15', '2024-11-22', '2024-11-29'
          ];
          
          const courses = [
            'Manajemen Strategis RS', 'Sistem Informasi Manajemen', 'Manajemen Mutu',
            'Manajemen SDM', 'Manajemen Keuangan', 'Kepemimpinan', 'Komunikasi Efektif'
          ];
          
          const instructors = [
            'Dr. Ahmad Susilo, M.Kes', 'Prof. Dr. Siti Rahma, M.Si', 'Dr. Maya Indira, M.Psi',
            'Dr. Budi Santoso, M.Kes', 'Dr. Linda Sari, M.M'
          ];
          
          const times = ['13.00-15.30', '15.40-18.10', '09.00-11.30', '19.00-21.30'];
          const rooms = [`A${201 + classIndex}`, `B${301 + classIndex}`, `C${401 + classIndex}`];
          
          dates.forEach((date, dateIndex) => {
            if (dateIndex % 2 === classIndex % 2) { // Distribute lectures across classes
              const courseIndex = (classIndex + dateIndex) % courses.length;
              const instructorIndex = (classIndex + dateIndex) % instructors.length;
              const timeIndex = dateIndex % times.length;
              const roomIndex = classIndex % rooms.length;
              
              sampleData.push({
                id: `${studentClass.id}-${dateIndex}`,
                classId: studentClass.id,
                courseName: courses[courseIndex],
                instructor: instructors[instructorIndex],
                date: date,
                time: times[timeIndex],
                activityType: 'perkuliahan-offline',
                room: rooms[roomIndex],
                description: `Perkuliahan ${courses[courseIndex]} untuk kelas ${studentClass.code}`,
                semester: studentClass.code.includes('S1') ? 1 : 3
              });
            }
          });
        });
        
        setMonthlyLectures(sampleData);
      }
    }
  }, [studentClasses]);

  // Save lectures to localStorage
  useEffect(() => {
    localStorage.setItem('mars-monthly-lectures', JSON.stringify(monthlyLectures));
  }, [monthlyLectures]);

  const handleAddLecture = (date: Date) => {
    setEditingLecture(null);
    setSelectedDate(date);
    setFormData({
      classId: '',
      courseName: '',
      instructor: '',
      date: format(date, 'yyyy-MM-dd'),
      time: '',
      activityType: Object.keys(activityTypes)[0] || '',
      room: '',
      description: '',
      semester: selectedSemester
    });
    setIsFormOpen(true);
  };

  const handleEditLecture = (lecture: MonthlyLecture) => {
    setEditingLecture(lecture);
    const parsedDate = new Date(lecture.date);
    setSelectedDate(parsedDate);
    setFormData({
      classId: lecture.classId,
      courseName: lecture.courseName,
      instructor: lecture.instructor,
      date: lecture.date,
      time: lecture.time,
      activityType: lecture.activityType,
      room: lecture.room || '',
      description: lecture.description || '',
      semester: lecture.semester
    });
    setIsFormOpen(true);
  };

  const handleDeleteLecture = (lectureId: string) => {
    const lecture = monthlyLectures.find(l => l.id === lectureId);
    if (!lecture) return;
    
    setMonthlyLectures(prev => prev.filter(l => l.id !== lectureId));
    toast({
      title: "Perkuliahan dihapus",
      description: `${lecture.courseName} berhasil dihapus.`
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLecture) {
      // Update existing lecture
      setMonthlyLectures(prev => prev.map(l => l.id === editingLecture.id ? {
        ...l,
        ...formData
      } : l));
      toast({
        title: "Perkuliahan diperbarui",
        description: `${formData.courseName} berhasil diperbarui.`
      });
    } else {
      // Add new lecture
      const newLecture: MonthlyLecture = {
        id: Date.now().toString(),
        ...formData
      };
      setMonthlyLectures(prev => [...prev, newLecture]);
      toast({
        title: "Perkuliahan ditambahkan",
        description: `${formData.courseName} berhasil ditambahkan.`
      });
    }
    
    setIsFormOpen(false);
  };

  const getLecturesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return monthlyLectures.filter(lecture => 
      lecture.date === dateStr && lecture.semester === selectedSemester
    );
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getSelectedClass = (classId: string) => {
    return studentClasses.find(c => c.id === classId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            📅 Jadwal Perkuliahan Per Bulan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
              </h2>
              <Button variant="outline" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Select value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value) as 1 | 2 | 3 | 4)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-auto max-h-[60vh]">
            <div className="grid grid-cols-7 gap-1 min-w-[900px]">
              {/* Header */}
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                <div key={day} className="p-2 text-center font-semibold bg-primary text-primary-foreground rounded-t">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getMonthDays().map((date) => {
                const lectures = getLecturesForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isTodayDate = isToday(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "min-h-[120px] p-1 border border-border bg-card relative group",
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                      isTodayDate && "bg-primary/10 border-primary"
                    )}
                  >
                    {/* Date number */}
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "text-sm font-medium",
                        isTodayDate && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      )}>
                        {format(date, 'd')}
                      </span>
                      
                      {/* Add button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddLecture(date)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Lectures */}
                    <div className="space-y-1">
                      {lectures.slice(0, 3).map((lecture) => {
                        const selectedClass = getSelectedClass(lecture.classId);
                        if (!selectedClass) return null;
                        
                        return (
                          <div
                            key={lecture.id}
                            className={cn(
                              "text-xs p-1 rounded cursor-pointer hover:shadow-md transition-all",
                              getClassColor(selectedClass.code)
                            )}
                            onClick={() => handleEditLecture(lecture)}
                          >
                            <div className="font-medium truncate">{lecture.courseName}</div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{lecture.time}</span>
                            </div>
                            <div className="text-muted-foreground truncate">
                              {selectedClass.code}
                            </div>
                          </div>
                        );
                      })}
                      
                      {lectures.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{lectures.length - 3} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLecture ? 'Edit Perkuliahan' : 'Tambah Perkuliahan'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <Label htmlFor="classId">Kelas</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentClasses.filter(c => c.isActive).map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.code} - {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="courseName">Mata Kuliah</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="instructor">Dosen</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: idLocale }) : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
                        }
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Waktu</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="13.00-15.30"
                  required
                />
              </div>

              <div>
                <Label htmlFor="activityType">Jenis Kegiatan</Label>
                <Select value={formData.activityType} onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room">Ruangan</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingLecture ? 'Perbarui' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}