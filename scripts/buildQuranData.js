import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const QURAN_JSON_DIR = path.join(ROOT_DIR, 'quran_json');
const SURAHS_DIR = path.join(QURAN_JSON_DIR, 'surahs');

// 1. Fetch official base transliteration sources
async function fetchSources() {
  console.log('[BUILD] Fetching verified Quran transliteration sources...');
  const [resEn, resRu] = await Promise.all([
    fetch('https://raw.githubusercontent.com/maqsats/Quran-Transliteration-/main/translit_en.txt'),
    fetch('https://raw.githubusercontent.com/maqsats/Quran-Transliteration-/main/translit_ru.txt')
  ]);

  const linesEn = (await resEn.text()).split('\n').map(l => l.trim()).filter(Boolean);
  const linesRu = (await resRu.text()).split('\n').map(l => l.trim()).filter(Boolean);

  console.log(`[BUILD] Loaded ${linesEn.length} EN lines and ${linesRu.length} RU lines.`);
  return { linesEn, linesRu };
}

/**
 * Format Uzbek Reading ("o'qilishi") with Tajweed phonetics
 */
export function formatUzbekReading(enRaw, arText, surahNum, ayahNum) {
  // Surah 1 (Al-Fatiha) is kept exactly in the user-approved canonical form
  if (surahNum === 1) {
    const fatihaReadings = [
      'Bismillahir rohmaanir rohiym.',
      "Alhamdu lillaahi robbil 'aalamiyn.",
      'Ar-rohmaanir rohiym.',
      'Maaliki yavmiddiyn.',
      "Iyyaaka na'budu va iyyaaka nasta'iyn.",
      'Ihdinas-sirootol mustaqiym.',
      "Sirootol-laziyna an'amta 'alayhim, g'oyril mag'duubi 'alayhim valad-doolliyn."
    ];
    return fatihaReadings[ayahNum - 1];
  }

  let s = enRaw.replace(/^\d+\|/, '').trim();

  // Strip English commentary or section brackets like (section 4), (make sajda)
  s = s.replace(/\s*\([^)]*\)/g, '');

  // 1. Specific known corruptions & split phrases in raw transliteration source
  const replacements = [
    [/\bAllah hus-samad\b/gi, 'Allohus-somad'],
    [/\bTab bat\b/gi, 'Tabbat'],
    [/\bElaafi/gi, 'Iylaafi'],
    [/\belaafi/gi, 'iylaafi'],
    [/\byaa-ai yuh/gi, 'yaa ayyuh'],
    [/\bYaa-ai yuh/gi, 'Yaa ayyuh'],
    [/\bFal y'?abud/gi, 'Falyabud'],
    [/\bmin shar ri\b/gi, 'min sharri'],
    [/\ba'taina kal kausar\b/gi, "a'toynaakal kavsar"],
    [/\ba'taina kal kawthar\b/gi, "a'toynaakal kavsar"],
    [/\bkal farash/gi, 'kalfarash'],
    [/\bmu mad dad/gi, 'mumaddad'],
    [/\bya\s+k[ou]{2}/gi, 'yakuu'],
    [/\bta\s+k[ou]{2}/gi, 'takuu'],
    [/\bm[avw]{2,4}\s+z[iey]{2,}n/gi, 'mavaziyn'],
    [/\bmoori yaati/gi, 'muuriyaati'],
    [/\baadi yaati/gi, 'aadiyaati'],
    [/\bsaali haati/gi, 'saalihaati'],
    [/\bwas waas/gi, 'vasvaas'],
    [/\byuwas wis/gi, 'yuvasvis'],
    [/\bnas rull/gi, 'nasrull'],
    [/\bNas rull/gi, 'Nasrull'],
    [/\bAl lazee\b/gi, 'Allaziy'],
    [/\bAl lazeena\b/gi, 'Allaziyna'],
    [/\bAl latee\b/gi, 'Allatiy'],
    [/\bfa-amma\b/gi, 'fa amma'],
    [/\bFa-amma\b/gi, 'Fa amma'],
    [/\bFa-ummu/gi, 'Fa ummu'],
    [/\bb'usira\b/gi, "bu'siro"],
    [/\bmvw xalfahum\b/gi, 'va maa xalfahum'],
    [/\bva mvw\b/gi, 'va maa'],
    [/\budal lilmuttaq/gi, 'hudal lilmuttaq'],
    [/\bUdal lilmuttaq/gi, 'Hudal lilmuttaq'],
    [/\bTakoonoo yaati/gi, "Takuunuu ya'tiy"],
    [/\bfa il lam\b/gi, 'fa illam'],
    [/\bi wa an\b/gi, 'i va an'],
    [/\bVam ra-atuh/gi, 'Vamra-atuh'],
    [/\bhab lum\b/gi, 'hablum'],
    [/\bt'abuduun\b/gi, "ta'buduun"],
    [/\bm'akuul\b/gi, "ma'kuul"],
    [/\bSa yas laa\b/gi, 'Sayaslaa'],
    [/\bTar miyhim\b/gi, 'Tarmiyhim'],
    [/\bbi hi jaaratim\b/gi, 'bihijaaratim'],
    [/\bsij jiyl\b/gi, 'sijjiyl'],
    [/\bkai dahum\b/gi, 'kaydahum'],
    [/\btad liyl\b/gi, 'tadliyl'],
    [/\bFaja 'alahum\b/gi, "Faja'alahum"],
    [/\byu kazzibu\b/gi, 'yukazzibu'],
    [/\bFa vai lul-lil mu salliyn\b/gi, 'Favaylul lil-musolliyn'],
    [/\bFa sab bih\b/gi, 'Fasabbih'],
    [/\bvas tag'fir\b/gi, "vastag'fir"],
    [/\bnaffaa-saati\b/gi, 'naffaasaati']
  ];

  for (const [regex, rep] of replacements) {
    s = s.replace(regex, rep);
  }

  // 2. Protect Arabic roots with Ta+Ha (fath, taht) and Dal+Ha (qadha, madhoor)
  s = s.replace(/\b([wW]al|[bB]il)fath\b/g, '$1FAT_H_TEMP');
  s = s.replace(/\bfath([auie]?[mn]?)\b/gi, 'FAT_H_TEMP$1');
  s = s.replace(/\bfat-h([auie]?[mn]?)\b/gi, 'FAT_H_TEMP$1');
  s = s.replace(/\bfat han\b/gi, 'FAT_H_TEMP-an');
  s = s.replace(/\bfat hu\b/gi, 'FAT_H_TEMP-u');
  s = s.replace(/\bfat hi\b/gi, 'FAT_H_TEMP-i');
  s = s.replace(/\bfatahnaa\b/gi, 'FAT_H_TEMP-anaa');

  s = s.replace(/\bqadha\b/gi, 'QAD_H_TEMP');
  s = s.replace(/\bmadhoor/gi, 'MAD_H_TEMP-oor');
  s = s.replace(/\bmad hoor/gi, 'MAD_H_TEMP-oor');
  s = s.replace(/\bmazmoomammad hooraa\b/gi, 'mazmoomam madhuuraa');
  s = s.replace(/\bliyudhid/gi, 'LIYUD_H_TEMP');
  s = s.replace(/\bmudhadeen/gi, 'MUD_H_TEMP-adeen');
  s = s.replace(/\bkad han\b/gi, 'KAD_H_TEMP-an');

  // 3. Multi-vowels: ee+ -> iy, oo+ -> uu (handles 2, 3 or more letters)
  s = s.replace(/e{2,}/g, 'iy');
  s = s.replace(/E{2,}/g, 'IY');
  s = s.replace(/Ee+/g, 'Iy');

  s = s.replace(/o{2,}/g, 'uu');
  s = s.replace(/O{2,}/g, 'UU');
  s = s.replace(/Oo+/g, 'Uu');

  // Fix single extra vowel artifacts (e.g. indahuuo -> indahuu)
  s = s.replace(/indahuuo/gi, 'indahuu');
  s = s.replace(/ya'ooduho|ya'uuduho/gi, "ya'uuduhu");
  s = s.replace(/uuo\b/g, 'uu');
  s = s.replace(/iye\b/g, 'iy');
  s = s.replace(/iyee\b/g, 'iy');

  // 4. Consonant transliteration:
  s = s.replace(/gh/g, "g'");
  s = s.replace(/Gh/g, "G'");
  s = s.replace(/kh/g, 'x');
  s = s.replace(/Kh/g, 'X');
  s = s.replace(/th/g, 's');
  s = s.replace(/Th/g, 'S');
  s = s.replace(/dh/g, 'z');
  s = s.replace(/Dh/g, 'Z');

  // Restore protected Ta+Ha and Dal+Ha
  s = s.replace(/FAT_H_TEMP/g, 'fath');
  s = s.replace(/QAD_H_TEMP/g, 'qadha');
  s = s.replace(/MAD_H_TEMP-oor/g, 'madhuur');
  s = s.replace(/LIYUD_H_TEMP/g, 'liyudhid');
  s = s.replace(/MUD_H_TEMP-adeen/g, 'mudhadiyn');
  s = s.replace(/KAD_H_TEMP-an/g, 'kadhan');

  // 5. 'w' in Arabic reading is 'v' in Uzbek
  s = s.replace(/w/g, 'v');
  s = s.replace(/W/g, 'V');

  // 6. Uzbek Tajweed standard harmonizations
  s = s.replace(/\bRahm/gi, 'Rohm');
  s = s.replace(/\brahm/g, 'rohm');
  s = s.replace(/\bRabb/gi, 'Robb');
  s = s.replace(/\brabb/g, 'robb');
  s = s.replace(/Siraat/gi, 'Siroot');
  s = s.replace(/siraat/gi, 'siroot');
  s = s.replace(/Siraatal/gi, 'Sirootol');
  s = s.replace(/siraatal/gi, 'sirootol');
  s = s.replace(/Yawm/gi, 'Yavm');
  s = s.replace(/yawm/gi, 'yavm');
  s = s.replace(/fee\b/gi, 'fiy');
  s = s.replace(/Fee\b/g, 'Fiy');
  s = s.replace(/daaalleen|daalleen/gi, 'doolliyn');
  s = s.replace(/\bsamad\b/gi, 'somad');

  // Clean multiple spaces and normalize apostrophes
  s = s.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of verse
  if (s.length > 0) {
    if (s[0] === "'" && s.length > 1) {
      s = "'" + s[1].toUpperCase() + s.slice(2);
    } else {
      s = s[0].toUpperCase() + s.slice(1);
    }
  }

  // Ensure ending period
  if (!/[.!?]$/.test(s)) {
    s += '.';
  }

  return s;
}

/**
 * Format Russian Reading ("русское чтение")
 */
export function formatRussianReading(ruRaw, surahNum, ayahNum) {
  let s = ruRaw.replace(/^\d+\|/, '').trim();

  // Remove unwanted Basmala in surahs other than 1
  if (surahNum > 1 && ayahNum === 1) {
    s = s.replace(/^Бисмиллахир\s+Рахманир\s+Рахиим\s+/i, '');
    s = s.replace(/^бисмиллахир\s+рахманир\s+рахиим\s+/i, '');
  }

  // Normalize special Arabic-Cyrillic combining characters
  s = s.replace(/к̣/g, 'к');
  s = s.replace(/К̣/g, 'К');
  s = s.replace(/\u0323/g, '');

  s = s.replace(/з̃/g, 'з');
  s = s.replace(/З̃/g, 'З');
  s = s.replace(/с̃/g, 'с');
  s = s.replace(/С̃/g, 'С');
  s = s.replace(/\u0303/g, '');

  s = s.replace(/[`ʼʻʻ]/g, "'");
  s = s.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (s.length > 0) {
    if (s[0] === "'" && s.length > 1) {
      s = "'" + s[1].toUpperCase() + s.slice(2);
    } else {
      s = s[0].toUpperCase() + s.slice(1);
    }
  }

  if (!/[.!?]$/.test(s)) {
    s += '.';
  }

  return s;
}

async function run() {
  const { linesEn, linesRu } = await fetchSources();

  let globalAyahCount = 0;
  let uzbekUpdatedCount = 0;
  let russianUpdatedCount = 0;
  const allSurahs = [];

  console.log('[BUILD] Updating all 114 surah JSON files...');

  for (let s = 1; s <= 114; s++) {
    const surahPath = path.join(SURAHS_DIR, `${s}.json`);
    const surahData = JSON.parse(fs.readFileSync(surahPath, 'utf8'));

    for (const ayah of surahData.ayahs) {
      globalAyahCount++;
      const enRaw = linesEn[globalAyahCount - 1];
      const ruRaw = linesRu[globalAyahCount - 1];

      const newUzbekReading = formatUzbekReading(enRaw, ayah.arabic, s, ayah.ayahNumber);
      const newRussianReading = formatRussianReading(ruRaw, s, ayah.ayahNumber);

      if (ayah.uzbekReading !== newUzbekReading) {
        ayah.uzbekReading = newUzbekReading;
        uzbekUpdatedCount++;
      }

      if (ayah.russianReading !== newRussianReading) {
        ayah.russianReading = newRussianReading;
        russianUpdatedCount++;
      }
    }

    // Write back updated surah file
    fs.writeFileSync(surahPath, JSON.stringify(surahData, null, 2) + '\n', 'utf8');
    allSurahs.push(surahData);
  }

  console.log(`[BUILD] Processed ${globalAyahCount} ayahs across 114 surahs.`);
  console.log(`[BUILD] Uzbek readings updated: ${uzbekUpdatedCount}`);
  console.log(`[BUILD] Russian readings updated: ${russianUpdatedCount}`);

  // Update quran_all.json
  console.log('[BUILD] Updating quran_all.json...');
  const quranAllPath = path.join(QURAN_JSON_DIR, 'quran_all.json');
  fs.writeFileSync(quranAllPath, JSON.stringify(allSurahs, null, 2) + '\n', 'utf8');

  console.log('[BUILD] Successfully finished updating all files!');
}

run().catch(console.error);
