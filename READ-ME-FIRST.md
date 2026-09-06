# Portfolio character fix

Patch kecil untuk portfolio preview sedia ada (selepas Coffee Lab Preview V2).
Bukan keseluruhan portfolio. Tiada perubahan Coffee Lab atau dependencies.

## Cara upload melalui GitHub
1. Extract ZIP ini di komputer.
2. Buka repository portfolio dan pilih branch preview yang sedang digunakan.
3. Pilih Add file > Upload files.
4. Drag folder src dari DALAM folder yang diextract ke halaman upload di root repository. Kekalkan struktur folder; jangan upload ZIP atau letakkan tiga fail terus di root.
5. Semak senarai perubahan hanya mengandungi:
   - src/components/HaniffCharacter.astro
   - src/styles/hero.css
   - src/styles/animations.css
6. Commit changes ke branch preview. Semak preview deployment jika hosting disambungkan.

Jika menggunakan checkout local, salin dan gantikan tiga fail tersebut mengikut path yang sama, kemudian commit dan push branch preview.
Jangan padam keseluruhan folder src; gabungkan kandungannya.

## Perubahan
- Character homepage dibesarkan mengikut anggaran screenshot, dengan saiz responsif.
- Character statik: bubble Hello, butang klik dan animasi lambai dibuang.
- Gambar day/night sedia ada digunakan semula; pose tangan masih terangkat dalam gambar.
- src/scripts/character.ts lama boleh kekal: ia tidak lagi diimport atau dihantar oleh komponen ini.

Build Astro telah lulus selepas perubahan. Preview desktop telah dilihat.
ZIP ini tidak mengandungi imej preview, node_modules, dist atau fail Coffee Lab.
