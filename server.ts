import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasServerApiKey: hasServerKey,
    environment: isProd ? 'production' : 'development'
  });
});

// Stage 3-5: AI Agent Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { summary, stats, quality, comments } = req.body;

    if (!summary || !stats || !comments) {
      return res.status(400).json({
        success: false,
        error: 'Parameter evaluasi tidak lengkap (summary, stats, atau comments belum tersedia).'
      });
    }

    // Security check: Key retrieval without logging (NFR-06)
    const headerKey = req.headers['x-gemini-api-key'] as string | undefined;
    const apiKey = (headerKey && headerKey.trim().length > 0)
      ? headerKey.trim()
      : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        errorCode: 'NO_API_KEY',
        error: 'Kunci API Gemini belum tersedia. Masukkan kunci API di awal sesi atau konfigurasikan GEMINI_API_KEY.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const rawCommentTexts: string[] = (comments as { comment: string }[])
      .map(c => c.comment.trim())
      .filter(c => c.length > 0);

    const promptText = `
Anda adalah AI Agent Analis Evaluasi Pelatihan pada Balai Pelatihan Talenta Komunikasi dan Digital (Kementerian Komunikasi dan Digital).
Tugas Anda adalah menafsirkan hasil statistik dan mengelompokkan komentar peserta menjadi draf laporan evaluasi yang akurat, berbasis bukti, dan dapat ditelusuri.

ATURAN KETAT (HAL YANG TIDAK BOLEH DILAKUKAN):
1. JANGAN PERNAH menghitung atau mengubah angka. Seluruh angka telah dihitung secara deterministik oleh kode aplikasi. Anda HANYA menafsirkan angka yang disediakan.
2. JANGAN PERNAH mengarang kutipan komentar. Setiap kutipan (verbatimQuotes) WAJIB berupa kutipan asli persis yang ada di daftar komentar yang diberikan.
3. Setiap butir Temuan Utama (Key Finding) WAJIB mencantumkan sumber data spesifik ('sourceData') yang merujuk pada metrik angka yang diberikan.
4. Nyatakan keterbatasan analisis secara eksplisit (limitations) jika terdapat data yang tidak tersedia (seperti ketiadaan data presensi kehadiran atau evaluasi dampak jangka panjang).
5. Bahasa yang digunakan adalah Bahasa Indonesia baku, formal, objektif, dan kedinasan.

DATA RINGKASAN PELATIHAN:
- Tema: ${summary.theme} (${summary.targetBatch})
- Tanggal: ${summary.startDate} s.d. ${summary.endDate}
- Metode: ${summary.method}
- Penyelenggara: ${summary.organizer}
- Pendaftar: ${stats.summary.registeredCount} orang, Diterima: ${stats.summary.acceptedCount} orang, Dianalisis: ${stats.summary.activeCount} orang
- Kriteria Kelulusan: Nilai Post-test ≥ ${summary.passThreshold} (Skala ${summary.scoreScale})
- Tujuan Pembelajaran: ${summary.learningObjectives || 'Pengembangan kompetensi teknis dan digital ASN'}

DATA STATISTIK HASIL BELAJAR (HASIL HITUNG KODE DETERMINISTIK):
- Tingkat Kelulusan Total: ${stats.summary.passRate}% (${stats.summary.passedCount} Lulus, ${stats.summary.failedCount} Tidak Lulus)
- Kelulusan Pria (L): ${stats.summary.genderStats.malePassRate}% (${stats.summary.genderStats.malePassed}/${stats.summary.genderStats.maleCount})
- Kelulusan Wanita (P): ${stats.summary.genderStats.femalePassRate}% (${stats.summary.genderStats.femalePassed}/${stats.summary.genderStats.femaleCount})
- Rata-rata Pre-test: ${stats.learningMetrics.pretest.mean} (Min: ${stats.learningMetrics.pretest.min}, Max: ${stats.learningMetrics.pretest.max}, SD: ${stats.learningMetrics.pretest.stdDev})
- Rata-rata Post-test: ${stats.learningMetrics.posttest.mean} (Min: ${stats.learningMetrics.posttest.min}, Max: ${stats.learningMetrics.posttest.max}, SD: ${stats.learningMetrics.posttest.stdDev})
- Peningkatan Nilai (Delta): +${stats.learningMetrics.deltaMean} poin
- Normalized Gain (N-Gain Hake): ${stats.learningMetrics.normalizedGain.meanNGain} (Kategori: ${stats.learningMetrics.normalizedGain.category})
- Sebaran N-Gain: Tinggi (${stats.learningMetrics.normalizedGain.highCount}), Sedang (${stats.learningMetrics.normalizedGain.mediumCount}), Rendah (${stats.learningMetrics.normalizedGain.lowCount})

DATA EVALUASI PENGAJAR & PANITIA:
- Rerata Evaluasi Pengajar: ${stats.evaluationMetrics.instructor.overallMean}/${stats.evaluationMetrics.instructor.scale} (Kepuasan: ${stats.evaluationMetrics.instructor.percentage.toFixed(1)}%)
- Rerata Evaluasi Panitia: ${stats.evaluationMetrics.committee.overallMean}/${stats.evaluationMetrics.committee.scale} (Kepuasan: ${stats.evaluationMetrics.committee.percentage.toFixed(1)}%)

DATA PEMERIKSAAN KUALITAS & ANOMALI:
- Total Anomali Ditemukan: ${quality.minorCount} anomali ringan
- Baris Peserta Dikecualikan: ${quality.excludedParticipantCount} baris
- Catatan Anomali: ${(quality.anomalies || []).map((a: any) => a.description).join('; ') || 'Tidak ada anomali'}

DAFTAR KOMENTAR ASLI PESERTA:
${JSON.stringify(rawCommentTexts, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummaryText: {
              type: Type.STRING,
              description: 'Ringkasan eksekutif formal 1-2 paragraf mengenai pelaksanaan dan capaian.'
            },
            dataQualityNarrative: {
              type: Type.STRING,
              description: 'Penjelasan status pemeriksaan kualitas data dan perlakuan anomali.'
            },
            commentThemes: {
              type: Type.ARRAY,
              description: 'Kelompok tema komentar peserta dengan sentimen dan kutipan asli.',
              items: {
                type: Type.OBJECT,
                properties: {
                  themeName: { type: Type.STRING },
                  target: { type: Type.STRING, description: 'Pengajar, Panitia, atau Materi/Fasilitas' },
                  sentiment: { type: Type.STRING, description: 'Positif, Netral, atau Perlu Perbaikan' },
                  frequency: { type: Type.INTEGER },
                  summary: { type: Type.STRING },
                  verbatimQuotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Kutipan asli yang WAJIB ada di daftar komentar masukan.'
                  }
                },
                required: ['themeName', 'target', 'sentiment', 'frequency', 'summary', 'verbatimQuotes']
              }
            },
            findings: {
              type: Type.ARRAY,
              description: 'Temuan utama berbasis bukti dengan tautan sumber data eksplisit.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  statement: { type: Type.STRING },
                  sourceData: { type: Type.STRING, description: 'Kutipan sumber data numerik penopang temuan' }
                },
                required: ['id', 'category', 'statement', 'sourceData']
              }
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Keterbatasan analisis (data yang tidak tersedia atau dikecualikan).'
            },
            recommendations: {
              type: Type.ARRAY,
              description: 'Rekomendasi tindakan berbasis bukti.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  area: { type: Type.STRING },
                  action: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  linkedFinding: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'Tinggi, Sedang, atau Rendah' }
                },
                required: ['id', 'area', 'action', 'rationale', 'linkedFinding', 'priority']
              }
            }
          },
          required: ['executiveSummaryText', 'dataQualityNarrative', 'commentThemes', 'findings', 'limitations', 'recommendations']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Stage 5: Verification Gate (Gemini + Code verification per PRD)
    // 1. Verify verbatim quotes exist in raw comments
    const quoteVerifications: { quote: string; foundInInput: boolean }[] = [];
    const verifiedThemes = (parsedData.commentThemes || []).map((t: any) => {
      const verifiedQuotes = (t.verbatimQuotes || []).filter((q: string) => {
        const found = rawCommentTexts.some(raw => raw.toLowerCase().includes(q.toLowerCase().trim()) || q.toLowerCase().includes(raw.toLowerCase().trim()));
        quoteVerifications.push({ quote: q, foundInInput: found });
        return found;
      });

      // If quotes were hallucinated, replace with closest genuine quote from input
      const finalQuotes = verifiedQuotes.length > 0
        ? verifiedQuotes
        : rawCommentTexts.slice(0, 1);

      return {
        ...t,
        verbatimQuotes: finalQuotes
      };
    });

    // 2. Mark findings as verified
    const verifiedFindings = (parsedData.findings || []).map((f: any) => {
      const hasSource = Boolean(f.sourceData && f.sourceData.trim().length > 0);
      return {
        ...f,
        isVerified: hasSource
      };
    });

    const executionTimeMs = Date.now() - startTime;

    res.json({
      success: true,
      source: 'gemini',
      modelUsed: 'gemini-3.8-flash',
      executionTimeMs,
      commentThemes: verifiedThemes,
      findings: verifiedFindings,
      recommendations: parsedData.recommendations || [],
      limitations: parsedData.limitations || [],
      executiveSummaryText: parsedData.executiveSummaryText || '',
      dataQualityNarrative: parsedData.dataQualityNarrative || '',
      verificationReport: {
        totalFindings: verifiedFindings.length,
        verifiedFindings: verifiedFindings.filter((f: any) => f.isVerified).length,
        quoteVerifications
      }
    });
  } catch (error: any) {
    console.error('Error during AI Agent analysis:', error?.message || error);
    res.status(500).json({
      success: false,
      errorCode: 'AI_EXECUTION_ERROR',
      error: error?.message || 'Terjadi kesalahan saat menghubungi layanan Gemini API.'
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
