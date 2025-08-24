import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, BarChart3, Settings, Plus, Edit, Filter, Eye, FileText } from "lucide-react";

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuide({ isOpen, onClose }: UserGuideProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-medical bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Panduan Penggunaan Sistem Skedule PBM
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
            <TabsTrigger value="activities">Kegiatan</TabsTrigger>
            <TabsTrigger value="classes">Kelas</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Pengenalan Sistem
                  </CardTitle>
                  <CardDescription>
                    Sistem Skedule Proses Belajar Mengajar (PBM) Prodi MARS UMY
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Fungsi Utama:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Mengelola jadwal perkuliahan</li>
                        <li>• Mengatur UTS & UAS (langsung klik di jenis kegiatan)</li>
                        <li>• Mengelola seminar & tesis (langsung klik di jenis kegiatan)</li>
                        <li>• Mengelola program residensial dengan info negara</li>
                        <li>• Monitoring dan evaluasi pelaksanaan</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-medical">Keunggulan:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Interface yang user-friendly</li>
                        <li>• Responsive untuk semua device</li>
                        <li>• System monitoring terintegrasi</li>
                        <li>• Akses cepat UTS/UAS dengan 1 klik</li>
                        <li>• Akses cepat Seminar & Tesis dengan 1 klik</li>
                        <li>• Akses cepat Residensial dengan form khusus negara</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mengelola Jadwal Perkuliahan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">1. Menambah Jadwal Baru</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik tombol <Badge variant="outline" className="mx-1">+ Tambah Jadwal</Badge> di bagian atas</li>
                      <li>• Isi form: Mata Kuliah, Dosen, Hari, Jam, Semester, Kelas</li>
                      <li>• Pilih jenis kegiatan (Kuliah, Seminar, Praktek, dll)</li>
                      <li>• Klik <Badge variant="default" className="mx-1">Simpan</Badge></li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-medical pl-4">
                    <h4 className="font-semibold mb-2">2. Mengedit Jadwal</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik item jadwal yang ingin diedit di grid</li>
                      <li>• Form akan terbuka dengan data yang sudah terisi</li>
                      <li>• Ubah data yang diperlukan</li>
                      <li>• Klik <Badge variant="default" className="mx-1">Update</Badge></li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold mb-2">3. Akses Cepat UTS, UAS, Seminar, Tesis & Residensial</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Semua jenis khusus sudah terintegrasi dalam <Badge variant="secondary" className="mx-1">Jenis Kegiatan</Badge></li>
                      <li>• Klik langsung badge yang diinginkan:</li>
                      <li>  - <Badge className="bg-orange-500 text-white mx-1">UTS</Badge> dan <Badge className="bg-red-600 text-white mx-1">UAS</Badge> untuk ujian</li>
                      <li>  - <Badge className="bg-blue-500 text-white mx-1">Seminar Proposal</Badge>, <Badge className="bg-orange-500 text-white mx-1">Seminar Hasil</Badge>, <Badge className="bg-red-500 text-white mx-1">Ujian Tesis</Badge></li>
                      <li>  - <Badge className="bg-gray-500 text-white mx-1">Residensial</Badge> dengan form khusus negara dan jadwal</li>
                      <li>• Form akan terbuka otomatis dengan field yang sesuai jenis kegiatan</li>
                      <li>• Lebih efisien - hanya butuh 1 klik untuk semua jenis kegiatan</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Mengelola Jenis Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">1. Mengakses Management Kegiatan</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik tombol <Badge variant="outline" className="mx-1">Kelola Jenis Kegiatan</Badge></li>
                      <li>• Dialog management akan terbuka</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-medical pl-4">
                    <h4 className="font-semibold mb-2">2. Menambah Jenis Kegiatan Baru</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Isi field "Nama Jenis Kegiatan"</li>
                      <li>• Pilih warna yang sesuai untuk identifikasi visual</li>
                      <li>• Klik <Badge variant="default" className="mx-1">Tambah</Badge></li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold mb-2">3. Mengedit/Menghapus Kegiatan</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Gunakan tombol <Badge variant="outline" className="mx-1">Edit</Badge> untuk mengubah</li>
                      <li>• Gunakan tombol <Badge variant="destructive" className="mx-1">Hapus</Badge> untuk menghapus</li>
                      <li>• Konfirmasi akan muncul sebelum penghapusan</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Jenis Kegiatan Tersedia:</h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-500 text-white">Kuliah</Badge>
                    <Badge className="bg-blue-500 text-white">Seminar</Badge>
                    <Badge className="bg-green-500 text-white">Praktek</Badge>
                    <Badge className="bg-purple-500 text-white">Workshop</Badge>
                    <Badge className="bg-orange-500 text-white">UTS</Badge>
                    <Badge className="bg-red-600 text-white">UAS</Badge>
                    <Badge className="bg-blue-500 text-white">Seminar Proposal</Badge>
                    <Badge className="bg-orange-500 text-white">Seminar Hasil</Badge>
                    <Badge className="bg-red-500 text-white">Ujian Tesis</Badge>
                    <Badge className="bg-gray-500 text-white">Residensial</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    💡 <strong>Tips:</strong> Klik langsung pada badge untuk akses cepat dengan form yang sudah disesuaikan!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Mengelola Kelas Mahasiswa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">1. Mengakses Management Kelas</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik tombol <Badge variant="outline" className="mx-1">Kelola Kelas Mahasiswa</Badge></li>
                      <li>• Dialog management kelas akan terbuka</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-medical pl-4">
                    <h4 className="font-semibold mb-2">2. Menambah Kelas Baru</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Isi "Nama Kelas" (contoh: MARS A, MARS B)</li>
                      <li>• Isi "Jumlah Mahasiswa"</li>
                      <li>• Pilih "Tahun Angkatan"</li>
                      <li>• Klik <Badge variant="default" className="mx-1">Tambah</Badge></li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold mb-2">3. Mengedit Informasi Kelas</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik tombol <Badge variant="outline" className="mx-1">Edit</Badge> pada kelas yang dipilih</li>
                      <li>• Update informasi yang diperlukan</li>
                      <li>• Simpan perubahan</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Informasi yang Dikelola:</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Nama kelas dan identifikasi</li>
                    <li>• Jumlah mahasiswa per kelas</li>
                    <li>• Tahun angkatan untuk tracking</li>
                    <li>• Status aktif kelas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monitoring dan Evaluasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">1. Mengakses Dashboard Monitoring</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Klik tombol <Badge variant="outline" className="mx-1">Monitoring & Evaluasi</Badge></li>
                      <li>• Dashboard akan menampilkan statistik lengkap</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-medical pl-4">
                    <h4 className="font-semibold mb-2">2. Fitur Dashboard</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Overview Cards:</strong> Total sesi, persentase pelaksanaan, kehadiran dosen</li>
                      <li>• <strong>Grafik Pie Chart:</strong> Status pelaksanaan perkuliahan</li>
                      <li>• <strong>Grafik Bar Chart:</strong> Analisis kehadiran dosen</li>
                      <li>• <strong>Progress Bars:</strong> Tingkat pelaksanaan per semester</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold mb-2">3. Tab-tab Monitoring</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Overview:</strong> Grafik visual dan ringkasan</li>
                      <li>• <strong>Pelaksanaan:</strong> Progress per semester</li>
                      <li>• <strong>Dosen:</strong> Statistik kehadiran per dosen</li>
                      <li>• <strong>Per Semester:</strong> Perbandingan antar semester</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-maroon-500 pl-4">
                    <h4 className="font-semibold mb-2">4. Filter dan Analisis</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Gunakan dropdown "Filter Semester" untuk fokus analisis</li>
                      <li>• Data otomatis ter-update berdasarkan filter</li>
                      <li>• Semua grafik responsive dan interactive</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tips dan Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">💡 Tips Penggunaan Efektif</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>UTS, UAS, Seminar, Tesis & Residensial:</strong> Klik langsung pada badge untuk akses cepat</li>
                      <li>• Untuk Residensial: Isi jadwal kegiatan dan pilih negara dari dropdown</li>
                      <li>• Atur jenis kegiatan sebelum membuat jadwal untuk konsistensi</li>
                      <li>• Gunakan nama kelas yang konsisten (MARS A, MARS B, dll)</li>
                      <li>• Update data kelas secara berkala untuk akurasi monitoring</li>
                      <li>• Manfaatkan filter semester untuk analisis yang lebih fokus</li>
                    </ul>
                  </div>

                  <div className="bg-medical/10 p-4 rounded-lg border border-medical/20">
                    <h4 className="font-semibold text-medical mb-2">🎯 Best Practices</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Lakukan input jadwal secara batch untuk efisiensi</li>
                      <li>• Gunakan warna yang berbeda untuk setiap jenis kegiatan</li>
                      <li>• Review monitoring dashboard secara rutin untuk evaluasi</li>
                      <li>• Backup data dengan ekspor berkala (fitur akan ditambahkan)</li>
                    </ul>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-accent mb-2">⚠️ Hal yang Perlu Diperhatikan</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Pastikan tidak ada konflik jadwal pada jam yang sama</li>
                      <li>• Verifikasi data dosen dan mata kuliah sebelum menyimpan</li>
                      <li>• Gunakan format jam yang konsisten (HH:MM)</li>
                      <li>• Aplikasi responsive, bisa diakses dari HP/tablet/desktop</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📱 Akses Multi-Device</h4>
                    <p className="text-sm text-muted-foreground">
                      Aplikasi ini dapat diakses dari berbagai perangkat (smartphone, tablet, laptop, desktop) 
                      dengan tampilan yang otomatis menyesuaikan ukuran layar untuk pengalaman optimal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-gradient-to-r from-primary to-medical text-white">
            Tutup Panduan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}