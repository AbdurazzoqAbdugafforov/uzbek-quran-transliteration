import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins for mobile apps & web
app.use(express.json());

// API v1 routes
app.use('/api/v1', apiRouter);

// Also serve raw JSON files directly if needed
app.use('/json', express.static(path.join(__dirname, 'quran_json')));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    name: "Qur'oni Karim API",
    sampleEndpoint: `http://localhost:${PORT}/api/v1/surah/1`,
    allSurahsEndpoint: `http://localhost:${PORT}/api/v1/surahs`,
    documentation: {
      getSurah: `GET /api/v1/surah/:surahNumber`,
      getAyah: `GET /api/v1/surah/:surahNumber/ayah/:ayahNumber`,
      getAllSurahs: `GET /api/v1/surahs`,
      getAllQuran: `GET /api/v1/quran`,
      getJuz: `GET /api/v1/juz/:juzNumber`,
      search: `GET /api/v1/search?q=Alloh`
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Qur'on API Backend muvaffaqiyatli ishga tushdi!`);
  console.log(`📍 Asosiy manzil: http://localhost:${PORT}`);
  console.log(`📖 1-sura (Fotiha): http://localhost:${PORT}/api/v1/surah/1`);
  console.log(`📖 2-sura (Baqara): http://localhost:${PORT}/api/v1/surah/2`);
  console.log(`📋 Suralar ro'yxati: http://localhost:${PORT}/api/v1/surahs`);
  console.log(`====================================================`);
});
