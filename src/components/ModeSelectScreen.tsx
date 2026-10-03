import React, { useState } from 'react';
import { BookOpen, Sparkles, Gamepad2, Award, BarChart3, Users, FileSpreadsheet, Lock, ArrowRight, Star, User, School, AlertTriangle } from 'lucide-react';
import { Student } from '../types';
import { getAvatarForName } from '../data/kataNafiData';
import { sounds } from '../utils/audio';
import { KineticBounceText } from './common/KineticBounceText';
import { MarqueeFooter } from './common/MarqueeFooter';

interface ModeSelectScreenProps {
  onSelectStudentMode: (studentName?: string, avatar?: string, kelas?: 'BM3' | 'BM4') => void;
  onSelectTeacherMode: () => void;
  existingStudents?: Student[];
}

const AVATAR_OPTIONS = ['👦🏽', '🧕🏽', '👧🏻', '👦🏻', '👧🏾', '🧒🏼'];

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onSelectStudentMode,
  onSelectTeacherMode,
  existingStudents = [],
}) => {
  const [selectedClass, setSelectedClass] = useState<'BM3' | 'BM4'>('BM3');
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('👦🏽');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Tapis senarai murid mengikut kelas yang dipilih (BM 3 atau BM 4)
  const classStudents = existingStudents.filter(
    (s) => s.kelas === selectedClass || (!s.kelas && selectedClass === 'BM4')
  );

  const handleEnterStudent = () => {
    const finalName = customStudentName.trim() || selectedStudentName.trim();
    if (!finalName) {
      sounds.playWrong();
      setErrorMessage('Sila pilih nama anda daripada senarai atau taip nama anda terlebih dahulu!');
      return;
    }

    setErrorMessage('');
    sounds.playCorrect();
    // Pastikan avatar sentiasa menepati peraturan BINTI (🧕🏽), BIN (👦🏽), A/P (👧🏻)
    const finalAvatar = getAvatarForName(finalName, selectedAvatar);
    onSelectStudentMode(finalName, finalAvatar, selectedClass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bae6fd] via-[#e0f2fe] to-[#fef08a] flex flex-col justify-between relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Awan Beranimasi Di Latar Belakang */}
      <div className="absolute top-6 left-10 w-32 h-12 bg-white/80 rounded-full blur-2xs animate-cloud pointer-events-none"></div>
      <div className="absolute top-20 right-16 w-44 h-16 bg-white/70 rounded-full blur-2xs animate-cloud pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-44 left-1/4 w-36 h-12 bg-white/60 rounded-full blur-2xs animate-cloud pointer-events-none" style={{ animationDelay: '7s' }}></div>

      {/* Bekas Utama */}
      <div className="max-w-5xl mx-auto w-full z-10 my-auto">
        {/* Tajuk Utama & Penerangan - Aligned Centre */}
        <div className="relative text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 shadow-neo-sm mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              KSSR SEMAKAN BAHASA MELAYU
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-900 tracking-tight drop-shadow-xs text-center py-1">
            <KineticBounceText word1="Kembara" word2="Kata Nafi" />
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-700 font-bold max-w-2xl mx-auto text-center whitespace-nowrap">
            Aplikasi Pembelajaran &amp; Pentaksiran Interaktif
          </p>
        </div>

        {/* Pilihan Mod: Murid & Guru (Grid 2 Kad) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* KAD 1: MOD MURID */}
          <div className="group relative rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-neo-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-center">
            <div>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo mb-4 group-hover:scale-105 transition-transform">
                🎒
              </div>

              {/* Tajuk & Penerangan Mod Murid - Aligned Centre */}
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-2 text-center">
                Mod Murid
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-5 leading-relaxed text-center max-w-md mx-auto">
                Pelajari nota interaktif, hafal formula mnemonik, dan selesaikan 4 aras permainan serta cabaran 5 saat!
              </p>

              {/* BAHAGIAN UNTUK MURID PILIH KELAS & NAMA */}
              <div className="rounded-2xl bg-amber-50 border-2 border-slate-900 p-4 mb-5 text-left shadow-neo-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-black text-slate-900 uppercase">
                    Pilih Kelas &amp; Nama Murid:
                  </span>
                </div>

                {/* 1. PILIHAN KELAS DAHULU: BM3 ATAU BM4 */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
                    1. Pilih Kelas Dahulu:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedClass('BM3');
                        setSelectedStudentName('');
                        setCustomStudentName('');
                      }}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedClass === 'BM3'
                          ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-neo-sm font-extrabold'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>🏫</span>
                      <span>Kelas BM 3</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedClass('BM4');
                        setSelectedStudentName('');
                        setCustomStudentName('');
                      }}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedClass === 'BM4'
                          ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-neo-sm font-extrabold'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>🏫</span>
                      <span>Kelas BM 4</span>
                    </button>
                  </div>
                </div>

                {/* 2. SENARAI NAMA MURID MENGIKUT KELAS */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1 uppercase tracking-wide">
                    2. Pilih Nama Murid ({selectedClass === 'BM3' ? 'Kelas BM 3' : 'Kelas BM 4'}):
                  </label>
                  <select
                    value={selectedStudentName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSelectedStudentName(name);
                      setCustomStudentName('');
                      setErrorMessage('');
                      const found = classStudents.find((s) => s.name === name);
                      if (found) {
                        setSelectedAvatar(found.avatar);
                      } else if (name) {
                        setSelectedAvatar(getAvatarForName(name, selectedAvatar));
                      }
                    }}
                    className={`w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border-2 font-bold bg-white text-slate-900 focus:outline-hidden shadow-neo-sm ${
                      errorMessage && !selectedStudentName && !customStudentName ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-900'
                    }`}
                  >
                    <option value="">-- Pilih Nama Murid ({selectedClass}) --</option>
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.avatar} {s.name} (TP {s.tpLevel})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ruang Taip Nama Sendiri Jika Tiada Dalam Senarai */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Atau taip nama anda sendiri:
                  </label>
                  <input
                    type="text"
                    value={customStudentName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomStudentName(val);
                      setSelectedStudentName('');
                      setErrorMessage('');
                      if (val.trim()) {
                        setSelectedAvatar(getAvatarForName(val, selectedAvatar));
                      }
                    }}
                    placeholder="Contoh: MUHAMMAD FARIS BIN AHMAD"
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-slate-900 font-bold bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Pilihan Avatar Emoji */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      Avatar Profil Murid:
                    </label>
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      Aktif: {selectedAvatar}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`h-9 w-9 rounded-xl border-2 text-lg flex items-center justify-center transition-all ${
                          selectedAvatar === av
                            ? 'border-slate-900 bg-amber-300 shadow-neo-sm scale-110'
                            : 'border-slate-200 bg-white hover:bg-slate-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sorotan Ciri Murid */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-emerald-50 border-2 border-emerald-300/80 p-2 rounded-xl">
                  <BookOpen className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Nota Interaktif &amp; Contoh Bersuara (Audio Jelas)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-sky-50 border-2 border-sky-300/80 p-2 rounded-xl">
                  <Sparkles className="h-4 w-4 text-sky-700 shrink-0" />
                  <span>Formula "BukanNama TidakKerjA" &amp; Buku Interaktif</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-orange-50 border-2 border-orange-300/80 p-2 rounded-xl">
                  <Gamepad2 className="h-4 w-4 text-orange-700 shrink-0" />
                  <span>4 Aras Kuiz + Cabaran 5 Saat (Boleh Ulang Semula)</span>
                </div>
              </div>
            </div>

            {/* Notis Amaran jika murid belum memilih/mengisi nama */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-100 border-2 border-slate-900 text-rose-900 text-xs font-black shadow-neo-sm flex items-center gap-2 text-left animate-in fade-in">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleEnterStudent}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-base border-3 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-sm transition-all cursor-pointer"
            >
              <span>Masuk Sebagai Murid</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>

          {/* KAD 2: MOD GURU (TULISAN 'DILINDUNGI PIN 1234' DIBUANG) */}
          <div className="group relative rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-neo-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-center">
            <div>
              <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-300 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo mb-4 group-hover:scale-105 transition-transform">
                🧑‍🏫
              </div>

              {/* Tajuk & Penerangan Mod Guru - Aligned Centre */}
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-2 text-center">
                Mod Guru
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-6 leading-relaxed text-center max-w-md mx-auto">
                Ruang pentaksiran guru untuk menganalisis prestasi kelas, meneliti rekod markah bilik darjah, dan mengeksport lembaran data pentaksiran.
              </p>

              {/* Sorotan Ciri Guru */}
              <div className="space-y-2.5 mb-8 text-left">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-emerald-50 border-2 border-emerald-300/80 p-2.5 rounded-xl">
                  <BarChart3 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Analisis Penguasaan Kelas &amp; Diagnostik Soalan</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-sky-50 border-2 border-sky-300/80 p-2.5 rounded-xl">
                  <Users className="h-4 w-4 text-sky-700 shrink-0" />
                  <span>Rekod Prestasi Murid (Tahap Penguasaan TP 1 – TP 6)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-amber-50 border-2 border-amber-300/80 p-2.5 rounded-xl">
                  <FileSpreadsheet className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>Muat Turun Lembaran CSV (Excel / Google Sheets)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-purple-50 border-2 border-purple-300/80 p-2.5 rounded-xl">
                  <Star className="h-4 w-4 text-purple-700 shrink-0" />
                  <span>Mod Demonstrasi Pengajaran (PdPC Terbuka)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onSelectTeacherMode();
              }}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base border-3 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-sm transition-all cursor-pointer"
            >
              <span>Akses Mod Guru</span>
              <Lock className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Tip Bawah */}
        <div className="mt-6 text-center text-xs font-bold text-slate-600">
          Panduan: Anda boleh menukar pilihan mod ini pada bila-bila masa melalui menu navigasi sisi.
        </div>

        {/* Label Hak Milik Cikgu Najihah (Animasi Marquee Scroll) */}
        <div className="mt-5 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-neo">
          <MarqueeFooter />
        </div>
      </div>

      {/* Bukit Hijau Di Bahagian Bawah */}
      <div className="relative w-full h-20 -mb-6 pointer-events-none">
        <div className="absolute -bottom-6 -left-10 w-[60%] h-24 bg-[#86efac] rounded-t-[100px] border-t-3 border-slate-900"></div>
        <div className="absolute -bottom-6 -right-10 w-[65%] h-20 bg-[#4ade80] rounded-t-[90px] border-t-3 border-slate-900"></div>
      </div>
    </div>
  );
};
