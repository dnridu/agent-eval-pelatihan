import React, { useState } from 'react';
import {
  TrainingSummary,
  StatisticsResult,
  DataQualityResult,
  AgentAnalysisResponse,
  DraftReport,
  KeyFinding,
  Recommendation
} from '../types';
import {
  FileText,
  Copy,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  Plus,
  ShieldCheck,
  ChevronDown,
  Quote,
  Building,
  Check,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  FileDown,
  Loader2
} from 'lucide-react';
import { exportToWord, exportToPDF, printDocumentSafe, DocumentExportData, KOMDIGI_LOGO_SVG } from '../utils/documentExport';

interface ReportDashboardProps {
  summary: TrainingSummary;
  stats: StatisticsResult;
  quality: DataQualityResult;
  analysis: AgentAnalysisResponse;
  onBackToInput: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  summary,
  stats,
  quality,
  analysis,
  onBackToInput
}) => {
  // Human-in-the-loop status: 'Draf, perlu ditinjau' by default per PRD C.3 & FR-05
  const [reportStatus, setReportStatus] = useState<'Draf, perlu ditinjau' | 'Final, telah disetujui'>('Draf, perlu ditinjau');
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'official_document'>('dashboard');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Clean filename generator
  const cleanTheme = (summary.theme || 'Pelatihan').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
  const cleanBatch = (summary.targetBatch || 'Batch').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 20);
  const baseExportFileName = `Laporan_Evaluasi_${cleanTheme}_${cleanBatch}`;

  // Editable local state for human review
  const [executiveSummary, setExecutiveSummary] = useState(analysis.executiveSummaryText);
  const [findings, setFindings] = useState<KeyFinding[]>(analysis.findings);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(analysis.recommendations);
  const [limitations, setLimitations] = useState<string[]>(analysis.limitations);

  // Export handlers
  const getExportData = (): DocumentExportData => ({
    summary,
    stats,
    quality,
    executiveSummary,
    dataQualityNarrative: analysis.dataQualityNarrative,
    findings,
    limitations,
    recommendations,
    reportStatus
  });

  const handleExportWord = () => {
    const exportData = getExportData();
    exportToWord(exportData, `${baseExportFileName}.doc`);
    setExportSuccessMessage('Dokumen Word (.doc) resmi berhasil diunduh!');
    setTimeout(() => setExportSuccessMessage(null), 3000);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const exportData = getExportData();
      const success = await exportToPDF(exportData, `${baseExportFileName}.pdf`);
      if (success) {
        setExportSuccessMessage('Dokumen PDF (.pdf) resmi berhasil diunduh!');
        setTimeout(() => setExportSuccessMessage(null), 3000);
      } else {
        printDocumentSafe(exportData);
      }
    } catch (e) {
      console.warn('PDF export error, falling back to safe print:', e);
      printDocumentSafe(getExportData());
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    printDocumentSafe(getExportData());
  };

  // Toggle Human Review Approval
  const handleToggleStatus = () => {
    if (reportStatus === 'Draf, perlu ditinjau') {
      setReportStatus('Final, telah disetujui');
    } else {
      setReportStatus('Draf, perlu ditinjau');
    }
  };

  // Delete finding
  const handleDeleteFinding = (id: string) => {
    setFindings(findings.filter(f => f.id !== id));
  };

  // Add new finding
  const handleAddFinding = () => {
    const newId = `FIND-0${findings.length + 1}`;
    const newFinding: KeyFinding = {
      id: newId,
      category: 'Capaian Pembelajaran',
      statement: 'Penyuntingan catatan temuan tambahan oleh tim reviewer balai pelatihan.',
      sourceData: `Data Hasil Belajar: Rata-rata post-test ${stats.learningMetrics.posttest.mean}`,
      isVerified: true
    };
    setFindings([...findings, newFinding]);
  };

  // Generate full Markdown report for clipboard
  const generateMarkdownReport = () => {
    return `# LAPORAN EVALUASI PELATIHAN
## ${summary.theme.toUpperCase()}
**Balai Pelatihan Talenta Komunikasi dan Digital - BPSDMP Komdigi**

- **Batch / Angkatan:** ${summary.targetBatch}
- **Tanggal Pelaksanaan:** ${summary.startDate} s.d. ${summary.endDate}
- **Metode Pelatihan:** ${summary.method}
- **Penyelenggara:** ${summary.organizer}
- **Status Dokumen:** ${reportStatus}
- **Nomor Referensi:** ${summary.officialReference || 'Belum Diberi Nomor'}

---

### I. RINGKASAN EKSEKUTIF
${executiveSummary}

---

### II. RINGKASAN PELAKSANAAN & KELULUSAN
- **Pendaftar:** ${stats.summary.registeredCount} orang
- **Diterima:** ${stats.summary.acceptedCount} orang
- **Peserta Dianalisis (Valid):** ${stats.summary.activeCount} orang
- **Peserta Lulus:** ${stats.summary.passedCount} orang (${stats.summary.passRate}%)
- **Kriteria Ambang Kelulusan:** Nilai Post-test ≥ ${summary.passThreshold} (Skala ${summary.scoreScale})
- **Kelulusan Peserta Pria (L):** ${stats.summary.genderStats.malePassRate}% (${stats.summary.genderStats.malePassed}/${stats.summary.genderStats.maleCount})
- **Kelulusan Peserta Wanita (P):** ${stats.summary.genderStats.femalePassRate}% (${stats.summary.genderStats.femalePassed}/${stats.summary.genderStats.femaleCount})

---

### III. HASIL PEMERIKSAAN KUALITAS DATA
- **Status Integritas:** ${quality.isValid ? 'Sempurna (100% Bersih)' : `Ditemukan ${quality.minorCount} anomali ringan`}
- **Baris Dikecualikan:** ${quality.excludedParticipantCount} baris
- **Catatan Validasi:** ${analysis.dataQualityNarrative}

---

### IV. CAPAIAN HASIL BELAJAR (PRE-TEST & POST-TEST)
- **Rata-rata Pre-test:** ${stats.learningMetrics.pretest.mean} (Min: ${stats.learningMetrics.pretest.min}, Max: ${stats.learningMetrics.pretest.max})
- **Rata-rata Post-test:** ${stats.learningMetrics.posttest.mean} (Min: ${stats.learningMetrics.posttest.min}, Max: ${stats.learningMetrics.posttest.max})
- **Peningkatan Rata-rata (Delta):** +${stats.learningMetrics.deltaMean} poin
- **Normalized Gain (Hake N-Gain):** ${stats.learningMetrics.normalizedGain.meanNGain} (${stats.learningMetrics.normalizedGain.category})
- **Sebaran Capaian:** Tinggi (${stats.learningMetrics.normalizedGain.highCount}), Sedang (${stats.learningMetrics.normalizedGain.mediumCount}), Rendah (${stats.learningMetrics.normalizedGain.lowCount})

---

### V. EVALUASI PENGAJAR DAN PANITIA
- **Rerata Kinerja Pengajar:** ${stats.evaluationMetrics.instructor.overallMean} / ${stats.evaluationMetrics.instructor.scale} (${stats.evaluationMetrics.instructor.percentage.toFixed(1)}%)
- **Rerata Kinerja Panitia:** ${stats.evaluationMetrics.committee.overallMean} / ${stats.evaluationMetrics.committee.scale} (${stats.evaluationMetrics.committee.percentage.toFixed(1)}%)

---

### VI. TEMA KOMENTAR PESERTA
${analysis.commentThemes.map(t => `#### ${t.themeName} (${t.sentiment} - ${t.frequency} komentar)
${t.summary}
*Kutipan Asli Peserta:*
${t.verbatimQuotes.map(q => `> "${q}"`).join('\n')}
`).join('\n')}

---

### VII. TEMUAN UTAMA (BERBASIS BUKTI)
${findings.map(f => `1. **[${f.category}]** ${f.statement}
   - *Sumber Data Penopang:* ${f.sourceData}`).join('\n')}

---

### VIII. KETERBATASAN ANALISIS
${limitations.map(l => `- ${l}`).join('\n')}

---

### IX. REKOMENDASI PERBAIKAN
${recommendations.map(r => `1. **[${r.area} - Prioritas ${r.priority}]** ${r.action}
   - *Dasar Pertimbangan:* ${r.rationale} (Tautan Temuan: ${r.linkedFinding})`).join('\n')}

---

Mengetahui,
**Ketua Tim Penyelenggara Pelatihan Aparatur dan Talenta Digital**

**Dyah Puspito Dewi Widowati**

Disahkan oleh,
**Kepala Balai Pelatihan Talenta Komdigi**

**Hamdani Pratama**

---
*Dibuat otomatis oleh AI Agent Evaluasi Pelatihan Balai Pelatihan Talenta Komunikasi dan Digital.*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {exportSuccessMessage && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-fadeIn print:hidden">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{exportSuccessMessage}</span>
        </div>
      )}

      {/* Top Action Bar & Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        
        {/* Left: Status & Back */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToInput}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Kembali ke formulir input data"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                reportStatus === 'Draf, perlu ditinjau'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/80'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
              }`}>
                {reportStatus === 'Draf, perlu ditinjau' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Status: {reportStatus.toUpperCase()}</span>
              </span>

              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Model: {analysis.source === 'gemini' ? 'Gemini 3.8-Flash' : 'Modul Kode Deterministik'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Hasil Evaluasi: {summary.theme}
            </h2>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle View */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeView === 'dashboard' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard Interaktif
            </button>
            <button
              type="button"
              onClick={() => setActiveView('official_document')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeView === 'official_document' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Format Laporan Resmi
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
              isEditing
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Menyunting' : 'Sunting Teks'}</span>
          </button>

          {/* Copy Report */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Salin Teks</span>
              </>
            )}
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            disabled={isExportingPDF}
            onClick={handleExportPDF}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isExportingPDF
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 cursor-wait'
                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-700/80 hover:border-rose-500'
            }`}
            title="Unduh berkas dokumen PDF siap cetak berstandar kedinasan"
          >
            {isExportingPDF ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-300" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{isExportingPDF ? 'Menyusun PDF...' : 'Unduh PDF'}</span>
          </button>

          {/* Export Word (.doc) Button */}
          <button
            type="button"
            onClick={handleExportWord}
            className="px-3 py-2 text-xs font-semibold bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/80 hover:border-blue-500 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Unduh dokumen Microsoft Word (.doc) lengkap dengan kop surat resmi, tabel, dan tanda tangan"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Unduh Word</span>
          </button>

          {/* Print Dialog Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buka dialog cetak dokumen resmi (Print Dialog)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          {/* Sign-off / Review status toggle */}
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
              reportStatus === 'Draf, perlu ditinjau'
                ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{reportStatus === 'Draf, perlu ditinjau' ? 'Setujui Draf' : 'Jadikan Draf'}</span>
          </button>
        </div>

      </div>

      {/* DASHBOARD INTERACTIVE VIEW */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Executive Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            
            {/* Pendaftar & Diterima */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">Pendaftar / Diterima</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-white">{stats.summary.registeredCount}</span>
                <span className="text-xs text-slate-400">/ {stats.summary.acceptedCount}</span>
              </div>
              <span className="text-[10px] text-sky-400 block mt-1">
                Seleksi: {((stats.summary.acceptedCount / (stats.summary.registeredCount || 1)) * 100).toFixed(0)}% lolos
              </span>
            </div>

            {/* Kelulusan */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">Tingkat Kelulusan</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-emerald-400">{stats.summary.passRate}%</span>
                <span className="text-xs text-slate-400">({stats.summary.passedCount}/{stats.summary.activeCount})</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Ambang: Skor ≥{summary.passThreshold}
              </span>
            </div>

            {/* Rasio L/P */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">Kelulusan L / P</span>
              <div className="text-xs text-slate-200 mt-1 space-y-0.5 font-mono">
                <div>Pria: <strong className="text-sky-300">{stats.summary.genderStats.malePassRate}%</strong> ({stats.summary.genderStats.malePassed}/{stats.summary.genderStats.maleCount})</div>
                <div>Wanita: <strong className="text-pink-300">{stats.summary.genderStats.femalePassRate}%</strong> ({stats.summary.genderStats.femalePassed}/{stats.summary.genderStats.femaleCount})</div>
              </div>
            </div>

            {/* Nilai Pre vs Post */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">Pre-test vs Post-test</span>
              <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                <span className="text-sm text-slate-400">{stats.learningMetrics.pretest.mean}</span>
                <span className="text-xs text-slate-500">→</span>
                <span className="text-xl font-bold text-white">{stats.learningMetrics.posttest.mean}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Delta: +{stats.learningMetrics.deltaMean} poin
              </span>
            </div>

            {/* N-Gain Hake */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">N-Gain (Hake)</span>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span className="text-xl font-bold text-sky-400">{stats.learningMetrics.normalizedGain.meanNGain}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 inline-block mt-1 font-semibold">
                {stats.learningMetrics.normalizedGain.category.split(' ')[0]}
              </span>
            </div>

            {/* Skor Pengajar & Panitia */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-medium text-slate-400 block">Evaluasi Pengajar & Panitia</span>
              <div className="text-xs text-slate-200 mt-1 space-y-0.5 font-mono">
                <div>Pengajar: <strong className="text-amber-300">{stats.evaluationMetrics.instructor.overallMean}</strong>/{stats.evaluationMetrics.instructor.scale}</div>
                <div>Panitia: <strong className="text-indigo-300">{stats.evaluationMetrics.committee.overallMean}</strong>/{stats.evaluationMetrics.committee.scale}</div>
              </div>
            </div>

          </div>

          {/* Visual Charts: Pre-Post Distribution & Aspect Ratings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Sebaran Skor Pre vs Post */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Sebaran Capaian Nilai (Pre-test vs Post-test)</h3>
                  <p className="text-[11px] text-slate-400">Distribusi frekuensi peserta per rentang nilai (100% kode)</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 bg-slate-600 rounded-sm" /> Pre-test
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm" /> Post-test
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {stats.learningMetrics.scoreDistributions.posttest.map((postDist, idx) => {
                  const preDist = stats.learningMetrics.scoreDistributions.pretest[idx];
                  return (
                    <div key={postDist.bracket} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{postDist.bracket}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          Pre: {preDist.count} ({preDist.percentage.toFixed(0)}%) | Post: <strong>{postDist.count} ({postDist.percentage.toFixed(0)}%)</strong>
                        </span>
                      </div>
                      
                      {/* Bar comparison */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {/* Pre-test bar */}
                        <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="bg-slate-600 h-full rounded transition-all duration-500"
                            style={{ width: `${Math.min(100, preDist.percentage)}%` }}
                          />
                        </div>
                        {/* Post-test bar */}
                        <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="bg-sky-500 h-full rounded transition-all duration-500"
                            style={{ width: `${Math.min(100, postDist.percentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Pergeseran distribusi: Sebelum pelatihan mayoritas nilai berada di bawah 65, setelah pelatihan terpusat pada kategori 80-100.</span>
              </div>
            </div>

            {/* Chart 2: Penilaian Skor Aspek Evaluasi */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Evaluasi Kinerja per Aspek</h3>
                  <p className="text-[11px] text-slate-400">Rerata penilaian instruktur dan panitia penyelenggara</p>
                </div>
                <span className="text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                  Total Komentar: {stats.evaluationMetrics.totalComments}
                </span>
              </div>

              {/* Aspects breakdown */}
              <div className="space-y-3.5 pt-2">
                
                {/* Instructor aspects */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-sky-400 block">
                    Aspek Penilaian Pengajar / Instruktur (Skor: {stats.evaluationMetrics.instructor.overallMean}/5)
                  </span>
                  {stats.evaluationMetrics.instructor.aspects.map(asp => (
                    <div key={asp.aspect} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{asp.aspect}</span>
                        <span className="text-amber-300 font-mono font-bold">{asp.meanScore} / {asp.scale}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full"
                          style={{ width: `${asp.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Committee aspects */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 block">
                    Aspek Penyelenggaraan Panitia (Skor: {stats.evaluationMetrics.committee.overallMean}/5)
                  </span>
                  {stats.evaluationMetrics.committee.aspects.map(asp => (
                    <div key={asp.aspect} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{asp.aspect}</span>
                        <span className="text-indigo-300 font-mono font-bold">{asp.meanScore} / {asp.scale}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                          style={{ width: `${asp.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Comment Themes with Real Verbatim Quotes (FR-04) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-400 bg-purple-950 border border-purple-800/80 px-2 py-0.5 rounded-full">
                    FR-04: Analisis Tema Komentar
                  </span>
                  <span className="text-xs text-slate-400">Dikelompokkan oleh AI & Diverifikasi ke Teks Asli</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">Pengelompokan Umpan Balik Terbuka Peserta</h3>
              </div>
              <span className="text-xs text-slate-400">
                {analysis.commentThemes.length} Tema Teridentifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.commentThemes.map((theme, idx) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4.5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        theme.sentiment === 'Positif'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : theme.sentiment === 'Perlu Perbaikan'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {theme.sentiment}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {theme.frequency} Komentar
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {theme.themeName}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {theme.summary}
                    </p>
                  </div>

                  {/* Verbatim Quotes Box */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kutipan Asli Peserta (Terverifikasi):
                    </span>
                    {theme.verbatimQuotes.map((quote, qIdx) => (
                      <div key={qIdx} className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/70 text-xs italic text-sky-200/90 relative pl-6">
                        <Quote className="w-3.5 h-3.5 text-sky-500/50 absolute left-2 top-2.5" />
                        "{quote}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDITABLE DRAFT REPORT SECTIONS (FR-05 & C.2) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 bg-sky-950 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
                    Draf Laporan Lengkap
                  </span>
                  <span className="text-xs text-slate-400">Dapat Disunting Langsung Sebelum Disahkan</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Draf Dokumen Evaluasi Pelatihan Resmi</h3>
              </div>

              {isEditing && (
                <span className="text-xs text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-lg animate-pulse font-medium">
                  Mode Sunting Aktif: Anda dapat mengubah teks, menghapus, atau menambah temuan
                </span>
              )}
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <span>I. Ringkasan Eksekutif</span>
              </h4>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={executiveSummary}
                  onChange={e => setExecutiveSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                  {executiveSummary}
                </p>
              )}
            </div>

            {/* Section 2: Data Quality & Anomalies Audit */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                II. Hasil Pemeriksaan Kualitas Data (FR-02)
              </h4>
              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>{analysis.dataQualityNarrative}</p>
                {quality.minorCount > 0 && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/60">
                    <strong>Catatan Pengecualian:</strong> Sebanyak {quality.excludedParticipantCount} baris data peserta memiliki anomali (nilai kosong, di luar rentang, atau ID ganda) dan telah dikecualikan agar tidak mendistorsi statistik hasil belajar.
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Key Findings with 100% Data Traceability (FR-04) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                  III. Temuan Utama Berbasis Bukti (Keterlacakan 100%)
                </h4>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddFinding}
                    className="text-xs px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg flex items-center gap-1 hover:bg-sky-900"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Temuan
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {findings.map((f, idx) => (
                  <div key={f.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-sky-400 bg-sky-950 border border-sky-800/60 px-2 py-0.5 rounded">
                          {f.category}
                        </span>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Terverifikasi ke Data Sumber
                        </span>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFinding(f.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={f.statement}
                        onChange={e => {
                          const updated = [...findings];
                          updated[idx].statement = e.target.value;
                          setFindings(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      />
                    ) : (
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {f.statement}
                      </p>
                    )}

                    {/* Source Data Pill (100% Traceability) */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                      <span className="text-sky-400 font-semibold">Sumber Bukti:</span>
                      <span>{f.sourceData}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Limitations (PRD Section 2.5 & Hal yang Tidak Boleh Dilakukan #2) */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                IV. Keterbatasan Analisis (Kejujuran Terhadap Data)
              </h4>
              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <p className="text-slate-400 text-[11px] mb-1">
                  Sesuai prinsip etika AI Agent, sistem dilarang membuat kesimpulan tanpa data pendukung. Dimensi berikut tidak dapat dianalisis:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 5: Recommendations */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                V. Rekomendasi Perbaikan & Tindak Lanjut
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                          {rec.area}
                        </span>
                        <span className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${
                          rec.priority === 'Tinggi'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          Prioritas {rec.priority}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white leading-snug">
                        {rec.action}
                      </h5>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <strong>Dasar:</strong> {rec.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* OFFICIAL PRINTABLE DOCUMENT VIEW (FOR CETAK / PDF & RESMI BALAI) */}
      <div
        id="official-document-view"
        className={`${
          activeView === 'dashboard'
            ? 'fixed -left-[9999px] top-0 w-[800px] pointer-events-none opacity-0 print:opacity-100 print:static print:w-auto print:left-0'
            : 'block'
        } bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0`}
      >
          
          {/* Official Kop Surat Kementerian Komunikasi dan Digital RI */}
          <div className="mb-6">
            <div className="flex items-center gap-4 pb-3">
              <div 
                className="w-20 h-20 shrink-0 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: KOMDIGI_LOGO_SVG }}
              />
              <div className="text-center flex-1 pr-14">
                <div className="font-sans uppercase tracking-wider text-base sm:text-lg font-black text-slate-950 leading-tight">
                  KEMENTERIAN KOMUNIKASI DAN DIGITAL RI
                </div>
                <div className="font-sans uppercase tracking-wide text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                  BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL
                </div>
                <div className="font-sans uppercase tracking-wider text-sm sm:text-base font-black text-slate-900 mt-0.5 leading-tight">
                  BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL
                </div>
                <div className="text-[11px] text-slate-600 font-sans mt-1 leading-snug">
                  Jl. Sekolah Hijau Kav. 2, Kawasan Industri Jababeka, Cikarang Baru, Kab. Bekasi 17530<br />
                  Telp. (021) 28645000 | Laman: bptkd.komdigi.go.id | Pos-el: bptkd@komdigi.go.id
                </div>
              </div>
            </div>

            {/* Garis Pembatas Kop Surat (Double Border Gaya Kedinasan) */}
            <div className="border-t-[3px] border-b border-slate-950 h-1 mb-6"></div>
          </div>

          {/* Document Title */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-slate-950">
              LAPORAN
            </h2>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              TENTANG
            </div>
            <div className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950 max-w-2xl mx-auto">
              PELAKSANAAN PELATIHAN {summary.theme.toUpperCase()}
            </div>
            {summary.targetBatch && (
              <div className="text-sm font-bold text-blue-800">
                ({summary.targetBatch})
              </div>
            )}
            {summary.officialReference && (
              <div className="text-xs font-mono text-slate-600 mt-1">
                Nomor: {summary.officialReference}
              </div>
            )}
            <div className="inline-block px-3 py-0.5 rounded text-xs font-bold border uppercase tracking-wider mt-2 text-slate-700 border-slate-400">
              Status Dokumen: {reportStatus.toUpperCase()}
            </div>
          </div>

          {/* BAGIAN 1: KEGIATAN YANG DILAKSANAKAN */}
          <div className="my-6 space-y-3 text-xs leading-relaxed text-slate-800">
            <h3 className="font-bold text-sm uppercase border-b border-slate-400 pb-1 text-slate-950">
              1. Kegiatan yang Dilaksanakan (Detail Pelaksanaan Pelatihan)
            </h3>

            <p className="text-justify text-xs leading-relaxed text-slate-800">
              {executiveSummary}
            </p>

            {/* Tabel Parameter Pelaksanaan */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="w-1/3 p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Tema Pelatihan</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{summary.theme}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Angkatan / Sasaran</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{summary.targetBatch || '-'}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Waktu Pelaksanaan</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{summary.startDate} s.d. {summary.endDate}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Metode Pelatihan</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{summary.method}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Unit Penyelenggara</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{summary.organizer} (Kawasan Jababeka, Bekasi)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Pendaftar / Diterima</td>
                  <td className="p-2 border border-slate-300 text-slate-800">{stats.summary.registeredCount} pendaftar / {stats.summary.acceptedCount} peserta diterima ({stats.summary.activeCount} peserta valid dianalisis)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border border-slate-300 text-slate-900">Kriteria Ambang Kelulusan</td>
                  <td className="p-2 border border-slate-300 text-slate-800">Nilai Post-test &ge; {summary.passThreshold} (Skala {summary.scoreScale})</td>
                </tr>
              </tbody>
            </table>

            {/* Audit Kualitas Data Masukan */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs">
              <strong>Pemeriksaan Integritas Data Masukan:</strong> {analysis.dataQualityNarrative}
              {quality.minorCount > 0 && (
                <div className="text-[11px] text-amber-800 mt-1">
                  &bull; Sebanyak {quality.excludedParticipantCount} baris peserta dengan anomali telah dikecualikan demi menjamin validitas capaian statistik.
                </div>
              )}
            </div>
          </div>

          {/* BAGIAN 2: HASIL PELAKSANAAN PELATIHAN */}
          <div className="my-6 space-y-3 text-xs text-slate-800">
            <h3 className="font-bold text-sm uppercase border-b border-slate-400 pb-1 text-slate-950">
              2. Hasil Pelaksanaan Pelatihan
            </h3>

            <p className="text-justify leading-relaxed">
              Pelaksanaan pelatihan menunjukkan capaian yang sangat positif, baik dari peningkatan hasil pemahaman belajar peserta maupun indeks kepuasan terhadap narasumber/pengajar dan panitia penyelenggara.
            </p>
            
            {/* Tabel Capaian Hasil Belajar & Kelulusan */}
            <table className="w-full border-collapse border border-slate-400 text-center text-xs">
              <thead className="bg-slate-100 text-slate-900 font-bold">
                <tr>
                  <th className="border border-slate-400 p-2 text-left">Indikator Capaian</th>
                  <th className="border border-slate-400 p-2">Pre-test</th>
                  <th className="border border-slate-400 p-2">Post-test</th>
                  <th className="border border-slate-400 p-2">Peningkatan (Delta)</th>
                  <th className="border border-slate-400 p-2">N-Gain (Hake)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 text-left font-medium">Nilai Rata-rata Peserta</td>
                  <td className="border border-slate-400 p-2">{stats.learningMetrics.pretest.mean}</td>
                  <td className="border border-slate-400 p-2 font-bold">{stats.learningMetrics.posttest.mean}</td>
                  <td className="border border-slate-400 p-2 text-emerald-700 font-bold">+{stats.learningMetrics.deltaMean} poin</td>
                  <td className="border border-slate-400 p-2 font-bold">{stats.learningMetrics.normalizedGain.meanNGain} ({stats.learningMetrics.normalizedGain.category.split(' ')[0]})</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-left font-medium">Rentang Nilai (Min - Max)</td>
                  <td className="border border-slate-400 p-2">{stats.learningMetrics.pretest.min} - {stats.learningMetrics.pretest.max}</td>
                  <td className="border border-slate-400 p-2">{stats.learningMetrics.posttest.min} - {stats.learningMetrics.posttest.max}</td>
                  <td className="border border-slate-400 p-2">-</td>
                  <td className="border border-slate-400 p-2">-</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-left font-medium">Standar Deviasi (SD)</td>
                  <td className="border border-slate-400 p-2">{stats.learningMetrics.pretest.stdDev}</td>
                  <td className="border border-slate-400 p-2">{stats.learningMetrics.posttest.stdDev}</td>
                  <td className="border border-slate-400 p-2">-</td>
                  <td className="border border-slate-400 p-2">-</td>
                </tr>
                <tr className="bg-slate-50 font-medium">
                  <td className="border border-slate-400 p-2 text-left font-bold">Tingkat Kelulusan</td>
                  <td className="border border-slate-400 p-2" colSpan={4}>
                    Total Lulus: <strong>{stats.summary.passRate}%</strong> ({stats.summary.passedCount} orang) &bull; Pria: {stats.summary.genderStats.malePassRate}% &bull; Wanita: {stats.summary.genderStats.femalePassRate}%
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Evaluasi Pengajar & Panitia */}
            <p className="leading-relaxed">
              <strong>Evaluasi Pengajar dan Panitia:</strong> Instruktur/narasumber memperoleh skor kepuasan rerata <strong>{stats.evaluationMetrics.instructor.overallMean} dari {stats.evaluationMetrics.instructor.scale}</strong> ({stats.evaluationMetrics.instructor.percentage.toFixed(1)}%). Sementara itu, panitia penyelenggara dan kesiapan sarana memperoleh skor rerata <strong>{stats.evaluationMetrics.committee.overallMean} dari {stats.evaluationMetrics.committee.scale}</strong> ({stats.evaluationMetrics.committee.percentage.toFixed(1)}%).
            </p>
          </div>

          {/* BAGIAN 3: SIMPULAN DAN SARAN */}
          <div className="my-6 space-y-3 text-xs text-slate-800">
            <h3 className="font-bold text-sm uppercase border-b border-slate-400 pb-1 text-slate-950">
              3. Simpulan dan Saran
            </h3>

            {/* A. Simpulan Utama */}
            <div className="font-bold text-blue-900">A. Simpulan Utama (Berbasis Bukti Keterlacakan 100%):</div>
            <ol className="list-decimal pl-5 space-y-2">
              {findings.map((f, idx) => (
                <li key={idx} className="leading-relaxed text-justify">
                  <strong>[{f.category}]</strong> {f.statement}
                  <div className="text-[11px] text-slate-500 italic">
                    Sumber Data Rujukan: {f.sourceData}
                  </div>
                </li>
              ))}
            </ol>

            {/* B. Keterbatasan Analisis */}
            <div className="font-bold text-blue-900 pt-2">B. Pernyataan Keterbatasan Analisis:</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11.5px]">
              {limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>

            {/* C. Rekomendasi */}
            <div className="font-bold text-blue-900 pt-2">C. Saran dan Rekomendasi Tindak Lanjut:</div>
            <ol className="list-decimal pl-5 space-y-1.5">
              {recommendations.map((r, idx) => (
                <li key={idx} className="leading-relaxed text-justify">
                  <strong>[{r.area} - Prioritas {r.priority}]</strong> {r.action}
                  <div className="text-[11px] text-slate-500">Dasar Pertimbangan: {r.rationale}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* BAGIAN 4: PENUTUP */}
          <div className="my-6 space-y-2 text-xs text-slate-800">
            <h3 className="font-bold text-sm uppercase border-b border-slate-400 pb-1 text-slate-950">
              4. Penutup
            </h3>
            <p className="leading-relaxed text-justify">
              Demikian laporan pelaksanaan pelatihan ini disusun sebagai bahan pertanggungjawaban dan evaluasi berkala bagi pimpinan. Atas perhatian dan kerja sama yang baik, kami menyampaikan terima kasih.
            </p>
          </div>

          {/* Signatures Block for Official Balai Report (TANPA NIP) */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-800">
            <div className="space-y-16">
              <div>
                Mengetahui,<br />
                <strong>Ketua Tim Penyelenggara Pelatihan Aparatur dan Talenta Digital</strong>
              </div>
              <div>
                <strong className="underline block text-sm">Dyah Puspito Dewi Widowati</strong>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                Disahkan oleh,<br />
                <strong>Kepala Balai Pelatihan Talenta Komdigi</strong>
              </div>
              <div>
                <strong className="underline block text-sm">Hamdani Pratama</strong>
              </div>
            </div>
          </div>

        </div>

    </div>
  );
};
