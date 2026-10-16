import {
  TrainingSummary,
  ParticipantRecord,
  EvaluationRecord,
  DataQualityResult,
  AnomalyItem,
  StatisticsResult,
  ScoreDistribution
} from '../types';

/**
 * Stage 1: Quality Check and Anomaly Detection (FR-02)
 * Detects missing values, out of range, duplicate IDs, headcount discrepancy, and status mismatch.
 */
export function checkDataQuality(
  summary: TrainingSummary,
  rawParticipants: ParticipantRecord[],
  rawEvaluations: EvaluationRecord[]
): DataQualityResult {
  const anomalies: AnomalyItem[] = [];
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  // 1. Check participant headcount discrepancy
  if (rawParticipants.length !== summary.acceptedCount) {
    anomalies.push({
      id: `anom-hc-1`,
      type: 'JUMLAH_TIDAK_SESUAI',
      severity: 'ringan',
      sourceFile: 'ringkasan',
      field: 'acceptedCount',
      description: `Jumlah data peserta di berkas CSV (${rawParticipants.length} orang) berbeda dengan isian form ringkasan (${summary.acceptedCount} diterima).`,
      value: `CSV: ${rawParticipants.length} vs Form: ${summary.acceptedCount}`,
      actionTaken: 'Dicatat dalam keterbatasan'
    });
  }

  // Track counts of issues to determine severity threshold
  let missingPostCount = 0;
  const invalidParticipantIndices = new Set<number>();
  const invalidEvalIndices = new Set<number>();

  // 2. Scan participants
  rawParticipants.forEach((p, idx) => {
    const rowNum = p._rowNumber ?? idx + 2;

    // A. Check duplicate ID
    if (seenIds.has(p.id)) {
      duplicateIds.add(p.id);
      anomalies.push({
        id: `anom-dup-${idx}`,
        type: 'ID_GANDA',
        severity: 'ringan',
        sourceFile: 'data_peserta',
        rowNumber: rowNum,
        recordId: p.id,
        field: 'id',
        description: `ID Peserta '${p.id}' muncul lebih dari satu kali pada baris ${rowNum}.`,
        value: p.id,
        actionTaken: 'Dikecualikan dari perhitungan'
      });
      invalidParticipantIndices.add(idx);
    } else {
      seenIds.add(p.id);
    }

    // B. Check missing pretest / posttest
    if (p.pretestScore === null || isNaN(p.pretestScore)) {
      anomalies.push({
        id: `anom-pre-null-${idx}`,
        type: 'NILAI_KOSONG',
        severity: 'ringan',
        sourceFile: 'data_peserta',
        rowNumber: rowNum,
        recordId: p.id,
        field: 'nilai_pretest',
        description: `Nilai pre-test kosong atau bukan angka pada peserta ${p.id}.`,
        value: null,
        actionTaken: 'Dikecualikan dari perhitungan'
      });
      invalidParticipantIndices.add(idx);
    }

    if (p.posttestScore === null || isNaN(p.posttestScore)) {
      missingPostCount++;
      anomalies.push({
        id: `anom-post-null-${idx}`,
        type: 'NILAI_KOSONG',
        severity: 'ringan',
        sourceFile: 'data_peserta',
        rowNumber: rowNum,
        recordId: p.id,
        field: 'nilai_posttest',
        description: `Nilai post-test kosong atau tidak terekam pada peserta ${p.id}.`,
        value: null,
        actionTaken: 'Dikecualikan dari perhitungan'
      });
      invalidParticipantIndices.add(idx);
    }

    // C. Check out-of-range values
    if (p.pretestScore !== null && !isNaN(p.pretestScore)) {
      if (p.pretestScore < 0 || p.pretestScore > summary.scoreScale) {
        anomalies.push({
          id: `anom-pre-range-${idx}`,
          type: 'DILUAR_RENTANG',
          severity: 'ringan',
          sourceFile: 'data_peserta',
          rowNumber: rowNum,
          recordId: p.id,
          field: 'nilai_pretest',
          description: `Nilai pre-test (${p.pretestScore}) berada di luar rentang skala 0 - ${summary.scoreScale}.`,
          value: p.pretestScore,
          actionTaken: 'Dikecualikan dari perhitungan'
        });
        invalidParticipantIndices.add(idx);
      }
    }

    if (p.posttestScore !== null && !isNaN(p.posttestScore)) {
      if (p.posttestScore < 0 || p.posttestScore > summary.scoreScale) {
        anomalies.push({
          id: `anom-post-range-${idx}`,
          type: 'DILUAR_RENTANG',
          severity: 'ringan',
          sourceFile: 'data_peserta',
          rowNumber: rowNum,
          recordId: p.id,
          field: 'nilai_posttest',
          description: `Nilai post-test (${p.posttestScore}) berada di luar rentang skala 0 - ${summary.scoreScale}.`,
          value: p.posttestScore,
          actionTaken: 'Dikecualikan dari perhitungan'
        });
        invalidParticipantIndices.add(idx);
      }
    }

    // D. Check status kelulusan mismatch with passThreshold
    if (p.posttestScore !== null && !isNaN(p.posttestScore) && p.posttestScore >= 0 && p.posttestScore <= summary.scoreScale) {
      const shouldPass = p.posttestScore >= summary.passThreshold;
      const reportedPass = p.statusLulus.toUpperCase().includes('LULUS') && !p.statusLulus.toUpperCase().includes('TIDAK');

      if (shouldPass !== reportedPass) {
        anomalies.push({
          id: `anom-status-mis-${idx}`,
          type: 'STATUS_TIDAK_COCOK',
          severity: 'ringan',
          sourceFile: 'data_peserta',
          rowNumber: rowNum,
          recordId: p.id,
          field: 'status_kelulusan',
          description: `Ketidaksesuaian status lulus pada peserta ${p.id}: nilai post-test ${p.posttestScore} (ambang kelulusan ${summary.passThreshold}), tetapi tertulis '${p.statusLulus}'. Sistem akan menyelaraskan berdasarkan kriteria baku.`,
          value: `Nilai: ${p.posttestScore}, Status: ${p.statusLulus}`,
          actionTaken: 'Dicatat dalam keterbatasan'
        });
      }
    }
  });

  // 3. Scan evaluations
  rawEvaluations.forEach((e, idx) => {
    const rowNum = e._rowNumber ?? idx + 2;
    if (e.score < 0 || e.score > e.scale) {
      anomalies.push({
        id: `anom-eval-range-${idx}`,
        type: 'DILUAR_RENTANG',
        severity: 'ringan',
        sourceFile: 'evaluasi',
        rowNumber: rowNum,
        field: 'skor',
        description: `Skor evaluasi aspek '${e.aspect}' (${e.score}) melebihi skala maksimum (${e.scale}).`,
        value: `${e.score}/${e.scale}`,
        actionTaken: 'Dikecualikan dari perhitungan'
      });
      invalidEvalIndices.add(idx);
    }
  });

  // Agent Gating Rule:
  // "Jika pemeriksaan data menemukan masalah berat (misalnya lebih dari separuh nilai post-test kosong),
  // agent berhenti dan meminta pengguna memperbaiki data, bukan melanjutkan."
  const postTestMissingRatio = rawParticipants.length > 0 ? missingPostCount / rawParticipants.length : 0;
  const isSevere = postTestMissingRatio >= 0.5;

  if (isSevere) {
    anomalies.unshift({
      id: 'anom-severe-halt',
      type: 'NILAI_KOSONG',
      severity: 'berat',
      sourceFile: 'data_peserta',
      field: 'nilai_posttest',
      description: `MASALAH BERAT: ${missingPostCount} dari ${rawParticipants.length} peserta (${(postTestMissingRatio * 100).toFixed(1)}%) tidak memiliki nilai post-test. Proses analisis dihentikan untuk menjamin akurasi evaluasi.`,
      value: `${(postTestMissingRatio * 100).toFixed(1)}% kosong`,
      actionTaken: 'Dihentikan untuk perbaikan'
    });
  }

  const severeCount = anomalies.filter(a => a.severity === 'berat').length;
  const minorCount = anomalies.filter(a => a.severity === 'ringan').length;

  const validParticipantCount = rawParticipants.length - invalidParticipantIndices.size;
  const validEvaluationCount = rawEvaluations.length - invalidEvalIndices.size;

  let decisionMessage = 'Kualitas data baik dan memenuhi syarat analisis.';
  if (severeCount > 0) {
    decisionMessage = 'Agent MENGHENTIKAN proses: Ditemukan masalah berat pada integritas data. Harap perbaiki berkas CSV sesuai panduan.';
  } else if (minorCount > 0) {
    decisionMessage = `Agent MENERUSKAN analisis dengan pengecualian: Ditemukan ${minorCount} anomali ringan. Data bermasalah dikecualikan dan dicatat pada bagian Keterbatasan Analisis.`;
  }

  return {
    isValid: severeCount === 0 && minorCount === 0,
    canProceed: severeCount === 0,
    severeCount,
    minorCount,
    anomalies,
    totalRawParticipants: rawParticipants.length,
    validParticipantCount: Math.max(0, validParticipantCount),
    excludedParticipantCount: invalidParticipantIndices.size,
    totalRawEvaluations: rawEvaluations.length,
    validEvaluationCount: Math.max(0, validEvaluationCount),
    decisionMessage
  };
}

/**
 * Filter valid records for deterministic statistical calculation
 */
export function getValidRecords(
  summary: TrainingSummary,
  rawParticipants: ParticipantRecord[],
  rawEvaluations: EvaluationRecord[],
  quality: DataQualityResult
): { validParticipants: ParticipantRecord[]; validEvaluations: EvaluationRecord[] } {
  const seenIds = new Set<string>();

  const validParticipants = rawParticipants.filter(p => {
    // Check duplicate ID
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);

    // Check null or NaN
    if (p.pretestScore === null || isNaN(p.pretestScore)) return false;
    if (p.posttestScore === null || isNaN(p.posttestScore)) return false;

    // Check range
    if (p.pretestScore < 0 || p.pretestScore > summary.scoreScale) return false;
    if (p.posttestScore < 0 || p.posttestScore > summary.scoreScale) return false;

    return true;
  });

  const validEvaluations = rawEvaluations.filter(e => {
    return e.score >= 0 && e.score <= e.scale && !isNaN(e.score);
  });

  return { validParticipants, validEvaluations };
}

/**
 * Stage 2: 100% Deterministic Statistical Computation (FR-03)
 */
export function calculateStatistics(
  summary: TrainingSummary,
  participants: ParticipantRecord[],
  evaluations: EvaluationRecord[]
): StatisticsResult {
  const activeCount = participants.length;
  
  // Calculate pass count deterministically using the summary passThreshold
  let passedCount = 0;
  let maleCount = 0;
  let malePassed = 0;
  let femaleCount = 0;
  let femalePassed = 0;

  const preScores: number[] = [];
  const postScores: number[] = [];
  const nGains: number[] = [];

  const domicileMap: Record<string, number> = {};

  participants.forEach(p => {
    const pre = p.pretestScore ?? 0;
    const post = p.posttestScore ?? 0;
    preScores.push(pre);
    postScores.push(post);

    const isPassed = post >= summary.passThreshold;
    if (isPassed) passedCount++;

    if (p.gender === 'L') {
      maleCount++;
      if (isPassed) malePassed++;
    } else {
      femaleCount++;
      if (isPassed) femalePassed++;
    }

    // Domicile
    const dom = p.domicile.trim() || 'Lainnya';
    domicileMap[dom] = (domicileMap[dom] || 0) + 1;

    // Hake's Normalized Gain (N-Gain)
    // formula: (post - pre) / (maxScore - pre)
    const max = summary.scoreScale;
    if (max > pre) {
      const g = (post - pre) / (max - pre);
      nGains.push(g);
    }
  });

  const failedCount = activeCount - passedCount;
  const passRate = activeCount > 0 ? (passedCount / activeCount) * 100 : 0;
  const malePassRate = maleCount > 0 ? (malePassed / maleCount) * 100 : 0;
  const femalePassRate = femaleCount > 0 ? (femalePassed / femaleCount) * 100 : 0;

  // Domicile breakdown sorted desc
  const domicileBreakdown = Object.entries(domicileMap)
    .map(([domicile, count]) => ({
      domicile,
      count,
      percentage: activeCount > 0 ? (count / activeCount) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Pre-test stats
  const preMean = preScores.length > 0 ? preScores.reduce((a, b) => a + b, 0) / preScores.length : 0;
  const preMin = preScores.length > 0 ? Math.min(...preScores) : 0;
  const preMax = preScores.length > 0 ? Math.max(...preScores) : 0;
  const preSorted = [...preScores].sort((a, b) => a - b);
  const preMedian = preSorted.length > 0 ? (preSorted[Math.floor(preSorted.length / 2)] + preSorted[Math.ceil((preSorted.length - 1) / 2)]) / 2 : 0;
  const preStdDev = preScores.length > 1
    ? Math.sqrt(preScores.reduce((acc, val) => acc + Math.pow(val - preMean, 2), 0) / (preScores.length - 1))
    : 0;

  // Post-test stats
  const postMean = postScores.length > 0 ? postScores.reduce((a, b) => a + b, 0) / postScores.length : 0;
  const postMin = postScores.length > 0 ? Math.min(...postScores) : 0;
  const postMax = postScores.length > 0 ? Math.max(...postScores) : 0;
  const postSorted = [...postScores].sort((a, b) => a - b);
  const postMedian = postSorted.length > 0 ? (postSorted[Math.floor(postSorted.length / 2)] + postSorted[Math.ceil((postSorted.length - 1) / 2)]) / 2 : 0;
  const postStdDev = postScores.length > 1
    ? Math.sqrt(postScores.reduce((acc, val) => acc + Math.pow(val - postMean, 2), 0) / (postScores.length - 1))
    : 0;

  // Normalized Gain stats
  const meanNGain = nGains.length > 0 ? nGains.reduce((a, b) => a + b, 0) / nGains.length : 0;
  let highGainCount = 0;
  let medGainCount = 0;
  let lowGainCount = 0;

  nGains.forEach(g => {
    if (g >= 0.7) highGainCount++;
    else if (g >= 0.3) medGainCount++;
    else lowGainCount++;
  });

  let nGainCategory: 'Tinggi (g ≥ 0.7)' | 'Sedang (0.3 ≤ g < 0.7)' | 'Rendah (g < 0.3)';
  if (meanNGain >= 0.7) nGainCategory = 'Tinggi (g ≥ 0.7)';
  else if (meanNGain >= 0.3) nGainCategory = 'Sedang (0.3 ≤ g < 0.7)';
  else nGainCategory = 'Rendah (g < 0.3)';

  // Score distributions (<60, 60-69, 70-79, 80-89, 90-100)
  const brackets = [
    { bracket: '< 60 (Kurang)', min: 0, max: 59.99 },
    { bracket: '60 - 69 (Cukup)', min: 60, max: 69.99 },
    { bracket: '70 - 79 (Baik)', min: 70, max: 79.99 },
    { bracket: '80 - 89 (Sangat Baik)', min: 80, max: 89.99 },
    { bracket: '90 - 100 (Istimewa)', min: 90, max: 100 }
  ];

  const buildDistribution = (scores: number[]): ScoreDistribution[] => {
    return brackets.map(b => {
      const count = scores.filter(s => s >= b.min && s <= b.max).length;
      return {
        bracket: b.bracket,
        min: b.min,
        max: b.max,
        count,
        percentage: scores.length > 0 ? (count / scores.length) * 100 : 0
      };
    });
  };

  // Evaluation ratings by target & aspect
  const instructorAspectsMap: Record<string, { sum: number; count: number; scale: number }> = {};
  const committeeAspectsMap: Record<string, { sum: number; count: number; scale: number }> = {};
  let totalComments = 0;

  evaluations.forEach(e => {
    if (e.comment && e.comment.trim().length > 0) totalComments++;

    const map = e.target === 'Pengajar' ? instructorAspectsMap : committeeAspectsMap;
    if (!map[e.aspect]) {
      map[e.aspect] = { sum: 0, count: 0, scale: e.scale };
    }
    map[e.aspect].sum += e.score;
    map[e.aspect].count += 1;
  });

  const formatAspectStats = (map: Record<string, { sum: number; count: number; scale: number }>) => {
    let totalScore = 0;
    let totalCount = 0;
    let baseScale = 5;

    const aspects = Object.entries(map).map(([aspect, data]) => {
      const mean = data.count > 0 ? data.sum / data.count : 0;
      totalScore += data.sum;
      totalCount += data.count;
      baseScale = data.scale || 5;
      return {
        aspect,
        meanScore: Math.round(mean * 100) / 100,
        scale: data.scale,
        percentage: data.scale > 0 ? (mean / data.scale) * 100 : 0
      };
    });

    const overallMean = totalCount > 0 ? totalScore / totalCount : 0;
    return {
      aspects,
      overallMean: Math.round(overallMean * 100) / 100,
      scale: baseScale,
      percentage: baseScale > 0 ? (overallMean / baseScale) * 100 : 0
    };
  };

  const instructorStats = formatAspectStats(instructorAspectsMap);
  const committeeStats = formatAspectStats(committeeAspectsMap);

  return {
    summary: {
      registeredCount: summary.registeredCount,
      acceptedCount: summary.acceptedCount,
      activeCount,
      passedCount,
      failedCount,
      passRate: Math.round(passRate * 10) / 10,
      genderStats: {
        maleCount,
        malePassed,
        malePassRate: Math.round(malePassRate * 10) / 10,
        femaleCount,
        femalePassed,
        femalePassRate: Math.round(femalePassRate * 10) / 10
      },
      domicileBreakdown
    },
    learningMetrics: {
      pretest: {
        mean: Math.round(preMean * 10) / 10,
        min: preMin,
        max: preMax,
        median: Math.round(preMedian * 10) / 10,
        stdDev: Math.round(preStdDev * 10) / 10
      },
      posttest: {
        mean: Math.round(postMean * 10) / 10,
        min: postMin,
        max: postMax,
        median: Math.round(postMedian * 10) / 10,
        stdDev: Math.round(postStdDev * 10) / 10
      },
      deltaMean: Math.round((postMean - preMean) * 10) / 10,
      normalizedGain: {
        meanNGain: Math.round(meanNGain * 100) / 100,
        category: nGainCategory,
        highCount: highGainCount,
        mediumCount: medGainCount,
        lowCount: lowGainCount
      },
      scoreDistributions: {
        pretest: buildDistribution(preScores),
        posttest: buildDistribution(postScores)
      }
    },
    evaluationMetrics: {
      instructor: instructorStats,
      committee: committeeStats,
      totalComments
    }
  };
}
