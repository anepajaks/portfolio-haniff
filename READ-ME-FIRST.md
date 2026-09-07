# Coffee Lab — Sealed Bean Bags V1

Empat aset 3D sebenar: Medium Roast, Dark Roast, Decaf dan House Blend.
Setiap bag tertutup. Tiada bag terbuka, loose beans, scoop, label rak atau animasi.

## Upload ke GitHub preview

1. Extract Coffee-Lab-Beans-V1-PATCH.zip.
2. Buka repository portfolio, pilih branch preview sedia ada.
3. Pilih Add file > Upload files di root repository.
4. Drag folder public dari dalam ZIP yang telah diextract. Kekalkan susunan folder.
5. Semak empat fail .glb dan satu manifest.json berada di public/coffee-lab/beans/.
6. Commit perubahan ke branch preview.

Gabungkan folder public; jangan padam atau gantikan seluruh folder public sedia ada.
Jangan upload ZIP sebagai satu fail. READ-ME-FIRST.md ini panduan sahaja.

## Status

Ini pack aset sahaja. Upload tidak akan terus meletakkan bag di rak game.
Penempatan rak, pemilihan beans, angle kamera dan gameplay akan disambungkan
dalam fasa game berikutnya. Homepage dan Coffee Lab sedia ada tidak diubah.

## Integrasi nanti

- URL: /coffee-lab/beans/bean-bag-medium-roast.glb
- URL: /coffee-lab/beans/bean-bag-dark-roast.glb
- URL: /coffee-lab/beans/bean-bag-decaf.glb
- URL: /coffee-lab/beans/bean-bag-house-blend.glb
- GLB glTF 2.0, 280 triangles dan dua mesh setiap bag.
- Tinggi 0.22m; pivot di tengah tapak, Y atas, muka cetakan menghadap +Z.
- Tekstur JPEG 512 x 768 tertanam dalam GLB: tiada fail tekstur tambahan diperlukan.
- Cetakan depan berasaskan design yang diluluskan; sisi dan belakang kertas polos.
- Metadata assetId, beanType dan state='sealed' tersedia pada node utama.
- Import menggunakan GLTFLoader sedia ada. Guna clone untuk ulang bag atas rak;
  kongsi geometry/material supaya tidak perlu load fail yang sama berulang kali.
- Decaf dan House Blend ialah kategori beans, bukan tahap roast. Aturan ilmu
  dan gameplay belum ditetapkan oleh pack ini.

## Semakan

Keempat-empat GLB berjaya dimuat dalam viewer 3D sebenar. Cetakan tegak,
bag tertutup dan tiada beans tambahan. Semakan fail meliputi import geometry,
dimensi, koordinat UV, JPEG tertanam dan data vertex yang sah.

Artwork dibuat menggunakan built-in imagegen daripada preview diluluskan.
Prompt: ratakan cetakan depan bag tertutup menjadi tekstur albedo, kekalkan
warna, nama dan ilustrasi; tanpa perspektif, bayang, bag terbuka atau loose beans.
Geometry pouch dibina sebagai model 3D ringan untuk Coffee Lab.
