import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { ScheduleForm } from "@/components/ScheduleForm";
import { ActivityTypeManager } from "@/components/ActivityTypeManager";
import { SemesterFilter } from "@/components/SemesterFilter";
import { MasterScheduleManager } from "@/components/MasterScheduleManager";
import { StudentClassManager } from "@/components/StudentClassManager";
import { MonitoringEvaluation } from "@/components/MonitoringEvaluation";
import { MonitoringCalendar } from "@/components/MonitoringCalendar";
import { UserGuide } from "@/components/UserGuide";
import { ScheduleItem, TimeSlot, ActivityTypeConfig, DEFAULT_ACTIVITY_TYPES } from "@/types/schedule";
import { SemesterType, getCurrentAcademicYear, getCurrentSemesterType, SEMESTER_MAPPING } from "@/types/master-schedule";
import { StudentClass, DEFAULT_STUDENT_CLASSES } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // Master schedule states
  const [selectedSemesterType, setSelectedSemesterType] = useState<SemesterType>(getCurrentSemesterType());
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(getCurrentAcademicYear());
  const [isMasterScheduleOpen, setIsMasterScheduleOpen] = useState(false);

  // Load activity types from localStorage or use defaults
  const [activityTypes, setActivityTypes] = useState<Record<string, ActivityTypeConfig>>(() => {
    const saved = localStorage.getItem('mars-activity-types');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY_TYPES;
  });

  // Load student classes from localStorage or use defaults  
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>(() => {
    const saved = localStorage.getItem('mars-student-classes');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_CLASSES;
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
    },
    {
      id: '3',
      title: 'UTS - Manajemen Strategis RS',
      type: 'uts',
      day: 'saturday',
      startTime: '10:00',
      endTime: '12:00',
      semester: 1,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'Ruang Ujian A',
      description: 'Ujian Tengah Semester Manajemen Strategis RS'
    },
    {
      id: '4',
      title: 'UAS - Sistem Informasi Manajemen RS',
      type: 'uas',
      day: 'saturday',
      startTime: '14:00',
      endTime: '16:00',
      semester: 2,
      instructor: 'Prof. Dr. Siti Rahma, M.Si',
      room: 'Lab Komputer',
      description: 'Ujian Akhir Semester Sistem Informasi Manajemen RS'
    },
    {
      id: '5',
      title: 'Seminar Proposal - Ahmad Fauzi',
      type: 'seminar-proposal',
      day: 'friday',
      startTime: '15:00',
      endTime: '17:00',
      semester: 3,
      instructor: 'Dr. Ahmad Susilo, M.Kes + Prof. Dr. Siti Rahayu, M.M',
      room: 'Ruang Seminar 1',
      description: 'Seminar proposal tesis: Manajemen Kualitas RS'
    },
    {
      id: '6',
      title: 'Seminar Hasil - Siti Nurhaliza',
      type: 'seminar-hasil',
      day: 'saturday',
      startTime: '10:00',
      endTime: '12:00',
      semester: 4,
      instructor: 'Prof. Dr. Budi Santoso, M.Kes + Dr. Maya Indira, M.M',
      room: 'Via Zoom Meeting',
      description: 'Seminar hasil penelitian: Sistem Informasi RS'
    },
    {
      id: '7',
      title: 'Ujian Tesis - Budi Hermawan',
      type: 'ujian-tesis',
      day: 'saturday',
      startTime: '12:00',
      endTime: '14:00',
      semester: 4,
      instructor: 'Dr. Ahmad Susilo, M.Kes + Dr. Retno Astuti, M.M',
      room: 'Ruang Sidang Utama',
      description: 'Ujian tesis: Analisis Efektivitas Manajemen SDM RS'
    },
    {
      id: '8',
      title: 'Residensial Program - Rumah Sakit Singapura',
      type: 'residensi',
      day: 'friday',
      startTime: '08:00',
      endTime: '17:00',
      semester: 4,
      instructor: 'Prof. Dr. International Supervisor',
      room: 'Singapore General Hospital',
      description: 'Program residensial 3 bulan di Singapura untuk mempelajari sistem manajemen RS internasional',
      residencyStartDate: '2024-12-01',
      residencyEndDate: '2025-02-28',
      residencyCountry: 'Singapura'
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActivityManagerOpen, setIsActivityManagerOpen] = useState(false);
  const [isStudentClassManagerOpen, setIsStudentClassManagerOpen] = useState(false);
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const [isMonitoringCalendarOpen, setIsMonitoringCalendarOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>();
  const [preselectedDay, setPreselectedDay] = useState<'friday' | 'saturday' | undefined>();
  const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<TimeSlot | undefined>();
  
  const { toast } = useToast();

  // Filter schedule items based on selected semester type
  const filteredScheduleItems = scheduleItems.filter(item => {
    const allowedSemesters = SEMESTER_MAPPING[selectedSemesterType];
    return allowedSemesters.includes(item.semester);
  });

  // Save activity types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mars-activity-types', JSON.stringify(activityTypes));
  }, [activityTypes]);

  // Save student classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mars-student-classes', JSON.stringify(studentClasses));
  }, [studentClasses]);

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

  const handleUpdateStudentClasses = (newClasses: StudentClass[]) => {
    setStudentClasses(newClasses);
  };

  const handleActivityTypeClick = (activityType: string) => {
    // Auto-open form with preselected activity type for special activities
    if (['uts', 'uas', 'seminar-proposal', 'seminar-hasil', 'ujian-tesis', 'residensi'].includes(activityType)) {
      setEditingItem(undefined);
      setPreselectedDay(undefined);
      setPreselectedTimeSlot(undefined);
      setIsFormOpen(true);
      // The form will detect the activity type and show appropriate fields
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header 
          activityTypes={activityTypes}
          onOpenActivityManager={() => setIsActivityManagerOpen(true)}
          onOpenStudentClassManager={() => setIsStudentClassManagerOpen(true)}
          onOpenMonitoring={() => setIsMonitoringOpen(true)}
          onOpenMonitoringCalendar={() => setIsMonitoringCalendarOpen(true)}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onActivityTypeClick={handleActivityTypeClick}
        />
        
        <SemesterFilter
          selectedSemesterType={selectedSemesterType}
          selectedAcademicYear={selectedAcademicYear}
          onSemesterTypeChange={setSelectedSemesterType}
          onAcademicYearChange={setSelectedAcademicYear}
          onOpenMasterSchedule={() => setIsMasterScheduleOpen(true)}
        />
        
        <ScheduleGrid
          scheduleItems={filteredScheduleItems}
          activityTypes={activityTypes}
          studentClasses={studentClasses}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
        />
        
        <ScheduleForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          activityTypes={activityTypes}
          studentClasses={studentClasses}
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

        <StudentClassManager
          isOpen={isStudentClassManagerOpen}
          onClose={() => setIsStudentClassManagerOpen(false)}
          studentClasses={studentClasses}
          onUpdateStudentClasses={handleUpdateStudentClasses}
        />

        {/* User Guide */}
        <UserGuide
          isOpen={isUserGuideOpen}
          onClose={() => setIsUserGuideOpen(false)}
        />

        {/* Monitoring and Evaluation */}
        <MonitoringEvaluation
          isOpen={isMonitoringOpen}
          onClose={() => setIsMonitoringOpen(false)}
          scheduleItems={scheduleItems}
          activityTypes={activityTypes}
          studentClasses={studentClasses}
          selectedSemesterType={selectedSemesterType}
          selectedAcademicYear={selectedAcademicYear}
        />

        {/* Monitoring Calendar */}
        <MonitoringCalendar
          isOpen={isMonitoringCalendarOpen}
          onClose={() => setIsMonitoringCalendarOpen(false)}
          scheduleItems={scheduleItems}
          activityTypes={activityTypes}
          studentClasses={studentClasses}
          selectedSemesterType={selectedSemesterType}
          selectedAcademicYear={selectedAcademicYear}
        />

        {/* Master Schedule Manager */}
        <MasterScheduleManager
          isOpen={isMasterScheduleOpen}
          onClose={() => setIsMasterScheduleOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;