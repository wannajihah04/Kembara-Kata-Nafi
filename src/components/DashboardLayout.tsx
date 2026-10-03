import React, { useState } from 'react';
import { Sidebar, AppNavTab } from './Sidebar';
import { Student } from '../types';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';
import { MarqueeFooter } from './common/MarqueeFooter';

interface DashboardLayoutProps {
  currentTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  isTeacherMode: boolean;
  currentStudent: Student;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStudentModal: () => void;
  onSwitchMode: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  isTeacherMode,
  currentStudent,
  soundEnabled,
  onToggleSound,
  onOpenStudentModal,
  onSwitchMode,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bae6fd] via-[#e0f2fe] to-[#fef08a] p-3 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-x-hidden">
      {/* Background Illustrated Soft Clouds */}
      <div className="absolute top-4 left-10 w-28 h-10 bg-white/70 rounded-full blur-2xs animate-cloud pointer-events-none"></div>
      <div className="absolute top-16 right-20 w-40 h-14 bg-white/60 rounded-full blur-2xs animate-cloud pointer-events-none" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-36 left-1/3 w-32 h-10 bg-white/50 rounded-full blur-2xs animate-cloud pointer-events-none" style={{ animationDelay: '8s' }}></div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-3 mb-3 bg-white border-2 border-slate-900 rounded-2xl shadow-neo no-print z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-amber-300 border border-slate-900 flex items-center justify-center text-base">
            📚
          </div>
          <span className="text-sm font-black font-heading text-slate-900">
            KATA NAFI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onToggleSound();
            }}
            className="p-1.5 rounded-xl border border-slate-900 bg-slate-100 text-slate-800"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-neo-sm"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Floating Dashboard Container (Neobrutalism Tablet frame) */}
      <div className="w-full max-w-7xl mx-auto bg-white/95 rounded-[2rem] sm:rounded-[2.5rem] border-3 sm:border-4 border-slate-900 shadow-neo-lg flex flex-col lg:flex-row overflow-hidden relative z-20 my-auto">
        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full border-b-3 border-slate-900 bg-white p-4 animate-in slide-in-from-top-2 duration-150 z-30">
            <Sidebar
              currentTab={currentTab}
              onTabChange={(tab) => {
                onTabChange(tab);
                setMobileMenuOpen(false);
              }}
              isTeacherMode={isTeacherMode}
              currentStudentName={currentStudent.name}
              currentStudentAvatar={currentStudent.avatar}
              currentStudentTp={currentStudent.tpLevel}
              soundEnabled={soundEnabled}
              onToggleSound={onToggleSound}
              onOpenStudentModal={onOpenStudentModal}
              onSwitchMode={onSwitchMode}
            />
          </div>
        )}

        {/* Desktop Sidebar (Left) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentTab={currentTab}
            onTabChange={onTabChange}
            isTeacherMode={isTeacherMode}
            currentStudentName={currentStudent.name}
            currentStudentAvatar={currentStudent.avatar}
            currentStudentTp={currentStudent.tpLevel}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            onOpenStudentModal={onOpenStudentModal}
            onSwitchMode={onSwitchMode}
          />
        </div>

        {/* Main Content Stage (Right) */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[88vh] bg-[#fafafa]">
          {children}
        </div>
      </div>

      {/* Label Hak Milik: Cikgu Najihah (Animasi Marquee Scroll) */}
      <MarqueeFooter />

      {/* Decorative Bottom Rolling Green Hills (Framing the cute landscape) */}
      <div className="relative w-full h-16 sm:h-20 -mb-4 sm:-mb-6 pointer-events-none z-10">
        <div className="absolute -bottom-4 -left-10 w-[55%] h-20 bg-[#86efac] rounded-t-[120px] border-t-3 border-slate-900"></div>
        <div className="absolute -bottom-4 -right-10 w-[60%] h-18 bg-[#4ade80] rounded-t-[100px] border-t-3 border-slate-900"></div>
      </div>
    </div>
  );
};
