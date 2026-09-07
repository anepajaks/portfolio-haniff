# Coffee Lab Preview V3 — Bags, cameras and drink selection

Patch untuk portfolio preview selepas Coffee-Lab-Preview-V2-PATCH.
Ketiga-tiga update disertakan dalam satu ZIP. Pack beans berasingan tidak perlu
diupload dahulu. Tiada perubahan dependencies atau komponen homepage.

## Cara upload GitHub

1. Extract Coffee-Lab-Preview-V3-PATCH.zip.
2. Buka repository portfolio dan pilih branch preview yang sudah mengandungi V2.
3. Di root repository, pilih Add file > Upload files.
4. Drag folder src, public, tests dan docs dari dalam ZIP yang diextract.
5. Kekalkan susunan folder. Gabungkan kandungannya; jangan padam folder sedia ada.
6. Commit ke branch preview. Semak preview hosting jika ia disambungkan.

READ-ME-FIRST.md ialah panduan sahaja. Jangan upload fail .ts/.astro terus di root
atau upload ZIP sebagai satu fail. Jika anda mengubah fail yang sama selepas V2,
gabungkan perubahan anda dahulu sebelum menggantikan fail tersebut.

## Perubahan yang boleh dicuba

- Play membawa visitor ke pandangan interior dari atas dan menyerong.
- Semua jalan, kenderaan, pedestrian, pokok luar, awan dan shell kedai disembunyikan
  semasa interior. Lampu siling kekal tersembunyi. Keluar memulihkan exterior.
- Rak belakang ada dua bag untuk setiap jenis (8 bag), dan dua cawan.
  Empat jenis: Medium Roast, Dark Roast, Decaf, House Blend. Semua bag tertutup.
- Visitor memilih Espresso, Americano, Caffè Latte atau Cappuccino sebelum stesen.
- Pilihan menu menyimpan resipi sesi dan membuka butang stesen. Ia tidak terus
  memulakan grinding. Visitor boleh menukar menu.
- Pilih stesen: barista berjalan ke sana dan kamera bergerak ke belakangnya,
  menghadap peralatan. Reset view kembali ke angle stesen semasa.
- Change drink kembali ke pandangan keseluruhan interior. Keluar membuang pilihan
  sesi supaya Play seterusnya bermula dengan pilihan menu baru.
- Auto orbit dimatikan dalam interior. Orbit manual dan zoom masih tersedia.
- Reduced motion menjadikan peralihan kamera serta-merta.

## Had fasa ini

Pemilihan beans interaktif, weighing, grinding sebenar, extraction, steaming,
scoring dan lesson lengkap belum dibuat. Butang stesen sekarang ialah eksplorasi
resipi dengan penerangan khusus menu. Ini bukan simulasi brewing yang lengkap.

## Semakan

- TypeScript: node node_modules/typescript/bin/tsc -p tsconfig.coffee-lab.json
- Tests: node --test tests/coffee-lab.test.mjs (7 lulus)
- Build: npm run build (lulus)
- Route /coffee-lab/ memberi HTTP 200.
- Semakan visual browser/FPS untuk gabungan V3 belum dilakukan.
- Build masih memberi advisory saiz bundle 3D melebihi 500 KB.

Ujian Node menyemak logic menu, camera presets, visibility dan pergerakan. Bagi
model bertekstur, ujian Node memeriksa rujukan tekstur tertanam dan mengimport
geometry tanpa decode GPU. Empat bag telah dilihat dalam viewer sebenar pada
fasa aset sebelum integrasi V3.

## Asas menu

Espresso ialah asas; Americano menambah air panas; Latte menambah susu steamed
dengan lapisan microfoam nipis; Cappuccino menggunakan foam lebih ketara daripada
Latte. Resipi dan ukuran boleh berbeza antara café; UI tidak menetapkan nisbah
universal untuk semua beans.

Rujukan:
- https://home.lamarzoccousa.com/building-espresso-drinks/
- https://sca.coffee/sca-news/25-magazine/issue-3/defining-ever-changing-espresso-25-magazine-issue-3-zyx36
