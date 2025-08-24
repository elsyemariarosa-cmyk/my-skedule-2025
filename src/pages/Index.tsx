import { useState } from "react";
import { Header } from "@/components/Header";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { ScheduleForm } from "@/components/ScheduleForm";
import { ScheduleItem, TimeSlot } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    // Sample data
    {
      id: '1',
      title: 'Manajemen Strategis RS',
      type: 'kuliah',
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
      type: 'kuliah',
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
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>();
  const [preselectedDay, setPreselectedDay] = useState<'friday' | 'saturday' | undefined>();
  const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<TimeSlot | undefined>();
  
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header />
        
        <ScheduleGrid
          scheduleItems={scheduleItems}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
        />
        
        <ScheduleForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          editItem={editingItem}
          preselectedDay={preselectedDay}
          preselectedTimeSlot={preselectedTimeSlot}
        />
      </div>
    </div>
  );
};

export default Index;