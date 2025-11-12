// ========== Intersection Observer (fade-in grid) ==========
const items = document.querySelectorAll('.grid-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.1 });
items.forEach(item => observer.observe(item));

// ========== Galleries (manual prev/next + click/swipe) ==========
(function(){
  // 対象コンテナ（両方対応）
  const containers = document.querySelectorAll('.gallery-container, .dripbag-container');
  if (!containers.length) return;

  containers.forEach(container => {
    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    // 初期表示
    let current = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (current === -1) { current = 0; images[0].classList.add('active'); }

    const show = (i) => {
      images.forEach(img => img.classList.remove('active'));
      images[i].classList.add('active');
    };
    const prev = () => { current = (current - 1 + images.length) % images.length; show(current); };
    const next = () => { current = (current + 1) % images.length; show(current); };

    // 矢印（.gallery- / .dripbag- の両方をサポート）
    const leftArrows = container.querySelectorAll('.gallery-arrow-left, .dripbag-arrow-left');
    const rightArrows = container.querySelectorAll('.gallery-arrow-right, .dripbag-arrow-right');
    leftArrows.forEach(a => a.addEventListener('click', e => { e.stopPropagation(); prev(); }));
    rightArrows.forEach(a => a.addEventListener('click', e => { e.stopPropagation(); next(); }));

    // 画像左右 20% クリックで切替（矢印クリックは除外）
    container.addEventListener('click', e => {
      const target = e.target;
      // どれかの矢印をクリックした場合は何もしない
      if (target.closest('.gallery-arrow, .gallery-arrow-left, .gallery-arrow-right, .dripbag-arrow-left, .dripbag-arrow-right')) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * 0.2) prev();
      else if (x > rect.width * 0.8) next();
    });

    // スワイプ操作
    let startX = null;
    container.addEventListener('touchstart', e => {
      if (e.touches.length === 1) startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 30) prev();
      else if (dx < -30) next();
      startX = null;
    }, { passive: true });
  });
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

// ========== Floating name animation (white + gray independent) ==========
(function(){
  const spans = document.querySelectorAll('.floating-name span');
  if (!spans.length) return;

  spans.forEach(span => {
    function animate(){
      const sx = 0.7 + Math.random() * 1.6;
      const sy = 0.7 + Math.random() * 1.6;
      const o = Math.random() > 0.2 ? 1 : 0.5;
      const d = 100 + Math.random() * 300;
      span.style.transition = `transform ${d}ms steps(1,end), opacity ${d}ms steps(1,end)`;
      span.style.transform = `scale(${sx.toFixed(2)},${sy.toFixed(2)})`;
      span.style.opacity = o;
      setTimeout(animate, d + Math.random()*400);
    }
    setTimeout(animate, Math.random()*400);
  });
})();

// ========== it()te playlist tabs ==========
window.showItte = function(period){
  document.querySelectorAll('.itte-tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.itte-frame').forEach(f=>f.classList.remove('active'));
  document.querySelector(`.itte-tabs button[onclick="showItte('${period}')"]`)?.classList.add('active');
  document.getElementById(`itte-${period}`)?.classList.add('active');
  document.querySelectorAll('#apple-music-morning, #apple-music-day, #apple-music-night').forEach(link=>link.style.display='none');
  const link = document.getElementById(`apple-music-${period}`);
  if (link) link.style.display='inline-flex';
};