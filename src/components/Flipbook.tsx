import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, BookOpen, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface FlipbookPage {
  id: number;
  kataNafi: 'BUKAN' | 'TIDAK';
  phraseCategory: 'FN' | 'FSN' | 'FK' | 'FA';
  categoryLabel: string;
  subjek: string;
  kataNafiWord: string;
  frasa: string;
  sentence: string;
  emoji: string;
  explanation: string;
  tip: string;
  audioUrl: string;
}

export const FLIPBOOK_PAGES: FlipbookPage[] = [
  // 1. BUKAN + FN (Contoh 1)
  {
    id: 1,
    kataNafi: 'BUKAN',
    phraseCategory: 'FN',
    categoryLabel: 'Frasa Nama (FN)',
    subjek: 'Encik Megat',
    kataNafiWord: 'bukan',
    frasa: 'guru besar sekolah ini.',
    sentence: 'Encik Megat bukan guru besar sekolah ini.',
    emoji: '👨‍🏫',
    explanation: '"guru besar" ialah Frasa Nama yang merujuk kepada orang dan jawatan rasmi. Kata nafi BUKAN wajib hadir di hadapan Frasa Nama.',
    tip: 'Petua: Guru, murid, kereta, rumah, buku ialah kata nama (FN) ➔ guna BUKAN!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019966/FORMULA-encik_megat.wav'
  },
  // 2. BUKAN + FN (Contoh 2)
  {
    id: 2,
    kataNafi: 'BUKAN',
    phraseCategory: 'FN',
    categoryLabel: 'Frasa Nama (FN)',
    subjek: 'Bangunan putih yang tersergam itu',
    kataNafiWord: 'bukan',
    frasa: 'hospital daerah.',
    sentence: 'Bangunan putih yang tersergam itu bukan hospital daerah.',
    emoji: '🏥',
    explanation: '"hospital daerah" ialah Frasa Nama yang merujuk kepada tempat dan bangunan awam. Oleh itu, gunakan kata nafi BUKAN.',
    tip: 'Petua: Nama tempat, bangunan, kawasan ialah Frasa Nama (FN) ➔ guna BUKAN!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019964/FORMULA-_Bangunan_putih.wav'
  },
  // 3. BUKAN + FSN (Contoh 1)
  {
    id: 3,
    kataNafi: 'BUKAN',
    phraseCategory: 'FSN',
    categoryLabel: 'Frasa Sendi Nama (FSN)',
    subjek: 'Surat kiriman rasmi itu',
    kataNafiWord: 'bukan',
    frasa: 'daripada pihak majlis perbandaran.',
    sentence: 'Surat kiriman rasmi itu bukan daripada pihak majlis perbandaran.',
    emoji: '✉️',
    explanation: '"daripada pihak majlis perbandaran" ialah Frasa Sendi Nama yang dimulakan dengan kata sendi nama "daripada". Kata nafi BUKAN mesti digunakan.',
    tip: 'Petua: Bermula dengan kata sendi (di, ke, dari, daripada, untuk, kepada) ➔ guna BUKAN!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019962/FORMULA-surat_kriman_rasmi_itu.wav'
  },
  // 4. BUKAN + FSN (Contoh 2)
  {
    id: 4,
    kataNafi: 'BUKAN',
    phraseCategory: 'FSN',
    categoryLabel: 'Frasa Sendi Nama (FSN)',
    subjek: 'Bungkusan hadiah berbalut reben ini',
    kataNafiWord: 'bukan',
    frasa: 'untuk abang saya.',
    sentence: 'Bungkusan hadiah berbalut reben ini bukan untuk abang saya.',
    emoji: '🎁',
    explanation: '"untuk abang saya" ialah Frasa Sendi Nama kerana dimulakan dengan kata sendi "untuk". Gunakan kata nafi BUKAN di hadapannya.',
    tip: 'Petua: Kata sendi penentu tujuan atau sasaran (untuk, kepada) ➔ guna BUKAN!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791034702/FORMULA-Bungkusan_hadiah.wav'
  },
  // 5. TIDAK + FK
  {
    id: 5,
    kataNafi: 'TIDAK',
    phraseCategory: 'FK',
    categoryLabel: 'Frasa Kerja (FK)',
    subjek: 'Adik bongsu saya',
    kataNafiWord: 'tidak',
    frasa: 'menangis apabila disuntik oleh jururawat.',
    sentence: 'Adik bongsu saya tidak menangis apabila disuntik oleh jururawat.',
    emoji: '💉',
    explanation: '"menangis" ialah Frasa Kerja yang menunjukkan tindakan atau perlakuan emosi. Kata nafi yang tepat ialah TIDAK.',
    tip: 'Petua: Kata kerja tanpa imbuhan atau berimbuhan (menangis, ketawa) ➔ guna TIDAK!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019960/FORMULA-adik_bongsu_saya.wav'
  },
  // 6. TIDAK + FA
  {
    id: 6,
    kataNafi: 'TIDAK',
    phraseCategory: 'FA',
    categoryLabel: 'Frasa Adjektif (FA)',
    subjek: 'Air tasik buatan di taman itu',
    kataNafiWord: 'tidak',
    frasa: 'dalam seperti yang disangka.',
    sentence: 'Air tasik buatan di taman itu tidak dalam seperti yang disangka.',
    emoji: '🌊',
    explanation: '"dalam" ialah Frasa Adjektif yang menghuraikan sifat ukuran fizikal atau kedalaman. Gunakan kata nafi TIDAK.',
    tip: 'Petua: Sifat saiz atau ukuran (dalam, tinggi, besar, tebal, luas) ➔ guna TIDAK!',
    audioUrl: 'https://res.cloudinary.com/k9n0nsfr/video/upload/v1791019959/FORMULA-_Air_tasik_buatan.wav'
  }
];

export const Flipbook: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const currentPage = FLIPBOOK_PAGES[currentPageIndex];

  const handleNextPage = () => {
    sounds.playPageTurn();
    sounds.stopAudioFile();
    setIsPlayingAudio(false);
    setActiveWordIndex(null);
    if (currentPageIndex < FLIPBOOK_PAGES.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    sounds.playPageTurn();
    sounds.stopAudioFile();
    setIsPlayingAudio(false);
    setActiveWordIndex(null);
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleSelectPage = (index: number) => {
    sounds.playPageTurn();
    sounds.stopAudioFile();
    setIsPlayingAudio(false);
    setActiveWordIndex(null);
    setCurrentPageIndex(index);
  };

  const handlePlayAudio = (url: string) => {
    sounds.playPop();
    if (isPlayingAudio) {
      sounds.stopAudioFile();
      setIsPlayingAudio(false);
      return;
    }
    setActiveWordIndex(null);
    setIsPlayingAudio(true);
    sounds.playAudioFile(url, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleWordClick = (word: string, index: number) => {
    sounds.playPop();
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
    sounds.speakText(cleanWord);
    setActiveWordIndex(index);
    setTimeout(() => {
      setActiveWordIndex((prev) => (prev === index ? null : prev));
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Header Buku Interaktif - Centered Title & Description */}
      <div className="bg-amber-100 p-5 rounded-3xl border-3 border-slate-900 shadow-neo text-center">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-orange-400 border-2 border-slate-900 items-center justify-center text-2xl shadow-neo-sm mb-2">
          📖
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 text-center">
          Buku Interaktif Contoh Ayat
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-xl mx-auto text-center mt-1">
          Satu contoh ayat bagi setiap muka surat dengan sebutan audio jelas dan pecahan tatabahasa.
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-xs font-black bg-white px-3 py-1 rounded-xl border-2 border-slate-900 shadow-neo-sm text-slate-900">
            Muka Surat {currentPageIndex + 1} daripada {FLIPBOOK_PAGES.length}
          </span>
        </div>
      </div>

      {/* Ruang Paparan Halaman Buku */}
      <div className="relative rounded-3xl bg-white border-3 sm:border-4 border-slate-900 p-6 sm:p-8 shadow-neo-lg overflow-hidden">
        {/* Jalur Tulang Buku di Kiri */}
        <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-amber-400 to-amber-300 border-r-2 border-slate-900 hidden sm:block"></div>
        
        {/* Reben Penanda Buku */}
        <div className="absolute top-0 right-8 text-amber-500 hidden sm:block pointer-events-none">
          <Bookmark className="h-10 w-10 fill-amber-400 stroke-slate-900 stroke-2 drop-shadow-sm" />
        </div>

        {/* Kandungan Muka Surat Aktif */}
        <div className="sm:pl-6 space-y-6">
          {/* Tajuk Atas Muka Surat */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-neo-sm ${
                currentPage.kataNafi === 'BUKAN' 
                  ? 'bg-emerald-300 text-slate-900' 
                  : 'bg-sky-300 text-slate-900'
              }`}>
                KATA NAFI: {currentPage.kataNafi}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-amber-200 text-slate-900 border-2 border-slate-900 shadow-neo-sm">
                {currentPage.categoryLabel}
              </span>
            </div>

            <span className="text-xs font-black text-slate-500 tracking-wider uppercase">
              Muka Surat {currentPage.id}
            </span>
          </div>

          {/* Kotak Ayat Pilihan Utama & Butang Audio Ikon Sahaja di Bawah Ayat */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-sky-50 border-3 border-slate-900 p-5 sm:p-7 shadow-neo text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl mb-3">{currentPage.emoji}</div>
            
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 text-center">
              Contoh Ayat Penuh:
            </p>

            {/* Paparan Ayat - Murid boleh tekan setiap perkataan untuk dengar sebutan satu per satu */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-2">
              {currentPage.sentence.split(' ').map((word, wIdx) => {
                const isKataNafi = word.toLowerCase().includes(currentPage.kataNafiWord.toLowerCase());
                const isSpeakingThis = activeWordIndex === wIdx;
                return (
                  <button
                    key={wIdx}
                    type="button"
                    onClick={() => handleWordClick(word, wIdx)}
                    className={`text-lg sm:text-2xl md:text-3xl font-extrabold font-heading px-2 sm:px-3 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      isSpeakingThis
                        ? 'ring-4 ring-orange-500 scale-110 shadow-neo z-10'
                        : 'hover:scale-105 hover:-translate-y-0.5'
                    } ${
                      isKataNafi
                        ? currentPage.kataNafi === 'BUKAN'
                          ? 'bg-emerald-300 text-slate-900 border-2 border-slate-900 shadow-neo-sm underline decoration-slate-900'
                          : 'bg-sky-300 text-slate-900 border-2 border-slate-900 shadow-neo-sm underline decoration-slate-900'
                        : 'text-slate-900 bg-white/70 border border-slate-300 hover:border-slate-900 hover:bg-amber-100 shadow-xs'
                    }`}
                    title={`Tekan untuk dengar sebutan perkataan "${word}"`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-bold text-slate-500 mt-1 mb-2">
              💡 Tekan mana-mana perkataan di atas untuk sebut satu per satu!
            </p>

            {/* Butang Audio di Bawah Ayat - Hanya Ikon Audio Sahaja */}
            <button
              type="button"
              onClick={() => handlePlayAudio(currentPage.audioUrl)}
              className={`p-3 rounded-2xl border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                isPlayingAudio ? 'bg-orange-500 text-white scale-110 shadow-neo-lg' : 'bg-amber-300 hover:bg-amber-400 text-slate-900'
              }`}
              title="Dengar Sebutan Ayat Penuh"
            >
              <Volume2 className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Kad Pecahan Tatabahasa (Subjek + Kata Nafi + Frasa) - Tiada Butang Audio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Kotak 1: Subjek */}
            <div className="rounded-2xl bg-slate-50 p-3.5 border-2 border-slate-900 shadow-neo-sm text-left">
              <div className="mb-1">
                <span className="text-[10px] font-black uppercase text-slate-500">1. Subjek</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">{currentPage.subjek}</p>
            </div>

            {/* Kotak 2: Kata Nafi */}
            <div className={`rounded-2xl p-3.5 border-2 border-slate-900 shadow-neo-sm text-left ${
              currentPage.kataNafi === 'BUKAN' ? 'bg-emerald-100' : 'bg-sky-100'
            }`}>
              <div className="mb-1">
                <span className="text-[10px] font-black uppercase text-slate-700">2. Kata Nafi</span>
              </div>
              <p className="text-base font-black font-heading text-slate-900">
                {currentPage.kataNafi}
              </p>
            </div>

            {/* Kotak 3: Frasa Sasaran */}
            <div className="rounded-2xl bg-slate-50 p-3.5 border-2 border-slate-900 shadow-neo-sm text-left">
              <div className="mb-1">
                <span className="text-[10px] font-black uppercase text-slate-500">3. {currentPage.categoryLabel}</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">{currentPage.frasa}</p>
            </div>
          </div>

          {/* Sebab Kata Nafi Ini Digunakan - Tiada Butang Audio Huraian */}
          <div className="rounded-2xl bg-amber-50 p-4 border-2 border-slate-900 shadow-neo-sm text-left">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-900 uppercase">
                  Mengapa menggunakan "{currentPage.kataNafi}"?
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1">
                {currentPage.explanation}
              </p>
              <p className="text-[11px] font-bold text-amber-900 mt-1 italic">
                {currentPage.tip}
              </p>
            </div>
          </div>

          {/* Kawalan Navigasi Muka Surat Buku */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-slate-200">
            {/* Butang Muka Surat Sebelumnya (dengan bunyi selakan buku) */}
            <button
              type="button"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                currentPageIndex === 0
                  ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                  : 'bg-white text-slate-800 shadow-neo hover:bg-slate-50 active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>⬅️ Muka Surat Sebelumnya</span>
            </button>

            {/* Nombor Muka Surat (1 - 6) */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {FLIPBOOK_PAGES.map((pg, idx) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => handleSelectPage(idx)}
                  className={`h-8 w-8 rounded-xl text-xs font-black border-2 border-slate-900 transition-all shrink-0 flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                    currentPageIndex === idx
                      ? 'bg-amber-300 text-slate-900 shadow-neo-sm scale-105'
                      : 'bg-white text-slate-700 hover:bg-amber-50'
                  }`}
                  title={`Muka Surat ${idx + 1}: ${pg.kataNafi} + ${pg.phraseCategory}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Butang Muka Surat Seterusnya (dengan bunyi selakan buku) */}
            <button
              type="button"
              disabled={currentPageIndex === FLIPBOOK_PAGES.length - 1}
              onClick={handleNextPage}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                currentPageIndex === FLIPBOOK_PAGES.length - 1
                  ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                  : 'bg-amber-300 text-slate-900 shadow-neo hover:bg-amber-400 active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <span>Muka Surat Seterusnya ➡️</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
