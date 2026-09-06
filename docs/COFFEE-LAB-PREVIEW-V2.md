# Coffee Lab — Integrated Assets Preview V2

7 September 2026. **Cumulative PATCH for the portfolio preview branch**, not a complete portfolio repository. This patch includes the earlier Coffee Lab implementation, so previous Coffee Lab patch ZIPs are not prerequisites.

## Apa yang berubah

- Portfolio remains the main About page, with **About / Projects / Contact** navigation.
- Projects → Coffee Lab now has an **Explore Coffee Lab** link to `/coffee-lab/`.
- Coffee Lab's brand link returns to `/#projects`.
- All 29 approved GLBs are included under `public/coffee-lab/models/`. The game loads 26 individual models; the 3 assembled kits are preserved in the package without loading duplicate furniture/equipment into the scene.
- Selected barista, four NPC designs, retro traffic and parked cars replace the old procedural actors and vehicles.
- Heritage coffee equipment, Terracotta Lounge furniture and Garden Corner storefront/street furniture are assembled at compatible physical scales.
- Barista clicks still select Grinder / Espresso / Finishing. The actor turns, walks along the protected staff aisle, faces the counter and blends back to idle. Each NPC has its own cloned skeleton/mixer.
- Exterior auto-orbit, manual orbit, camera reset, transition, cutaway, reduced motion, city pause and graphics presets remain.
- Ceiling fixtures are hidden throughout interior view.
- GLBs load only after opening Coffee Lab. Four concurrent asset requests report loading progress. Failed loading shows a retry message.
- Wheel surfaces are combined by material while preserving the animated wheel nodes; repeated models share geometry/materials.

This is still an **exploration preview**, not a complete brewing simulator. Beans, tamping, extraction interaction, serving, orders, scores and music have not been implemented.

## GitHub preview upload

Base inspected earlier: `anepajaks/portfolio-haniff`, branch `portfolio-redesign`, commit `a2188ff`, Astro 7.3.1. No fresh remote snapshot was fetched for this integration. If that branch has changed, retain those changes and merge the patch carefully. Do not apply this blindly to the older Astro 4 `main` snapshot.

1. Extract `Coffee-Lab-Preview-V2-PATCH.zip`.
2. Select a **preview/work branch** based on your current `portfolio-redesign`. Suggested name: `coffee-lab-assets-preview`.
3. **Drag the folders `src`, `public`, `docs`, and `tests` together with their folder structure into the repository root. Do not upload their individual contents to root.** Merge folders, preserving other portfolio files.
4. Copy root `package.json`, `package-lock.json`, `tsconfig.coffee-lab.json` and `.gitignore` from the patch. If these have changed in your branch, merge the Three.js/TypeScript dependencies and ignore entry instead of replacing newer work.
5. Run locally with Node 22.12+:

```sh
npm ci
npm run dev
```

6. Check the homepage and open Projects → Coffee Lab. Before pushing:

```sh
npx tsc -p tsconfig.coffee-lab.json
node --test tests/coffee-lab.test.mjs
npm run build
```

7. Push your preview branch. If Vercel is already connected to this repository with branch previews enabled, use its preview deployment. This patch does not create or change Vercel/GitHub settings.

No push, merge or deployment has been performed. No need to upload `node_modules`, `.astro`, `dist`, `.coffee-test-build`, standalone asset viewer, or asset generator source into the portfolio.

## Files added / changed

### Portfolio

- `src/components/Header.astro`: About / Projects / Contact links.
- `src/data/projects.ts`: Coffee Lab description, exploration status and route.

### Coffee Lab

- `src/pages/coffee-lab.astro`
- `src/styles/coffee-lab.css`
- `src/scripts/coffee-lab/{main,scene,assets,models,paths,palette}.ts`
- `public/coffee-lab/models/*.glb` (29 files)
- `public/coffee-lab/asset-manifest.json`
- `public/coffee-lab/licenses/*`

### Build / verification / handover

- `package.json`, `package-lock.json`, `.gitignore`, `tsconfig.coffee-lab.json`
- `tests/coffee-lab.test.mjs`
- `docs/COFFEE-LAB-PREVIEW-V2.md`
- `docs/COFFEE-LAB-START-HERE.md`, `docs/COFFEE-LAB-STATUS.md`

## Validation and limits

- TypeScript checks cover all Coffee Lab modules.
- Four automated tests load actual GLBs and exercise traffic continuity, sidewalk boundaries, every barista station destination, ceiling visibility, paused pedestrians, independent skeletons and inclusion of all 26 individual assets.
- Astro production build generates the homepage and Coffee Lab route. Asset requests and HTML routes are checked locally.
- Browser visual QA and FPS measurements for the **combined integrated scene** have not been performed. Prior asset-viewer checks do not establish in-game performance. Check your preview on the target laptop before merging.
- The 3D JavaScript bundle triggers a >500 kB build advisory and the model transfer is several MB. Both are confined to the Coffee Lab route. Loading, shadow cost and many animated meshes can still be significant on weaker hardware; use Low graphics when needed.
- The Walk clip is in-place with a nominal speed mapping, not foot-lock IK. Subtle sliding, rigid joint deformation or pose refinements may remain.
- Actor paths are explicitly constrained; there is no general navmesh or physics simulation. Parking is static and pedestrians do not enter the cafe yet.
- The contact section remains the existing GitHub contact link; no unprovided personal contact information was invented.

## Next milestone

Review this combined preview. After any visual/performance fixes, implement one agreed recipe end-to-end before expanding the drink menu.
