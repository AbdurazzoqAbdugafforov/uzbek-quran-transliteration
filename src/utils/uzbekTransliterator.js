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
 * Convert raw transliteration into verified Uzbek phonetic reading ("o'qilishi").
 */
export function formatUzbekReading(translit, surahNum, ayahNum) {
  if (!translit) return '';

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
    return fatihaReadings[ayahNum ? ayahNum - 1 : 0] || translit;
  }

  let s = translit.replace(/^\d+\|/, '').trim();

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
    [/\bya kuu/gi, 'yakuu'],
    [/\bta kuu/gi, 'takuu'],
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

  // Fix single extra vowel artifacts
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

  // Capitalize first letter
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
