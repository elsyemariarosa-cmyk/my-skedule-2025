import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScheduleItem, ActivityType, ActivityTypeConfig, TimeSlot } from "@/types/schedule";
import { StudentClass, getClassTypeColor } from "@/types/student-class";

// Daftar negara untuk residensial
const COUNTRIES = [
  'Indonesia',
  'Malaysia',
  'Singapura',
  'Thailand', 
  'Filipina',
  'Vietnam',
  'Australia',
  'Jepang',
  'Korea Selatan',
  'China',
  'India',
  'Amerika Serikat',
  'Kanada',
  'Inggris',
  'Jerman',
  'Belanda',
  'Swiss',
  'Swedia',
  'Denmark',
  'Norwegia'
];

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ScheduleItem, 'id'>) => void;
  activityTypes: Record<string, ActivityTypeConfig>;
  studentClasses: StudentClass[];
  editItem?: ScheduleItem;
  preselectedDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  preselectedTimeSlot?: TimeSlot;
}

export function ScheduleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  activityTypes,
  studentClasses,
  editItem,
  preselectedDay,
  preselectedTimeSlot 
}: ScheduleFormProps) {
  const defaultType = Object.keys(activityTypes)[0] || 'kuliah';
  const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'>>({
    title: editItem?.title || '',
    type: editItem?.type || defaultType,
    day: editItem?.day || preselectedDay || 'friday',
    startTime: editItem?.startTime || preselectedTimeSlot?.start || '13:00',
    endTime: editItem?.endTime || preselectedTimeSlot?.end || '15:00',
    semester: editItem?.semester || 1,
    instructor: editItem?.instructor || '',
    substituteInstructor: editItem?.substituteInstructor || '',
    room: editItem?.room || '',
    description: editItem?.description || '',
    classIds: editItem?.classIds || [],
    residencyStartDate: editItem?.residencyStartDate || '',
    residencyEndDate: editItem?.residencyEndDate || '',
    residencyCountry: editItem?.residencyCountry || ''
  });

  const isResidencyType = formData.type === 'residensi';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    
    // Reset form if not editing
    if (!editItem) {
      setFormData({
        title: '',
        type: defaultType,
        day: preselectedDay || 'friday',
        startTime: preselectedTimeSlot?.start || '13:00',
        endTime: preselectedTimeSlot?.end || '15:00',
        semester: 1,
        instructor: '',
        substituteInstructor: '',
        room: '',
        description: '',
        classIds: [],
        residencyStartDate: '',
        residencyEndDate: '',
        residencyCountry: ''
      });
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent">
            {editItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Kegiatan *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Masukkan nama kegiatan"
                required
                className="transition-colors focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Kegiatan *</Label>
              <Select value={formData.type} onValueChange={(value: ActivityType) => updateField('type', value)}>
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Hari *</Label>
              <Select value={formData.day} onValueChange={(value: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday') => updateField('day', value)}>
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Senin</SelectItem>
                  <SelectItem value="tuesday">Selasa</SelectItem>
                  <SelectItem value="wednesday">Rabu</SelectItem>
                  <SelectItem value="thursday">Kamis</SelectItem>
                  <SelectItem value="friday">Jumat</SelectItem>
                  <SelectItem value="saturday">Sabtu</SelectItem>
                  <SelectItem value="sunday">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Jam Mulai *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                required
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Jam Selesai *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                required
                className="focus:ring-primary"
              />
            </div>
          </div>

          {/* Residency-specific fields */}
          {isResidencyType && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                📍 Informasi Residensial
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="residencyStartDate">Tanggal Mulai Residensial *</Label>
                  <Input
                    id="residencyStartDate"
                    type="date"
                    value={formData.residencyStartDate}
                    onChange={(e) => updateField('residencyStartDate', e.target.value)}
                    required={isResidencyType}
                    className="focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residencyEndDate">Tanggal Selesai Residensial *</Label>
                  <Input
                    id="residencyEndDate"
                    type="date"
                    value={formData.residencyEndDate}
                    onChange={(e) => updateField('residencyEndDate', e.target.value)}
                    required={isResidencyType}
                    className="focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="residencyCountry">Negara Tempat Residensial *</Label>
                <Select 
                  value={formData.residencyCountry} 
                  onValueChange={(value) => updateField('residencyCountry', value)}
                >
                  <SelectTrigger className="focus:ring-primary bg-background">
                    <SelectValue placeholder="Pilih negara tempat residensial" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border shadow-lg z-[100] max-h-[200px] overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country} className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select 
                value={formData.semester.toString()} 
                onValueChange={(value) => updateField('semester', parseInt(value) as 1 | 2 | 3 | 4)}
              >
                <SelectTrigger className="focus:ring-primary">
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
              <Label htmlFor="instructor">Dosen/Instruktur</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => updateField('instructor', e.target.value)}
                placeholder="Nama dosen"
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">{isResidencyType ? 'Lokasi/Institusi' : 'Ruangan'}</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => updateField('room', e.target.value)}
                placeholder={isResidencyType ? 'Nama rumah sakit/institusi' : 'Ruang kelas'}
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="substituteInstructor">Dosen Pengganti</Label>
              <Input
                id="substituteInstructor"
                value={formData.substituteInstructor}
                onChange={(e) => updateField('substituteInstructor', e.target.value)}
                placeholder="Nama dosen pengganti (jika ada)"
                className="focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Isi jika ada dosen yang berhalangan hadir
              </p>
            </div>
          </div>

          {/* Student Classes Section */}
          <div className="space-y-3">
            <Label>Kelas Mahasiswa</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentClasses.filter(c => c.isActive).map((studentClass) => (
                <div key={studentClass.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={`class-${studentClass.id}`}
                    checked={formData.classIds?.includes(studentClass.id) || false}
                    onCheckedChange={(checked) => {
                      const currentClassIds = formData.classIds || [];
                      if (checked) {
                        updateField('classIds', [...currentClassIds, studentClass.id]);
                      } else {
                        updateField('classIds', currentClassIds.filter(id => id !== studentClass.id));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`class-${studentClass.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Badge className={getClassTypeColor(studentClass.type)}>
                      {studentClass.code}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{studentClass.name}</span>
                      {studentClass.currentCapacity && studentClass.maxCapacity && (
                        <span className="text-xs text-muted-foreground">
                          {studentClass.currentCapacity}/{studentClass.maxCapacity} mahasiswa
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            {studentClasses.filter(c => c.isActive).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada kelas mahasiswa aktif. Tambahkan kelas di menu "Kelola Kelas Mahasiswa".
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{isResidencyType ? 'Program/Deskripsi Residensial' : 'Keterangan'}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder={isResidencyType ? 'Deskripsi program residensial, aktivitas yang akan dilakukan, dll.' : 'Keterangan tambahan (opsional)'}
              rows={isResidencyType ? 4 : 3}
              className="focus:ring-primary resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-medical hover:from-primary/80 hover:to-medical/80 transition-all duration-300"
            >
              {editItem ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}