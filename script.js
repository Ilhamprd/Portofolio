/**
 * ============================================================
 * NEOBRUTALISM PORTFOLIO — script.js
 * Alex Rivera | Full Stack Developer & UI/UX Designer
 * ============================================================
 *
 * Features:
 *  1. Smooth scrolling navigation
 *  2. Active nav link highlighting (scroll spy)
 *  3. Scroll-triggered reveal animations (IntersectionObserver)
 *  4. Typewriter effect for hero subtitle
 *  5. Mobile hamburger menu toggle
 *  6. Form validation with neobrutalism error messages
 *  7. Parallax effect for hero geometric shapes
 *  8. "Back to top" button visibility
 *  9. Skill bar animations on scroll
 * 10. Navbar background change on scroll
 */

'use strict';

/* ── DOM references ──────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navLinkEls  = document.querySelectorAll('.nav-link');
const backToTop   = document.getElementById('backToTop');
const sections    = document.querySelectorAll('section[id]');
const revealEls   = document.querySelectorAll('.reveal');
const skillBars   = document.querySelectorAll('.skill-bar');
const typewriterEl= document.getElementById('typewriterText');
const contactForm = document.getElementById('contactForm');
const heroShapes  = document.querySelectorAll('.hero-shape');

/* ── Typewriter effect ───────────────────────────────────────── */
const typewriterPhrases = [
  'building cool stuff with code.',
  'crafting pixel-perfect UIs.',
  'turning ideas into products.',
  'obsessing over the details.',
  'shipping features, not excuses.',
];

let twPhraseIdx   = 0;
let twCharIdx     = 0;
let twDeleting    = false;
let twTimeout     = null;

/**
 * Advances the typewriter one step: types or deletes one character,
 * then schedules the next step.
 */
function typewriterStep() {
  const currentPhrase = typewriterPhrases[twPhraseIdx];

  if (twDeleting) {
    // Remove one character
    twCharIdx--;
    typewriterEl.textContent = currentPhrase.slice(0, twCharIdx);

    if (twCharIdx === 0) {
      twDeleting = false;
      twPhraseIdx = (twPhraseIdx + 1) % typewriterPhrases.length;
      twTimeout = setTimeout(typewriterStep, 500); // pause before typing next
      return;
    }
    twTimeout = setTimeout(typewriterStep, 45);
  } else {
    // Add one character
    twCharIdx++;
    typewriterEl.textContent = currentPhrase.slice(0, twCharIdx);

    if (twCharIdx === currentPhrase.length) {
      // Finished typing — pause, then start deleting
      twTimeout = setTimeout(() => {
        twDeleting = true;
        typewriterStep();
      }, 2200);
      return;
    }
    twTimeout = setTimeout(typewriterStep, 85);
  }
}

// Kick off the typewriter on load
if (typewriterEl) {
  twTimeout = setTimeout(typewriterStep, 800);
}

/* ── Hamburger menu ──────────────────────────────────────────── */
/**
 * Toggles the mobile navigation menu open/closed.
 */
function toggleMenu(forceClose = false) {
  const isOpen = !forceClose && !hamburger.classList.contains('open');

  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  navLinks.classList.toggle('open', isOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

// Close menu when a nav link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    toggleMenu(true);
  }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.classList.contains('open')) {
    toggleMenu(true);
  }
});

/* ── Scroll spy — active nav link ───────────────────────────── */
/**
 * Determines which section is currently in view and highlights
 * the corresponding nav link.
 */
function updateActiveNavLink() {
  const scrollY = window.scrollY;
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')) - 40;
    if (scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinkEls.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentSection}`
    );
  });
}

/* ── Navbar background on scroll ────────────────────────────── */
/**
 * Adds/removes the "scrolled" class to the navbar after the user
 * scrolls past 60px, swapping the yellow background for white.
 */
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

/* ── Back-to-top button ─────────────────────────────────────── */
/**
 * Shows the back-to-top button after the user has scrolled
 * more than one viewport height.
 */
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Smooth scrolling for anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // ignore bare "#" links

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Parallax on hero shapes ────────────────────────────────── */
/**
 * Applies a subtle parallax offset to the decorative hero shapes
 * based on how far the user has scrolled. Each shape has a
 * slightly different speed factor for depth variety.
 */
const parallaxSpeeds = [0.08, -0.06, 0.12, -0.09, 0.05];

function updateParallax() {
  const scrollY = window.scrollY;
  // Only apply parallax while hero is partially visible
  if (scrollY > window.innerHeight * 1.2) return;

  heroShapes.forEach((shape, i) => {
    const speed = parallaxSpeeds[i % parallaxSpeeds.length];
    const offset = scrollY * speed;
    shape.style.transform = shape.dataset.baseTransform
      ? `${shape.dataset.baseTransform} translateY(${offset}px)`
      : `translateY(${offset}px)`;
  });
}

// Store each shape's base CSS transform so we can append to it
heroShapes.forEach((shape) => {
  const computed = window.getComputedStyle(shape).transform;
  // We read the inline transform attribute that already has rotate(), etc.
  shape.dataset.baseTransform = shape.style.transform || '';
});

/* ── Scroll-triggered reveal (IntersectionObserver) ─────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── Skill bar animations ────────────────────────────────────── */
/**
 * When a skill card enters the viewport, animate its progress bar
 * from 0 to the target width defined by the --bar-width CSS custom
 * property. We use a short timeout so the card's fade-in finishes
 * before the bar fills.
 */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.classList.add('animated');
        }, 200);
        skillBarObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach((bar) => skillBarObserver.observe(bar));

/* ── Contact form validation ─────────────────────────────────── */
/**
 * Validates a single form field and updates the UI accordingly.
 * Returns true if the field is valid, false otherwise.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @param {HTMLElement} errorEl
 * @param {string} errorMsg
 * @param {Function|null} customValidator - optional extra check returning bool
 */
function validateField(input, errorEl, errorMsg, customValidator = null) {
  const value = input.value.trim();
  let isValid = value.length > 0;

  if (isValid && customValidator) {
    isValid = customValidator(value);
  }

  if (!isValid) {
    input.classList.add('error');
    errorEl.textContent = errorMsg;
    errorEl.classList.add('visible');
  } else {
    input.classList.remove('error');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  return isValid;
}

/**
 * Simple email pattern check.
 * @param {string} val
 */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

if (contactForm) {
  const nameInput    = document.getElementById('formName');
  const emailInput   = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const messageInput = document.getElementById('formMessage');
  const submitBtn    = document.getElementById('formSubmit');
  const successEl    = document.getElementById('formSuccess');

  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Live validation — clear error as soon as the user starts fixing it
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) {
      nameInput.classList.remove('error');
      nameError.classList.remove('visible');
    }
  });

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value.trim())) {
      emailInput.classList.remove('error');
      emailError.classList.remove('visible');
    }
  });

  subjectInput.addEventListener('input', () => {
    if (subjectInput.value.trim().length > 0) {
      subjectInput.classList.remove('error');
      subjectError.classList.remove('visible');
    }
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) {
      messageInput.classList.remove('error');
      messageError.classList.remove('visible');
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const validName    = validateField(nameInput,    nameError,    'Please enter your name.');
    const validEmail   = validateField(emailInput,   emailError,   'Please enter a valid email address.', isValidEmail);
    const validSubject = validateField(subjectInput, subjectError, 'Please enter a subject.');
    const validMessage = validateField(
      messageInput, messageError,
      'Message must be at least 10 characters.',
      (v) => v.length >= 10
    );

    if (!validName || !validEmail || !validSubject || !validMessage) {
      // Shake the submit button on failure
      submitBtn.style.animation = 'none';
      submitBtn.offsetHeight; // reflow to restart animation
      submitBtn.style.animation = 'shake 0.4s ease';
      return;
    }

    // All valid — simulate sending (no real backend)
    submitBtn.textContent = 'SENDING…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      // Reset form
      contactForm.reset();
      submitBtn.textContent = 'SEND MESSAGE';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      // Show success message
      successEl.classList.add('visible');

      // Hide success message after 6 seconds
      setTimeout(() => {
        successEl.classList.remove('visible');
      }, 6000);
    }, 1400);
  });
}

/* ── Shake keyframes (injected dynamically) ──────────────────── */
(function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%   { transform: translate(0, 0); }
      15%  { transform: translate(-5px, 0); }
      30%  { transform: translate(5px, 0); }
      45%  { transform: translate(-4px, 0); }
      60%  { transform: translate(4px, 0); }
      75%  { transform: translate(-2px, 0); }
      90%  { transform: translate(2px, 0); }
      100% { transform: translate(0, 0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ── Unified scroll handler ──────────────────────────────────── */
/**
 * We use requestAnimationFrame to throttle all scroll-based
 * computations to once per animation frame, preventing jank.
 */
let rafPending = false;

function onScroll() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateNavbar();
      updateActiveNavLink();
      updateBackToTop();
      updateParallax();
      rafPending = false;
    });
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── Initial calls on page load ──────────────────────────────── */
updateNavbar();
updateActiveNavLink();
updateBackToTop();

/* ── Rotating badge fallback fix ─────────────────────────────── */
/**
 * The hero badge uses CSS animation to spin the inner text block.
 * This is a visual-only element so no JS interaction needed — but
 * we add a title attribute for accessibility on load.
 */
const badgeRing = document.querySelector('.badge-ring');
if (badgeRing) {
  badgeRing.setAttribute('title', 'Open to Remote, Freelance, and Full-time roles');
}

/* ── Prefetch on hover for nav links ─────────────────────────── */
/**
 * When hovering a nav link that points to an internal section,
 * we smooth-scroll to that section even if clicked mid-scroll.
 * (Already handled by the smooth scrolling listener above — this
 *  block is intentionally empty as no prefetch is needed for
 *  single-page anchor navigation.)
 */

/* ── Resize handler — close menu if window widens ───────────── */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth > 768 && hamburger.classList.contains('open')) {
      toggleMenu(true);
    }
  }, 150);
});

/* ── Focus trap for mobile menu ──────────────────────────────── */
/**
 * When the mobile menu is open, Tab navigation should cycle through
 * the menu links and the hamburger button only.
 */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !hamburger.classList.contains('open')) return;

  const focusableEls = [hamburger, ...Array.from(navLinks.querySelectorAll('.nav-link'))];
  const first = focusableEls[0];
  const last  = focusableEls[focusableEls.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ── Stat counter animation ──────────────────────────────────── */
/**
 * Animates the stat number counters in the About section from 0
 * to their target value when they scroll into view.
 */
const statNumbers = document.querySelectorAll('.stat-number');

/**
 * Eases a counter from 0 to `target` over `duration` ms.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {string} suffix - e.g. "+" or ""
 * @param {number} duration
 */
function animateCounter(el, target, suffix, duration = 1200) {
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const raw = el.textContent.trim();

      // Parse value and suffix (e.g. "5+" → target=5, suffix="+")
      const match = raw.match(/^(\d+)([^\d]*)$/);
      if (match) {
        const target = parseInt(match[1], 10);
        const suffix = match[2] || '';
        animateCounter(el, target, suffix);
      }

      statObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

statNumbers.forEach((el) => statObserver.observe(el));

/* ── Cursor follow effect on project cards ───────────────────── */
/**
 * Adds a subtle tilt effect to project cards based on mouse
 * position within the card, reinforcing the neobrutalism physicality.
 */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -3;   // max ±3 deg
    const rotateY = ((x - cx) / cx) *  3;

    card.style.transform = `translate(-4px, -4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'box-shadow 0.18s ease'; // keep shadow smooth
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.3s ease, box-shadow 0.18s ease';
  });
});

/* ── Skill card hover sound (visual pulse) ───────────────────── */
/**
 * On hovering a skill card, briefly pulses the border width for a
 * satisfying neobrutalism "click" feel — no audio needed.
 */
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.borderWidth = '5px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderWidth = '';
  });
});

/* ── Footer current year ─────────────────────────────────────── */
/**
 * Keeps the copyright year in sync automatically.
 */
const yearEls = document.querySelectorAll('.footer-bottom p');
yearEls.forEach((el) => {
  el.innerHTML = el.innerHTML.replace(
    /\d{4}(?= Alex Rivera)/,
    new Date().getFullYear()
  );
});
