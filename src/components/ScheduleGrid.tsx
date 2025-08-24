import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, MapPin, User } from "lucide-react";
import { ScheduleItem, FRIDAY_TIME_SLOTS, SATURDAY_TIME_SLOTS, ActivityTypeConfig, TimeSlot } from "@/types/schedule";
import { StudentClass } from "@/types/student-class";

interface ScheduleGridProps {
  scheduleItems: ScheduleItem[];
  activityTypes: Record<string, ActivityTypeConfig>;
  studentClasses: StudentClass[];
  onAddItem: (day: 'friday' | 'saturday', timeSlot: TimeSlot) => void;
  onEditItem: (item: ScheduleItem) => void;
}

export function ScheduleGrid({ scheduleItems, activityTypes, studentClasses, onAddItem, onEditItem }: ScheduleGridProps) {
  const renderTimeSlot = (day: 'friday' | 'saturday', timeSlot: TimeSlot) => {
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

  return (
    <div className="space-y-8">
      {/* Friday Schedule */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent">
            Jadwal Jumat
          </h2>
          <Badge variant="outline" className="text-sm font-medium">
            13:00 - 21:00
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FRIDAY_TIME_SLOTS.map((timeSlot) => renderTimeSlot('friday', timeSlot))}
        </div>
      </div>

      {/* Saturday Schedule */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-medical" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-medical to-accent bg-clip-text text-transparent">
            Jadwal Sabtu
          </h2>
          <Badge variant="outline" className="text-sm font-medium">
            08:00 - 18:00
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {SATURDAY_TIME_SLOTS.map((timeSlot) => renderTimeSlot('saturday', timeSlot))}
        </div>
      </div>
    </div>
  );
}