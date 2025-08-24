import { GraduationCap, Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Header() {
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
        <h3 className="text-lg font-semibold mb-4 text-foreground">Jenis Kegiatan Program Studi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Badge className="bg-primary text-primary-foreground justify-center py-2">
            Kuliah
          </Badge>
          <Badge className="bg-medical text-medical-foreground justify-center py-2">
            UTS
          </Badge>
          <Badge className="bg-academic text-academic-foreground justify-center py-2">
            UAS
          </Badge>
          <Badge className="bg-accent text-accent-foreground justify-center py-2">
            Seminar Proposal
          </Badge>
          <Badge className="bg-secondary text-secondary-foreground justify-center py-2">
            Seminar Hasil
          </Badge>
          <Badge className="bg-destructive text-destructive-foreground justify-center py-2">
            Ujian Tesis
          </Badge>
          <Badge className="bg-muted text-muted-foreground justify-center py-2">
            Residensi
          </Badge>
        </div>
      </Card>
    </div>
  );
}