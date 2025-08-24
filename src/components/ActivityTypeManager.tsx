import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Palette } from "lucide-react";
import { ActivityTypeConfig } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";

interface ActivityTypeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  activityTypes: Record<string, ActivityTypeConfig>;
  onUpdateActivityTypes: (types: Record<string, ActivityTypeConfig>) => void;
}

const COLOR_OPTIONS = [
  { name: 'Primary', class: 'bg-primary text-primary-foreground', value: 'primary' },
  { name: 'Medical', class: 'bg-medical text-medical-foreground', value: 'medical' },
  { name: 'Academic', class: 'bg-academic text-academic-foreground', value: 'academic' },
  { name: 'Accent', class: 'bg-accent text-accent-foreground', value: 'accent' },
  { name: 'Secondary', class: 'bg-secondary text-secondary-foreground', value: 'secondary' },
  { name: 'Destructive', class: 'bg-destructive text-destructive-foreground', value: 'destructive' },
  { name: 'Muted', class: 'bg-muted text-muted-foreground', value: 'muted' },
];

export function ActivityTypeManager({ 
  isOpen, 
  onClose, 
  activityTypes, 
  onUpdateActivityTypes 
}: ActivityTypeManagerProps) {
  const [editingType, setEditingType] = useState<{key: string; config: ActivityTypeConfig} | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    description: '',
    colorValue: 'primary'
  });
  
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingType(null);
    setFormData({
      key: '',
      label: '',
      description: '',
      colorValue: 'primary'
    });
    setIsFormOpen(true);
  };

  const handleEdit = (key: string, config: ActivityTypeConfig) => {
    setEditingType({ key, config });
    const colorOption = COLOR_OPTIONS.find(c => config.color.includes(c.value));
    setFormData({
      key,
      label: config.label,
      description: config.description,
      colorValue: colorOption?.value || 'primary'
    });
    setIsFormOpen(true);
  };

  const handleDelete = (key: string) => {
    const newTypes = { ...activityTypes };
    delete newTypes[key];
    onUpdateActivityTypes(newTypes);
    
    toast({
      title: "Jenis kegiatan dihapus",
      description: `Jenis kegiatan "${activityTypes[key].label}" berhasil dihapus.`,
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colorOption = COLOR_OPTIONS.find(c => c.value === formData.colorValue);
    const newConfig: ActivityTypeConfig = {
      label: formData.label,
      description: formData.description,
      color: colorOption?.class || 'bg-primary text-primary-foreground'
    };

    const newTypes = { ...activityTypes };
    
    if (editingType) {
      // Editing existing type
      if (editingType.key !== formData.key && formData.key in activityTypes) {
        toast({
          title: "Error",
          description: "Kode jenis kegiatan sudah digunakan.",
          variant: "destructive"
        });
        return;
      }
      
      if (editingType.key !== formData.key) {
        // Key changed, need to rename
        delete newTypes[editingType.key];
        newTypes[formData.key] = newConfig;
      } else {
        newTypes[formData.key] = newConfig;
      }
      
      toast({
        title: "Jenis kegiatan diperbarui",
        description: `"${formData.label}" berhasil diperbarui.`,
      });
    } else {
      // Adding new type
      if (formData.key in activityTypes) {
        toast({
          title: "Error", 
          description: "Kode jenis kegiatan sudah digunakan.",
          variant: "destructive"
        });
        return;
      }
      
      newTypes[formData.key] = newConfig;
      
      toast({
        title: "Jenis kegiatan ditambahkan",
        description: `"${formData.label}" berhasil ditambahkan.`,
      });
    }

    onUpdateActivityTypes(newTypes);
    setIsFormOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent">
              Kelola Jenis Kegiatan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Button 
              onClick={handleAddNew}
              className="w-full bg-gradient-to-r from-primary to-medical hover:from-primary/80 hover:to-medical/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jenis Kegiatan Baru
            </Button>

            <div className="grid gap-3">
              {Object.entries(activityTypes).map(([key, config]) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={config.color}>
                        {config.label}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">Kode: {key}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(key, config)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(key)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

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
              {editingType ? 'Edit Jenis Kegiatan' : 'Tambah Jenis Kegiatan Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">Kode Kegiatan *</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="contoh: workshop, seminar-khusus"
                required
                className="focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Kode unik untuk jenis kegiatan (tanpa spasi, gunakan tanda hubung)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Nama Kegiatan *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Workshop, Seminar Khusus, dll"
                required
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang jenis kegiatan ini"
                rows={2}
                className="focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Warna Badge</Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, colorValue: color.value }))}
                    className={`p-2 rounded-md border-2 transition-all ${
                      formData.colorValue === color.value 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Badge className={`${color.class} w-full justify-center text-xs`}>
                      {color.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingType ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}