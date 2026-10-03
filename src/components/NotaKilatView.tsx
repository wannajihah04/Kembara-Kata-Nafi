import React, { useState } from 'react';
import { PageNavigationFooter } from './PageNavigationFooter';
import { 
  Zap, ZoomIn, ZoomOut, RotateCcw, ExternalLink, 
  BookOpen, Sparkles, CheckCircle, Info, Download
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NotaKilatViewProps {
  onBack: () => void;
  onNext: () => void;
}

export const NotaKilatView: React.FC<NotaKilatViewProps> = ({ onBack, onNext }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const infographicUrl = 'https://res.cloudinary.com/k9n0nsfr/image/upload/v1791009175/Perbezaan__Bukan__dan__Tidak_.png';

  const handleZoomIn = () => {
    sounds.playPop();
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    sounds.playPop();
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    sounds.playPop();
    setZoomLevel(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 p-6 sm:p-8 border-3 border-slate-900 shadow-neo">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-neo-sm flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>Rujukan Pantas</span>
            </span>
            <span className="bg-white border border-slate-900 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full shadow-neo-sm">
              Infografik Visual
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
            ⚡ Nota Kilat: Perbezaan BUKAN &amp; TIDAK
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
            Hafal dan fahami formula perbezaan kata nafi dalam satu paparan infografik visual yang ringkas dan padat.
          </p>
        </div>
      </div>

      {/* 2. Infographic Viewer Card */}
      <div className="rounded-3xl bg-white border-3 border-slate-900 p-4 sm:p-6 shadow-neo space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 border border-slate-900"></span>
            <span className="text-xs sm:text-sm font-black text-slate-800">
              Poster Infografik Rasmi Kata Nafi
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleZoomIn}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 text-xs font-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Besarkan Paparan"
            >
              <ZoomIn className="h-4 w-4" />
              <span className="hidden sm:inline">Besarkan</span>
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 text-xs font-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Kecilkan Paparan"
            >
              <ZoomOut className="h-4 w-4" />
              <span className="hidden sm:inline">Kecilkan</span>
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 text-xs font-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Set Semula Saiz"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Asal</span>
            </button>

            <a
              href={infographicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 text-xs font-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Buka dalam tab baharu"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Saiz Penuh</span>
            </a>
          </div>
        </div>

        {/* Image Container with Scroll & Zoom */}
        <div className="overflow-auto rounded-2xl bg-slate-50 border-2 border-slate-200 p-2 sm:p-4 flex items-center justify-center min-h-[400px] max-h-[70vh]">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out',
            }}
            className="flex items-center justify-center max-w-full"
          >
            <img
              src={infographicUrl}
              alt="Infografik Perbezaan Bukan dan Tidak"
              className="rounded-xl border-2 border-slate-900 shadow-neo max-w-full h-auto object-contain select-none"
              loading="eager"
            />
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 font-bold">
          Tip: Gunakan butang di atas untuk membesarkan atau membuka infografik dalam saiz penuh bagi bacaan yang lebih jelas.
        </p>
      </div>

      {/* 3. Tiga Rujukan Kilat Kad Ringkas - Teks Align Centre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kad 1: BUKAN */}
        <div className="p-5 rounded-3xl bg-orange-100 border-3 border-slate-900 shadow-neo flex flex-col items-center justify-between text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-orange-400 text-slate-900 border-2 border-slate-900 text-xs font-black shadow-neo-sm mb-3 mx-auto">
              <span>📌</span>
              <span>KATA NAFI: BUKAN</span>
            </div>
            <h3 className="text-base font-black font-heading text-slate-900 text-center">
              Frasa Nama (FN) &amp; Frasa Sendi Nama (FSN)
            </h3>
            <p className="text-xs text-slate-700 font-semibold mt-2 leading-relaxed text-center">
              Digunakan khusus sebelum kata nama orang, benda, haiwan atau kata sendi arah dan tempat.
            </p>
          </div>
          <div className="mt-4 p-2.5 rounded-xl bg-white border-2 border-slate-900 text-xs font-bold text-slate-800 text-center w-full">
            Contoh: "Itu <strong>bukan</strong> kereta ayah."
          </div>
        </div>

        {/* Kad 2: TIDAK */}
        <div className="p-5 rounded-3xl bg-sky-100 border-3 border-slate-900 shadow-neo flex flex-col items-center justify-between text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-sky-300 text-slate-900 border-2 border-slate-900 text-xs font-black shadow-neo-sm mb-3 mx-auto">
              <span>📌</span>
              <span>KATA NAFI: TIDAK</span>
            </div>
            <h3 className="text-base font-black font-heading text-slate-900 text-center">
              Frasa Kerja (FK) &amp; Frasa Adjektif (FA)
            </h3>
            <p className="text-xs text-slate-700 font-semibold mt-2 leading-relaxed text-center">
              Digunakan khusus sebelum perbuatan (kerja) atau sifat/keadaan (adjektif).
            </p>
          </div>
          <div className="mt-4 p-2.5 rounded-xl bg-white border-2 border-slate-900 text-xs font-bold text-slate-800 text-center w-full">
            Contoh: "Adik <strong>tidak</strong> menangis lagi."
          </div>
        </div>

        {/* Kad 3: KES KHAS */}
        <div className="p-5 rounded-3xl bg-amber-100 border-3 border-slate-900 shadow-neo flex flex-col items-center justify-between text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 text-slate-900 border-2 border-slate-900 text-xs font-black shadow-neo-sm mb-3 mx-auto">
              <span>💡</span>
              <span>KES KHAS: PERTENTANGAN</span>
            </div>
            <h3 className="text-base font-black font-heading text-slate-900 text-center">
              Unsur Pertentangan (...tetapi...)
            </h3>
            <p className="text-xs text-slate-700 font-semibold mt-2 leading-relaxed text-center">
              'Bukan' boleh digunakan di hadapan Frasa Kerja / Adjektif jika ayat membawa maksud bertentangan.
            </p>
          </div>
          <div className="mt-4 p-2.5 rounded-xl bg-white border-2 border-slate-900 text-xs font-bold text-slate-800 text-center w-full">
            Contoh: "Dia <strong>bukan</strong> sombong, tetapi pemalu."
          </div>
        </div>
      </div>

      {/* 4. Page Navigation Footer: Back to Kuiz, Next to Halaman Utama */}
      <PageNavigationFooter
        onBack={onBack}
        onNext={onNext}
        backLabel="KUIZ"
        backSubtext="Kembali ke Permainan Kuiz"
        nextLabel="HALAMAN UTAMA"
        nextSubtext="Kembali ke Dashboard Utama"
      />
    </div>
  );
};
