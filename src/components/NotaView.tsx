import React, { useState } from 'react';
import { Volume2, CheckCircle2, AlertTriangle, Sparkles, HelpCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { PageNavigationFooter } from './PageNavigationFooter';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuickTestQuestion {
  id: number;
  sentence: string;
  expected: 'BUKAN' | 'TIDAK';
  reason: string;
  type: string;
}

const QUICK_TESTS: QuickTestQuestion[] = [
  {
    id: 1,
    sentence: 'Penyanyi itu _____ sombong walaupun terkenal.',
    expected: 'TIDAK',
    reason: '"sombong" ialah Frasa Adjektif (sifat/perwatakan). Gunakan TIDAK.',
    type: 'Frasa Adjektif'
  },
  {
    id: 2,
    sentence: 'Bangunan usang itu _____ hospital lama.',
    expected: 'BUKAN',
    reason: '"hospital lama" ialah Frasa Nama (tempat/benda). Gunakan BUKAN.',
    type: 'Frasa Nama'
  },
  {
    id: 3,
    sentence: 'Bungkusan coklat itu _____ daripada ibu.',
    expected: 'BUKAN',
    reason: '"daripada" ialah kata sendi nama. Gunakan BUKAN.',
    type: 'Frasa Sendi Nama'
  },
  {
    id: 4,
    sentence: 'Kami _____ sempat menziarahi datuk semalam.',
    expected: 'TIDAK',
    reason: '"sempat menziarahi" ialah Frasa Kerja (perbuatan). Gunakan TIDAK.',
    type: 'Frasa Kerja'
  },
  {
    id: 5,
    sentence: 'Dia _____ malas belajar, tetapi dia penat.',
    expected: 'BUKAN',
    reason: 'Ada unsur pertentangan (...tetapi...), jadi gunakan BUKAN!',
    type: 'Kes Istimewa'
  }
];

interface NotaViewProps {
  onBack: () => void;
  onNext: () => void;
}

const NOTA_AUDIO_URLS = {
  panduan: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019886/NOTA-Pengenalan.wav',
  bukanPenerangan: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019922/NOTA-_Pertama_kata_nafi_bukan.wav',
  bukanContohFN: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019920/NOTA-_contoh_1_bukan.wav',
  bukanContohFSN: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019918/NOTA-_contoh_2_bukan.wav',
  tidakPenerangan: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019945/NOTA-_Kedua_TIDAK.wav',
  tidakContohFK: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019944/NOTA-_Contoh_1_Tidak.wav',
  tidakContohFA: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019943/NOTA-_Contoh_2_TIdak.wav',
  kesIstimewaPenerangan: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019944/NOTA-_KES_ISTIMEWA.wav',
  kesIstimewaContoh: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019942/NOTA-_Contoh_Kes_Istimewa.wav',
  jadualPerbandingan: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019949/NOTA-_Jadual_perbandingan.wav',
};

export const NotaView: React.FC<NotaViewProps> = ({ onBack, onNext }) => {
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, 'BUKAN' | 'TIDAK'>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

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

  const handleAnswerTest = (id: number, answer: 'BUKAN' | 'TIDAK', expected: 'BUKAN' | 'TIDAK') => {
    setTestAnswers(prev => ({ ...prev, [id]: answer }));
    setRevealed(prev => ({ ...prev, [id]: true }));

    if (answer === expected) {
      sounds.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-200 via-emerald-200 to-sky-200 p-6 sm:p-8 border-3 border-slate-900 shadow-neo">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-neo-sm">
              Modul PdPC Bahasa Melayu
            </span>
            <span className="text-xs font-extrabold text-slate-800">KSSR Semakan</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Nota Interaktif: Mengenal <span className="text-orange-600 underline decoration-amber-400 decoration-3">Kata Nafi</span>
            </h1>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
            Kata nafi ialah perkataan yang digunakan untuk <strong>menafikan</strong> atau <strong>menyangkal</strong> sesuatu pernyataan dalam ayat Bahasa Melayu. Dua kata nafi utama ialah:{' '}
            <span className="inline-block bg-orange-400 border-2 border-slate-900 text-slate-900 font-black px-2.5 py-0.5 rounded-lg mx-1 shadow-neo-sm">
              BUKAN
            </span>{' '}
            dan{' '}
            <span className="inline-block bg-sky-300 border-2 border-slate-900 text-slate-900 font-black px-2.5 py-0.5 rounded-lg mx-1 shadow-neo-sm">
              TIDAK
            </span>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIDEO PENERANGAN SEBELUM PENERANGAN LEBIH LANJUT */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border-3 sm:border-4 border-slate-900 p-5 sm:p-7 shadow-neo space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-2xl shadow-neo-sm">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-slate-900 shadow-neo-sm">
                  Tonton Dahulu
                </span>
                <span className="text-xs font-bold text-slate-600">Video Penerangan Guru</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
                Video Pengenalan Kata Nafi (Bukan vs Tidak)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.panduan, 'panduan')}
            className={`p-2 rounded-xl border-2 border-slate-900 shadow-neo-sm transition-all cursor-pointer ${
              activeAudioKey === 'panduan' ? 'bg-orange-500 text-white shadow-neo' : 'bg-amber-100 hover:bg-amber-200 text-slate-900'
            }`}
            title="Dengar Panduan"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
          Tonton video di bawah untuk memahami konsep perbezaan kata nafi <strong>BUKAN</strong> dan <strong>TIDAK</strong> sebelum meneliti nota terperinci seterusnya.
        </p>

        {/* Video Player Box with Neobrutalism Frame */}
        <div className="relative rounded-2xl border-3 border-slate-900 overflow-hidden bg-slate-950 shadow-neo aspect-video max-w-4xl mx-auto flex items-center justify-center">
          <video
            src="https://res.cloudinary.com/k9n0nsfr/video/upload/v1790917767/IMG_2309.mp4"
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          >
            Penyemak imbas anda tidak menyokong tag video HTML5. Sila naik taraf pelayar anda.
          </video>
        </div>
      </div>

      {/* Two Pillars Grid: BUKAN vs TIDAK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Kata Nafi BUKAN */}
        <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 shadow-neo flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-2xl font-black shadow-neo-sm font-heading">
                  B
                </div>
                <div>
                  <h2 className="text-2xl font-black font-heading text-slate-900 flex items-center gap-2">
                    <span>Kata Nafi: BUKAN</span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.bukanPenerangan, 'bukanPenerangan')}
                      className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                        activeAudioKey === 'bukanPenerangan' ? 'bg-orange-500 text-white shadow-neo-sm' : 'bg-emerald-100 text-slate-700 hover:bg-emerald-200'
                      }`}
                      title="Dengar Penerangan Kata Nafi BUKAN"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </h2>
                  <p className="text-xs font-extrabold text-emerald-800">Untuk Frasa Nama &amp; Frasa Sendi Nama</p>
                </div>
              </div>
              <span className="bg-emerald-200 border-2 border-slate-900 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-neo-sm">
                FN + FSN
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mb-4 font-semibold">
              Digunakan khusus di hadapan <strong>Frasa Nama (FN)</strong> dan <strong>Frasa Sendi Nama (FSN)</strong>.
            </p>

            <div className="space-y-3">
              {/* Example FN */}
              <div className="rounded-2xl bg-emerald-50/80 p-4 border-2 border-slate-900 shadow-neo-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-900 bg-emerald-200 border border-slate-900 px-2 py-0.5 rounded-md">
                    1. Frasa Nama (FN)
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.bukanContohFN, 'bukanContohFN')}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                      activeAudioKey === 'bukanContohFN' ? 'bg-orange-500 text-white scale-105 shadow-neo-sm' : 'bg-white text-slate-700 hover:bg-emerald-100'
                    }`}
                    title="Dengar Bacaan Contoh Frasa Nama"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-extrabold text-slate-900">
                  "Saya <span className="bg-emerald-300 px-1.5 py-0.5 rounded-md border border-slate-900 text-slate-900">bukan</span> murid Tahun 6."
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  👉 <em>murid Tahun 6</em> ialah Frasa Nama (orang/murid).
                </p>
              </div>

              {/* Example FSN */}
              <div className="rounded-2xl bg-emerald-50/80 p-4 border-2 border-slate-900 shadow-neo-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-900 bg-emerald-200 border border-slate-900 px-2 py-0.5 rounded-md">
                    2. Frasa Sendi Nama (FSN)
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.bukanContohFSN, 'bukanContohFSN')}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                      activeAudioKey === 'bukanContohFSN' ? 'bg-orange-500 text-white scale-105 shadow-neo-sm' : 'bg-white text-slate-700 hover:bg-emerald-100'
                    }`}
                    title="Dengar Bacaan Contoh Frasa Sendi Nama"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-extrabold text-slate-900">
                  "Hadiah ini <span className="bg-emerald-300 px-1.5 py-0.5 rounded-md border border-slate-900 text-slate-900">bukan</span> daripada pengetua."
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  👉 <em>daripada pengetua</em> bermula kata sendi nama (di, ke, dari, daripada, untuk, kepada).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Kata Nafi TIDAK */}
        <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 shadow-neo flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-sky-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-2xl font-black shadow-neo-sm font-heading">
                  T
                </div>
                <div>
                  <h2 className="text-2xl font-black font-heading text-slate-900 flex items-center gap-2">
                    <span>Kata Nafi: TIDAK</span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.tidakPenerangan, 'tidakPenerangan')}
                      className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                        activeAudioKey === 'tidakPenerangan' ? 'bg-orange-500 text-white shadow-neo-sm' : 'bg-sky-100 text-slate-700 hover:bg-sky-200'
                      }`}
                      title="Dengar Penerangan Kata Nafi TIDAK"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </h2>
                  <p className="text-xs font-extrabold text-sky-800">Untuk Frasa Kerja &amp; Frasa Adjektif</p>
                </div>
              </div>
              <span className="bg-sky-200 border-2 border-slate-900 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-neo-sm">
                FK + FA
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mb-4 font-semibold">
              Digunakan khusus di hadapan <strong>Frasa Kerja (FK)</strong> dan <strong>Frasa Adjektif (FA)</strong>.
            </p>

            <div className="space-y-3">
              {/* Example FK */}
              <div className="rounded-2xl bg-sky-50/80 p-4 border-2 border-slate-900 shadow-neo-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-900 bg-sky-200 border border-slate-900 px-2 py-0.5 rounded-md">
                    1. Frasa Kerja (FK)
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.tidakContohFK, 'tidakContohFK')}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                      activeAudioKey === 'tidakContohFK' ? 'bg-orange-500 text-white scale-105 shadow-neo-sm' : 'bg-white text-slate-700 hover:bg-sky-100'
                    }`}
                    title="Dengar Bacaan Contoh Frasa Kerja"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-extrabold text-slate-900">
                  "Bapanya <span className="bg-sky-300 px-1.5 py-0.5 rounded-md border border-slate-900 text-slate-900">tidak</span> pergi ke sawah."
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  👉 <em>pergi</em> ialah Frasa Kerja (perbuatan / tindakan).
                </p>
              </div>

              {/* Example FA */}
              <div className="rounded-2xl bg-sky-50/80 p-4 border-2 border-slate-900 shadow-neo-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-900 bg-sky-200 border border-slate-900 px-2 py-0.5 rounded-md">
                    2. Frasa Adjektif (FA)
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.tidakContohFA, 'tidakContohFA')}
                    className={`p-1.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                      activeAudioKey === 'tidakContohFA' ? 'bg-orange-500 text-white scale-105 shadow-neo-sm' : 'bg-white text-slate-700 hover:bg-sky-100'
                    }`}
                    title="Dengar Bacaan Contoh Frasa Adjektif"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-extrabold text-slate-900">
                  "Air sungai itu <span className="bg-sky-300 px-1.5 py-0.5 rounded-md border border-slate-900 text-slate-900">tidak</span> dalam seperti yang disangka."
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  👉 <em>dalam</em> ialah Frasa Adjektif (sifat / ukuran).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Exception Banner: KES ISTIMEWA */}
      <div className="rounded-3xl bg-amber-100 border-3 border-slate-900 p-6 sm:p-7 shadow-neo">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-neo-sm shrink-0 mt-1">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-300 border border-slate-900 px-2.5 py-0.5 rounded-md">
                  Penting: Pengecualian Tatabahasa
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-1">
                  Kes Istimewa: Unsur Pertentangan (...tetapi...)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.kesIstimewaPenerangan, 'kesIstimewaPenerangan')}
                className={`self-start sm:self-auto p-2 rounded-xl border-2 border-slate-900 shadow-neo-sm transition-all cursor-pointer ${
                  activeAudioKey === 'kesIstimewaPenerangan' ? 'bg-orange-500 text-white shadow-neo' : 'bg-white text-slate-900 hover:bg-amber-50'
                }`}
                title="Dengar Penerangan Kes Istimewa"
              >
                <Volume2 className="h-4 w-4 text-amber-700" />
              </button>
            </div>

            <div className="w-full text-center py-1">
              <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed text-center max-w-2xl mx-auto">
                Kata nafi <strong>"BUKAN"</strong> <span className="text-amber-950 font-black underline decoration-slate-900">BOLEH</span> hadir di hadapan <em>Frasa Kerja (FK)</em> atau <em>Frasa Adjektif (FA)</em> jika terdapat unsur pertentangan maklumat yang jelas (disertai kata hubung <strong>...tetapi...</strong>).
              </p>
            </div>

            {/* Butang Audio Bagi Kedua-dua Contoh Kes Istimewa (Hanya Ikon Audio Sahaja) */}
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.kesIstimewaContoh, 'kesIstimewaContoh')}
                className={`p-2 rounded-xl border-2 border-slate-900 shadow-neo-sm transition-all cursor-pointer ${
                  activeAudioKey === 'kesIstimewaContoh' ? 'bg-orange-500 text-white shadow-neo' : 'bg-white text-slate-900 hover:bg-amber-50'
                }`}
                title="Dengar Contoh Kes Istimewa"
              >
                <Volume2 className="h-4 w-4 text-amber-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-neo-sm">
                <div className="mb-1">
                  <span className="text-xs font-bold text-slate-500">Contoh 1 (Pertentangan FA)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">
                  "Dia <span className="text-orange-600 underline">bukan</span> malas belajar, <span className="bg-amber-200 border border-slate-900 px-1 rounded">tetapi</span> dia penat."
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-neo-sm">
                <div className="mb-1">
                  <span className="text-xs font-bold text-slate-500">Contoh 2 (Pertentangan FA)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">
                  "Beliau <span className="text-orange-600 underline">bukan</span> sahaja cantik, <span className="bg-amber-200 border border-slate-900 px-1 rounded">tetapi</span> bijak."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-3xl bg-white border-3 border-slate-900 shadow-neo overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black font-heading text-slate-900 flex items-center gap-2">
              <span>📋</span> Jadual Perbandingan Modul Nota
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Rujukan padat pantas untuk murid</p>
          </div>
          <button
            type="button"
            onClick={() => handlePlayAudio(NOTA_AUDIO_URLS.jadualPerbandingan, 'jadualPerbandingan')}
            className={`p-2 rounded-xl border-2 border-slate-900 shadow-neo-sm transition-all cursor-pointer ${
              activeAudioKey === 'jadualPerbandingan' ? 'bg-orange-500 text-white shadow-neo' : 'bg-white text-slate-900 hover:bg-slate-50'
            }`}
            title="Dengar Jadual"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900">
              <tr>
                <th className="py-3 px-4 sm:px-6">Parameter</th>
                <th className="py-3 px-4 sm:px-6 text-emerald-950 bg-emerald-100/60">Kata Nafi: BUKAN</th>
                <th className="py-3 px-4 sm:px-6 text-sky-950 bg-sky-100/60">Kata Nafi: TIDAK</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-semibold">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 sm:px-6 font-bold text-slate-900">Pasangan Frasa</td>
                <td className="py-3 px-4 sm:px-6 text-emerald-950 bg-emerald-50/40">
                  Frasa Nama (FN) &amp; Frasa Sendi Nama (FSN)
                </td>
                <td className="py-3 px-4 sm:px-6 text-sky-950 bg-sky-50/40">
                  Frasa Kerja (FK) &amp; Frasa Adjektif (FA)
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 sm:px-6 font-bold text-slate-900">Kata Kunci Penanda</td>
                <td className="py-3 px-4 sm:px-6 bg-emerald-50/40">
                  Benda, Orang, Jawatan, Kata Sendi (<em>di, ke, dari, daripada, untuk, kepada</em>)
                </td>
                <td className="py-3 px-4 sm:px-6 bg-sky-50/40">
                  Perbuatan, Tindakan, Sifat / Keadaan (<em>tinggi, pandai, sejuk, marah, pantas</em>)
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 sm:px-6 font-bold text-slate-900">Kes Istimewa</td>
                <td className="py-3 px-4 sm:px-6 bg-emerald-50/40 font-bold text-amber-900">
                  Boleh hadir di hadapan FK/FA jika ada pertentangan (<em>...tetapi...</em>)
                </td>
                <td className="py-3 px-4 sm:px-6 bg-sky-50/40 text-slate-500">
                  Tiada pengecualian pertentangan
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Interactive Self-Test Section */}
      <div className="rounded-3xl bg-amber-50 border-3 border-slate-900 p-6 sm:p-7 shadow-neo">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-300 border-2 border-slate-900 text-slate-900 shadow-neo-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-black font-heading text-slate-900">
                Uji Minda
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Pilih BUKAN atau TIDAK untuk melengkapkan ayat.</p>
            </div>
          </div>
          <span className="text-xs font-black text-slate-900 bg-amber-200 border-2 border-slate-900 px-3 py-1 rounded-full shadow-neo-sm">
            5 Soalan
          </span>
        </div>

        <div className="space-y-3.5">
          {QUICK_TESTS.map((q) => {
            const isAnswered = revealed[q.id];
            const isCorrect = testAnswers[q.id] === q.expected;

            return (
              <div key={q.id} className="rounded-2xl bg-white p-4 border-2 border-slate-900 shadow-neo-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md">
                    Kategori: {q.type}
                  </span>
                </div>

                <p className="text-base font-bold text-slate-900">
                  {q.sentence}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleAnswerTest(q.id, 'BUKAN', q.expected)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                      isAnswered && q.expected === 'BUKAN'
                        ? 'bg-emerald-400 text-slate-900 shadow-neo-sm'
                        : isAnswered && testAnswers[q.id] === 'BUKAN' && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-100 text-slate-900 hover:bg-emerald-200'
                    }`}
                  >
                    BUKAN
                  </button>

                  <button
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleAnswerTest(q.id, 'TIDAK', q.expected)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                      isAnswered && q.expected === 'TIDAK'
                        ? 'bg-sky-400 text-slate-900 shadow-neo-sm'
                        : isAnswered && testAnswers[q.id] === 'TIDAK' && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-sky-100 text-slate-900 hover:bg-sky-200'
                    }`}
                  >
                    TIDAK
                  </button>

                  {isAnswered && (
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-black">
                          <CheckCircle2 className="h-4 w-4" /> Betul!
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-black">
                          <HelpCircle className="h-4 w-4" /> SALAH! Jawapan tepat ialah: {q.expected}
                        </span>
                      )}
                      <span className="text-slate-600 font-semibold">| {q.reason}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Navigation Footer: Back to Dashboard, Next to Formula */}
      <PageNavigationFooter
        onBack={onBack}
        onNext={onNext}
        backLabel="HALAMAN UTAMA"
        backSubtext="Kembali ke Dashboard Murid"
        nextLabel="FORMULA"
        nextSubtext="Buka Buku & Formula"
      />
    </div>
  );
};
