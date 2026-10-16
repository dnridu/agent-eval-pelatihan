import React from 'react';
import { TrainingSummary } from '../types';
import { PRESET_VALID, PRESET_ANOMALY, PRESET_BPPTIK, PresetPackage } from '../utils/sampleData';
import { Sparkles, Calendar, BookOpen, Users, Award, ShieldAlert, RotateCcw } from 'lucide-react';

interface SummaryFormProps {
  summary: TrainingSummary;
  onChange: (updated: TrainingSummary) => void;
  onApplyPreset: (preset: PresetPackage) => void;
  onReset: () => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onChange,
  onApplyPreset,
  onReset
}) => {
  const handleChange = (field: keyof TrainingSummary, value: any) => {
    onChange({
      ...summary,
      [field]: value
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header & Preset Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 bg-sky-950 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
              Langkah 1: Ringkasan Pelatihan
            </span>
            <span className="text-xs text-slate-400">Parameter Kriteria & Pelaksanaan</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Formulir Informasi Dasar & Kriteria Kelulusan</h2>
          <p className="text-xs text-slate-400">
            Kriteria ambang kelulusan di formulir ini akan menjadi dasar validasi status kelulusan peserta oleh kode aplikasi.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onApplyPreset(PRESET_BPPTIK)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-950/90 hover:bg-sky-900 text-sky-200 border border-sky-600 rounded-xl transition-all shadow-md shadow-sky-950/60"
            title="Muat data survei evaluasi resmi BPPTIK Kominfo Cikarang (Pelatihan dan Implementasi AI)"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Preset BPPTIK: Implementasi AI (Template Resmi)</span>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset(PRESET_VALID)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-xl transition-all shadow-sm"
            title="Muat contoh lengkap dan valid untuk demonstrasi kelulusan & hasil belajar"
          >
            <span>Preset 2: Web Dev (Valid)</span>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset(PRESET_ANOMALY)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-700/60 rounded-xl transition-all shadow-sm"
            title="Muat dataset yang disisipi nilai kosong, nilai 125 di luar rentang, ID ganda, dan status tidak cocok"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset 3: Uji Anomali</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Reset ke isian kosong"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        
        {/* Tema Pelatihan */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Tema / Judul Pelatihan <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={summary.theme}
            onChange={e => handleChange('theme', e.target.value)}
            placeholder="Contoh: Pelatihan Junior Web Developer & Cloud Fundamentals"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Target Batch / Angkatan */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Angkatan / Batch Pelatihan <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={summary.targetBatch}
            onChange={e => handleChange('targetBatch', e.target.value)}
            placeholder="Contoh: Angkatan II - TA 2026"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Tanggal Mulai */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Tanggal Mulai Pelaksanaan <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={summary.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Tanggal Selesai */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Tanggal Selesai Pelaksanaan <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={summary.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Metode Pelatihan */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Metode Pelatihan <span className="text-rose-400">*</span>
          </label>
          <select
            value={summary.method}
            onChange={e => handleChange('method', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Blended Learning">Blended Learning (Kombinasi Daring & Tatap Muka)</option>
            <option value="Online / Daring">Online / Daring (Virtual Zoom / LMS)</option>
            <option value="Offline / Klasikal">Offline / Klasikal (Tatap Muka di Lab Balai)</option>
          </select>
        </div>

        {/* Jumlah Pendaftar */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Jumlah Pendaftar (Orang) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={summary.registeredCount || ''}
            onChange={e => handleChange('registeredCount', parseInt(e.target.value) || 0)}
            placeholder="Contoh: 45"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Jumlah Diterima */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Jumlah Diterima (Kapasitas Kelas) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={summary.acceptedCount || ''}
            onChange={e => handleChange('acceptedCount', parseInt(e.target.value) || 0)}
            placeholder="Contoh: 32"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <p className="text-[11px] text-slate-400">Dicocokkan dengan jumlah baris di berkas CSV peserta.</p>
        </div>

        {/* Kriteria Ambang Batas Lulus */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-sky-300">
              Kriteria Kelulusan (Skor Min. Post-test) <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-sky-400 font-bold bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
              Ambang: {summary.passThreshold}
            </span>
          </div>
          <input
            type="number"
            min={0}
            max={summary.scoreScale}
            value={summary.passThreshold || ''}
            onChange={e => handleChange('passThreshold', parseFloat(e.target.value) || 70)}
            placeholder="Contoh: 70 atau 75"
            className="w-full bg-slate-950 border border-sky-600/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <p className="text-[11px] text-slate-400">Peserta dengan skor post-test ≥ ambang ini dinyatakan LULUS.</p>
        </div>

        {/* Skala Nilai */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Skala Nilai Ujian (Skala Maksimal)
          </label>
          <input
            type="number"
            min={10}
            max={100}
            value={summary.scoreScale || 100}
            onChange={e => handleChange('scoreScale', parseInt(e.target.value) || 100)}
            placeholder="100"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Penyelenggara */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Unit Penyelenggara
          </label>
          <input
            type="text"
            value={summary.organizer}
            onChange={e => handleChange('organizer', e.target.value)}
            placeholder="Balai Pelatihan Talenta Komunikasi dan Digital"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Nomor Referensi Resmi */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Nomor Surat Keputusan / Surat Tugas
          </label>
          <input
            type="text"
            value={summary.officialReference || ''}
            onChange={e => handleChange('officialReference', e.target.value)}
            placeholder="Contoh: B-1428/BPTKD.3/DL.02.01/09/2026"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
          />
        </div>

        {/* Tujuan Pembelajaran Pelatihan (Opsional) */}
        <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Tujuan Pembelajaran Pelatihan (Opsional - Sebagai Acuan AI Menyusun Rekomendasi)
          </label>
          <textarea
            rows={2}
            value={summary.learningObjectives || ''}
            onChange={e => handleChange('learningObjectives', e.target.value)}
            placeholder="Contoh: Meningkatkan kompetensi ASN dan talenta digital dalam pemrograman web modern, arsitektur RESTful API, dan deployment aplikasi cloud."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

      </div>

    </div>
  );
};
