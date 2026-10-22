/**
 * Uzbek Transliterator & Phonetics Utilities
 * Handles:
 * 1. Cyrillic Uzbek -> Latin Uzbek conversion
 * 2. Arabic Transliteration -> Uzbek phonetic pronunciation ("o'qilishi")
 */

const VOWELS_CYR = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'э', 'ю', 'я', 'ў']);

/**
 * Convert Cyrillic Uzbek text into official Uzbek Latin script.
 */
export function cyrillicToLatinUzbek(text) {
  if (!text) return '';

  let res = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];
    const prevCh = i > 0 ? text[i - 1].toLowerCase() : null;
    const nextCh = i + 1 < len ? text[i + 1] : null;

    // Handle "Е" / "е": at start of word or after a vowel, it is "ye" / "Ye"
    if (ch === 'е' || ch === 'Е') {
      const isStartOrAfterVowel = i === 0 || !prevCh || /\s|[.,!?;:«»"'\(\)\[\]\-]/.test(prevCh) || VOWELS_CYR.has(prevCh);
      if (ch === 'Е') {
        const nextIsUpper = nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase();
        res += isStartOrAfterVowel ? (nextIsUpper ? 'YE' : 'Ye') : 'E';
      } else {
        res += isStartOrAfterVowel ? 'ye' : 'e';
      }
      continue;
    }

    // Two-letter / special Cyrillic combinations
    switch (ch) {
      case 'ё': res += 'yo'; break;
      case 'Ё': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'YO' : 'Yo'; break;
      case 'ю': res += 'yu'; break;
      case 'Ю': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'YU' : 'Yu'; break;
      case 'я': res += 'ya'; break;
      case 'Я': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'YA' : 'Ya'; break;
      case 'ў': res += "o'"; break;
      case 'Ў': res += "O'"; break;
      case 'ғ': res += "g'"; break;
      case 'Ғ': res += "G'"; break;
      case 'ш': res += 'sh'; break;
      case 'Ш': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'SH' : 'Sh'; break;
      case 'щ': res += 'sh'; break;
      case 'Щ': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'SH' : 'Sh'; break;
      case 'ч': res += 'ch'; break;
      case 'Ч': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'CH' : 'Ch'; break;
      case 'ц': res += 'ts'; break;
      case 'Ц': res += (nextCh && nextCh === nextCh.toUpperCase() && nextCh !== nextCh.toLowerCase()) ? 'TS' : 'Ts'; break;
      case 'ъ': res += "'"; break;
      case 'Ъ': res += "'"; break;
      case 'ь': break; // soft sign is omitted in Uzbek Latin
      case 'Ь': break;
      case 'қ': res += 'q'; break;
      case 'Қ': res += 'Q'; break;
      case 'ҳ': res += 'h'; break;
      case 'Ҳ': res += 'H'; break;
      case 'а': res += 'a'; break;
      case 'А': res += 'A'; break;
      case 'б': res += 'b'; break;
      case 'Б': res += 'B'; break;
      case 'в': res += 'v'; break;
      case 'В': res += 'V'; break;
      case 'г': res += 'g'; break;
      case 'Г': res += 'G'; break;
      case 'д': res += 'd'; break;
      case 'Д': res += 'D'; break;
      case 'ж': res += 'j'; break;
      case 'Ж': res += 'J'; break;
      case 'з': res += 'z'; break;
      case 'З': res += 'Z'; break;
      case 'и': res += 'i'; break;
      case 'И': res += 'I'; break;
      case 'й': res += 'y'; break;
      case 'Й': res += 'Y'; break;
      case 'к': res += 'k'; break;
      case 'К': res += 'K'; break;
      case 'л': res += 'l'; break;
      case 'Л': res += 'L'; break;
      case 'м': res += 'm'; break;
      case 'М': res += 'M'; break;
      case 'н': res += 'n'; break;
      case 'Н': res += 'N'; break;
      case 'о': res += 'o'; break;
      case 'О': res += 'O'; break;
      case 'п': res += 'p'; break;
      case 'П': res += 'P'; break;
      case 'р': res += 'r'; break;
      case 'Р': res += 'R'; break;
      case 'с': res += 's'; break;
      case 'С': res += 'S'; break;
      case 'т': res += 't'; break;
      case 'Т': res += 'T'; break;
      case 'у': res += 'u'; break;
      case 'У': res += 'U'; break;
      case 'ф': res += 'f'; break;
      case 'Ф': res += 'F'; break;
      case 'х': res += 'x'; break;
      case 'Х': res += 'X'; break;
      case 'э': res += 'e'; break;
      case 'Э': res += 'E'; break;
      default: res += ch; break;
    }
  }

  // Standardize inverted single quotes / grave accents into standard apostrophe
  return res.replace(/[`ʼʻʻ]/g, "'");
}

/**
 * Clean Uzbek translation string:
 * Removes footnotes like <sup foot_note="...">...</sup> or extra brackets if needed.
 */
export function cleanTranslation(text) {
  if (!text) return '';
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert standard English transliteration into Uzbek phonetic reading ("o'qilishi").
 */
export function formatUzbekReading(translit) {
  if (!translit) return '';

  let s = translit.trim();

  // Common Arabic transliteration markers -> Uzbek phonetics
  // 1. Diphthongs & long vowels
  s = s.replace(/ee/g, 'iy');
  s = s.replace(/Ee/g, 'Iy');
  s = s.replace(/EE/g, 'IY');

  s = s.replace(/oo/g, 'uu');
  s = s.replace(/Oo/g, 'Uu');
  s = s.replace(/OO/g, 'UU');

  // 2. Consonants
  s = s.replace(/gh/g, "g'");
  s = s.replace(/Gh/g, "G'");
  s = s.replace(/kh/g, 'x');
  s = s.replace(/Kh/g, 'X');
  s = s.replace(/th/g, 's');
  s = s.replace(/Th/g, 'S');
  s = s.replace(/dh/g, 'z');
  s = s.replace(/Dh/g, 'Z');

  // 3. 'w' in Arabic reading is 'v' in Uzbek
  s = s.replace(/\bw(\w)/gi, (m, c) => (m[0] === 'W' ? 'V' + c : 'v' + c));
  s = s.replace(/(\w)w(\w)/gi, (m, a, b) => a + (m[1] === 'W' ? 'V' : 'v') + b);
  s = s.replace(/\bwa\b/gi, 'va');
  s = s.replace(/\bWa\b/g, 'Va');
  s = s.replace(/\bhuwa\b/gi, 'huva');
  s = s.replace(/\bhuwal\b/gi, 'huval');

  // 4. Emphatic phonetic harmonizations common in Uzbek Tajweed
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

  // Ensure trailing period if sentence ends without punctuation
  if (!/[.!?]$/.test(s)) {
    s += '.';
  }

  return s;
}
