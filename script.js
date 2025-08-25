
// Language toggle
const toggle = document.getElementById('langToggle');
const setLang = (lng) => {
  document.body.dataset.lang = lng;
  localStorage.setItem('vzlet-lang', lng);
  toggle.textContent = (lng === 'ru') ? 'EN' : 'RU';
};
setLang(localStorage.getItem('vzlet-lang') || 'ru');
toggle.addEventListener('click', () => {
  setLang(document.body.dataset.lang === 'ru' ? 'en' : 'ru');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      window.scrollTo({top: el.offsetTop - 70, behavior: 'smooth'});
    }
  });
});

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.i-reveal').forEach(el=>observer.observe(el));

// Simple tilt effect
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y/r.height)-0.5)*8;
    const ry = ((x/r.width)-0.5)*-8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = 'rotateX(0) rotateY(0)';
  });
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();


// Spawn animated Mikasa balls on the viewport border
(function(){
  const layer = document.querySelector('.flying-balls');
  if(!layer) return;
  const count = 3;
  for(let i=0;i<count;i++){
    const b = document.createElement('div');
    b.className = 'ball';
    const size = 44 + Math.round(Math.random()*22); // 44-66px
    const dur  = 20 + Math.random()*10;            // 20-30s
    const delay= Math.random()*-dur;
    b.style.setProperty('--size', size+'px');
    b.style.setProperty('--duration', dur+'s');
    b.style.setProperty('--delay', delay+'s');
    // randomize starting quadrant by shifting animation progress
    b.style.animationDelay = delay+'s';
    layer.appendChild(b);
  }
})();


// Custom Mikasa cursor follower
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const ball = document.querySelector('.cursor-ball');
  if(!ball || isTouch) return;
  document.body.classList.add('hide-cursor');
  let x = window.innerWidth/2, y = window.innerHeight/2;
  let tx = x, ty = y;
  const speed = 0.18;
  window.addEventListener('mousemove', (e)=>{ tx = e.clientX; ty = e.clientY; });
  function animate(){
    x += (tx - x)*speed;
    y += (ty - y)*speed;
    ball.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();


// Cursor trailing glow sparks
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const ball = document.querySelector('.cursor-ball');
  if(!ball || isTouch) return;
  let x = window.innerWidth/2, y = window.innerHeight/2;
  let tx = x, ty = y;
  const speed = 0.2;
  const sparks = Array.from({length:6}).map(()=>{
    const s = document.createElement('div');
    s.className = 'cursor-spark';
    document.body.appendChild(s);
    return {el:s, x:x, y:y, life:0};
  });
  window.addEventListener('mousemove', (e)=>{ tx = e.clientX; ty = e.clientY; });
  function animate(){
    x += (tx - x)*speed;
    y += (ty - y)*speed;
    ball.style.transform = `translate(${x}px, ${y}px)`;
    // update sparks
    sparks.forEach((sp,i)=>{
      sp.x += (x - sp.x)*(0.12 + i*0.02);
      sp.y += (y - sp.y)*(0.12 + i*0.02);
      sp.life = Math.max(0.2, 1 - i*0.12);
      sp.el.style.transform = `translate(${sp.x}px, ${sp.y}px)`;
      sp.el.style.opacity = sp.life;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

window.addEventListener('DOMContentLoaded', ()=>{
  if(!('ontouchstart' in window || navigator.maxTouchPoints>0)){
    document.body.classList.add('hide-cursor');
  }
});


// Ensure cursor overlay is hidden until the first movement, then reveal synced
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const ball = document.querySelector('.cursor-ball');
  if(!ball || isTouch) return;
  let shown = false;
  window.addEventListener('mousemove', (e)=>{
    if(!shown){
      shown = true;
      ball.style.display = 'block';
      ball.style.opacity = '1';
      ball.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  }, {once:false});
})();


// Ripple on primary buttons
document.querySelectorAll('.btn.primary').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top  = (e.clientY - rect.top) + 'px';
    btn.appendChild(r);
    setTimeout(()=>r.remove(), 650);
  });
});

// rotate based on velocity for the cursor-ball (real image)
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const ball = document.querySelector('.cursor-ball');
  if(!ball || isTouch) return;
  let px = window.innerWidth/2, py = window.innerHeight/2;
  let x = px, y = py, tx = px, ty = py;
  const speed = 0.22;
  window.addEventListener('mousemove', (e)=>{ tx = e.clientX; ty = e.clientY; });
  function loop(){
    const vx = tx - x, vy = ty - y;
    x += vx * speed; y += vy * speed;
    const angle = Math.atan2(vy, vx) * 180/Math.PI;
    ball.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    requestAnimationFrame(loop);
  }
  loop();
})();


// Rotate real-ball cursor based on movement speed
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const ball = document.querySelector('.cursor-ball');
  if(!ball || isTouch) return;
  let shown = false;
  let x = window.innerWidth/2, y = window.innerHeight/2, tx=x, ty=y;
  let angle = 0, px = x, py = y;
  window.addEventListener('mousemove', (e)=>{
    tx = e.clientX; ty = e.clientY;
    if(!shown){ shown=true; ball.style.display='block'; ball.style.opacity='1'; }
  });
  function animate(){
    const k = 0.22;
    x += (tx-x)*k; y += (ty-y)*k;
    const vx = x-px, vy = y-py;
    const speed = Math.sqrt(vx*vx + vy*vy);
    angle += speed * 0.1; // rotate proportional to speed
    ball.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    px = x; py = y;
    requestAnimationFrame(animate);
  }
  animate();
})();


// Spawn animated flowers across the whole background
(function(){
  const field = document.querySelector('.flower-field');
  if(!field) return;
  const sources = ['assets/flower_pink.png','assets/flower_lime.png'];
  const N = 22;
  for(let i=0;i<N;i++){
    const f = document.createElement('div');
    f.className = 'flower';
    const src = sources[i%2];
    f.style.backgroundImage = `url(${src})`;
    const size = 80 + Math.random()*140; // 80-220px
    const x = Math.random()*100; 
    const y = Math.random()*100;
    const dx = (Math.random()*.6 + .2) * (Math.random()>.5 ? 1 : -1) * 80;
    const dy = (Math.random()*.6 + .2) * (Math.random()>.5 ? 1 : -1) * 80;
    const dur = 28 + Math.random()*24;
    const rotDur = 50 + Math.random()*60;
    const alpha = .25 + Math.random()*.45;
    f.style.setProperty('--size', size+'px');
    f.style.setProperty('--x', x+'vw');
    f.style.setProperty('--y', y+'vh');
    f.style.setProperty('--dx', dx+'px');
    f.style.setProperty('--dy', dy+'px');
    f.style.setProperty('--dur', dur+'s');
    f.style.setProperty('--rotDur', rotDur+'s');
    f.style.setProperty('--alpha', alpha+'');
    field.appendChild(f);
  }
})();