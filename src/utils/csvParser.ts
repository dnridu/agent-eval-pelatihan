import { ParticipantRecord, EvaluationRecord } from '../types';

/**
 * Robust CSV parser handling quotes, line breaks, BOM, and comma/semicolon delimiters.
 */
export function parseCSV(content: string): string[][] {
  // Strip BOM if present
  let cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
  cleanContent = cleanContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  // Detect delimiter (, or ;) based on first line
  const firstLine = cleanContent.split('\n')[0] || '';
  const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i];
    const nextChar = cleanContent[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(col => col.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push last row if non-empty
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(col => col.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data: T[];
  missingColumns?: string[];
  foundColumns?: string[];
  formatDetected?: 'bpptik_resmi' | 'standar_5_kolom';
}

export function validateAndParseParticipants(csvContent: string): ValidationResult<ParticipantRecord> {
  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return {
      isValid: false,
      error: 'Berkas CSV kosong atau tidak memiliki baris data setelah header.',
      data: []
    };
  }

  const rawHeaders = rows[0].map(h => h.toLowerCase().trim().replace(/[\s_-]+/g, ''));
  
  // Header aliases
  const findColIndex = (candidates: string[]) => {
    return rawHeaders.findIndex(h => candidates.includes(h));
  };

  const idIdx = findColIndex(['id', 'idpeserta', 'nomorid', 'no_id', 'nomorpeserta', 'no']);
  const genderIdx = findColIndex(['jeniskelamin', 'jk', 'gender', 'sex', 'l/p']);
  const agencyIdx = findColIndex(['instansi', 'unitkerja', 'asalinstansi', 'lembaga', 'organisasi', 'pekerjaanutama']);
  const domicileIdx = findColIndex(['domisili', 'kota', 'kabupaten', 'asaldaerah', 'provinsi']);
  const pretestIdx = findColIndex(['nilaipretest', 'pretest', 'pre_test', 'nilai_pre', 'nilaiawal']);
  const posttestIdx = findColIndex(['nilaiposttest', 'posttest', 'post_test', 'nilai_post', 'nilaiakhir']);
  const statusIdx = findColIndex(['statuskelulusan', 'status', 'kelulusan', 'statuslulus', 'lulus/tidak']);

  const missingColumns: string[] = [];
  if (idIdx === -1) missingColumns.push('id');
  if (genderIdx === -1) missingColumns.push('jenis_kelamin');
  if (agencyIdx === -1) missingColumns.push('instansi');
  if (domicileIdx === -1) missingColumns.push('domisili');
  if (pretestIdx === -1) missingColumns.push('nilai_pretest');
  if (posttestIdx === -1) missingColumns.push('nilai_posttest');
  if (statusIdx === -1) missingColumns.push('status_kelulusan');

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Format kolom tidak sesuai template baku. Kolom wajib yang hilang: ${missingColumns.join(', ')}.`,
      missingColumns,
      foundColumns: rows[0],
      data: []
    };
  }

  const records: ParticipantRecord[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every(val => val.trim() === '')) continue;

    const id = row[idIdx] || '';
    const rawGender = (row[genderIdx] || '').toUpperCase().trim();
    const gender: 'L' | 'P' = (rawGender.startsWith('L') || rawGender.startsWith('P') && !rawGender.startsWith('PEREMPUAN') && !rawGender.startsWith('PRIA')) 
      ? (rawGender === 'P' || rawGender.startsWith('PEREMPUAN') || rawGender.startsWith('WANITA') ? 'P' : 'L')
      : (rawGender.startsWith('PRIA') ? 'L' : 'P');
    const agency = row[agencyIdx] || '';
    const domicile = row[domicileIdx] || '';
    
    const preStr = (row[pretestIdx] || '').replace(',', '.').trim();
    const pretestScore = preStr === '' || isNaN(Number(preStr)) ? null : parseFloat(preStr);

    const postStr = (row[posttestIdx] || '').replace(',', '.').trim();
    const posttestScore = postStr === '' || isNaN(Number(postStr)) ? null : parseFloat(postStr);

    const rawStatus = (row[statusIdx] || '').toUpperCase().trim();
    const statusLulus = rawStatus.includes('TIDAK') || rawStatus === 'GAGAL' || rawStatus === 'BELUM LULUS' ? 'TIDAK LULUS' : 'LULUS';

    records.push({
      id,
      gender,
      agency,
      domicile,
      pretestScore,
      posttestScore,
      statusLulus,
      _rowNumber: i + 1
    });
  }

  return {
    isValid: true,
    data: records,
    foundColumns: rows[0]
  };
}

/**
 * Convert Indonesian qualitative survey Likert responses to 5-scale numerical scores
 */
function likertToScore(val: string | undefined): number {
  if (!val) return 4;
  const v = val.toLowerCase().trim();
  
  // 5 / 5
  if (
    v.includes('sangat sesuai') ||
    v.includes('sangat mudah') ||
    v.includes('sangat cepat') ||
    v.includes('sangat kompeten') ||
    v.includes('sangat sopan') ||
    v.includes('sangat baik') ||
    v.includes('dikelola dengan baik')
  ) {
    return 5;
  }

  // 4 / 5
  if (
    v.includes('sesuai') ||
    v.includes('mudah') ||
    v.includes('cepat') ||
    v.includes('kompeten') ||
    v.includes('sopan') ||
    v.includes('baik')
  ) {
    return 4;
  }

  // 3 / 5
  if (v.includes('cukup')) {
    return 3;
  }

  // 2 / 5
  if (
    v.includes('tidak cepat') ||
    v.includes('berfungsi kurang maksimal') ||
    v.includes('kurang') ||
    (v.includes('tidak sesuai') && !v.includes('sangat tidak sesuai'))
  ) {
    return 2;
  }

  // 1 / 5
  if (v.includes('sangat tidak') || v.includes('buruk')) {
    return 1;
  }

  // Try direct numeric parse
  const num = parseFloat(v.replace(',', '.'));
  if (!isNaN(num)) {
    if (num <= 4 && num >= 1) return Math.round((num / 4) * 5 * 10) / 10;
    if (num <= 10 && num > 4) return Math.round((num / 10) * 5 * 10) / 10;
    return num;
  }

  return 4; // default positive
}

/**
 * Validates and parses evaluation and survey CSV.
 * Supports BOTH:
 * 1. Official BPPTIK Kominfo Cikarang survey questionnaire format (with 33 columns, Likert scales, and open comments).
 * 2. Standard 5-column format ('aspek', 'objek', 'skor', 'skala', 'komentar').
 */
export function validateAndParseEvaluations(csvContent: string): ValidationResult<EvaluationRecord> {
  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return {
      isValid: false,
      error: 'Berkas CSV Evaluasi kosong atau tidak memiliki baris data setelah header.',
      data: []
    };
  }

  const rawHeaders = rows[0];
  const normalizedHeaders = rawHeaders.map(h => h.toLowerCase().trim());

  // Check if this is the Official BPPTIK Kominfo Survey Format
  const isBPPTIKFormat = normalizedHeaders.some(h => 
    h.includes('kritik, saran dan masukan') || 
    h.includes('bpptik') || 
    h.includes('kompetensi/ kemampuan petugas') ||
    h.includes('layanan pelatihan apa yang anda ikuti')
  );

  if (isBPPTIKFormat) {
    // Locate specific questions from BPPTIK Kominfo questionnaire
    const findHeaderIdx = (pattern: string) => {
      return normalizedHeaders.findIndex(h => h.includes(pattern));
    };

    const commentIdx = findHeaderIdx('kritik, saran dan masukan') !== -1 
      ? findHeaderIdx('kritik, saran dan masukan')
      : findHeaderIdx('saran');

    const competencyIdx = findHeaderIdx('kompetensi/ kemampuan petugas');
    const behaviorIdx = findHeaderIdx('perilaku petugas') !== -1 ? findHeaderIdx('perilaku petugas') : findHeaderIdx('kesopanan dan keramahan');
    const facilityIdx = findHeaderIdx('kualitas sarana dan prasarana');
    const onlineFacilityIdx = findHeaderIdx('sarana prasarana pendukung online');
    const procedureIdx = findHeaderIdx('kemudahan prosedur pelayanan');
    const speedIdx = findHeaderIdx('kecepatan waktu dalam memberikan pelayanan');
    const complaintIdx = findHeaderIdx('penanganan pengaduan pengguna layanan');

    if (commentIdx === -1) {
      return {
        isValid: false,
        error: 'Berkas survei BPPTIK tidak memiliki kolom kritik, saran dan masukan.',
        foundColumns: rows[0],
        data: []
      };
    }

    const records: EvaluationRecord[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length === 0 || row.every(val => val.trim() === '')) continue;

      const rawComment = (row[commentIdx] || '').trim();
      // Clean comments like "-" or "OK" or "."
      const cleanedComment = (rawComment === '-' || rawComment === '.') ? '' : rawComment;

      // 1. Aspek Kompetensi Pengajar / Instruktur
      if (competencyIdx !== -1) {
        records.push({
          id: `EV-AJAR-${i}`,
          aspect: 'Penguasaan & Kompetensi Pengajar',
          target: 'Pengajar',
          score: likertToScore(row[competencyIdx]),
          scale: 5,
          comment: cleanedComment,
          _rowNumber: i + 1
        });
      }

      // 2. Aspek Keramahan & Perilaku Petugas / Panitia
      if (behaviorIdx !== -1) {
        records.push({
          id: `EV-PANITIA-${i}`,
          aspect: 'Pelayanan & Keramahan Panitia',
          target: 'Panitia',
          score: likertToScore(row[behaviorIdx]),
          scale: 5,
          comment: cleanedComment,
          _rowNumber: i + 1
        });
      }

      // 3. Aspek Sarana & Prasarana Online / LMS
      if (facilityIdx !== -1 || onlineFacilityIdx !== -1) {
        const val = facilityIdx !== -1 ? row[facilityIdx] : row[onlineFacilityIdx];
        records.push({
          id: `EV-SARANA-${i}`,
          aspect: 'Sarana Prasarana & Sistem Online LMS',
          target: 'Panitia',
          score: likertToScore(val),
          scale: 5,
          comment: cleanedComment,
          _rowNumber: i + 1
        });
      }

      // 4. Aspek Kecepatan & Prosedur Layanan
      if (speedIdx !== -1 || procedureIdx !== -1) {
        const val = speedIdx !== -1 ? row[speedIdx] : row[procedureIdx];
        records.push({
          id: `EV-PROSEDUR-${i}`,
          aspect: 'Kecepatan & Prosedur Pelayanan',
          target: 'Panitia',
          score: likertToScore(val),
          scale: 5,
          comment: '',
          _rowNumber: i + 1
        });
      }

      // 5. Aspek Penanganan Pengaduan Layanan
      if (complaintIdx !== -1) {
        records.push({
          id: `EV-ADUAN-${i}`,
          aspect: 'Penanganan Pengaduan Layanan',
          target: 'Panitia',
          score: likertToScore(row[complaintIdx]),
          scale: 5,
          comment: '',
          _rowNumber: i + 1
        });
      }
    }

    return {
      isValid: true,
      data: records,
      foundColumns: rows[0],
      formatDetected: 'bpptik_resmi'
    };
  }

  // Case B: Standard 5-column format
  const cleanHeaders = rows[0].map(h => h.toLowerCase().trim().replace(/[\s_-]+/g, ''));
  const findColIndex = (candidates: string[]) => {
    return cleanHeaders.findIndex(h => candidates.includes(h));
  };

  const aspectIdx = findColIndex(['aspek', 'aspekyangdinilai', 'indikator', 'aspekpenilaian', 'kategori']);
  const targetIdx = findColIndex(['objek', 'target', 'objekevaluasi', 'sasaran', 'penilaianterhadap']);
  const scoreIdx = findColIndex(['skor', 'nilai', 'score', 'nilaiskor']);
  const scaleIdx = findColIndex(['skala', 'skalamaksimal', 'skalaskor', 'rentang']);
  const commentIdx = findColIndex(['komentar', 'tekskomentar', 'masukan', 'catatan', 'umpanbalik', 'kritiksaran']);

  const missingColumns: string[] = [];
  if (aspectIdx === -1) missingColumns.push('aspek');
  if (targetIdx === -1) missingColumns.push('objek');
  if (scoreIdx === -1) missingColumns.push('skor');
  if (scaleIdx === -1) missingColumns.push('skala');
  if (commentIdx === -1) missingColumns.push('komentar');

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Format kolom evaluasi tidak sesuai. Gunakan template resmi BPPTIK Kominfo atau template standar (kolom: ${missingColumns.join(', ')}).`,
      missingColumns,
      foundColumns: rows[0],
      data: []
    };
  }

  const records: EvaluationRecord[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every(val => val.trim() === '')) continue;

    const aspect = row[aspectIdx] || 'Umum';
    const rawTarget = (row[targetIdx] || '').toLowerCase().trim();
    const target: 'Pengajar' | 'Panitia' = rawTarget.includes('ajar') || rawTarget.includes('nara') || rawTarget.includes('instruktur') || rawTarget.includes('fasilitator') ? 'Pengajar' : 'Panitia';
    
    const scoreStr = (row[scoreIdx] || '').replace(',', '.').trim();
    const score = isNaN(Number(scoreStr)) ? 0 : parseFloat(scoreStr);

    const scaleStr = (row[scaleIdx] || '').replace(',', '.').trim();
    const scale = isNaN(Number(scaleStr)) || Number(scaleStr) <= 0 ? 5 : parseFloat(scaleStr);

    const comment = (row[commentIdx] || '').trim();

    records.push({
      id: `EV-${i}`,
      aspect,
      target,
      score,
      scale,
      comment,
      _rowNumber: i + 1
    });
  }

  return {
    isValid: true,
    data: records,
    foundColumns: rows[0],
    formatDetected: 'standar_5_kolom'
  };
}

export const TEMPLATE_DATA_PESERTA_CSV = `id,jenis_kelamin,instansi,domisili,nilai_pretest,nilai_posttest,status_kelulusan
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
19913180860-325,L,ASN/TNI/Polri,Kabupaten Sumedang,54,79,LULUS`;

export const TEMPLATE_EVALUASI_CSV = `No;Jenis Layanan yang Anda Gunakan;Waktu Layanan;Rentang Usia;Jenis Kelamin;Pendidikan Terakhir;Pekerjaan Utama;Layanan pelatihan apa yang anda ikuti;Metode Pelatihan;Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya;Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini.;Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan;Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan;Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan.;Bagaimana pendapat Saudara tentang kompetensi/ kemampuan petugas (panitia/pengajar/asesor) dalam pelayanan.;Bagaimana pendapat saudara perilaku petugas (panitia/pengajar/asesor) dalam pelayanan terkait kesopanan dan keramahan;Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan.;Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana;1. Informasi pelatihan DTS/layanan BPPTIK Kominfo Cikarang tersedia melalui media elektronik (media sosial dan website).;2. Informasi persyaratan pelatihan DTS/layanan BPPTIK Kominfo Cikarang dapat dipahami dengan jelas dan sesuai dengan yang diinformasikan melalui media elektronik (media sosial dan website).;3. Prosedur/Alur pelayanan mudah diikuti/dilakukan.;4. Jangka waktu (hari/jam pelajaran) pelatihan DTS/layanan BPPTIK Kominfo Cikarang yang diterima Bapak/Ibu sesuai dengan informasi yang disampaikan.;5. Informasi biaya pelayanan dapat dipahami dengan jelas dan sesuai dengan yang diinformasikan.;6. Sarana prasarana pendukung online pelatihan DTS/pelayanan BPPTIK Kominfo Cikarang yang disediakan memberikan kenyamanan/mudah digunakan.;7. Petugas pelayanan/sistem pelayanan online pelatihan DTS/ pelayanan BPPTIK Kominfo Cikarang merespon keperluan Bapak/Ibu dengan cepat.;8. Layanan konsultasi dan pengaduan yang disediakan mudah digunakan/diakses.;1. Tidak ada diskriminasi pelayanan pada unit layanan ini (BPPTIK Kominfo Cikarang);2. Tidak ada pelayanan di luar prosedur/kecurangan pelayanan (BPPTIK Kominfo Cikarang);3. Tidak ada penerimaan imbalan uang/barang/fasilitas di luar ketentuan yang berlaku pada unit layanan ini (BPPTIK Kominfo Cikarang).;4. Tidak ada pungutan liar (pungli) pada unit layanan ini (BPPTIK Kominfo Cikarang).;5. Tidak ada percaloan/perantara pada unit layanan ini (BPPTIK Kominfo Cikarang).;Menurut pendapat Anda, dalam skala 0-10, berapa besar keinginan anda untuk mempromosikan Pelatihan atau kerjasama dengan BPPTIK Kominfo Cikarang kepada orang lain?;Mohon berikan kritik, saran dan masukan bagi penyelenggaraan pelatihan yang lebih baik lagi di masa depan
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
19913180860-325;Layanan Pelatihan;September;46 - 50;Pria;S2;ASN/TNI/Polri;Pelatihan dan Implementasi AI - Batch 3 (9 - 11 September);Online/daring;Sesuai;Mudah;Cepat;Gratis;Sesuai;Sangat Kompeten;Sangat sopan dan ramah;Berfungsi kurang maksimal;Baik;3;3;3;3;3;3;3;3;4;3;4;4;3;8;-`;
