import React, { useState, useEffect, useRef } from 'react';
import { BONUS_QUESTIONS, shuffleArray } from '../../data/kataNafiData';
import { Question, KataNafiType } from '../../types';
import { Flame, RotateCcw, Award, CheckCircle2, Zap, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { ConfirmModal } from '../ConfirmModal';
import confetti from 'canvas-confetti';

interface BonusSpeedRunProps {
  onComplete: (score: number) => void;
  onBackToHub: () => void;
  onResetLevel?: () => void;
}

export const BonusSpeedRun: React.FC<BonusSpeedRunProps> = ({ onComplete, onBackToHub, onResetLevel }) => {
  const [questions, setQuestions] = useState<Question[]>(() => shuffleArray(BONUS_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQ: Question = questions[currentIndex];

  useEffect(() => {
    if (gameFinished || feedback) return;

    setTimeLeft(5.0);
    const interval = 100;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, gameFinished, feedback]);

  const handleTimeOut = () => {
    sounds.playWrong();
    setCombo(0);
    setFeedback({
      isCorrect: false,
      text: `SALAH! Masa telah tamat! Jawapan sebenar ialah ${currentQ.answer}.`
    });

    setTimeout(() => {
      advanceNext();
    }, 1200);
  };

  const handleAnswer = (ans: KataNafiType) => {
    if (feedback || gameFinished) return;
    if (timerRef.current) clearInterval(timerRef.current);

    sounds.playPop();
    const isCorrect = ans === currentQ.answer;

    if (isCorrect) {
      sounds.playCorrect();
      setScore(prev => prev + 1);
      const nextCombo = combo + 1;
      setCombo(nextCombo);

      if (nextCombo >= 3) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 1.0 }
        });
      }

      setFeedback({
        isCorrect: true,
        text: `Tepat! +1 Mata ${nextCombo >= 3 ? `🔥 Kombo x${nextCombo}!` : ''}`
      });
    } else {
      sounds.playWrong();
      setCombo(0);
      setFeedback({
        isCorrect: false,
        text: `SALAH! Jawapan sebenar ialah ${currentQ.answer}.`
      });
    }

    setTimeout(() => {
      advanceNext();
    }, 900);
  };

  const advanceNext = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
      sounds.playVictory();
      onComplete(score + (feedback?.isCorrect ? 0 : 0));
    }
  };

  const handleExecuteReset = () => {
    setConfirmModalOpen(false);
    onResetLevel?.();
    sounds.playPop();
    setQuestions(shuffleArray(BONUS_QUESTIONS));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(5.0);
    setFeedback(null);
    setGameFinished(false);
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  const timePercentage = Math.max(0, Math.min(100, (timeLeft / 5.0) * 100));

  const handleBack = () => {
    if (score > 0) {
      onComplete(score);
    }
    onBackToHub();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Mod Bonus"
        message="Adakah anda pasti mahu menetapkan semula skor Mod Bonus kepada 0?"
        subMessage="Hanya skor Mod Bonus sahaja yang akan direset kepada nilai asal (0)."
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
              🔄 Skor Mod Bonus telah berjaya ditetapkan semula kepada 0 (asal)!
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

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border-3 border-slate-900 shadow-neo">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-800 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Menu Kuiz</span>
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-heading text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
              <span>Mod Bonus (5 Saat)</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Soalan {currentIndex + 1} daripada {questions.length}
            </p>
          </div>
        </div>

        {/* Combo, Score, Tetapkan Semula & Maskot Header Penjuru Sebelah Kanan */}
        <div className="flex items-center gap-2 sm:gap-3">
          {combo >= 2 && (
            <div className="flex items-center gap-1 bg-orange-500 text-white px-2.5 sm:px-3 py-1 rounded-2xl text-xs font-black border-2 border-slate-900 shadow-neo-sm animate-pulse">
              <Flame className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span>KOMBO x{combo}</span>
            </div>
          )}

          <div className="bg-amber-300 px-3.5 py-1.5 rounded-2xl border-2 border-slate-900 shadow-neo-sm text-xs font-black text-slate-900">
            Skor: <span className="text-base text-orange-700 font-extrabold">{score}</span> / {questions.length}
          </div>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula soalan bonus ini"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tetapkan Semula</span>
          </button>
        </div>
      </div>

      {!gameFinished ? (
        <div className="space-y-4">
          {/* 5-Second Timer Bar */}
          <div className="w-full bg-slate-100 h-5 rounded-full border-2 border-slate-900 overflow-hidden p-0.5 shadow-neo-sm">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                timeLeft > 2.5 ? 'bg-emerald-400' : timeLeft > 1.2 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center px-1 text-xs font-black text-slate-700">
            <span>Pemasa Refleks:</span>
            <span className={`text-base font-mono font-black ${timeLeft <= 1.5 ? 'text-rose-600 scale-110' : 'text-slate-900'}`}>
              ⏱️ {timeLeft.toFixed(1)}s
            </span>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl bg-amber-100 border-3 border-slate-900 p-6 sm:p-8 shadow-neo text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white border border-slate-900 px-3 py-1 rounded-full inline-block shadow-neo-sm">
              Spontaneous Recall · Tindak Pantas!
            </span>

            <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 leading-snug py-4">
              "{currentQ.sentence}"
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleAnswer('BUKAN')}
                className="py-5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black font-heading text-2xl active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-neo border-3 border-slate-900 cursor-pointer"
              >
                BUKAN
              </button>
              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleAnswer('TIDAK')}
                className="py-5 rounded-2xl bg-sky-300 hover:bg-sky-400 text-slate-900 font-black font-heading text-2xl active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-neo border-3 border-slate-900 cursor-pointer"
              >
                TIDAK
              </button>
            </div>

            {feedback && (
              <div className={`p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 border-2 border-slate-900 shadow-neo-sm ${
                feedback.isCorrect ? 'bg-emerald-200 text-slate-900' : 'bg-rose-200 text-slate-900'
              }`}>
                {feedback.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : null}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-orange-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-4xl shadow-neo">
            ⚡
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900">
            Cabaran Bonus Selesai!
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto">
            Ketangkasan anda sangat hebat! Anda berjaya menjawab{' '}
            <strong className="text-orange-600 font-black">{score} / {questions.length}</strong> soalan dalam masa pantas.
          </p>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Ke Hub Permainan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
