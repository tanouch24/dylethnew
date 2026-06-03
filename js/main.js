/* Navigation mobile */
const toggle=document.querySelector('.nav-toggle');
const panel=document.querySelector('.mobile-panel');
if(toggle&&panel){
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));panel.hidden=open;});
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');panel.hidden=true;}));
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){panel.hidden=true;toggle&&toggle.setAttribute('aria-expanded','false');}});

/* Lien actif nav */
const path=window.location.pathname;
document.querySelectorAll('.desktop-nav a').forEach(a=>{const href=a.getAttribute('href');if(href&&href!=='/'&&(path===href||path.startsWith(href))){a.setAttribute('aria-current','page');}});

/* Reveal + micro-interactions au scroll */
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

  /* Stagger sur les grilles d2 */
  document.querySelectorAll('.d2-detection-grid,.d2-card-grid,.d2-stat-grid').forEach(grid=>{
    grid.querySelectorAll(':scope > article').forEach((el,i)=>{
      if(!el.classList.contains('reveal')){el.classList.add('reveal');}
      el.style.transitionDelay=(i*90)+'ms';
      obs.observe(el);
    });
  });

  /* Animation score orb */
  const orb=document.querySelector('.d2-score-orb');
  if(orb){new IntersectionObserver(([e])=>{if(e.isIntersecting){orb.classList.add('is-animated');}},{threshold:.5}).observe(orb);}
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}

/* Phase 2 — Formulaire inscription (Netlify Forms + async) */
const inscForm=document.getElementById('form-inscription');
const inscSuccess=document.getElementById('form-success');
if(inscForm&&inscSuccess){
  inscForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=inscForm.querySelector('.d2-form-btn');
    const orig=btn.textContent;
    btn.disabled=true;
    btn.textContent='Envoi en cours…';
    try{
      const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(inscForm)).toString()});
      if(r.ok){inscForm.hidden=true;inscSuccess.classList.add('is-visible');inscSuccess.setAttribute('tabindex','-1');inscSuccess.focus();}
      else throw new Error(r.status);
    }catch{
      btn.disabled=false;btn.textContent=orig;
      const err=inscForm.querySelector('.d2-form-error');if(err)err.hidden=false;
    }
  });
}
