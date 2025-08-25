import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { ActivityTypeConfig, DAY_TIME_SLOTS } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";

interface ClassLecture {
  id: string;
  classId: string;
  courseName: string;
  activityType: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  instructor: string;
  room: string;
  description?: string;
  semester: 1 | 2 | 3 | 4;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

interface ClassScheduleTableProps {
  studentClasses: StudentClass[];
  activityTypes: Record<string, ActivityTypeConfig>;
}

export function ClassScheduleTable({ studentClasses, activityTypes }: ClassScheduleTableProps) {
  const [selectedTabClass, setSelectedTabClass] = useState<string>('');
  const [classLectures, setClassLectures] = useState<ClassLecture[]>([]);
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<ClassLecture | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [lectureFormData, setLectureFormData] = useState({
    courseName: '',
    activityType: '',
    day: 'friday' as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    startTime: '',
    endTime: '',
    instructor: '',
    room: '',
    description: '',
    semester: 3 as 1 | 2 | 3 | 4,
    credits: 3
  });
  const { toast } = useToast();

  // Set initial tab when component mounts
  useEffect(() => {
    if (studentClasses.length > 0 && !selectedTabClass) {
      setSelectedTabClass(studentClasses.filter(c => c.isActive)[0]?.id || '');
    }
  }, [studentClasses, selectedTabClass]);

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

  const handleEditLecture = (lecture: ClassLecture) => {
    setEditingLecture(lecture);
    setSelectedClassId(lecture.classId);
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

  const createScheduleTable = (selectedClass: StudentClass) => {
    const lectures = getClassLectures(selectedClass.id);
    const timeSlots = DAY_TIME_SLOTS['friday'];
    
    // Create specific schedule dates
    const scheduleData = [
      {
        day: 'friday',
        label: 'Jumat',
        dates: ['29 Agustus 2025', '29 Agustus 2025', '29 Agustus 2025']
      },
      {
        day: 'saturday', 
        label: 'Sabtu',
        dates: ['30 Agustus 2025', '30 Agustus 2025', '30 Agustus 2025']
      }
    ];
    
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
            JADWAL PERKULIAHAN SEMESTER 3 ANGKATAN {selectedClass.academicYearBatch} {selectedClass.code}
          </h3>
          <p className="text-sm text-muted-foreground">
            PRODI MARS UMY
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted font-semibold text-center min-w-[100px]">
                  Hari/Tgl
                </th>
                {timeSlots.map((timeSlot, index) => (
                  <th key={index} className="border border-border p-3 bg-muted font-semibold text-center min-w-[250px]">
                    <div className="font-bold">{scheduleData[0]?.dates[index] || 'Tanggal'}</div>
                    <div className="text-sm font-normal mt-1">{timeSlot.toString()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.map(({ day, label, dates }) => (
                <tr key={day}>
                  <td className="border border-border p-3 bg-muted/50 font-medium text-center align-top">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">Waktu</div>
                  </td>
                  {timeSlots.map((timeSlot, index) => {
                    const lecture = scheduleGrid[day][timeSlot.toString()];
                    return (
                      <td 
                        key={index} 
                        className={`border border-border p-3 relative group cursor-pointer hover:bg-accent/20 transition-colors align-top ${
                          lecture ? 'bg-primary/10' : 'bg-background'
                        }`}
                        onClick={() => lecture ? handleEditLecture(lecture) : handleAddLectureAtTime(selectedClass.id, day as any, timeSlot.toString())}
                      >
                        {lecture ? (
                          <div className="space-y-2">
                            <div className="font-bold text-sm text-primary bg-red-100 px-2 py-1 rounded text-center">
                              {lecture.courseName}
                            </div>
                            
                            <div className="bg-blue-100 p-2 rounded min-h-[80px] flex items-center justify-center">
                              <div className="text-xs text-center font-medium">
                                {lecture.description || 'Materi perkuliahan'}
                              </div>
                            </div>
                            
                            <div className="text-xs font-semibold text-center border-t pt-2">
                              {lecture.instructor}
                            </div>
                            
                            <div className="flex gap-1 mt-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
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
                                className="h-6 w-6 p-0 text-destructive"
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
                          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity min-h-[120px] flex items-center justify-center">
                            <div>
                              <Plus className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                              <div className="text-xs text-muted-foreground">Tambah Kegiatan</div>
                            </div>
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

  if (studentClasses.filter(c => c.isActive).length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Belum Ada Kelas Aktif</h3>
        <p className="text-muted-foreground">Silakan kelola kelas terlebih dahulu untuk membuat jadwal perkuliahan.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Jadwal Perkuliahan Per Kelas</h2>
      </div>

      <Tabs value={selectedTabClass} onValueChange={setSelectedTabClass} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {studentClasses.filter(c => c.isActive).map(studentClass => (
            <TabsTrigger key={studentClass.id} value={studentClass.id} className="text-xs">
              {studentClass.code}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {studentClasses.filter(c => c.isActive).map(studentClass => (
          <TabsContent key={studentClass.id} value={studentClass.id} className="mt-0">
            {createScheduleTable(studentClass)}
          </TabsContent>
        ))}
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
    </Card>
  );
}