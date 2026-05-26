const toggle=document.querySelector('.nav-toggle');
const panel=document.querySelector('.mobile-panel');
if(toggle&&panel){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));panel.hidden=open;});panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');panel.hidden=true;}));}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){panel.hidden=true;toggle&&toggle.setAttribute('aria-expanded','false');}});

const path=window.location.pathname;
document.querySelectorAll('.desktop-nav a').forEach(a=>{const href=a.getAttribute('href');if(href&&href!=='/'&&(path===href||path.startsWith(href))){a.setAttribute('aria-current','page');}});

/* === SIGNAL INTELLIGENCE EDITION — Animations avancées === */

// Scanline de chargement (toutes les pages)
;(function() {
  const s = document.createElement('div');
  s.className = 'page-scanline';
  s.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(s, document.body.firstChild);
})();

// Curseur personnalisé
;(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let fx = 0, fy = 0, tx = 0, ty = 0, raf;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function loop() {
    fx += (tx - fx) * 0.18;
    fy += (ty - fy) * 0.18;
    dot.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
    raf = requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('expanded'));
    el.addEventListener('mouseleave', () => dot.classList.remove('expanded'));
  });
})();

// Cipher text — déchiffrement des titres
;(function initCipher() {
  if (!document.body.classList.contains('home')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const h1 = document.querySelector('.home .hero-copy h1');
  if (!h1) return;

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789◆▒░▓■□';
  const spans = h1.querySelectorAll('.h1-outline,.h1-accent,.h1-plain');
  const targets = spans.length > 0 ? Array.from(spans) : [h1];

  function scramble(el, delay) {
    const original = el.textContent;
    let step = 0;
    const steps = 14;
    setTimeout(() => {
      const iv = setInterval(() => {
        el.textContent = original.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < (step / steps) * original.length) return original[i];
          return charset[Math.floor(Math.random() * charset.length)];
        }).join('');
        if (++step > steps) { clearInterval(iv); el.textContent = original; }
      }, 55);
    }, delay);
  }

  targets.forEach((el, i) => scramble(el, 280 + i * 340));
})();

// Parallaxe sur le téléphone selon la souris
;(function initPhoneParallax() {
  const phone = document.getElementById('parallax-phone');
  if (!phone) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let cx = 0, cy = 0;
  function onMove(e) {
    const dx = (e.clientX / window.innerWidth - 0.5) * 2;
    const dy = (e.clientY / window.innerHeight - 0.5) * 2;
    phone.style.transform =
      `perspective(1000px) rotateY(${-3 + dx * 9}deg) rotateX(${1 - dy * 5}deg)`;
  }

  document.addEventListener('mousemove', onMove, { passive: true });
})();

// Compteur animé pour les chiffres-clés
;(function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('.threat-cards strong');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const raw = el.textContent;
      const match = raw.match(/([\+\-]?)([0-9\s ]+[,.]?[0-9]*)\s*(.*)$/);
      if (!match) return;
      const [, pre, numStr, suf] = match;
      const num = parseFloat(numStr.replace(/[\s ]/g, '').replace(',', '.'));
      if (isNaN(num)) return;

      const duration = 1600;
      const start = performance.now();
      const fmt = n => {
        if (n >= 1000) return Math.round(n).toLocaleString('fr-FR');
        const dec = (numStr.includes('.') || numStr.includes(',')) ? 1 : 0;
        return n.toFixed(dec).replace('.', ',');
      };

      requestAnimationFrame(function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = pre + fmt(eased * num) + (suf ? ' ' + suf : '');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      });
    });
  }, { threshold: 0.4 });

  items.forEach(el => obs.observe(el));
})();
