const retryBtn = document.getElementById('retry-btn');
const card = document.getElementById('auth-card');

if (retryBtn && card) {
  retryBtn.addEventListener('click', () => {
    card.classList.remove('pulse');
    void card.offsetWidth; // force reflow
    card.classList.add('pulse');

    setTimeout(() => {
      location.reload();
    }, 350);
  });
}
