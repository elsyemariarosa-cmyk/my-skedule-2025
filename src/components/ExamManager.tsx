import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, BookOpen, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { ExamItem, ExamType, getExamTypeLabel, getExamTypeColor, SAMPLE_EXAMS } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";

interface ExamManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamManager({ isOpen, onClose }: ExamManagerProps) {
  const [exams, setExams] = useState<ExamItem[]>(SAMPLE_EXAMS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamItem | undefined>();
  const [activeTab, setActiveTab] = useState<ExamType>('uts');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    examType: 'uts' as ExamType,
    examDate: '',
    examTime: '',
    coordinator: '',
    semester: 1 as 1 | 2 | 3 | 4,
    academicYear: '2024/2025',
    room: '',
    duration: 120,
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      examType: 'uts',
      examDate: '',
      examTime: '',
      coordinator: '',
      semester: 1,
      academicYear: '2024/2025',
      room: '',
      duration: 120,
      notes: ''
    });
    setEditingExam(undefined);
  };

  const handleOpenForm = (examType: ExamType) => {
    resetForm();
    setFormData(prev => ({ ...prev, examType }));
    setIsFormOpen(true);
  };

  const handleEditExam = (exam: ExamItem) => {
    setFormData({
      courseCode: exam.courseCode,
      courseName: exam.courseName,
      examType: exam.examType,
      examDate: exam.examDate,
      examTime: exam.examTime,
      coordinator: exam.coordinator,
      semester: exam.semester,
      academicYear: exam.academicYear,
      room: exam.room || '',
      duration: exam.duration || 120,
      notes: exam.notes || ''
    });
    setEditingExam(exam);
    setIsFormOpen(true);
  };

  const handleDeleteExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam && confirm(`Apakah Anda yakin ingin menghapus ujian ${exam.courseName}?`)) {
      setExams(prev => prev.filter(e => e.id !== examId));
      toast({
        title: "Ujian berhasil dihapus",
        description: `${exam.courseName} telah dihapus dari daftar ujian.`,
      });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      // Update existing exam
      setExams(prev => prev.map(exam => 
        exam.id === editingExam.id 
          ? { 
              ...exam,
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : exam
      ));
      toast({
        title: "Ujian berhasil diperbarui",
        description: `${formData.courseName} telah diperbarui.`,
      });
    } else {
      // Add new exam
      const newExam: ExamItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setExams(prev => [...prev, newExam]);
      toast({
        title: "Ujian berhasil ditambahkan",
        description: `${formData.courseName} telah ditambahkan ke daftar ujian.`,
      });
    }
    
    setIsFormOpen(false);
    resetForm();
  };

  const getFilteredExams = (type: ExamType) => {
    return exams.filter(exam => exam.examType === type).sort((a, b) => 
      new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Manajemen UTS & UAS
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExamType)} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="uts">UTS</TabsTrigger>
                <TabsTrigger value="uas">UAS</TabsTrigger>
              </TabsList>
              <Button 
                onClick={() => handleOpenForm(activeTab)}
                className="bg-gradient-to-r from-primary to-medical text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah {activeTab.toUpperCase()}
              </Button>
            </div>

            <TabsContent value="uts" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredExams('uts').map((exam) => (
                  <Card key={exam.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{exam.courseName}</CardTitle>
                          <CardDescription>Kode: {exam.courseCode}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getExamTypeColor(exam.examType)}>
                            {getExamTypeLabel(exam.examType)}
                          </Badge>
                          <Badge variant="outline">Semester {exam.semester}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Tanggal Ujian</p>
                            <p className="font-medium">{formatDate(exam.examDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Waktu</p>
                            <p className="font-medium">{exam.examTime} ({exam.duration} menit)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Penanggung Jawab</p>
                            <p className="font-medium">{exam.coordinator}</p>
                          </div>
                        </div>
                      </div>
                      {exam.room && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Ruangan: <span className="font-medium">{exam.room}</span></p>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExam(exam)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteExam(exam.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getFilteredExams('uts').length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Belum ada ujian UTS yang terdaftar</p>
                      <Button 
                        onClick={() => handleOpenForm('uts')}
                        className="mt-4"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah UTS Pertama
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="uas" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredExams('uas').map((exam) => (
                  <Card key={exam.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{exam.courseName}</CardTitle>
                          <CardDescription>Kode: {exam.courseCode}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getExamTypeColor(exam.examType)}>
                            {getExamTypeLabel(exam.examType)}
                          </Badge>
                          <Badge variant="outline">Semester {exam.semester}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Tanggal Ujian</p>
                            <p className="font-medium">{formatDate(exam.examDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Waktu</p>
                            <p className="font-medium">{exam.examTime} ({exam.duration} menit)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Penanggung Jawab</p>
                            <p className="font-medium">{exam.coordinator}</p>
                          </div>
                        </div>
                      </div>
                      {exam.room && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Ruangan: <span className="font-medium">{exam.room}</span></p>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExam(exam)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteExam(exam.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getFilteredExams('uas').length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Belum ada ujian UAS yang terdaftar</p>
                      <Button 
                        onClick={() => handleOpenForm('uas')}
                        className="mt-4"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah UAS Pertama
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              {editingExam ? 'Edit' : 'Tambah'} {getExamTypeLabel(formData.examType)}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Kode Mata Kuliah *</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                  placeholder="contoh: MARS101"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester.toString()}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    semester: parseInt(value) as 1 | 2 | 3 | 4 
                  }))}
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

            <div className="space-y-2">
              <Label htmlFor="courseName">Nama Mata Kuliah *</Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                placeholder="contoh: Manajemen Strategis RS"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Tanggal Ujian *</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examTime">Jam Ujian *</Label>
                <Input
                  id="examTime"
                  type="time"
                  value={formData.examTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, examTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinator">Penanggung Jawab Mata Kuliah *</Label>
              <Input
                id="coordinator"
                value={formData.coordinator}
                onChange={(e) => setFormData(prev => ({ ...prev, coordinator: e.target.value }))}
                placeholder="contoh: Dr. Ahmad Susilo, M.Kes"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Ruangan</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="contoh: Ruang 201"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (menit)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 120 }))}
                  min="30"
                  max="300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Catatan tambahan untuk ujian"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-medical text-white">
                {editingExam ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}