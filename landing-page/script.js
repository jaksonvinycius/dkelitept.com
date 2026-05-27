/* ══════════════════════════════════════════════
   DK ELITE — SCRIPT.JS
   Progressive enhancement · Vanilla JS
   ══════════════════════════════════════════════ */

'use strict';

/* ─── HERO VIDEO AUTOPLAY (Safari mobile fix) ── */
(function() {
  var vid = document.getElementById('heroVideo');
  if (!vid) return;

  // Tenta fazer play imediatamente
  var playPromise = vid.play();

  if (playPromise !== undefined) {
    playPromise.catch(function() {
      // Safari bloqueou — tenta ao primeiro toque ou scroll
      function tryPlay() {
        vid.play();
      }
      document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
      document.addEventListener('scroll', tryPlay, { once: true, passive: true });
    });
  }

  // Retoma se tab voltar ao foco
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) { vid.play(); }
  });
})();


/* ─── META PIXEL HELPER ─────────────────────── */
/**
 * Dispara eventos para o Meta Pixel + Google Analytics (se presente)
 * @param {string} category - categoria do evento (ex: 'WhatsApp')
 * @param {string} label    - label do evento (ex: 'Hero CTA Principal')
 */
function trackEvent(category, label) {
  // Meta Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', { content_name: label, content_category: category });
  }
  // Google Analytics 4 (se instalado futuramente)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click', { event_category: category, event_label: label });
  }
}
window.trackEvent = trackEvent; // expor para inline onclick no HTML


/* ─── SMOOTH SCROLL PARA ÂNCORAS ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ─── LAZY LOAD FALLBACK (IntersectionObserver) ─ */
if ('IntersectionObserver' in window) {
  var imgObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
    imgObserver.observe(img);
  });
}


/* ─── STICKY WA: ESCONDER NO HERO ─────────────── */
(function() {
  var stickyWa = document.querySelector('.sticky-wa');
  var hero     = document.querySelector('.hero');
  if (!stickyWa || !hero) return;

  var heroBottom = 0;

  function updateHeroBottom() {
    heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
  }

  updateHeroBottom();
  window.addEventListener('resize', updateHeroBottom);

  window.addEventListener('scroll', function() {
    if (window.scrollY < heroBottom - window.innerHeight * 0.5) {
      stickyWa.style.opacity = '0';
      stickyWa.style.pointerEvents = 'none';
      stickyWa.style.transform = 'translateY(20px)';
    } else {
      stickyWa.style.opacity = '1';
      stickyWa.style.pointerEvents = 'auto';
      stickyWa.style.transform = '';
    }
  }, { passive: true });

  // Estado inicial — esconder se ainda no hero
  stickyWa.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  stickyWa.style.opacity = '0';
  stickyWa.style.pointerEvents = 'none';
})();


/* ─── PLANOS: ANIMAÇÃO DE ENTRADA ─────────────── */
(function() {
  if (!('IntersectionObserver' in window)) return;

  var cards = document.querySelectorAll('.plan__card, .benefit__card, .how__step');

  // Estado inicial
  cards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  var cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (entry.target.dataset.delay || 0));
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(function(card, i) {
    card.dataset.delay = i;
    cardObserver.observe(card);
  });
})();




/* ─── TRACKING: TEMPO NA PÁGINA ─────────────── */
(function() {
  var startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    var seconds = Math.round((Date.now() - startTime) / 1000);
    if (typeof fbq !== 'undefined' && seconds > 30) {
      fbq('trackCustom', 'TimeOnPage', { seconds: seconds });
    }
  });
})();



/* ─── TOGGLE QUINZENAL / SEMANAL ─────────── */
(function() {
  var btns   = document.querySelectorAll('.plans-toggle__btn');
  var tables = document.querySelectorAll('.plans-table');

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = this.dataset.target;

      // Atualiza botões
      btns.forEach(function(b) { b.classList.remove('plans-toggle__btn--active'); });
      this.classList.add('plans-toggle__btn--active');

      // Mostra/esconde tabelas
      tables.forEach(function(t) {
        if (t.id === 'plans-' + target) {
          t.classList.remove('plans-table--hidden');
        } else {
          t.classList.add('plans-table--hidden');
        }
      });
    });
  });
})();


/* ─── TRACKING: SCROLL DEPTH ─────────────── */
(function() {
  var milestones = [25, 50, 75, 90];
  var reached = {};

  window.addEventListener('scroll', function() {
    var scrollPct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    milestones.forEach(function(m) {
      if (!reached[m] && scrollPct >= m) {
        reached[m] = true;
        if (typeof fbq !== 'undefined') {
          fbq('trackCustom', 'ScrollDepth', { percent: m });
        }
      }
    });
  }, { passive: true });
})();
