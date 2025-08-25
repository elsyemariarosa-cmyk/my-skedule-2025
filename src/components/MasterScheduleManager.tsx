import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Calendar, BookOpen, Settings } from "lucide-react";
import { MasterSchedule, AcademicActivity, SemesterType, AcademicYear, getCurrentAcademicYear, getCurrentSemesterType, getSemesterLabel, SEMESTER_MAPPING } from "@/types/master-schedule";
import { useToast } from "@/hooks/use-toast";

interface MasterScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MasterScheduleManager({ isOpen, onClose }: MasterScheduleManagerProps) {
  const { toast } = useToast();
  
  // Sample data - in real app this would come from backend
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const currentYear = getCurrentAcademicYear();
    const years = [];
    const baseYear = new Date().getFullYear();
    
    for (let i = -2; i <= 2; i++) {
      const year = baseYear + i;
      const yearString = `${year}/${year + 1}`;
      years.push({
        id: `ay-${year}`,
        year: yearString,
        isActive: yearString === currentYear
      });
    }
    return years;
  });

  const [academicActivities, setAcademicActivities] = useState<AcademicActivity[]>([
    {
      id: '1',
      name: 'Pendaftaran Semester Ganjil',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Perkuliahan Semester Ganjil',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Pendaftaran Semester Genap',
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'genap',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<AcademicActivity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    academicYear: getCurrentAcademicYear(),
    semesterType: getCurrentSemesterType() as SemesterType,
    isActive: false
  });

  const handleAddAcademicYear = () => {
    const newYear = prompt("Masukkan tahun akademik (format: 2024/2025):");
    if (newYear && /^\d{4}\/\d{4}$/.test(newYear)) {
      const newAcademicYear: AcademicYear = {
        id: `ay-${Date.now()}`,
        year: newYear,
        isActive: false
      };
      setAcademicYears(prev => [...prev, newAcademicYear].sort((a, b) => a.year.localeCompare(b.year)));
      
      toast({
        title: "Tahun akademik berhasil ditambahkan",
        description: `Tahun akademik ${newYear} telah ditambahkan.`,
      });
    }
  };

  const handleToggleAcademicYearActive = (yearId: string) => {
    setAcademicYears(prev => prev.map(year => ({
      ...year,
      isActive: year.id === yearId ? !year.isActive : year.isActive
    })));
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      academicYear: getCurrentAcademicYear(),
      semesterType: getCurrentSemesterType(),
      isActive: false
    });
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity: AcademicActivity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      startDate: activity.startDate,
      endDate: activity.endDate,
      academicYear: activity.academicYear,
      semesterType: activity.semesterType,
      isActive: activity.isActive
    });
    setIsFormOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    setAcademicActivities(prev => prev.filter(a => a.id !== activityId));
    toast({
      title: "Kegiatan akademik dihapus",
      description: "Kegiatan akademik berhasil dihapus.",
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Nama kegiatan, tanggal mulai, dan tanggal selesai harus diisi.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Error",
        description: "Tanggal mulai tidak boleh lebih besar dari tanggal selesai.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingActivity) {
      // Edit existing activity
      setAcademicActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id 
          ? { 
              ...activity, 
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : activity
      ));
      
      toast({
        title: "Kegiatan akademik diperbarui",
        description: "Kegiatan akademik berhasil diperbarui.",
      });
    } else {
      // Add new activity
      const newActivity: AcademicActivity = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAcademicActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Kegiatan akademik ditambahkan",
        description: "Kegiatan akademik baru berhasil ditambahkan.",
      });
    }
    
    setIsFormOpen(false);
  };

  const handleToggleActivityActive = (activityId: string) => {
    setAcademicActivities(prev => prev.map(activity => ({
      ...activity,
      isActive: activity.id === activityId ? !activity.isActive : activity.isActive
    })));
  };

  const getAvailableSemesters = (semesterType: SemesterType) => {
    return SEMESTER_MAPPING[semesterType];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Kalender Akademik Perkuliahan
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Kegiatan Akademik</TabsTrigger>
              <TabsTrigger value="academic-years">Tahun Akademik</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daftar Kegiatan Akademik</h3>
                <Button onClick={handleAddActivity} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kegiatan
                </Button>
              </div>
              
              <div className="space-y-3">
                {['ganjil', 'genap'].map((semesterType) => (
                  <div key={semesterType} className="space-y-2">
                    <h4 className={`text-md font-semibold ${semesterType === 'ganjil' ? 'text-primary' : 'text-medical'}`}>
                      {getSemesterLabel(semesterType as SemesterType)}
                    </h4>
                    <div className="grid gap-2 ml-4">
                      {academicActivities
                        .filter(activity => activity.semesterType === semesterType)
                        .map((activity) => (
                        <Card key={activity.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium">{activity.name}</span>
                                <Badge variant={activity.isActive ? "default" : "secondary"}>
                                  {activity.academicYear}
                                </Badge>
                                {activity.isActive && (
                                  <Badge variant="default" className="bg-green-500">
                                    Aktif
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(activity.startDate).toLocaleDateString('id-ID')} - {new Date(activity.endDate).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={activity.isActive}
                                onCheckedChange={() => handleToggleActivityActive(activity.id)}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditActivity(activity)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {academicActivities.filter(a => a.semesterType === semesterType).length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          Belum ada kegiatan untuk {getSemesterLabel(semesterType as SemesterType)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="academic-years" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tahun Akademik</h3>
                <Button onClick={handleAddAcademicYear} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tahun Akademik
                </Button>
              </div>
              
              <div className="grid gap-3">
                {academicYears.map((year) => (
                  <Card key={year.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium">{year.year}</span>
                        {year.isActive && (
                          <Badge variant="default" className="bg-green-500">
                            Aktif
                          </Badge>
                        )}
                      </div>
                      
                      <Switch
                        checked={year.isActive}
                        onCheckedChange={() => handleToggleAcademicYearActive(year.id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? 'Edit Kegiatan Akademik' : 'Tambah Kegiatan Akademik Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kegiatan *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Pendaftaran, Perkuliahan, UTS, UAS"
                className="focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Tahun Akademik *</Label>
              <Select 
                value={formData.academicYear} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.year}>
                      {year.year} {year.isActive && '(Aktif)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semesterType">Semester *</Label>
              <Select 
                value={formData.semesterType} 
                onValueChange={(value: SemesterType) => setFormData(prev => ({ ...prev, semesterType: value }))}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganjil">Semester Ganjil</SelectItem>
                  <SelectItem value="genap">Semester Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Aktifkan kegiatan ini</Label>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingActivity ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}