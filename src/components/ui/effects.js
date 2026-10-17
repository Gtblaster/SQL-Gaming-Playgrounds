/**
 * UI Effects: Toast notifications, Canvas Confetti, and DOM animations
 */

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✨' : type === 'error' ? '⚠️' : type === 'warning' ? '🔔' : 'ℹ️'}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

export function shakeElement(el) {
  if (!el) return;
  el.classList.add('shake-anim');
  setTimeout(() => el.classList.remove('shake-anim'), 500);
}

export function fireConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors = ['#6C63FF', '#FF6584', '#43AA8B', '#F9A825', '#00D2D3', '#FF9F43'];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `-20px`;
    particle.style.transform = `scale(${Math.random() * 0.8 + 0.5}) rotate(${Math.random() * 360}deg)`;

    const fallDuration = Math.random() * 2000 + 1500;
    const horizontalDrift = (Math.random() - 0.5) * 200;

    container.appendChild(particle);

    particle.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${horizontalDrift}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: fallDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
  }
}
