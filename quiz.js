
function submitQuiz(answers) {
  const total = Object.keys(answers).length;
  const blocks = document.querySelectorAll('.q-block');
  let score = 0;
  let allAnswered = true;

  blocks.forEach(function (block, i) {
    var qName = 'q' + (i + 1);
    var selected = document.querySelector('input[name="' + qName + '"]:checked');
    var correct = answers[qName];

    if (!selected) { allAnswered = false; return; }

    var labels = block.querySelectorAll('label');
    labels.forEach(function (lbl) {
      var val = lbl.querySelector('input').value;
      if (val === correct)                          lbl.classList.add('correct-answer');
      if (val === selected.value && val !== correct) lbl.classList.add('wrong-answer');
    });

    if (selected.value === correct) score++;
  });

  if (!allAnswered) {
    alert('Kérlek, válaszolj minden kérdésre!');
    return;
  }

  var pct = Math.round(score / total * 100);
  var text = '';
  if (pct === 100) {
    text = '🏆 Kiváló! Tökéletes eredmény – igazi F1 szakértő vagy!';
  } else if (pct >= 80) {
    text = '👍 Szép teljesítmény! Jól ismered az anyagot.';
  } else if (pct >= 60) {
    text = '📚 Nem rossz, de érdemes még egyszer átolvasni az oldalt!';
  } else {
    text = '🔄 Olvasd el újra a szöveget, aztán próbálkozz újra!';
  }

  var resultEl = document.getElementById('quiz-result');
  document.getElementById('result-score').textContent = score + '/' + total + ' – ' + pct + '%';
  document.getElementById('result-text').textContent = text;
  resultEl.style.display = 'block';

  setTimeout(function () {
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);

  var btn = document.querySelector('.quiz-submit');
  if (btn) btn.disabled = true;

  document.querySelectorAll('.q-options input[type=radio]').forEach(function (r) {
    r.disabled = true;
  });

  var retryBtn = document.getElementById('quiz-retry');
  if (retryBtn) retryBtn.style.display = 'inline-block';
}


function resetQuiz() {
  document.querySelectorAll('.q-options input[type=radio]').forEach(function (r) {
    r.checked  = false;
    r.disabled = false;
  });

  document.querySelectorAll('label.correct-answer, label.wrong-answer').forEach(function (lbl) {
    lbl.classList.remove('correct-answer', 'wrong-answer');
  });

  var resultEl = document.getElementById('quiz-result');
  if (resultEl) resultEl.style.display = 'none';

  var retryBtn = document.getElementById('quiz-retry');
  if (retryBtn) retryBtn.style.display = 'none';

  var btn = document.querySelector('.quiz-submit');
  if (btn) btn.disabled = false;

  var firstQ = document.querySelector('.q-block');
  if (firstQ) firstQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function initScrollAnimations() {
  var opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    observer.observe(el);
  });
}


function animateCounter(el, target, suffix, duration) {
  var start = 0;
  var step  = target / (duration / 16);
  var isFloat = String(target).includes('.');

  function tick() {
    start += step;
    if (start >= target) {
      el.textContent = target + (suffix || '');
      return;
    }
    el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + (suffix || '');
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  var counters = document.querySelectorAll('.stat-num[data-target], .fact-num[data-target]');
  if (!counters.length) return;

  var opts = { threshold: 0.5 };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el     = e.target;
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix, 1200);
        observer.unobserve(el);
      }
    });
  }, opts);

  counters.forEach(function (c) { observer.observe(c); });
}


function initMobileMenu() {
  var toggle = document.querySelector('.nav-toggle');
  var menu   = document.querySelector('nav ul');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}


function initNavScroll() {
  var nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}


function initProgressBar() {
  var bar = document.querySelector('.progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}


function initScrollToTop() {
  var btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.src !== img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initCounters();
  initMobileMenu();
  initNavScroll();
  initProgressBar();
  initScrollToTop();
  initImageFallbacks();
});
