import { GraduationCap, Calendar, Users, Settings, BarChart3, HelpCircle, CalendarDays, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTypeConfig } from "@/types/schedule";
interface HeaderProps {
  activityTypes: Record<string, ActivityTypeConfig>;
  onOpenActivityManager: () => void;
  onOpenStudentClassManager: () => void;
  onOpenClassBasedSchedule: () => void;
  onOpenWeeklySchedule: () => void;
  onOpenMonthlySchedule: () => void;
  onOpenMonitoring: () => void;
  onOpenMonitoringCalendar: () => void;
  onOpenUserGuide: () => void;
  onOpenMasterCalendar: () => void;
  onActivityTypeClick: (activityType: string) => void;
}
export function Header({
  activityTypes,
  onOpenActivityManager,
  onOpenStudentClassManager,
  onOpenClassBasedSchedule,
  onOpenWeeklySchedule,
  onOpenMonthlySchedule,
  onOpenMonitoring,
  onOpenMonitoringCalendar,
  onOpenUserGuide,
  onOpenMasterCalendar,
  onActivityTypeClick
}: HeaderProps) {
  return <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-medical to-accent p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <img src="/lovable-uploads/7d332584-ebb4-48e2-982b-d74a019abd4e.png" alt="MARS UMY Logo" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                My-Skedul Prodi MARS UMY
              </h1>
              <p className="text-white/90 text-lg">
                Prodi Magister Administrasi Rumah Sakit
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Hari Kuliah</p>
                  <p className="font-semibold">Jumat & Sabtu</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Program</p>
                  <p className="font-semibold">4 Semester</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Durasi Sesi</p>
                  <p className="font-semibold">150 menit</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Activity Types Legend */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Jenis Kegiatan Program Studi</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onOpenUserGuide} variant="outline" size="sm" className="hover:bg-accent/10 hover:border-accent">
            <HelpCircle className="w-4 h-4 mr-2" />
            Panduan Penggunaan
          </Button>
          
          <Button onClick={onOpenActivityManager} variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
            <Settings className="w-4 h-4 mr-2" />
            Kelola Jenis Kegiatan
          </Button>
          
          <Button onClick={onOpenStudentClassManager} variant="outline" size="sm" className="hover:bg-academic/10 hover:border-academic">
            <Users className="w-4 h-4 mr-2" />
            Kelola Kelas
          </Button>

          <Button onClick={onOpenClassBasedSchedule} variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
            <BookOpen className="w-4 h-4 mr-2" />
            Jadwal per Kelas
          </Button>

          <Button onClick={onOpenWeeklySchedule} variant="outline" size="sm" className="hover:bg-accent/10 hover:border-accent">
            <Calendar className="w-4 h-4 mr-2" />
            Jadwal Mingguan
          </Button>

          <Button onClick={onOpenMonthlySchedule} variant="outline" size="sm" className="hover:bg-blue/10 hover:border-blue">
            <CalendarDays className="w-4 h-4 mr-2" />
            📅 Jadwal Bulanan
          </Button>

          <Button onClick={onOpenMonitoring} variant="outline" size="sm" className="hover:bg-medical/10 hover:border-medical">
            <BarChart3 className="w-4 h-4 mr-2" />
            Monitoring & Evaluasi
          </Button>

          <Button onClick={onOpenMonitoringCalendar} variant="outline" size="sm" className="hover:bg-medical/10 hover:border-medical">
            <CalendarDays className="w-4 h-4 mr-2" />
            Kalender Monitoring
          </Button>

          <Button onClick={onOpenMasterCalendar} variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
            <Calendar className="w-4 h-4 mr-2" />
            Master Kalender Akademik
          </Button>
        </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(activityTypes).map(([key, config]) => <Badge key={key} className={`${config.color} justify-center py-2 cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => onActivityTypeClick(key)}>
              {config.label}
            </Badge>)}
        </div>
      </Card>
    </div>;
}