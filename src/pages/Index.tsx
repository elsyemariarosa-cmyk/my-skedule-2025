import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FullScheduleGrid } from "@/components/FullScheduleGrid";
import { ScheduleForm } from "@/components/ScheduleForm";
import { ActivityTypeManager } from "@/components/ActivityTypeManager";
import { SemesterFilter } from "@/components/SemesterFilter";
import { MasterScheduleManager } from "@/components/MasterScheduleManager";
import { MasterAcademicCalendar } from "@/components/MasterAcademicCalendar";
import { StudentClassManager } from "@/components/StudentClassManager";
import { ClassBasedScheduleManager } from "@/components/ClassBasedScheduleManager";
import { MonitoringEvaluation } from "@/components/MonitoringEvaluation";
import { MonitoringCalendar } from "@/components/MonitoringCalendar";
import { UserGuide } from "@/components/UserGuide";
import { ScheduleItem, TimeSlot, ActivityTypeConfig, DEFAULT_ACTIVITY_TYPES } from "@/types/schedule";
import { SemesterType, AcademicActivity, getCurrentAcademicYear, getCurrentSemesterType, SEMESTER_MAPPING } from "@/types/master-schedule";
import { StudentClass, DEFAULT_STUDENT_CLASSES } from "@/types/student-class";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // Master schedule states
  const [selectedSemesterType, setSelectedSemesterType] = useState<SemesterType>(getCurrentSemesterType());
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(getCurrentAcademicYear());
  const [isMasterScheduleOpen, setIsMasterScheduleOpen] = useState(false);
  const [isMasterCalendarOpen, setIsMasterCalendarOpen] = useState(false);

  // Academic activities state
  const [academicActivities, setAcademicActivities] = useState<AcademicActivity[]>([
    {
      id: '1',
      name: 'Pendaftaran Semester Ganjil',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Perkuliahan Semester Ganjil',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'UTS Semester Ganjil',
      startDate: '2024-10-15',
      endDate: '2024-10-25',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'UAS Semester Ganjil',
      startDate: '2024-12-15',
      endDate: '2024-12-30',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'ganjil',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Pendaftaran Semester Genap',
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'genap',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Perkuliahan Semester Genap',
      startDate: '2025-02-01',
      endDate: '2025-06-30',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'genap',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      name: 'UTS Semester Genap',
      startDate: '2025-03-15',
      endDate: '2025-03-25',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'genap',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '8',
      name: 'UAS Semester Genap',
      startDate: '2025-06-15',
      endDate: '2025-06-30',
      academicYear: getCurrentAcademicYear(),
      semesterType: 'genap',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Load activity types from localStorage or use defaults
  const [activityTypes, setActivityTypes] = useState<Record<string, ActivityTypeConfig>>(() => {
    // Force refresh with latest DEFAULT_ACTIVITY_TYPES
    localStorage.setItem('mars-activity-types', JSON.stringify(DEFAULT_ACTIVITY_TYPES));
    return DEFAULT_ACTIVITY_TYPES;
  });

  // Remove deprecated default activity types on first load
  useEffect(() => {
    const removedKeys = ['seminar-khusus','praktikum','workshop','diskusi-panel','tambahan','kunjungan-lapangan','presentasi-kasus','kuliah-tatap-muka'];
    let changed = false;
    const cleanedEntries = Object.entries(activityTypes).filter(([k]) => {
      const toRemove = removedKeys.includes(k);
      if (toRemove) changed = true;
      return !toRemove;
    });
    if (changed) {
      const cleaned = Object.fromEntries(cleanedEntries);
      setActivityTypes(cleaned);
      localStorage.setItem('mars-activity-types', JSON.stringify(cleaned));
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load student classes from localStorage or use defaults  
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>(() => {
    const saved = localStorage.getItem('mars-student-classes');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_CLASSES;
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    // Sample data for all days - each activity assigned to at least 5 classes
    // MONDAY
    {
      id: '1',
      title: 'Manajemen Strategis RS',
      type: 'perkuliahan-offline',
      day: 'monday',
      startTime: '08:00',
      endTime: '10:30',
      activityDate: '2024-12-09',
      semester: 1,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'Ruang 201',
      description: 'Pengantar manajemen strategis dalam konteks rumah sakit',
      classIds: ['1', '2', '3', '4', '5'] // REG-A, REG-B, REG-C, REG-D, REG-E
    },
    {
      id: '2',
      title: 'Tutorial Manajemen Keuangan RS',
      type: 'tutorial',
      day: 'monday',
      startTime: '13:20',
      endTime: '15:50',
      activityDate: '2024-12-09',
      semester: 2,
      instructor: 'Dr. Siti Nurhaliza, M.M',
      room: 'Ruang Tutorial A',
      description: 'Diskusi kelompok tentang manajemen keuangan rumah sakit',
      classIds: ['6', '7', '8', '9', '10'] // REG-F, REG-G, REG-H, RPL-1, RPL-2
    },
    
    // TUESDAY
    {
      id: '3',
      title: 'Sistem Informasi Manajemen RS',
      type: 'perkuliahan-online',
      day: 'tuesday',
      startTime: '10:40',
      endTime: '13:10',
      activityDate: '2024-12-10',
      semester: 2,
      instructor: 'Prof. Dr. Siti Rahma, M.Si',
      room: 'Lab Komputer',
      description: 'Implementasi SIMRS dan digitalisasi layanan kesehatan',
      classIds: ['1', '2', '3', '6', '7', '8'] // Multiple reguler classes
    },
    {
      id: '4',
      title: 'Skill Lab - Komunikasi Efektif',
      type: 'skill-lab',
      day: 'tuesday',
      startTime: '16:00',
      endTime: '18:30',
      activityDate: '2024-12-10',
      semester: 1,
      instructor: 'Dr. Maya Indira, M.Psi',
      room: 'Lab Skills',
      description: 'Praktik komunikasi efektif dalam manajemen RS',
      classIds: ['4', '5', '9', '10', '11'] // Mixed reguler and RPL classes
    },

    // WEDNESDAY
    {
      id: '5',
      title: 'Manajemen Mutu dan Keselamatan Pasien',
      type: 'perkuliahan-offline',
      day: 'wednesday',
      startTime: '08:00',
      endTime: '10:30',
      activityDate: '2024-12-11',
      semester: 3,
      instructor: 'Prof. Dr. Budi Santoso, M.Kes',
      room: 'Ruang 203',
      description: 'Konsep dan implementasi manajemen mutu di RS',
      classIds: ['1', '3', '5', '7', '9', '11'] // 6 classes from different batches
    },
    {
      id: '6',
      title: 'Kunjungan Lapangan - RS Cipto Mangunkusumo',
      type: 'fst',
      day: 'wednesday',
      startTime: '13:20',
      endTime: '15:50',
      activityDate: '2024-12-11',
      semester: 2,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'RSCM Jakarta',
      description: 'Observasi sistem manajemen di rumah sakit rujukan nasional',
      classIds: ['2', '4', '6', '8', '10'] // 5 classes
    },

    // THURSDAY
    {
      id: '7',
      title: 'Manajemen Kepemimpinan di RS',
      type: 'perkuliahan-offline',
      day: 'thursday',
      startTime: '10:40',
      endTime: '13:10',
      activityDate: '2024-12-12',
      semester: 3,
      instructor: 'Dr. Retno Astuti, M.M',
      room: 'Aula Utama',
      description: 'Pembelajaran tentang kepemimpinan transformatif di rumah sakit',
      classIds: ['1', '2', '3', '4', '5', '6', '7'] // 7 classes
    },
    {
      id: '8',
      title: 'Inovasi Pelayanan RS (Online)',
      type: 'perkuliahan-online',
      day: 'thursday',
      startTime: '16:00',
      endTime: '18:30',
      activityDate: '2024-12-12',
      semester: 4,
      instructor: 'Dr. Siti Nurhaliza, M.M',
      room: 'Via Zoom Meeting',
      description: 'Kuliah online tentang inovasi pelayanan rumah sakit',
      classIds: ['8', '9', '10', '11', '1'] // Mix of advanced and beginner classes
    },

    // FRIDAY
    {
      id: '9',
      title: 'Manajemen SDM RS',
      type: 'perkuliahan-offline',
      day: 'friday',
      startTime: '13:00',
      endTime: '15:30',
      activityDate: '2024-12-13',
      semester: 2,
      instructor: 'Dr. Linda Sari, M.M',
      room: 'Ruang 202',
      description: 'Pengelolaan sumber daya manusia di rumah sakit',
      classIds: ['2', '3', '4', '5', '6'] // 5 reguler classes
    },
    {
      id: '10',
      title: 'Project Learning - Analisis Kasus RS',
      type: 'project-learning',
      day: 'friday',
      startTime: '15:40',
      endTime: '18:10',
      activityDate: '2024-12-13',
      semester: 3,
      instructor: 'Dr. Ahmad Susilo, M.Kes + Prof. Dr. Siti Rahayu, M.M',
      room: 'Ruang Diskusi 1-3',
      description: 'Pembelajaran berbasis proyek analisis kasus manajemen RS',
      classIds: ['7', '8', '9', '10', '11'] // 5 advanced classes
    },

    // SATURDAY
    {
      id: '11',
      title: 'UTS - Manajemen Strategis RS',
      type: 'uts',
      day: 'saturday',
      startTime: '08:00',
      endTime: '10:30',
      activityDate: '2024-12-14',
      semester: 1,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'Ruang Ujian A-E',
      description: 'Ujian Tengah Semester Manajemen Strategis RS',
      classIds: ['1', '2', '3', '4', '5'] // All semester 1 classes
    },
    {
      id: '12',
      title: 'Tutorial Manajemen Operasional RS',
      type: 'tutorial',
      day: 'saturday',
      startTime: '13:20',
      endTime: '15:50',
      activityDate: '2024-12-14',
      semester: 4,
      instructor: 'Prof. Dr. Budi Santoso, M.Kes + Tim Dosen',
      room: 'Ruang Tutorial 1-3',
      description: 'Diskusi kelompok manajemen operasional rumah sakit',
      classIds: ['6', '7', '8', '9', '10', '11'] // 6 advanced classes
    },
    {
      id: '13',
      title: 'Seminar Hasil - Penelitian Mahasiswa',
      type: 'seminar-hasil',
      day: 'saturday',
      startTime: '16:00',
      endTime: '18:30',
      activityDate: '2024-12-14',
      semester: 4,
      instructor: 'Dr. Ahmad Susilo, M.Kes + Dr. Retno Astuti, M.M',
      room: 'Aula Utama',
      description: 'Seminar hasil penelitian mahasiswa tingkat akhir',
      classIds: ['7', '8', '9', '10', '11'] // Final semester classes
    },

    // SUNDAY
    {
      id: '14',
      title: 'Manajemen Krisis RS (Online)',
      type: 'perkuliahan-online',
      day: 'sunday',
      startTime: '10:40',
      endTime: '13:10',
      activityDate: '2024-12-15',
      semester: 3,
      instructor: 'Dr. Ahmad Susilo, M.Kes',
      room: 'Via Google Meet',
      description: 'Kuliah online tentang manajemen krisis dan bencana di rumah sakit',
      classIds: ['1', '3', '5', '7', '9'] // Mixed classes from different batches
    },
    {
      id: '15',
      title: 'Residensial Program - Rumah Sakit Singapura',
      type: 'residensi',
      day: 'sunday',
      startTime: '13:20',
      endTime: '15:50',
      activityDate: '2024-12-15',
      semester: 4,
      instructor: 'Prof. Dr. International Supervisor',
      room: 'Singapore General Hospital',
      description: 'Program residensial 3 bulan di Singapura untuk mempelajari sistem manajemen RS internasional',
      residencyStartDate: '2024-12-01',
      residencyEndDate: '2025-02-28',
      residencyCountry: 'Singapura',
      classIds: ['8', '9', '10', '11', '1'] // Selected students from multiple classes
    },
    {
      id: '16',
      title: 'Evaluasi Kinerja Mahasiswa',
      type: 'evaluasi-kinerja',
      day: 'sunday',
      startTime: '16:00',
      endTime: '18:30',
      activityDate: '2024-12-15',
      semester: 4,
      instructor: 'Tim Evaluasi',
      room: 'Ruang Evaluasi 1-2',
      description: 'Evaluasi komprehensif kinerja mahasiswa semester',
      classIds: ['6', '7', '8', '9', '10', '11'] // All advanced classes
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActivityManagerOpen, setIsActivityManagerOpen] = useState(false);
  const [isStudentClassManagerOpen, setIsStudentClassManagerOpen] = useState(false);
  const [isClassBasedScheduleOpen, setIsClassBasedScheduleOpen] = useState(false);
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const [isMonitoringCalendarOpen, setIsMonitoringCalendarOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>();
  const [editingActivity, setEditingActivity] = useState<AcademicActivity | undefined>();
  const [preselectedDay, setPreselectedDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | undefined>();
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

  const handleAddItem = (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', timeSlot: TimeSlot) => {
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

  const handleAddActivity = () => {
    setEditingActivity(undefined);
    setIsMasterCalendarOpen(true);
  };

  const handleEditActivity = (activity: AcademicActivity) => {
    setEditingActivity(activity);
    setIsMasterCalendarOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header 
          activityTypes={activityTypes}
          onOpenActivityManager={() => setIsActivityManagerOpen(true)}
          onOpenStudentClassManager={() => setIsStudentClassManagerOpen(true)}
          onOpenClassBasedSchedule={() => setIsClassBasedScheduleOpen(true)}
          onOpenMonitoring={() => setIsMonitoringOpen(true)}
          onOpenMonitoringCalendar={() => setIsMonitoringCalendarOpen(true)}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onActivityTypeClick={handleActivityTypeClick}
          onOpenMasterCalendar={() => setIsMasterCalendarOpen(true)}
        />
        
        <SemesterFilter
          selectedSemesterType={selectedSemesterType}
          selectedAcademicYear={selectedAcademicYear}
          onSemesterTypeChange={setSelectedSemesterType}
          onAcademicYearChange={setSelectedAcademicYear}
          onOpenMasterSchedule={() => setIsMasterScheduleOpen(true)}
        />
        
        <FullScheduleGrid
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

        <ClassBasedScheduleManager
          isOpen={isClassBasedScheduleOpen}
          onClose={() => setIsClassBasedScheduleOpen(false)}
          studentClasses={studentClasses}
          activityTypes={activityTypes}
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

        {/* Master Academic Calendar */}
        {isMasterCalendarOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
              <MasterAcademicCalendar
                activities={academicActivities}
                onAddActivity={handleAddActivity}
                onEditActivity={handleEditActivity}
                selectedAcademicYear={selectedAcademicYear}
                onAcademicYearChange={setSelectedAcademicYear}
              />
              <div className="fixed top-4 right-4">
                <button
                  onClick={() => setIsMasterCalendarOpen(false)}
                  className="bg-background border border-border rounded-lg p-2 shadow-lg hover:bg-accent"
                  aria-label="Tutup kalender akademik"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;