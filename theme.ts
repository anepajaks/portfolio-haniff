type Theme = 'light' | 'dark';
const root = document.documentElement;
const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const preferredTheme = matchMedia('(prefers-color-scheme: dark)');
let savedChoice = false;
try { const stored = localStorage.getItem('haniff-theme'); savedChoice = stored === 'light' || stored === 'dark'; } catch { /* Theme still works without storage. */ }
function applyTheme(theme: Theme) {
  root.dataset.theme = theme;
  button?.setAttribute('aria-pressed', String(theme === 'dark'));
  button?.setAttribute('aria-label', theme === 'dark' ? 'Switch to day theme' : 'Switch to night theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#09162c' : '#edf7ff');
}
applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
if (button) button.hidden = false;
button?.addEventListener('click', () => {
  const theme: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  savedChoice = true;
  applyTheme(theme);
  try { localStorage.setItem('haniff-theme', theme); } catch { /* Optional persistence. */ }
});
preferredTheme.addEventListener('change', event => { if (!savedChoice) applyTheme(event.matches ? 'dark' : 'light'); });
window.addEventListener('storage', event => {
  if (event.key !== 'haniff-theme' && event.key !== null) return;
  savedChoice = event.newValue === 'light' || event.newValue === 'dark';
  applyTheme(savedChoice ? event.newValue as Theme : preferredTheme.matches ? 'dark' : 'light');
});
const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector<HTMLElement>('summary')?.focus(); }
});
document.addEventListener('click', event => { if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false; });
