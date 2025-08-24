import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleItem, ActivityType, ACTIVITY_TYPES, TimeSlot } from "@/types/schedule";

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ScheduleItem, 'id'>) => void;
  editItem?: ScheduleItem;
  preselectedDay?: 'friday' | 'saturday';
  preselectedTimeSlot?: TimeSlot;
}

export function ScheduleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editItem,
  preselectedDay,
  preselectedTimeSlot 
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'>>({
    title: editItem?.title || '',
    type: editItem?.type || 'kuliah',
    day: editItem?.day || preselectedDay || 'friday',
    startTime: editItem?.startTime || preselectedTimeSlot?.start || '13:00',
    endTime: editItem?.endTime || preselectedTimeSlot?.end || '15:00',
    semester: editItem?.semester || 1,
    instructor: editItem?.instructor || '',
    room: editItem?.room || '',
    description: editItem?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    
    // Reset form if not editing
    if (!editItem) {
      setFormData({
        title: '',
        type: 'kuliah',
        day: preselectedDay || 'friday',
        startTime: preselectedTimeSlot?.start || '13:00',
        endTime: preselectedTimeSlot?.end || '15:00',
        semester: 1,
        instructor: '',
        room: '',
        description: ''
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
                  {Object.entries(ACTIVITY_TYPES).map(([key, type]) => (
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
              <Select value={formData.day} onValueChange={(value: 'friday' | 'saturday') => updateField('day', value)}>
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friday">Jumat (13:00-21:00)</SelectItem>
                  <SelectItem value="saturday">Sabtu (08:00-18:00)</SelectItem>
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
              <Label htmlFor="room">Ruangan</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => updateField('room', e.target.value)}
                placeholder="Ruang kelas"
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Keterangan</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Keterangan tambahan (opsional)"
              rows={3}
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