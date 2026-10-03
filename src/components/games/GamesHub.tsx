import React, { useState } from 'react';
import { Level1Train } from './Level1Train';
import { Level2FillBlank } from './Level2FillBlank';
import { Level3Match } from './Level3Match';
import { Level4Crossword } from './Level4Crossword';
import { BonusSpeedRun } from './BonusSpeedRun';
import { SnakeLaddersGame } from './SnakeLaddersGame';
import { PageNavigationFooter } from '../PageNavigationFooter';
import { ConfirmModal } from '../ConfirmModal';
import { Student } from '../../types';
import { Star, ChevronRight, Zap, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface GamesHubProps {
  isTeacherMode: boolean;
  currentStudent?: Student;
  activeStudentName: string;
  onRecordGameResult: (level: 1 | 2 | 3 | 4 | 'bonus', score: number, lives: number) => void;
  onBack: () => void;
  onNext: () => void;
  onResetScores?: () => void;
  onResetGameLevel?: (level: 1 | 2 | 3 | 4 | 'bonus') => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  isTeacherMode,
  currentStudent,
  activeStudentName,
  onRecordGameResult,
  onBack,
  onNext,
  onResetScores,
  onResetGameLevel,
}) => {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 'bonus' | 'snakeladders' | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showRefreshToast, setShowRefreshToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Local fallback scores if currentStudent is not passed
  const [localScores, setLocalScores] = useState<Record<number | string, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    bonus: 0,
  });

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    mode: 'all' | 1 | 2 | 3 | 4 | 'bonus';
    title: string;
    message: string;
  }>({
    isOpen: false,
    mode: 'all',
    title: 'Tetapkan Semula',
    message: 'Adakah anda pasti mahu menetapkan semula skor kepada 0?',
  });

  const levelScores: Record<number | string, number> = {
    1: currentStudent ? currentStudent.scoreL1 : localScores[1],
    2: currentStudent ? currentStudent.scoreL2 : localScores[2],
    3: currentStudent ? currentStudent.scoreL3 : localScores[3],
    4: currentStudent ? currentStudent.scoreL4 : localScores[4],
    bonus: currentStudent ? currentStudent.scoreBonus : localScores.bonus,
  };

  const handleOpenLevel = (level: 1 | 2 | 3 | 4 | 'bonus') => {
    sounds.playPop();
    setActiveLevel(level);
  };

  const handleFinishLevel = (level: 1 | 2 | 3 | 4 | 'bonus', score: number, lives: number = 3) => {
    setLocalScores(prev => ({ ...prev, [level]: Math.max(prev[level] || 0, score) }));
    onRecordGameResult(level, score, lives);
  };

  const handleExecuteConfirmedReset = () => {
    const { mode } = confirmModalState;
    setConfirmModalState(prev => ({ ...prev, isOpen: false }));

    if (mode === 'all') {
      onResetScores?.();
      setLocalScores({ 1: 0, 2: 0, 3: 0, 4: 0, bonus: 0 });
      setRefreshKey(prev => prev + 1);
      setToastMessage('🔄 Semua skor kuiz anda telah berjaya ditetapkan semula kepada 0 (asal)!');
    } else {
      onResetGameLevel?.(mode);
      setLocalScores(prev => ({ ...prev, [mode]: 0 }));
      setRefreshKey(prev => prev + 1);
      const label = mode === 'bonus' ? 'Mod Bonus' : `Aras ${mode}`;
      setToastMessage(`🔄 Skor ${label} telah berjaya ditetapkan semula kepada 0 (asal)!`);
    }

    setShowRefreshToast(true);
    setTimeout(() => {
      setShowRefreshToast(false);
    }, 4000);
  };

  if (activeLevel === 1) {
    return (
      <div key={`level-1-${refreshKey}`}>
        <Level1Train 
          onComplete={(score, lives) => handleFinishLevel(1, score, lives)} 
          onBackToHub={() => setActiveLevel(null)}
          onResetLevel={() => onResetGameLevel?.(1)}
        />
      </div>
    );
  }
  if (activeLevel === 2) {
    return (
      <div key={`level-2-${refreshKey}`}>
        <Level2FillBlank 
          onComplete={(score, lives) => handleFinishLevel(2, score, lives)} 
          onBackToHub={() => setActiveLevel(null)}
          onResetLevel={() => onResetGameLevel?.(2)}
        />
      </div>
    );
  }
  if (activeLevel === 3) {
    return (
      <div key={`level-3-${refreshKey}`}>
        <Level3Match 
          onComplete={(score, lives) => handleFinishLevel(3, score, lives)} 
          onBackToHub={() => setActiveLevel(null)}
          onResetLevel={() => onResetGameLevel?.(3)}
        />
      </div>
    );
  }
  if (activeLevel === 4) {
    return (
      <div key={`level-4-${refreshKey}`}>
        <Level4Crossword 
          onComplete={(score, lives) => handleFinishLevel(4, score, lives)} 
          onBackToHub={() => setActiveLevel(null)}
          onResetLevel={() => onResetGameLevel?.(4)}
        />
      </div>
    );
  }
  if (activeLevel === 'bonus') {
    return (
      <div key={`level-bonus-${refreshKey}`}>
        <BonusSpeedRun 
          onComplete={(score) => handleFinishLevel('bonus', score, 3)} 
          onBackToHub={() => setActiveLevel(null)}
          onResetLevel={() => onResetGameLevel?.('bonus')}
        />
      </div>
    );
  }
  if (activeLevel === 'snakeladders') {
    return (
      <div key={`level-snakeladders-${refreshKey}`}>
        <SnakeLaddersGame onBackToHub={() => setActiveLevel(null)} />
      </div>
    );
  }

  const levels = [
    {
      level: 1 as const,
      title: 'Aras 1 (Rendah): Gerabak Kereta Api',
      desc: 'Padankan gerabak kata nafi dengan gerabak frasa asas.',
      icon: '🚂',
      color: 'from-emerald-400 to-teal-500',
      badgeColor: 'bg-emerald-200 text-slate-900 border-slate-900',
      totalQ: 8,
      unlocked: true,
    },
    {
      level: 2 as const,
      title: 'Aras 2 (Sederhana): Isi Tempat Kosong',
      desc: 'Pilih kata nafi yang betul untuk melengkapkan ayat.',
      icon: '✍️',
      color: 'from-sky-400 to-blue-500',
      badgeColor: 'bg-sky-200 text-slate-900 border-slate-900',
      totalQ: 8,
      unlocked: true,
    },
    {
      level: 3 as const,
      title: 'Aras 3 (Sederhana): Padanan Ayat',
      desc: 'Menyambung frasa kiri dan kanan mengikut konteks kata nafi.',
      icon: '🔗',
      color: 'from-amber-400 to-orange-500',
      badgeColor: 'bg-amber-200 text-slate-900 border-slate-900',
      totalQ: 8,
      unlocked: true,
    },
    {
      level: 4 as const,
      title: 'Aras 4 (Tinggi): Teka Silang Kata',
      desc: 'Mengisi petak melintang & menegak (termasuk kes istimewa pertentangan).',
      icon: '🧩',
      color: 'from-purple-400 to-indigo-500',
      badgeColor: 'bg-purple-200 text-slate-900 border-slate-900',
      totalQ: 8,
      unlocked: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        subMessage={confirmModalState.mode === 'all' ? 'Semua skor Aras 1 hingga Aras 4 serta Bonus untuk murid ini akan dikembalikan kepada 0.' : 'Hanya skor aras ini sahaja yang akan dikembalikan kepada nilai asal (0).'}
        confirmLabel="Ya, Tetapkan Semula"
        cancelLabel="Batal"
        onConfirm={handleExecuteConfirmedReset}
        onCancel={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notification when refreshed */}
      {showRefreshToast && (
        <div className="p-4 rounded-2xl bg-emerald-400 border-3 border-slate-900 shadow-neo flex items-center justify-between gap-3 text-slate-900 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-black">
              {toastMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRefreshToast(false)}
            className="text-xs font-black px-2 py-1 rounded-lg bg-white border border-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Banner Utama */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 p-6 sm:p-8 border-3 border-slate-900 shadow-neo flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-neo-sm">
              Pusat Cabaran Interaktif
            </span>
            <span className="bg-emerald-300 border border-slate-900 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full shadow-neo-sm">
              Boleh Jawab Berkali-kali
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
            🎮 Hub Permainan &amp; Kuiz Kata Nafi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
            Selesaikan 4 Aras Permainan silibus KSSR dan uji ketangkasan refleks dalam Mod Bonus 5 Saat!
          </p>

          {/* BUTANG TETAPKAN SEMULA */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setConfirmModalState({
                  isOpen: true,
                  mode: 'all',
                  title: 'Tetapkan Semula Semua Skor Kuiz',
                  message: `Adakah anda pasti mahu menetapkan semula semua markah kuiz untuk ${activeStudentName || 'murid ini'} kepada 0 (nilai asal)?`,
                });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-200 hover:bg-rose-300 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Tetapkan semula semua skor permainan murid kepada 0"
            >
              <RotateCcw className="h-4 w-4 stroke-[2.5] text-rose-700" />
              <span>Tetapkan Semula</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white p-4 border-2 border-slate-900 shadow-neo text-center shrink-0 w-full sm:w-auto">
            <p className="text-[10px] text-slate-500 font-black uppercase">Pemain Aktif:</p>
            <p className="text-sm sm:text-base font-black font-heading text-slate-900 my-0.5 truncate max-w-[200px]">
              {activeStudentName || 'Murid Cemerlang'}
            </p>
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="text-xs font-bold text-slate-700">3 Bintang Setiap Aras</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((item) => {
          const score = levelScores[item.level] || 0;
          const isDone = score > 0;
          const starsCount = score >= 7 ? 3 : score >= 5 ? 2 : score >= 1 ? 1 : 0;

          return (
            <div
              key={item.level}
              className="rounded-3xl border-3 border-slate-900 bg-white p-6 shadow-neo flex flex-col justify-between transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo-sm">
                      {item.icon}
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                        Aras {item.level}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 mt-1">
                        {item.title.split(':')[1] || item.title}
                      </h3>
                    </div>
                  </div>

                  {isDone && (
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s <= starsCount ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-4 leading-relaxed">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between text-xs font-bold bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-slate-600">Jumlah Soalan: {item.totalQ} soalan</span>
                  <span className="font-mono font-black text-slate-900">
                    Skor: {score} / {item.totalQ}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModalState({
                      isOpen: true,
                      mode: item.level,
                      title: `Tetapkan Semula Aras ${item.level}`,
                      message: `Adakah anda pasti mahu menetapkan semula skor Aras ${item.level} kepada 0 (nilai asal)?`,
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  title={`Tetapkan semula permainan Aras ${item.level} kepada 0`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Tetapkan Semula</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenLevel(item.level)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-neo-sm bg-amber-300 hover:bg-amber-400 text-slate-900 cursor-pointer"
                >
                  <span>{isDone ? 'Main Semula' : 'Mula Kuiz'}</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mod Bonus Istimewa Card */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-400 via-amber-300 to-pink-400 p-6 sm:p-7 border-3 border-slate-900 shadow-neo flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-neo-sm">
                MOD BONUS ISTIMEWA
              </span>
              <span className="text-xs font-black text-slate-900">Pemasa 5 Saat</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight mt-1">
              Cabaran Ketangkasan Pantas Kata Nafi!
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold max-w-lg mt-0.5">
              Uji daya ingatan spontan anda dengan 10 soalan pantas! Setiap soalan hanya diberi 5 saat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setConfirmModalState({
                isOpen: true,
                mode: 'bonus',
                title: 'Tetapkan Semula Mod Bonus',
                message: 'Adakah anda pasti mahu menetapkan semula skor Mod Bonus kepada 0 (nilai asal)?',
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-900 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula skor mod bonus kepada 0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-700 stroke-[2.5]" />
            <span>Tetapkan Semula</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenLevel('bonus')}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
            <span>Mula</span>
          </button>
        </div>
      </div>

      {/* Snake & Ladders: Ular & Tangga Kata Nafi (2 Pemain · Mod Santai Tanpa Markah) */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 p-6 sm:p-8 border-3 border-slate-900 shadow-neo flex flex-col items-center justify-center text-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-neo-sm">
            PERMAINAN DIGITAL 2 PEMAIN
          </span>
          <span className="bg-emerald-100 text-emerald-900 border border-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-neo-sm">
            Mod Santai · Tiada Markah
          </span>
          <span className="bg-amber-300 text-slate-900 border border-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-neo-sm">
            5 Soalan Kuiz Penentu
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl">🎲</span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
            Ular &amp; Tangga Kata Nafi
          </h2>
          <span className="text-3xl sm:text-4xl">🪜</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 font-semibold max-w-2xl leading-relaxed text-center mx-auto">
          Permainan ular tangga digital interaktif untuk 2 pemain. Baling dadu, panjat tangga, elak patukan ular dan jawab 5 cabaran soalan kuiz kata nafi di petak terpilih untuk menentukan langkah seterusnya. Mod santai tanpa tekanan markah!
        </p>

        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setActiveLevel('snakeladders');
          }}
          className="mt-2 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-black border-3 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span>Main Ular &amp; Tangga Sekarang 🎲</span>
        </button>
      </div>

      {/* Page Navigation Footer: Back to Formula, Next to Nota Kilat */}
      <PageNavigationFooter
        onBack={onBack}
        onNext={onNext}
        backLabel="FORMULA"
        backSubtext="Teknik Formula BNS & TKA"
        nextLabel="NOTA KILAT"
        nextSubtext="Infografik Bukan vs Tidak"
      />
    </div>
  );
};
