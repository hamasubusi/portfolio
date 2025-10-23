// ========== Intersection Observer (fade-in grid) ==========
const items = document.querySelectorAll('.grid-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.1 });
items.forEach(item => observer.observe(item));

// ========== Dripbag gallery (クリック・スワイプ対応) ==========
(function(){
  const images = document.querySelectorAll('.dripbag-container img');
  const container = document.querySelector('.dripbag-container');
  let current = 0;

  function show(index){ images.forEach(img => img.classList.remove('active')); images[index].classList.add('active'); }
  function prev(){ current = (current - 1 + images.length) % images.length; show(current); }
  function next(){ current = (current + 1) % images.length; show(current); }

  container.addEventListener('click', e => {
    if (e.target.classList.contains('dripbag-arrow')) return;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    clickX < rect.width * 0.2 ? prev() : clickX > rect.width * 0.8 && next();
  });

  let startX;
  container.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  container.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - startX;
    if (delta > 30) prev();
    else if (delta < -30) next();
  });

  container.querySelector('.dripbag-arrow-left')?.addEventListener('click', e => { e.stopPropagation(); prev(); });
  container.querySelector('.dripbag-arrow-right')?.addEventListener('click', e => { e.stopPropagation(); next(); });
})();

// ========== Menu Lightbox ==========
const menuImg = document.getElementById('menu-image');
if (menuImg) {
  const lightbox = document.createElement('div');
  lightbox.id = 'menu-lightbox';
  lightbox.innerHTML = '<span class="close">&times;</span><img src="" alt="menu large">';
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector('img');
  lightbox.querySelector('.close').onclick = () => lightbox.style.display = 'none';
  menuImg.onclick = () => { lightbox.style.display = 'flex'; img.src = menuImg.src; };
  lightbox.onclick = e => { if (e.target === lightbox) lightbox.style.display = 'none'; };
}

// ========== Floating name animation ==========
document.querySelectorAll('.floating-name span').forEach(span => {
  const gray = span.querySelector('.gray');
  const randomize = () => {
    const sx = 0.7 + Math.random() * 1.6;
    const sy = 0.7 + Math.random() * 1.6;
    const o = Math.random() > 0.1 ? 1 : 0.4;
    const d = 100 + Math.random() * 200;
    span.style.transition = `transform ${d}ms steps(1,end), opacity ${d}ms steps(1,end)`;
    span.style.transform = `scale(${sx.toFixed(2)},${sy.toFixed(2)})`;
    span.style.opacity = o;
    if (gray) {
      gray.style.transition = `transform ${d*3}ms steps(1,end), opacity ${d}ms steps(1,end)`;
      gray.style.transform = `scale(${(sx*0.6).toFixed(2)},${(sy*0.6).toFixed(2)})`;
      gray.style.opacity = o*0.5;
    }
    setTimeout(randomize, d + Math.random()*400);
  };
  setTimeout(randomize, Math.random()*500);
});

// ========== it()te playlist tabs ==========
window.showItte = function(period){
  document.querySelectorAll('.itte-tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.itte-frame').forEach(f=>f.classList.remove('active'));
  document.querySelector(`.itte-tabs button[onclick="showItte('${period}')"]`)?.classList.add('active');
  document.getElementById(`itte-${period}`)?.classList.add('active');
  document.querySelectorAll('#apple-music-morning, #apple-music-day, #apple-music-night').forEach(link=>link.style.display='none');
  document.getElementById(`apple-music-${period}`).style.display='inline-flex';
};