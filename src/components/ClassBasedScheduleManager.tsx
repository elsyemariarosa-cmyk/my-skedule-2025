import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, Clock, BookOpen, Users, Calendar, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ActivityTypeConfig, DAY_LABELS, DAY_TIME_SLOTS } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";

interface ClassLecture {
  id: string;
  classId: string;
  courseName: string; // Nama mata kuliah
  activityType: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  date: string; // Format: YYYY-MM-DD
  startTime: string;
  endTime: string;
  instructor: string;
  room: string;
  description?: string;
  semester: 1 | 2 | 3 | 4;
  credits: number; // SKS
  createdAt: string;
  updatedAt: string;
}

interface ClassBasedScheduleManagerProps {
  studentClasses: StudentClass[];
  activityTypes: Record<string, ActivityTypeConfig>;
  onUpdateStudentClasses: (classes: StudentClass[]) => void;
}

// Sample course names for different semesters
const SAMPLE_COURSES = {
  1: [
    'Manajemen Strategis Rumah Sakit',
    'Sistem Informasi Manajemen RS',
    'Komunikasi Efektif dalam Pelayanan',
    'Dasar-dasar Manajemen Kesehatan'
  ],
  2: [
    'Manajemen Keuangan Rumah Sakit',
    'Manajemen Sumber Daya Manusia',
    'Manajemen Operasional RS',
    'Sistem Mutu Pelayanan Kesehatan'
  ],
  3: [
    'Manajemen Mutu dan Keselamatan Pasien',
    'Kepemimpinan dalam Organisasi Kesehatan',
    'Manajemen Resiko RS',
    'Inovasi Pelayanan Kesehatan'
  ],
  4: [
    'Manajemen Krisis dan Bencana',
    'Evaluasi Kinerja Organisasi',
    'Penelitian Manajemen RS',
    'Tesis/Capstone Project'
  ]
};

export function ClassBasedScheduleManager({ 
  studentClasses, 
  activityTypes,
  onUpdateStudentClasses 
}: ClassBasedScheduleManagerProps) {
  const [classLectures, setClassLectures] = useState<ClassLecture[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<ClassLecture | null>(null);
  const [lectureFormData, setLectureFormData] = useState({
    courseName: '',
    activityType: '',
    day: 'monday' as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    date: '',
    startTime: '',
    endTime: '',
    instructor: '',
    room: '',
    description: '',
    semester: 1 as 1 | 2 | 3 | 4,
    credits: 2
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { toast } = useToast();

  // Initialize with at least 6 classes if less than 6 exist
  useEffect(() => {
    if (studentClasses.length < 6) {
      const newClasses: StudentClass[] = [...studentClasses];
      const missingCount = 6 - studentClasses.length;
      
      for (let i = 0; i < missingCount; i++) {
        const existingRegulerCount = newClasses.filter(c => c.type === 'reguler').length;
        const classLetter = String.fromCharCode(65 + existingRegulerCount + i);
        
        newClasses.push({
          id: (Date.now() + i).toString(),
          name: `Reguler ${classLetter}`,
          type: 'reguler',
          code: `REG-${classLetter}`,
          description: `Kelas Reguler ${classLetter}`,
          academicYearBatch: '2024/2025',
          maxCapacity: 25,
          currentCapacity: 20 + i,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      onUpdateStudentClasses(newClasses);
    }
  }, [studentClasses, onUpdateStudentClasses]);

  // Load lectures from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mars-class-lectures');
    if (saved) {
      setClassLectures(JSON.parse(saved));
    } else {
      // Create initial sample lectures for each class
      const initialLectures: ClassLecture[] = [];
      studentClasses.slice(0, 6).forEach((studentClass, index) => {
        const coursesForSemester = SAMPLE_COURSES[Math.min(index + 1, 4) as keyof typeof SAMPLE_COURSES];
        const course = coursesForSemester[index % coursesForSemester.length];
        
        const days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday')[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const semesters: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
        
        initialLectures.push({
          id: `lecture-${studentClass.id}-${index}`,
          classId: studentClass.id,
          courseName: course,
          activityType: 'perkuliahan-offline',
          day: days[index % 5],
          date: '2024-12-20', // Default sample date
          startTime: '08:00',
          endTime: '09:40',
          instructor: `Dr. Dosen ${index + 1}, M.Kes`,
          room: `Ruang ${200 + index + 1}`,
          description: `Kuliah ${course} untuk ${studentClass.name}`,
          semester: semesters[Math.min(index, 3)],
          credits: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      
      setClassLectures(initialLectures);
      localStorage.setItem('mars-class-lectures', JSON.stringify(initialLectures));
    }
  }, [studentClasses]);

  // Save lectures to localStorage
  useEffect(() => {
    localStorage.setItem('mars-class-lectures', JSON.stringify(classLectures));
  }, [classLectures]);

  const handleAddLecture = (classId: string) => {
    setSelectedClassId(classId);
    setEditingLecture(null);
    setSelectedDate(undefined);
    setLectureFormData({
      courseName: '',
      activityType: '',
      day: 'monday' as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
      date: '',
      startTime: '',
      endTime: '',
      instructor: '',
      room: '',
      description: '',
      semester: 1 as 1 | 2 | 3 | 4,
      credits: 2
    });
    setIsLectureFormOpen(true);
  };

  const handleEditLecture = (lecture: ClassLecture) => {
    setEditingLecture(lecture);
    setSelectedDate(lecture.date ? new Date(lecture.date) : undefined);
    setLectureFormData({
      courseName: lecture.courseName,
      activityType: lecture.activityType,
      day: lecture.day,
      date: lecture.date,
      startTime: lecture.startTime,
      endTime: lecture.endTime,
      instructor: lecture.instructor,
      room: lecture.room,
      description: lecture.description || '',
      semester: lecture.semester,
      credits: lecture.credits
    });
    setIsLectureFormOpen(true);
  };

  const handleDeleteLecture = (lectureId: string) => {
    const lecture = classLectures.find(l => l.id === lectureId);
    if (!lecture) return;
    
    setClassLectures(prev => prev.filter(l => l.id !== lectureId));
    
    toast({
      title: "Jadwal kuliah dihapus",
      description: `${lecture.courseName} berhasil dihapus.`,
    });
  };

  const handleSubmitLectureForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use selected date from date picker if available, otherwise use form date
    const finalDate = selectedDate ? selectedDate.toISOString().split('T')[0] : lectureFormData.date;
    
    if (editingLecture) {
      // Update existing lecture
      setClassLectures(prev => prev.map(l => 
        l.id === editingLecture.id 
          ? { 
              ...l, 
              ...lectureFormData,
              date: finalDate,
              updatedAt: new Date().toISOString()
            }
          : l
      ));
      
      toast({
        title: "Jadwal kuliah diperbarui",
        description: `${lectureFormData.courseName} berhasil diperbarui.`,
      });
    } else {
      // Add new lecture
      const newLecture: ClassLecture = {
        id: Date.now().toString(),
        classId: selectedClassId,
        ...lectureFormData,
        date: finalDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setClassLectures(prev => [...prev, newLecture]);
      
      toast({
        title: "Jadwal kuliah ditambahkan",
        description: `${lectureFormData.courseName} berhasil ditambahkan.`,
      });
    }
    
    setIsLectureFormOpen(false);
    setSelectedDate(undefined);
  };

  const getClassLectures = (classId: string) => {
    return classLectures.filter(l => l.classId === classId);
  };

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const generateScheduleTable = (classId: string) => {
    const lectures = getClassLectures(classId);
    const studentClass = studentClasses.find(c => c.id === classId);
    if (!studentClass) return null;

    // Group lectures by day
    const lecturesByDay = lectures.reduce((acc, lecture) => {
      if (!acc[lecture.day]) acc[lecture.day] = [];
      acc[lecture.day].push(lecture);
      return acc;
    }, {} as Record<string, ClassLecture[]>);

    // Generate dates for the next week (Friday and Saturday focus)
    const today = new Date();
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
    const nextSaturday = new Date(nextFriday);
    nextSaturday.setDate(nextFriday.getDate() + 1);

    const formatDate = (date: Date) => {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const fridayLectures = lecturesByDay.friday || [];
    const saturdayLectures = lecturesByDay.saturday || [];

    return (
      <div className="w-full space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-bold">JADWAL PERKULIAHAN SEMESTER 3 ANGKATAN 21 {studentClass.code}</h2>
          <h3 className="text-md font-semibold text-muted-foreground">PRODI MARS UMY</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2 bg-muted font-semibold text-center w-20">Hari/Tgl</th>
                <th className="border border-gray-400 p-2 bg-muted font-semibold text-center">{formatDate(nextFriday)}</th>
                <th className="border border-gray-400 p-2 bg-muted font-semibold text-center">{formatDate(nextFriday)}</th>
                <th className="border border-gray-400 p-2 bg-muted font-semibold text-center">{formatDate(nextFriday)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 bg-muted font-semibold text-center">Waktu</td>
                <td className="border border-gray-400 p-2 text-center font-medium">13.00-15.00</td>
                <td className="border border-gray-400 p-2 text-center font-medium">15.30-18.00</td>
                <td className="border border-gray-400 p-2 text-center font-medium">19.00-21.30</td>
              </tr>
              {fridayLectures.slice(0, 3).map((lecture, index) => (
                <tr key={`friday-${index}`}>
                  {index === 0 && (
                    <td className="border border-gray-400 p-4 bg-muted/50" rowSpan={3}></td>
                  )}
                  <td className="border border-gray-400 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-primary">{lecture.courseName}</div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLecture(lecture)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLecture(lecture.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{lecture.description || 'Materi Pembelajaran'}</div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{lecture.courseName}</div>
                      <div className="text-sm text-muted-foreground">Analisis dan Diskusi</div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{lecture.courseName}</div>
                      <div className="text-sm text-muted-foreground">Praktik dan Evaluasi</div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {fridayLectures[0]?.instructor || 'Dr. Nama Dosen, M.Kes.'}
                </td>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {fridayLectures[1]?.instructor || 'Dr. Nama Dosen, M.Kes.'}
                </td>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {fridayLectures[2]?.instructor || 'Dr. Nama Dosen, M.Kes.'}
                </td>
              </tr>
              
              {/* Saturday Schedule */}
              <tr>
                <td className="border border-gray-400 p-2 bg-muted font-semibold text-center" colSpan={4}>
                  {formatDate(nextSaturday)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 bg-muted font-semibold text-center">Waktu</td>
                <td className="border border-gray-400 p-2 text-center font-medium">09.00-11.30</td>
                <td className="border border-gray-400 p-2 text-center font-medium">12.30-15.00</td>
                <td className="border border-gray-400 p-2 text-center font-medium">15.30-18.00</td>
              </tr>
              {saturdayLectures.slice(0, 3).map((lecture, index) => (
                <tr key={`saturday-${index}`}>
                  {index === 0 && (
                    <td className="border border-gray-400 p-4 bg-muted/50" rowSpan={3}></td>
                  )}
                  <td className="border border-gray-400 p-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{lecture.courseName}</div>
                      <div className="text-sm text-muted-foreground">Business Plan atau Feasibility Study</div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-4 bg-yellow-100">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{lecture.courseName}</div>
                      <div className="text-sm text-muted-foreground">Preview Strategic Management</div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{lecture.courseName}</div>
                      <div className="text-sm text-muted-foreground">Integrasi ICT dengan IoT</div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {saturdayLectures[0]?.instructor || 'Dr. Qurratul Aini, SKG., M.Kes.'}
                </td>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {saturdayLectures[1]?.instructor || 'Drs. Johny Setiawan, MBA'}
                </td>
                <td className="border border-gray-400 p-4 text-center font-medium">
                  {saturdayLectures[2]?.instructor || 'Ir. Eko Prasetyo, M.Eng., Ph.D'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          Jadwal Perkuliahan Per Kelas
        </h1>
        <p className="text-muted-foreground mt-2">Kelola jadwal perkuliahan berdasarkan kelas</p>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="table">Tampilan Tabel</TabsTrigger>
          <TabsTrigger value="cards">Tampilan Kartu</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          {studentClasses.filter(c => c.isActive).slice(0, 6).map((studentClass) => (
            <div key={studentClass.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Badge variant="outline">{studentClass.code}</Badge>
                  {studentClass.name}
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => handleAddLecture(studentClass.id)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Jadwal
                </Button>
              </div>
              {generateScheduleTable(studentClass.id)}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {studentClasses.filter(c => c.isActive).map((studentClass) => {
          const lectures = getClassLectures(studentClass.id);
          
          return (
            <Card key={studentClass.id} className="h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {studentClass.code}
                      </Badge>
                      {studentClass.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Angkatan: {studentClass.academicYearBatch}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />
                      {studentClass.currentCapacity}/{studentClass.maxCapacity} mahasiswa
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddLecture(studentClass.id)}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {lectures.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada jadwal kuliah</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleAddLecture(studentClass.id)}
                    >
                      Tambah Jadwal
                    </Button>
                  </div>
                ) : (
                  lectures.map((lecture) => (
                    <Card key={lecture.id} className="p-3 bg-muted/30">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-primary">
                            {lecture.courseName}
                          </h4>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditLecture(lecture)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteLecture(lecture.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {activityTypes[lecture.activityType]?.label || lecture.activityType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lecture.credits} SKS
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {DAY_LABELS[lecture.day]}, {lecture.startTime} - {lecture.endTime}
                          </div>
                          <div>👨‍🏫 {lecture.instructor}</div>
                          <div>🏢 {lecture.room}</div>
                          <div>📚 Semester {lecture.semester}</div>
                        </div>
                        
                        {lecture.description && (
                          <p className="text-xs text-muted-foreground bg-background p-2 rounded">
                            {lecture.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Lecture Form Dialog */}
      <Dialog open={isLectureFormOpen} onOpenChange={setIsLectureFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingLecture ? 'Edit Jadwal Kuliah' : 'Tambah Jadwal Kuliah Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitLectureForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Nama Mata Kuliah *</Label>
                <Input
                  id="courseName"
                  value={lectureFormData.courseName}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  placeholder="Manajemen Strategis RS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">SKS *</Label>
                <Select 
                  value={lectureFormData.credits.toString()} 
                  onValueChange={(value) => setLectureFormData(prev => ({ ...prev, credits: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 SKS</SelectItem>
                    <SelectItem value="2">2 SKS</SelectItem>
                    <SelectItem value="3">3 SKS</SelectItem>
                    <SelectItem value="4">4 SKS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Jenis Kegiatan *</Label>
                <Select 
                  value={lectureFormData.activityType} 
                  onValueChange={(value) => setLectureFormData(prev => ({ ...prev, activityType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kegiatan" />
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

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select 
                  value={lectureFormData.semester.toString()} 
                  onValueChange={(value) => setLectureFormData(prev => ({ ...prev, semester: parseInt(value) as any }))}
                >
                  <SelectTrigger>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Hari *</Label>
                <Select 
                  value={lectureFormData.day} 
                  onValueChange={(value: any) => setLectureFormData(prev => ({ ...prev, day: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DAY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Waktu Mulai *</Label>
                <Select 
                  value={lectureFormData.startTime} 
                  onValueChange={(value) => setLectureFormData(prev => ({ ...prev, startTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_TIME_SLOTS[lectureFormData.day].map((slot) => (
                      <SelectItem key={slot.start} value={slot.start}>
                        {slot.start}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Waktu Selesai *</Label>
                <Select 
                  value={lectureFormData.endTime} 
                  onValueChange={(value) => setLectureFormData(prev => ({ ...prev, endTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_TIME_SLOTS[lectureFormData.day].map((slot) => (
                      <SelectItem key={slot.end} value={slot.end}>
                        {slot.end}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Perkuliahan *</Label>
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
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Dosen Pengampu *</Label>
                <Input
                  id="instructor"
                  value={lectureFormData.instructor}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="Dr. Ahmad Susilo, M.Kes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Ruangan *</Label>
                <Input
                  id="room"
                  value={lectureFormData.room}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="Ruang 201"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={lectureFormData.description}
                onChange={(e) => setLectureFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi mata kuliah atau catatan khusus"
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsLectureFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingLecture ? 'Simpan Perubahan' : 'Tambah Jadwal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}