import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, RotateCcw, Volume2, Sparkles, Trophy, 
  HelpCircle, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Dices
} from 'lucide-react';

interface SnakeLaddersGameProps {
  onBackToHub: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  expected: 'BUKAN' | 'TIDAK';
  explanation: string;
  type: string;
}

// 5 Soalan khusus yang ditetapkan oleh pengguna
const SNAKE_LADDER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Baju merah itu ________ milik Ali.',
    expected: 'BUKAN',
    explanation: '"milik Ali" ialah Frasa Nama yang merujuk kepada pemilikan/kata nama. Gunakan BUKAN.',
    type: 'Frasa Nama / Pemilikan'
  },
  {
    id: 2,
    question: 'Adik ________ menangis apabila diberi ais krim.',
    expected: 'TIDAK',
    explanation: '"menangis" ialah Frasa Kerja (perbuatan / tindakan). Gunakan TIDAK.',
    type: 'Frasa Kerja'
  },
  {
    id: 3,
    question: 'Hadiah ini ________ untuk kamu, melainkan untuk kakak.',
    expected: 'BUKAN',
    explanation: '"untuk kamu" ialah Frasa Sendi Nama kerana bermula dengan kata sendi "untuk". Gunakan BUKAN.',
    type: 'Frasa Sendi Nama'
  },
  {
    id: 4,
    question: 'Cuaca pada hari ini ________ panas sangat.',
    expected: 'TIDAK',
    explanation: '"panas sangat" ialah Frasa Adjektif yang menghuraikan sifat atau keadaan suhu. Gunakan TIDAK.',
    type: 'Frasa Adjektif'
  },
  {
    id: 5,
    question: 'Encik Ramli ________ seorang doktor, tetapi beliau ialah seorang guru.',
    expected: 'BUKAN',
    explanation: 'Terdapat unsur pertentangan yang nyata dengan kata hubung "...tetapi...". Wajib gunakan BUKAN!',
    type: 'Kes Istimewa (Pertentangan)'
  }
];

// Definisi Tangga & Ular di atas papan 30 petak
const LADDERS: Record<number, number> = {
  4: 14,
  12: 22,
  19: 28,
};

const SNAKES: Record<number, number> = {
  16: 6,
  24: 13,
  29: 18,
};

// Petak Soalan Kuiz (Petak 5, 9, 15, 20, 25)
const QUESTION_TILES: Record<number, number> = {
  5: 1, // question id 1
  9: 2, // question id 2
  15: 3, // question id 3
  20: 4, // question id 4
  25: 5, // question id 5
};

export const SnakeLaddersGame: React.FC<SnakeLaddersGameProps> = ({ onBackToHub }) => {
  // Posisi pemain (1 hingga 30)
  const [player1Pos, setPlayer1Pos] = useState<number>(1);
  const [player2Pos, setPlayer2Pos] = useState<number>(1);
  const [turn, setTurn] = useState<1 | 2>(1); // 1 = Pemain 1, 2 = Pemain 2

  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameLog, setGameLog] = useState<string>('Pemain 1 (🦁 Sang Singa) mula dahulu! Tekan butang baling dadu.');

  // Modal Soalan Kuiz
  const [activeQuestion, setActiveQuestion] = useState<{
    q: QuizQuestion;
    forPlayer: 1 | 2;
    fromTile: number;
  } | null>(null);

  const [questionFeedback, setQuestionFeedback] = useState<{
    isCorrect: boolean;
    chosen: 'BUKAN' | 'TIDAK';
    message: string;
  } | null>(null);

  // Winner state
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  // Restart board
  const handleRestart = () => {
    sounds.playPop();
    setPlayer1Pos(1);
    setPlayer2Pos(1);
    setTurn(1);
    setDiceValue(1);
    setWinner(null);
    setActiveQuestion(null);
    setQuestionFeedback(null);
    setGameLog('Permainan ditetapkan semula. Pemain 1 mula dahulu!');
  };

  // Roll Dice Logic
  const handleRollDice = () => {
    if (isRolling || winner || activeQuestion) return;

    setIsRolling(true);
    sounds.playDiceRoll();

    // Visual roll flicker
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls >= 8) {
        clearInterval(interval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDice);
        setIsRolling(false);
        movePlayer(turn, finalDice);
      }
    }, 80);
  };

  // Move Player
  const movePlayer = (player: 1 | 2, steps: number) => {
    const currentPos = player === 1 ? player1Pos : player2Pos;
    let targetPos = currentPos + steps;

    if (targetPos > 30) {
      // Bounce back if overshoot
      const excess = targetPos - 30;
      targetPos = 30 - excess;
      setGameLog(`Pemain ${player} terlajak! Mengundur ke petak ${targetPos}.`);
    }

    if (player === 1) setPlayer1Pos(targetPos);
    else setPlayer2Pos(targetPos);

    sounds.playPop();

    // Check Win
    if (targetPos === 30) {
      setWinner(player);
      sounds.playVictory();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setGameLog(`🎉 TAHNIAH! Pemain ${player} berjaya sampai ke garisan tamat petak 30!`);
      return;
    }

    // Check Question Tile
    if (QUESTION_TILES[targetPos]) {
      const qId = QUESTION_TILES[targetPos];
      const q = SNAKE_LADDER_QUESTIONS.find(item => item.id === qId) || SNAKE_LADDER_QUESTIONS[0];
      setTimeout(() => {
        setActiveQuestion({ q, forPlayer: player, fromTile: targetPos });
      }, 500);
      return;
    }

    // Check Ladder
    if (LADDERS[targetPos]) {
      const ladderTo = LADDERS[targetPos];
      setTimeout(() => {
        sounds.playLadderClimb();
        if (player === 1) setPlayer1Pos(ladderTo);
        else setPlayer2Pos(ladderTo);
        setGameLog(`🪜 Hebat! Pemain ${player} memanjat tangga dari petak ${targetPos} ke petak ${ladderTo}!`);
        switchTurn();
      }, 500);
      return;
    }

    // Check Snake
    if (SNAKES[targetPos]) {
      const snakeTo = SNAKES[targetPos];
      setTimeout(() => {
        sounds.playSnakeBite();
        if (player === 1) setPlayer1Pos(snakeTo);
        else setPlayer2Pos(snakeTo);
        setGameLog(`🐍 Alamak! Pemain ${player} dipatuk ular dari petak ${targetPos} dan menggelongsor ke petak ${snakeTo}!`);
        switchTurn();
      }, 500);
      return;
    }

    // Normal move finished
    setGameLog(`Pemain ${player} mendapat angka ${steps} dan berada di petak ${targetPos}.`);
    switchTurn();
  };

  const switchTurn = () => {
    setTurn(prev => (prev === 1 ? 2 : 1));
  };

  // Answer Quiz Question Modal
  const handleAnswerQuestion = (answer: 'BUKAN' | 'TIDAK') => {
    if (!activeQuestion) return;

    const isCorrect = answer === activeQuestion.q.expected;
    const player = activeQuestion.forPlayer;

    if (isCorrect) {
      sounds.playCorrect();
      confetti({ particleCount: 40, spread: 60 });
      setQuestionFeedback({
        isCorrect: true,
        chosen: answer,
        message: `Tepat sekali! ${activeQuestion.q.explanation} Hadiah: Mara 2 petak ke hadapan!`
      });

      // Bonus step: advance 2 tiles!
      setTimeout(() => {
        const curr = player === 1 ? player1Pos : player2Pos;
        const newPos = Math.min(30, curr + 2);
        if (player === 1) setPlayer1Pos(newPos);
        else setPlayer2Pos(newPos);

        setActiveQuestion(null);
        setQuestionFeedback(null);
        if (newPos === 30) {
          setWinner(player);
          sounds.playVictory();
        } else {
          switchTurn();
        }
      }, 2200);
    } else {
      sounds.playWrong();
      setQuestionFeedback({
        isCorrect: false,
        chosen: answer,
        message: `Kurang tepat. Jawapan sebenar ialah ${activeQuestion.q.expected}. ${activeQuestion.q.explanation} Anda kekal di petak ini.`
      });

      setTimeout(() => {
        setActiveQuestion(null);
        setQuestionFeedback(null);
        switchTurn();
      }, 2500);
    }
  };

  // Generate board grid (30 tiles: 5 rows x 6 cols)
  // Row 5 (top): 30 29 28 27 26 25
  // Row 4:       19 20 21 22 23 24
  // Row 3:       18 17 16 15 14 13
  // Row 2:        7  8  9 10 11 12
  // Row 1 (bot):  6  5  4  3  2  1
  const renderBoardTiles = () => {
    const rows = [
      [30, 29, 28, 27, 26, 25],
      [19, 20, 21, 22, 23, 24],
      [18, 17, 16, 15, 14, 13],
      [7, 8, 9, 10, 11, 12],
      [6, 5, 4, 3, 2, 1],
    ];

    return (
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5 max-w-2xl mx-auto w-full">
        {rows.map((row, rIdx) =>
          row.map((num) => {
            const hasP1 = player1Pos === num;
            const hasP2 = player2Pos === num;
            const isLadderStart = LADDERS[num] !== undefined;
            const isSnakeStart = SNAKES[num] !== undefined;
            const isQuestion = QUESTION_TILES[num] !== undefined;
            const isGoal = num === 30;
            const isStart = num === 1;

            return (
              <div
                key={num}
                className={`relative aspect-square rounded-2xl border-2 sm:border-3 border-slate-900 p-1.5 flex flex-col justify-between items-center transition-all ${
                  isGoal
                    ? 'bg-gradient-to-br from-amber-300 via-yellow-200 to-emerald-300 shadow-neo'
                    : isStart
                    ? 'bg-emerald-100'
                    : isQuestion
                    ? 'bg-amber-100 hover:bg-amber-200'
                    : isLadderStart
                    ? 'bg-sky-100'
                    : isSnakeStart
                    ? 'bg-rose-100'
                    : num % 2 === 0
                    ? 'bg-white'
                    : 'bg-slate-50'
                } shadow-neo-sm`}
              >
                {/* Tile Number Header */}
                <div className="w-full flex items-center justify-between text-[11px] font-black text-slate-800">
                  <span>{num}</span>
                  {isGoal && <span className="text-xs">🏆</span>}
                  {isQuestion && <span className="text-orange-600 font-extrabold">❓</span>}
                  {isLadderStart && <span className="text-xs">🪜➔{LADDERS[num]}</span>}
                  {isSnakeStart && <span className="text-xs">🐍➔{SNAKES[num]}</span>}
                </div>

                {/* Middle Symbol */}
                <div className="text-xs sm:text-sm font-black text-slate-400 select-none">
                  {isStart ? 'MULA' : isGoal ? 'TAMAT' : isQuestion ? 'KUIZ' : ''}
                </div>

                {/* Player Pawns */}
                <div className="flex items-center justify-center gap-1 z-10">
                  {hasP1 && (
                    <span
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-sm shadow-neo-sm animate-bounce"
                      title="Pemain 1: Sang Singa"
                    >
                      🦁
                    </span>
                  )}
                  {hasP2 && (
                    <span
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-sky-400 border-2 border-slate-900 flex items-center justify-center text-sm shadow-neo-sm animate-bounce"
                      title="Pemain 2: Sang Belang"
                    >
                      🐯
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border-3 border-slate-900 shadow-neo">
        <button
          type="button"
          onClick={onBackToHub}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 hover:bg-slate-100 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Kuiz</span>
        </button>

        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-300 border border-slate-900 text-[10px] font-black uppercase shadow-neo-sm mb-1">
            <Sparkles className="h-3 w-3" />
            <span>2 Pemain · Mod Santai Tanpa Markah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            🎲 Ular &amp; Tangga Kata Nafi
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold text-center mt-1 leading-relaxed">
            Permainan ular tangga digital interaktif untuk 2 pemain. Baling dadu, panjat tangga, elak patukan ular dan jawab 5 cabaran soalan kuiz kata nafi di petak terpilih untuk menentukan langkah seterusnya. Mod santai tanpa tekanan markah!
          </p>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 bg-rose-100 hover:bg-rose-200 text-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          title="Mula Semula"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Mula Semula</span>
        </button>
      </div>

      {/* 2. Status Pemain & Baling Dadu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Pemain 1 Card */}
        <div
          className={`p-4 rounded-3xl border-3 border-slate-900 transition-all ${
            turn === 1 && !winner
              ? 'bg-amber-300 shadow-neo scale-102 ring-4 ring-orange-400'
              : 'bg-white shadow-neo-sm opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700">Pemain 1</span>
            {turn === 1 && !winner && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black animate-pulse">
                GILIRAN ANDA
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-3xl">🦁</span>
            <div>
              <p className="text-sm font-black font-heading text-slate-900">Sang Singa</p>
              <p className="text-xs font-extrabold text-slate-600">Petak: {player1Pos} / 30</p>
            </div>
          </div>
        </div>

        {/* Dice Roller Button in Center */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-amber-50 border-3 border-slate-900 shadow-neo">
          <button
            type="button"
            disabled={isRolling || winner !== null || activeQuestion !== null}
            onClick={handleRollDice}
            className={`w-20 h-20 rounded-2xl border-3 border-slate-900 flex items-center justify-center text-3xl font-black font-heading shadow-neo transition-all ${
              isRolling
                ? 'bg-orange-300 animate-spin cursor-not-allowed'
                : 'bg-white hover:bg-amber-200 active:translate-x-1 active:translate-y-1 cursor-pointer'
            }`}
            title="Klik untuk baling dadu"
          >
            {diceValue}
          </button>

          <button
            type="button"
            disabled={isRolling || winner !== null || activeQuestion !== null}
            onClick={handleRollDice}
            className="mt-3 px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            {isRolling ? 'Membaling...' : 'BALING DADU 🎲'}
          </button>
        </div>

        {/* Pemain 2 Card */}
        <div
          className={`p-4 rounded-3xl border-3 border-slate-900 transition-all ${
            turn === 2 && !winner
              ? 'bg-sky-300 shadow-neo scale-102 ring-4 ring-sky-500'
              : 'bg-white shadow-neo-sm opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700">Pemain 2</span>
            {turn === 2 && !winner && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black animate-pulse">
                GILIRAN ANDA
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-3xl">🐯</span>
            <div>
              <p className="text-sm font-black font-heading text-slate-900">Sang Belang</p>
              <p className="text-xs font-extrabold text-slate-600">Petak: {player2Pos} / 30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Pergerakan Terkini */}
      <div className="p-3 rounded-2xl bg-white border-2 border-slate-900 shadow-neo-sm text-xs font-bold text-slate-800 text-center flex items-center justify-center gap-2">
        <span>📢</span>
        <span>{gameLog}</span>
      </div>

      {/* 3. Papan Permainan Ular & Tangga (30 Petak) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border-3 border-slate-900 shadow-neo">
        {renderBoardTiles()}

        {/* Legend */}
        <div className="mt-4 pt-3 border-t-2 border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-md bg-sky-200 border border-slate-900"></span>
            <span>Tangga 🪜 (Naik ke atas)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-md bg-rose-200 border border-slate-900"></span>
            <span>Ular 🐍 (Gelongsor ke bawah)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-md bg-amber-200 border border-slate-900"></span>
            <span>❓ Kuiz Kata Nafi (Jawab betul mara 2 petak!)</span>
          </div>
        </div>
      </div>

      {/* 4. MODAL SOALAN KUIZ KATA NAFI */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border-3 border-slate-900 shadow-neo text-center animate-in zoom-in-95 duration-200">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo mb-3">
              ❓
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black uppercase mb-3">
              <span>Cabaran Petak Kuiz</span>
              <span>·</span>
              <span>Pemain {activeQuestion.forPlayer} ({activeQuestion.forPlayer === 1 ? '🦁' : '🐯'})</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mb-2">
              Lengkapkan Ayat dengan Kata Nafi yang Tepat:
            </h3>

            <div className="my-5 p-5 rounded-2xl bg-amber-50 border-2 border-slate-900 shadow-neo-sm relative">
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
                "{activeQuestion.q.question}"
              </p>
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-amber-200">
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Kategori: {activeQuestion.q.type}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speakText(activeQuestion.q.question)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-black border border-slate-900 shadow-neo-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                  title="Dengar sebutan soalan"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Dengar Ayat</span>
                </button>
              </div>
            </div>

            {/* Pilihan Jawapan: BUKAN vs TIDAK */}
            {!questionFeedback ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswerQuestion('BUKAN')}
                  className="py-3 px-4 rounded-2xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-base font-black font-heading border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  BUKAN
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerQuestion('TIDAK')}
                  className="py-3 px-4 rounded-2xl bg-sky-300 hover:bg-sky-400 text-slate-900 text-base font-black font-heading border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  TIDAK
                </button>
              </div>
            ) : (
              <div
                className={`p-4 rounded-2xl border-2 border-slate-900 shadow-neo-sm animate-in fade-in ${
                  questionFeedback.isCorrect ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-black text-sm mb-1">
                  {questionFeedback.isCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 stroke-[3]" />
                      <span>JAWAPAN TEPAT! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-600 stroke-[3]" />
                      <span>JAWAPAN KURANG TEPAT!</span>
                    </>
                  )}
                </div>
                <p className="text-xs font-semibold">{questionFeedback.message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODAL TAHNIAH PEMENANG */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 border-3 border-slate-900 shadow-neo text-center animate-in zoom-in-95 duration-200">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-amber-300 border-3 border-slate-900 flex items-center justify-center text-5xl shadow-neo mb-3">
              🏆
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Tahniah Pemain {winner}!
            </h2>
            <p className="text-sm font-extrabold text-orange-600 mt-1">
              {winner === 1 ? '🦁 Sang Singa' : '🐯 Sang Belang'} Berjaya Menjuarai Permainan!
            </p>

            <p className="text-xs font-semibold text-slate-600 my-4">
              Hebat! Anda berdua telah bermain dengan baik dan mengulang kaji kata nafi secara santai.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Main Semula 🔄
              </button>
              <button
                type="button"
                onClick={onBackToHub}
                className="px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Kembali ke Kuiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
