import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, BookOpen, Plus, Filter } from "lucide-react";
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";
import { id } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcademicActivity, SemesterType, getCurrentAcademicYear } from "@/types/master-schedule";

interface MasterAcademicCalendarProps {
  activities: AcademicActivity[];
  onAddActivity: () => void;
  onEditActivity: (activity: AcademicActivity) => void;
  selectedAcademicYear: string;
  onAcademicYearChange: (year: string) => void;
}

export function MasterAcademicCalendar({
  activities,
  onAddActivity,
  onEditActivity,
  selectedAcademicYear,
  onAcademicYearChange
}: MasterAcademicCalendarProps) {
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | 'all'>('all');

  // Generate academic years
  const currentYear = new Date().getFullYear();
  const academicYears = [];
  for (let i = -2; i <= 2; i++) {
    const year = currentYear + i;
    academicYears.push(`${year}/${year + 1}`);
  }

  // Filter activities by selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const yearMatch = activity.academicYear === selectedAcademicYear;
      const semesterMatch = selectedSemester === 'all' || activity.semesterType === selectedSemester;
      return yearMatch && semesterMatch;
    });
  }, [activities, selectedAcademicYear, selectedSemester]);

  // Get months for the academic year
  const academicYearStart = new Date(parseInt(selectedAcademicYear.split('/')[0]), 6, 1); // July 1st
  const academicYearEnd = new Date(parseInt(selectedAcademicYear.split('/')[1]), 5, 30); // June 30th
  
  const months = eachMonthOfInterval({
    start: academicYearStart,
    end: academicYearEnd
  });

  // Group activities by month
  const activitiesByMonth = useMemo(() => {
    const grouped: { [key: string]: AcademicActivity[] } = {};
    
    months.forEach(month => {
      const monthKey = format(month, 'yyyy-MM');
      grouped[monthKey] = [];
      
      filteredActivities.forEach(activity => {
        const activityStart = parseISO(activity.startDate);
        const activityEnd = parseISO(activity.endDate);
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        // Check if activity overlaps with month
        if (
          isWithinInterval(activityStart, { start: monthStart, end: monthEnd }) ||
          isWithinInterval(activityEnd, { start: monthStart, end: monthEnd }) ||
          isWithinInterval(monthStart, { start: activityStart, end: activityEnd })
        ) {
          grouped[monthKey].push(activity);
        }
      });
    });
    
    return grouped;
  }, [months, filteredActivities]);

  const getSemesterBadgeColor = (semesterType: SemesterType) => {
    return semesterType === 'ganjil' ? 'bg-primary text-primary-foreground' : 'bg-medical text-white';
  };

  const getActivityDuration = (activity: AcademicActivity) => {
    const start = parseISO(activity.startDate);
    const end = parseISO(activity.endDate);
    const startFormatted = format(start, 'd MMM', { locale: id });
    const endFormatted = format(end, 'd MMM yyyy', { locale: id });
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent">
              Master Kalender Akademik
            </h1>
            <p className="text-muted-foreground">Jadwal Kegiatan Akademik Tahunan</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedAcademicYear} onValueChange={onAcademicYearChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                  {year === getCurrentAcademicYear() && (
                    <Badge variant="secondary" className="ml-2 text-xs">Aktif</Badge>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSemester} onValueChange={(value: SemesterType | 'all') => setSelectedSemester(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Semester</SelectItem>
              <SelectItem value="ganjil">Semester Ganjil</SelectItem>
              <SelectItem value="genap">Semester Genap</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onAddActivity} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kegiatan
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{filteredActivities.length}</p>
                <p className="text-sm text-muted-foreground">Total Kegiatan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredActivities.filter(a => a.semesterType === 'ganjil').length}
                </p>
                <p className="text-sm text-muted-foreground">Semester Ganjil</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-medical" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredActivities.filter(a => a.semesterType === 'genap').length}
                </p>
                <p className="text-sm text-muted-foreground">Semester Genap</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredActivities.filter(a => a.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Kegiatan Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Kalender Tahunan {selectedAcademicYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {months.map((month) => {
                const monthKey = format(month, 'yyyy-MM');
                const monthActivities = activitiesByMonth[monthKey] || [];
                const monthName = format(month, 'MMMM yyyy', { locale: id });

                return (
                  <div key={monthKey} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-primary">
                        {monthName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {monthActivities.length} kegiatan
                      </Badge>
                    </div>

                    {monthActivities.length > 0 ? (
                      <div className="grid gap-3">
                        {monthActivities.map((activity) => (
                          <Card 
                            key={activity.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onEditActivity(activity)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-medium">{activity.name}</h4>
                                    <Badge 
                                      variant="secondary" 
                                      className={getSemesterBadgeColor(activity.semesterType)}
                                    >
                                      {activity.semesterType === 'ganjil' ? 'Ganjil' : 'Genap'}
                                    </Badge>
                                    {activity.isActive && (
                                      <Badge variant="default" className="bg-green-500">
                                        Aktif
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{getActivityDuration(activity)}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Tidak ada kegiatan pada bulan ini</p>
                      </div>
                    )}

                    {months.indexOf(month) !== months.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}