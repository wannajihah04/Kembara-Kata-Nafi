/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student } from './types';
import { INITIAL_STUDENTS } from './data/kataNafiData';
import { AppNavTab } from './components/Sidebar';
import { ModeSelectScreen } from './components/ModeSelectScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { NotaView } from './components/NotaView';
import { NotaKilatView } from './components/NotaKilatView';
import { FormulaView } from './components/FormulaView';
import { GamesHub } from './components/games/GamesHub';
import { RodaBertuahView } from './components/RodaBertuahView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { PinModal } from './components/PinModal';
import { StudentSelectModal } from './components/StudentSelectModal';
import { sounds } from './utils/audio';

export type AppMode = 'mode_select' | 'murid' | 'guru';

export default function App() {
  // 1. Primary Mode State: Show mode selection first!
  const [activeAppMode, setActiveAppMode] = useState<AppMode>('mode_select');

  // 2. Active Tab State
  const [currentTab, setCurrentTab] = useState<AppNavTab>('overview');

  // 3. Modals & Audio
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 4. Student Roster (LocalStorage synced with BM 3 & BM 4 classes)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('kata_nafi_students_bm3_bm4_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 20 && parsed.some(s => s.name?.includes('AZWAR'))) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<Student>(students[0] || INITIAL_STUDENTS[0]);

  useEffect(() => {
    try {
      localStorage.setItem('kata_nafi_students_bm3_bm4_v3', JSON.stringify(students));
    } catch {
      // Ignore
    }
  }, [students]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  // Mode Selection Handlers
  const handleSelectStudentMode = (studentName?: string, avatar?: string, kelas?: 'BM3' | 'BM4') => {
    if (!studentName || !studentName.trim()) {
      return; // Tidak boleh akses ke halaman utama tanpa memilih atau mengisi nama
    }
    const trimmed = studentName.trim();
    const existing = students.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setCurrentStudent(existing);
    } else {
      handleAddNewStudent(trimmed, avatar || '👦🏽', kelas || 'BM3');
    }
    setActiveAppMode('murid');
    setCurrentTab('overview');
  };

  const handleOpenTeacherPin = () => {
    setPinModalOpen(true);
  };

  const handleTeacherPinSuccess = () => {
    setActiveAppMode('guru');
    setCurrentTab('analisis');
    setPinModalOpen(false);
  };

  const handleSwitchMode = () => {
    setActiveAppMode('mode_select');
  };

  const handleSelectStudent = (student: Student) => {
    setCurrentStudent(student);
  };

  const handleAddNewStudent = (name: string, avatar: string, kelas: 'BM3' | 'BM4' = 'BM3') => {
    const newStudent: Student = {
      id: `${kelas.toLowerCase()}-${students.length + 1}`,
      name,
      avatar,
      kelas,
      scoreL1: 0,
      scoreL2: 0,
      scoreL3: 0,
      scoreL4: 0,
      scoreBonus: 0,
      remainingLives: 3,
      totalScore: 0,
      percentage: 0,
      tpLevel: 1,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    setCurrentStudent(newStudent);
  };

  const handleRecordGameResult = (level: 1 | 2 | 3 | 4 | 'bonus', score: number, lives: number) => {
    // Teacher demo games do not save to live student records
    if (activeAppMode === 'guru') return;

    setStudents(prev => {
      return prev.map(s => {
        if (s.id !== currentStudent.id) return s;

        const updatedScoreL1 = level === 1 ? Math.max(s.scoreL1, score) : s.scoreL1;
        const updatedScoreL2 = level === 2 ? Math.max(s.scoreL2, score) : s.scoreL2;
        const updatedScoreL3 = level === 3 ? Math.max(s.scoreL3, score) : s.scoreL3;
        const updatedScoreL4 = level === 4 ? Math.max(s.scoreL4, score) : s.scoreL4;
        const updatedScoreBonus = level === 'bonus' ? Math.max(s.scoreBonus, score) : s.scoreBonus;

        const total = updatedScoreL1 + updatedScoreL2 + updatedScoreL3 + updatedScoreL4 + updatedScoreBonus;
        const maxPossible = 42;
        const percentage = Math.round((total / maxPossible) * 100);

        let tp = 1;
        if (percentage >= 85) tp = 6;
        else if (percentage >= 70) tp = 5;
        else if (percentage >= 60) tp = 4;
        else if (percentage >= 45) tp = 3;
        else if (percentage >= 30) tp = 2;

        const updatedStudent: Student = {
          ...s,
          scoreL1: updatedScoreL1,
          scoreL2: updatedScoreL2,
          scoreL3: updatedScoreL3,
          scoreL4: updatedScoreL4,
          scoreBonus: updatedScoreBonus,
          remainingLives: lives,
          totalScore: total,
          percentage,
          tpLevel: tp,
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        setCurrentStudent(updatedStudent);
        return updatedStudent;
      });
    });
  };

  const handleResetCurrentStudentScores = () => {
    const resetStudent: Student = {
      ...currentStudent,
      scoreL1: 0,
      scoreL2: 0,
      scoreL3: 0,
      scoreL4: 0,
      scoreBonus: 0,
      remainingLives: 3,
      totalScore: 0,
      percentage: 0,
      tpLevel: 1,
      completedAt: undefined,
    };

    setStudents(prev =>
      prev.map(s => {
        if (s.id !== currentStudent.id) return s;
        return resetStudent;
      })
    );

    setCurrentStudent(resetStudent);
  };

  const handleResetSingleLevel = (level: 1 | 2 | 3 | 4 | 'bonus') => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== currentStudent.id) return s;

        const updatedScoreL1 = level === 1 ? 0 : s.scoreL1;
        const updatedScoreL2 = level === 2 ? 0 : s.scoreL2;
        const updatedScoreL3 = level === 3 ? 0 : s.scoreL3;
        const updatedScoreL4 = level === 4 ? 0 : s.scoreL4;
        const updatedScoreBonus = level === 'bonus' ? 0 : s.scoreBonus;

        const total = updatedScoreL1 + updatedScoreL2 + updatedScoreL3 + updatedScoreL4 + updatedScoreBonus;
        const maxPossible = 42;
        const percentage = Math.round((total / maxPossible) * 100);

        let tp = 1;
        if (percentage >= 85) tp = 6;
        else if (percentage >= 70) tp = 5;
        else if (percentage >= 60) tp = 4;
        else if (percentage >= 45) tp = 3;
        else if (percentage >= 30) tp = 2;

        const updatedStudent: Student = {
          ...s,
          scoreL1: updatedScoreL1,
          scoreL2: updatedScoreL2,
          scoreL3: updatedScoreL3,
          scoreL4: updatedScoreL4,
          scoreBonus: updatedScoreBonus,
          totalScore: total,
          percentage,
          tpLevel: tp,
          completedAt: total > 0 ? s.completedAt : undefined,
        };

        setCurrentStudent(updatedStudent);
        return updatedStudent;
      })
    );
  };

  const handleResetAllStudentsScores = () => {
    const resetAll = students.map(s => ({
      ...s,
      scoreL1: 0,
      scoreL2: 0,
      scoreL3: 0,
      scoreL4: 0,
      scoreBonus: 0,
      remainingLives: 3,
      totalScore: 0,
      percentage: 0,
      tpLevel: 1,
      completedAt: undefined,
    }));

    setStudents(resetAll);

    setCurrentStudent(prev => ({
      ...prev,
      scoreL1: 0,
      scoreL2: 0,
      scoreL3: 0,
      scoreL4: 0,
      scoreBonus: 0,
      remainingLives: 3,
      totalScore: 0,
      percentage: 0,
      tpLevel: 1,
      completedAt: undefined,
    }));
  };

  // If in Mode Selection Screen, show it prominently first!
  if (activeAppMode === 'mode_select') {
    return (
      <>
        <ModeSelectScreen
          onSelectStudentMode={handleSelectStudentMode}
          onSelectTeacherMode={handleOpenTeacherPin}
          existingStudents={students}
        />
        <PinModal
          isOpen={pinModalOpen}
          onClose={() => setPinModalOpen(false)}
          onSuccess={handleTeacherPinSuccess}
        />
      </>
    );
  }

  // Otherwise, render the cute & modern neobrutalism Dashboard Layout!
  return (
    <DashboardLayout
      currentTab={currentTab}
      onTabChange={(tab) => setCurrentTab(tab)}
      isTeacherMode={activeAppMode === 'guru'}
      currentStudent={currentStudent}
      soundEnabled={soundEnabled}
      onToggleSound={handleToggleSound}
      onOpenStudentModal={() => setStudentModalOpen(true)}
      onSwitchMode={handleSwitchMode}
    >
      {/* 1. Student Dashboard Overview */}
      {activeAppMode === 'murid' && currentTab === 'overview' && (
        <DashboardOverview
          currentStudent={currentStudent}
          onGoToNota={() => setCurrentTab('nota')}
          onGoToNotaKilat={() => setCurrentTab('notakilat')}
          onGoToFormula={() => setCurrentTab('formula')}
          onGoToGames={() => setCurrentTab('permainan')}
          onGoToRodaBertuah={() => setCurrentTab('rodabertuah')}
          onBackToModeSelect={handleSwitchMode}
          onResetScores={handleResetCurrentStudentScores}
        />
      )}

      {/* 2. Nota Interaktif */}
      {currentTab === 'nota' && (
        <NotaView
          onBack={() => {
            if (activeAppMode === 'guru') {
              setCurrentTab('muatturun');
            } else {
              setCurrentTab('overview');
            }
          }}
          onNext={() => setCurrentTab('formula')}
        />
      )}

      {/* 3. Formula & Mnemonik */}
      {currentTab === 'formula' && (
        <FormulaView
          onBack={() => setCurrentTab('nota')}
          onNext={() => setCurrentTab('permainan')}
        />
      )}

      {/* 4. Permainan Kuiz */}
      {currentTab === 'permainan' && (
        <GamesHub
          isTeacherMode={activeAppMode === 'guru'}
          currentStudent={currentStudent}
          activeStudentName={currentStudent.name}
          onRecordGameResult={handleRecordGameResult}
          onBack={() => setCurrentTab('formula')}
          onNext={() => {
            if (activeAppMode === 'guru') {
              setCurrentTab('analisis');
            } else {
              setCurrentTab('notakilat');
            }
          }}
          onResetScores={handleResetCurrentStudentScores}
          onResetGameLevel={handleResetSingleLevel}
        />
      )}

      {/* 5. Nota Kilat (Infografik Visual - Selepas Kuiz) */}
      {currentTab === 'notakilat' && (
        <NotaKilatView
          onBack={() => setCurrentTab('permainan')}
          onNext={() => setCurrentTab('rodabertuah')}
        />
      )}

      {/* 6. Roda Bertuah (Cabutan Rawak Nama Murid Kelas BM 3, BM 4 & Isi Sendiri) */}
      {currentTab === 'rodabertuah' && (
        <RodaBertuahView
          existingStudents={students}
          onBack={() => setCurrentTab('notakilat')}
          onNext={() => setCurrentTab('overview')}
        />
      )}

      {/* 5. Teacher Dashboard (Analisis, Rekod, Muat Turun) */}
      {activeAppMode === 'guru' && (currentTab === 'analisis' || currentTab === 'rekod' || currentTab === 'muatturun') && (
        <TeacherDashboard
          currentSubTab={currentTab as 'analisis' | 'rekod' | 'muatturun'}
          onSubTabChange={(subTab) => setCurrentTab(subTab)}
          students={students}
          onBackToModeSelect={handleSwitchMode}
          onGoToDemo={() => setCurrentTab('nota')}
          onResetScores={handleResetAllStudentsScores}
        />
      )}

      {/* Pin Modal for Teacher Access */}
      <PinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handleTeacherPinSuccess}
      />

      {/* Student Selector Modal */}
      <StudentSelectModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        students={students}
        currentStudentId={currentStudent.id}
        onSelectStudent={handleSelectStudent}
        onAddNewStudent={handleAddNewStudent}
      />
    </DashboardLayout>
  );
}
