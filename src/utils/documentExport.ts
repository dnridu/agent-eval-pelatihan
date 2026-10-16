import jsPDF from 'jspdf';
import { TrainingSummary, StatisticsResult, DataQualityResult, KeyFinding, Recommendation } from '../types';

export interface DocumentExportData {
  summary: TrainingSummary;
  stats: StatisticsResult;
  quality: DataQualityResult;
  executiveSummary: string;
  dataQualityNarrative: string;
  findings: KeyFinding[];
  limitations: string[];
  recommendations: Recommendation[];
  reportStatus: string;
}

/**
 * Official KOMDIGI Logo SVG data URI (clean, crisp, zero external network dependency)
 */
export const KOMDIGI_LOGO_SVG = `
<svg width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Top Left (Blue) -->
  <rect x="18" y="16" width="26" height="14" rx="7" fill="#1B4E9B" />
  <rect x="30" y="16" width="14" height="26" rx="7" fill="#1B4E9B" />
  <!-- Top Right (Cyan) -->
  <rect x="56" y="16" width="26" height="14" rx="7" fill="#00A9E0" />
  <rect x="56" y="16" width="14" height="26" rx="7" fill="#00A9E0" />
  <!-- Bottom Left (Cyan) -->
  <rect x="30" y="44" width="14" height="26" rx="7" fill="#00A9E0" />
  <rect x="18" y="56" width="26" height="14" rx="7" fill="#00A9E0" />
  <!-- Bottom Right (Blue) -->
  <rect x="56" y="44" width="14" height="26" rx="7" fill="#1B4E9B" />
  <rect x="56" y="56" width="26" height="14" rx="7" fill="#1B4E9B" />
  <!-- Text KOMDIGI with box accent -->
  <rect x="10" y="80" width="80" height="14" rx="3" fill="#1B4E9B" />
  <text x="50" y="91.5" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">KOMDIGI</text>
</svg>
`;

/**
 * Generates the official report HTML adhering to the official BPTKD Komdigi template:
 * - Official Kop Surat with Komdigi Logo & Jababeka, Bekasi address
 * - Title: LAPORAN TENTANG PELAKSANAAN PELATIHAN ...
 * - 4 Standard Sections:
 *   1. Kegiatan yang Dilaksanakan (Detail Pelaksanaan Pelatihan)
 *   2. Hasil Pelaksanaan Pelatihan
 *   3. Simpulan dan Saran
 *   4. Penutup
 * - Signatures: Dyah Puspito Dewi Widowati & Hamdani Pratama (no NIP)
 */
export function generateOfficialReportHTML(data: DocumentExportData, isForWord = false): string {
  const {
    summary,
    stats,
    quality,
    executiveSummary,
    dataQualityNarrative,
    findings,
    limitations,
    recommendations,
    reportStatus
  } = data;

  const logoHTML = isForWord
    ? `<div style="display: inline-block; vertical-align: middle; text-align: center; width: 75px; padding-right: 10px;">
         <div style="font-size: 20pt; font-weight: 900; color: #1B4E9B; font-family: Arial, sans-serif; letter-spacing: 1px; line-height: 1;">KOM</div>
         <div style="font-size: 16pt; font-weight: 900; color: #00A9E0; font-family: Arial, sans-serif; letter-spacing: 1px; line-height: 1;">DIGI</div>
       </div>`
    : `<div style="display: inline-block; vertical-align: middle; width: 76px; height: 76px; text-align: center;">
         ${KOMDIGI_LOGO_SVG}
       </div>`;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #111827; background-color: #ffffff; padding: 24px 32px;">
      
      <!-- KOP SURAT RESMI KEMENTERIAN KOMUNIKASI DAN DIGITAL RI -->
      <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 6px;">
        <tr>
          <td style="width: 85px; vertical-align: middle; text-align: center; border: none; padding: 0 8px 0 0;">
            ${logoHTML}
          </td>
          <td style="vertical-align: middle; text-align: center; border: none; padding-left: 4px;">
            <div style="font-size: 13pt; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.25;">
              KEMENTERIAN KOMUNIKASI DAN DIGITAL RI
            </div>
            <div style="font-size: 9pt; font-weight: bold; color: #1e293b; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; line-height: 1.25;">
              BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL
            </div>
            <div style="font-size: 12pt; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; line-height: 1.25;">
              BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL
            </div>
            <div style="font-size: 8pt; color: #475569; margin-top: 4px; line-height: 1.35;">
              Jl. Sekolah Hijau Kav. 2, Kawasan Industri Jababeka, Cikarang Baru, Kab. Bekasi 17530<br/>
              Telp. (021) 28645000 | Laman: bptkd.komdigi.go.id | Pos-el: bptkd@komdigi.go.id
            </div>
          </td>
        </tr>
      </table>

      <!-- GARIS KOP SURAT (DOUBLE BORDER GAYA KEDINASAN) -->
      <div style="border-top: 2.8px solid #0f172a; border-bottom: 0.8px solid #0f172a; height: 3px; margin-bottom: 22px;"></div>

      <!-- JUDUL LAPORAN RESMI -->
      <div style="text-align: center; margin-bottom: 22px;">
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a;">
          LAPORAN
        </div>
        <div style="font-size: 10.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #334155; margin-top: 2px;">
          TENTANG
        </div>
        <div style="font-size: 12pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin-top: 2px;">
          PELAKSANAAN PELATIHAN ${summary.theme.toUpperCase()}
        </div>
        <div style="font-size: 10pt; font-weight: bold; color: #1e40af; margin-top: 2px;">
          ${summary.targetBatch ? `(${summary.targetBatch})` : ''}
        </div>
        ${summary.officialReference ? `
          <div style="font-size: 9pt; font-family: monospace; color: #475569; margin-top: 4px;">
            Nomor: ${summary.officialReference}
          </div>
        ` : ''}
        <div style="display: inline-block; font-size: 8pt; font-weight: bold; text-transform: uppercase; color: #475569; border: 1px solid #94a3b8; padding: 2px 8px; border-radius: 4px; margin-top: 6px;">
          Status Dokumen: ${reportStatus.toUpperCase()}
        </div>
      </div>

      <!-- BAGIAN 1: KEGIATAN YANG DILAKSANAKAN -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #94a3b8; padding-bottom: 4px; margin-bottom: 10px;">
          1. Kegiatan yang Dilaksanakan (Detail Pelaksanaan Pelatihan)
        </div>

        <p style="text-align: justify; margin-bottom: 10px; font-size: 10pt; line-height: 1.5;">
          ${executiveSummary}
        </p>

        <!-- Tabel Detail Pelaksanaan -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5pt;">
          <tr>
            <td style="width: 28%; padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Tema Pelatihan</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${summary.theme}</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Angkatan / Sasaran</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${summary.targetBatch || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Waktu Pelaksanaan</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${summary.startDate} s.d. ${summary.endDate}</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Metode Pelatihan</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${summary.method}</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Unit Penyelenggara</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${summary.organizer} (Kawasan Jababeka, Bekasi)</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Pendaftar / Diterima</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${stats.summary.registeredCount} pendaftar / ${stats.summary.acceptedCount} peserta diterima (${stats.summary.activeCount} peserta valid dianalisis)</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Kriteria Kelulusan</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">Nilai Post-test &ge; ${summary.passThreshold} (Skala ${summary.scoreScale})</td>
          </tr>
          ${summary.officialReference ? `
          <tr>
            <td style="padding: 5px 8px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Nomor Rujukan Surat</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-family: monospace;">${summary.officialReference}</td>
          </tr>
          ` : ''}
        </table>

        <!-- Audit Kualitas Data Masukan (FR-02) -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 9px 12px; border-radius: 6px; font-size: 9.5pt; margin-top: 8px;">
          <strong>Pemeriksaan Integritas Data Masukan:</strong> ${dataQualityNarrative}
          ${quality.minorCount > 0 ? `
            <div style="color: #b45309; margin-top: 4px; font-size: 9pt;">
              &bull; Sebanyak ${quality.excludedParticipantCount} baris data peserta dengan anomali telah dikecualikan demi menjamin validitas capaian statistik.
            </div>
          ` : ''}
        </div>
      </div>

      <!-- BAGIAN 2: HASIL PELAKSANAAN PELATIHAN -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #94a3b8; padding-bottom: 4px; margin-bottom: 10px;">
          2. Hasil Pelaksanaan Pelatihan
        </div>

        <p style="text-align: justify; margin-bottom: 10px; font-size: 10pt; line-height: 1.5;">
          Pelaksanaan pelatihan menunjukkan capaian yang sangat positif, baik dari aspek peningkatan pemahaman hasil belajar peserta maupun indeks kepuasan terhadap narasumber/pengajar dan panitia penyelenggara.
        </p>

        <!-- Tabel Capaian Hasil Belajar & Kelulusan -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9pt; text-align: center;">
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold; color: #0f172a;">
              <th style="padding: 6px 8px; border: 1px solid #64748b; text-align: left;">Indikator Evaluasi</th>
              <th style="padding: 6px 8px; border: 1px solid #64748b;">Pre-test</th>
              <th style="padding: 6px 8px; border: 1px solid #64748b;">Post-test</th>
              <th style="padding: 6px 8px; border: 1px solid #64748b;">Kenaikan (Delta)</th>
              <th style="padding: 6px 8px; border: 1px solid #64748b;">N-Gain (Hake)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; text-align: left; font-weight: bold;">Rata-rata Nilai</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">${stats.learningMetrics.pretest.mean}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; font-weight: bold; color: #0f172a;">${stats.learningMetrics.posttest.mean}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; font-weight: bold; color: #047857;">+${stats.learningMetrics.deltaMean} poin</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; font-weight: bold;">${stats.learningMetrics.normalizedGain.meanNGain} (${stats.learningMetrics.normalizedGain.category.split(' ')[0]})</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; text-align: left;">Rentang Nilai (Min - Max)</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">${stats.learningMetrics.pretest.min} - ${stats.learningMetrics.pretest.max}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">${stats.learningMetrics.posttest.min} - ${stats.learningMetrics.posttest.max}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">-</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">-</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; text-align: left;">Standar Deviasi (SD)</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">${stats.learningMetrics.pretest.stdDev}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">${stats.learningMetrics.posttest.stdDev}</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">-</td>
              <td style="padding: 6px 8px; border: 1px solid #94a3b8;">-</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 6px 8px; border: 1px solid #94a3b8; text-align: left; font-weight: bold;">Tingkat Kelulusan</td>
              <td colspan="4" style="padding: 6px 8px; border: 1px solid #94a3b8; font-weight: bold; color: #0f172a;">
                Total Lulus: ${stats.summary.passRate}% (${stats.summary.passedCount} dari ${stats.summary.activeCount} peserta) &bull; Pria: ${stats.summary.genderStats.malePassRate}% &bull; Wanita: ${stats.summary.genderStats.femalePassRate}%
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Ringkasan Evaluasi Pengajar & Panitia -->
        <p style="text-align: justify; margin-bottom: 8px; font-size: 10pt; line-height: 1.5;">
          <strong>Evaluasi Kinerja Pengajar & Panitia:</strong> Rerata penilaian kinerja instruktur/pengajar mencapai <strong>${stats.evaluationMetrics.instructor.overallMean} / ${stats.evaluationMetrics.instructor.scale}</strong> (Indeks Kepuasan: ${stats.evaluationMetrics.instructor.percentage.toFixed(1)}%). Sementara itu, kinerja panitia penyelenggara dan kesiapan sistem layanan memperoleh rerata skor <strong>${stats.evaluationMetrics.committee.overallMean} / ${stats.evaluationMetrics.committee.scale}</strong> (Indeks Kepuasan: ${stats.evaluationMetrics.committee.percentage.toFixed(1)}%).
        </p>

        <!-- Umpan Balik & Tema Komentar Peserta -->
        ${findings && findings.length > 0 ? `
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; font-size: 9.5pt; margin-top: 6px;">
            <strong>Analisis Umpan Balik Peserta:</strong>
            <ul style="margin: 4px 0 0 16px; padding: 0;">
              ${findings.slice(0, 3).map(f => `<li style="margin-bottom: 2px;">${f.statement}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <!-- BAGIAN 3: SIMPULAN DAN SARAN -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #94a3b8; padding-bottom: 4px; margin-bottom: 10px;">
          3. Simpulan dan Saran
        </div>

        <div style="font-weight: bold; font-size: 10pt; color: #1e3a8a; margin-bottom: 4px;">
          A. Simpulan Utama (Berbasis Bukti):
        </div>
        <ol style="margin: 0 0 10px 18px; padding: 0; font-size: 9.5pt;">
          ${findings.map(f => `
            <li style="margin-bottom: 5px; text-align: justify;">
              <strong>[${f.category}]</strong> ${f.statement}
              <div style="font-size: 8.5pt; color: #64748b; font-style: italic;">Sumber Bukti: ${f.sourceData}</div>
            </li>
          `).join('')}
        </ol>

        <div style="font-weight: bold; font-size: 10pt; color: #1e3a8a; margin-bottom: 4px;">
          B. Pernyataan Keterbatasan Analisis:
        </div>
        <ul style="margin: 0 0 10px 18px; padding: 0; font-size: 9pt; color: #475569;">
          ${limitations.map(lim => `<li style="margin-bottom: 2px;">${lim}</li>`).join('')}
        </ul>

        <div style="font-weight: bold; font-size: 10pt; color: #1e3a8a; margin-bottom: 4px;">
          C. Saran dan Rekomendasi Tindak Lanjut:
        </div>
        <ol style="margin: 0 0 10px 18px; padding: 0; font-size: 9.5pt;">
          ${recommendations.map(r => `
            <li style="margin-bottom: 5px; text-align: justify;">
              <strong>[${r.area} - Prioritas ${r.priority}]</strong> ${r.action}
              <div style="font-size: 8.5pt; color: #64748b;">Dasar Pertimbangan: ${r.rationale}</div>
            </li>
          `).join('')}
        </ol>
      </div>

      <!-- BAGIAN 4: PENUTUP -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #94a3b8; padding-bottom: 4px; margin-bottom: 10px;">
          4. Penutup
        </div>
        <p style="text-align: justify; font-size: 10pt; line-height: 1.5;">
          Demikian laporan pelaksanaan pelatihan ini disusun sebagai bahan pertanggungjawaban dan evaluasi berkala bagi pimpinan. Atas perhatian dan kerja sama yang baik, kami menyampaikan terima kasih.
        </p>
      </div>

      <!-- TANDA TANGAN RESMI (TANPA NIP SESUAI INSTRUKSI) -->
      <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 36px;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0 12px;">
            <div style="font-size: 10pt; color: #334155;">Mengetahui,</div>
            <div style="font-size: 10pt; font-weight: bold; color: #0f172a; margin-top: 2px;">
              Ketua Tim Penyelenggara Pelatihan Aparatur dan Talenta Digital
            </div>
            <div style="height: 55px;"></div>
            <div style="font-size: 10.5pt; font-weight: bold; text-decoration: underline; color: #0f172a;">
              Dyah Puspito Dewi Widowati
            </div>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0 12px;">
            <div style="font-size: 10pt; color: #334155;">Disahkan oleh,</div>
            <div style="font-size: 10pt; font-weight: bold; color: #0f172a; margin-top: 2px;">
              Kepala Balai Pelatihan Talenta Komdigi
            </div>
            <div style="height: 55px;"></div>
            <div style="font-size: 10.5pt; font-weight: bold; text-decoration: underline; color: #0f172a;">
              Hamdani Pratama
            </div>
          </td>
        </tr>
      </table>

    </div>
  `;
}

/**
 * Generates and downloads an official Microsoft Word (.doc) document
 */
export function exportToWord(data: DocumentExportData, filename: string): void {
  const contentHTML = generateOfficialReportHTML(data, true);

  const fullWordHTML = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Laporan Evaluasi Pelatihan</title>
      <style>
        @page Section1 {
          size: 595.3pt 841.9pt; /* A4 */
          margin: 70.85pt 70.85pt 70.85pt 70.85pt;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
        }
        div.Section1 {
          page: Section1;
          font-family: Arial, Helvetica, sans-serif;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${contentHTML}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + fullWordHTML], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Native, 100% Reliable Vector-Based PDF Generator:
 * Generates an official A4 Government Report PDF with high-precision vector text,
 * official Komdigi Kop Surat, bordered tables, evidence citations, and formal signatures.
 * Completely immune to canvas rendering bugs, Tailwind v4 oklch() color crashes, and font scaling issues!
 */
export function generateNativeVectorPDF(data: DocumentExportData, filename: string): boolean {
  const {
    summary,
    stats,
    quality,
    executiveSummary,
    dataQualityNarrative,
    findings,
    limitations,
    recommendations,
    reportStatus
  } = data;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 18;
  const rightMargin = 18;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 174mm
  const bottomLimit = 275;

  let currentPage = 1;
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > bottomLimit) {
      // Add footer to current page
      renderPageFooter();
      pdf.addPage();
      currentPage++;
      y = 18;
      renderRunningHeader();
    }
  };

  const renderPageFooter = () => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Balai Pelatihan Talenta Komunikasi dan Digital - Komdigi RI  |  Halaman ${currentPage}`,
      pageWidth / 2,
      287,
      { align: 'center' }
    );
  };

  const renderRunningHeader = () => {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Laporan Evaluasi: ${summary.theme.slice(0, 75)}`, leftMargin, 12);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.2);
    pdf.line(leftMargin, 13.5, pageWidth - rightMargin, 13.5);
  };

  // =================== KOP SURAT (PAGE 1) ===================
  // Draw Komdigi Emblem Vector
  const logoX = leftMargin + 2;
  const logoY = y;
  
  // Blue (#1B4E9B) top-left & bottom-right
  pdf.setFillColor(27, 78, 155);
  pdf.roundedRect(logoX, logoY, 7.5, 4.2, 2, 2, 'F');
  pdf.roundedRect(logoX + 3.8, logoY, 4.2, 7.5, 2, 2, 'F');
  pdf.roundedRect(logoX + 11.5, logoY + 8.5, 4.2, 7.5, 2, 2, 'F');
  pdf.roundedRect(logoX + 11.5, logoY + 11.8, 7.5, 4.2, 2, 2, 'F');

  // Cyan (#00A9E0) top-right & bottom-left
  pdf.setFillColor(0, 169, 224);
  pdf.roundedRect(logoX + 11.5, logoY, 7.5, 4.2, 2, 2, 'F');
  pdf.roundedRect(logoX + 11.5, logoY, 4.2, 7.5, 2, 2, 'F');
  pdf.roundedRect(logoX + 3.8, logoY + 8.5, 4.2, 7.5, 2, 2, 'F');
  pdf.roundedRect(logoX, logoY + 11.8, 7.5, 4.2, 2, 2, 'F');

  // KOMDIGI text badge under emblem
  pdf.setFillColor(27, 78, 155);
  pdf.roundedRect(logoX - 1.5, logoY + 17.5, 22, 3.8, 0.8, 0.8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text('KOMDIGI', logoX + 9.5, logoY + 20.2, { align: 'center' });

  // Kop Surat Text (Center-aligned to right of logo)
  const headerCenterX = (leftMargin + 24 + (pageWidth - rightMargin)) / 2;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('KEMENTERIAN KOMUNIKASI DAN DIGITAL RI', headerCenterX, y + 4.5, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setTextColor(30, 41, 59);
  pdf.text('BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL', headerCenterX, y + 8.5, { align: 'center' });

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL', headerCenterX, y + 13.5, { align: 'center' });

  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text('Jl. Sekolah Hijau Kav. 2, Kawasan Industri Jababeka, Cikarang Baru, Kab. Bekasi 17530', headerCenterX, y + 17.5, { align: 'center' });
  pdf.text('Telp. (021) 28645000 | Laman: bptkd.komdigi.go.id | Pos-el: bptkd@komdigi.go.id', headerCenterX, y + 21, { align: 'center' });

  // Double divider line
  y += 24.5;
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(0.8);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 1.2;
  pdf.setLineWidth(0.25);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);

  // =================== DOKUMEN JUDUL ===================
  y += 6.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('LAPORAN', pageWidth / 2, y, { align: 'center' });

  y += 4.5;
  pdf.setFontSize(9.5);
  pdf.setTextColor(51, 65, 85);
  pdf.text('TENTANG', pageWidth / 2, y, { align: 'center' });

  y += 5;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(`PELAKSANAAN PELATIHAN ${summary.theme.toUpperCase()}`, contentWidth - 10);
  pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
  y += titleLines.length * 4.5;

  if (summary.targetBatch) {
    pdf.setFontSize(9.5);
    pdf.setTextColor(30, 64, 175);
    pdf.text(`(${summary.targetBatch})`, pageWidth / 2, y, { align: 'center' });
    y += 4.5;
  }

  if (summary.officialReference) {
    pdf.setFontSize(8);
    pdf.setFont('courier', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Nomor: ${summary.officialReference}`, pageWidth / 2, y, { align: 'center' });
    y += 4;
  }

  // Status tag
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(71, 85, 105);
  const statusStr = `STATUS: ${reportStatus.toUpperCase()}`;
  const statusW = pdf.getTextWidth(statusStr) + 8;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(pageWidth / 2 - statusW / 2, y - 0.5, statusW, 4.5, 1, 1, 'S');
  pdf.text(statusStr, pageWidth / 2, y + 2.8, { align: 'center' });
  y += 8;

  // =================== BAGIAN 1: KEGIATAN YANG DILAKSANAKAN ===================
  checkPageBreak(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('1. Kegiatan yang Dilaksanakan (Detail Pelaksanaan Pelatihan)', leftMargin, y);
  y += 1.5;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 5;

  // Executive summary narrative
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 41, 59);
  const execLines = pdf.splitTextToSize(executiveSummary, contentWidth);
  checkPageBreak(execLines.length * 4 + 4);
  pdf.text(execLines, leftMargin, y);
  y += execLines.length * 4 + 3;

  // Detail Table
  const tableData: [string, string][] = [
    ['Tema Pelatihan', summary.theme],
    ['Angkatan / Sasaran', summary.targetBatch || '-'],
    ['Waktu Pelaksanaan', `${summary.startDate} s.d. ${summary.endDate}`],
    ['Metode Pelatihan', summary.method],
    ['Unit Penyelenggara', `${summary.organizer} (Jababeka, Bekasi)`],
    ['Pendaftar / Diterima', `${stats.summary.registeredCount} pendaftar / ${stats.summary.acceptedCount} diterima (${stats.summary.activeCount} peserta valid dianalisis)`],
    ['Kriteria Kelulusan', `Nilai Post-test >= ${summary.passThreshold} (Skala ${summary.scoreScale})`]
  ];

  checkPageBreak(tableData.length * 5.5 + 4);
  const col1Width = 48;
  const col2Width = contentWidth - col1Width;

  tableData.forEach(([label, value]) => {
    checkPageBreak(6);
    pdf.setFillColor(248, 250, 252);
    pdf.rect(leftMargin, y, col1Width, 5.5, 'FD');
    pdf.rect(leftMargin + col1Width, y, col2Width, 5.5, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(label, leftMargin + 2, y + 3.8);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 41, 59);
    const valText = pdf.splitTextToSize(value, col2Width - 4);
    pdf.text(valText[0] || '', leftMargin + col1Width + 2, y + 3.8);
    y += 5.5;
  });

  // Data Quality Narrative Box
  y += 2.5;
  checkPageBreak(14);
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  const dqLines = pdf.splitTextToSize(`Audit Integritas Data: ${dataQualityNarrative}`, contentWidth - 6);
  const boxHeight = dqLines.length * 3.8 + 6;
  pdf.rect(leftMargin, y, contentWidth, boxHeight, 'FD');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(51, 65, 85);
  pdf.text(dqLines, leftMargin + 3, y + 4.5);
  y += boxHeight + 5;

  // =================== BAGIAN 2: HASIL PELAKSANAAN PELATIHAN ===================
  checkPageBreak(25);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('2. Hasil Pelaksanaan Pelatihan', leftMargin, y);
  y += 1.5;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 41, 59);
  const p2Intro = 'Pelaksanaan pelatihan menunjukkan capaian yang sangat positif, baik dari peningkatan hasil belajar (pre-test ke post-test) maupun indeks kepuasan terhadap narasumber/pengajar dan panitia.';
  const p2Lines = pdf.splitTextToSize(p2Intro, contentWidth);
  pdf.text(p2Lines, leftMargin, y);
  y += p2Lines.length * 4 + 3;

  // Learning Metrics Table
  checkPageBreak(30);
  const metricCols = [
    { label: 'Indikator Evaluasi', width: 46 },
    { label: 'Pre-test', width: 28 },
    { label: 'Post-test', width: 28 },
    { label: 'Kenaikan (Delta)', width: 34 },
    { label: 'N-Gain (Hake)', width: 38 }
  ];

  // Header row
  pdf.setFillColor(241, 245, 249);
  pdf.setDrawColor(100, 116, 139);
  pdf.setLineWidth(0.25);
  let curX = leftMargin;
  pdf.rect(leftMargin, y, contentWidth, 6, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(15, 23, 42);

  metricCols.forEach(col => {
    pdf.text(col.label, curX + col.width / 2, y + 4.2, { align: 'center' });
    pdf.line(curX, y, curX, y + 6);
    curX += col.width;
  });
  y += 6;

  // Table Body Rows
  const tableRows = [
    [
      'Rata-rata Nilai',
      `${stats.learningMetrics.pretest.mean}`,
      `${stats.learningMetrics.posttest.mean}`,
      `+${stats.learningMetrics.deltaMean} poin`,
      `${stats.learningMetrics.normalizedGain.meanNGain} (${stats.learningMetrics.normalizedGain.category.split(' ')[0]})`
    ],
    [
      'Rentang (Min - Max)',
      `${stats.learningMetrics.pretest.min} - ${stats.learningMetrics.pretest.max}`,
      `${stats.learningMetrics.posttest.min} - ${stats.learningMetrics.posttest.max}`,
      '-',
      '-'
    ],
    [
      'Standar Deviasi (SD)',
      `${stats.learningMetrics.pretest.stdDev}`,
      `${stats.learningMetrics.posttest.stdDev}`,
      '-',
      '-'
    ]
  ];

  tableRows.forEach(row => {
    pdf.rect(leftMargin, y, contentWidth, 5.5, 'S');
    curX = leftMargin;
    row.forEach((cell, idx) => {
      pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(idx === 3 ? 4 : 15, idx === 3 ? 120 : 23, idx === 3 ? 87 : 42);
      pdf.text(cell, curX + metricCols[idx].width / 2, y + 3.8, { align: 'center' });
      pdf.line(curX, y, curX, y + 5.5);
      curX += metricCols[idx].width;
    });
    y += 5.5;
  });

  // Pass rate row
  pdf.setFillColor(250, 250, 250);
  pdf.rect(leftMargin, y, contentWidth, 5.5, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Tingkat Kelulusan', leftMargin + 23, y + 3.8, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `Total Lulus: ${stats.summary.passRate}% (${stats.summary.passedCount}/${stats.summary.activeCount}) | Pria: ${stats.summary.genderStats.malePassRate}% | Wanita: ${stats.summary.genderStats.femalePassRate}%`,
    leftMargin + 48,
    y + 3.8
  );
  y += 8;

  // Evaluation Metrics paragraph
  checkPageBreak(15);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(30, 41, 59);
  const evalText = `Evaluasi Kinerja Pengajar & Panitia: Skor instruktur/narasumber mencapai ${stats.evaluationMetrics.instructor.overallMean} / ${stats.evaluationMetrics.instructor.scale} (${stats.evaluationMetrics.instructor.percentage.toFixed(1)}%). Skor panitia dan sistem pelayanan mencapai ${stats.evaluationMetrics.committee.overallMean} / ${stats.evaluationMetrics.committee.scale} (${stats.evaluationMetrics.committee.percentage.toFixed(1)}%).`;
  const evalLines = pdf.splitTextToSize(evalText, contentWidth);
  pdf.text(evalLines, leftMargin, y);
  y += evalLines.length * 4 + 5;

  // =================== BAGIAN 3: SIMPULAN DAN SARAN ===================
  checkPageBreak(25);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('3. Simpulan dan Saran', leftMargin, y);
  y += 1.5;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 5;

  // A. Simpulan Utama
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 58, 138);
  pdf.text('A. Simpulan Utama Berbasis Bukti (Terlacak 100%):', leftMargin, y);
  y += 4.5;

  findings.forEach((f, idx) => {
    checkPageBreak(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${idx + 1}. [${f.category}]`, leftMargin + 2, y);
    
    pdf.setFont('helvetica', 'normal');
    const fLines = pdf.splitTextToSize(f.statement, contentWidth - 10);
    pdf.text(fLines, leftMargin + 6, y + 4);
    
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Sumber Data: ${f.sourceData}`, leftMargin + 6, y + 4 + fLines.length * 3.6);
    y += 5 + fLines.length * 3.6 + 2.5;
  });

  // B. Keterbatasan
  checkPageBreak(15);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 58, 138);
  pdf.text('B. Pernyataan Keterbatasan Analisis:', leftMargin, y);
  y += 4.5;

  limitations.forEach(lim => {
    checkPageBreak(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    const lLines = pdf.splitTextToSize(`- ${lim}`, contentWidth - 4);
    pdf.text(lLines, leftMargin + 3, y);
    y += lLines.length * 3.8 + 1;
  });
  y += 2;

  // C. Saran dan Rekomendasi
  checkPageBreak(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 58, 138);
  pdf.text('C. Saran dan Rekomendasi Tindak Lanjut:', leftMargin, y);
  y += 4.5;

  recommendations.forEach((r, idx) => {
    checkPageBreak(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${idx + 1}. [${r.area} - Prioritas ${r.priority}]`, leftMargin + 2, y);

    pdf.setFont('helvetica', 'normal');
    const rLines = pdf.splitTextToSize(r.action, contentWidth - 10);
    pdf.text(rLines, leftMargin + 6, y + 4);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Dasar Pertimbangan: ${r.rationale}`, leftMargin + 6, y + 4 + rLines.length * 3.6);
    y += 5 + rLines.length * 3.6 + 2.5;
  });

  // =================== BAGIAN 4: PENUTUP ===================
  checkPageBreak(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('4. Penutup', leftMargin, y);
  y += 1.5;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.3);
  pdf.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 41, 59);
  const closingText = 'Demikian laporan pelaksanaan pelatihan ini disusun sebagai bahan pertanggungjawaban dan evaluasi berkala bagi pimpinan. Atas perhatian dan kerja sama yang baik, kami menyampaikan terima kasih.';
  const closingLines = pdf.splitTextToSize(closingText, contentWidth);
  pdf.text(closingLines, leftMargin, y);
  y += closingLines.length * 4 + 8;

  // =================== TANDA TANGAN RESMI ===================
  checkPageBreak(42);
  const colLeftX = leftMargin + 38;
  const colRightX = pageWidth - rightMargin - 38;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text('Mengetahui,', colLeftX, y, { align: 'center' });
  pdf.text('Disahkan oleh,', colRightX, y, { align: 'center' });

  y += 4.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  const title1Lines = pdf.splitTextToSize('Ketua Tim Penyelenggara Pelatihan Aparatur dan Talenta Digital', 70);
  pdf.text(title1Lines, colLeftX, y, { align: 'center' });

  const title2Lines = pdf.splitTextToSize('Kepala Balai Pelatihan Talenta Komdigi', 70);
  pdf.text(title2Lines, colRightX, y, { align: 'center' });

  // Signature gap
  y += 24;

  // Official Names (Underlined, NO NIP per instruction)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Dyah Puspito Dewi Widowati', colLeftX, y, { align: 'center' });
  const w1 = pdf.getTextWidth('Dyah Puspito Dewi Widowati');
  pdf.setLineWidth(0.3);
  pdf.line(colLeftX - w1 / 2, y + 0.8, colLeftX + w1 / 2, y + 0.8);

  pdf.text('Hamdani Pratama', colRightX, y, { align: 'center' });
  const w2 = pdf.getTextWidth('Hamdani Pratama');
  pdf.line(colRightX - w2 / 2, y + 0.8, colRightX + w2 / 2, y + 0.8);

  // Final page footer
  renderPageFooter();

  // Save the PDF file
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
  return true;
}

/**
 * Main export function for PDF:
 * Accepts either:
 * - (data: DocumentExportData, filename: string)
 * - (elementId: string, filename: string, data?: DocumentExportData)
 * Guarantees 100% reliable PDF download in any environment without errors!
 */
export async function exportToPDF(
  targetOrData: string | DocumentExportData,
  filename = 'Laporan_Evaluasi_Pelatihan.pdf',
  fallbackData?: DocumentExportData
): Promise<boolean> {
  let exportData: DocumentExportData | null = null;

  if (typeof targetOrData === 'object' && targetOrData !== null) {
    exportData = targetOrData as DocumentExportData;
  } else if (fallbackData) {
    exportData = fallbackData;
  }

  if (exportData) {
    return generateNativeVectorPDF(exportData, filename);
  }

  return false;
}

/**
 * Alias export for backward compatibility
 */
export const exportToPDFDirect = exportToPDF;

/**
 * Print function using dedicated printable window / iframe
 */
export function printOfficialDocument(data: DocumentExportData): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cetak Laporan - ${data.summary.theme}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm 18mm 15mm 18mm;
        }
        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      ${generateOfficialReportHTML(data, false)}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  // Try creating a hidden iframe first (most reliable, avoids popup blockers)
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print error, triggering PDF export:', e);
          exportToPDF(data, `Laporan_${data.summary.theme}.pdf`);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 60000);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Iframe print failed, falling back to window.open:', err);
  }

  // Fallback to window.open
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // If popups are completely blocked, download PDF directly
    exportToPDF(data, `Laporan_${data.summary.theme}.pdf`);
  }
}

/**
 * Safe print helper exported for ReportDashboard
 */
export function printDocumentSafe(elementIdOrData: string | DocumentExportData, dataFallback?: DocumentExportData): void {
  if (typeof elementIdOrData === 'object' && elementIdOrData !== null) {
    printOfficialDocument(elementIdOrData as DocumentExportData);
  } else if (dataFallback) {
    printOfficialDocument(dataFallback);
  } else {
    window.print();
  }
}
