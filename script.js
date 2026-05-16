/* =========================================
   ACT Keralam — Main JavaScript
   Association of Computer Science Teachers
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================
     MOBILE NAVIGATION TOGGLE
  ========================================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* =========================================
     STICKY NAVBAR SHADOW ON SCROLL
  ========================================= */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(244,124,32,0.14)'
        : '0 2px 12px rgba(244,124,32,0.08)';
    });
  }

  /* =========================================
     ACTIVE NAV LINK
  ========================================= */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* =========================================
     FADE-IN ON SCROLL
  ========================================= */
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.about-card, .table-wrapper, .discussion-card, .slideshow');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /* =========================================
     HERO STATS COUNTER ANIMATION
  ========================================= */
  const statNumbers = document.querySelectorAll('.hero-stat-number[data-target]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let start    = 0;
          const step   = Math.ceil(target / 50);
          const timer  = setInterval(function () {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = start + suffix;
          }, 30);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { countObserver.observe(el); });
  }

  /* =========================================
     SLIDESHOW
     Auto-advances every AUTOPLAY_MS ms.
     Pauses on hover/focus/touch.
     Handles any image aspect ratio via
     object-fit: contain inside fixed frame.
  ========================================= */
  const track       = document.getElementById('slideshowTrack');
  const dotsWrap    = document.getElementById('slideshowDots');
  const prevBtn     = document.getElementById('slidePrev');
  const nextBtn     = document.getElementById('slideNext');
  const progressBar = document.getElementById('progressBar');

  if (!track) return;

  const slides      = Array.from(track.querySelectorAll('.slide'));
  const total       = slides.length;
  const AUTOPLAY_MS = 4000;

  let current     = 0;
  let autoTimer   = null;
  let paused      = false;
  let touchStartX = 0;

  /* Build dots */
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.slideshow-dot'));

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    slides.forEach(function (s, i) {
      s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    progressBar.getBoundingClientRect(); // force reflow
    progressBar.style.transition = 'width ' + AUTOPLAY_MS + 'ms linear';
    progressBar.style.width = '100%';
  }

  function stopProgress() {
    if (!progressBar) return;
    const w = getComputedStyle(progressBar).width;
    progressBar.style.transition = 'none';
    progressBar.style.width = w;
  }

  function resetAutoplay() {
    clearTimeout(autoTimer);
    if (!paused) {
      startProgress();
      autoTimer = setTimeout(next, AUTOPLAY_MS);
    }
  }

  function pauseAutoplay() {
    if (paused) return;
    paused = true;
    clearTimeout(autoTimer);
    stopProgress();
  }

  function resumeAutoplay() {
    if (!paused) return;
    paused = false;
    resetAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  const slideshowEl = document.querySelector('.slideshow');
  if (slideshowEl) {
    slideshowEl.addEventListener('mouseenter', pauseAutoplay);
    slideshowEl.addEventListener('mouseleave', resumeAutoplay);
    slideshowEl.addEventListener('focusin',    pauseAutoplay);
    slideshowEl.addEventListener('focusout',   resumeAutoplay);
  }

  /* Touch swipe */
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    pauseAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    else { resumeAutoplay(); }
  }, { passive: true });

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* Init */
  slides.forEach(function (s, i) {
    s.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
  });
  resetAutoplay();
});
