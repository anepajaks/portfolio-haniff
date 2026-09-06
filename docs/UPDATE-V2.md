# Update Poppins, karakter lambai dan siang/malam

Pakej ini ialah source lengkap; jika versi sebelumnya sudah berjalan, cukup upload tiga folder `src`, `public`, `docs` serta `README.md` daripada pakej baharu. `package.json` dan lockfile tidak berubah.

## Cara upload untuk Haniff

1. Extract ZIP ke folder baharu supaya tidak bercampur dengan download lama.
2. Dalam GitHub, buka root repository `portfolio-haniff` dan pilih branch **portfolio-redesign**.
3. Pilih **Add file → Upload files**.
4. Dari File Explorer, **drag folder `src`, `public`, `docs` bersama foldernya**, dan fail `README.md`, ke ruang upload. Jangan buka setiap subfolder dan upload fail satu-satu ke root.
5. Semak senarai: mesti ada `src/components/HaniffCharacter.astro`, `src/styles/hero.css` dan `public/characters/haniff-wave-day.webp`. Jika hanya nama fail tanpa laluan, hentikan dan ulang drag folder.
6. Commit dengan mesej `Resize character, add wave greeting and Poppins theme`.
7. Buka deployment Vercel Preview paling baharu untuk branch `portfolio-redesign` selepas status Ready.

Tidak perlu tukar tetapan Vercel atau merge main untuk mencuba update ini. Fail yang tersalah upload ke root sebelum ini tidak digunakan oleh Astro; pembetulan ini bergantung pada fail di bawah `src` dan `public` yang betul.

## Apa berubah

| Bahagian | Hasil |
| --- | --- |
| Font | Poppins: heading ExtraBold 800, navigation/butang Bold 700, body Regular 400 |
| Karakter | Lebih kecil; saiz dikaitkan kepada saiz heading, tidak lagi membesar ikut background |
| Lambai | Empat frame, dimainkan selama 2.4 saat selepas artwork siap dimuatkan; klik untuk ulang |
| Greeting | Speech bubble: Hello! Welcome to Haniff’s portfolio. |
| Day/night | Matahari dan bulan beralih dengan fade/pergerakan; ikon butang juga bertukar |
| Reduced motion | Lambai dan transition dimatikan; karakter dan greeting tetap kelihatan |

## Fail utama yang diubah / ditambah

- `src/components/Hero.astro`
- `src/components/HaniffCharacter.astro`
- `src/components/ThemeToggle.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/styles/hero.css` (baharu)
- `src/styles/animations.css`
- `src/scripts/character.ts` (baharu)
- `public/characters/haniff-wave-day.webp` dan `haniff-wave-night.webp` (baharu)
- `public/images/landscape-day.webp` dan `landscape-night.webp` (baharu, tanpa karakter)
- `public/fonts/poppins-latin-400-normal.woff2`, `poppins-latin-700-normal.woff2`, `poppins-latin-800-normal.woff2` dan `POPPINS-LICENSE.txt` (baharu)

Upload folder penuh lebih mudah daripada memilih senarai ini satu-satu, dan memastikan setiap import tersedia dalam commit yang sama.

## Saiz dan batas animasi

Saiz karakter dikawal dalam `src/styles/hero.css`, pada `.character-button`: `width: calc(var(--title-size) * 2.7)`. Dua baris nama mempunyai tinggi kira-kira 2.16 kali saiz font; artwork mengisi kira-kira 90% bingkai. Ini menjadikan karakter hampir setinggi nama, sedikit lebih tinggi, dengan had mobile tersendiri.

Karakter ialah sprite empat frame, bukan model 3D. Ada sedikit perbezaan antara frame/lighting day-night; ini greeting ringkas, bukan animasi sinematik 60 FPS. Bingkai mempunyai latar lembut berwarna mengikut theme, bukan PNG alpha cutout. Greeting dipaparkan sebagai teks tanpa audio automatik.

Semak saiz pada laptop dan telefon, kedua-dua theme, greeting, replay dan keyboard dalam Vercel Preview sebelum merge. Build dan semakan logik dijalankan; ujian visual browser/device sebenar belum dijalankan.
