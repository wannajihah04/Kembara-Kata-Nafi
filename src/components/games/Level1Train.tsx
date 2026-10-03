import React, { useState } from 'react';
import { LEVEL_1_CARRIAGES, shuffleArray } from '../../data/kataNafiData';
import { TrainCarriage, KataNafiType } from '../../types';
import { Heart, Volume2, RotateCcw, ArrowRight, Award, ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { ConfirmModal } from '../ConfirmModal';
import confetti from 'canvas-confetti';

interface Level1TrainProps {
  onComplete: (score: number, remainingLives: number) => void;
  onBackToHub: () => void;
  onResetLevel?: () => void;
}

export const Level1Train: React.FC<Level1TrainProps> = ({ onComplete, onBackToHub, onResetLevel }) => {
  // Susun soalan secara rawak tulen (bukan berselang-seli) supaya murid tidak menghafal pola jawapan
  const [carriages, setCarriages] = useState<TrainCarriage[]>(() => shuffleArray(LEVEL_1_CARRIAGES));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
    engine: KataNafiType;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentCarriage: TrainCarriage = carriages[currentIndex];

  const handleSpeak = (text: string) => {
    sounds.playPop();
    sounds.speakText(text);
  };

  const handleWhistle = () => {
    sounds.playWhistle();
  };

  const handleSelectEngine = (engine: KataNafiType) => {
    if (feedback?.show || gameOver || gameFinished) return;

    sounds.playPop();
    const isCorrect = engine === currentCarriage.correctEngine;

    if (isCorrect) {
      sounds.playCorrect();
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 1.0 }
      });
      setFeedback({
        show: true,
        isCorrect: true,
        message: `Tepat sekali! ${currentCarriage.explanation}`,
        engine
      });
    } else {
      sounds.playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      const nextLives = lives - 1;
      setLives(nextLives);

      setFeedback({
        show: true,
        isCorrect: false,
        message: `SALAH! Jawapan sebenar ialah ${currentCarriage.correctEngine}. ${currentCarriage.explanation}`,
        engine
      });

      if (nextLives <= 0) {
        setGameOver(true);
        onComplete(score, 0);
        return;
      }
    }
  };

  const handleNext = () => {
    sounds.playPop();
    setFeedback(null);
    if (currentIndex + 1 < carriages.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
      sounds.playVictory();
      onComplete(score + (feedback?.isCorrect ? 0 : 0), lives);
    }
  };

  const handleExecuteReset = () => {
    setConfirmModalOpen(false);
    onResetLevel?.();
    setCarriages(shuffleArray(LEVEL_1_CARRIAGES));
    setCurrentIndex(0);
    setLives(3);
    setScore(0);
    setFeedback(null);
    setGameOver(false);
    setGameFinished(false);
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Aras 1"
        message="Adakah anda pasti mahu menetapkan semula skor permainan Aras 1 kepada 0?"
        subMessage="Hanya skor Aras 1 sahaja yang akan direset kepada nilai asal (0)."
        confirmLabel="Ya, Tetapkan Semula"
        cancelLabel="Batal"
        onConfirm={handleExecuteReset}
        onCancel={() => setConfirmModalOpen(false)}
      />

      {/* Toast Notification when reset */}
      {showResetToast && (
        <div className="p-4 rounded-2xl bg-emerald-400 border-3 border-slate-900 shadow-neo flex items-center justify-between gap-3 text-slate-900 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-black">
              🔄 Skor Aras 1 telah berjaya ditetapkan semula kepada 0 (asal)!
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

      {/* Game Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-white border-3 border-slate-900 shadow-neo">
        <button
          type="button"
          onClick={onBackToHub}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-800 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Menu Kuiz</span>
        </button>

        <div className="text-center flex-1">
          <h2 className="text-lg sm:text-2xl font-black font-heading text-slate-900 flex items-center justify-center gap-2">
            <span>🚂</span> Aras 1: Gerabak Kereta Api
          </h2>
          <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
            Soalan {currentIndex + 1} daripada {carriages.length}
          </p>
        </div>

        {/* Lives, Score, Tetapkan Semula & Maskot Header Penjuru Sebelah Kanan */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-2xl border-2 border-slate-900 shadow-neo-sm">
            <span className="text-[11px] sm:text-xs font-black text-rose-800 mr-1">Nyawa:</span>
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500 scale-105'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="bg-amber-300 px-3 py-1.5 rounded-2xl border-2 border-slate-900 shadow-neo-sm text-xs font-black text-slate-900">
            Skor: <span className="text-base text-orange-700 font-extrabold">{score}</span> / {carriages.length}
          </div>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula soalan dan skor aras ini"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tetapkan Semula</span>
          </button>
        </div>
      </div>

      {/* Game Stage Area */}
      {!gameOver && !gameFinished ? (
        <div className={`space-y-6 ${shaking ? 'animate-shake' : ''}`}>
          {/* Visual Train Railway Stage */}
          <div className="relative rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 border-3 border-slate-900 p-6 sm:p-8 overflow-hidden shadow-neo">
            {/* Whistle sound button */}
            <button
              type="button"
              onClick={handleWhistle}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-black border-2 border-slate-900 shadow-neo-sm hover:bg-amber-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>📢 Bunyi Wisel</span>
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white border-2 border-slate-900 px-3 py-1 rounded-full inline-block mb-2 shadow-neo-sm">
                Padankan Gerabak Frasa ke Lokomotif Tepat
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-bold">
                Tentukan sama ada frasa ini perlu disambung ke Lokomotif <strong>BUKAN</strong> atau Lokomotif <strong>TIDAK</strong>.
              </p>
            </div>

            {/* Train Visual Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-4">
              <div className="relative w-full max-w-md rounded-3xl bg-amber-300 p-5 text-center border-3 border-slate-900 shadow-neo">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-slate-900 shadow-neo-sm">
                  Gerabak Muatan Frasa
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-900">
                    Frasa #{currentIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(currentCarriage.phrase)}
                    className="p-1.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-amber-100 shadow-neo-sm"
                    title="Dengar Frasa"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4">
                  <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
                    "... {currentCarriage.phrase}"
                  </p>
                </div>

                {/* Train Wheels */}
                <div className="flex justify-around -mb-8 pt-2">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-slate-700 shadow-inner"></div>
                  <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-slate-700 shadow-inner"></div>
                </div>
              </div>
            </div>

            {/* Railway Track Graphic */}
            <div className="w-full h-3 bg-slate-700 rounded-full my-6 flex justify-between px-4 items-center border border-slate-900">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="h-6 w-1.5 bg-amber-900 rounded-xs"></div>
              ))}
            </div>

            {/* Engines Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleSelectEngine('BUKAN')}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 border-3 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-75"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🚂</span>
                  <span className="text-2xl font-black font-heading tracking-wide">
                    BUKAN
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Untuk Frasa Nama (FN) &amp; Frasa Sendi (FSN)
                </span>
                <span className="text-[11px] font-black text-emerald-950 mt-1">
                  [ Formula: B.N.S ]
                </span>
              </button>

              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleSelectEngine('TIDAK')}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-sky-300 hover:bg-sky-400 text-slate-900 border-3 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-75"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🚂</span>
                  <span className="text-2xl font-black font-heading tracking-wide">
                    TIDAK
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Untuk Frasa Kerja (FK) &amp; Frasa Adjektif (FA)
                </span>
                <span className="text-[11px] font-black text-sky-950 mt-1">
                  [ Formula: T.K.A ]
                </span>
              </button>
            </div>
          </div>

          {/* Feedback Drawer */}
          {feedback && (
            <div
              className={`p-5 rounded-3xl border-3 border-slate-900 shadow-neo animate-in slide-in-from-bottom-2 duration-150 ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-slate-900'
                  : 'bg-rose-100 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black font-heading flex items-center gap-2">
                    {feedback.isCorrect ? '🎉 Syabas, Padanan Tepat!' : '⚠️ SALAH! Ingat formula tatabahasa semula.'}
                  </h4>
                  <p className="text-xs sm:text-sm mt-1 font-semibold leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap"
                >
                  <span>Seterusnya</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : gameOver ? (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo-sm">
            💔
          </div>
          <h3 className="text-2xl font-black font-heading text-rose-700">
            Nyawa Telah Habis!
          </h3>
          <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
            Jangan putus asa! Anda berjaya menjawab <strong>{score}</strong> soalan dengan betul.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-slate-900 max-w-sm mx-auto space-y-1.5 shadow-neo-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
              Skor &amp; Bintang Berjaya Dikira
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3].map((st) => (
                <Star
                  key={st}
                  className={`h-5 w-5 ${
                    st <= (score >= 7 ? 3 : score >= 5 ? 2 : score >= 1 ? 1 : 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
              <span className="text-sm font-black text-slate-900 ml-1">
                {score >= 7 ? 3 : score >= 5 ? 2 : score >= 1 ? 1 : 0} Bintang ({score} Mata)
              </span>
            </div>
            <p className="text-[11px] font-bold text-emerald-700">
              ✓ Semua skor &amp; bintang yang anda sempat jawab telah direkodkan.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tetapkan Semula</span>
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Ke Menu Utama
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-4xl shadow-neo">
            🏆
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900">
            Tahniah! Anda Berjaya Menamatkan Aras 1!
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto">
            Semua gerabak berjaya disambungkan dengan tepat! Skor anda ialah{' '}
            <strong className="text-orange-600 font-black">{score} / {LEVEL_1_CARRIAGES.length}</strong>.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Selesai &amp; Buka Aras 2</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

