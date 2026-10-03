import React, { useState } from 'react';
import { Student } from '../types';
import { PageNavigationFooter } from './PageNavigationFooter';
import { TeacherPortrait } from './TeacherPortrait';
import { ConfirmModal } from './ConfirmModal';
import { 
  Sparkles, Heart, Flame, Award, BookOpen, Gamepad2, 
  CheckCircle2, Circle, ArrowRight, TrendingUp, BarChart2, Star,
  RotateCcw, Zap
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { TypewriterText } from './common/TypewriterText';

interface DashboardOverviewProps {
  currentStudent: Student;
  onGoToNota: () => void;
  onGoToNotaKilat: () => void;
  onGoToFormula: () => void;
  onGoToGames: () => void;
  onGoToRodaBertuah: () => void;
  onBackToModeSelect: () => void;
  onResetScores?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentStudent,
  onGoToNota,
  onGoToNotaKilat,
  onGoToFormula,
  onGoToGames,
  onGoToRodaBertuah,
  onBackToModeSelect,
  onResetScores,
}) => {
  const [showResetToast, setShowResetToast] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Dynamic Stars calculation (Max 12 stars across Level 1 - 4; resets to 0 when scores are reset)
  const calcStars = (score: number) => (score >= 7 ? 3 : score >= 5 ? 2 : score >= 1 ? 1 : 0);
  const totalStars =
    calcStars(currentStudent.scoreL1) +
    calcStars(currentStudent.scoreL2) +
    calcStars(currentStudent.scoreL3) +
    calcStars(currentStudent.scoreL4);

  // Interactive Daily Learning Tasks Checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Baca penerangan BUKAN (FN & FSN) dan TIDAK (FK & FA)', done: true },
    { id: 2, text: 'Kuasai Kes Istimewa: Unsur Pertentangan (...tetapi...)', done: true },
    { id: 3, text: 'Uji perkataan dalam Kotak Penguji Formula Ajaib', done: false },
    { id: 4, text: 'Lengkapkan Aras 1: Gerabak Kereta Api (8 Soalan)', done: currentStudent.scoreL1 >= 6 },
    { id: 5, text: 'Lengkapkan Aras 2: Isi Tempat Kosong (8 Soalan)', done: currentStudent.scoreL2 >= 6 },
    { id: 6, text: 'Capai kombo 3x dalam Cabaran 5 Saat', done: currentStudent.scoreBonus >= 6 },
  ]);

  const toggleTask = (id: number) => {
    sounds.playPop();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const levelProgress = [
    { label: 'Aras 1', name: 'Gerabak', score: currentStudent.scoreL1, max: 8, color: 'bg-emerald-400' },
    { label: 'Aras 2', name: 'Isi Tempat', score: currentStudent.scoreL2, max: 8, color: 'bg-sky-400' },
    { label: 'Aras 3', name: 'Padanan', score: currentStudent.scoreL3, max: 8, color: 'bg-amber-400' },
    { label: 'Aras 4', name: 'Silang Kata', score: currentStudent.scoreL4, max: 8, color: 'bg-purple-400' },
    { label: 'Bonus', name: 'Bonus Pantas', score: currentStudent.scoreBonus, max: 10, color: 'bg-rose-400' },
  ];

  const handleConfirmReset = () => {
    setConfirmModalOpen(false);
    onResetScores?.();
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Pengesahan Tetapkan Semula"
        message={`Adakah anda pasti mahu menetapkan semula semua markah untuk ${currentStudent.name} kepada 0 (nilai asal)?`}
        subMessage="Skor di halaman kuiz dan rekod pentaksiran guru murid ini akan dikembalikan kepada 0 secara individu."
        confirmLabel="Ya, Tetapkan Semula"
        cancelLabel="Batal"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmModalOpen(false)}
      />

      {/* Toast Notification when reset */}
      {showResetToast && (
        <div className="p-4 rounded-2xl bg-emerald-400 border-3 border-slate-900 shadow-neo flex items-center justify-between gap-3 text-slate-900 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-black">
              🔄 Semua markah murid {currentStudent.name} telah berjaya ditetapkan semula kepada 0 (asal)!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowResetToast(false)}
            className="text-xs font-black px-2 py-1 rounded-lg bg-white border border-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. SCENIC HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#93c5fd] border-3 border-slate-900 p-6 sm:p-8 shadow-neo text-white">
        {/* Cute Illustrated Rolling Hills in Banner */}
        <div className="absolute right-0 bottom-0 w-80 sm:w-96 h-28 pointer-events-none opacity-90">
          <svg viewBox="0 0 400 150" className="w-full h-full preserve-3d" fill="none">
            {/* Back Hill */}
            <path d="M120 150 C180 80, 260 80, 400 120 L400 150 Z" fill="#86efac" />
            {/* Front Hill */}
            <path d="M0 150 C80 90, 200 100, 400 150 Z" fill="#4ade80" />
          </svg>
        </div>

        {/* Clouds */}
        <div className="absolute top-3 right-20 w-20 h-7 bg-white/40 rounded-full blur-2xs pointer-events-none"></div>
        <div className="absolute top-8 right-60 w-16 h-6 bg-white/30 rounded-full blur-2xs pointer-events-none"></div>

        {/* Content with Large Featured Teacher Portrait */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 text-slate-900 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black mb-3 shadow-neo-sm">
              <span>👋 Helo, {currentStudent.name.split(' ')[0]}!</span>
              <span className="text-amber-500">★</span>
              <span>{currentStudent.avatar}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white drop-shadow-sm py-1">
              <TypewriterText
                text="Kembara Kata Nafi!"
                highlightText="Kata Nafi!"
                highlightClassName="text-amber-300 drop-shadow-md"
              />
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-sky-100 font-semibold leading-relaxed max-w-xl">
              Teruskan usaha anda hari ini untuk mencapai <strong>Tahap Penguasaan TP 6</strong> dalam Bahasa Melayu KSSR!
            </p>
          </div>

          {/* Gambar Cikgu Najihah: Saiz Sederhana, Background Transparent, Tiada Bingkai Gambar */}
          <div className="shrink-0 flex flex-col items-center">
            <TeacherPortrait size="md" className="drop-shadow-md" />
            <div className="mt-1.5 px-3 py-0.5 rounded-full bg-amber-300 border-2 border-slate-900 text-slate-900 text-xs font-black shadow-neo-sm tracking-wide">
              👩‍🏫 Cikgu Najihah
            </div>
          </div>
        </div>

        {/* Barisan 1: Butang Navigasi (NOTA, FORMULA, KUIZ, NOTA KILAT, RODA BERTUAH) */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          <button
            type="button"
            onClick={onGoToNota}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>NOTA</span>
          </button>

          <button
            type="button"
            onClick={onGoToFormula}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-sky-200 hover:bg-sky-300 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>FORMULA</span>
          </button>

          <button
            type="button"
            onClick={onGoToGames}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Gamepad2 className="h-4 w-4 text-emerald-600" />
            <span>KUIZ</span>
          </button>

          <button
            type="button"
            onClick={onGoToNotaKilat}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-orange-300 hover:bg-orange-400 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-amber-300 text-slate-900" />
            <span>NOTA KILAT</span>
          </button>

          <button
            type="button"
            onClick={onGoToRodaBertuah}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <span>🎡</span>
            <span>RODA BERTUAH</span>
          </button>
        </div>

        {/* Barisan 2: Butang Tetapkan Semula Di Barisan Bawah Tengah */}
        <div className="relative z-10 mt-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-200 hover:bg-rose-300 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula semua skor murid ini kepada 0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-700 stroke-[2.5]" />
            <span>TETAPKAN SEMULA</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC WIDGETS (3 Cards matching reference design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Widget 1: Skor & Gred */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Skor Terkumpul</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-900 text-xs font-bold">
              TP {currentStudent.tpLevel}
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-heading text-slate-900">
                {currentStudent.totalScore}
              </span>
              <span className="text-xs font-bold text-slate-500">/ 42 mata</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-900 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${currentStudent.percentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[11px] font-bold text-emerald-700">
            Peratus Penguasaan: {currentStudent.percentage}% {currentStudent.percentage >= 65 ? '(Cemerlang)' : '(Sederhana)'}
          </p>
        </div>

        {/* Widget 2: Siri Pembelajaran & Nyawa */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Baki Nyawa Kuiz</span>
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800 border border-slate-900 text-xs font-bold">
              3 Maksimum
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`h-7 w-7 ${
                    h <= currentStudent.remainingLives
                      ? 'text-rose-500 fill-rose-500 animate-pulse'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="text-lg font-black font-heading text-slate-900 ml-1">
                {currentStudent.remainingLives} Nyawa
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <div
                  key={d}
                  className="h-2 flex-1 rounded-full bg-orange-400 border border-slate-900"
                ></div>
              ))}
            </div>
          </div>
          <p className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
            <Flame className="h-3 w-3 fill-orange-500" />
            <span>Siri Latihan: 5 Hari Aktif</span>
          </p>
        </div>

        {/* Widget 3: Bintang Kejayaan - Nilai dinamik mengikut kuiz & reset kepada 0 */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Koleksi Bintang</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-slate-900 text-xs font-bold">
              4 Aras
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`h-6 w-6 ${
                    totalStars >= s * 4
                      ? 'text-amber-400 fill-amber-400'
                      : totalStars > 0
                      ? 'text-amber-300 fill-amber-100'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="text-2xl font-black font-heading text-slate-900 ml-2">
                {totalStars} Bintang
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              {totalStars === 0
                ? 'Selesaikan kuiz 4 aras untuk mengumpul 12 bintang!'
                : `${totalStars} daripada 12 bintang telah berjaya dikumpulkan!`}
            </p>
          </div>
          <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Star className={`h-3.5 w-3.5 ${totalStars > 0 ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
            <span>{totalStars > 0 ? 'Pencapaian Aktif' : 'Nilai Asal (0 Bintang)'}</span>
          </p>
        </div>
      </div>

      {/* 3. MAIN SPLIT CONTENT: Performance Chart (Left) + Learning To-Do Tasks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Bar Chart of Level Performances */}
        <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-neo space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-sky-600" />
                <span>Carta Kemajuan Aras Kata Nafi</span>
              </h2>
              <p className="text-xs text-slate-500">Prestasi markah anda mengikut aras kesukaran</p>
            </div>
            <span className="text-xs font-black bg-sky-100 border border-slate-900 px-2.5 py-1 rounded-full text-sky-900">
              KSSR Semakan
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div className="space-y-3.5 pt-2">
            {levelProgress.map((item) => {
              const pct = Math.round((item.score / item.max) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-[11px]">
                        {item.label}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono text-slate-700">
                      {item.score} / {item.max} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full border border-slate-900 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2 mt-4">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Petua Cemerlang: Pastikan anda menguasai Kes Istimewa (...tetapi...) untuk mendapat markah penuh dalam Aras 4!</span>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Learning To-Do List (Tasks) */}
        <div className="lg:col-span-5 rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-neo flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <span>📝</span> Misi Pembelajaran Harian
              </h2>
              <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {tasks.filter(t => t.done).length} / {tasks.length} Selesai
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-semibold">
              Tandakan misi yang telah anda selesaikan hari ini:
            </p>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 text-xs font-bold active:scale-98 ${
                    task.done
                      ? 'bg-emerald-50 border-emerald-400 text-slate-600 line-through'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-400 text-slate-800'
                  }`}
                >
                  {task.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1 leading-snug">{task.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Ganjaran: Lencana Bintang</span>
            <button
              type="button"
              onClick={onGoToGames}
              className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Main Sekarang</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. NAVIGATION FOOTER: Back (To Mode Select) and Next (To Nota) */}
      <PageNavigationFooter
        onBack={onBackToModeSelect}
        onNext={onGoToNota}
        backLabel="Pilihan Mod"
        backSubtext="Tukar ke Mod Guru / Murid"
        nextLabel="NOTA"
        nextSubtext="Tonton Video & Nota Pembelajaran"
      />
    </div>
  );
};
