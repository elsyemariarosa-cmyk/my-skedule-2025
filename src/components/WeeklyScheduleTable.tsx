import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, BookOpen, CalendarIcon } from "lucide-react";
import { ActivityTypeConfig } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ScheduleEntry {
  id: string;
  classId: string;
  courseName: string;
  instructor: string;
  day: 'friday' | 'saturday';
  timeSlot: string;
  date: string;
  activityType: string;
  room?: string;
  description?: string;
  semester: 1 | 2 | 3 | 4;
}

interface WeeklyScheduleTableProps {
  isOpen: boolean;
  onClose: () => void;
  studentClasses: StudentClass[];
  activityTypes: Record<string, ActivityTypeConfig>;
}

const TIME_SLOTS = [
  { time: '13.00-15.00', label: '13.00-15.00' },
  { time: '15.30-18.00', label: '15.30-18.00' },
  { time: '19.00-21.30', label: '19.00-21.30' }
];

const SATURDAY_TIME_SLOTS = [
  { time: '09.00-11.30', label: '09.00-11.30' },
  { time: '12.30-15.00', label: '12.30-15.00' },
  { time: '15.30-18.00', label: '15.30-18.00' }
];

export function WeeklyScheduleTable({
  isOpen,
  onClose,
  studentClasses,
  activityTypes
}: WeeklyScheduleTableProps) {
  const [selectedTabClass, setSelectedTabClass] = useState<string>('');
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    courseName: '',
    instructor: '',
    day: 'friday' as 'friday' | 'saturday',
    timeSlot: '',
    date: '',
    activityType: '',
    room: '',
    description: '',
    semester: 3 as 1 | 2 | 3 | 4
  });
  const { toast } = useToast();

  // Set initial tab when dialog opens
  useEffect(() => {
    if (isOpen && studentClasses.length > 0 && !selectedTabClass) {
      setSelectedTabClass(studentClasses.filter(c => c.isActive)[0]?.id || '');
    }
  }, [isOpen, studentClasses, selectedTabClass]);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mars-weekly-schedule');
    if (saved) {
      setScheduleEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mars-weekly-schedule', JSON.stringify(scheduleEntries));
  }, [scheduleEntries]);

  const handleAddEntry = (classId: string, day: 'friday' | 'saturday', timeSlot: string) => {
    setEditingEntry(null);
    const defaultDate = new Date();
    setSelectedDate(defaultDate);
    setFormData({
      courseName: '',
      instructor: '',
      day,
      timeSlot,
      date: format(defaultDate, 'dd MMMM yyyy'),
      activityType: Object.keys(activityTypes)[0] || '',
      room: '',
      description: '',
      semester: 3
    });
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    // Parse the existing date string to a Date object
    const parsedDate = new Date(entry.date);
    setSelectedDate(parsedDate);
    setFormData({
      courseName: entry.courseName,
      instructor: entry.instructor,
      day: entry.day,
      timeSlot: entry.timeSlot,
      date: entry.date,
      activityType: entry.activityType,
      room: entry.room || '',
      description: entry.description || '',
      semester: entry.semester
    });
    setIsFormOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    const entry = scheduleEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    setScheduleEntries(prev => prev.filter(e => e.id !== entryId));
    toast({
      title: "Jadwal dihapus",
      description: `${entry.courseName} berhasil dihapus.`
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntry) {
      // Update existing entry
      setScheduleEntries(prev => prev.map(e => e.id === editingEntry.id ? {
        ...e,
        ...formData,
        classId: selectedTabClass
      } : e));
      toast({
        title: "Jadwal diperbarui",
        description: `${formData.courseName} berhasil diperbarui.`
      });
    } else {
      // Add new entry
      const newEntry: ScheduleEntry = {
        id: Date.now().toString(),
        classId: selectedTabClass,
        ...formData
      };
      setScheduleEntries(prev => [...prev, newEntry]);
      toast({
        title: "Jadwal ditambahkan",
        description: `${formData.courseName} berhasil ditambahkan.`
      });
    }
    
    setIsFormOpen(false);
  };

  const getEntryForSlot = (classId: string, day: 'friday' | 'saturday', timeSlot: string) => {
    return scheduleEntries.find(e => 
      e.classId === classId && 
      e.day === day && 
      e.timeSlot === timeSlot
    );
  };

  const createScheduleTable = (selectedClass: StudentClass) => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-2 border-border p-4">
          <h3 className="text-lg font-bold">
            JADWAL PERKULIAHAN : Semester..... Kelas : ......
          </h3>
          <p className="text-sm font-semibold mt-2">
            PRODI MARS UMY
          </p>
        </div>
        
        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-gray-100 font-bold text-center w-20">
                  Hari/Tgl
                </th>
                <th className="border border-black p-2 bg-gray-100 font-bold text-center w-20">
                  Waktu
                </th>
                {TIME_SLOTS.map((slot, index) => (
                  <th key={`friday-${index}`} className="border border-black p-2 bg-gray-100 font-bold text-center min-w-[250px]">
                    <div className="mb-2">Jumat, tanggal:</div>
                    <div className="text-sm">{slot.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold text-center align-top" rowSpan={2}>
                  Hari/Tgl
                </td>
                <td className="border border-black p-2 font-bold text-center">
                  Waktu
                </td>
                {TIME_SLOTS.map((slot, index) => {
                  const entry = getEntryForSlot(selectedClass.id, 'friday', slot.time);
                  return (
                    <td key={`friday-content-${index}`} className="border border-black p-2 relative group min-h-[120px] align-top">
                      <div className="mb-2">
                        <div className="font-bold text-sm">Mata Kuliah:</div>
                        {entry ? (
                          <div className="text-sm font-medium text-blue-800">
                            {entry.courseName}
                          </div>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        {entry && entry.description && (
                          <div className="text-xs text-gray-600 mb-2">
                            {entry.description}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-sm">Nama Dosen:</div>
                        {entry ? (
                          <div className="text-sm">
                            {entry.instructor}
                          </div>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {entry ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleAddEntry(selectedClass.id, 'friday', slot.time)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              {/* Saturday Row */}
              <tr>
                <td className="border border-black p-2 font-bold text-center">
                  Waktu
                </td>
                {SATURDAY_TIME_SLOTS.map((slot, index) => {
                  const entry = getEntryForSlot(selectedClass.id, 'saturday', slot.time);
                  return (
                    <td key={`saturday-content-${index}`} className="border border-black p-2 relative group min-h-[120px] align-top">
                      <div className="mb-1">
                        <div className="font-bold text-sm">Sabtu, tanggal:</div>
                        <div className="text-sm mb-2">{slot.label}</div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="font-bold text-sm">Mata Kuliah:</div>
                        {entry ? (
                          <div className="text-sm font-medium">
                            {entry.courseName}
                          </div>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        {entry && entry.description && (
                          <div className="text-xs text-gray-600 mb-2">
                            {entry.description}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-sm">Nama Dosen:</div>
                        {entry ? (
                          <div className="text-sm">
                            {entry.instructor}
                          </div>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {entry ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleAddEntry(selectedClass.id, 'saturday', slot.time)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Jadwal Perkuliahan Mingguan
          </h2>
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
            <TabsContent key={studentClass.id} value={studentClass.id} className="mt-6">
              {createScheduleTable(studentClass)}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseName">Nama Mata Kuliah</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructor">Nama Dosen</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="day">Hari</Label>
                <Select value={formData.day} onValueChange={(value: any) => setFormData(prev => ({ ...prev, day: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friday">Jumat</SelectItem>
                    <SelectItem value="saturday">Sabtu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeSlot">Waktu</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.day === 'friday' ? TIME_SLOTS : SATURDAY_TIME_SLOTS).map(slot => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setFormData(prev => ({ ...prev, date: format(date, "dd MMMM yyyy") }));
                        }
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activityType">Jenis Kegiatan</Label>
                <Select value={formData.activityType} onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}>
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
              <div>
                <Label htmlFor="room">Ruang</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Keterangan</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingEntry ? 'Perbarui' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}