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
import { Plus, Edit, Trash2, Clock, BookOpen, Users, Calendar } from "lucide-react";
import { ActivityTypeConfig, DAY_LABELS, DAY_TIME_SLOTS } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";
interface ClassLecture {
  id: string;
  classId: string;
  courseName: string; // Nama mata kuliah
  activityType: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
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
  isOpen: boolean;
  onClose: () => void;
  studentClasses: StudentClass[];
  activityTypes: Record<string, ActivityTypeConfig>;
  onUpdateStudentClasses: (classes: StudentClass[]) => void;
}

// Sample course names for different semesters
const SAMPLE_COURSES = {
  1: ['Manajemen Strategis Rumah Sakit', 'Sistem Informasi Manajemen RS', 'Komunikasi Efektif dalam Pelayanan', 'Dasar-dasar Manajemen Kesehatan'],
  2: ['Manajemen Keuangan Rumah Sakit', 'Manajemen Sumber Daya Manusia', 'Manajemen Operasional RS', 'Sistem Mutu Pelayanan Kesehatan'],
  3: ['Manajemen Mutu dan Keselamatan Pasien', 'Kepemimpinan dalam Organisasi Kesehatan', 'Manajemen Resiko RS', 'Inovasi Pelayanan Kesehatan'],
  4: ['Manajemen Krisis dan Bencana', 'Evaluasi Kinerja Organisasi', 'Penelitian Manajemen RS', 'Tesis/Capstone Project']
};
export function ClassBasedScheduleManager({
  isOpen,
  onClose,
  studentClasses,
  activityTypes,
  onUpdateStudentClasses
}: ClassBasedScheduleManagerProps) {
  const [selectedTabClass, setSelectedTabClass] = useState<string>('');
  const [classLectures, setClassLectures] = useState<ClassLecture[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<ClassLecture | null>(null);
  const [lectureFormData, setLectureFormData] = useState({
    courseName: '',
    activityType: '',
    day: 'monday' as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    startTime: '',
    endTime: '',
    instructor: '',
    room: '',
    description: '',
    semester: 1 as 1 | 2 | 3 | 4,
    credits: 2
  });
  const { toast } = useToast();

  // Set initial tab when dialog opens
  useEffect(() => {
    if (isOpen && studentClasses.length > 0 && !selectedTabClass) {
      setSelectedTabClass(studentClasses.filter(c => c.isActive)[0]?.id || '');
    }
  }, [isOpen, studentClasses, selectedTabClass]);

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
    setLectureFormData({
      courseName: '',
      activityType: '',
      day: 'monday' as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
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
    setLectureFormData({
      courseName: lecture.courseName,
      activityType: lecture.activityType,
      day: lecture.day,
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
      description: `${lecture.courseName} berhasil dihapus.`
    });
  };
  const handleSubmitLectureForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLecture) {
      // Update existing lecture
      setClassLectures(prev => prev.map(l => l.id === editingLecture.id ? {
        ...l,
        ...lectureFormData,
        updatedAt: new Date().toISOString()
      } : l));
      toast({
        title: "Jadwal kuliah diperbarui",
        description: `${lectureFormData.courseName} berhasil diperbarui.`
      });
    } else {
      // Add new lecture
      const newLecture: ClassLecture = {
        id: Date.now().toString(),
        classId: selectedClassId,
        ...lectureFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setClassLectures(prev => [...prev, newLecture]);
      toast({
        title: "Jadwal kuliah ditambahkan",
        description: `${lectureFormData.courseName} berhasil ditambahkan.`
      });
    }
    setIsLectureFormOpen(false);
  };
  const getClassLectures = (classId: string) => {
    return classLectures.filter(l => l.classId === classId);
  };
  // Create a schedule table view
  const createScheduleTable = (selectedClass: StudentClass) => {
    const lectures = getClassLectures(selectedClass.id);
    const timeSlots = DAY_TIME_SLOTS['friday']; // Use Friday time slots as reference
    
    // Group lectures by day and time
    const scheduleGrid: Record<string, Record<string, ClassLecture | null>> = {};
    ['friday', 'saturday'].forEach(day => {
      scheduleGrid[day] = {};
      timeSlots.forEach(slot => {
        scheduleGrid[day][slot.toString()] = null;
      });
    });
    
    lectures.forEach(lecture => {
      const timeKey = `${lecture.startTime}-${lecture.endTime}`;
      if (scheduleGrid[lecture.day] && scheduleGrid[lecture.day][timeKey] !== undefined) {
        scheduleGrid[lecture.day][timeKey] = lecture;
      }
    });
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary">
            JADWAL PERKULIAHAN SEMESTER 3 {selectedClass.code}
          </h3>
          <p className="text-sm text-muted-foreground">
            PRODI MARS UMY - ANGKATAN {selectedClass.academicYearBatch}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted font-semibold text-center min-w-[100px]">
                  Hari/Tgl
                </th>
                {timeSlots.map((timeSlot, index) => (
                  <th key={index} className="border border-border p-2 bg-muted font-semibold text-center min-w-[200px]">
                    {timeSlot.toString()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { day: 'friday', label: 'Jumat', date: '29 Agustus 2025' },
                { day: 'saturday', label: 'Sabtu', date: '30 Agustus 2025' }
              ].map(({ day, label, date }) => (
                <tr key={day}>
                  <td className="border border-border p-2 bg-muted/50 font-medium text-center">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{date}</div>
                  </td>
                  {timeSlots.map((timeSlot, index) => {
                    const lecture = scheduleGrid[day][timeSlot.toString()];
                    return (
                      <td 
                        key={index} 
                        className={`border border-border p-2 relative group cursor-pointer hover:bg-accent/20 transition-colors ${
                          lecture ? 'bg-primary/10' : 'bg-background'
                        }`}
                        onClick={() => lecture ? handleEditLecture(lecture) : handleAddLectureAtTime(selectedClass.id, day as any, timeSlot.toString())}
                      >
                        {lecture ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-sm text-primary">
                              {lecture.courseName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lecture.description}
                            </div>
                            <div className="text-xs font-medium">
                              {lecture.instructor}
                            </div>
                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditLecture(lecture);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLecture(lecture.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-4 h-4 mx-auto text-muted-foreground" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleAddLectureAtTime = (classId: string, day: 'friday' | 'saturday', timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split('-');
    setSelectedClassId(classId);
    setEditingLecture(null);
    setLectureFormData({
      courseName: '',
      activityType: Object.keys(activityTypes)[0] || '',
      day,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      instructor: '',
      room: '',
      description: '',
      semester: 3,
      credits: 3
    });
    setIsLectureFormOpen(true);
  };

  return <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Jadwal Perkuliahan Per Kelas
            </DialogTitle>
          </DialogHeader>

          <Tabs value={selectedTabClass} onValueChange={setSelectedTabClass} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {studentClasses.filter(c => c.isActive).map(studentClass => (
                <TabsTrigger key={studentClass.id} value={studentClass.id} className="text-xs">
                  {studentClass.code}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {studentClasses.filter(c => c.isActive).map(studentClass => (
              <TabsContent key={studentClass.id} value={studentClass.id} className="mt-6">
                {createScheduleTable(studentClass)}
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lecture Form Dialog */}
      <Dialog open={isLectureFormOpen} onOpenChange={setIsLectureFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingLecture ? 'Edit Jadwal Kuliah' : 'Tambah Jadwal Kuliah Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitLectureForm} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseName">Nama Mata Kuliah</Label>
                <Input
                  id="courseName"
                  value={lectureFormData.courseName}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="activityType">Jenis Kegiatan</Label>
                <Select value={lectureFormData.activityType} onValueChange={(value) => setLectureFormData(prev => ({ ...prev, activityType: value }))}>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="day">Hari</Label>
                <Select value={lectureFormData.day} onValueChange={(value: any) => setLectureFormData(prev => ({ ...prev, day: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friday">Jumat</SelectItem>
                    <SelectItem value="saturday">Sabtu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startTime">Waktu Mulai</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={lectureFormData.startTime}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Waktu Selesai</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={lectureFormData.endTime}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instructor">Dosen Pengampu</Label>
                <Input
                  id="instructor"
                  value={lectureFormData.instructor}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="room">Ruangan</Label>
                <Input
                  id="room"
                  value={lectureFormData.room}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, room: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select value={lectureFormData.semester.toString()} onValueChange={(value) => setLectureFormData(prev => ({ ...prev, semester: parseInt(value) as 1 | 2 | 3 | 4 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="credits">SKS</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={lectureFormData.credits}
                  onChange={(e) => setLectureFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi/Materi</Label>
              <Textarea
                id="description"
                value={lectureFormData.description}
                onChange={(e) => setLectureFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Masukkan deskripsi atau materi kuliah..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLectureFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingLecture ? 'Update' : 'Tambah'} Jadwal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>;
}