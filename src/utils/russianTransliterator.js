/**
 * Russian Transliteration & Phonetics Utilities
 * Handles formatting and normalization of Russian Quranic transliteration ("чтение").
 */

export function formatRussianReading(rawText, surahNum, ayahNum) {
  if (!rawText) return '';

  let s = rawText.replace(/^\d+\|/, '').trim();

  // Remove unwanted Basmala in surahs other than 1
  if (surahNum && surahNum > 1 && (!ayahNum || ayahNum === 1)) {
    s = s.replace(/^Бисмиллахир\s+Рахманир\s+Рахиим\s+/i, '');
    s = s.replace(/^бисмиллахир\s+рахманир\s+рахиим\s+/i, '');
  }

  // Normalize special Arabic-Cyrillic combining characters
  // 1. Combining dot below (\u0323) on 'к' (represents Arabic qaf)
  s = s.replace(/к̣/g, 'к');
  s = s.replace(/К̣/g, 'К');
  s = s.replace(/\u0323/g, '');

  // 2. Combining tilde (\u0303) on 'з' or 'с' (represents Arabic dhal and tha)
  s = s.replace(/з̃/g, 'з');
  s = s.replace(/З̃/g, 'З');
  s = s.replace(/с̃/g, 'с');
  s = s.replace(/С̃/g, 'С');
  s = s.replace(/\u0303/g, '');

  // 3. Normalize backticks and grave accents to standard apostrophe for 'ayn and hamza
  s = s.replace(/[`ʼʻʻ]/g, "'");

  // 4. Collapse extra whitespace
  s = s.replace(/\s+/g, ' ');

  // 5. Capitalize first letter of the verse
  if (s.length > 0) {
    if (s[0] === "'" && s.length > 1) {
      s = "'" + s[1].toUpperCase() + s.slice(2);
    } else {
      s = s[0].toUpperCase() + s.slice(1);
    }
  }

  // 6. Ensure sentence ends with period if not already punctuated
  if (!/[.!?]$/.test(s)) {
    s += '.';
  }

  return s;
}
