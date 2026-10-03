import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Search, Volume2, Check, BookOpen } from 'lucide-react';
import { PageNavigationFooter } from './PageNavigationFooter';
import { Flipbook } from './Flipbook';
import { sounds } from '../utils/audio';

const CONTOH_FRASA = [
  { text: 'guru disiplin', category: 'FN', kataNafi: 'BUKAN', formula: 'BNS (Bukan + Nama)', reason: 'Perkataan orang/gelaran ➔ Frasa Nama.' },
  { text: 'pergi ke sekolah', category: 'FK', kataNafi: 'TIDAK', formula: 'TKA (Tidak + Kerja)', reason: 'Perbuatan "pergi" ➔ Frasa Kerja.' },
  { text: 'dari Johor', category: 'FSN', kataNafi: 'BUKAN', formula: 'BNS (Bukan + Sendi)', reason: 'Bermula dengan kata sendi "dari" ➔ Frasa Sendi Nama.' },
  { text: 'sangat tinggi', category: 'FA', kataNafi: 'TIDAK', formula: 'TKA (Tidak + Adjektif)', reason: 'Sifat ukuran "tinggi" ➔ Frasa Adjektif.' },
  { text: 'untuk abang', category: 'FSN', kataNafi: 'BUKAN', formula: 'BNS (Bukan + Sendi)', reason: 'Bermula dengan kata sendi "untuk" ➔ Frasa Sendi Nama.' },
  { text: 'tidur nyenyak', category: 'FK', kataNafi: 'TIDAK', formula: 'TKA (Tidak + Kerja)', reason: 'Perbuatan "tidur" ➔ Frasa Kerja.' },
  { text: 'manis rasanya', category: 'FA', kataNafi: 'TIDAK', formula: 'TKA (Tidak + Adjektif)', reason: 'Sifat deria rasa "manis" ➔ Frasa Adjektif.' },
  { text: 'malas, tetapi penat', category: 'PERTENTANGAN', kataNafi: 'BUKAN', formula: 'Kes Istimewa (...tetapi...)', reason: 'Terdapat unsur pertentangan (...tetapi...) ➔ BUKAN!' },
];

interface FormulaViewProps {
  onBack: () => void;
  onNext: () => void;
}

const FORMULA_AUDIO_URLS = {
  formula1Dan2: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019979/FORMULA-_1_dan_2.wav',
  kotakPenguji: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791033166/FORMULA-KOTAK_PENGUJI.wav',
};

export const FormulaView: React.FC<FormulaViewProps> = ({ onBack, onNext }) => {
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState(CONTOH_FRASA[0]);
  const [customInput, setCustomInput] = useState('');
  const [customResult, setCustomResult] = useState<{
    kataNafi: 'BUKAN' | 'TIDAK';
    formula: string;
    explanation: string;
  } | null>(null);

  const handlePlayAudio = (url: string, key: string) => {
    sounds.playPop();
    if (activeAudioKey === key) {
      sounds.stopAudioFile();
      setActiveAudioKey(null);
      return;
    }
    setActiveAudioKey(key);
    sounds.playAudioFile(url, () => {
      setActiveAudioKey(null);
    });
  };

  const handlePresetSelect = (item: typeof CONTOH_FRASA[0]) => {
    sounds.playPop();
    setSelectedPhrase(item);
    setCustomResult(null);
  };

  const handleCustomCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    sounds.playPop();
    const clean = customInput.trim().toLowerCase();

    // Heuristik Tatabahasa Melayu
    if (clean.includes('tetapi') || clean.includes('sebaliknya')) {
      const res = {
        kataNafi: 'BUKAN' as const,
        formula: 'Kes Istimewa (Pertentangan)',
        explanation: 'Dikesan perkataan pertentangan (tetapi/sebaliknya). Formula menetapkan penggunaan BUKAN.'
      };
      setCustomResult(res);
      sounds.playCorrect();
      return;
    }

    const sendiWords = ['di', 'ke', 'dari', 'daripada', 'untuk', 'kepada', 'pada', 'dengan', 'tentang', 'bagai', 'seperti'];
    const startsWithSendi = sendiWords.some(w => clean.startsWith(w + ' ') || clean === w);

    if (startsWithSendi) {
      const res = {
        kataNafi: 'BUKAN' as const,
        formula: 'B.N.S (Bukan + Sendi Nama)',
        explanation: `Perkataan bermula dengan kata sendi nama (${clean.split(' ')[0]}). Formula BNS menetapkan jawapan BUKAN.`
      };
      setCustomResult(res);
      sounds.playCorrect();
      return;
    }

    const adjWords = ['pandai', 'tinggi', 'cantik', 'bijak', 'masam', 'manis', 'pedas', 'panas', 'sejuk', 'besar', 'kecil', 'luas', 'sempit', 'malas', 'rajin', 'takut', 'berani', 'cepat', 'lambat', 'dalam', 'dangkal', 'jauh', 'dekat'];
    const hasAdj = adjWords.some(w => clean.includes(w));

    if (hasAdj) {
      const res = {
        kataNafi: 'TIDAK' as const,
        formula: 'T.K.A (Tidak + Adjektif)',
        explanation: 'Mengandungi kata adjektif (sifat atau keadaan). Formula TKA menetapkan jawapan TIDAK.'
      };
      setCustomResult(res);
      sounds.playCorrect();
      return;
    }

    const verbWords = ['makan', 'minum', 'tidur', 'pergi', 'balik', 'membaca', 'menulis', 'berlari', 'berjalan', 'memasak', 'bermain', 'membeli', 'menonton', 'duduk', 'bangun', 'melihat'];
    const hasVerb = verbWords.some(w => clean.includes(w));

    if (hasVerb) {
      const res = {
        kataNafi: 'TIDAK' as const,
        formula: 'T.K.A (Tidak + Kerja)',
        explanation: 'Mengandungi kata kerja (perbuatan atau tindakan). Formula TKA menetapkan jawapan TIDAK.'
      };
      setCustomResult(res);
      sounds.playCorrect();
      return;
    }

    const res = {
      kataNafi: 'BUKAN' as const,
      formula: 'B.N.S (Bukan + Nama)',
      explanation: 'Dikelaskan sebagai Frasa Nama (orang, benda, perkara). Formula BNS menetapkan jawapan BUKAN.'
    };
    setCustomResult(res);
    sounds.playCorrect();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner - Centered Title & Description */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 p-6 sm:p-8 border-3 border-slate-900 shadow-neo text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-neo-sm">
              Teknik Mudah Hafal
            </span>
            <span className="text-xs font-black text-slate-800">Formula Pantas &amp; Buku Interaktif</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight text-center">
            💡 Formula &amp; Buku Interaktif Kata Nafi
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-800 font-semibold leading-relaxed max-w-2xl text-center">
            Gunakan dua formula pantas di bawah dan selak <strong>Buku Interaktif</strong> untuk menguasai contoh ayat bagi setiap kategori dengan sebutan audio yang jelas!
          </p>

          {/* Butang Audio di bawah description (Hanya ikon audio sahaja) */}
          <button
            type="button"
            onClick={() => handlePlayAudio(FORMULA_AUDIO_URLS.formula1Dan2, 'formula1Dan2')}
            className={`mt-4 p-3 rounded-2xl border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              activeAudioKey === 'formula1Dan2' ? 'bg-orange-500 text-white shadow-neo-lg scale-105' : 'bg-white hover:bg-amber-100 text-slate-900'
            }`}
            title="Dengar Audio Formula 1 & 2"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUSUNAN 1: FORMULA 1 DAN FORMULA 2 (DILETAKKAN DI ATAS)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formula 1: BukanNama TidakKerjA */}
        <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 shadow-neo flex flex-col justify-between text-center">
          <div>
            <div className="flex flex-col items-center justify-center gap-2 mb-3 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-base shadow-neo-sm">
                  1
                </span>
                <h2 className="text-xl font-black font-heading text-slate-900 text-center">
                  Formula 1: "BukanNama TidakKerjA"
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold mb-4 text-center max-w-md mx-auto">
              Sebutan berirama bagi mengunci fungsi kedua-dua kata nafi:
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl bg-emerald-50 border-2 border-slate-900 p-4 shadow-neo-sm text-center">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-heading text-slate-900">
                    BukanNama
                  </span>
                  <span className="text-xs font-black bg-emerald-200 border border-slate-900 text-slate-900 px-2 py-0.5 rounded-md">
                    FN &amp; FSN
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold mt-1 text-center">
                  👉 <strong>Bukan</strong> untuk Frasa <strong>Nama</strong> (FN) dan Frasa Sendi <strong>Nama</strong> (FSN).
                </p>
                <p className="text-xs font-bold text-emerald-900 mt-2 bg-white p-2 rounded-xl border border-emerald-200 text-center">
                  Contoh: "Bukan meja" (FN) | "Bukan untuk saya" (FSN)
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 border-2 border-slate-900 p-4 shadow-neo-sm text-center">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-heading text-slate-900">
                    TidakKerjA
                  </span>
                  <span className="text-xs font-black bg-sky-200 border border-slate-900 text-slate-900 px-2 py-0.5 rounded-md">
                    FK &amp; FA
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold mt-1 text-center">
                  👉 <strong>Tidak</strong> untuk Frasa <strong>Kerja</strong> (K) &amp; Frasa <strong>Adjektif</strong> (A dalam Kerj<strong>A</strong>).
                </p>
                <p className="text-xs font-bold text-sky-900 mt-2 bg-white p-2 rounded-xl border border-sky-200 text-center">
                  Contoh: "Tidak tidur" (FK) | "Tidak masam" (FA)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">
            <span className="bg-amber-200 border border-slate-900 px-3 py-1 rounded-xl shadow-neo-sm text-slate-900 font-black">
              Irama Hafalan: "BukanNama, TidakKerjA!"
            </span>
          </div>
        </div>

        {/* Formula 2: B.N.S & T.K.A */}
        <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 shadow-neo flex flex-col justify-between text-center">
          <div>
            <div className="flex flex-col items-center justify-center gap-2 mb-3 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-orange-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-base shadow-neo-sm">
                  2
                </span>
                <h2 className="text-xl font-black font-heading text-slate-900 text-center">
                  Formula 2: "B.N.S" &amp; "T.K.A"
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold mb-4 text-center max-w-md mx-auto">
              Akronim huruf awal untuk pengecaman pantas dalam kuiz:
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl bg-emerald-50 border-2 border-slate-900 p-4 shadow-neo-sm text-center">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-emerald-500 border border-slate-900 text-slate-900 flex items-center justify-center font-black text-xs font-heading">
                      BNS
                    </span>
                    <span className="text-sm font-black text-slate-900 font-heading">
                      B.ukan + N.ama + S.endi Nama
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-medium text-center">
                  <span className="font-black text-slate-900 block mb-0.5">⚡ Nota Kilat:</span>
                  Perkataan selepas tempat kosong ialah benda/orang (<strong>Nama</strong>) atau perkataan seperti <em>di, ke, dari, untuk, kepada</em> (<strong>Sendi</strong>) ➔ Jawapan: <strong>BUKAN</strong>.
                </div>
              </div>

              <div className="rounded-2xl bg-sky-50 border-2 border-slate-900 p-4 shadow-neo-sm text-center">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-sky-400 border border-slate-900 text-slate-900 flex items-center justify-center font-black text-xs font-heading">
                      TKA
                    </span>
                    <span className="text-sm font-black text-slate-900 font-heading">
                      T.idak + K.erja + A.djektif
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-medium text-center">
                  <span className="font-black text-slate-900 block mb-0.5">⚡ Nota Kilat:</span>
                  Perkataan selepas tempat kosong ialah perbuatan (<strong>Kerja</strong>) atau sifat/keadaan (<strong>Adjektif</strong>) ➔ Jawapan: <strong>TIDAK</strong>.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">
            <span className="bg-orange-200 border border-slate-900 px-3 py-1 rounded-xl shadow-neo-sm text-slate-900 font-black">
              Kunci Pengecaman: "BNS untuk BUKAN, TKA untuk TIDAK"
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUSUNAN 2: BUKU INTERAKTIF (DI TENGAH)                                    */}
      {/* ========================================================================= */}
      <Flipbook />

      {/* ========================================================================= */}
      {/* SUSUNAN 3: KOTAK PENGUJI FORMULA AJAIB (DI BAWAH)                         */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-amber-50 border-3 border-slate-900 p-6 sm:p-8 shadow-neo text-center">
        <div className="flex flex-col items-center justify-center gap-3 mb-4 text-center">
          <div className="h-12 w-12 rounded-2xl bg-orange-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center shadow-neo-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-center">
              <h3 className="text-2xl font-black font-heading text-slate-900">
                Kotak Penguji Formula Ajaib
              </h3>
              <button
                type="button"
                onClick={() => handlePlayAudio(FORMULA_AUDIO_URLS.kotakPenguji, 'kotakPenguji')}
                className={`p-2 rounded-xl border-2 border-slate-900 shadow-neo-sm transition-all cursor-pointer ${
                  activeAudioKey === 'kotakPenguji' ? 'bg-orange-500 text-white shadow-neo' : 'bg-white hover:bg-amber-100 text-slate-900'
                }`}
                title="Dengar Kotak Penguji Formula Ajaib"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 text-center">
              Pilih contoh frasa yang disediakan atau taip perkataan anda sendiri untuk menguji padanan formula secara langsung!
            </p>
          </div>
        </div>

        {/* Pilihan Contoh Frasa Sedia Ada */}
        <div className="mb-5 text-center">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2 text-center">
            Pilih Contoh Frasa:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CONTOH_FRASA.map((item) => (
              <button
                key={item.text}
                type="button"
                onClick={() => {
                  handlePresetSelect(item);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer ${
                  selectedPhrase.text === item.text && !customResult
                    ? 'bg-orange-400 text-slate-900 shadow-neo-sm'
                    : 'bg-white text-slate-700 hover:bg-amber-100'
                }`}
              >
                <span>{item.text}</span>
                {selectedPhrase.text === item.text && !customResult && (
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ruang Input Taip Sendiri */}
        <form onSubmit={handleCustomCheck} className="mb-5 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Atau taip frasa anda sendiri di sini... (contoh: makan nasi, sangat comel, dari kedai)"
            className="flex-1 rounded-2xl bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 border-2 border-slate-900 focus:outline-hidden font-bold"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>Uji Formula</span>
          </button>
        </form>

        {/* Kad Keputusan Pengujian */}
        {customResult ? (
          <div className="rounded-2xl bg-white p-5 border-2 border-slate-900 shadow-neo-sm animate-in fade-in duration-150 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">Frasa Yang Diuji: "{customInput}"</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-slate-900 shadow-neo-sm ${
                  customResult.kataNafi === 'BUKAN' ? 'bg-emerald-300 text-slate-900' : 'bg-sky-300 text-slate-900'
                }`}>
                  Kata Nafi: {customResult.kataNafi}
                </span>
              </div>
            </div>
            <h4 className="text-lg font-black font-heading text-slate-900">
              Formula Sesuai: <span className="text-orange-600 underline">{customResult.formula}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              {customResult.explanation}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-5 border-2 border-slate-900 shadow-neo-sm text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">Frasa Terpilih: "{selectedPhrase.text}"</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-slate-900 shadow-neo-sm ${
                  selectedPhrase.kataNafi === 'BUKAN' ? 'bg-emerald-300 text-slate-900' : 'bg-sky-300 text-slate-900'
                }`}>
                  Gunakan: {selectedPhrase.kataNafi}
                </span>
              </div>
            </div>
            <h4 className="text-lg font-black font-heading text-slate-900">
              Formula Digunakan: <span className="text-orange-600 underline">{selectedPhrase.formula}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              {selectedPhrase.reason}
            </p>
          </div>
        )}
      </div>

      {/* Navigasi Footer - Centered hints */}
      <PageNavigationFooter
        onBack={() => {
          sounds.stopAudioFile();
          onBack();
        }}
        onNext={() => {
          sounds.stopAudioFile();
          onNext();
        }}
        backLabel="NOTA"
        backSubtext="Kembali ke Video & Nota Interaktif"
        nextLabel="KUIZ"
        nextSubtext="Mula Cabaran 4 Aras & Kuiz"
      />
    </div>
  );
};
