# Uzbek Quran API & Transliteration Database

Qur'oni Karimning barcha 114 ta surasi va 6,236 ta oyatining arabcha matni (harakatli/tashkeelli), o'zbekcha o'qilishi (lotin transkripsiyasi) va o'zbekcha ma'nolar tarjimasi (Shayx Muhammad Sodiq Muhammad Yusuf).

Ushbu repozitoriy ham **tayyor JSON fayllar** (mobil ilovalarda offline ishlatish uchun), ham **Node.js Express REST API**ni o'z ichiga oladi.

---

## 📁 JSON Fayllar Strukturasi (`quran_json/`)

Mobil ilovalar (Flutter, React Native, iOS Swift, Android Kotlin) uchun tayyor toza JSON baza:

```
quran_json/
├── quran_all.json          # Barcha 114 ta sura va 6,236 ta oyat (bitta faylda)
├── surahs_list.json        # 114 ta suraning ro'yxati (sura raqami, nomi, juz, oyatlar soni)
└── surahs/                 # 114 ta alohida sura JSON fayllari
    ├── 1.json              # Fotiha surasi
    ├── 2.json              # Baqara surasi
    ├── ...
    └── 114.json            # Nos surasi
```

### JSON Namunasi (`1.json`):

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

---

## 🚀 Backend API ni Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Serverni yoqish
npm start
```

Server odatiy tarzda `http://localhost:5000` manzilida ishlaydi.

### Asosiy API Endpointlar:

| Method | Endpoint | Tavsif |
| :--- | :--- | :--- |
| `GET` | `/api/v1/surah/:surahNumber` | Surani oyatma-oyat olish (masalan, `/api/v1/surah/1`) |
| `GET` | `/api/v1/surahs` | Barcha 114 ta sura ro'yxatini olish |
| `GET` | `/api/v1/surah/:surahNumber/ayah/:ayahNumber` | Bitta oyatni olish (masalan, `/api/v1/surah/1/ayah/1`) |
| `GET` | `/api/v1/quran` | Butun Qur'onni (114 ta sura) bitta JSONda olish |
| `GET` | `/api/v1/search?q=Alloh` | Arabcha, o'qilishi yoki tarjimasi bo'yicha qidiruv |

---

## 📱 Mobil Ilovada Ishlatish (Flutter Misoli)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchSurah(int surahNumber) async {
  final res = await http.get(Uri.parse('http://localhost:5000/api/v1/surah/$surahNumber'));
  if (res.statusCode == 200) {
    return json.decode(utf8.decode(res.bodyBytes));
  } else {
    throw Exception('Surani yuklashda xatolik');
  }
}
```

Yoki internet talab qilmasdan offline ishlashi uchun `quran_json/surahs/` papkasini ilovangizning `assets/` papkasiga nusxalang:

```dart
final String jsonStr = await rootBundle.loadString('assets/surahs/$surahNumber.json');
final Map<String, dynamic> surah = json.decode(jsonStr);
```

---

## 📜 Ma'lumot Manbalari

* **Arabcha matn**: King Fahd Qur'on majmuasi va Tanzil.net rasmiy imlosi (to'liq tashkeelli/harakatli).
* **O'qilishi**: Arabcha tajvid fonetikasi asosidagi lotin transkripsiyasi.
* **Tarjima**: Shayx Muhammad Sodiq Muhammad Yusuf (lotin alifbosida).
