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
import { Calendar, Clock, User, MapPin, Plus, Edit, Trash2, Users, Monitor, FileText } from "lucide-react";
import { 
  ThesisActivity, 
  ThesisActivityType, 
  ExamMode,
  getThesisActivityTypeLabel, 
  getThesisActivityTypeColor,
  getExamModeLabel,
  getExamModeColor,
  SAMPLE_THESIS_ACTIVITIES 
} from "@/types/thesis";
import { useToast } from "@/hooks/use-toast";

interface ThesisManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThesisManager({ isOpen, onClose }: ThesisManagerProps) {
  const [activities, setActivities] = useState<ThesisActivity[]>(SAMPLE_THESIS_ACTIVITIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ThesisActivity | undefined>();
  const [activeTab, setActiveTab] = useState<ThesisActivityType>('seminar-proposal');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    activityType: 'seminar-proposal' as ThesisActivityType,
    studentName: '',
    studentId: '',
    supervisor1: '',
    supervisor2: '',
    examDate: '',
    examTime: '',
    examLocation: '',
    examMode: 'offline' as ExamMode,
    semester: 3 as 1 | 2 | 3 | 4,
    academicYear: '2024/2025',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      activityType: 'seminar-proposal',
      studentName: '',
      studentId: '',
      supervisor1: '',
      supervisor2: '',
      examDate: '',
      examTime: '',
      examLocation: '',
      examMode: 'offline',
      semester: 3,
      academicYear: '2024/2025',
      notes: ''
    });
    setEditingActivity(undefined);
  };

  const handleOpenForm = (activityType: ThesisActivityType) => {
    resetForm();
    setFormData(prev => ({ ...prev, activityType }));
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity: ThesisActivity) => {
    setFormData({
      activityType: activity.activityType,
      studentName: activity.studentName,
      studentId: activity.studentId || '',
      supervisor1: activity.supervisor1,
      supervisor2: activity.supervisor2,
      examDate: activity.examDate,
      examTime: activity.examTime,
      examLocation: activity.examLocation,
      examMode: activity.examMode,
      semester: activity.semester,
      academicYear: activity.academicYear,
      notes: activity.notes || ''
    });
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity && confirm(`Apakah Anda yakin ingin menghapus ${getThesisActivityTypeLabel(activity.activityType)} untuk ${activity.studentName}?`)) {
      setActivities(prev => prev.filter(a => a.id !== activityId));
      toast({
        title: "Kegiatan berhasil dihapus",
        description: `${getThesisActivityTypeLabel(activity.activityType)} - ${activity.studentName} telah dihapus.`,
      });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingActivity) {
      // Update existing activity
      setActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id 
          ? { 
              ...activity,
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : activity
      ));
      toast({
        title: "Kegiatan berhasil diperbarui",
        description: `${getThesisActivityTypeLabel(formData.activityType)} - ${formData.studentName} telah diperbarui.`,
      });
    } else {
      // Add new activity
      const newActivity: ThesisActivity = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setActivities(prev => [...prev, newActivity]);
      toast({
        title: "Kegiatan berhasil ditambahkan",
        description: `${getThesisActivityTypeLabel(formData.activityType)} - ${formData.studentName} telah ditambahkan.`,
      });
    }
    
    setIsFormOpen(false);
    resetForm();
  };

  const getFilteredActivities = (type: ThesisActivityType) => {
    return activities.filter(activity => activity.activityType === type).sort((a, b) => 
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

  const renderActivityCard = (activity: ThesisActivity) => (
    <Card key={activity.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{activity.studentName}</CardTitle>
            <CardDescription>NIM: {activity.studentId}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getThesisActivityTypeColor(activity.activityType)}>
              {getThesisActivityTypeLabel(activity.activityType)}
            </Badge>
            <Badge className={getExamModeColor(activity.examMode)}>
              {getExamModeLabel(activity.examMode)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tanggal & Waktu</p>
                <p className="font-medium">{formatDate(activity.examDate)}</p>
                <p className="text-sm">{activity.examTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tempat Pelaksanaan</p>
                <p className="font-medium">{activity.examLocation}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Pembimbing 1</p>
                <p className="font-medium">{activity.supervisor1}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Pembimbing 2</p>
                <p className="font-medium">{activity.supervisor2}</p>
              </div>
            </div>
          </div>
        </div>
        
        {activity.notes && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Catatan:</p>
            <p className="text-sm">{activity.notes}</p>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditActivity(activity)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteActivity(activity.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (type: ThesisActivityType) => (
    <Card>
      <CardContent className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Belum ada {getThesisActivityTypeLabel(type)} yang terdaftar</p>
        <Button 
          onClick={() => handleOpenForm(type)}
          className="mt-4"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah {getThesisActivityTypeLabel(type)} Pertama
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Manajemen Seminar & Tesis
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ThesisActivityType)} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="seminar-proposal">Seminar Proposal</TabsTrigger>
                <TabsTrigger value="seminar-hasil">Seminar Hasil</TabsTrigger>
                <TabsTrigger value="ujian-tesis">Ujian Tesis</TabsTrigger>
              </TabsList>
              <Button 
                onClick={() => handleOpenForm(activeTab)}
                className="bg-gradient-to-r from-primary to-medical text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah {getThesisActivityTypeLabel(activeTab)}
              </Button>
            </div>

            <TabsContent value="seminar-proposal" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredActivities('seminar-proposal').map(renderActivityCard)}
                {getFilteredActivities('seminar-proposal').length === 0 && renderEmptyState('seminar-proposal')}
              </div>
            </TabsContent>

            <TabsContent value="seminar-hasil" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredActivities('seminar-hasil').map(renderActivityCard)}
                {getFilteredActivities('seminar-hasil').length === 0 && renderEmptyState('seminar-hasil')}
              </div>
            </TabsContent>

            <TabsContent value="ujian-tesis" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredActivities('ujian-tesis').map(renderActivityCard)}
                {getFilteredActivities('ujian-tesis').length === 0 && renderEmptyState('ujian-tesis')}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editingActivity ? 'Edit' : 'Tambah'} {getThesisActivityTypeLabel(formData.activityType)}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nama Mahasiswa *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="contoh: Ahmad Fauzi"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">NIM</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  placeholder="contoh: 20210001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor1">Nama Dosen Pembimbing 1 *</Label>
                <Input
                  id="supervisor1"
                  value={formData.supervisor1}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisor1: e.target.value }))}
                  placeholder="contoh: Dr. Ahmad Susilo, M.Kes"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor2">Nama Dosen Pembimbing 2 *</Label>
                <Input
                  id="supervisor2"
                  value={formData.supervisor2}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisor2: e.target.value }))}
                  placeholder="contoh: Prof. Dr. Siti Rahayu, M.M"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Tanggal Pelaksanaan *</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examTime">Jam Pelaksanaan *</Label>
                <Input
                  id="examTime"
                  type="time"
                  value={formData.examTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, examTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examLocation">Tempat Pelaksanaan Ujian *</Label>
                <Input
                  id="examLocation"
                  value={formData.examLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, examLocation: e.target.value }))}
                  placeholder="contoh: Ruang Seminar 1 / Via Zoom Meeting"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examMode">Sifat Ujian *</Label>
                <Select
                  value={formData.examMode}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    examMode: value as ExamMode 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
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
              <div className="space-y-2">
                <Label htmlFor="academicYear">Tahun Akademik</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="contoh: 2024/2025"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Catatan tambahan atau judul penelitian"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-medical text-white">
                {editingActivity ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}