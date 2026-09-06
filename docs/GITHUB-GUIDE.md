# Upload pertama — langkah demi langkah

Repository: https://github.com/anepajaks/portfolio-haniff

## 1. Extract ZIP

Download ZIP dan pilih **Extract All / Unzip**. Buka folder `portfolio-haniff` di dalamnya.

Kau sepatutnya nampak `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `README.md`, `src`, `public` dan `docs`. Ada juga `.gitignore` dan `.nvmrc`; sesetengah sistem menyembunyikan fail bermula dengan titik.

**Upload kandungan folder ini. Jangan upload fail ZIP atau satu folder tambahan yang membungkus keseluruhan projek.** `package.json` mesti berada terus di root repository.

## 2. Buka repository dan buat branch

1. Log masuk GitHub dan buka repository di atas.
2. Klik pilihan branch `main`.
3. Taip `portfolio-redesign`, kemudian pilih untuk membuat branch tersebut daripada `main`.
4. Pastikan branch yang dipilih sekarang ialah `portfolio-redesign`.

Branch membolehkan design baharu disemak sebelum menggantikan website utama.

## 3. Upload source code

1. Pada root repository, pilih **Add file → Upload files**.
2. Drag folder `src`, `public`, `docs` dan fail root daripada folder yang diextract.
3. Pastikan senarai upload mempunyai `src/pages/index.astro`, bukan `portfolio-haniff/src/pages/index.astro`.
4. Fail `src/pages/index.astro` dan `package.json` yang lama akan dikemas kini melalui commit ini.
5. Sertakan `.gitignore` dan `.nvmrc`. Jika kedua-duanya tersembunyi, aktifkan paparan hidden files pada komputer. Alternatif: gunakan **Add file → Create new file** untuk setiap nama ini dan salin kandungannya daripada pakej.
6. Tulis commit message: `Build Horizon Studio portfolio homepage`.
7. Pilih commit ke branch `portfolio-redesign`, kemudian **Commit changes**.

Jangan upload `node_modules`, `dist`, `.env` atau `.git`. ZIP yang disediakan tidak mengandungi folder dependency atau output build.

## 4. Semak Vercel Preview

Jika repository ini sudah dihubungkan dengan Vercel dan preview deployment aktif, perubahan branch akan mencetuskan preview. Buka tab Deployments pada projek Vercel untuk melihat hasil dan build log.

Tetapan untuk projek ini:

| Tetapan | Nilai |
| --- | --- |
| Framework Preset | Astro |
| Root Directory | Root repository (`.`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |
| Node.js | 22.x, sekurang-kurangnya 22.12 |
| Environment variables | Tiada |

Jika build gagal, kongsi mesej error daripada build log. Jangan salin token atau nilai rahsia.

## 5. Semak sebelum tukar website utama

Buka preview pada laptop dan telefon. Cuba day/night, refresh untuk mengesahkan pilihan disimpan, buka menu mobile, tab melalui navigation, dan klik Explore My Work serta pautan GitHub. Pastikan hero dan kad tidak terpotong.

Kad lab menunjukkan status pembangunan; permainan memang belum dihubungkan. Ini disengajakan untuk homepage MVP.

## 6. Terbitkan apabila kau puas hati

Di GitHub, buat Pull Request daripada `portfolio-redesign` ke `main`. Semak perubahan, kemudian merge. Jika production Vercel menggunakan branch main dengan auto deployment aktif, merge ini akan mengemas kini website utama.

## Update selepas ini

Buat perubahan kecil pada branch baharu. Contohnya, untuk ubah ayat hero, buka `src/components/Hero.astro`, klik edit, ubah ayat dan commit. Untuk perubahan beberapa fail, lebih mudah menggunakan GitHub Desktop atau editor lokal dengan Git.

Rujukan rasmi:
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://docs.astro.build/en/guides/deploy/vercel/
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
