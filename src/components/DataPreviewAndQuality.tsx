import React, { useState } from 'react';
import {
  DataQualityResult,
  ParticipantRecord,
  EvaluationRecord,
  TrainingSummary,
  AnomalyItem
} from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Play,
  FileCheck2,
  Info,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DataPreviewAndQualityProps {
  summary: TrainingSummary;
  quality: DataQualityResult | null;
  participants: ParticipantRecord[];
  evaluations: EvaluationRecord[];
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
  hasApiError?: string | null;
}

export const DataPreviewAndQuality: React.FC<DataPreviewAndQualityProps> = ({
  summary,
  quality,
  participants,
  evaluations,
  onStartAnalysis,
  isAnalyzing,
  hasApiError
}) => {
  const [activeTab, setActiveTab] = useState<'peserta' | 'evaluasi' | 'anomali'>('anomali');

  if (!quality || participants.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm">Silakan unggah kedua berkas CSV atau pilih preset data di atas untuk melihat pratinjau dan pemeriksaan kualitas.</p>
      </div>
    );
  }

  const severeAnomalies = quality.anomalies.filter(a => a.severity === 'berat');
  const minorAnomalies = quality.anomalies.filter(a => a.severity === 'ringan');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Title & Agent Decision Gate Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 bg-sky-950 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
              Langkah 4: Pemeriksaan Kualitas & Konfirmasi
            </span>
            <span className="text-xs text-slate-400">Aturan Keputusan Agent (FR-02)</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Audit Integritas Data & Gating Analisis</h2>
          <p className="text-xs text-slate-400">
            Agent memverifikasi data sebelum komputasi statistik dan sintesis AI dimulai.
          </p>
        </div>

        {/* Start Analysis Button */}
        <div>
          <button
            type="button"
            disabled={!quality.canProceed || isAnalyzing}
            onClick={onStartAnalysis}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              quality.canProceed && !isAnalyzing
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-900/50 cursor-pointer scale-100 hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses Analisis...</span>
              </>
            ) : (
              <>
                <span>Jalankan AI Agent</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decision Status Banner */}
      {quality.severeCount > 0 ? (
        <div className="p-4 bg-rose-950/60 border border-rose-800/90 rounded-xl space-y-2 text-rose-200">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>PROSES DIHENTIKAN: Terdeteksi Masalah Berat Pada Data Masukan</span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            {quality.decisionMessage} Sesuai standar tata kelola data Balai, analisis tidak dapat dilanjutkan sebelum data post-test diperbaiki agar kesimpulan tidak menyesatkan.
          </p>
        </div>
      ) : quality.minorCount > 0 ? (
        <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-xl space-y-2 text-amber-200">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Agent Melanjutkan dengan Pengecualian ({quality.minorCount} Anomali Ringan Ditandai)</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {quality.decisionMessage} Sebanyak <strong>{quality.excludedParticipantCount} baris data peserta</strong> dikecualikan dari perhitungan angka. Statistik akan dihitung dari <strong>{quality.validParticipantCount} peserta valid</strong>.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between text-emerald-200">
          <div className="flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-sm block text-emerald-300">Data Sempurna & Siap Dianalisis</span>
              <span>Seluruh {participants.length} data peserta dan {evaluations.length} evaluasi valid tanpa anomali.</span>
            </div>
          </div>
        </div>
      )}

      {/* Error message from API if present */}
      {hasApiError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-start gap-2">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Catatan Eksekusi:</strong>
            <span>{hasApiError}</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('anomali')}
          className={`pb-2.5 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeTab === 'anomali'
              ? 'text-sky-400 border-sky-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <span>Daftar Anomali & Kualitas</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${quality.anomalies.length > 0 ? 'bg-amber-900/80 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
            {quality.anomalies.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('peserta')}
          className={`pb-2.5 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeTab === 'peserta'
              ? 'text-sky-400 border-sky-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <span>Pratinjau Data Peserta</span>
          <span className="bg-slate-800 px-1.5 py-0.2 rounded-full text-[10px] text-slate-300">
            {participants.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evaluasi')}
          className={`pb-2.5 px-3 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeTab === 'evaluasi'
              ? 'text-sky-400 border-sky-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <span>Pratinjau Evaluasi & Komentar</span>
          <span className="bg-slate-800 px-1.5 py-0.2 rounded-full text-[10px] text-slate-300">
            {evaluations.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Anomaly Details Table */}
      {activeTab === 'anomali' && (
        <div className="space-y-3">
          {quality.anomalies.length === 0 ? (
            <div className="p-6 bg-slate-950/40 rounded-xl text-center text-xs text-slate-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              Tidak ditemukan anomali. Semua nilai berada dalam rentang wajar, tidak ada nilai kosong, tidak ada ID ganda, dan status kelulusan selaras dengan kriteria nilai minimum {summary.passThreshold}.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Tingkat</th>
                    <th className="py-2.5 px-3">Tipe Masalah</th>
                    <th className="py-2.5 px-3">Berkas / Baris</th>
                    <th className="py-2.5 px-3">ID / Kolom</th>
                    <th className="py-2.5 px-3">Deskripsi Temuan</th>
                    <th className="py-2.5 px-3">Tindakan Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
                  {quality.anomalies.map((anom) => (
                    <tr key={anom.id} className={anom.severity === 'berat' ? 'bg-rose-950/20' : 'hover:bg-slate-800/30'}>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          anom.severity === 'berat'
                            ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {anom.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-200 font-sans font-medium">
                        {anom.type.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {anom.sourceFile} {anom.rowNumber ? `(Baris ${anom.rowNumber})` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-sky-300">
                        {anom.recordId ? `${anom.recordId} • ` : ''}{anom.field}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        {anom.description}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`text-[11px] ${
                          anom.actionTaken.includes('Dikecualikan')
                            ? 'text-rose-400'
                            : anom.actionTaken.includes('Dihentikan')
                            ? 'text-rose-300 font-bold'
                            : 'text-amber-400'
                        }`}>
                          {anom.actionTaken}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Participants Preview */}
      {activeTab === 'peserta' && (
        <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">No</th>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">L/P</th>
                <th className="py-2 px-3">Instansi</th>
                <th className="py-2 px-3">Domisili</th>
                <th className="py-2 px-3 text-right">Pre-test</th>
                <th className="py-2 px-3 text-right">Post-test</th>
                <th className="py-2 px-3 text-center">Status CSV</th>
                <th className="py-2 px-3 text-center">Evaluasi Kriteria (≥{summary.passThreshold})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
              {participants.map((p, idx) => {
                const isOutOfRange = (p.posttestScore !== null && (p.posttestScore < 0 || p.posttestScore > summary.scoreScale)) ||
                  (p.pretestScore !== null && (p.pretestScore < 0 || p.pretestScore > summary.scoreScale));
                const isMissing = p.posttestScore === null || p.pretestScore === null;
                const passesCriteria = p.posttestScore !== null && p.posttestScore >= summary.passThreshold;
                const statusMatches = (passesCriteria && p.statusLulus.toUpperCase().includes('LULUS')) ||
                  (!passesCriteria && !p.statusLulus.toUpperCase().includes('LULUS'));

                return (
                  <tr key={idx} className={isMissing || isOutOfRange ? 'bg-rose-950/20' : !statusMatches ? 'bg-amber-950/20' : 'hover:bg-slate-800/30'}>
                    <td className="py-1.5 px-3 text-slate-500">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-bold text-sky-300">{p.id}</td>
                    <td className="py-1.5 px-3 font-sans">{p.gender}</td>
                    <td className="py-1.5 px-3 font-sans truncate max-w-[180px]">{p.agency}</td>
                    <td className="py-1.5 px-3 font-sans truncate max-w-[140px]">{p.domicile}</td>
                    <td className="py-1.5 px-3 text-right text-slate-300">{p.pretestScore ?? <span className="text-rose-400 font-bold">KOSONG</span>}</td>
                    <td className={`py-1.5 px-3 text-right font-bold ${isOutOfRange ? 'text-rose-400 underline' : 'text-slate-100'}`}>
                      {p.posttestScore ?? <span className="text-rose-400 font-bold">KOSONG</span>}
                    </td>
                    <td className="py-1.5 px-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        p.statusLulus.toUpperCase().includes('LULUS')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.statusLulus}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-center font-sans">
                      {isMissing ? (
                        <span className="text-rose-400 text-[11px]">Tidak Dapat Dihitung</span>
                      ) : passesCriteria ? (
                        <span className="text-emerald-400 text-[11px] font-semibold">Memenuhi Syarat</span>
                      ) : (
                        <span className="text-rose-400 text-[11px] font-semibold">Di Bawah Ambang</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Evaluation Preview */}
      {activeTab === 'evaluasi' && (
        <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">No</th>
                <th className="py-2 px-3">Sasaran</th>
                <th className="py-2 px-3">Aspek Penilaian</th>
                <th className="py-2 px-3 text-center">Skor / Skala</th>
                <th className="py-2 px-3">Teks Komentar Terbuka Peserta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11.5px]">
              {evaluations.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      e.target === 'Pengajar'
                        ? 'bg-sky-950 text-sky-300 border border-sky-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {e.target}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200">{e.aspect}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-amber-300">
                    {e.score} / {e.scale}
                  </td>
                  <td className="py-2 px-3 text-slate-300 italic">
                    "{e.comment}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
