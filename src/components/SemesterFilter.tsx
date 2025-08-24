import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, BookOpen } from "lucide-react";
import { SemesterType, getSemesterLabel, getCurrentAcademicYear, getCurrentSemesterType, SEMESTER_MAPPING } from "@/types/master-schedule";

interface SemesterFilterProps {
  selectedSemesterType: SemesterType;
  selectedAcademicYear: string;
  onSemesterTypeChange: (type: SemesterType) => void;
  onAcademicYearChange: (year: string) => void;
  onOpenMasterSchedule: () => void;
}

export function SemesterFilter({
  selectedSemesterType,
  selectedAcademicYear,
  onSemesterTypeChange,
  onAcademicYearChange,
  onOpenMasterSchedule
}: SemesterFilterProps) {
  const currentAcademicYear = getCurrentAcademicYear();
  const currentSemesterType = getCurrentSemesterType();
  
  // Generate academic years (current year and ±2 years)
  const currentYear = new Date().getFullYear();
  const academicYears = [];
  for (let i = -2; i <= 2; i++) {
    const year = currentYear + i;
    academicYears.push(`${year}/${year + 1}`);
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-medical/5 border-primary/20">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold text-lg">Master Jadwal Perkuliahan</h3>
            <p className="text-sm text-muted-foreground">Program Studi Magister Administrasi Rumah Sakit</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Select value={selectedAcademicYear} onValueChange={onAcademicYearChange}>
              <SelectTrigger className="w-[140px] focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{year}</span>
                      {year === currentAcademicYear && (
                        <Badge variant="secondary" className="text-xs">Aktif</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={selectedSemesterType === 'ganjil' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSemesterTypeChange('ganjil')}
                className={selectedSemesterType === 'ganjil' ? 'bg-primary hover:bg-primary/80' : ''}
              >
                Semester Ganjil
                <Badge variant="secondary" className="ml-2 text-xs">
                  {SEMESTER_MAPPING.ganjil.join(', ')}
                </Badge>
              </Button>
              <Button
                variant={selectedSemesterType === 'genap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSemesterTypeChange('genap')}
                className={selectedSemesterType === 'genap' ? 'bg-medical hover:bg-medical/80' : ''}
              >
                Semester Genap
                <Badge variant="secondary" className="ml-2 text-xs">
                  {SEMESTER_MAPPING.genap.join(', ')}
                </Badge>
              </Button>
            </div>
          </div>

          <Button
            onClick={onOpenMasterSchedule}
            variant="outline"
            size="sm"
            className="hover:bg-primary/10 hover:border-primary"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Kelola Master Jadwal
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Tahun Akademik Aktif:</span>
            <Badge variant={selectedAcademicYear === currentAcademicYear ? 'default' : 'secondary'}>
              {currentAcademicYear}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Semester Aktif:</span>
            <Badge variant={selectedSemesterType === currentSemesterType ? 'default' : 'secondary'}>
              {getSemesterLabel(currentSemesterType)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}