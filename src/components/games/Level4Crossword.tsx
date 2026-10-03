import React, { useState } from 'react';
import { LEVEL_4_CLUES, shuffleArray } from '../../data/kataNafiData';
import { CrosswordClue, KataNafiType } from '../../types';
import { Heart, Volume2, RotateCcw, Award, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { ConfirmModal } from '../ConfirmModal';
import confetti from 'canvas-confetti';

interface Level4CrosswordProps {
  onComplete: (score: number, remainingLives: number) => void;
  onBackToHub: () => void;
  onResetLevel?: () => void;
}

export const Level4Crossword: React.FC<Level4CrosswordProps> = ({ onComplete, onBackToHub, onResetLevel }) => {
  const [cluesList, setCluesList] = useState<CrosswordClue[]>(() => shuffleArray(LEVEL_4_CLUES));
  const [solvedClueIds, setSolvedClueIds] = useState<string[]>([]);
  const [activeClueId, setActiveClueId] = useState<string>(cluesList[0]?.id || LEVEL_4_CLUES[0].id);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const activeClue = cluesList.find(c => c.id === activeClueId) || cluesList[0] || LEVEL_4_CLUES[0];

  const handleSpeak = (text: string) => {
    sounds.playPop();
    sounds.speakText(text);
  };

  const handleAnswerClue = (ans: KataNafiType) => {
    if (solvedClueIds.includes(activeClue.id) || gameOver || gameFinished) return;

    sounds.playPop();
    const isCorrect = ans === activeClue.answer;

    if (isCorrect) {
      sounds.playCorrect();
      const newSolved = [...solvedClueIds, activeClue.id];
      setSolvedClueIds(newSolved);
      setScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        explanation: activeClue.explanation
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 1.0 }
      });

      if (newSolved.length === cluesList.length) {
        setGameFinished(true);
        sounds.playVictory();
        onComplete(score + 1, lives);
      } else {
        const nextUnsolved = cluesList.find(c => !newSolved.includes(c.id));
        if (nextUnsolved) {
          setTimeout(() => {
            setActiveClueId(nextUnsolved.id);
            setFeedback(null);
          }, 1200);
        }
      }
    } else {
      sounds.playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      const nextLives = lives - 1;
      setLives(nextLives);
      setFeedback({
        isCorrect: false,
        explanation: `SALAH! Jawapan tepat ialah ${activeClue.answer}. ${activeClue.explanation}`
      });

      if (nextLives <= 0) {
        setGameOver(true);
        onComplete(score, 0);
      }
    }
  };

  const handleExecuteReset = () => {
    setConfirmModalOpen(false);
    onResetLevel?.();
    const freshClues = shuffleArray(LEVEL_4_CLUES);
    setCluesList(freshClues);
    setSolvedClueIds([]);
    setActiveClueId(freshClues[0].id);
    setLives(3);
    setScore(0);
    setFeedback(null);
    setGameOver(false);
    setGameFinished(false);
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Aras 4"
        message="Adakah anda pasti mahu menetapkan semula skor silang kata Aras 4 kepada 0?"
        subMessage="Hanya skor Aras 4 sahaja yang akan direset kepada nilai asal (0)."
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
              🔄 Skor Aras 4 telah berjaya ditetapkan semula kepada 0 (asal)!
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

      {/* Top Bar */}
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
            <span>🧩</span> Aras 4: Teka Silang Kata Tatabahasa
          </h2>
          <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
            Selesaikan {solvedClueIds.length} daripada {LEVEL_4_CLUES.length} pembayang tatabahasa
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
            Skor: <span className="text-base text-orange-700 font-extrabold">{score}</span> / {LEVEL_4_CLUES.length}
          </div>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula silang kata aras ini"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tetapkan Semula</span>
          </button>
        </div>
      </div>

      {!gameOver && !gameFinished ? (
        <div className={`space-y-6 ${shaking ? 'animate-shake' : ''}`}>
          {/* Active Clue Focus Card */}
          <div className="rounded-3xl bg-amber-100 border-3 border-slate-900 p-6 sm:p-7 shadow-neo">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-orange-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-sm shadow-neo-sm">
                  #{activeClue.number}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white border border-slate-900 px-3 py-1 rounded-full shadow-neo-sm">
                  Arah: {activeClue.direction.toUpperCase()} · {activeClue.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSpeak(activeClue.clue)}
                className="p-2 rounded-xl bg-white text-slate-900 border-2 border-slate-900 hover:bg-amber-50 active:translate-x-0.5 active:translate-y-0.5 shadow-neo-sm transition-all cursor-pointer"
                title="Dengar Pembayang"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xl sm:text-2xl font-black font-heading text-slate-900 my-3 leading-snug">
              "{activeClue.clue}"
            </p>

            {solvedClueIds.includes(activeClue.id) ? (
              <div className="flex items-center gap-2 text-slate-900 bg-emerald-300 border-2 border-slate-900 py-3 px-4 rounded-2xl font-black text-sm shadow-neo-sm">
                <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                <span>Petak ini telah berjaya diselesaikan dengan perkataan: <strong>{activeClue.answer}</strong></span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAnswerClue('BUKAN')}
                  className="p-4 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black font-heading text-xl active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-neo border-3 border-slate-900 cursor-pointer"
                >
                  Isi: BUKAN (5 Huruf)
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerClue('TIDAK')}
                  className="p-4 rounded-2xl bg-sky-300 hover:bg-sky-400 text-slate-900 font-black font-heading text-xl active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-neo border-3 border-slate-900 cursor-pointer"
                >
                  Isi: TIDAK (5 Huruf)
                </button>
              </div>
            )}

            {feedback && (
              <div className={`mt-4 p-4 rounded-2xl text-xs font-bold border-2 border-slate-900 shadow-neo-sm ${
                feedback.isCorrect ? 'bg-emerald-200 text-slate-900' : 'bg-rose-200 text-slate-900'
              }`}>
                {feedback.explanation}
              </div>
            )}
          </div>

          {/* Clues List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Melintang */}
            <div className="rounded-3xl bg-white border-3 border-slate-900 p-5 shadow-neo">
              <h3 className="text-base font-black font-heading text-slate-900 mb-3 flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-300 border border-slate-900 text-slate-900 text-xs font-bold">➡</span>
                Pembayang Melintang
              </h3>
              <div className="space-y-2">
                {LEVEL_4_CLUES.filter(c => c.direction === 'melintang').map((c) => {
                  const isSolved = solvedClueIds.includes(c.id);
                  const isActive = activeClueId === c.id;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setActiveClueId(c.id);
                        setFeedback(null);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all text-xs flex items-start gap-2.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                        isActive
                          ? 'bg-amber-300 border-slate-900 shadow-neo-sm'
                          : isSolved
                          ? 'bg-emerald-50 border-slate-200 text-slate-500'
                          : 'bg-white border-slate-900 shadow-neo-sm hover:bg-amber-50'
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-md border border-slate-900 flex items-center justify-center font-black shrink-0 ${
                        isSolved ? 'bg-emerald-400 text-slate-900' : 'bg-slate-200 text-slate-900'
                      }`}>
                        {c.number}
                      </span>
                      <div className="flex-1">
                        <p className={`font-bold ${isSolved ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {c.clue}
                        </p>
                        {isSolved && (
                          <span className="text-[10px] font-black text-emerald-800 uppercase block mt-0.5">
                            ✓ {c.answer}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menegak */}
            <div className="rounded-3xl bg-white border-3 border-slate-900 p-5 shadow-neo">
              <h3 className="text-base font-black font-heading text-slate-900 mb-3 flex items-center gap-2">
                <span className="p-1 rounded-md bg-sky-200 border border-slate-900 text-slate-900 text-xs font-bold">⬇</span>
                Pembayang Menegak
              </h3>
              <div className="space-y-2">
                {LEVEL_4_CLUES.filter(c => c.direction === 'menegak').map((c) => {
                  const isSolved = solvedClueIds.includes(c.id);
                  const isActive = activeClueId === c.id;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setActiveClueId(c.id);
                        setFeedback(null);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all text-xs flex items-start gap-2.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                        isActive
                          ? 'bg-sky-200 border-slate-900 shadow-neo-sm'
                          : isSolved
                          ? 'bg-emerald-50 border-slate-200 text-slate-500'
                          : 'bg-white border-slate-900 shadow-neo-sm hover:bg-sky-50'
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-md border border-slate-900 flex items-center justify-center font-black shrink-0 ${
                        isSolved ? 'bg-emerald-400 text-slate-900' : 'bg-slate-200 text-slate-900'
                      }`}>
                        {c.number}
                      </span>
                      <div className="flex-1">
                        <p className={`font-bold ${isSolved ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {c.clue}
                        </p>
                        {isSolved && (
                          <span className="text-[10px] font-black text-emerald-800 uppercase block mt-0.5">
                            ✓ {c.answer}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
            Teka silang kata memerlukan ketelitian. Anda telah berjaya melengkapkan <strong>{score}</strong> petak dengan tepat!
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
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Ke Menu Utama
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-4xl shadow-neo">
            👑
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900">
            Luar Biasa! Master Silang Kata Kata Nafi!
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto">
            Semua pembayang aras tinggi termasuk kes istimewa telah berjaya diselesaikan dengan skor{' '}
            <strong className="text-orange-600 font-black">{score} / {LEVEL_4_CLUES.length}</strong>!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Kembali &amp; Buka Mod Bonus!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
