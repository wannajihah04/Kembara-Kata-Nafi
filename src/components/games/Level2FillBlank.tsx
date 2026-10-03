import React, { useState } from 'react';
import { LEVEL_2_QUESTIONS, shuffleArray } from '../../data/kataNafiData';
import { Question, KataNafiType } from '../../types';
import { Heart, Volume2, RotateCcw, ArrowRight, Award, CheckCircle2, XCircle, ArrowLeft, Star } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { ConfirmModal } from '../ConfirmModal';
import confetti from 'canvas-confetti';

interface Level2FillBlankProps {
  onComplete: (score: number, remainingLives: number) => void;
  onBackToHub: () => void;
  onResetLevel?: () => void;
}

export const Level2FillBlank: React.FC<Level2FillBlankProps> = ({ onComplete, onBackToHub, onResetLevel }) => {
  // Susun soalan secara rawak tulen tanpa selang-seli
  const [questions, setQuestions] = useState<Question[]>(() => shuffleArray(LEVEL_2_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<KataNafiType | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentQ: Question = questions[currentIndex];

  const handleSpeak = () => {
    sounds.playPop();
    sounds.speakText(currentQ.audioPrompt);
  };

  const handleChoose = (ans: KataNafiType) => {
    if (feedback || gameOver || gameFinished) return;

    sounds.playPop();
    setSelectedAnswer(ans);
    const isCorrect = ans === currentQ.answer;

    if (isCorrect) {
      sounds.playCorrect();
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 1.0 }
      });
      setFeedback({
        isCorrect: true,
        explanation: currentQ.explanation
      });
    } else {
      sounds.playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      const nextLives = lives - 1;
      setLives(nextLives);
      setFeedback({
        isCorrect: false,
        explanation: currentQ.explanation
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
    setSelectedAnswer(null);
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
      sounds.playVictory();
      onComplete(score, lives);
    }
  };

  const handleExecuteReset = () => {
    setConfirmModalOpen(false);
    onResetLevel?.();
    setQuestions(shuffleArray(LEVEL_2_QUESTIONS));
    setCurrentIndex(0);
    setLives(3);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setGameOver(false);
    setGameFinished(false);
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  const renderSentenceWithBlank = () => {
    const parts = currentQ.sentence.split('_____');
    return (
      <p className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-relaxed">
        {parts[0]}
        <span className={`inline-block px-3.5 py-1 rounded-2xl mx-1 font-black border-2 border-slate-900 transition-all ${
          selectedAnswer
            ? selectedAnswer === currentQ.answer
              ? 'bg-emerald-300 text-slate-900 shadow-neo-sm'
              : 'bg-rose-300 text-slate-900 shadow-neo-sm'
            : 'bg-amber-200 border-dashed text-slate-800'
        }`}>
          {selectedAnswer || '_____'}
        </span>
        {parts[1]}
      </p>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Aras 2"
        message="Adakah anda pasti mahu menetapkan semula skor permainan Aras 2 kepada 0?"
        subMessage="Hanya skor Aras 2 sahaja yang akan direset kepada nilai asal (0)."
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
              🔄 Skor Aras 2 telah berjaya ditetapkan semula kepada 0 (asal)!
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

      {/* Top Status */}
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
            <span>✍️</span> Aras 2: Isi Tempat Kosong
          </h2>
          <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
            Soalan {currentIndex + 1} daripada {questions.length}
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
            Skor: <span className="text-base text-orange-700 font-extrabold">{score}</span> / {questions.length}
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

      {!gameOver && !gameFinished ? (
        <div className={`space-y-6 ${shaking ? 'animate-shake' : ''}`}>
          <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-neo">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-200 border-2 border-slate-900 px-3 py-1 rounded-full shadow-neo-sm">
                Kategori: {currentQ.categoryLabel}
              </span>
              <button
                type="button"
                onClick={handleSpeak}
                className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-slate-900 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Dengar Pembacaan Suara"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            <div className="my-6 p-6 rounded-2xl bg-amber-50 border-2 border-slate-900 shadow-neo-sm">
              {renderSentenceWithBlank()}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleChoose('BUKAN')}
                className={`p-5 rounded-2xl font-black font-heading text-2xl transition-all shadow-neo active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 border-3 border-slate-900 ${
                  selectedAnswer === 'BUKAN'
                    ? selectedAnswer === currentQ.answer
                      ? 'bg-emerald-400 text-slate-900'
                      : 'bg-rose-400 text-slate-900'
                    : 'bg-emerald-300 hover:bg-emerald-400 text-slate-900'
                }`}
              >
                <span>BUKAN</span>
                {feedback && currentQ.answer === 'BUKAN' && (
                  <CheckCircle2 className="h-6 w-6 text-slate-900 stroke-[2.5]" />
                )}
              </button>

              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => handleChoose('TIDAK')}
                className={`p-5 rounded-2xl font-black font-heading text-2xl transition-all shadow-neo active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 border-3 border-slate-900 ${
                  selectedAnswer === 'TIDAK'
                    ? selectedAnswer === currentQ.answer
                      ? 'bg-sky-400 text-slate-900'
                      : 'bg-rose-400 text-slate-900'
                    : 'bg-sky-300 hover:bg-sky-400 text-slate-900'
                }`}
              >
                <span>TIDAK</span>
                {feedback && currentQ.answer === 'TIDAK' && (
                  <CheckCircle2 className="h-6 w-6 text-slate-900 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>

          {/* Feedback Box */}
          {feedback && (
            <div
              className={`p-5 rounded-3xl border-3 border-slate-900 shadow-neo animate-in slide-in-from-bottom-2 duration-150 ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-slate-900'
                  : 'bg-rose-100 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5 stroke-[2.5]" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-700 shrink-0 mt-0.5 stroke-[2.5]" />
                  )}
                  <div>
                    <h4 className="text-lg font-black font-heading">
                      {feedback.isCorrect ? 'Tahniah, Jawapan Tepat!' : `SALAH! Jawapan Sebenar ialah ${currentQ.answer}!`}
                    </h4>
                    <p className="text-xs sm:text-sm mt-1 font-semibold leading-relaxed">
                      {feedback.explanation}
                    </p>
                  </div>
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
            Nyawa Terputus!
          </h3>
          <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
            Jangan gusar! Anda sempat menjawab <strong>{score}</strong> soalan dengan betul.
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
            Hebat! Selesai Aras 2!
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto">
            Anda melengkapkan semua soalan dengan skor{' '}
            <strong className="text-orange-600 font-black">{score} / {LEVEL_2_QUESTIONS.length}</strong>.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Selesai &amp; Buka Aras 3</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
