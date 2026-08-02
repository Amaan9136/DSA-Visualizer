/* ============================= THEME ============================= */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  root.classList.toggle('dark');
  root.classList.toggle('light', !root.classList.contains('dark'));
};
