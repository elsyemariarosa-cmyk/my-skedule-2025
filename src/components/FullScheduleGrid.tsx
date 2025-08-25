import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, MapPin, User } from "lucide-react";
import { ScheduleItem, DAY_LABELS, ActivityTypeConfig, TimeSlot } from "@/types/schedule";
import { DAY_TIME_SLOTS } from "@/types/time-slots";
import { StudentClass } from "@/types/student-class";

type DayKey = keyof typeof DAY_TIME_SLOTS;

interface FullScheduleGridProps {
  scheduleItems: ScheduleItem[];
  activityTypes: Record<string, ActivityTypeConfig>;
  studentClasses: StudentClass[];
  onAddItem: (day: DayKey, timeSlot: TimeSlot) => void;
  onEditItem: (item: ScheduleItem) => void;
}

export function FullScheduleGrid({ scheduleItems, activityTypes, studentClasses, onAddItem, onEditItem }: FullScheduleGridProps) {
  const renderTimeSlot = (day: DayKey, timeSlot: TimeSlot) => {
    const item = scheduleItems.find(
      (item) => item.day === day && item.startTime === timeSlot.start
    );

    return (
      <Card 
        key={`${day}-${timeSlot.start}`}
        className="min-h-[120px] p-4 hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
      >
        {item ? (
          <div 
            className="h-full cursor-pointer space-y-2 group"
            onClick={() => onEditItem(item)}
          >
            <div className="flex items-center justify-between">
              <Badge 
                className={`${activityTypes[item.type]?.color || 'bg-muted text-muted-foreground'} text-xs font-medium px-2 py-1`}
              >
                {activityTypes[item.type]?.label || item.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Semester {item.semester}
              </Badge>
            </div>
            
            <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h4>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeSlot.label}</span>
              </div>
              
              {item.instructor && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className={`truncate ${item.substituteInstructor ? 'line-through text-muted-foreground/60' : ''}`}>
                    {item.instructor}
                  </span>
                </div>
              )}
              
              {item.substituteInstructor && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-orange-500" />
                  <span className="truncate text-orange-600 font-medium">
                    {item.substituteInstructor} (Pengganti)
                  </span>
                </div>
              )}
              
              {item.room && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{item.room}</span>
                </div>
              )}
              
              {item.classIds && item.classIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.classIds.map(classId => {
                    const studentClass = studentClasses.find(c => c.id === classId);
                    return studentClass ? (
                      <Badge 
                        key={classId} 
                        variant="outline" 
                        className="text-xs px-1 py-0"
                      >
                        {studentClass.code}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-full w-full border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300"
              onClick={() => onAddItem(day, timeSlot)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </div>
        )}
      </Card>
    );
  };

  const getDayColor = (day: DayKey) => {
    const colors: Record<DayKey, string> = {
      monday: 'from-blue-500 to-blue-600',
      tuesday: 'from-green-500 to-green-600', 
      wednesday: 'from-purple-500 to-purple-600',
      thursday: 'from-orange-500 to-orange-600',
      friday: 'from-primary to-medical',
      saturday: 'from-medical to-accent',
      sunday: 'from-red-500 to-red-600'
    };
    return colors[day] || 'from-gray-500 to-gray-600';
  };

  const getDayTimeRange = (day: DayKey) => {
    const slots = DAY_TIME_SLOTS[day];
    if (slots.length === 0) return '';
    return `${slots[0].start} - ${slots[slots.length - 1].end}`;
  };

  return (
    <div className="space-y-8">
      {(Object.entries(DAY_TIME_SLOTS) as [DayKey, TimeSlot[]][]).map(([day, timeSlots]) => {
        return (
          <div key={day} className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${getDayColor(day)} bg-clip-text text-transparent`}>
                Jadwal {DAY_LABELS[day]}
              </h2>
              <Badge variant="outline" className="text-sm font-medium">
                {getDayTimeRange(day)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {timeSlots.map((timeSlot) => renderTimeSlot(day, timeSlot))}
            </div>
          </div>
        );
      })}
    </div>
  );
}