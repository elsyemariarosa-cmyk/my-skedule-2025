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
import { MasterSchedule, SemesterType, AcademicYear, getCurrentAcademicYear, getCurrentSemesterType, getSemesterLabel, SEMESTER_MAPPING } from "@/types/master-schedule";
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

  const [masterSchedules, setMasterSchedules] = useState<MasterSchedule[]>([
    {
      id: '1',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      semester: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      semester: 3,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MasterSchedule | null>(null);
  const [formData, setFormData] = useState({
    academicYear: getCurrentAcademicYear(),
    semesterType: getCurrentSemesterType() as SemesterType,
    semester: 1 as 1 | 2 | 3 | 4,
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

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setFormData({
      academicYear: getCurrentAcademicYear(),
      semesterType: getCurrentSemesterType(),
      semester: 1,
      isActive: false
    });
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule: MasterSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      academicYear: schedule.academicYear,
      semesterType: schedule.semesterType,
      semester: schedule.semester,
      isActive: schedule.isActive
    });
    setIsFormOpen(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setMasterSchedules(prev => prev.filter(s => s.id !== scheduleId));
    toast({
      title: "Kalender akademik dihapus",
      description: "Kalender akademik berhasil dihapus.",
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSchedule) {
      // Edit existing schedule
      setMasterSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { 
              ...schedule, 
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : schedule
      ));
      
      toast({
        title: "Kalender akademik diperbarui",
        description: "Kalender akademik berhasil diperbarui.",
      });
    } else {
      // Add new schedule
      const newSchedule: MasterSchedule = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMasterSchedules(prev => [...prev, newSchedule]);
      
      toast({
        title: "Kalender akademik ditambahkan",
        description: "Kalender akademik baru berhasil ditambahkan.",
      });
    }
    
    setIsFormOpen(false);
  };

  const handleToggleScheduleActive = (scheduleId: string) => {
    setMasterSchedules(prev => prev.map(schedule => ({
      ...schedule,
      isActive: schedule.id === scheduleId ? !schedule.isActive : schedule.isActive
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

          <Tabs defaultValue="schedules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedules">Kalender Akademik</TabsTrigger>
              <TabsTrigger value="academic-years">Tahun Akademik</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedules" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daftar Kalender Akademik</h3>
                <Button onClick={handleAddSchedule} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kalender Akademik
                </Button>
              </div>
              
              <div className="grid gap-3">
                {masterSchedules.map((schedule) => (
                  <Card key={schedule.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={schedule.isActive ? "default" : "secondary"}>
                          {schedule.academicYear}
                        </Badge>
                        <Badge variant="outline" className={schedule.semesterType === 'ganjil' ? 'border-primary text-primary' : 'border-medical text-medical'}>
                          {getSemesterLabel(schedule.semesterType)} - Semester {schedule.semester}
                        </Badge>
                        {schedule.isActive && (
                          <Badge variant="default" className="bg-green-500">
                            Aktif
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.isActive}
                          onCheckedChange={() => handleToggleScheduleActive(schedule.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
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
              {editingSchedule ? 'Edit Kalender Akademik' : 'Tambah Kalender Akademik Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
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
              <Label htmlFor="semesterType">Jenis Semester *</Label>
              <Select 
                value={formData.semesterType} 
                onValueChange={(value: SemesterType) => {
                  const availableSemesters = getAvailableSemesters(value);
                  setFormData(prev => ({ 
                    ...prev, 
                    semesterType: value,
                    semester: availableSemesters[0] as 1 | 2 | 3 | 4
                  }));
                }}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganjil">Semester Ganjil (1, 3)</SelectItem>
                  <SelectItem value="genap">Semester Genap (2, 4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select 
                value={formData.semester.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, semester: parseInt(value) as 1 | 2 | 3 | 4 }))}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSemesters(formData.semesterType).map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Aktifkan kalender akademik ini</Label>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingSchedule ? 'Simpan Perubahan' : 'Tambah Kalender Akademik'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}