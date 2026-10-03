import React from 'react';
import { 
  LayoutDashboard, BookOpen, Sparkles, Gamepad2, Award, 
  BarChart3, Users, Download, Volume2, VolumeX, ArrowLeftRight, User, Zap
} from 'lucide-react';
import { sounds } from '../utils/audio';

export type AppNavTab = 
  | 'overview' 
  | 'nota' 
  | 'notakilat'
  | 'formula' 
  | 'permainan' 
  | 'rodabertuah'
  | 'analisis'
  | 'rekod'
  | 'muatturun';

interface SidebarProps {
  currentTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  isTeacherMode: boolean;
  currentStudentName: string;
  currentStudentAvatar: string;
  currentStudentTp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStudentModal: () => void;
  onSwitchMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isTeacherMode,
  currentStudentName,
  currentStudentAvatar,
  currentStudentTp,
  soundEnabled,
  onToggleSound,
  onOpenStudentModal,
  onSwitchMode,
}) => {
  const handleNav = (tab: AppNavTab) => {
    sounds.playPop();
    onTabChange(tab);
  };

  return (
    <aside className="w-full lg:w-64 bg-white/95 backdrop-blur-md border-r-3 border-slate-900 flex flex-col justify-between p-4 shrink-0 shadow-sm no-print">
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-xl shadow-neo-sm">
              📚
            </div>
            <div>
              <span className="text-lg font-black font-heading text-slate-900 tracking-tight block leading-tight">
                KATA NAFI
              </span>
              <span className="text-[10px] font-bold text-orange-600 block uppercase tracking-wider">
                {isTeacherMode ? 'MOD GURU AKTIF' : 'MOD MURID AKTIF'}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onToggleSound();
            }}
            className="p-1.5 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-amber-100 transition-colors shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5"
            title={soundEnabled ? 'Matikan Bunyi' : 'Hidupkan Bunyi'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-slate-900" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-3 py-1">
            Menu Utama
          </span>

          {/* 1. HALAMAN UTAMA */}
          {!isTeacherMode && (
            <button
              type="button"
              onClick={() => handleNav('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
                currentTab === 'overview'
                  ? 'bg-amber-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                  : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="tracking-wide">HALAMAN UTAMA</span>
            </button>
          )}

          {/* 2. NOTA */}
          <button
            type="button"
            onClick={() => handleNav('nota')}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
              currentTab === 'nota'
                ? 'bg-amber-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="tracking-wide">NOTA</span>
          </button>

          {/* 3. FORMULA */}
          <button
            type="button"
            onClick={() => handleNav('formula')}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
              currentTab === 'formula'
                ? 'bg-amber-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="tracking-wide">FORMULA</span>
          </button>

          {/* 4. KUIZ */}
          <button
            type="button"
            onClick={() => handleNav('permainan')}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
              currentTab === 'permainan'
                ? 'bg-orange-400 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="h-4 w-4 shrink-0" />
            <span className="tracking-wide">KUIZ</span>
          </button>

          {/* 5. NOTA KILAT */}
          <button
            type="button"
            onClick={() => handleNav('notakilat')}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
              currentTab === 'notakilat'
                ? 'bg-amber-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <Zap className="h-4 w-4 shrink-0" />
            <span className="tracking-wide">NOTA KILAT</span>
          </button>

          {/* 6. RODA BERTUAH */}
          <button
            type="button"
            onClick={() => handleNav('rodabertuah')}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
              currentTab === 'rodabertuah'
                ? 'bg-amber-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <span className="text-base shrink-0 leading-none">🎡</span>
            <span className="tracking-wide">RODA BERTUAH</span>
          </button>

          {/* 5. Teacher Specific Tabs */}
          {isTeacherMode ? (
            <>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-3 py-1.5 pt-3">
                Pentaksiran Guru
              </span>

              <button
                type="button"
                onClick={() => handleNav('analisis')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
                  currentTab === 'analisis'
                    ? 'bg-emerald-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span className="tracking-wide">ANALISIS KELAS</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('rekod')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
                  currentTab === 'rekod'
                    ? 'bg-emerald-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
                }`}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span className="tracking-wide">REKOD MURID</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('muatturun')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border-2 ${
                  currentTab === 'muatturun'
                    ? 'bg-emerald-300 text-slate-900 border-slate-900 shadow-neo-sm font-black'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100'
                }`}
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="tracking-wide">PUSAT MUAT TURUN</span>
              </button>
            </>
          ) : null}
        </nav>
      </div>

      {/* Bottom Profile & Mode Switcher */}
      <div className="pt-4 border-t-2 border-slate-200 space-y-2.5">
        {/* User Card */}
        {!isTeacherMode ? (
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenStudentModal();
            }}
            className="w-full text-left p-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-slate-900 shadow-neo-sm transition-all flex items-center justify-between"
            title="Tukar Murid"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-2xl">{currentStudentAvatar}</span>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{currentStudentName}</p>
                <p className="text-[10px] font-semibold text-sky-800">Tahap Penguasaan: TP {currentStudentTp}</p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded-md border border-slate-900">
              Tukar
            </span>
          </button>
        ) : (
          <div className="p-2.5 rounded-2xl bg-emerald-50 border-2 border-slate-900 shadow-neo-sm flex items-center gap-2">
            <span className="text-2xl">🧑‍🏫</span>
            <div>
              <p className="text-xs font-bold text-slate-900">Guru Pentaksir</p>
              <p className="text-[10px] font-semibold text-emerald-800">Mod Kawalan Kelas</p>
            </div>
          </div>
        )}

        {/* Switch Mode Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onSwitchMode();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>Tukar Pilihan Mod</span>
        </button>
      </div>
    </aside>
  );
};
