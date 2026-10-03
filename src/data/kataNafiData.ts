import { Question, TrainCarriage, MatchPair, CrosswordClue, Student } from '../types';

// Utility Fisher-Yates shuffle untuk menjamin rawak tulen dan mengelakkan pola berselang-seli
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Peraturan Penetapan Avatar Automatik Berdasarkan Nama:
 * - Mengandungi BINTI atau BT: Perempuan bertudung (🧕🏽)
 * - Mengandungi BIN atau A/L: Lelaki (👦🏽)
 * - Mengandungi A/P: Perempuan tidak bertudung (👧🏻)
 * - Selain itu: Kekalkan avatar sedia ada
 */
export function getAvatarForName(name: string, fallbackAvatar: string = "👦🏽"): string {
  const upper = name.toUpperCase();
  if (/\bBINTI\b/.test(upper) || /\bBT\b/.test(upper) || /\bBT\./.test(upper)) {
    return "🧕🏽";
  }
  if (/\bBIN\b/.test(upper)) {
    return "👦🏽";
  }
  if (/\bA\/P\b/.test(upper) || /\bAP\b/.test(upper)) {
    return "👧🏻";
  }
  if (/\bA\/L\b/.test(upper) || /\bAL\b/.test(upper)) {
    return "👦🏽";
  }
  return fallbackAvatar;
}

// Senarai rasmi murid Kelas BM 3 (23 Murid)
export const STUDENTS_BM3: Student[] = [
  {
    id: "bm3-1",
    name: "MUHAMMAD AZWAR BIN ABDULLAH",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 38,
    percentage: 90,
    tpLevel: 6,
    completedAt: "2026-10-02 08:30"
  },
  {
    id: "bm3-2",
    name: "MUHAMMAD DANISH FIKRI BIN ROSLI",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 08:35"
  },
  {
    id: "bm3-3",
    name: "MUHAMMAD FARIS IRFAN BIN AHMAD",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 08:40"
  },
  {
    id: "bm3-4",
    name: "MUHAMMAD FAWWAZ BIN JALILLUDDIN",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 08:45"
  },
  {
    id: "bm3-5",
    name: "MUHAMMAD HAREEZ AQIL BIN AZMAN",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 6,
    scoreL4: 6,
    scoreBonus: 7,
    remainingLives: 2,
    totalScore: 33,
    percentage: 79,
    tpLevel: 5,
    completedAt: "2026-10-02 08:50"
  },
  {
    id: "bm3-6",
    name: "MUHAMMAD REDUAN BIN FAUZI",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 08:55"
  },
  {
    id: "bm3-7",
    name: "MUHAMMAD YUSFARHAN BIN WAHAB",
    avatar: "👦🏽",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 6,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 35,
    percentage: 83,
    tpLevel: 5,
    completedAt: "2026-10-02 09:00"
  },
  {
    id: "bm3-8",
    name: "NURAIN SYUHADA BINTI ABDUL MUTALIB",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 10,
    remainingLives: 3,
    totalScore: 42,
    percentage: 100,
    tpLevel: 6,
    completedAt: "2026-10-02 09:05"
  },
  {
    id: "bm3-9",
    name: "NURUL AIN AMALIN BT HAMZU",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:10"
  },
  {
    id: "bm3-10",
    name: "NURUL AIN BINTI MUHAMMAD YUSRI",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 8,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 09:15"
  },
  {
    id: "bm3-11",
    name: "NURUL AIN FARHANA BT MOHD ZAFIE",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 09:20"
  },
  {
    id: "bm3-12",
    name: "NURUL ALIAA BINTI ROSLEY",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 09:25"
  },
  {
    id: "bm3-13",
    name: "NURUL HAFIZZAH SOLLEHAH BINTI NOR HALIM",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:30"
  },
  {
    id: "bm3-14",
    name: "NURUL NATASYA BINTI ALAN",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 6,
    scoreL4: 6,
    scoreBonus: 7,
    remainingLives: 2,
    totalScore: 33,
    percentage: 79,
    tpLevel: 5,
    completedAt: "2026-10-02 09:35"
  },
  {
    id: "bm3-15",
    name: "NURUL SAKINAH BINTI HASHIM LENG",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 09:40"
  },
  {
    id: "bm3-16",
    name: "NURUL SHAHIDAH BINTI ZULKIFLI",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 09:45"
  },
  {
    id: "bm3-17",
    name: "NURULAIN AKHMA BINTI AHMAD FISOL",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 10,
    remainingLives: 3,
    totalScore: 42,
    percentage: 100,
    tpLevel: 6,
    completedAt: "2026-10-02 09:50"
  },
  {
    id: "bm3-18",
    name: "RABIATUL ADAWIYAH BINTI AZMAN",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:55"
  },
  {
    id: "bm3-19",
    name: "REGINA RAHEL A/P ESAN",
    avatar: "👧🏻",
    kelas: "BM3",
    scoreL1: 7,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 6,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 36,
    percentage: 86,
    tpLevel: 5,
    completedAt: "2026-10-02 10:00"
  },
  {
    id: "bm3-20",
    name: "SHAHIDATUL ILYANA BINTI SAFAWI",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 10:05"
  },
  {
    id: "bm3-21",
    name: "SITI HABSAH BINTI WAWI",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 10:10"
  },
  {
    id: "bm3-22",
    name: "SITI HAWA BINTI FAZAN",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 10:15"
  },
  {
    id: "bm3-23",
    name: "SITI NOOR IZZATI BINTI NAZERI",
    avatar: "🧕🏽",
    kelas: "BM3",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 10:20"
  }
];

// Senarai rasmi murid Kelas BM 4 (25 Murid)
export const STUDENTS_BM4: Student[] = [
  {
    id: "bm4-1",
    name: "MUHAMMAD ADAM HAIKAL BIN MOHD ZAMAN",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 10,
    remainingLives: 3,
    totalScore: 42,
    percentage: 100,
    tpLevel: 6,
    completedAt: "2026-10-02 08:30"
  },
  {
    id: "bm4-2",
    name: "MUHAMMAD ZAMIR AMSYAR BIN MOHD SAMSURI",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 08:35"
  },
  {
    id: "bm4-3",
    name: "NAQIB NAZHAN BIN MOHD DUSUKI @ MOHD DASUKI",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 38,
    percentage: 90,
    tpLevel: 6,
    completedAt: "2026-10-02 08:40"
  },
  {
    id: "bm4-4",
    name: "NURNAJMI ZARKASYI BIN NURZAMANI",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 6,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 35,
    percentage: 83,
    tpLevel: 5,
    completedAt: "2026-10-02 08:45"
  },
  {
    id: "bm4-5",
    name: "NUR AISYA AQILA BINTI ABDUL AZIZ",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 08:50"
  },
  {
    id: "bm4-6",
    name: "NUR SYAZANA BINTI ABDULLAH",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 08:55"
  },
  {
    id: "bm4-7",
    name: "SHAHRULHAKIMI A/L JOSAEMI",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 6,
    scoreL3: 6,
    scoreL4: 5,
    scoreBonus: 7,
    remainingLives: 2,
    totalScore: 31,
    percentage: 74,
    tpLevel: 5,
    completedAt: "2026-10-02 09:00"
  },
  {
    id: "bm4-8",
    name: "SITI NURSHAFIRA BINTI MOHD YAKUB",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:05"
  },
  {
    id: "bm4-9",
    name: "SITI NURSYAZWANI BINTI AB TALIB",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 39,
    percentage: 93,
    tpLevel: 6,
    completedAt: "2026-10-02 09:10"
  },
  {
    id: "bm4-10",
    name: "SITI NURZILA BINTI WAN RAMLI",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 6,
    scoreL4: 6,
    scoreBonus: 7,
    remainingLives: 2,
    totalScore: 33,
    percentage: 79,
    tpLevel: 5,
    completedAt: "2026-10-02 09:15"
  },
  {
    id: "bm4-11",
    name: "SITI SARAH BINTI AB AZIZ",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:20"
  },
  {
    id: "bm4-12",
    name: "SOFEA LESMEA A/P BILES",
    avatar: "👧🏻",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 38,
    percentage: 90,
    tpLevel: 6,
    completedAt: "2026-10-02 09:25"
  },
  {
    id: "bm4-13",
    name: "SUMAIYYAH BINTI KAMAL",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 09:30"
  },
  {
    id: "bm4-14",
    name: "SYAKIRAH BINTI ISMAIL",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 09:35"
  },
  {
    id: "bm4-15",
    name: "SYASHA ALEYA BINTI SHAH RIZAL",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:40"
  },
  {
    id: "bm4-16",
    name: "SYED AHMAD AKHTAR BIN SYED AHMAD",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 10,
    remainingLives: 3,
    totalScore: 42,
    percentage: 100,
    tpLevel: 6,
    completedAt: "2026-10-02 09:45"
  },
  {
    id: "bm4-17",
    name: "THAHIRAH BT MD FAKRI",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 40,
    percentage: 95,
    tpLevel: 6,
    completedAt: "2026-10-02 09:50"
  },
  {
    id: "bm4-18",
    name: "UMMI ASYIKIN BINTI MAT LIN",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 8,
    scoreL3: 7,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 37,
    percentage: 88,
    tpLevel: 6,
    completedAt: "2026-10-02 09:55"
  },
  {
    id: "bm4-19",
    name: "W. NURUL NAJIHAH BINTI W. RUHAZLAN",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 10,
    remainingLives: 3,
    totalScore: 42,
    percentage: 100,
    tpLevel: 6,
    completedAt: "2026-10-02 10:00"
  },
  {
    id: "bm4-20",
    name: "WAN AAINNA INSYIRAH BINTI WAN ROSLI",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 10:05"
  },
  {
    id: "bm4-21",
    name: "WAN NUR ADLEEN BINTI WAN MAT LUDIN",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 8,
    scoreL4: 7,
    scoreBonus: 8,
    remainingLives: 3,
    totalScore: 38,
    percentage: 90,
    tpLevel: 6,
    completedAt: "2026-10-02 10:10"
  },
  {
    id: "bm4-22",
    name: "WAN DANISH AKMAL BIN WAN NOR RIDHUAN",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 7,
    scoreL3: 6,
    scoreL4: 6,
    scoreBonus: 7,
    remainingLives: 2,
    totalScore: 33,
    percentage: 79,
    tpLevel: 5,
    completedAt: "2026-10-02 10:15"
  },
  {
    id: "bm4-23",
    name: "WAN NURSYAHIRAH BINTI WAN SABRAN",
    avatar: "🧕🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 8,
    scoreL3: 8,
    scoreL4: 8,
    scoreBonus: 9,
    remainingLives: 3,
    totalScore: 41,
    percentage: 98,
    tpLevel: 6,
    completedAt: "2026-10-02 10:20"
  },
  {
    id: "bm4-24",
    name: "WAN ZUHAIRI HARISH BIN WAN ZAIDI",
    avatar: "👦🏽",
    kelas: "BM4",
    scoreL1: 8,
    scoreL2: 7,
    scoreL3: 7,
    scoreL4: 6,
    scoreBonus: 8,
    remainingLives: 2,
    totalScore: 36,
    percentage: 86,
    tpLevel: 5,
    completedAt: "2026-10-02 10:25"
  },
  {
    id: "bm4-25",
    name: "YONIEZARNI A/P JATI",
    avatar: "👧🏻",
    kelas: "BM4",
    scoreL1: 7,
    scoreL2: 6,
    scoreL3: 6,
    scoreL4: 5,
    scoreBonus: 6,
    remainingLives: 2,
    totalScore: 30,
    percentage: 71,
    tpLevel: 5,
    completedAt: "2026-10-02 10:30"
  }
];

// Senarai gabungan murid BM 3 dan BM 4 untuk rujukan keseluruhan
export const INITIAL_STUDENTS: Student[] = [
  ...STUDENTS_BM3,
  ...STUDENTS_BM4
];

// Aras 1: Gerabak Kereta Api (8 Soalan)
export const LEVEL_1_CARRIAGES: TrainCarriage[] = [
  {
    id: 'c1',
    phrase: 'murid Tahun Enam',
    category: 'FN',
    correctEngine: 'BUKAN',
    explanation: '"murid Tahun Enam" ialah Frasa Nama (orang/gelaran). Jadi gunakan BUKAN (Formula BNS: Bukan + Nama).'
  },
  {
    id: 'c2',
    phrase: 'pergi ke padang',
    category: 'FK',
    correctEngine: 'TIDAK',
    explanation: '"pergi" ialah Frasa Kerja (perbuatan). Jadi gunakan TIDAK (Formula TKA: Tidak + Kerja).'
  },
  {
    id: 'c3',
    phrase: 'daripada kayu jati',
    category: 'FSN',
    correctEngine: 'BUKAN',
    explanation: '"daripada" ialah kata sendi nama (Frasa Sendi Nama). Jadi gunakan BUKAN (Formula BNS: Bukan + Sendi).'
  },
  {
    id: 'c4',
    phrase: 'sangat masam',
    category: 'FA',
    correctEngine: 'TIDAK',
    explanation: '"masam" ialah Frasa Adjektif (sifat/keadaan). Jadi gunakan TIDAK (Formula TKA: Tidak + Adjektif).'
  },
  {
    id: 'c5',
    phrase: 'doktor pakar bedah',
    category: 'FN',
    correctEngine: 'BUKAN',
    explanation: '"doktor" ialah Frasa Nama (jawatan/orang). Jadi gunakan BUKAN (Formula BukanNama).'
  },
  {
    id: 'c6',
    phrase: 'tidur dengan lena',
    category: 'FK',
    correctEngine: 'TIDAK',
    explanation: '"tidur" ialah Frasa Kerja (perbuatan). Jadi gunakan TIDAK (Formula tidakKerjA).'
  },
  {
    id: 'c7',
    phrase: 'untuk adik bongsu',
    category: 'FSN',
    correctEngine: 'BUKAN',
    explanation: '"untuk" ialah kata sendi nama (FSN). Jadi gunakan BUKAN (Formula B.N.S).'
  },
  {
    id: 'c8',
    phrase: 'terlalu sempit',
    category: 'FA',
    correctEngine: 'TIDAK',
    explanation: '"sempit" ialah Frasa Adjektif (sifat saiz). Jadi gunakan TIDAK (Formula T.K.A).'
  }
];

// Aras 2: Isi Tempat Kosong (8 Soalan)
export const LEVEL_2_QUESTIONS: Question[] = [
  {
    id: 'q2-1',
    sentence: 'Kereta merah yang dipandu oleh ayah itu _____ kereta baharu.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FN',
    categoryLabel: 'Frasa Nama (FN)',
    explanation: '"kereta baharu" ialah Frasa Nama (benda). Gunakan BUKAN di hadapan Frasa Nama.',
    audioPrompt: 'Kereta merah yang dipandu oleh ayah itu tempat kosong kereta baharu.'
  },
  {
    id: 'q2-2',
    sentence: 'Adik bongsu saya _____ mahu makan ubat yang pahit itu.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FK',
    categoryLabel: 'Frasa Kerja (FK)',
    explanation: '"mahu makan" ialah Frasa Kerja (perbuatan). Gunakan TIDAK di hadapan Frasa Kerja.',
    audioPrompt: 'Adik bongsu saya tempat kosong mahu makan ubat yang pahit itu.'
  },
  {
    id: 'q2-3',
    sentence: 'Hadiah istimewa ini _____ untuk Ali, sebaliknya untuk adiknya.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FSN',
    categoryLabel: 'Frasa Sendi Nama (FSN)',
    explanation: '"untuk Ali" bermula dengan kata sendi nama "untuk". Gunakan BUKAN di hadapan Frasa Sendi Nama.',
    audioPrompt: 'Hadiah istimewa ini tempat kosong untuk Ali, sebaliknya untuk adiknya.'
  },
  {
    id: 'q2-4',
    sentence: 'Air sungai di hulu itu _____ dalam seperti yang disangka oleh pemancing.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FA',
    categoryLabel: 'Frasa Adjektif (FA)',
    explanation: '"dalam" ialah Frasa Adjektif (sifat ukuran). Gunakan TIDAK di hadapan Frasa Adjektif.',
    audioPrompt: 'Air sungai di hulu itu tempat kosong dalam seperti yang disangka oleh pemancing.'
  },
  {
    id: 'q2-5',
    sentence: 'Murid pintar itu _____ malas mengulang kaji, tetapi kepalanya berasa pening.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'PERTENTANGAN',
    categoryLabel: 'Kes Istimewa (Pertentangan)',
    explanation: 'KES ISTIMEWA: Walaupun "malas" ialah kata adjektif, terdapat unsur pertentangan (...tetapi...), maka gunakan BUKAN.',
    audioPrompt: 'Murid pintar itu tempat kosong malas mengulang kaji, tetapi kepalanya berasa pening.'
  },
  {
    id: 'q2-6',
    sentence: 'Bapa _____ sempat membaca surat khabar pagi tadi kerana tergesa-gesa ke pejabat.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FK',
    categoryLabel: 'Frasa Kerja (FK)',
    explanation: '"sempat membaca" ialah Frasa Kerja. Gunakan TIDAK di hadapan Frasa Kerja.',
    audioPrompt: 'Bapa tempat kosong sempat membaca surat khabar pagi tadi kerana tergesa-gesa ke pejabat.'
  },
  {
    id: 'q2-7',
    sentence: 'Pemberita itu menyatakan bahawa kemalangan jalan raya semalam _____ berpunca daripada kecuaian.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FSN',
    categoryLabel: 'Frasa Sendi Nama (FSN)',
    explanation: '"daripada kecuaian" mempunyai kata sendi "daripada" (FSN). Gunakan BUKAN.',
    audioPrompt: 'Pemberita itu menyatakan bahawa kemalangan jalan raya semalam tempat kosong berpunca daripada kecuaian.'
  },
  {
    id: 'q2-8',
    sentence: 'Pemandangan di puncak bukit itu _____ indah sangat kerana cuaca berjerebu.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FA',
    categoryLabel: 'Frasa Adjektif (FA)',
    explanation: '"indah sangat" ialah Frasa Adjektif (sifat keadaan). Gunakan TIDAK.',
    audioPrompt: 'Pemandangan di puncak bukit itu tempat kosong indah sangat kerana cuaca berjerebu.'
  }
];

// Aras 3: Padanan Ayat (8 Soalan)
export const LEVEL_3_PAIRS: MatchPair[] = [
  {
    id: 'p1',
    leftSubject: 'Lelaki berbaju Melayu itu BUKAN',
    connector: 'BUKAN',
    rightPredicate: 'guru besar sekolah kami.',
    category: 'FN',
    explanation: '"guru besar" ialah Frasa Nama (jawatan), jadi padanannya ialah BUKAN.'
  },
  {
    id: 'p2',
    leftSubject: 'Pak Mat TIDAK',
    connector: 'TIDAK',
    rightPredicate: 'turun ke laut menangkap ikan hari ini.',
    category: 'FK',
    explanation: '"turun ke laut" ialah Frasa Kerja (tindakan), jadi padanannya ialah TIDAK.'
  },
  {
    id: 'p3',
    leftSubject: 'Bungkusan pos laju ini BUKAN',
    connector: 'BUKAN',
    rightPredicate: 'dari pejabat pos cawangan bandar.',
    category: 'FSN',
    explanation: '"dari" ialah kata sendi nama, jadi padanannya ialah BUKAN.'
  },
  {
    id: 'p4',
    leftSubject: 'Rumah kayu yang usang itu TIDAK',
    connector: 'TIDAK',
    rightPredicate: 'selamat untuk didiami lagi.',
    category: 'FA',
    explanation: '"selamat" ialah Frasa Adjektif (keadaan), jadi padanannya ialah TIDAK.'
  },
  {
    id: 'p5',
    leftSubject: 'Surat rasmi ini BUKAN',
    connector: 'BUKAN',
    rightPredicate: 'untuk ketua kolej.',
    category: 'FSN',
    explanation: '"untuk ketua kolej" ialah Frasa Sendi Nama, jadi padanannya ialah BUKAN.'
  },
  {
    id: 'p6',
    leftSubject: 'Pemain bola sepak handalan itu TIDAK',
    connector: 'TIDAK',
    rightPredicate: 'berpuas hati dengan prestasinya.',
    category: 'FA',
    explanation: '"berpuas hati" ialah keadaan emosi (Frasa Adjektif), jadi padanannya ialah TIDAK.'
  },
  {
    id: 'p7',
    leftSubject: 'Penyanyi cilik itu BUKAN',
    connector: 'BUKAN',
    rightPredicate: 'sahaja berbakat, tetapi juga ramah.',
    category: 'PERTENTANGAN',
    explanation: 'Kes Istimewa: Unsur pertentangan "bukan sahaja..., tetapi..." menggunakan BUKAN.'
  },
  {
    id: 'p8',
    leftSubject: 'Pelancong asing itu TIDAK',
    connector: 'TIDAK',
    rightPredicate: 'faham akan bahasa Melayu.',
    category: 'FK',
    explanation: '"faham" melibatkan perbuatan akal / kata kerja, jadi padanannya ialah TIDAK.'
  }
];

// Aras 4: Teka Silang Kata (8 Soalan)
export const LEVEL_4_CLUES: CrosswordClue[] = [
  {
    id: 'cw-1',
    number: 1,
    direction: 'melintang',
    row: 0,
    col: 0,
    answer: 'BUKAN',
    clue: 'Kata nafi di hadapan "warganegara Malaysia" (Frasa Nama).',
    category: 'FN',
    explanation: '"warganegara" ialah kata nama. Kata nafi yang betul ialah BUKAN.'
  },
  {
    id: 'cw-2',
    number: 2,
    direction: 'menegak',
    row: 0,
    col: 2,
    answer: 'TIDAK',
    clue: 'Kata nafi di hadapan "berasa takut" (Frasa Adjektif / Emosi).',
    category: 'FA',
    explanation: '"berasa takut" menyatakan sifat perasaan. Kata nafi yang betul ialah TIDAK.'
  },
  {
    id: 'cw-3',
    number: 3,
    direction: 'melintang',
    row: 2,
    col: 0,
    answer: 'BUKAN',
    clue: 'Kata nafi di hadapan "daripada bahan tiruan" (Frasa Sendi Nama).',
    category: 'FSN',
    explanation: '"daripada" ialah kata sendi nama. Kata nafi yang betul ialah BUKAN.'
  },
  {
    id: 'cw-4',
    number: 4,
    direction: 'menegak',
    row: 1,
    col: 4,
    answer: 'TIDAK',
    clue: 'Kata nafi di hadapan "mahu mengaku kalah" (Frasa Kerja).',
    category: 'FK',
    explanation: '"mengaku kalah" ialah perbuatan (Frasa Kerja). Kata nafi yang betul ialah TIDAK.'
  },
  {
    id: 'cw-5',
    number: 5,
    direction: 'melintang',
    row: 4,
    col: 1,
    answer: 'BUKAN',
    clue: 'Kes Istimewa: "Dia _____ kedekut, tetapi dia berjimat cermat."',
    category: 'PERTENTANGAN',
    explanation: 'Ada unsur pertentangan (...tetapi...), maka gunakan BUKAN.'
  },
  {
    id: 'cw-6',
    number: 6,
    direction: 'menegak',
    row: 0,
    col: 0,
    answer: 'BUKAN',
    clue: 'Kata nafi di hadapan frasa "ke Kuala Lumpur" (Frasa Sendi Nama).',
    category: 'FSN',
    explanation: '"ke" ialah kata sendi nama arah. Kata nafi yang tepat ialah BUKAN.'
  },
  {
    id: 'cw-7',
    number: 7,
    direction: 'melintang',
    row: 6,
    col: 0,
    answer: 'TIDAK',
    clue: 'Kata nafi di hadapan frasa "mahir bertutur" (Frasa Adjektif).',
    category: 'FA',
    explanation: '"mahir" ialah kata adjektif sifat akal. Gunakan TIDAK.'
  },
  {
    id: 'cw-8',
    number: 8,
    direction: 'menegak',
    row: 3,
    col: 3,
    answer: 'TIDAK',
    clue: 'Kata nafi di hadapan perkataan "berlari" (Frasa Kerja).',
    category: 'FK',
    explanation: '"berlari" ialah perbuatan cergas (Frasa Kerja). Gunakan TIDAK.'
  }
];

// Mod Bonus: Cabaran 5 Saat (10 Soalan Pantas)
export const BONUS_QUESTIONS: Question[] = [
  {
    id: 'bq-1',
    sentence: 'Jam tangan ini _____ jam tangan tiruan.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FN',
    categoryLabel: 'Frasa Nama',
    explanation: 'Jam tangan = FN (Benda) -> BUKAN',
    audioPrompt: 'Jam tangan ini tempat kosong jam tangan tiruan.'
  },
  {
    id: 'bq-2',
    sentence: 'Adik _____ mahu tidur siang.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FK',
    categoryLabel: 'Frasa Kerja',
    explanation: 'Mahu tidur = FK (Kerja) -> TIDAK',
    audioPrompt: 'Adik tempat kosong mahu tidur siang.'
  },
  {
    id: 'bq-3',
    sentence: 'Baju kurung itu _____ untuk kakak saya.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FSN',
    categoryLabel: 'Frasa Sendi Nama',
    explanation: 'Untuk = Sendi Nama (FSN) -> BUKAN',
    audioPrompt: 'Baju kurung itu tempat kosong untuk kakak saya.'
  },
  {
    id: 'bq-4',
    sentence: 'Penyanyi itu _____ sombong walaupun popular.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FA',
    categoryLabel: 'Frasa Adjektif',
    explanation: 'Sombong = Sifat (FA) -> TIDAK',
    audioPrompt: 'Penyanyi itu tempat kosong sombong walaupun popular.'
  },
  {
    id: 'bq-5',
    sentence: 'Beliau _____ doktor haiwan.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FN',
    categoryLabel: 'Frasa Nama',
    explanation: 'Doktor = Jawatan (FN) -> BUKAN',
    audioPrompt: 'Beliau tempat kosong doktor haiwan.'
  },
  {
    id: 'bq-6',
    sentence: 'Burung helang itu _____ terbang tinggi hari ini.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FK',
    categoryLabel: 'Frasa Kerja',
    explanation: 'Terbang = Tindakan (FK) -> TIDAK',
    audioPrompt: 'Burung helang itu tempat kosong terbang tinggi hari ini.'
  },
  {
    id: 'bq-7',
    sentence: 'Hadiah ini _____ daripada pengetua.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FSN',
    categoryLabel: 'Frasa Sendi Nama',
    explanation: 'Daripada = Kata Sendi (FSN) -> BUKAN',
    audioPrompt: 'Hadiah ini tempat kosong daripada pengetua.'
  },
  {
    id: 'bq-8',
    sentence: 'Dia _____ merajuk, tetapi dia mengantuk.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'PERTENTANGAN',
    categoryLabel: 'Kes Pertentangan',
    explanation: 'Ada "...tetapi..." -> BUKAN',
    audioPrompt: 'Dia tempat kosong merajuk, tetapi dia mengantuk.'
  },
  {
    id: 'bq-9',
    sentence: 'Kuah kari itu _____ pedas langsung.',
    answer: 'TIDAK',
    options: ['BUKAN', 'TIDAK'],
    category: 'FA',
    categoryLabel: 'Frasa Adjektif',
    explanation: 'Pedas = Rasa/Sifat (FA) -> TIDAK',
    audioPrompt: 'Kuah kari itu tempat kosong pedas langsung.'
  },
  {
    id: 'bq-10',
    sentence: 'Itu _____ basikal kepunyaan Amin.',
    answer: 'BUKAN',
    options: ['BUKAN', 'TIDAK'],
    category: 'FN',
    categoryLabel: 'Frasa Nama',
    explanation: 'Basikal = Objek (FN) -> BUKAN',
    audioPrompt: 'Itu tempat kosong basikal kepunyaan Amin.'
  }
];
