import React, { useRef } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileWarning
} from 'lucide-react';
import {
  TEMPLATE_DATA_PESERTA_CSV,
  TEMPLATE_EVALUASI_CSV,
  ValidationResult
} from '../utils/csvParser';
import { ParticipantRecord, EvaluationRecord } from '../types';

interface FileUploadSectionProps {
  participantsValidation: ValidationResult<ParticipantRecord> | null;
  evaluationsValidation: ValidationResult<EvaluationRecord> | null;
  participantsFileName: string;
  evaluationsFileName: string;
  onParticipantsFileChange: (content: string, fileName: string) => void;
  onEvaluationsFileChange: (content: string, fileName: string) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  participantsValidation,
  evaluationsValidation,
  participantsFileName,
  evaluationsFileName,
  onParticipantsFileChange,
  onEvaluationsFileChange
}) => {
  const participantsInputRef = useRef<HTMLInputElement>(null);
  const evaluationsInputRef = useRef<HTMLInputElement>(null);

  // Helper to trigger CSV file download
  const downloadTemplate = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileRead = (
    file: File,
    onSuccess: (content: string, fileName: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onSuccess(text, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header and Template Downloads */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 bg-sky-950 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
              Langkah 2 & 3: Unggah Berkas & Validasi Kolom
            </span>
            <span className="text-xs text-slate-400">Dua Berkas CSV Standar</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Unggah Berkas Data Evaluasi</h2>
          <p className="text-xs text-slate-400">
            Unggah berkas Data Peserta dan Evaluasi Pengajar/Panitia. Sistem akan memeriksa kolom secara instan sebelum analisis diizinkan.
          </p>
        </div>

        {/* Download Template Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => downloadTemplate(TEMPLATE_DATA_PESERTA_CSV, 'template_data_peserta_balai.csv')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700/80 text-sky-300 border border-slate-700 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Unduh Template Peserta (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => downloadTemplate(TEMPLATE_EVALUASI_CSV, 'template_evaluasi_survei_bpptik_kominfo.csv')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-600 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unduh Template Evaluasi BPPTIK (.csv)</span>
          </button>
        </div>
      </div>

      {/* Two Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Data Peserta Pelatihan */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">1. Berkas Data Peserta</h3>
              </div>
              {participantsValidation && (
                participantsValidation.isValid ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <FileCheck className="w-3 h-3" /> Format Sesuai
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded-full">
                    <FileWarning className="w-3 h-3" /> Format Ditolak
                  </span>
                )
              )}
            </div>

            <p className="text-xs text-slate-400">
              Kolom wajib: <code className="text-sky-300">id</code>, <code className="text-sky-300">jenis_kelamin</code>, <code className="text-sky-300">instansi</code>, <code className="text-sky-300">domisili</code>, <code className="text-sky-300">nilai_pretest</code>, <code className="text-sky-300">nilai_posttest</code>, <code className="text-sky-300">status_kelulusan</code>.
            </p>

            {/* Hidden Input */}
            <input
              type="file"
              ref={participantsInputRef}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileRead(file, onParticipantsFileChange);
              }}
            />

            {/* Drop Zone */}
            <div
              onClick={() => participantsInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileRead(file, onParticipantsFileChange);
              }}
              className="border-2 border-dashed border-slate-700 hover:border-sky-500/70 bg-slate-900/50 hover:bg-slate-800/40 rounded-xl p-4 text-center cursor-pointer transition-all space-y-2"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-sky-400">Klik untuk memilih berkas</span> atau seret file CSV ke sini
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {participantsFileName ? `Berkas terpilih: ${participantsFileName}` : 'Belum ada berkas dipilih'}
              </div>
            </div>
          </div>

          {/* Validation Feedback */}
          {participantsValidation && (
            <div className="pt-2">
              {participantsValidation.isValid ? (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Terbaca <strong>{participantsValidation.data.length} baris peserta</strong> valid.</span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Validasi Format Gagal:</strong>
                    <span>{participantsValidation.error}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Evaluasi Pengajar dan Panitia */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">2. Berkas Evaluasi & Komentar</h3>
              </div>
              {evaluationsValidation && (
                evaluationsValidation.isValid ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <FileCheck className="w-3 h-3" /> Format Sesuai
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded-full">
                    <FileWarning className="w-3 h-3" /> Format Ditolak
                  </span>
                )
              )}
            </div>

            <p className="text-xs text-slate-400">
              Mendukung <strong className="text-indigo-300">Format Resmi Survei BPPTIK Kominfo</strong> (33 kolom kuesioner PermenPANRB & kritik/saran) atau format standar (<code className="text-indigo-300">aspek</code>, <code className="text-indigo-300">objek</code>, <code className="text-indigo-300">skor</code>, <code className="text-indigo-300">skala</code>, <code className="text-indigo-300">komentar</code>).
            </p>

            {/* Hidden Input */}
            <input
              type="file"
              ref={evaluationsInputRef}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileRead(file, onEvaluationsFileChange);
              }}
            />

            {/* Drop Zone */}
            <div
              onClick={() => evaluationsInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileRead(file, onEvaluationsFileChange);
              }}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 bg-slate-900/50 hover:bg-slate-800/40 rounded-xl p-4 text-center cursor-pointer transition-all space-y-2"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-indigo-400">Klik untuk memilih berkas</span> atau seret file CSV ke sini
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {evaluationsFileName ? `Berkas terpilih: ${evaluationsFileName}` : 'Belum ada berkas dipilih'}
              </div>
            </div>
          </div>

          {/* Validation Feedback */}
          {evaluationsValidation && (
            <div className="pt-2">
              {evaluationsValidation.isValid ? (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Terbaca <strong>{evaluationsValidation.data.length} penilaian aspek</strong> valid.</span>
                  </div>
                  {evaluationsValidation.formatDetected === 'bpptik_resmi' && (
                    <span className="text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded-md">
                      Format Resmi BPPTIK Kominfo (33 Kolom)
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Validasi Format Gagal:</strong>
                    <span>{evaluationsValidation.error}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
