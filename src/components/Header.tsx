import React from 'react';
import { ShieldCheck, Key, FileText, CheckCircle2, AlertTriangle, Sparkles, Building2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onOpenApiKeyModal: () => void;
  hasUserApiKey: boolean;
  hasServerApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onOpenApiKeyModal,
  hasUserApiKey,
  hasServerApiKey
}) => {
  const isKeyConfigured = hasUserApiKey || hasServerApiKey;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded-full">
                  Balai Pelatihan Talenta Komunikasi & Digital
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• BPSDMP Komdigi</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                AI Agent Evaluasi Pelatihan
                <span className="text-xs font-normal bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md">
                  v2.4 Production
                </span>
              </h1>
            </div>
          </div>

          {/* Right Actions: Security Badge & API Key State */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Privacy Badge */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg" title="Sistem mematuhi NFR-01: ID anonim, tanpa PII, data hanya di memori sesi">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-medium">Privasi Sesi:</span> Bebas PII & Enkripsi Memori
            </div>

            {/* API Key Status Button */}
            <button
              onClick={onOpenApiKeyModal}
              type="button"
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                isKeyConfigured
                  ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700'
                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-700/60 animate-pulse'
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${isKeyConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>
                {hasUserApiKey
                  ? 'Kunci Sesi Terpasang'
                  : hasServerApiKey
                  ? 'Kunci Cloud Siap'
                  : 'Atur Kunci API Gemini'}
              </span>
            </button>
          </div>
        </div>

        {/* Step indicator breadcrumb */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto text-xs text-slate-400 pb-1">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className={`flex items-center gap-1.5 font-medium ${currentStep >= 1 ? 'text-sky-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span>Ringkasan & Berkas</span>
            </span>
            <span className="text-slate-600">→</span>
            <span className={`flex items-center gap-1.5 font-medium ${currentStep >= 2 ? 'text-sky-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span>Validasi & Kualitas Data</span>
            </span>
            <span className="text-slate-600">→</span>
            <span className={`flex items-center gap-1.5 font-medium ${currentStep >= 3 ? 'text-sky-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span>Proses Agent 6 Tahap</span>
            </span>
            <span className="text-slate-600">→</span>
            <span className={`flex items-center gap-1.5 font-medium ${currentStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>4</span>
              <span>Draf Laporan & Ekspor</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 hidden md:block">
            Arsitektur: Human-in-the-Loop • 100% Deterministic Code Stats
          </div>
        </div>

      </div>
    </header>
  );
};
