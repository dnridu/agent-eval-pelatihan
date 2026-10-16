import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SummaryForm } from './components/SummaryForm';
import { FileUploadSection } from './components/FileUploadSection';
import { DataPreviewAndQuality } from './components/DataPreviewAndQuality';
import { AgentProgressModal } from './components/AgentProgressModal';
import { ReportDashboard } from './components/ReportDashboard';
import {
  TrainingSummary,
  ParticipantRecord,
  EvaluationRecord,
  DataQualityResult,
  StatisticsResult,
  AgentAnalysisResponse
} from './types';
import {
  validateAndParseParticipants,
  validateAndParseEvaluations,
  ValidationResult
} from './utils/csvParser';
import { PRESET_VALID, PRESET_ANOMALY, PRESET_BPPTIK, PresetPackage } from './utils/sampleData';
import {
  checkDataQuality,
  getValidRecords,
  calculateStatistics
} from './utils/statisticsEngine';
import { generateAlgorithmicDraft } from './utils/geminiFallback';

export default function App() {
  // Ephemeral In-Memory API Key (FR-06 & NFR-06: Never in localStorage/cookies/URL)
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasServerApiKey, setHasServerApiKey] = useState(false);

  // Training summary metadata form state
  const [summary, setSummary] = useState<TrainingSummary>(PRESET_BPPTIK.summary);

  // Raw file contents and file names
  const [participantsCSV, setParticipantsCSV] = useState<string>(PRESET_BPPTIK.participantsCSV);
  const [evaluationsCSV, setEvaluationsCSV] = useState<string>(PRESET_BPPTIK.evaluationsCSV);
  const [participantsFileName, setParticipantsFileName] = useState<string>('data_peserta_bpptik_ai.csv');
  const [evaluationsFileName, setEvaluationsFileName] = useState<string>('evaluasi_survei_bpptik_kominfo.csv');

  // Validated parsed records
  const [participantsValidation, setParticipantsValidation] = useState<ValidationResult<ParticipantRecord> | null>(null);
  const [evaluationsValidation, setEvaluationsValidation] = useState<ValidationResult<EvaluationRecord> | null>(null);

  // Quality Audit Result
  const [qualityResult, setQualityResult] = useState<DataQualityResult | null>(null);

  // Statistical & Agent Analysis States
  const [statisticsResult, setStatisticsResult] = useState<StatisticsResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgentAnalysisResponse | null>(null);

  // Agent Execution Flow State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [stageMessage, setStageMessage] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Step tracker: 1 = Input, 2 = Quality, 3 = Processing, 4 = Report
  const currentStep = analysisResult ? 4 : isAnalyzing ? 3 : qualityResult ? 2 : 1;

  // Check server health and API key on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.hasServerApiKey) {
          setHasServerApiKey(true);
        }
      })
      .catch(() => {
        // Dev server or static
      });
  }, []);

  // Re-run parser whenever CSV strings change
  useEffect(() => {
    if (participantsCSV) {
      const pResult = validateAndParseParticipants(participantsCSV);
      setParticipantsValidation(pResult);
    } else {
      setParticipantsValidation(null);
    }
  }, [participantsCSV]);

  useEffect(() => {
    if (evaluationsCSV) {
      const eResult = validateAndParseEvaluations(evaluationsCSV);
      setEvaluationsValidation(eResult);
    } else {
      setEvaluationsValidation(null);
    }
  }, [evaluationsCSV]);

  // Re-run Data Quality inspection whenever validation data or summary parameters change
  useEffect(() => {
    if (
      participantsValidation &&
      participantsValidation.isValid &&
      evaluationsValidation &&
      evaluationsValidation.isValid
    ) {
      const quality = checkDataQuality(
        summary,
        participantsValidation.data,
        evaluationsValidation.data
      );
      setQualityResult(quality);
    } else {
      setQualityResult(null);
    }
  }, [summary, participantsValidation, evaluationsValidation]);

  // Preset Handlers
  const handleApplyPreset = (preset: PresetPackage) => {
    setSummary(preset.summary);
    setParticipantsCSV(preset.participantsCSV);
    setEvaluationsCSV(preset.evaluationsCSV);
    setParticipantsFileName(`${preset.id}_peserta.csv`);
    setEvaluationsFileName(`${preset.id}_evaluasi.csv`);
    setAnalysisResult(null);
    setApiErrorMessage(null);
  };

  const handleReset = () => {
    setSummary({
      theme: '',
      startDate: '',
      endDate: '',
      method: 'Blended Learning',
      targetBatch: '',
      organizer: 'Balai Pelatihan Talenta Komunikasi dan Digital',
      registeredCount: 0,
      acceptedCount: 0,
      passThreshold: 70,
      scoreScale: 100,
      learningObjectives: '',
      officialReference: ''
    });
    setParticipantsCSV('');
    setEvaluationsCSV('');
    setParticipantsFileName('');
    setEvaluationsFileName('');
    setAnalysisResult(null);
    setApiErrorMessage(null);
  };

  // Main AI Agent Execution Pipeline
  const handleStartAnalysis = async () => {
    if (!qualityResult || !qualityResult.canProceed || !participantsValidation || !evaluationsValidation) {
      return;
    }

    setIsAnalyzing(true);
    setApiErrorMessage(null);

    try {
      // Stage 1: Quality Check (Code)
      setActiveStage(1);
      setStageMessage('Tahap 1: Memeriksa kualitas data, anomali nilai, dan status kelulusan...');
      await new Promise(r => setTimeout(r, 600));

      const { validParticipants, validEvaluations } = getValidRecords(
        summary,
        participantsValidation.data,
        evaluationsValidation.data,
        qualityResult
      );

      // Stage 2: Deterministic Statistics Computation (Code - 100% accuracy)
      setActiveStage(2);
      setStageMessage('Tahap 2: Menghitung statistik hasil belajar, N-Gain Hake, dan rasio L/P...');
      await new Promise(r => setTimeout(r, 700));

      const stats = calculateStatistics(summary, validParticipants, validEvaluations);
      setStatisticsResult(stats);

      // Stage 3 & 4: Call Agent Backend (Gemini 3.8-Flash)
      setActiveStage(3);
      setStageMessage('Tahap 3: Menganalisis komentar terbuka peserta menjadi tema & sentimen...');
      await new Promise(r => setTimeout(r, 800));

      setActiveStage(4);
      setStageMessage('Tahap 4: Menyusun draf temuan utama dan rekomendasi berbasis data...');

      // Prepare payload (Zero PII per NFR-01: only unique comments and aggregated stats)
      const uniqueCommentsMap = new Map<string, { aspect: string; target: string; score: number; comment: string }>();
      validEvaluations.forEach(e => {
        const text = (e.comment || '').trim();
        if (text.length > 0 && text !== '-' && text !== '.') {
          if (!uniqueCommentsMap.has(text)) {
            uniqueCommentsMap.set(text, {
              aspect: e.aspect,
              target: e.target,
              score: e.score,
              comment: text
            });
          }
        }
      });
      const anonymousComments = Array.from(uniqueCommentsMap.values());

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (apiKey && apiKey.trim().length > 0) {
        headers['x-gemini-api-key'] = apiKey.trim();
      }

      let agentResponse: AgentAnalysisResponse;

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            summary,
            stats,
            quality: qualityResult,
            comments: anonymousComments
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Stage 5: Evidence Verification Gate
          setActiveStage(5);
          setStageMessage('Tahap 5: Memverifikasi kutipan asli dan tautan sumber data...');
          await new Promise(r => setTimeout(r, 700));

          agentResponse = data;
        } else {
          // If Gemini quota exhausted or key invalid, fall back gracefully per NFR-03
          console.warn('Gemini endpoint returned error, triggering algorithmic fallback:', data.error);
          setApiErrorMessage(data.error || 'Gemini API tidak tersedia atau kuota habis. Sistem mengalihkan ke sintesis analitik deterministik (NFR-03).');

          setActiveStage(5);
          setStageMessage('Tahap 5: Menjalankan modul sintesis deterministik berbasis kode...');
          await new Promise(r => setTimeout(r, 600));

          agentResponse = generateAlgorithmicDraft(summary, validEvaluations, stats, qualityResult);
        }
      } catch (err: any) {
        console.warn('Network error to /api/analyze, using fallback:', err);
        setApiErrorMessage('Gagal menghubungi server Gemini API. Menjalankan modul sintesis deterministik cadangan (NFR-03).');

        setActiveStage(5);
        setStageMessage('Tahap 5: Menjalankan modul sintesis deterministik berbasis kode...');
        await new Promise(r => setTimeout(r, 600));

        agentResponse = generateAlgorithmicDraft(summary, validEvaluations, stats, qualityResult);
      }

      // Stage 6: Report Assembly
      setActiveStage(6);
      setStageMessage('Tahap 6: Merakit draf laporan evaluasi dan visualisasi interaktif...');
      await new Promise(r => setTimeout(r, 600));

      setAnalysisResult(agentResponse);
    } catch (error: any) {
      console.error('Fatal analysis pipeline error:', error);
      setApiErrorMessage('Terjadi kesalahan tak terduga selama analisis: ' + (error?.message || error));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasUserApiKey={Boolean(apiKey && apiKey.trim().length > 0)}
        hasServerApiKey={hasServerApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* If analysis is done, display Report Dashboard */}
        {analysisResult && statisticsResult && qualityResult ? (
          <ReportDashboard
            summary={summary}
            stats={statisticsResult}
            quality={qualityResult}
            analysis={analysisResult}
            onBackToInput={() => setAnalysisResult(null)}
          />
        ) : (
          /* Input & Audit Flow */
          <div className="space-y-8">
            
            {/* Step 1: Summary Form with Presets */}
            <SummaryForm
              summary={summary}
              onChange={setSummary}
              onApplyPreset={handleApplyPreset}
              onReset={handleReset}
            />

            {/* Step 2 & 3: Upload Section & Column Validation */}
            <FileUploadSection
              participantsValidation={participantsValidation}
              evaluationsValidation={evaluationsValidation}
              participantsFileName={participantsFileName}
              evaluationsFileName={evaluationsFileName}
              onParticipantsFileChange={(content, fileName) => {
                setParticipantsCSV(content);
                setParticipantsFileName(fileName);
                setAnalysisResult(null);
              }}
              onEvaluationsFileChange={(content, fileName) => {
                setEvaluationsCSV(content);
                setEvaluationsFileName(fileName);
                setAnalysisResult(null);
              }}
            />

            {/* Step 4: Quality Inspection & Gating */}
            <DataPreviewAndQuality
              summary={summary}
              quality={qualityResult}
              participants={participantsValidation?.data || []}
              evaluations={evaluationsValidation?.data || []}
              onStartAnalysis={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              hasApiError={apiErrorMessage}
            />

          </div>
        )}

      </main>

      {/* 6-Stage Progress Modal */}
      <AgentProgressModal
        isOpen={isAnalyzing}
        activeStage={activeStage}
        stageMessage={stageMessage}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={setApiKey}
        hasServerApiKey={hasServerApiKey}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Agent Evaluasi Pelatihan • Balai Pelatihan Talenta Komunikasi dan Digital</span>
          <span className="text-[11px] text-slate-600">
            PRD & FRD Compliance • Human-in-the-Loop • 100% Deterministic Code Stats
          </span>
        </div>
      </footer>

    </div>
  );
}
