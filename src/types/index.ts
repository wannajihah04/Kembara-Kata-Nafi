export type NavTab = 'nota' | 'formula' | 'permainan' | 'dashboard';
export type TeacherSubTab = 'analisis' | 'rekod' | 'muatturun';

export type KataNafiType = 'BUKAN' | 'TIDAK';

export type PhraseCategory = 
  | 'FN'             // Frasa Nama (Kata Nafi: BUKAN)
  | 'FSN'            // Frasa Sendi Nama (Kata Nafi: BUKAN)
  | 'FK'             // Frasa Kerja (Kata Nafi: TIDAK)
  | 'FA'             // Frasa Adjektif (Kata Nafi: TIDAK)
  | 'PERTENTANGAN';  // Kes Istimewa: Ada unsur pertentangan (...tetapi...) -> BUKAN

export interface Question {
  id: string;
  sentence: string; // E.g. "Kereta ini _____ kepunyaan saya."
  blankIndex?: number;
  answer: KataNafiType;
  options: KataNafiType[];
  category: PhraseCategory;
  categoryLabel: string; // E.g. "Frasa Nama (FN)"
  explanation: string;
  audioPrompt: string;
}

export interface TrainCarriage {
  id: string;
  phrase: string; // E.g. "guru besar", "pergi ke pasar", "dari Sarawak", "sangat laju"
  category: PhraseCategory;
  correctEngine: KataNafiType;
  explanation: string;
}

export interface MatchPair {
  id: string;
  leftSubject: string; // E.g. "Bangunan yang tersergam itu"
  connector: KataNafiType; // "bukan" atau "tidak"
  rightPredicate: string; // E.g. "hospital daerah."
  category: PhraseCategory;
  explanation: string;
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'melintang' | 'menegak';
  row: number;
  col: number;
  answer: string; // E.g. "BUKAN" or "TIDAK"
  clue: string;
  category: PhraseCategory;
  explanation: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  kelas?: 'BM3' | 'BM4';
  scoreL1: number;
  scoreL2: number;
  scoreL3: number;
  scoreL4: number;
  scoreBonus: number;
  remainingLives: number;
  totalScore: number;
  percentage: number;
  tpLevel: number; // Tahap Penguasaan PBD: 1 to 6
  completedAt?: string;
}

export interface GameRecord {
  id: string;
  studentId: string;
  studentName: string;
  gameLevel: 1 | 2 | 3 | 4 | 'bonus';
  score: number;
  maxScore: number;
  remainingLives: number;
  completedAt: string;
}
