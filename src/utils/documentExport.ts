import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
 * Generates and downloads an official Microsoft Word (.doc) document
 * with authentic government letterhead, tables, formatting, and signatures.
 */
export function exportToWord(data: DocumentExportData, filename: string): void {
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

  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Laporan Evaluasi - ${summary.theme}</title>
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 70.85pt 85.05pt 70.85pt 85.05pt; /* Standard margins */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #111827;
    }
    .kop-surat {
      text-align: center;
      border-bottom: 3px double #111827;
      padding-bottom: 8pt;
      margin-bottom: 16pt;
    }
    .kop-lembaga {
      font-size: 9.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1pt;
      color: #374151;
    }
    .kop-balai {
      font-size: 13pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      color: #030712;
      margin-top: 2pt;
    }
    .kop-alamat {
      font-size: 8.5pt;
      color: #4b5563;
      margin-top: 2pt;
    }
    .kop-ref {
      font-size: 8pt;
      font-family: monospace;
      color: #6b7280;
      margin-top: 2pt;
    }
    .judul-laporan {
      text-align: center;
      margin-top: 14pt;
      margin-bottom: 18pt;
    }
    .judul-utama {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin-bottom: 3pt;
    }
    .sub-judul {
      font-size: 11pt;
      font-weight: bold;
      color: #1f2937;
    }
    .status-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: bold;
      padding: 2pt 8pt;
      border: 1px solid #9ca3af;
      text-transform: uppercase;
      margin-top: 4pt;
    }
    h3 {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #9ca3af;
      padding-bottom: 3pt;
      margin-top: 16pt;
      margin-bottom: 6pt;
      color: #030712;
    }
    p, li {
      font-size: 10.5pt;
      line-height: 1.45;
      text-align: justify;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6pt;
      margin-bottom: 8pt;
      font-size: 10pt;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #4b5563;
      padding: 5pt 7pt;
      text-align: center;
    }
    table.data-table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    table.info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6pt;
      font-size: 10.5pt;
    }
    table.info-table td {
      padding: 3pt 0;
      vertical-align: top;
    }
    .callout-box {
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      padding: 8pt 10pt;
      margin-top: 6pt;
      margin-bottom: 8pt;
      font-size: 10pt;
    }
    .signature-table {
      width: 100%;
      margin-top: 36pt;
      border-collapse: collapse;
    }
    .signature-table td {
      width: 50%;
      text-align: center;
      vertical-align: top;
      font-size: 10.5pt;
    }
    .signature-space {
      height: 55pt;
    }
    .signer-name {
      font-weight: bold;
      text-decoration: underline;
      font-size: 11pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    
    <!-- KOP SURAT -->
    <div class="kop-surat">
      <div class="kop-lembaga">Kementerian Komunikasi dan Digital Republik Indonesia</div>
      <div class="kop-balai">Balai Pelatihan Talenta Komunikasi dan Digital</div>
      <div class="kop-alamat">Layanan Informasi & Evaluasi Pengembangan Talenta Digital dan Kompetensi ASN</div>
      <div class="kop-ref">Ref: ${summary.officialReference || 'B-1991/BPTKD.3/DL.02.01/09/2026'}</div>
    </div>

    <!-- JUDUL LAPORAN -->
    <div class="judul-laporan">
      <div class="judul-utama">Laporan Evaluasi Pelaksanaan Pelatihan</div>
      <div class="sub-judul">Tema: "${summary.theme}" (${summary.targetBatch})</div>
      <div class="status-badge">Status Dokumen: ${reportStatus.toUpperCase()}</div>
    </div>

    <!-- 1. RINGKASAN PELAKSANAAN -->
    <h3>1. Ringkasan Pelaksanaan Kegiatan</h3>
    <table class="info-table">
      <tr>
        <td style="width: 25%;"><strong>Metode Pelatihan</strong></td>
        <td style="width: 2%;">:</td>
        <td style="width: 73%;">${summary.method}</td>
      </tr>
      <tr>
        <td><strong>Tanggal Pelaksanaan</strong></td>
        <td>:</td>
        <td>${summary.startDate} s.d. ${summary.endDate}</td>
      </tr>
      <tr>
        <td><strong>Penyelenggara</strong></td>
        <td>:</td>
        <td>${summary.organizer}</td>
      </tr>
      <tr>
        <td><strong>Jumlah Pendaftar</strong></td>
        <td>:</td>
        <td>${stats.summary.registeredCount} orang</td>
      </tr>
      <tr>
        <td><strong>Jumlah Diterima</strong></td>
        <td>:</td>
        <td>${stats.summary.acceptedCount} orang</td>
      </tr>
      <tr>
        <td><strong>Peserta Valid Dianalisis</strong></td>
        <td>:</td>
        <td>${stats.summary.activeCount} orang</td>
      </tr>
      <tr>
        <td><strong>Kriteria Kelulusan</strong></td>
        <td>:</td>
        <td>Nilai Post-test &ge; ${summary.passThreshold} (Skala ${summary.scoreScale})</td>
      </tr>
    </table>

    <div class="callout-box">
      <strong>Ringkasan Eksekutif:</strong><br>
      ${executiveSummary}
    </div>

    <!-- 2. AUDIT KUALITAS DATA -->
    <h3>2. Hasil Audit Kualitas Data Masukan (FR-02)</h3>
    <p>${dataQualityNarrative}</p>
    ${quality.minorCount > 0 ? `
    <div class="callout-box" style="background-color: #fffbeb; border-color: #fde68a; color: #92400e;">
      <strong>Catatan Pengecualian:</strong> Ditemukan ${quality.minorCount} anomali ringan pada berkas masukan. Sebanyak ${quality.excludedParticipantCount} baris data peserta telah dikecualikan dari perhitungan agar tidak menimbulkan bias pada capaian hasil belajar.
    </div>
    ` : ''}

    <!-- 3. CAPAIAN HASIL BELAJAR -->
    <h3>3. Capaian Hasil Belajar & Tingkat Kelulusan</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th style="text-align: left;">Indikator Capaian</th>
          <th>Pre-test</th>
          <th>Post-test</th>
          <th>Peningkatan (Delta)</th>
          <th>N-Gain (Hake)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: left; font-weight: bold;">Nilai Rata-rata Peserta</td>
          <td>${stats.learningMetrics.pretest.mean}</td>
          <td><strong>${stats.learningMetrics.posttest.mean}</strong></td>
          <td style="color: #047857; font-weight: bold;">+${stats.learningMetrics.deltaMean}</td>
          <td><strong>${stats.learningMetrics.normalizedGain.meanNGain}</strong> (${stats.learningMetrics.normalizedGain.category.split(' ')[0]})</td>
        </tr>
        <tr>
          <td style="text-align: left;">Nilai Terendah - Tertinggi</td>
          <td>${stats.learningMetrics.pretest.min} - ${stats.learningMetrics.pretest.max}</td>
          <td>${stats.learningMetrics.posttest.min} - ${stats.learningMetrics.posttest.max}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td style="text-align: left;">Standar Deviasi (SD)</td>
          <td>${stats.learningMetrics.pretest.stdDev}</td>
          <td>${stats.learningMetrics.posttest.stdDev}</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Tingkat Kelulusan</td>
          <td colspan="4">
            Total Lulus: <strong>${stats.summary.passRate}%</strong> (${stats.summary.passedCount} dari ${stats.summary.activeCount} orang) &bull; Pria: ${stats.summary.genderStats.malePassRate}% &bull; Wanita: ${stats.summary.genderStats.femalePassRate}%
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 4. EVALUASI PENGAJAR & PANITIA -->
    <h3>4. Evaluasi Pengajar dan Panitia Penyelenggara</h3>
    <p>
      Penilaian kinerja pengajar memperoleh skor rerata <strong>${stats.evaluationMetrics.instructor.overallMean} dari skala ${stats.evaluationMetrics.instructor.scale}</strong> (Indeks Kepuasan: ${stats.evaluationMetrics.instructor.percentage.toFixed(1)}%).
      Penilaian kinerja panitia penyelenggara memperoleh skor rerata <strong>${stats.evaluationMetrics.committee.overallMean} dari skala ${stats.evaluationMetrics.committee.scale}</strong> (Indeks Kepuasan: ${stats.evaluationMetrics.committee.percentage.toFixed(1)}%).
    </p>

    <!-- 5. TEMUAN UTAMA BERBASIS BUKTI -->
    <h3>5. Temuan Utama Berbasis Bukti (Keterlacakan 100%)</h3>
    <ol>
      ${findings.map(f => `
      <li style="margin-bottom: 6pt;">
        <strong>[${f.category}]</strong> ${f.statement}<br>
        <span style="font-size: 9pt; color: #4b5563; font-style: italic;">Sumber Data Rujukan: ${f.sourceData}</span>
      </li>
      `).join('')}
    </ol>

    <!-- 6. KETERBATASAN ANALISIS -->
    <h3>6. Pernyataan Keterbatasan Analisis</h3>
    <ul>
      ${limitations.map(l => `<li style="margin-bottom: 3pt;">${l}</li>`).join('')}
    </ul>

    <!-- 7. REKOMENDASI PERBAIKAN -->
    <h3>7. Rekomendasi Perbaikan untuk Penyelenggaraan Berikutnya</h3>
    <ol>
      ${recommendations.map(r => `
      <li style="margin-bottom: 6pt;">
        <strong>[${r.area} - Prioritas ${r.priority}]</strong> ${r.action}<br>
        <span style="font-size: 9pt; color: #4b5563;">Dasar Pertimbangan: ${r.rationale}</span>
      </li>
      `).join('')}
    </ol>

    <!-- TANDA TANGAN RESMI -->
    <table class="signature-table">
      <tr>
        <td>
          Mengetahui,<br>
          <strong>Ketua Tim Penyelenggara Pelatihan Aparatur dan Talenta Digital</strong>
          <div class="signature-space"></div>
          <div class="signer-name">Dyah Puspito Dewi Widowati</div>
        </td>
        <td>
          Disahkan oleh,<br>
          <strong>Kepala Balai Pelatihan Talenta Komdigi</strong>
          <div class="signature-space"></div>
          <div class="signer-name">Hamdani Pratama</div>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>
`;

  const blob = new Blob(['\ufeff' + htmlContent], {
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
 * Exports any DOM element to a high-fidelity A4 PDF using jsPDF and html2canvas.
 */
export async function exportToPDF(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id '${elementId}' not found for PDF export.`);
    return false;
  }

  try {
    // Render element to canvas with high scale for vector crispness
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if document is longer than 1 A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Robust print function: creates a clean isolated hidden iframe with print styles,
 * avoiding parent iframe sandbox restrictions in AI Studio.
 */
export function printDocumentSafe(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cetak Laporan Evaluasi Pelatihan</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10.5pt;
            line-height: 1.45;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #475569;
            padding: 5px 8px;
          }
          th {
            background-color: #f1f5f9;
          }
          h1, h2, h3, h4 {
            page-break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print failed, falling back to window.print', e);
        window.print();
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 400);
  } catch (err) {
    console.warn('Printing iframe error, falling back to direct window.print', err);
    window.print();
  }
}
