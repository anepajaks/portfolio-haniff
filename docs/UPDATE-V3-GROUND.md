# Update V3 — karakter berpijak atas batu

Pakej kecil ini untuk website yang sudah menggunakan **V2 Poppins + lambai**. Ia mengandungi hanya fail yang berubah dan dua aset baharu.

## Fail yang perlu di-upload

| Fail | Tujuan |
| --- | --- |
| `src/components/Hero.astro` | Asingkan teks daripada lapisan scene |
| `src/components/HaniffCharacter.astro` | Gunakan frame yang memasukkan karakter, batu dan bayang kaki sekali |
| `src/styles/hero.css` | Buang bingkai bulat; ikat scene pada bahagian bawah hero; had saiz desktop/mobile |
| `src/styles/animations.css` | Buang pergerakan masuk seluruh scene yang boleh membuat tanah nampak bergerak |
| `public/characters/haniff-grounded-day.webp` | Empat frame scene siang |
| `public/characters/haniff-grounded-night.webp` | Empat frame scene malam |

## Langkah upload

1. Extract ZIP ini ke folder baharu.
2. Buka root repository GitHub, branch `portfolio-redesign`.
3. Pilih **Add file → Upload files**.
4. Drag folder **`src`, `public`, `docs`** bersama foldernya ke ruang upload. Folder dalam pakej ini memang hanya mengandungi perubahan; fail V2 yang lain kekal dalam GitHub.
5. Pastikan senarai menunjukkan `src/components/Hero.astro`, bukan `Hero.astro` sahaja.
6. Commit: `Ground character on rock and remove circular frame`.
7. Buka deployment Vercel Preview terbaru selepas Ready.

Tidak perlu edit `package.json`, font, theme script atau tetapan Vercel. Tidak perlu padam aset V2; ia tidak lagi dirujuk oleh component baharu.

## Apa yang dibetulkan

Karakter, contact shadow dan batu kini dirender dalam frame scene yang sama. Kaki tidak mempunyai offset CSS berasingan daripada tanah. Scene maksimum 720px lebar pada desktop mengawal saiz karakter (sekitar 210–230px tinggi), dan mobile menggunakan scene 620px yang diposisikan semula supaya karakter kekal kelihatan. Teks hero tidak bergerak bersama scene.

Tiada lagi mask bulat di sekeliling karakter. Fade lurus pada bahagian langit atas dan hujung kiri/kanan panorama menyambungkan pemandangan dengan background. Bahagian kaki dan batu di bawahnya kekal penuh.

Poppins, greeting, ulang lambai, matahari/bulan dan reduced motion kekal. Aset ini ialah composite raster empat frame; ia **bukan** transparent cutout atau model 3D. Pilihan ini memastikan batu dan kaki kekal bersambung tanpa latar bulat. Sedikit variasi artwork antara frame masih mungkin kelihatan.

Build dan rujukan aset disemak. Semakan browser/peranti sebenar belum dijalankan; semak preview pada laptop dan telefon sebelum merge main.

## Asal aset

Built-in ImageGen, dua sprite sheets 2×2 berdasarkan scene gunung dan karakter V2. Prompt: full scene yang sama pada empat frame; chibi kecil pada x75%, kepala y60%, tapak kasut y94%; kaki berpijak pada batu bersambung dengan contact shadow; hanya tangan kanan melambai; tema siang/malam; tiada teks, garisan grid, pulau batu atau bulatan.
