import React from 'react';
import {
  ShieldCheck,
  Calculator,
  MessageSquareText,
  Lightbulb,
  CheckCircle,
  FileText,
  Loader2,
  Check
} from 'lucide-react';

interface AgentProgressModalProps {
  isOpen: boolean;
  activeStage: number; // 1 to 6
  stageMessage: string;
}

export const AgentProgressModal: React.FC<AgentProgressModalProps> = ({
  isOpen,
  activeStage,
  stageMessage
}) => {
  if (!isOpen) return null;

  const stages = [
    {
      num: 1,
      name: 'Pemeriksaan Kualitas Data',
      engine: 'Kode Aplikasi',
      desc: 'Mendeteksi nilai kosong, nilai di luar rentang, ID ganda, dan status tidak cocok.',
      icon: ShieldCheck
    },
    {
      num: 2,
      name: 'Perhitungan Statistik Hasil Belajar',
      engine: 'Kode Aplikasi',
      desc: 'Menghitung rata-rata pre/post-test, N-Gain Hake, rasio kelulusan L/P, dan evaluasi.',
      icon: Calculator
    },
    {
      num: 3,
      name: 'Analisis Tema Komentar Peserta',
      engine: 'Gemini 3.8-Flash',
      desc: 'Mengelompokkan komentar terbuka menjadi tema, frekuensi, sentimen, dan kutipan asli.',
      icon: MessageSquareText
    },
    {
      num: 4,
      name: 'Penyusunan Temuan & Rekomendasi',
      engine: 'Gemini 3.8-Flash',
      desc: 'Menyusun butir temuan berbasis bukti yang wajib memuat rujukan sumber data.',
      icon: Lightbulb
    },
    {
      num: 5,
      name: 'Verifikasi Bukti & Deteksi Halusinasi',
      engine: 'Gemini + Kode Verifier',
      desc: 'Memvalidasi setiap kutipan terhadap teks asli dan memverifikasi angka penopang.',
      icon: CheckCircle
    },
    {
      num: 6,
      name: 'Perakitan Draf Laporan Evaluasi',
      engine: 'Kode Aplikasi',
      desc: 'Menggabungkan hasil ke format resmi draf laporan berstatus perlu ditinjau.',
      icon: FileText
    }
  ];

  const progressPercent = Math.min(100, Math.round((activeStage / 6) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-black/80">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-950">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  Proses AI Agent Berjalan
                </span>
                <h3 className="text-base font-bold text-white">Pipeline Analisis Evaluasi 6 Tahap</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-sky-400 font-mono">{progressPercent}%</span>
              <span className="block text-[10px] text-slate-400">Tahap {activeStage} dari 6</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stages List */}
        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {stages.map((st) => {
            const isDone = activeStage > st.num;
            const isCurrent = activeStage === st.num;
            const isPending = activeStage < st.num;
            const Icon = st.icon;

            return (
              <div
                key={st.num}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-sky-950/40 border-sky-600/80 shadow-md shadow-sky-950/40'
                    : isDone
                    ? 'bg-slate-950/60 border-emerald-900/40 opacity-90'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-40'
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-sky-600 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : st.num}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-sky-300' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                      {st.name}
                    </h4>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      st.engine.includes('Gemini')
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {st.engine}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer status message */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-slate-300">{stageMessage || 'Sedang memproses evaluasi data...'}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">BPSDMP Komdigi</span>
        </div>

      </div>
    </div>
  );
};
