import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QURAN_JSON_DIR = path.join(__dirname, '..', '..', 'quran_json');
const SURAHS_DIR = path.join(QURAN_JSON_DIR, 'surahs');

const router = express.Router();

// In-memory cache for instant <1ms responses
const surahsCache = new Map();
let surahsListCache = [];
let isLoaded = false;

function loadData() {
  if (isLoaded) return;
  try {
    const listPath = path.join(QURAN_JSON_DIR, 'surahs_list.json');
    if (fs.existsSync(listPath)) {
      surahsListCache = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
    }

    for (let i = 1; i <= 114; i++) {
      const filePath = path.join(SURAHS_DIR, `${i}.json`);
      if (fs.existsSync(filePath)) {
        const surahData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        surahsCache.set(i, surahData);
      }
    }
    isLoaded = true;
    console.log(`[API] Loaded ${surahsCache.size} surahs into memory.`);
  } catch (err) {
    console.error('[API] Error loading Quran data:', err);
  }
}

// Load data immediately on startup
loadData();

/**
 * GET /api/v1
 * API info
 */
router.get('/', (req, res) => {
  res.json({
    name: "Qur'oni Karim API",
    sampleEndpoint: '/api/v1/surah/1',
    allSurahsEndpoint: '/api/v1/surahs',
    allQuranEndpoint: '/api/v1/quran',
    totalSurahs: 114,
    totalAyahs: 6236
  });
});

/**
 * GET /api/v1/surahs
 * List of all 114 surahs
 */
router.get('/surahs', (req, res) => {
  if (!isLoaded) loadData();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json(surahsListCache);
});

/**
 * GET /api/v1/surah/:surahNumber
 * Returns whole surah ayah by ayah in the exact required JSON structure
 * Example: /api/v1/surah/1
 */
router.get('/surah/:surahNumber', (req, res) => {
  if (!isLoaded) loadData();

  const surahNum = parseInt(req.params.surahNumber, 10);
  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    return res.status(404).json({
      error: 'Surah not found',
      message: 'Sura raqami 1 dan 114 gacha bo‘lishi kerak (1-114).'
    });
  }

  const surah = surahsCache.get(surahNum);
  if (!surah) {
    return res.status(404).json({
      error: 'Surah not found',
      message: `${surahNum}-sura topilmadi.`
    });
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json(surah);
});

/**
 * GET /api/v1/surah/:surahNumber/ayah/:ayahNumber
 * Returns single ayah
 * Example: /api/v1/surah/1/ayah/1
 */
router.get('/surah/:surahNumber/ayah/:ayahNumber', (req, res) => {
  if (!isLoaded) loadData();

  const surahNum = parseInt(req.params.surahNumber, 10);
  const ayahNum = parseInt(req.params.ayahNumber, 10);

  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    return res.status(404).json({ error: 'Sura raqami 1 dan 114 gacha bo‘lishi kerak.' });
  }

  const surah = surahsCache.get(surahNum);
  if (!surah) {
    return res.status(404).json({ error: 'Sura topilmadi.' });
  }

  const ayah = surah.ayahs.find(a => a.ayahNumber === ayahNum);
  if (!ayah) {
    return res.status(404).json({
      error: 'Oyat topilmadi',
      message: `${surahNum}-surada ${ayahNum}-oyat mavjud emas.`
    });
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    surahNumber: surah.surahNumber,
    surahName: surah.surahName,
    juzNumber: surah.juzNumber,
    ...ayah
  });
});

/**
 * GET /api/v1/quran
 * Returns complete Quran (all 114 surahs)
 */
router.get('/quran', (req, res) => {
  if (!isLoaded) loadData();
  const allPath = path.join(QURAN_JSON_DIR, 'quran_all.json');
  if (fs.existsSync(allPath)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return fs.createReadStream(allPath).pipe(res);
  }
  const all = [];
  for (let i = 1; i <= 114; i++) {
    const s = surahsCache.get(i);
    if (s) all.push(s);
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json(all);
});

/**
 * GET /api/v1/search?q=keyword
 * Search across Arabic text, Uzbek reading, or Uzbek translation
 */
router.get('/search', (req, res) => {
  if (!isLoaded) loadData();

  const query = req.query.q;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: "Qidiruv so'zini kiriting (?q=...)" });
  }

  const q = query.trim().toLowerCase();
  const results = [];

  for (let s = 1; s <= 114; s++) {
    const surah = surahsCache.get(s);
    if (!surah) continue;

    for (const ayah of surah.ayahs) {
      const matchArabic = ayah.arabic && ayah.arabic.includes(query.trim());
      const matchReading = ayah.uzbekReading && ayah.uzbekReading.toLowerCase().includes(q);
      const matchTrans = ayah.uzbekTranslation && ayah.uzbekTranslation.toLowerCase().includes(q);

      if (matchArabic || matchReading || matchTrans) {
        results.push({
          surahNumber: surah.surahNumber,
          surahName: surah.surahName,
          ayahNumber: ayah.ayahNumber,
          arabic: ayah.arabic,
          uzbekReading: ayah.uzbekReading,
          uzbekTranslation: ayah.uzbekTranslation
        });

        if (results.length >= 50) break;
      }
    }
    if (results.length >= 50) break;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    query: query,
    totalFound: results.length,
    results: results
  });
});

export default router;
