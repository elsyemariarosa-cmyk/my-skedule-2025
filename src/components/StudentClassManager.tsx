import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, GraduationCap, Award } from "lucide-react";
import { StudentClass, ClassType, CLASS_TYPE_CONFIG, getClassTypeLabel } from "@/types/student-class";
import { getCurrentAcademicYear } from "@/types/master-schedule";
import { useToast } from "@/hooks/use-toast";

interface StudentClassManagerProps {
  isOpen: boolean;
  onClose: () => void;
  studentClasses: StudentClass[];
  onUpdateStudentClasses: (classes: StudentClass[]) => void;
}

export function StudentClassManager({ 
  isOpen, 
  onClose, 
  studentClasses, 
  onUpdateStudentClasses 
}: StudentClassManagerProps) {
  const [editingClass, setEditingClass] = useState<StudentClass | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'reguler' as ClassType,
    code: '',
    description: '',
    academicYearBatch: getCurrentAcademicYear(),
    maxCapacity: 25,
    currentCapacity: 0,
    isActive: true
  });
  
  const { toast } = useToast();

  const regulerClasses = studentClasses.filter(c => c.type === 'reguler');
  const rplClasses = studentClasses.filter(c => c.type === 'rpl');

  const handleAddNew = (type?: ClassType) => {
    setEditingClass(null);
    const selectedType = type || 'reguler';
    const prefix = CLASS_TYPE_CONFIG[selectedType].defaultPrefix;
    const existingCount = studentClasses.filter(c => c.type === selectedType).length;
    
    setFormData({
      name: selectedType === 'reguler' ? `Reguler ${String.fromCharCode(65 + existingCount)}` : `RPL ${existingCount + 1}`,
      type: selectedType,
      code: `${prefix}-${selectedType === 'reguler' ? String.fromCharCode(65 + existingCount) : (existingCount + 1)}`,
      description: selectedType === 'reguler' ? `Kelas Reguler ${String.fromCharCode(65 + existingCount)}` : `Kelas Recognisi Pembelajaran Lampau ${existingCount + 1}`,
      academicYearBatch: getCurrentAcademicYear(),
      maxCapacity: selectedType === 'reguler' ? 25 : 30,
      currentCapacity: 0,
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleEdit = (studentClass: StudentClass) => {
    setEditingClass(studentClass);
    setFormData({
      name: studentClass.name,
      type: studentClass.type,
      code: studentClass.code,
      description: studentClass.description,
      academicYearBatch: studentClass.academicYearBatch,
      maxCapacity: studentClass.maxCapacity || 25,
      currentCapacity: studentClass.currentCapacity || 0,
      isActive: studentClass.isActive
    });
    setIsFormOpen(true);
  };

  const handleDelete = (classId: string) => {
    const classToDelete = studentClasses.find(c => c.id === classId);
    if (!classToDelete) return;

    const newClasses = studentClasses.filter(c => c.id !== classId);
    onUpdateStudentClasses(newClasses);
    
    toast({
      title: "Kelas dihapus",
      description: `Kelas "${classToDelete.name}" berhasil dihapus.`,
    });
  };

  const handleToggleActive = (classId: string) => {
    const newClasses = studentClasses.map(c => 
      c.id === classId ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c
    );
    onUpdateStudentClasses(newClasses);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate codes
    const existingClass = studentClasses.find(c => 
      c.code.toLowerCase() === formData.code.toLowerCase() && 
      (!editingClass || c.id !== editingClass.id)
    );
    
    if (existingClass) {
      toast({
        title: "Error",
        description: "Kode kelas sudah digunakan.",
        variant: "destructive"
      });
      return;
    }

    if (editingClass) {
      // Update existing class
      const newClasses = studentClasses.map(c => 
        c.id === editingClass.id 
          ? { 
              ...c, 
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : c
      );
      onUpdateStudentClasses(newClasses);
      
      toast({
        title: "Kelas diperbarui",
        description: `"${formData.name}" berhasil diperbarui.`,
      });
    } else {
      // Add new class
      const newClass: StudentClass = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onUpdateStudentClasses([...studentClasses, newClass]);
      
      toast({
        title: "Kelas ditambahkan",
        description: `"${formData.name}" berhasil ditambahkan.`,
      });
    }

    setIsFormOpen(false);
  };

  const renderClassCard = (studentClass: StudentClass) => (
    <Card key={studentClass.id} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={CLASS_TYPE_CONFIG[studentClass.type].color}>
            {studentClass.code}
          </Badge>
          <div>
            <p className="font-medium text-sm">{studentClass.name}</p>
            <p className="text-xs text-muted-foreground">{studentClass.description}</p>
            <p className="text-xs text-muted-foreground">Angkatan: {studentClass.academicYearBatch}</p>
            {studentClass.maxCapacity && (
              <p className="text-xs text-muted-foreground">
                Kapasitas: {studentClass.currentCapacity || 0}/{studentClass.maxCapacity}
              </p>
            )}
          </div>
          {!studentClass.isActive && (
            <Badge variant="secondary">Non-aktif</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={studentClass.isActive}
            onCheckedChange={() => handleToggleActive(studentClass.id)}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(studentClass)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(studentClass.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Kelola Kelas Mahasiswa
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="reguler" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reguler" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Kelas Reguler ({regulerClasses.length})
              </TabsTrigger>
              <TabsTrigger value="rpl" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Kelas RPL ({rplClasses.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reguler" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Kelas Reguler</h3>
                  <p className="text-sm text-muted-foreground">Mahasiswa program reguler</p>
                </div>
                <Button onClick={() => handleAddNew('reguler')} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kelas Reguler
                </Button>
              </div>
              
              <div className="grid gap-3">
                {regulerClasses.map(renderClassCard)}
                {regulerClasses.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Belum ada kelas reguler</p>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="rpl" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Kelas RPL</h3>
                  <p className="text-sm text-muted-foreground">Recognisi Pembelajaran Lampau</p>
                </div>
                <Button onClick={() => handleAddNew('rpl')} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kelas RPL
                </Button>
              </div>
              
              <div className="grid gap-3">
                {rplClasses.map(renderClassCard)}
                {rplClasses.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Belum ada kelas RPL</p>
                  </Card>
                )}
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
              {editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelas *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Reguler A, RPL 1"
                  required
                  className="focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Kode Kelas *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="REG-A, RPL-1"
                  required
                  className="focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYearBatch">Angkatan Tahun Akademik *</Label>
              <Select 
                value={formData.academicYearBatch} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, academicYearBatch: value }))}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2030/2031">2030/2031</SelectItem>
                  <SelectItem value="2029/2030">2029/2030</SelectItem>
                  <SelectItem value="2028/2029">2028/2029</SelectItem>
                  <SelectItem value="2027/2028">2027/2028</SelectItem>
                  <SelectItem value="2026/2027">2026/2027</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Kelas *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: ClassType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reguler">
                    <div className="flex flex-col">
                      <span>Kelas Reguler</span>
                      <span className="text-xs text-muted-foreground">Mahasiswa program reguler</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rpl">
                    <div className="flex flex-col">
                      <span>Kelas RPL</span>
                      <span className="text-xs text-muted-foreground">Recognisi Pembelajaran Lampau</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi kelas"
                rows={2}
                className="focus:ring-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Kapasitas Maksimal</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 25 }))}
                  className="focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCapacity">Jumlah Mahasiswa Saat Ini</Label>
                <Input
                  id="currentCapacity"
                  type="number"
                  min="0"
                  max={formData.maxCapacity}
                  value={formData.currentCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentCapacity: parseInt(e.target.value) || 0 }))}
                  className="focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Aktifkan kelas ini</Label>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingClass ? 'Simpan Perubahan' : 'Tambah Kelas'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}