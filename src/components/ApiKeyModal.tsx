import React, { useState } from 'react';
import { Key, ShieldAlert, CheckCircle2, X, Lock, ExternalLink, Info } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  hasServerApiKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  hasServerApiKey
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/60">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Konfigurasi Kunci API Gemini</h3>
              <p className="text-xs text-slate-400">Sesuai Syarat Keamanan FR-06 & NFR-06</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Server Key Indicator if present */}
          {hasServerApiKey && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-200">Kunci API Cloud Terdeteksi:</span> Server telah memiliki GEMINI_API_KEY bawaan. Anda dapat langsung menjalankan analisis tanpa mengisi kunci mandiri, atau memasukkan kunci pribadi jika ingin menggunakan kuota Anda sendiri.
              </div>
            </div>
          )}

          {/* Input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Kunci API Gemini Pribadi (Opsional / Ditimpa):
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono pr-20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-800 rounded-md border border-slate-700"
              >
                {showKey ? 'Sembunyikan' : 'Periksa'}
              </button>
            </div>
          </div>

          {/* Security Protocols Notice */}
          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Lock className="w-4 h-4 text-sky-400" />
              Protokol Keamanan & Kerahasiaan (FR-06 & NFR-06)
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11.5px] text-slate-400">
              <li>Kunci hanya disimpan di <strong className="text-slate-200">memori browser selama sesi kerja aktif</strong>.</li>
              <li>Tidak pernah disimpan di <code className="text-slate-300">localStorage</code>, cookie, atau riwayat URL.</li>
              <li>Tidak pernah disertakan dalam berkas draf laporan atau cetakan PDF.</li>
              <li>Bila kunci kosong atau kuota habis, <strong className="text-slate-200">perhitungan statistik kode tetap tampil 100%</strong> melalui modul fallback.</li>
            </ul>
          </div>

          {/* Shared device warning */}
          <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-start gap-2 text-[11.5px] text-amber-300/90">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Peringatan Perangkat Bersama:</strong> Jangan memasukkan kunci API di komputer publik yang tidak Anda kenal. Tutup tab setelah selesai untuk menghapus memori sesi secara tuntas.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/40 transition-colors"
            >
              Hapus Kunci Sesi
            </button>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-900/40 transition-all flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Tersimpan di Memori
                  </>
                ) : (
                  'Terapkan ke Sesi'
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
