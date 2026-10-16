import { TrainingSummary, ParticipantRecord, EvaluationRecord } from '../types';

export interface PresetPackage {
  id: string;
  name: string;
  description: string;
  tag: string;
  summary: TrainingSummary;
  participantsCSV: string;
  evaluationsCSV: string;
  notes: string;
}

export const PRESET_BPPTIK: PresetPackage = {
  id: 'preset-bpptik',
  name: 'Pelatihan dan Implementasi AI - BPPTIK Kominfo Cikarang (Template Survei Resmi)',
  description: 'Dataset resmi hasil evaluasi & survei kepuasan pelatihan BPPTIK Kominfo Cikarang dengan 33 kolom indikator PermenPANRB, NPS promosi 0-10, dan kritik saran terbuka peserta ASN.',
  tag: 'Template Resmi BPPTIK',
  summary: {
    theme: 'Pelatihan dan Implementasi AI',
    startDate: '2026-09-07',
    endDate: '2026-09-11',
    method: 'Online / Daring',
    targetBatch: 'Batch 1 - 3 (September 2026)',
    organizer: 'BPPTIK Kominfo Cikarang - Balai Pelatihan Talenta Komunikasi dan Digital',
    registeredCount: 20,
    acceptedCount: 14,
    passThreshold: 70,
    scoreScale: 100,
    learningObjectives: 'Meningkatkan pemahaman aparatur pemerintah dan pendidik mengenai implementasi praktis model Artificial Intelligence (AI) dalam peningkatan produktivitas dan kualitas layanan publik.',
    officialReference: 'B-1991/BPPTIK.3/DL.02.01/09/2026'
  },
  participantsCSV: `id,jenis_kelamin,instansi,domisili,nilai_pretest,nilai_posttest,status_kelulusan
19913180860-281,L,ASN/TNI/Polri,Kabupaten Bekasi,55,88,LULUS
19913180860-203,L,ASN/TNI/Polri,Kota Bandung,60,92,LULUS
19913180860-199,L,ASN/TNI/Polri,Kota Bogor,50,78,LULUS
19913180860-189,P,ASN/TNI/Polri,Kota Depok,65,90,LULUS
19913180860-285,L,ASN/TNI/Polri,Kabupaten Karawang,45,62,TIDAK LULUS
19913180860-257,L,ASN/TNI/Polri,Kota Cirebon,58,84,LULUS
19913180860-91,L,ASN/TNI/Polri,Kabupaten Purwakarta,62,86,LULUS
19913180860-356,L,ASN/TNI/Polri,Kota Sukabumi,50,74,LULUS
19913180860-355,L,ASN/TNI/Polri,Kabupaten Subang,56,82,LULUS
19913180860-348,L,ASN/TNI/Polri,Kabupaten Indramayu,68,95,LULUS
19913180860-338,L,ASN/TNI/Polri,Kabupaten Majalengka,52,76,LULUS
19913180860-337,L,ASN/TNI/Polri,Kabupaten Kuningan,64,91,LULUS
19913180860-336,L,ASN/TNI/Polri,Kota Cimahi,60,88,LULUS
19913180860-325,L,ASN/TNI/Polri,Kabupaten Sumedang,54,79,LULUS`,
  evaluationsCSV: `No;Jenis Layanan yang Anda Gunakan;Waktu Layanan;Rentang Usia;Jenis Kelamin;Pendidikan Terakhir;Pekerjaan Utama;Layanan pelatihan apa yang anda ikuti;Metode Pelatihan;Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya;Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini.;Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan;Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan;Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan.;Bagaimana pendapat Saudara tentang kompetensi/ kemampuan petugas (panitia/pengajar/asesor) dalam pelayanan.;Bagaimana pendapat saudara perilaku petugas (panitia/pengajar/asesor) dalam pelayanan terkait kesopanan dan keramahan;Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan.;Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana;1. Informasi pelatihan DTS/layanan BPPTIK Kominfo Cikarang tersedia melalui media elektronik (media sosial dan website).;2. Informasi persyaratan pelatihan DTS/layanan BPPTIK Kominfo Cikarang dapat dipahami dengan jelas dan sesuai dengan yang diinformasikan melalui media elektronik (media sosial dan website).;3. Prosedur/Alur pelayanan mudah diikuti/dilakukan.;4. Jangka waktu (hari/jam pelajaran) pelatihan DTS/layanan BPPTIK Kominfo Cikarang yang diterima Bapak/Ibu sesuai dengan informasi yang disampaikan.;5. Informasi biaya pelayanan dapat dipahami dengan jelas dan sesuai dengan yang diinformasikan.;6. Sarana prasarana pendukung online pelatihan DTS/pelayanan BPPTIK Kominfo Cikarang yang disediakan memberikan kenyamanan/mudah digunakan.;7. Petugas pelayanan/sistem pelayanan online pelatihan DTS/ pelayanan BPPTIK Kominfo Cikarang merespon keperluan Bapak/Ibu dengan cepat.;8. Layanan konsultasi dan pengaduan yang disediakan mudah digunakan/diakses.;1. Tidak ada diskriminasi pelayanan pada unit layanan ini (BPPTIK Kominfo Cikarang);2. Tidak ada pelayanan di luar prosedur/kecurangan pelayanan (BPPTIK Kominfo Cikarang);3. Tidak ada penerimaan imbalan uang/barang/fasilitas di luar ketentuan yang berlaku pada unit layanan ini (BPPTIK Kominfo Cikarang).;4. Tidak ada pungutan liar (pungli) pada unit layanan ini (BPPTIK Kominfo Cikarang).;5. Tidak ada percaloan/perantara pada unit layanan ini (BPPTIK Kominfo Cikarang).;Menurut pendapat Anda, dalam skala 0-10, berapa besar keinginan anda untuk mempromosikan Pelatihan atau kerjasama dengan BPPTIK Kominfo Cikarang kepada orang lain?;Mohon berikan kritik, saran dan masukan bagi penyelenggaraan pelatihan yang lebih baik lagi di masa depan
19913180860-281;Layanan Pelatihan;September;26 - 30;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Sesuai;Sangat Mudah;Sangat Cepat;Gratis;Sangat Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Sangat Baik;4;4;4;4;4;4;4;4;4;4;4;4;4;10;Semoga materi yang akan selalu bermanfaat bagi ASN
19913180860-203;Layanan Pelatihan;September;31 - 35;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Tidak Sesuai;Mudah;Tidak Cepat;Gratis;Sesuai;Kompeten;Sangat sopan dan ramah;Berfungsi kurang maksimal;Baik;4;3;3;3;4;2;3;2;4;4;4;4;4;10;Penyelenggaraannya bagus, namun mohon agar performa website lebih ditingkatkan lagi
19913180860-199;Layanan Pelatihan;September;41 - 45;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 2 (8 - 10 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Kompeten;Sopan dan ramah;Dikelola dengan baik;Baik;4;4;3;3;3;3;3;3;3;3;3;3;3;9;Agar lebih dipublikasikan setiap kegiatan
19913180860-189;Layanan Pelatihan;September;51 - 55;Wanita;SMP sederajat;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Kompeten;Sopan dan ramah;Dikelola dengan baik;Baik;3;3;3;3;3;3;3;3;4;3;3;4;3;10;Dibuka kelas offline lagi
19913180860-285;Layanan Pelatihan;September;31 - 35;Pria;SD ke bawah;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Sesuai;Sangat Mudah;Sangat Cepat;Gratis;Sangat Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Sangat Baik;4;4;4;4;4;4;4;4;4;4;4;4;4;10;pelatihan yg baik
19913180860-257;Layanan Pelatihan;September;31 - 35;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Kompeten;Sopan dan ramah;Dikelola dengan baik;Baik;3;3;3;3;4;4;3;3;3;3;3;4;3;8;Lanjutkan, Semoga lebih baik lg
19913180860-91;Layanan Pelatihan;September;56 +;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Sesuai;Sangat Mudah;Cepat;Gratis;Sangat Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Sangat Baik;4;4;4;4;4;4;4;4;4;4;4;4;4;10;Lebih sukses utk yg akan datang
19913180860-356;Layanan Pelatihan;September;51 - 55;Pria;SMA sederajat;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Sesuai;Sangat Mudah;Cepat;Gratis;Sangat Sesuai;Sangat Kompeten;Sopan dan ramah;Dikelola dengan baik;Sangat Baik;4;4;4;4;4;4;4;4;4;4;4;4;4;10;Terkendala pada server karena padatnya peserta pelatihan 
19913180860-355;Layanan Pelatihan;September;51 - 55;Pria;S2;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Kompeten;Sopan dan ramah;Dikelola dengan baik;Baik;3;3;3;3;4;4;4;3;4;3;4;4;4;10;Sudah baik dipertahankan saja
19913180860-348;Layanan Pelatihan;September;46 - 50;Pria;S2;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sangat Sesuai;Mudah;Cepat;Gratis;Sangat Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Baik;4;4;4;4;4;3;3;4;4;4;4;4;4;10;agar dapat diselenggarakan pelatihan AI yagn lebih spesifik Untuk Guru/Pendidik, seperti pelatihan pembuatan media dan video pembelajaran berbasis AI
19913180860-338;Layanan Pelatihan;September;41 - 45;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Kompeten;Sopan dan ramah;Dikelola dengan baik;Baik;3;3;3;3;3;3;3;3;3;3;3;3;3;8;OK
19913180860-337;Layanan Pelatihan;September;46 - 50;Pria;S2;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 2 (8 - 10 September);Online/daring;Sangat Sesuai;Sangat Mudah;Cepat;Gratis;Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Baik;3;4;4;4;4;4;3;3;4;4;4;4;4;10;Materi LMS agar Bisa di Unduh Sehungga bisa sewaktu-waktu dibuka lagi dengan tidak harus online  dulu ke LMS
19913180860-336;Layanan Pelatihan;September;41 - 45;Pria;D4 / S1;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 1 ( 7 - 9 September);Online/daring;Sangat Sesuai;Sangat Mudah;Cepat;Gratis;Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Dikelola dengan baik;Sangat Baik;4;4;4;4;4;4;4;4;4;4;4;4;4;10;Materinya bisa di download
19913180860-325;Layanan Pelatihan;September;46 - 50;Pria;S2;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Berfungsi kurang maksimal;Baik;3;3;3;3;3;3;3;3;4;3;4;4;3;8;-`,
  notes: 'Dataset resmi survei evaluasi BPPTIK Kominfo Cikarang dengan 33 indikator kepuasan, NPS promosi rata-rata 9.5/10, dan aspirasi ASN/pendidik terkait kapasitas server, download materi LMS, dan pelatihan AI khusus guru.'
};

export const PRESET_VALID: PresetPackage = {
  id: 'preset-valid',
  name: 'Pelatihan Junior Web Developer & Cloud Fundamentals (Data Valid & Bersih)',
  description: 'Contoh dataset evaluasi pelatihan lengkap dan bersih (32 peserta), tanpa anomali. Cocok untuk uji coba alur normal hingga penerbitan draf laporan.',
  tag: '100% Valid',
  summary: {
    theme: 'Pelatihan Junior Web Developer & Cloud Fundamentals',
    startDate: '2026-09-08',
    endDate: '2026-09-19',
    method: 'Blended Learning',
    targetBatch: 'Angkatan II - TA 2026',
    organizer: 'Balai Pelatihan Talenta Komunikasi dan Digital',
    registeredCount: 45,
    acceptedCount: 32,
    passThreshold: 70,
    scoreScale: 100,
    learningObjectives: 'Meningkatkan kompetensi ASN dan talenta digital dalam pemrograman web modern, arsitektur RESTful API, dan deployment aplikasi cloud.',
    officialReference: 'B-1428/BPTKD.3/DL.02.01/09/2026'
  },
  participantsCSV: `id,jenis_kelamin,instansi,domisili,nilai_pretest,nilai_posttest,status_kelulusan
P001,L,Dinas Komunikasi dan Informatika,Kota Semarang,55,85,LULUS
P002,P,Badan Kepegawaian Daerah,Kabupaten Banyumas,62,90,LULUS
P003,L,Bappeda Provinsi Jawa Tengah,Kota Surakarta,50,78,LULUS
P004,P,Dinas Perpustakaan dan Kearsipan,Kabupaten Cilacap,65,92,LULUS
P005,L,Kecamatan Banyumanik,Kota Semarang,48,65,TIDAK LULUS
P006,P,Dinas Kesehatan,Kabupaten Magelang,58,84,LULUS
P007,L,Inspektorat Daerah,Kota Salatiga,60,88,LULUS
P008,L,Dinas Perhubungan,Kabupaten Klaten,52,76,LULUS
P009,P,Dinas Koperasi dan UKM,Kabupaten Purbalingga,70,95,LULUS
P010,L,Biro Organisasi Setda,Kota Semarang,40,58,TIDAK LULUS
P011,P,Dinas Sosial,Kabupaten Boyolali,64,86,LULUS
P012,L,Dinas PUPR,Kabupaten Kudus,56,80,LULUS
P013,P,Sekretariat DPRD,Kabupaten Kebumen,68,94,LULUS
P014,L,Dinas Pendidikan,Kabupaten Demak,50,72,LULUS
P015,P,Badan Pendapatan Daerah,Kota Semarang,72,96,LULUS
P016,L,Dinas Pariwisata,Kabupaten Wonosobo,45,74,LULUS
P017,P,Dinas Lingkungan Hidup,Kabupaten Pemalang,62,88,LULUS
P018,L,Biro Umum Setda,Kota Semarang,54,78,LULUS
P019,P,Dinas Ketahanan Pangan,Kabupaten Sukoharjo,66,90,LULUS
P020,L,Bagian Pengadaan Barang & Jasa,Kota Tegal,42,62,TIDAK LULUS
P021,P,Dinas Kependudukan & Capil,Kabupaten Brebes,60,85,LULUS
P022,L,Balai Pengujian Mutu,Kabupaten Pekalongan,58,82,LULUS
P023,P,Dinas Perindustrian & Perdagangan,Kota Pekalongan,70,92,LULUS
P024,L,Puskesmas Pegandan,Kota Semarang,52,78,LULUS
P025,P,Dinas Pertanian dan Perkebunan,Kabupaten Temanggung,64,88,LULUS
P026,L,Dinas Kominfo,Kabupaten Batang,56,84,LULUS
P027,P,RSUD Tugurejo,Kota Semarang,68,91,LULUS
P028,L,Kecamatan Gajahmungkur,Kota Semarang,50,75,LULUS
P029,P,Dinas Tenaga Kerja,Kabupaten Kendal,60,86,LULUS
P030,L,Satpol PP Provinsi Jawa Tengah,Kota Semarang,48,70,LULUS
P031,P,Biro Perekonomian Setda,Kota Semarang,65,89,LULUS
P032,L,Dinas Arsip dan Perpustakaan,Kabupaten Jepara,58,82,LULUS`,
  evaluationsCSV: `aspek,objek,skor,skala,komentar
Penguasaan Materi,Pengajar,4.8,5,Instruktur sangat menguasai arsitektur React dan Express, penjelasan konsep komponen sangat terstruktur.
Metode Pengajaran,Pengajar,4.6,5,Metode live-coding dan hands-on lab sangat membantu mempermudah peserta yang belum terbiasa dengan Git.
Kecepatan Penyampaian,Pengajar,4.2,5,Materi REST API di hari ke-4 terasa sedikit cepat bagi peserta yang berlatar belakang non-TI.
Interaksi dan Diskusi,Pengajar,4.9,5,Instruktur sangat ramah dan sabar membantu debug kode saat peserta mengalami error saat lab.
Kesesuaian Silabus,Pengajar,4.7,5,Materi yang diajarkan sangat relevan dengan kebutuhan digitalisasi layanan publik di instansi masing-masing.
Sarana & Prasarana Lab,Panitia,4.7,5,Spesifikasi PC di lab pelatihan sangat memadai dan koneksi jaringan internet gigabit sangat lancar.
Pelayanan Panitia,Panitia,4.8,5,Panitia sangat sigap menyiapkan modul cetak, sertifikat sementara, dan tautan repository materi.
Konsumsi & Istirahat,Panitia,4.4,5,Menu konsumsi bervariasi dan tepat waktu, namun jeda istirahat sholat Jumat perlu sedikit diperpanjang.
Kejelasan Jadwal & Pengumuman,Panitia,4.6,5,Grup koordinasi WhatsApp sangat aktif mengabarkan jadwal penugasan harian.
Bimbingan Teknis Cloud,Pengajar,4.5,5,Simulasi deploy ke cloud sandbox sangat praktis dan memberi gambaran nyata lingkungan produksi.
Kebersihan & Kenyamanan Kelas,Panitia,4.8,5,Ruangan kelas ber-AC sejuk, bersih, dan tata letak meja lab ergonomis.
Waktu Pengerjaan Proyek Akhir,Pengajar,4.1,5,Alokasi waktu pengerjaan capstone project 2 hari terasa mepet karena fiturnya cukup kompleks.`,
  notes: 'Dataset ideal untuk memverifikasi perhitungan statistik (N-Gain, rasio L/P, kelulusan 90.6%) dan perangkuman AI tematik.'
};

export const PRESET_ANOMALY: PresetPackage = {
  id: 'preset-anomaly',
  name: 'Pelatihan Data Science for Public Policy (Uji Deteksi Anomali & Kontrol Agen)',
  description: 'Contoh dataset simulasi yang sengaja disisipi nilai kosong, nilai di luar rentang (skor 125 & -15), ID ganda (P008 berulang), dan status lulus yang tidak cocok kriteria.',
  tag: 'Simulasi Anomali Data',
  summary: {
    theme: 'Pelatihan Data Science for Public Policy & AI Governance',
    startDate: '2026-10-01',
    endDate: '2026-10-12',
    method: 'Online / Daring',
    targetBatch: 'Angkatan I - ASN Digital',
    organizer: 'Balai Pelatihan Talenta Komunikasi dan Digital',
    registeredCount: 35,
    acceptedCount: 22,
    passThreshold: 75,
    scoreScale: 100,
    learningObjectives: 'Membekali aparatur pemerintah dengan kemampuan analitik data berbasis Python, visualisasi kebijakan publik, dan etika kecerdasan artifisial.',
    officialReference: 'B-1590/BPTKD.3/DL.02.01/10/2026'
  },
  participantsCSV: `id,jenis_kelamin,instansi,domisili,nilai_pretest,nilai_posttest,status_kelulusan
P001,L,Dinas Kominfosandi,Kabupaten Wonosobo,50,82,LULUS
P002,P,Bappeda Litbang,Kota Surakarta,65,88,LULUS
P003,L,Badan Kepegawaian Daerah,Kota Magelang,45,78,LULUS
P004,P,Dinas Koperasi dan UMKM,Kota Semarang,55,92,LULUS
P005,L,Dinas Perhubungan,Kabupaten Demak,40,,TIDAK LULUS
P006,P,Inspektorat Daerah,Kabupaten Kendal,60,125,LULUS
P007,L,Dinas Sosial,Kabupaten Grobogan,50,76,LULUS
P008,L,Dinas Kesehatan,Kota Semarang,58,84,LULUS
P008,L,Dinas Kesehatan,Kota Semarang,58,84,LULUS
P009,P,Dinas PUPR,Kabupaten Banyumas,62,80,LULUS
P010,L,Biro Hukum Setda,Kota Semarang,35,55,LULUS
P011,P,Dinas Lingkungan Hidup,Kabupaten Kudus,55,85,LULUS
P012,L,Bagian Organisasi,Kabupaten Jepara,48,-15,TIDAK LULUS
P013,P,Dinas Ketahanan Pangan,Kota Salatiga,64,90,LULUS
P014,L,Dinas Pendidikan,Kabupaten Brebes,52,70,TIDAK LULUS
P015,P,Dinas Pariwisata,Kabupaten Tegal,58,82,LULUS
P016,L,Kecamatan Gajahmungkur,Kota Semarang,44,76,LULUS
P017,P,Dinas Perindustrian,Kabupaten Sukoharjo,60,86,LULUS
P018,L,Bappeda,Kabupaten Cilacap,50,80,LULUS
P019,P,RSUD Moewardi,Kota Surakarta,66,94,LULUS
P020,L,Kecamatan Laweyan,Kota Surakarta,40,78,LULUS`,
  evaluationsCSV: `aspek,objek,skor,skala,komentar
Penguasaan Materi,Pengajar,4.8,5,Pengajar sangat ahli dalam machine learning dan studi kasus data open government.
Kualitas Audio & Video Zoom,Panitia,3.2,5,Pada hari kedua audio instruktur sempat terputus-putus sekitar 20 menit saat sesi live coding.
Metode Penyampaian,Pengajar,4.5,5,Pemberian kuis interaktif di awal sesi sangat membangkitkan fokus belajar.
Bahan Ajar & Jupyter Notebook,Pengajar,4.7,5,Bahan notebook Google Colab sangat rapi dan siap dijalankan tanpa ribet setup environment.
Koordinasi Panitia Daring,Panitia,4.6,5,Admin webinar tanggap merespons peserta yang mengalami kendala izin akses dataset.
Tugas Analisis Kasus,Pengajar,7.5,5,Tugas analisis prediktif stunting sangat aplikatif untuk perencanaan daerah.
Ketersediaan Rekaman Sesi,Panitia,4.9,5,Rekaman video langsung diunggah ke Google Drive di sore hari sehingga bisa dipelajari ulang.`,
  notes: 'Dataset ini memicu anomali: (1) Nilai kosong pada P005, (2) Nilai 125 di luar rentang pada P006, (3) ID ganda P008, (4) Status LULUS padahal skor 55 < kriteria 75 pada P010, (5) Nilai minus -15 pada P012, dan (6) Skor evaluasi 7.5 dari skala 5. Agen akan mengecualikan baris bermasalah dan mencatatnya di panel keterbatasan.'
};
