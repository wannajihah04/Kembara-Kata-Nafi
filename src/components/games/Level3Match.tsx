import React, { useState, useEffect, useRef } from 'react';
import { LEVEL_3_PAIRS, shuffleArray } from '../../data/kataNafiData';
import { MatchPair } from '../../types';
import { Heart, Volume2, RotateCcw, Award, CheckCircle2, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { ConfirmModal } from '../ConfirmModal';
import confetti from 'canvas-confetti';

interface Level3MatchProps {
  onComplete: (score: number, remainingLives: number) => void;
  onBackToHub: () => void;
  onResetLevel?: () => void;
}

// Warna ceria bagi setiap pasangan yang berjaya dipadankan
const MATCH_COLORS = [
  { bg: 'bg-emerald-100 border-emerald-600 text-emerald-900', badge: 'bg-emerald-500 text-white', stroke: '#059669' },
  { bg: 'bg-sky-100 border-sky-600 text-sky-900', badge: 'bg-sky-500 text-white', stroke: '#0284c7' },
  { bg: 'bg-amber-100 border-amber-600 text-amber-900', badge: 'bg-amber-500 text-slate-900', stroke: '#d97706' },
  { bg: 'bg-purple-100 border-purple-600 text-purple-900', badge: 'bg-purple-500 text-white', stroke: '#9333ea' },
  { bg: 'bg-pink-100 border-pink-600 text-pink-900', badge: 'bg-pink-500 text-white', stroke: '#db2777' },
  { bg: 'bg-indigo-100 border-indigo-600 text-indigo-900', badge: 'bg-indigo-500 text-white', stroke: '#4f46e5' },
  { bg: 'bg-teal-100 border-teal-600 text-teal-900', badge: 'bg-teal-500 text-white', stroke: '#0d9488' },
  { bg: 'bg-orange-100 border-orange-600 text-orange-900', badge: 'bg-orange-500 text-white', stroke: '#ea580c' },
];

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const Level3Match: React.FC<Level3MatchProps> = ({ onComplete, onBackToHub, onResetLevel }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchOrder, setMatchOrder] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Sentiasa rawak bagi kedua-dua bahagian kiri dan kanan (tanpa memindahkan item dari kiri ke kanan)
  const [shuffledLefts, setShuffledLefts] = useState<MatchPair[]>(() => shuffleArray(LEVEL_3_PAIRS));
  const [shuffledRights, setShuffledRights] = useState<MatchPair[]>(() => shuffleArray(LEVEL_3_PAIRS));

  const arenaRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<ConnectionLine[]>([]);

  // Kira koordinat garis anak panah (arrow) antara kad kiri dan kad kanan
  const updateLines = () => {
    if (!arenaRef.current) return;
    const arenaRect = arenaRef.current.getBoundingClientRect();
    const newLines: ConnectionLine[] = [];

    matchedIds.forEach((id) => {
      const leftEl = leftRefs.current[id];
      const rightEl = rightRefs.current[id];
      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        // Titik kanan tengah kad kiri
        const x1 = leftRect.right - arenaRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - arenaRect.top;

        // Titik kiri tengah kad kanan
        const x2 = rightRect.left - arenaRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - arenaRect.top;

        const matchIdx = matchOrder.indexOf(id);
        const color = MATCH_COLORS[matchIdx % MATCH_COLORS.length]?.stroke || '#ea580c';

        newLines.push({ id, x1, y1, x2, y2, color });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    updateLines();
    const handleResize = () => updateLines();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [matchedIds, matchOrder, shuffledLefts, shuffledRights]);

  const handleSpeak = (text: string) => {
    sounds.playPop();
    sounds.speakText(text);
  };

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id) || gameOver || gameFinished) return;
    sounds.playPop();
    setSelectedLeft(id);
  };

  const handleSelectRight = (pair: MatchPair) => {
    if (matchedIds.includes(pair.id) || !selectedLeft || gameOver || gameFinished) return;

    sounds.playPop();
    const isCorrect = selectedLeft === pair.id;

    if (isCorrect) {
      sounds.playCorrect();
      const newMatched = [...matchedIds, pair.id];
      const newOrder = [...matchOrder, pair.id];
      setMatchedIds(newMatched);
      setMatchOrder(newOrder);
      setScore(prev => prev + 1);
      setSelectedLeft(null);
      setLastFeedback({
        isCorrect: true,
        text: `Padanan Tepat! ${pair.explanation}`
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 1.0 }
      });

      if (newMatched.length === LEVEL_3_PAIRS.length) {
        setGameFinished(true);
        sounds.playVictory();
        onComplete(score + 1, lives);
      }
    } else {
      sounds.playWrong();
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      const nextLives = lives - 1;
      setLives(nextLives);
      setSelectedLeft(null);
      setLastFeedback({
        isCorrect: false,
        text: 'SALAH! Perhatikan kata nafi (Bukan vs Tidak) dan jenis frasanya.'
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
    setSelectedLeft(null);
    setMatchedIds([]);
    setMatchOrder([]);
    setLives(3);
    setScore(0);
    setLastFeedback(null);
    setGameOver(false);
    setGameFinished(false);
    // Rombak semula susunan kedua-dua bahagian secara rawak tulen
    setShuffledLefts(shuffleArray(LEVEL_3_PAIRS));
    setShuffledRights(shuffleArray(LEVEL_3_PAIRS));
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  const renderLeftSubjectText = (pair: MatchPair) => {
    // Pastikan jika pair.leftSubject sudah mempunyai kata nafi (contoh: "Lelaki berbaju Melayu itu BUKAN"), ia dipaparkan kemas dengan lencana
    let baseText = pair.leftSubject;
    if (baseText.endsWith(pair.connector)) {
      baseText = baseText.slice(0, -pair.connector.length).trim();
    }

    return (
      <span className="text-sm font-extrabold text-slate-900 leading-snug">
        {baseText}{' '}
        <span className={`px-2 py-0.5 rounded-md font-black text-xs inline-block ml-1 border border-slate-900 ${
          pair.connector === 'BUKAN' ? 'bg-emerald-300 text-slate-900' : 'bg-sky-300 text-slate-900'
        }`}>
          {pair.connector}
        </span>
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Aras 3"
        message="Adakah anda pasti mahu menetapkan semula skor permainan Aras 3 kepada 0?"
        subMessage="Hanya skor Aras 3 sahaja yang akan direset kepada nilai asal (0)."
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
              🔄 Skor Aras 3 telah berjaya ditetapkan semula kepada 0 (asal)!
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

      {/* Top Header - Centered Titles, Description & Maskot */}
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
            <span>🔗</span> Aras 3: Padanan Ayat
          </h2>
          <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
            Padankan {matchedIds.length} daripada {LEVEL_3_PAIRS.length} pasangan ayat dengan tepat
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
            Skor: <span className="text-base text-orange-700 font-extrabold">{score}</span> / {LEVEL_3_PAIRS.length}
          </div>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tetapkan semula soalan padanan aras ini"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tetapkan Semula</span>
          </button>
        </div>
      </div>

      {!gameOver && !gameFinished ? (
        <div className={`space-y-6 ${shaking ? 'animate-shake' : ''}`}>
          <div className="rounded-2xl bg-amber-100 border-2 border-slate-900 p-4 text-center shadow-neo-sm max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 text-center">
              💡 <strong>Langkah:</strong> Klik satu kad di <strong>sebelah Kiri</strong> (Subjek + Kata Nafi), kemudian klik kad pelengkap di <strong>sebelah Kanan</strong> (Predikat) untuk menyambungkan garis anak panah (arrow).
            </p>
          </div>

          {lastFeedback && (
            <div className={`p-4 rounded-2xl border-2 border-slate-900 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-neo-sm max-w-2xl mx-auto text-center ${
              lastFeedback.isCorrect ? 'bg-emerald-200 text-slate-900' : 'bg-rose-200 text-slate-900'
            }`}>
              {lastFeedback.isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-800 shrink-0" /> : null}
              <span>{lastFeedback.text}</span>
            </div>
          )}

          {/* Dual Columns Matching Arena with SVG Arrow Connectors */}
          <div ref={arenaRef} className="relative">
            {/* SVG Connecting Lines / Arrows across columns */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block overflow-visible"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {MATCH_COLORS.map((mc, idx) => (
                  <marker
                    key={idx}
                    id={`arrowhead-${idx}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="7"
                    refY="5"
                    orient="auto"
                  >
                    <polygon points="0 2, 8 5, 0 8" fill={mc.stroke} />
                  </marker>
                ))}
              </defs>

              {lines.map((line) => {
                const matchIdx = matchOrder.indexOf(line.id);
                const markerId = `url(#arrowhead-${matchIdx % MATCH_COLORS.length})`;
                const dx = Math.abs(line.x2 - line.x1);
                const curveOffset = Math.min(dx * 0.45, 90);

                return (
                  <g key={`line-${line.id}`} className="animate-in fade-in duration-300">
                    {/* Shadow line */}
                    <path
                      d={`M ${line.x1} ${line.y1} C ${line.x1 + curveOffset} ${line.y1}, ${line.x2 - curveOffset} ${line.y2}, ${line.x2} ${line.y2}`}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                    {/* Vibrant main line with arrow */}
                    <path
                      d={`M ${line.x1} ${line.y1} C ${line.x1 + curveOffset} ${line.y1}, ${line.x2 - curveOffset} ${line.y2}, ${line.x2} ${line.y2}`}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="3.5"
                      strokeDasharray="none"
                      strokeLinecap="round"
                      markerEnd={markerId}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Grid 2 Kolum: Kiri & Kanan (Sentiasa kekal di lajur masing-masing, kedudukan dirombak rawak) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
              {/* Kolum Kiri (Sentiasa rawak, kad tidak boleh dipindahkan ke kanan) */}
              <div className="space-y-3">
                <div className="text-center md:text-left mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-white border border-slate-900 px-3 py-1 rounded-full shadow-neo-sm inline-block">
                    Bahagian Kiri: Subjek &amp; Kata Nafi
                  </span>
                </div>

                {shuffledLefts.map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isSelected = selectedLeft === pair.id;
                  const matchIdx = matchOrder.indexOf(pair.id);
                  const colorScheme = isMatched ? MATCH_COLORS[matchIdx % MATCH_COLORS.length] : null;

                  return (
                    <div
                      key={`left-${pair.id}`}
                      ref={(el) => { leftRefs.current[pair.id] = el; }}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                        isMatched
                          ? `${colorScheme?.bg || 'bg-emerald-100'} border-slate-900 opacity-90 shadow-neo-sm`
                          : isSelected
                          ? 'bg-amber-300 border-slate-900 shadow-neo scale-[1.01]'
                          : 'bg-white border-slate-900 shadow-neo-sm hover:bg-amber-50'
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectLeft(pair.id)}
                        className="flex-1 text-left cursor-pointer disabled:cursor-default focus:outline-hidden"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          {isMatched && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border border-slate-900 ${colorScheme?.badge || 'bg-slate-900 text-white'}`}>
                              Padanan #{matchIdx + 1} ➔
                            </span>
                          )}
                          {renderLeftSubjectText(pair)}
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isMatched && (
                          <span className="text-xs font-black text-slate-700 hidden sm:inline-flex items-center gap-1">
                            <ArrowRight className="h-4 w-4 text-slate-900" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSpeak(`${pair.leftSubject}`)}
                          className="p-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all cursor-pointer"
                          title="Dengar sebutan"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Kolum Kanan (Sentiasa rawak, disambungkan mengikut konteks tatabahasa) */}
              <div className="space-y-3">
                <div className="text-center md:text-left mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-white border border-slate-900 px-3 py-1 rounded-full shadow-neo-sm inline-block">
                    Bahagian Kanan: Sambung Predikat Sesuai
                  </span>
                </div>

                {shuffledRights.map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const matchIdx = matchOrder.indexOf(pair.id);
                  const colorScheme = isMatched ? MATCH_COLORS[matchIdx % MATCH_COLORS.length] : null;

                  return (
                    <div
                      key={`right-${pair.id}`}
                      ref={(el) => { rightRefs.current[pair.id] = el; }}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                        isMatched
                          ? `${colorScheme?.bg || 'bg-emerald-100'} border-slate-900 opacity-90 shadow-neo-sm`
                          : selectedLeft
                          ? 'bg-white border-slate-900 shadow-neo hover:bg-amber-100'
                          : 'bg-slate-100 border-slate-300 text-slate-400 opacity-80'
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isMatched || !selectedLeft}
                        onClick={() => handleSelectRight(pair)}
                        className={`flex-1 text-left focus:outline-hidden ${
                          selectedLeft && !isMatched ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          {isMatched && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border border-slate-900 ${colorScheme?.badge || 'bg-slate-900 text-white'}`}>
                              ➔ #{matchIdx + 1}
                            </span>
                          )}
                          <span className="text-sm font-extrabold text-slate-900 leading-snug">
                            ... {pair.rightPredicate}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isMatched && <CheckCircle2 className="h-5 w-5 text-emerald-600 stroke-[2.5]" />}
                        <button
                          type="button"
                          onClick={() => handleSpeak(pair.rightPredicate)}
                          className="p-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all cursor-pointer"
                          title="Dengar sebutan"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : gameOver ? (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4 max-w-lg mx-auto">
          <div className="h-16 w-16 mx-auto rounded-full bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo-sm">
            💔
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900 text-center">
            Peluang Nyawa Telah Habis
          </h3>
          <p className="text-sm text-slate-600 font-semibold text-center">
            Jangan berputus asa! Anda berjaya memadankan <strong>{score}</strong> pasangan dengan betul.
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tetapkan Semula</span>
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Kembali ke Menu Kuiz</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo text-center space-y-4 max-w-lg mx-auto">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-emerald-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-4xl shadow-neo">
            🎉
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900 text-center">
            Tahniah! Semua Padanan Selesai!
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto text-center">
            Anda telah berjaya memadankan kesemua 8 pasangan ayat mengikut formula tatabahasa kata nafi dengan cemerlang!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tetapkan Semula</span>
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Kembali ke Menu Kuiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
