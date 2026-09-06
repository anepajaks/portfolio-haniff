# Haniff Portfolio — Horizon Studio

Homepage Astro berdasarkan pilihan visual A. Versi ini menambah Poppins, karakter lebih kecil dengan lambai ringkas, greeting dan transition matahari/bulan. Tiada nama atau logo di kiri atas; nama kekal dalam hero. Semua gambar dan font dihoskan secara lokal.

## Mula di sini

Buka **[docs/UPDATE-V2.md](docs/UPDATE-V2.md)** untuk update daripada versi sebelumnya. Untuk pemasangan pertama, gunakan **[docs/GITHUB-GUIDE.md](docs/GITHUB-GUIDE.md)**. ZIP ialah source code: extract dahulu, kemudian upload kandungannya dengan struktur folder dikekalkan.

## Jalankan pada laptop

Gunakan Node.js 22.12 atau lebih baharu (Node 22 LTS disyorkan untuk projek ini).

```sh
npm ci
npm run dev
```

Buka URL localhost yang dipaparkan dalam terminal.

```sh
npm run build
npm run preview
```

Output statik berada dalam `dist/`. Vercel tidak memerlukan adapter untuk versi statik ini.

## Apa yang tersedia

- Header dengan menu desktop dan menu mobile yang boleh digunakan tanpa JavaScript.
- Hero dengan karakter lebih kecil, pose berdiri dan satu tangan melambai; tangan satu lagi dalam poket.
- Greeting "Hello! Welcome to Haniff’s portfolio." dengan lambai 2.4 saat selepas aset dimuatkan, dan boleh diulang melalui klik / Enter / Space.
- Matahari bertukar ke bulan apabila theme ditukar, termasuk ikon pada butang.
- Scene gunung siang/malam, theme mengikut sistem dan pilihan disimpan secara lokal.
- CSS responsif, skip link, fokus keyboard, reduced motion.
- Kad Network Lab dan Coffee Lab berstatus **In development**.
- Footer dengan pautan GitHub.

Ini homepage MVP. About menuju pengenalan dalam hero; Contact menuju pautan GitHub. Halaman About, pengalaman, skills, borang contact dan permainan belum dibina. Coffee Lab tidak diubah oleh pakej ini. Karakter kini elemen berasingan menggunakan sprite empat frame dengan latar lembut mengikut theme; ini animasi raster ringkas, bukan model 3D ber-rig. Greeting menggunakan teks tanpa audio. Pose laptop dan backpack boleh ditambah pada peringkat seterusnya.

## Fail yang biasa diedit

| Nak ubah | Fail |
| --- | --- |
| Nama, role, ayat hero | `src/components/Hero.astro` |
| Tajuk tab dan description | `src/layouts/BaseLayout.astro` |
| Menu | `src/components/Header.astro` |
| Tajuk, description, status projek | `src/data/projects.ts` |
| Pautan contact / GitHub | `src/components/Footer.astro` |
| Palet siang dan malam | `src/styles/tokens.css` |
| Layout laptop / mobile | `src/styles/global.css` |
| Saiz hero / karakter / matahari-bulan | `src/styles/hero.css` |
| Greeting dan aset lambai | `src/components/HaniffCharacter.astro` |
| Main / ulang lambai | `src/scripts/character.ts` |
| Motion | `src/styles/animations.css` |
| Pilihan theme | `src/scripts/theme.ts` |
| Artwork lokal | `public/images/` |

Apabila lab sedia, tambah `href` sebenar pada projek dalam `projects.ts`; component akan memaparkan pautan. Jangan tambah pautan ke halaman yang belum wujud.

## Asas teknikal

Astro 7.3.1 dipin bersama lockfile untuk pemasangan konsisten. Projek menggunakan TypeScript dan CSS biasa. Tiada React, Tailwind CDN, skrip tracking, API key atau font pihak ketiga yang dimuatkan oleh browser.

Font Poppins Regular (400), Bold (700) dan ExtraBold (800) dibundel di `public/fonts/` bersama lesen OFL. Heading memakai 800; navigation dan butang memakai 700. Fail Jakarta dan scene berkarakter daripada versi pertama dikekalkan tetapi tidak lagi dimuatkan oleh homepage. Asal artwork dan keputusan visual direkodkan dalam `docs/ASSETS.md`.

`.env` dan `.env.*` dikecualikan daripada Git; hanya `.env.example` dibenarkan jika diperlukan pada masa depan. Tiada environment variable diperlukan untuk MVP ini.

## Pengesahan

Build produksi dan semakan fail/link serta logik theme dijalankan sebelum pakej disediakan. Semakan visual browser, device sebenar dan Lighthouse belum dijalankan. Semak Vercel Preview pada laptop dan telefon sebelum merge ke main.
