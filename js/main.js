const toggle=document.querySelector('.nav-toggle');
const panel=document.querySelector('.mobile-panel');
if(toggle&&panel){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));panel.hidden=open;});panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');panel.hidden=true;}));}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){panel.hidden=true;toggle&&toggle.setAttribute('aria-expanded','false');}});

const path=window.location.pathname;
document.querySelectorAll('.desktop-nav a').forEach(a=>{const href=a.getAttribute('href');if(href&&href!=='/'&&(path===href||path.startsWith(href))){a.setAttribute('aria-current','page');}});
