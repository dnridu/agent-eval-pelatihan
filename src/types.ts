export interface TrainingSummary {
  theme: string;
  startDate: string;
  endDate: string;
  method: 'Online / Daring' | 'Offline / Klasikal' | 'Blended Learning';
  targetBatch: string;
  organizer: string;
  registeredCount: number;
  acceptedCount: number;
  passThreshold: number; // e.g. 70
  scoreScale: number; // e.g. 100
  learningObjectives?: string;
  officialReference?: string;
}

export interface ParticipantRecord {
  id: string; // Anonymous ID e.g. P001
  gender: 'L' | 'P';
  agency: string; // Instansi
  domicile: string; // Domisili (Kota/Kab/Provinsi)
  pretestScore: number | null;
  posttestScore: number | null;
  statusLulus: 'LULUS' | 'TIDAK LULUS' | string;
  _rowNumber?: number;
}

export interface EvaluationRecord {
  id?: string;
  aspect: string;
  target: 'Pengajar' | 'Panitia';
  score: number;
  scale: number;
  comment: string;
  _rowNumber?: number;
}

export type AnomalySeverity = 'ringan' | 'berat';

export interface AnomalyItem {
  id: string;
  type: 'NILAI_KOSONG' | 'DILUAR_RENTANG' | 'ID_GANDA' | 'STATUS_TIDAK_COCOK' | 'JUMLAH_TIDAK_SESUAI' | 'FORMAT_TIDAK_VALID';
  severity: AnomalySeverity;
  sourceFile: 'data_peserta' | 'evaluasi' | 'ringkasan';
  rowNumber?: number;
  recordId?: string;
  field: string;
  description: string;
  value?: string | number | null;
  actionTaken: 'Dikecualikan dari perhitungan' | 'Dihentikan untuk perbaikan' | 'Dicatat dalam keterbatasan';
}

export interface DataQualityResult {
  isValid: boolean;
  canProceed: boolean; // false if severe anomalies exist
  severeCount: number;
  minorCount: number;
  anomalies: AnomalyItem[];
  totalRawParticipants: number;
  validParticipantCount: number;
  excludedParticipantCount: number;
  totalRawEvaluations: number;
  validEvaluationCount: number;
  decisionMessage: string;
}

export interface ScoreDistribution {
  bracket: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface StatisticsResult {
  summary: {
    registeredCount: number;
    acceptedCount: number;
    activeCount: number;
    passedCount: number;
    failedCount: number;
    passRate: number; // percentage e.g. 92.5
    genderStats: {
      maleCount: number;
      malePassed: number;
      malePassRate: number;
      femaleCount: number;
      femalePassed: number;
      femalePassRate: number;
    };
    domicileBreakdown: { domicile: string; count: number; percentage: number }[];
  };
  learningMetrics: {
    pretest: {
      mean: number;
      min: number;
      max: number;
      median: number;
      stdDev: number;
    };
    posttest: {
      mean: number;
      min: number;
      max: number;
      median: number;
      stdDev: number;
    };
    deltaMean: number; // post.mean - pre.mean
    normalizedGain: {
      meanNGain: number; // 0 - 1
      category: 'Tinggi (g ≥ 0.7)' | 'Sedang (0.3 ≤ g < 0.7)' | 'Rendah (g < 0.3)';
      highCount: number;
      mediumCount: number;
      lowCount: number;
    };
    scoreDistributions: {
      pretest: ScoreDistribution[];
      posttest: ScoreDistribution[];
    };
  };
  evaluationMetrics: {
    instructor: {
      aspects: { aspect: string; meanScore: number; scale: number; percentage: number }[];
      overallMean: number;
      scale: number;
      percentage: number;
    };
    committee: {
      aspects: { aspect: string; meanScore: number; scale: number; percentage: number }[];
      overallMean: number;
      scale: number;
      percentage: number;
    };
    totalComments: number;
  };
}

export interface CommentQuote {
  quote: string;
  aspect?: string;
  sentiment: 'Positif' | 'Netral' | 'Perlu Perbaikan';
  isVerified?: boolean;
}

export interface CommentTheme {
  themeName: string;
  target: 'Pengajar' | 'Panitia' | 'Materi/Fasilitas';
  sentiment: 'Positif' | 'Netral' | 'Perlu Perbaikan';
  frequency: number;
  summary: string;
  verbatimQuotes: string[];
}

export interface KeyFinding {
  id: string;
  category: 'Capaian Pembelajaran' | 'Tingkat Kelulusan' | 'Kualitas Pengajar' | 'Penyelenggaraan Panitia' | 'Demografi & Partisipasi';
  statement: string;
  sourceData: string; // Explicit data source citation e.g. "Statistik Hasil Belajar: Rata-rata post-test 84.2 (+22.8) & N-Gain 0.62"
  isVerified: boolean;
  notes?: string;
}

export interface Recommendation {
  id: string;
  area: 'Kurikulum & Materi' | 'Metode & Pengajar' | 'Sarana & Panitia' | 'Seleksi & Tindak Lanjut';
  action: string;
  rationale: string;
  linkedFinding: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
}

export interface DraftReport {
  status: 'Draf, perlu ditinjau' | 'Final, telah disetujui';
  generatedAt: string;
  reviewedBy?: string;
  sections: {
    executiveSummary: string;
    implementationSummary: string;
    dataQualityNote: string;
    learningOutcomesAnalysis: string;
    instructorAndCommitteeEvaluation: string;
    commentThematicAnalysis: string;
    keyFindings: KeyFinding[];
    limitations: string[]; // Explicit statement of missing data/analysis limitations
    recommendations: Recommendation[];
  };
}

export interface AgentAnalysisResponse {
  success: boolean;
  source: 'gemini' | 'algorithmic_fallback';
  modelUsed?: string;
  executionTimeMs: number;
  commentThemes: CommentTheme[];
  findings: KeyFinding[];
  recommendations: Recommendation[];
  limitations: string[];
  executiveSummaryText: string;
  dataQualityNarrative: string;
  verificationReport: {
    totalFindings: number;
    verifiedFindings: number;
    quoteVerifications: { quote: string; foundInInput: boolean }[];
  };
  error?: string;
}
