import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { ScheduleForm } from "@/components/ScheduleForm";
import { ActivityTypeManager } from "@/components/ActivityTypeManager";
import { ScheduleItem, TimeSlot, ActivityTypeConfig, DEFAULT_ACTIVITY_TYPES } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // Load activity types from localStorage or use defaults
  const [activityTypes, setActivityTypes] = useState<Record<string, ActivityTypeConfig>>(() => {
    const saved = localStorage.getItem('mars-activity-types');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY_TYPES;
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    // Sample data
    {
      id: '1',
      title: 'Manajemen Strategis RS',
      type: 'kuliah-tatap-muka',
      day: 'friday',
      startTime: '13:00',
      endTime: '15:00',
      semester: 1,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'Ruang 201',
      description: 'Pengantar manajemen strategis dalam konteks rumah sakit'
    },
    {
      id: '2',
      title: 'Sistem Informasi Manajemen RS',
      type: 'kuliah-tatap-muka',
      day: 'saturday',
      startTime: '08:00',
      endTime: '10:00',
      semester: 2,
      instructor: 'Prof. Dr. Siti Rahma, M.Si',
      room: 'Lab Komputer',
      description: 'Implementasi SIMRS dan digitalisasi layanan kesehatan'
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActivityManagerOpen, setIsActivityManagerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>();
  const [preselectedDay, setPreselectedDay] = useState<'friday' | 'saturday' | undefined>();
  const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<TimeSlot | undefined>();
  
  const { toast } = useToast();

  // Save activity types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mars-activity-types', JSON.stringify(activityTypes));
  }, [activityTypes]);

  const handleAddItem = (day: 'friday' | 'saturday', timeSlot: TimeSlot) => {
    setPreselectedDay(day);
    setPreselectedTimeSlot(timeSlot);
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
    setPreselectedDay(undefined);
    setPreselectedTimeSlot(undefined);
    setIsFormOpen(true);
  };

  const handleSubmitForm = (formData: Omit<ScheduleItem, 'id'>) => {
    if (editingItem) {
      // Update existing item
      setScheduleItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...formData, id: editingItem.id }
            : item
        )
      );
      toast({
        title: "Kegiatan berhasil diperbarui",
        description: `${formData.title} telah diperbarui dalam jadwal.`,
      });
    } else {
      // Add new item
      const newItem: ScheduleItem = {
        ...formData,
        id: Date.now().toString()
      };
      setScheduleItems(prev => [...prev, newItem]);
      toast({
        title: "Kegiatan berhasil ditambahkan",
        description: `${formData.title} telah ditambahkan ke jadwal.`,
      });
    }
  };

  const handleUpdateActivityTypes = (newTypes: Record<string, ActivityTypeConfig>) => {
    setActivityTypes(newTypes);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header 
          activityTypes={activityTypes}
          onOpenActivityManager={() => setIsActivityManagerOpen(true)}
        />
        
        <ScheduleGrid
          scheduleItems={scheduleItems}
          activityTypes={activityTypes}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
        />
        
        <ScheduleForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          activityTypes={activityTypes}
          editItem={editingItem}
          preselectedDay={preselectedDay}
          preselectedTimeSlot={preselectedTimeSlot}
        />

        <ActivityTypeManager
          isOpen={isActivityManagerOpen}
          onClose={() => setIsActivityManagerOpen(false)}
          activityTypes={activityTypes}
          onUpdateActivityTypes={handleUpdateActivityTypes}
        />
      </div>
    </div>
  );
};

export default Index;