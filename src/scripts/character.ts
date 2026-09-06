const character = document.querySelector<HTMLElement>('[data-character]');
const waveButton = character?.querySelector<HTMLButtonElement>('[data-wave]');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let finishTimer: ReturnType<typeof setTimeout> | undefined;
let restartTimer: ReturnType<typeof setTimeout> | undefined;
let artworkReady = false;
function greet() {
  if (!character || !artworkReady || motionPreference.matches) return;
  clearTimeout(finishTimer);
  clearTimeout(restartTimer);
  character.classList.remove('is-waving');
  restartTimer = setTimeout(() => {
    character.classList.add('is-waving');
    finishTimer = setTimeout(() => character.classList.remove('is-waving'), 2400);
  }, 30);
}
if (character && waveButton) {
  // Decode both themes before playing so a slow connection cannot show blank frames.
  const pictures = [...character.querySelectorAll('img')];
  Promise.all(pictures.map(picture => picture.decode())).then(() => {
    artworkReady = true;
    waveButton.disabled = !artworkReady || motionPreference.matches;
    const hint = character.querySelector<HTMLElement>('[data-wave-hint]');
    if (hint) hint.hidden = !artworkReady || motionPreference.matches;
    greet();
  }).catch(() => { /* The static greeting remains if artwork cannot be loaded. */ });
  waveButton.addEventListener('click', greet);
  motionPreference.addEventListener('change', () => {
    clearTimeout(finishTimer);
    clearTimeout(restartTimer);
    character.classList.remove('is-waving');
    waveButton.disabled = !artworkReady || motionPreference.matches;
    const hint = character.querySelector<HTMLElement>('[data-wave-hint]');
    if (hint) hint.hidden = !artworkReady || motionPreference.matches;
  });
}
