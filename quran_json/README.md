# Qur'oni Karim JSON Ma'lumotlar Bazasi (Mobil Ilovalar Uchun)

Ushbu papka mobil ilovalar (Flutter, React Native, iOS Swift, Android Kotlin) va backend API'lar uchun tayyorlangan to'liq, xatosiz Qur'oni Karim JSON ma'lumotlar to'plamini o'z ichiga oladi.

## Fayllar Strukturasi

```
quran_json/
├── quran_all.json          # Barcha 114 sura va 6,236 oyat (to'liq bitta faylda)
├── quran_all.min.json      # Minifikatsiya qilingan (2.95 MB, ilova ichida tez yuklanish uchun)
├── surahs_list.json        # 114 ta sura ro'yxati (sura raqami, nomi, boshlanish juz'i, oyatlar soni)
└── surahs/                 # Har bir sura alohida JSON fayl ko'rinishida
    ├── 1.json              # Fotiha surasi (7 oyat)
    ├── 2.json              # Baqara surasi (286 oyat)
    ├── ...
    └── 114.json            # Nos surasi (6 oyat)
```

## JSON Strukturasi

Har bir sura quyidagi aniq formatda saqlangan:

```json
{
  "surahNumber": 1,
  "surahName": "Al-Fatiha",
  "juzNumber": 1,
  "ayahs": [
    {
      "ayahNumber": 1,
      "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "uzbekReading": "Bismillahir rohmaanir rohiym.",
      "uzbekTranslation": "Mehribon va rahmli Alloh nomi bilan."
    },
    {
      "ayahNumber": 2,
      "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "uzbekReading": "Alhamdu lillaahi robbil 'aalamiyn.",
      "uzbekTranslation": "Hamd olamlarning Robbi Allohgadir."
    }
  ]
}
```

## Ma'lumotlar Manbalari (Trusted Sources)

1. **Arabcha matn (`arabic`)**: King Fahd Qur'on majmuasi va Tanzil.net rasmiy imlosiga asoslangan to'liq harakatli (tashkeelli) aniq matn. 2-114 suralar boshidagi basmala oyatdan ajratilgan bo'lib, oyatlar tartibi to'liq to'g'ri.
2. **O'qilishi (`uzbekReading`)**: Arabcha tajvid qoidalari va o'zbek tili fonetikasiga moslashtirilgan lotin transkripsiyasi.
3. **Ma'nolar tarjimasi (`uzbekTranslation`)**: Shayx Muhammad Sodiq Muhammad Yusuf rahimahullohning ma'nolar tarjimasi (lotin alifbosida).

## Mobil Ilovada Ishlatish Misollari

### Flutter (Dart):
```dart
// Bitta surani yuklash
import 'dart:convert';
import 'package:flutter/services.dart';

Future<Map<String, dynamic>> loadSurah(int surahNumber) async {
  final String jsonStr = await rootBundle.loadString('assets/surahs/$surahNumber.json');
  return json.decode(jsonStr);
}
```

### React Native:
```javascript
// Bitta surani import qilish
import surah1 from './quran_json/surahs/1.json';
console.log(surah1.surahName); // "Al-Fatiha"
```

### Android (Kotlin):
```kotlin
fun loadSurahJson(context: Context, surahNumber: Int): String {
    return context.assets.open("surahs/$surahNumber.json").bufferedReader().use { it.readText() }
}
```

### iOS (Swift):
```swift
func loadSurah(number: Int) -> Data? {
    guard let url = Bundle.main.url(forResource: "\(number)", withExtension: "json", subdirectory: "surahs") else { return nil }
    return try? Data(contentsOf: url)
}
```
