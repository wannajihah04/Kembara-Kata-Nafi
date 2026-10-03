import React, { useState, useEffect, useRef } from 'react';
import { PageNavigationFooter } from './PageNavigationFooter';
import { STUDENTS_BM3, STUDENTS_BM4, getAvatarForName } from '../data/kataNafiData';
import { Student } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, RotateCcw, Plus, Trash2, Award, UserCheck, 
  UserMinus, Volume2, Users, CheckCircle2, Shuffle, AlertCircle
} from 'lucide-react';

interface RodaBertuahViewProps {
  existingStudents?: Student[];
  onBack: () => void;
  onNext: () => void;
}

const SECTOR_COLORS = [
  '#fde047', // yellow-300
  '#67e8f9', // cyan-300
  '#fca5a5', // red-300
  '#86efac', // green-300
  '#fed7aa', // orange-200
  '#d8b4fe', // purple-300
  '#93c5fd', // blue-300
  '#fdba74', // orange-300
  '#a7f3d0', // emerald-200
  '#fbcfe8', // pink-200
];

export const RodaBertuahView: React.FC<RodaBertuahViewProps> = ({
  existingStudents = [],
  onBack,
  onNext,
}) => {
  const [selectedClass, setSelectedClass] = useState<'BM3' | 'BM4' | 'CUSTOM'>('BM3');
  const [namesList, setNamesList] = useState<string[]>([]);
  const [customInputName, setCustomInputName] = useState<string>('');
  
  // Wheel spinning animation state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<{ name: string; avatar: string } | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [removedNames, setRemovedNames] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load initial names based on class selection
  useEffect(() => {
    setRemovedNames([]);
    setWinner(null);
    if (selectedClass === 'BM3') {
      const bm3 = STUDENTS_BM3.map(s => s.name);
      setNamesList(bm3);
    } else if (selectedClass === 'BM4') {
      const bm4 = STUDENTS_BM4.map(s => s.name);
      setNamesList(bm4);
    } else {
      // Custom default sample
      setNamesList([
        'AHMAD ZIKRI',
        'NUR FARISHA',
        'MUHAMMAD ADAM',
        'SITI AISYAH',
        'HARIS DANIAL',
        'NUR DAMIA'
      ]);
    }
  }, [selectedClass]);

  // Draw the wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 14;

    ctx.clearRect(0, 0, width, height);

    const total = namesList.length;
    if (total === 0) {
      // Empty wheel message
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Tiada nama dalam senarai', centerX, centerY);
      ctx.restore();
      return;
    }

    const arc = (Math.PI * 2) / total;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    // Draw wheel sectors
    for (let i = 0; i < total; i++) {
      const angle = i * arc;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arc);
      ctx.closePath();

      ctx.fillStyle = SECTOR_COLORS[i % SECTOR_COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Draw student name text
      ctx.save();
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = total > 16 ? 'bold 10px Plus Jakarta Sans, sans-serif' : 'bold 12px Plus Jakarta Sans, sans-serif';

      const displayName = namesList[i].length > 18
        ? namesList[i].substring(0, 16) + '…'
        : namesList[i];

      ctx.fillText(displayName, radius - 16, 4);
      ctx.restore();
    }

    // Outer wheel rim
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Center decorative circle
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.restore();
  }, [namesList, rotationAngle]);

  // Spin the wheel
  const handleSpinWheel = () => {
    if (isSpinning || namesList.length === 0) return;

    sounds.playPop();
    setWinner(null);
    setIsSpinning(true);

    const total = namesList.length;
    const arc = (Math.PI * 2) / total;

    // Pick random index
    const chosenIndex = Math.floor(Math.random() * total);

    // Top pointer is at angle -Math.PI / 2 (or 3 * Math.PI / 2)
    // To align chosenIndex with the top pointer (at 3 * Math.PI / 2):
    const currentAngle = rotationAngle % (Math.PI * 2);
    const targetSectorAngle = chosenIndex * arc + arc / 2;
    const desiredFinalAngle = (1.5 * Math.PI - targetSectorAngle);
    
    // Add 5 to 7 full rotations (360 deg * 5)
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * Math.PI * 2;
    const totalRotationNeeded = extraSpins + (desiredFinalAngle - currentAngle);

    const startTime = performance.now();
    const duration = 4800; // 4.8 seconds spin duration

    let lastTickAngle = rotationAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const newAngle = rotationAngle + totalRotationNeeded * easeOut;

      setRotationAngle(newAngle);

      // Play tick sound when passing each sector boundary
      if (Math.abs(newAngle - lastTickAngle) >= arc * 0.75) {
        sounds.playWheelTick();
        lastTickAngle = newAngle;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        const winningStudent = namesList[chosenIndex];
        const avatar = getAvatarForName(winningStudent);
        setWinner({ name: winningStudent, avatar });

        // Triumphant fanfare & confetti blast
        sounds.playWheelWin();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  // Add custom name
  const handleAddCustomName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInputName.trim().toUpperCase();
    if (!trimmed) return;
    if (namesList.includes(trimmed)) {
      sounds.playWrong();
      return;
    }
    sounds.playPop();
    setNamesList(prev => [...prev, trimmed]);
    setCustomInputName('');
  };

  // Remove individual name manually
  const handleRemoveSingleName = (nameToRemove: string) => {
    sounds.playPop();
    setNamesList(prev => prev.filter(n => n !== nameToRemove));
  };

  // Action 1: Kekalkan Nama
  const handleKeepName = () => {
    sounds.playKeepName();
    setWinner(null);
  };

  // Action 2: Keluarkan Nama
  const handleRemoveWinnerName = () => {
    if (!winner) return;
    sounds.playRemoveName();
    const nameToRemove = winner.name;
    setRemovedNames(prev => [...prev, nameToRemove]);
    setNamesList(prev => prev.filter(n => n !== nameToRemove));
    setWinner(null);
  };

  // Reset to original class list
  const handleResetClassList = () => {
    sounds.playPop();
    setRemovedNames([]);
    setWinner(null);
    if (selectedClass === 'BM3') {
      setNamesList(STUDENTS_BM3.map(s => s.name));
    } else if (selectedClass === 'BM4') {
      setNamesList(STUDENTS_BM4.map(s => s.name));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 p-6 sm:p-8 border-3 border-slate-900 shadow-neo text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider mb-2 shadow-neo-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Aktiviti PdPC &amp; Pentaksiran Bilik Darjah</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight">
            🎡 Roda Bertuah: Cabutan Nama Murid
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-800 font-bold max-w-2xl leading-relaxed">
            Putar roda rawak untuk mencabut giliran murid menjawab soalan, membina ayat, atau memimpin aktiviti kelas secara adil &amp; ceria!
          </p>
        </div>
      </div>

      {/* 2. Pilihan Sumber Kelas & Pengurusan Senarai */}
      <div className="rounded-3xl bg-white border-3 border-slate-900 p-5 sm:p-6 shadow-neo">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-200 border-2 border-slate-900 text-slate-900 shadow-neo-sm">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black font-heading text-slate-900">
                Pilih Kelas / Senarai Nama
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Jumlah murid dalam roda semasa: <strong className="text-orange-600 font-black">{namesList.length} orang</strong>
              </p>
            </div>
          </div>

          {/* Butang Pilihan Kelas */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedClass('BM3')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                selectedClass === 'BM3'
                  ? 'bg-amber-300 text-slate-900 shadow-neo-sm scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Kelas BM 3 ({STUDENTS_BM3.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedClass('BM4')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                selectedClass === 'BM4'
                  ? 'bg-sky-300 text-slate-900 shadow-neo-sm scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Kelas BM 4 ({STUDENTS_BM4.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedClass('CUSTOM')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                selectedClass === 'CUSTOM'
                  ? 'bg-emerald-300 text-slate-900 shadow-neo-sm scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Isi Sendiri ✍️
            </button>
          </div>
        </div>

        {/* Bahagian Tambah Nama Khas (Jika Isi Sendiri atau guru mahu tambah nama murid baharu) */}
        {selectedClass === 'CUSTOM' && (
          <form onSubmit={handleAddCustomName} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customInputName}
              onChange={(e) => setCustomInputName(e.target.value)}
              placeholder="Taip nama murid baru (contoh: NURUL AIN BINTI HISHAM)..."
              className="flex-1 rounded-2xl bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 border-2 border-slate-900 font-bold focus:outline-hidden"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Tambah Nama</span>
            </button>
          </form>
        )}

        {/* Status Nama Yang Telah Dikeluarkan */}
        {removedNames.length > 0 && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border-2 border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800">
            <div>
              <span>Murid yang telah dipanggil: </span>
              <span className="font-black text-rose-700">{removedNames.length} orang</span>
              <span className="text-slate-500 text-[11px] ml-1">({removedNames.slice(-3).join(', ')}{removedNames.length > 3 ? '...' : ''})</span>
            </div>
            <button
              type="button"
              onClick={handleResetClassList}
              className="inline-flex items-center gap-1 text-[11px] font-black text-slate-900 underline hover:text-orange-600 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Kembalikan Semua Nama</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Ruang Roda Bertuah Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Kolum Kiri/Tengah: Roda Canvas dengan Penunjuk */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-3 border-slate-900 shadow-neo flex flex-col items-center justify-center max-w-full overflow-hidden">
            {/* Triangular Pointer at the top pointing downward */}
            <div className="absolute top-2 sm:top-4 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-rose-600 drop-shadow-md"></div>
              <div className="w-3 h-3 rounded-full bg-slate-900 -mt-7"></div>
            </div>

            {/* Canvas Wheel */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full aspect-square drop-shadow-xs"
            />

            {/* Big Spin Button */}
            <button
              type="button"
              disabled={isSpinning || namesList.length === 0}
              onClick={handleSpinWheel}
              className={`mt-6 px-8 py-3.5 rounded-2xl text-base sm:text-lg font-black font-heading border-3 border-slate-900 transition-all flex items-center gap-2.5 cursor-pointer ${
                isSpinning || namesList.length === 0
                  ? 'bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-neo active:translate-x-1 active:translate-y-1'
              }`}
            >
              <Shuffle className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Sedang Memutar...' : 'PUTAR RODA SEKARANG! 🎯'}</span>
            </button>
          </div>
        </div>

        {/* Kolum Kanan: Senarai Nama Semasa dalam Roda */}
        <div className="lg:col-span-4 rounded-3xl bg-white border-3 border-slate-900 p-5 shadow-neo max-h-[520px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-3">
              <h3 className="text-sm font-black font-heading text-slate-900">
                Senarai Murid Semasa ({namesList.length})
              </h3>
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-slate-900 px-2 py-0.5 rounded-md">
                Dalam Roda
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[360px] pr-1">
              {namesList.map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-400 text-[10px] font-mono w-4">{idx + 1}.</span>
                    <span className="truncate">{name}</span>
                  </div>
                  {selectedClass === 'CUSTOM' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleName(name)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Padam nama"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-100 text-[11px] font-bold text-slate-500 text-center">
            Petua: Anda boleh memilih untuk kekalkan nama atau keluarkan nama selepas roda berhenti.
          </div>
        </div>
      </div>

      {/* 4. MODAL KEPUTUSAN CABUTAN (DENGAN BUTANG KEKALKAN NAMA & KELUARKAN NAMA) */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 border-3 border-slate-900 shadow-neo text-center animate-in zoom-in-95 duration-200">
            {/* Top Crown/Badge */}
            <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-4xl shadow-neo mb-3">
              🎉
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-orange-400 border-2 border-slate-900 text-white text-xs font-black uppercase tracking-wider mb-2 shadow-neo-sm">
              Tahniah! Giliran Murid Terpilih
            </span>

            {/* Nama & Avatar Pemenang */}
            <div className="my-4 p-5 rounded-2xl bg-amber-50 border-2 border-slate-900 shadow-neo-sm">
              <div className="text-5xl mb-2">{winner.avatar}</div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-snug">
                {winner.name}
              </h2>
              <p className="text-xs font-extrabold text-slate-600 mt-1">
                {selectedClass === 'BM3' ? 'Kelas BM 3' : selectedClass === 'BM4' ? 'Kelas BM 4' : 'Senarai Khas'}
              </p>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-6">
              Sila pilih tindakan seterusnya untuk senarai pusingan roda yang akan datang:
            </p>

            {/* Dua Butang Utama Yang Ditetapkan oleh Pengguna: KEKALKAN NAMA & KELUARKAN NAMA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Butang 1: Kekalkan Nama */}
              <button
                type="button"
                onClick={handleKeepName}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Kekalkan nama dalam pusingan roda seterusnya"
              >
                <UserCheck className="h-4 w-4 stroke-[2.5]" />
                <span>Kekalkan Nama</span>
              </button>

              {/* Butang 2: Keluarkan Nama */}
              <button
                type="button"
                onClick={handleRemoveWinnerName}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-400 hover:bg-rose-500 text-white font-black text-xs sm:text-sm border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Keluarkan nama supaya murid lain berpeluang dipilih"
              >
                <UserMinus className="h-4 w-4 stroke-[2.5]" />
                <span>Keluarkan Nama</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Page Navigation Footer */}
      <PageNavigationFooter
        onBack={onBack}
        onNext={onNext}
        backLabel="NOTA KILAT"
        backSubtext="Infografik Bukan vs Tidak"
        nextLabel="HALAMAN UTAMA"
        nextSubtext="Kembali ke Dashboard Murid"
      />
    </div>
  );
};
