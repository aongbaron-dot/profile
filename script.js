document.querySelectorAll('.navbar a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section-observe').forEach((el) => observer.observe(el));

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let bubbles = [];
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

function createBubbles() {
  const count = 40;
  bubbles = new Array(count).fill(0).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 4 + Math.random() * 16,
    s: 0.3 + Math.random() * 0.8,
    c: [
      'rgba(255, 209, 220, 0.6)',
      'rgba(162, 210, 255, 0.6)',
      'rgba(189, 224, 254, 0.6)',
      'rgba(205, 180, 219, 0.6)',
    ][Math.floor(Math.random() * 4)],
  }));
}
createBubbles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const b of bubbles) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.c;
    ctx.fill();
    b.y -= b.s * 0.6;
    b.x += Math.sin(b.y * 0.01) * 0.3;
    if (b.y + b.r < 0) {
      b.y = canvas.height + b.r;
      b.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animate);
}
animate();

const cursorLayer = document.getElementById('cursor-stars');
let lastSparkle = 0;
addEventListener('pointermove', (e) => {
  const now = performance.now();
  if (now - lastSparkle < 16) return;
  lastSparkle = now;
  const s = document.createElement('div');
  s.className = 'star';
  s.style.left = e.clientX - 4 + 'px';
  s.style.top = e.clientY - 4 + 'px';
  cursorLayer.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

const timeline = document.querySelector('.timeline');
if (timeline) {
  document.querySelector('.scroll-btn.left').addEventListener('click', () => {
    timeline.scrollBy({ left: -200, behavior: 'smooth' });
  });
  document.querySelector('.scroll-btn.right').addEventListener('click', () => {
    timeline.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

function openModal(root, onOpen) {
  root.setAttribute('aria-hidden', 'false');
  root.setAttribute('aria-modal', 'true');
  document.body.style.overflow = 'hidden';
  onOpen && onOpen();
}
function closeModal(root) {
  root.setAttribute('aria-hidden', 'true');
  root.setAttribute('aria-modal', 'false');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal').forEach((m) => {
  m.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal(m);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(m);
  });
});

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
document.querySelectorAll('.work').forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.getAttribute('data-img');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    openModal(modal, () => {
      modalImg.src = img;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
    });
  });
});

const eduModal = document.getElementById('edu-modal');
const eduImg = document.getElementById('edu-img');
const eduTitle = document.getElementById('edu-title');
const eduYear = document.getElementById('edu-year');
const eduDesc = document.getElementById('edu-desc');
document.querySelectorAll('.milestone').forEach((node) => {
  node.addEventListener('click', () => {
    openModal(eduModal, () => {
      eduImg.src = node.getAttribute('data-img');
      eduTitle.textContent = node.getAttribute('data-title');
      eduYear.textContent = node.getAttribute('data-year');
      eduDesc.textContent = node.getAttribute('data-desc');
    });
  });
});

function animateProgressBars() {
  document.querySelectorAll('.progress').forEach((p) => {
    const val = Number(p.getAttribute('data-value')) || 0;
    const bar = p.querySelector('.bar');
    requestAnimationFrame(() => (bar.style.width = Math.min(val, 100) + '%'));
  });
}
function animateCircles() {
  document.querySelectorAll('.circle').forEach((c) => {
    const val = Number(c.getAttribute('data-value')) || 0;
    const circ = c.querySelector('.fg');
    const percentText = c.querySelector('.percent');
    const circumference = 2 * Math.PI * 42;
    const target = Math.max(0, Math.min(100, val));
    circ.style.strokeDasharray = String(circumference);
    circ.style.strokeDashoffset = String(circumference);
    const duration = 900;
    const start = performance.now();
    function step(t) {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const now = Math.round(target * eased);
      percentText.textContent = now + '%';
      circ.style.strokeDashoffset = String(circumference * (1 - now / 100));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillsObs = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        animateProgressBars();
        animateCircles();
        skillsObs.unobserve(ent.target);
      }
    });
  }, { threshold: 0.3 });
  skillsObs.observe(skillsSection);
}

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.classList.add('sent');
    setTimeout(() => {
      btn.classList.remove('sent');
      form.reset();
      alert('ขอบคุณสำหรับข้อความครับ!');
    }, 1200);
  });
}


