// ── Particles background ──
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < 90; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,182,212,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6,182,212,${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Cursor glow ──
if (window.innerWidth > 768) {
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', ({ clientX, clientY }) => {
      glow.style.left = clientX + 'px';
      glow.style.top = clientY + 'px';
    });
  }
}

// ── Nav scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger (Bootstrap handles toggle, but close on link click) ──
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    if (collapse?.classList.contains('show')) toggler?.click();
  });
});

// ── Active nav link ──
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === page) link.classList.add('active');
});

// ── Intersection observer (fade-up / fade-left / fade-right) ──
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => io.observe(el));

// ── Skill bar animation ──
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-bar-section').forEach(el => barObserver.observe(el));

// ── Animated counters ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target % 1 === 0 ? Math.floor(ease * target) : (ease * target).toFixed(1);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stats-row').forEach(el => counterObserver.observe(el));

// ── Typing effect ──
function startTyping(el) {
  if (!el) return;
  const words = JSON.parse(el.dataset.words || '[]');
  if (!words.length) return;
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 45);
    }
  }
  tick();
}

startTyping(document.getElementById('typing-text'));

// ── Tilt effect on project cards ──
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Toast ──
function showToast(msg) {
  let t = document.querySelector('.toast-custom');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast-custom';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span style="color:var(--cyan)">✓</span> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Copy email ──
document.querySelectorAll('.copy-email').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('tirthpatel0325@gmail.com').then(() => showToast('Email copied to clipboard!'));
  });
});

// ── Contact form ──
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.innerHTML = 'Send Message →';
    btn.disabled = false;
    showToast('Message sent! I\'ll reply within 24 hours.');
  }, 1400);
});
