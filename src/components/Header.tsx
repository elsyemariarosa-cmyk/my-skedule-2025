import { GraduationCap, Calendar, Users, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTypeConfig } from "@/types/schedule";

interface HeaderProps {
  activityTypes: Record<string, ActivityTypeConfig>;
  onOpenActivityManager: () => void;
}

export function Header({ activityTypes, onOpenActivityManager }: HeaderProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-medical to-accent p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Sistem Penjadwalan MARS
              </h1>
              <p className="text-white/80 text-lg">
                Magister Administrasi Rumah Sakit
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
                  <p className="font-semibold">2 Jam</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenActivityManager}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Kelola Jenis Kegiatan
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(activityTypes).map(([key, config]) => (
            <Badge key={key} className={`${config.color} justify-center py-2`}>
              {config.label}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}