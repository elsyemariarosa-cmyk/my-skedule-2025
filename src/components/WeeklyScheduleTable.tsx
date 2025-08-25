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
import { Plus, Edit, Trash2, BookOpen, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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

// Color schemes for different classes
const CLASS_COLORS = {
  'REG-A': {
    header: 'bg-blue-500 text-white',
    content: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    tab: 'data-[state=active]:bg-blue-500 data-[state=active]:text-white',
    accent: 'bg-blue-100'
  },
  'REG-B': {
    header: 'bg-green-500 text-white',
    content: 'bg-green-50 border-green-200', 
    text: 'text-green-800',
    tab: 'data-[state=active]:bg-green-500 data-[state=active]:text-white',
    accent: 'bg-green-100'
  },
  'REG-C': {
    header: 'bg-purple-500 text-white',
    content: 'bg-purple-50 border-purple-200',
    text: 'text-purple-800', 
    tab: 'data-[state=active]:bg-purple-500 data-[state=active]:text-white',
    accent: 'bg-purple-100'
  },
  'REG-D': {
    header: 'bg-orange-500 text-white',
    content: 'bg-orange-50 border-orange-200',
    text: 'text-orange-800',
    tab: 'data-[state=active]:bg-orange-500 data-[state=active]:text-white', 
    accent: 'bg-orange-100'
  },
  'REG-E': {
    header: 'bg-red-500 text-white',
    content: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    tab: 'data-[state=active]:bg-red-500 data-[state=active]:text-white',
    accent: 'bg-red-100'
  },
  'REG-F': {
    header: 'bg-indigo-500 text-white',
    content: 'bg-indigo-50 border-indigo-200',
    text: 'text-indigo-800',
    tab: 'data-[state=active]:bg-indigo-500 data-[state=active]:text-white',
    accent: 'bg-indigo-100'
  },
  'REG-G': {
    header: 'bg-pink-500 text-white',
    content: 'bg-pink-50 border-pink-200',
    text: 'text-pink-800',
    tab: 'data-[state=active]:bg-pink-500 data-[state=active]:text-white',
    accent: 'bg-pink-100'
  },
  'REG-H': {
    header: 'bg-teal-500 text-white',
    content: 'bg-teal-50 border-teal-200',
    text: 'text-teal-800',
    tab: 'data-[state=active]:bg-teal-500 data-[state=active]:text-white',
    accent: 'bg-teal-100'
  },
  'RPL-1': {
    header: 'bg-emerald-600 text-white',
    content: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    tab: 'data-[state=active]:bg-emerald-600 data-[state=active]:text-white',
    accent: 'bg-emerald-100'
  },
  'RPL-2': {
    header: 'bg-cyan-600 text-white',
    content: 'bg-cyan-50 border-cyan-200',
    text: 'text-cyan-800',
    tab: 'data-[state=active]:bg-cyan-600 data-[state=active]:text-white',
    accent: 'bg-cyan-100'
  },
  'KARY-A': {
    header: 'bg-amber-600 text-white',
    content: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    tab: 'data-[state=active]:bg-amber-600 data-[state=active]:text-white',
    accent: 'bg-amber-100'
  },
  'RPL-3': {
    header: 'bg-violet-600 text-white',
    content: 'bg-violet-50 border-violet-200',
    text: 'text-violet-800',
    tab: 'data-[state=active]:bg-violet-600 data-[state=active]:text-white',
    accent: 'bg-violet-100'
  },
};

const getClassColors = (classCode: string) => {
  return CLASS_COLORS[classCode as keyof typeof CLASS_COLORS] || CLASS_COLORS['REG-A'];
};

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
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 3 | 4>(3);
  const [isSemesterEditOpen, setIsSemesterEditOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, etc.
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
    } else if (studentClasses.length > 0) {
      // Add sample data for testing - only if we have student classes
      const firstActiveClass = studentClasses.find(c => c.isActive);
      if (firstActiveClass) {
        const sampleData: ScheduleEntry[] = [
          {
            id: '1', 
            classId: firstActiveClass.id,
            courseName: 'Matematika Dasar',
            instructor: 'Dr. Ahmad Suryanto',
            day: 'friday',
            timeSlot: '13.00-15.00',
            date: '30 Agustus 2024',
            activityType: 'kuliah',
            room: 'A101',
            description: 'Materi pengenalan kalkulus',
            semester: 1
          },
          {
            id: '2',
            classId: firstActiveClass.id,
            courseName: 'Bahasa Indonesia',
            instructor: 'Prof. Siti Nurhaliza',
            day: 'saturday',
            timeSlot: '09.00-11.30',
            date: '31 Agustus 2024',
            activityType: 'kuliah',
            room: 'B202',
            description: 'Tata bahasa formal',
            semester: 1
          }
        ];
        setScheduleEntries(sampleData);
      }
    }
  }, [studentClasses]);

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
      semester: selectedSemester
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
      e.timeSlot === timeSlot &&
      e.semester === selectedSemester
    );
  };

  const createScheduleTable = (selectedClass: StudentClass) => {
    const colors = getClassColors(selectedClass.code);
    
    // Calculate dates for current week
    const getWeekDates = (weekOffset: number = 0) => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
      
      // Calculate Friday of current week
      const friday = new Date(today);
      friday.setDate(today.getDate() - currentDay + 5 + (weekOffset * 7)); // Friday is day 5
      
      // Calculate Saturday (next day)
      const saturday = new Date(friday);
      saturday.setDate(friday.getDate() + 1);
      
      return {
        friday: friday.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        saturday: saturday.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      };
    };
    
    const weekDates = getWeekDates(currentWeek);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className={`text-center border-2 p-4 ${colors.header} rounded-lg shadow-lg`}>
          <h3 className="text-lg font-bold">
            JADWAL PERKULIAHAN : 
            <button 
              onClick={() => setIsSemesterEditOpen(true)}
              className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
            >
              Semester {selectedSemester} ✏️
            </button>
            Kelas : {selectedClass.code}
          </h3>
          <p className="text-sm font-semibold mt-2 opacity-90">
            PRODI MARS UMY
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev - 1)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Minggu Sebelumnya
          </Button>
          
          <div className="text-center px-4">
            <div className="font-semibold text-lg">
              {currentWeek === 0 ? 'Minggu Ini' : 
               currentWeek > 0 ? `${currentWeek} Minggu Kedepan` : 
               `${Math.abs(currentWeek)} Minggu Sebelumnya`}
            </div>
            <div className="text-sm text-muted-foreground">
              {weekDates.friday} - {weekDates.saturday}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev + 1)}
            className="flex items-center gap-2"
          >
            Minggu Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className={`border border-black p-2 font-bold text-center w-20 ${colors.header}`}>
                  Hari/Tgl
                </th>
                <th className={`border border-black p-2 font-bold text-center min-w-[250px] ${colors.header}`}>
                  <div className="mb-2">Jumat, {weekDates.friday}</div>
                  <div className="text-sm opacity-90">13.00-15.00</div>
                </th>
                <th className={`border border-black p-2 font-bold text-center min-w-[250px] ${colors.header}`}>
                  <div className="mb-2">Jumat, {weekDates.friday}</div>
                  <div className="text-sm opacity-90">15.30-18.00</div>
                </th>
                <th className={`border border-black p-2 font-bold text-center min-w-[250px] ${colors.header}`}>
                  <div className="mb-2">Jumat, {weekDates.friday}</div>
                  <div className="text-sm opacity-90">19.00-21.30</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`border border-black p-2 font-bold text-center align-top ${colors.accent}`}>
                  Jumat
                </td>
                {TIME_SLOTS.map((slot, index) => {
                  const entry = getEntryForSlot(selectedClass.id, 'friday', slot.time);
                  return (
                    <td key={`friday-content-${index}`} className={`border border-black p-2 relative group min-h-[120px] align-top transition-all hover:shadow-md ${entry ? colors.content : 'bg-white hover:bg-gray-50'}`}>
                      <div className="mb-2">
                        <div className="font-bold text-sm">Mata Kuliah:</div>
                        {entry ? (
                          <div className={`text-sm font-medium ${colors.text}`}>
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
                <td className={`border border-black p-2 font-bold text-center ${colors.accent}`}>
                  Sabtu
                </td>
                <td className={`border border-black p-2 relative group min-h-[120px] align-top transition-all hover:shadow-md bg-white hover:bg-gray-50`}>
                  <div className="mb-1">
                    <div className="font-bold text-sm">Sabtu, {weekDates.saturday}</div>
                    <div className="text-sm mb-2">09.00-11.30</div>
                  </div>
                  
                  {(() => {
                    const entry = getEntryForSlot(selectedClass.id, 'saturday', '09.00-11.30');
                    return (
                      <>
                        <div className="mb-2">
                          <div className="font-bold text-sm">Mata Kuliah:</div>
                          {entry ? (
                            <div className={`text-sm font-medium ${colors.text}`}>
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
                              onClick={() => handleAddEntry(selectedClass.id, 'saturday', '09.00-11.30')}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </td>
                <td className={`border border-black p-2 relative group min-h-[120px] align-top transition-all hover:shadow-md bg-white hover:bg-gray-50`}>
                  <div className="mb-1">
                    <div className="font-bold text-sm">Sabtu, {weekDates.saturday}</div>
                    <div className="text-sm mb-2">12.30-15.00</div>
                  </div>
                  
                  {(() => {
                    const entry = getEntryForSlot(selectedClass.id, 'saturday', '12.30-15.00');
                    return (
                      <>
                        <div className="mb-2">
                          <div className="font-bold text-sm">Mata Kuliah:</div>
                          {entry ? (
                            <div className={`text-sm font-medium ${colors.text}`}>
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
                              onClick={() => handleAddEntry(selectedClass.id, 'saturday', '12.30-15.00')}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </td>
                <td className={`border border-black p-2 relative group min-h-[120px] align-top transition-all hover:shadow-md bg-white hover:bg-gray-50`}>
                  <div className="mb-1">
                    <div className="font-bold text-sm">Sabtu, {weekDates.saturday}</div>
                    <div className="text-sm mb-2">15.30-18.00</div>
                  </div>
                  
                  {(() => {
                    const entry = getEntryForSlot(selectedClass.id, 'saturday', '15.30-18.00');
                    return (
                      <>
                        <div className="mb-2">
                          <div className="font-bold text-sm">Mata Kuliah:</div>
                          {entry ? (
                            <div className={`text-sm font-medium ${colors.text}`}>
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
                              onClick={() => handleAddEntry(selectedClass.id, 'saturday', '15.30-18.00')}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </td>
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
            Jadwal Perkuliahan Per Kelas
          </h2>
        </div>

        <Tabs value={selectedTabClass} onValueChange={setSelectedTabClass} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-2 mb-6">
            {studentClasses.filter(c => c.isActive).map(studentClass => {
              const colors = getClassColors(studentClass.code);
              return (
                <TabsTrigger 
                  key={studentClass.id} 
                  value={studentClass.id} 
                  className={`text-xs px-4 py-2 transition-all ${colors.tab} hover:bg-opacity-80 rounded-md`}
                >
                  {studentClass.code}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {studentClasses.filter(c => c.isActive).map(studentClass => (
            <TabsContent key={studentClass.id} value={studentClass.id} className="mt-6">
              {createScheduleTable(studentClass)}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Semester Edit Dialog */}
      <Dialog open={isSemesterEditOpen} onOpenChange={setIsSemesterEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Pilih Semester</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="font-semibold text-base mb-3 block">Semester Ganjil</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedSemester === 1 ? "default" : "outline"}
                  onClick={() => setSelectedSemester(1)}
                  className="w-full"
                >
                  Semester 1
                </Button>
                <Button
                  variant={selectedSemester === 3 ? "default" : "outline"}
                  onClick={() => setSelectedSemester(3)}
                  className="w-full"
                >
                  Semester 3
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="font-semibold text-base mb-3 block">Semester Genap</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedSemester === 2 ? "default" : "outline"}
                  onClick={() => setSelectedSemester(2)}
                  className="w-full"
                >
                  Semester 2
                </Button>
                <Button
                  variant={selectedSemester === 4 ? "default" : "outline"}
                  onClick={() => setSelectedSemester(4)}
                  className="w-full"
                >
                  Semester 4
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSemesterEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => setIsSemesterEditOpen(false)}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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