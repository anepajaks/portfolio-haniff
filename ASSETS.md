# Visual assets

Direction: A / Horizon Studio. Header intentionally has no top-left name or logo.

- `public/images/horizon-day.webp` and `horizon-night.webp`: local artwork generated with built-in ImageGen, based on the approved mountain concept and the user's selected central chibi pose (hands in hoodie pockets). Character and background are composited in one image to avoid false transparency artifacts. The HTML text and navigation remain actual accessible HTML.
- `public/images/coffee-lab.webp`: optimized copy of the user's supplied Coffee Lab concept artwork. It illustrates planned work, not a live game screenshot.
- Network Lab illustration: small inline SVG topology in `src/components/ProjectCard.astro`.
- `public/fonts/plus-jakarta-sans-latin-variable.woff2`: Plus Jakarta Sans Latin variable normal, sourced from `@fontsource-variable/plus-jakarta-sans` 5.3.0. OFL license alongside.
- `public/favicon.svg`: simple local mountain icon.

Prompt set used with built-in ImageGen: preserve the selected chibi identity (curly hair, glasses, cream hoodie, black pants, white shoes, hands in pockets); recreate the approved blue mountain and stone ledge scene with clear sky on the left; create corresponding navy night environment; composite full-body character into the right 76% position, around 70% image height, retaining left space for HTML text. No typography or UI in the image.

The main image map is in `src/components/HaniffCharacter.astro`. Current supported pose is `main`. Other user-selected poses are deferred until suitable local assets are prepared. Generated artwork is raster WebP, not claimed to be SVG or interactive 3D.
