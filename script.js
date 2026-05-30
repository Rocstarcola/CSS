// ===== Treasure Trove 3D =====

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// Close mobile menu after clicking a link
links.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Quote form handling (front-end only — wire up to a backend/email service later)
const form = document.getElementById('quoteForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk) {
    note.textContent = 'Please add your name and a valid email so we can reach you.';
    note.className = 'form-note err';
    return;
  }

  // TODO: replace with a real submission (Formspree, Netlify Forms, or an email API).
  note.textContent = `Thanks, ${name.split(' ')[0]}! Your request is ready — we'll be in touch soon. 🎉`;
  note.className = 'form-note ok';
  form.reset();
});

// Subtle reveal-on-scroll for cards/steps
const revealEls = document.querySelectorAll('.step, .card, .plan, .benefits li');
if ('IntersectionObserver' in window) {
  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
}
