/* ============================================================
   NebuLock EU — JavaScript
   Matrix Rain, Particle Grid, Scroll Animations, Navbar, Cursor
   ============================================================ */

'use strict';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. MATRIX RAIN (subtle, elegant, low-opacity)
  // ----------------------------------------------------------
  const canvas = document.getElementById('matrixCanvas');
  let ctx = canvas.getContext('2d');

  let matrixCols, matrixRows, matrixDrops;

  function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    matrixCols = Math.floor(canvas.width / 18);
    matrixRows = Math.floor(canvas.height / 20);
    matrixDrops = [];
    for (let i = 0; i < matrixCols; i++) {
      matrixDrops[i] = Math.floor(Math.random() * -matrixRows);
    }
  }

  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&*%#';

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 11, 14, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '13px JetBrains Mono, monospace';

    for (let i = 0; i < matrixCols; i++) {
      const x = i * 18;
      const drop = matrixDrops[i];

      for (let j = 0; j < 3; j++) {
        const yPos = (drop + j) * 20;
        if (yPos < 0 || yPos > canvas.height) continue;

        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const distFromCenter = Math.abs(yPos - canvas.height / 2) / (canvas.height / 2);

        if (j === 1) {
          ctx.fillStyle = `rgba(0, 240, 181, ${0.35 * (1 - distFromCenter)})`;
          ctx.shadowColor = 'rgba(0, 240, 181, 0.1)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(0, 240, 181, ${0.08 * (1 - distFromCenter)})`;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, yPos);
      }

      ctx.shadowBlur = 0;

      if (matrixDrops[i] * 20 > canvas.height && Math.random() > 0.98) {
        matrixDrops[i] = 0;
      }
      matrixDrops[i]++;
    }
  }

  initMatrix();
  let matrixInterval = setInterval(drawMatrix, 60);

  // ----------------------------------------------------------
  // 2. PARTICLE GRID
  // ----------------------------------------------------------
  const gridContainer = document.getElementById('particleGrid');
  const gridDots = [];

  function initParticleGrid() {
    gridContainer.innerHTML = '';
    gridDots.length = 0;

    const spacing = 60;
    const cols = Math.floor(window.innerWidth / spacing) + 2;
    const rows = Math.floor(window.innerHeight / spacing) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = (c * spacing + Math.random() * 10 - 5) + 'px';
        dot.style.top = (r * spacing + Math.random() * 10 - 5) + 'px';
        dot.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        dot.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
        gridContainer.appendChild(dot);
        gridDots.push(dot);
      }
    }
  }

  initParticleGrid();

  // ----------------------------------------------------------
  // 3. RESIZE HANDLER
  // ----------------------------------------------------------
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initMatrix();
      initParticleGrid();
    }, 250);
  });

  // ----------------------------------------------------------
  // 4. NAVBAR SCROLL EFFECT
  // ----------------------------------------------------------
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ----------------------------------------------------------
  // 5. MOBILE NAV TOGGLE
  // ----------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ----------------------------------------------------------
  // 6. INTERSECTION OBSERVER — Reveal Animations
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ----------------------------------------------------------
  // 7. SERVICE CARDS — stagger children
  // ----------------------------------------------------------
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    if (!card.getAttribute('data-delay')) {
      card.setAttribute('data-delay', i * 100);
    }
  });

  // ----------------------------------------------------------
  // 8. CUSTOM CURSOR
  // ----------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  // Check if touch device
  let isTouchDevice = false;

  document.addEventListener('touchstart', () => {
    isTouchDevice = true;
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }, { once: true });

  document.addEventListener('mousemove', (e) => {
    if (isTouchDevice) return;

    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .service-card, .tech-layer, .flow-node, input, textarea'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('hover');
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('hover');
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (!isTouchDevice) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
  });

  // ----------------------------------------------------------
  // 9. PARALLAX EFFECT ON HERO
  // ----------------------------------------------------------
  const heroContent = document.querySelector('.hero-content');

  document.addEventListener('mousemove', (e) => {
    if (isTouchDevice) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroContent.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  // Reset on window leave
  document.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });

  // ----------------------------------------------------------
  // 10. SMOOTH PARALLAX ON MATRIX CANVAS (scroll-based)
  // ----------------------------------------------------------
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const diff = scrollY - lastScrollY;
    lastScrollY = scrollY;

    // Move matrix canvas slightly for parallax feel
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
      canvas.style.transform = `translateY(${progress * 40}px)`;
      canvas.style.opacity = Math.max(0.12 * (1 - progress * 0.7), 0.02);
    }

    // Slow down matrix rain when scrolling
    clearInterval(matrixInterval);
    const speed = Math.max(40, 60 - Math.abs(diff) * 2);
    matrixInterval = setInterval(drawMatrix, speed);
  });

  // ----------------------------------------------------------
  // 11. CONTACT FORM — simple handler
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Mensaje enviado';
      btn.style.background = 'var(--cyan)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ----------------------------------------------------------
  // 12. TECH FLOW — sequential glow animation
  // ----------------------------------------------------------
  const flowNodes = document.querySelectorAll('.flow-node');
  let flowIndex = 0;

  function animateFlow() {
    flowNodes.forEach((node, i) => {
      if (i === flowIndex) {
        node.style.background = 'var(--accent-dim)';
        node.style.boxShadow = '0 0 30px var(--accent-glow)';
        node.style.color = 'var(--accent)';
      } else {
        node.style.background = '';
        node.style.boxShadow = '';
        node.style.color = '';
      }
    });

    flowIndex = (flowIndex + 1) % flowNodes.length;
  }

  // Start flow animation when in viewport
  const techFlow = document.querySelector('.tech-flow');
  if (techFlow) {
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInterval(animateFlow, 1200);
          flowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    flowObserver.observe(techFlow);
  }

  // ----------------------------------------------------------
  // 13. PERFORMANCE — pause animations when not visible
  // ----------------------------------------------------------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(matrixInterval);
    } else {
      matrixInterval = setInterval(drawMatrix, 60);
    }
  });

  console.log('NebuLock EU — Sovereign Infrastructure. Built in Madrid.');
});
// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(()=> loader.classList.add('hidden'), 600);
});

// Navbar scroll + active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 20);

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const runCounter = (el) => {
  const target = +el.dataset.target;
  let current = 0;
  const step = target / 40;
  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('counter')) runCounter(e.target);
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.reveal, .counter').forEach(el => observer.observe(el));

// Parallax hero
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.3;
  hero.style.backgroundPosition = `center ${y}px`;
});
