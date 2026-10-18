/* Talitha Koum : 소녀여 일어나라 — by Scroll */
gsap.registerPlugin(ScrollTrigger);
const $ = s => document.querySelector(s);
const root = document.documentElement;
const isTouch = matchMedia('(hover:none)').matches;

/* ── torch cursor ── */
let mx = innerWidth / 2, my = innerHeight / 2;
function setPointer(x, y) {
  mx = x; my = y;
  root.style.setProperty('--mx', x + 'px');
  root.style.setProperty('--my', y + 'px');
  const r = $('#relief');
  if (r) { const b = r.getBoundingClientRect(); r.style.setProperty('--rx', (x - b.left) + 'px'); r.style.setProperty('--ry', (y - b.top) + 'px'); }
}
addEventListener('pointermove', e => setPointer(e.clientX, e.clientY), { passive: true });
addEventListener('touchmove', e => { const t = e.touches[0]; if (t) setPointer(t.clientX, t.clientY); }, { passive: true });
setPointer(mx, my);

/* ── smooth scroll ── */
ScrollTrigger.config({ ignoreMobileResize: true });
const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

/* ── audio ── */
const ost = $('#ost');
let soundOn = false, targetVol = 0.45, curSection = -1;
const SECTIONS = { start: 0, gate: 30, dark: 55, reign: 65, mid: 85, climax: 150 };
function fadeTo(v, d = 1.2) { gsap.to(ost, { volume: soundOn ? v : 0, duration: d, ease: 'sine.inOut', overwrite: true }); }
function goSection(name) {
  return; // 음악은 끊지 않고 처음부터 끝까지 이어서 재생
  if (!soundOn) return;
  const t = SECTIONS[name];
  if (Math.abs(ost.currentTime - t) < 12) return;
  gsap.to(ost, { volume: 0, duration: .6, overwrite: true, onComplete() { ost.currentTime = t; fadeTo(targetVol, 1.4); } });
}
function setSound(on) {
  soundOn = on;
  $('#sound b').textContent = on ? '有' : '無';
  if (on) { ost.volume = 0; ost.play().catch(() => {}); fadeTo(targetVol, 2); }
  else fadeTo(0, .6);
}
$('#sound').addEventListener('click', () => setSound(!soundOn));

/* ── gate (S0): 제목부터 ── */
(() => {
  const t = $('.gate-title');
  t.innerHTML = [...t.textContent].map(c => c === ' ' ? '<span class="ch">&nbsp;</span>' : `<span class="ch">${c}</span>`).join('');
  gsap.timeline({ delay: .4 })
    .to('.gate-flame', { opacity: 1, duration: 1.2 })
    .to('.gate-title .ch', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: .09, ease: 'power3.out' }, '-=.4')
    .to('.gate-pron, #gate .pron', { opacity: 1, duration: .9 }, '-=.3')
    .to('.gate-sub', { opacity: 1, letterSpacing: '.3em', duration: 1.2 }, '-=.4')
    .to('.gate-eyebrow', { opacity: 1, duration: .8 }, '<')
    .to('.gate-entry', { opacity: 1, duration: 1, onStart: () => $('.gate-entry').classList.add('on') }, '+=.5');
})();

document.querySelectorAll('.gate-btn').forEach(b => b.addEventListener('click', () => {
  const on = b.dataset.sound === 'on';
  if (on) setSound(true); else $('#sound b').textContent = '無';
  const gt = gsap.timeline({ onComplete() { $('#gate').remove(); } });
  gt.to('.gate-inner', { opacity: 0, y: -20, duration: .7, ease: 'power2.in' })
    .to('#gate .t-front', { scale: 1.9, duration: 2.2, ease: 'power2.in' }, 0.2)
    .to('#gate .t-mid', { scale: 1.45, opacity: .6, duration: 2.2, ease: 'power2.in' }, 0.2)
    .to('#gate .t-back', { scale: 1.25, duration: 2.2, ease: 'power2.in' }, 0.2)
    .to('#gate', { opacity: 0, duration: .9, ease: 'power2.inOut' }, 1.6);
  document.body.classList.remove('locked'); document.body.classList.add('entered');
  lenis.start();
}));

/* ── HUD: sun + D-day ── */
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate(self) {
    const p = self.progress;
    const w = $('.hud-sky').offsetWidth, h = 56;
    const x = p * (w / 2), y = h - Math.sin(p * Math.PI / 2) * h;
    gsap.set('.hud-sun', { left: x, top: y });
    const eS = $('#s-end').parentElement, pS = $('#s-prologue').parentElement;
    const endTop = eS.getBoundingClientRect().top + scrollY + innerHeight * 1.2, proTop = pS.getBoundingClientRect().top + scrollY - innerHeight * .5;
    const y0 = scrollY, dd = $('#dday');
    if (y0 >= proTop) { dd.querySelector('b').textContent = 'D-30'; dd.style.opacity = 1; }
    else if (y0 > endTop + innerHeight * 2) { dd.style.opacity = 0; }
    else { dd.style.opacity = 1; dd.querySelector('b').textContent = 'D-' + Math.max(0, Math.round(30 - Math.min(1, y0 / endTop) * 30)); }
  }
});

/* helper: pinned scene timeline */
function scene(id, len, build, opts = {}) {
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  build(tl);
  const idx = [...document.querySelectorAll('.scene')].indexOf(document.querySelector(id));
  ScrollTrigger.create({
    trigger: id, start: 'top top', end: '+=' + len, pin: true, scrub: opts.scrub ?? 1, animation: tl, refreshPriority: 100 - idx,
    onEnter: opts.onEnter, onEnterBack: opts.onEnterBack || opts.onEnter, onLeave: opts.onLeave, onLeaveBack: opts.onLeaveBack
  });
  return tl;
}

/* ── S1 말씀 ── */
(() => {
  const v = $('#verse1');
  v.innerHTML = [...v.textContent].map(c => c === ' ' ? ' ' : `<span>${c}</span>`).join('');
  const chars = v.querySelectorAll('span');
  scene('#s-word', 2200, tl => {
    tl.to('.hebrew', { opacity: 1, duration: .6 })
      .to(chars, { opacity: 1, stagger: .03, duration: .2 }, '>')
      .to('#s-word .ref', { opacity: 1, duration: .4 })
      .to('#s-word .hint', { opacity: 0, duration: .2 }, 0)
      .to('.sandlight', { opacity: 1, duration: 1.2 }, '+=.4')
      .to(['.hebrew', '#verse1', '#s-word .ref'], { opacity: 0, y: -30, duration: .8 }, '<.4');
  }, { onEnter: () => goSection('start') });
})();

/* ── S2 테베 ── */
scene('#s-world', 2400, tl => {
  tl.fromTo('#harbor', { scale: 1.15 }, { scale: 1, duration: 2 })
    .to('#s-world .line:nth-child(1)', { opacity: 1, duration: .5 }, .2)
    .to('#s-world .line:nth-child(1)', { opacity: 0, duration: .4 }, 1.4)
    .fromTo('#thebes', { opacity: 0, scale: 1.25, yPercent: 6 }, { opacity: 1, scale: 1.05, yPercent: 0, duration: 2 }, 1.5)
    .to('#s-world .line:nth-child(2)', { opacity: 1, duration: .5 }, 2.6)
    .to('#thebes', { scale: 1, duration: 1 }, 3.5);
});

/* ── S3 탑문 ── */
scene('#s-gate', 2600, tl => {
  tl.from('#gateText', { opacity: 0, duration: .5 })
    .to('#gateText', { opacity: 0, duration: .4 }, 1)
    .to('#gateOpen', { opacity: 1, duration: 1 }, 1.1)
    .fromTo('#gateZoom', { scale: 1 }, { scale: 3.4, transformOrigin: '50% 62%', ease: 'power2.in', duration: 2.4 }, 1.6)
    .to('#gateBlack', { opacity: 1, duration: .6 }, 3.5);
}, { onEnter: () => goSection('gate') });
gsap.set('#gateOpen', { opacity: 0 });

/* ── S4 기둥의 숲 ── */
gsap.set('.layer', { xPercent: -50, yPercent: -50 });
scene('#s-hall', 4200, tl => {
  tl.fromTo('#hallBack', { scale: 1 }, { scale: 1.35, duration: 4 }, 0)
    .fromTo('#colMid', { scale: .8, opacity: .55 }, { scale: 1.6, opacity: 1, duration: 3 }, 0)
    .fromTo('#colFront', { scale: 1 }, { scale: 2.6, duration: 3 }, 0)
    .fromTo('#relief', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .8 }, .9)
    .to('#hallText', { opacity: 0, duration: .3 }, 2.2)
    .to('#relief', { opacity: 0, scale: 1.4, duration: .7 }, 2.4)
    .to('#sanctum', { opacity: 1, duration: .8 }, 3.0)
    .to('#sanctumText', { opacity: 1, duration: .5 }, 3.4)
    .to('#sanctum', { scale: 1.08, duration: 1 }, 3.0)
    .to('#hallDark', { opacity: 0, duration: .4 }, 3.0);
}, { onEnter: () => {}, onLeave: () => goSection('reign') });
ScrollTrigger.create({ trigger: '#s-hall', start: 'top+=2400 top', onEnter: () => goSection('dark'), onLeaveBack: () => goSection('gate') });

/* ── S5 셉세트라의 이집트 ── */
(() => {
  const nums = [...document.querySelectorAll('#stats .num')];
  const counter = { p: 0 };
  scene('#s-reign', 4200, tl => {
    tl.fromTo('#nile', { scale: 1.1 }, { scale: 1, duration: 1.5 }, 0)
      .to('#flood', { height: '55%', duration: 1.4 }, 0)
      .to('#reignText', { opacity: 1, duration: .4 }, .1)
      .to('#stats div', { opacity: 1, stagger: .25, duration: .3 }, .2)
      .to(counter, { p: 1, duration: 1.3, onUpdate() { nums.forEach(n => n.textContent = Math.round(+n.dataset.to * counter.p).toLocaleString()); } }, .2)
      .to('#banquet', { opacity: 1, duration: .8 }, 1.6)
      .to('#flood', { opacity: 0, duration: .5 }, 1.6)
      .to(['#stats', '#reignText'], { opacity: 0, duration: .4 }, 2.2)
      .to('#portrait', { opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'power2.out' }, 2.5)
      .to('#nameplate', { opacity: 1, duration: .6 }, 3.2)
      .fromTo('#sepImg', { xPercent: () => innerWidth <= 700 ? -50 : 0, scale: 1.1, filter: 'brightness(.4)' }, { xPercent: () => innerWidth <= 700 ? -50 : 0, scale: 1, filter: 'brightness(1)', duration: 1.6, transformOrigin: '50% 30%' }, 2.5);
  }, { onEnter: () => goSection('reign') });
})();

/* ── S6 금과 진흙: 궁의 밤 → 움막의 밤 → 노역 ── */
(() => {
  const b = { n: 0 };
  scene('#s-mud', 5200, tl => {
    tl.fromTo('#palaceNight', { scale: 1.12 }, { scale: 1, duration: 1.4 }, 0)
      .to('#palaceText', { opacity: 1, duration: .4 }, .2)
      .to('#palaceText', { opacity: 0, duration: .3 }, 1.3)
      .to('#hutswrap', { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power1.inOut' }, 1.4)
      .fromTo('#hutswrap img', { scale: 1.12 }, { scale: 1, duration: 1.6 }, 1.4)
      .to('#hutsNightText', { opacity: 1, duration: .4 }, 2.4)
      .to('#hutsNightText', { opacity: 0, duration: .3 }, 3.3)
      .to('#bricksImg', { opacity: 1, duration: .7 }, 3.4)
      .fromTo('#bricksImg', { scale: 1.15 }, { scale: 1, duration: 1.8 }, 3.4)
      .to('#quota', { opacity: 1, duration: .4 }, 3.9)
      .to(b, { n: 2400, duration: 1.4, onUpdate() { $('#bricks').textContent = Math.round(b.n).toLocaleString(); } }, 3.9)
      .to('#mudVerse', { opacity: 1, duration: .5 }, 4.6);
  }, { onEnter: () => goSection('mid') });
})();

/* ── S7 꺾이지 않는 여인 ── */
(() => {
  const box = $('#crowd'), B = box.dataset.bounds.split(',').map(Number), figs = [];
  for (let i = 0; i < B.length - 1; i++) {
    const l = B[i], w = B[i + 1] - B[i];
    const f = document.createElement('div'); f.className = 'fig'; f.style.left = l + '%'; f.style.width = w + '%';
    const css = `width:${(100 / w) * 100}%;left:${-(l / w) * 100}%`;
    f.innerHTML = `<img class="stand" src="assets/crowd_stand.webp" alt="" style="${css}"><img class="bow" src="assets/crowd_bow.webp" alt="" style="${css}">`;
    box.appendChild(f); figs.push({ f, d: Math.abs((l + w / 2) - 50) });
  }
  figs.sort((a, b) => b.d - a.d);  // 바깥쪽부터 차례로 엎드린다
  scene('#s-stand', 4400, tl => {
    tl.to('#standA', { opacity: 1, duration: .4 }, 0);
    figs.forEach((o, k) => {
      const t = .45 + k * .08;
      tl.to(o.f.querySelector('.stand'), { opacity: 0, y: '6%', duration: .28, ease: 'power2.in' }, t)
        .fromTo(o.f.querySelector('.bow'), { opacity: 0, y: '-4%' }, { opacity: 1, y: 0, duration: .28, ease: 'power2.out' }, t + .08);
    });
    tl.to('#standA', { opacity: 0, duration: .3 }, 2.1)
      .fromTo('#hebrewW', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 1.55)
      .to('#hwShaft', { opacity: 1, duration: .8 }, 2.0)
      .to('#standB', { opacity: 1, duration: .4 }, 2.2)
      .to('#standPrayer', { opacity: 1, duration: .5 }, 2.7)
      .to(['#standB', '#standPrayer', '#crowd', '#hebrewW', '#hwShaft'], { opacity: 0, duration: .5 }, 3.5)
      .to('#lookDown', { opacity: 1, duration: .9 }, 3.6)
      .fromTo('#lookDown', { scale: 1.12 }, { scale: 1, duration: 1.6 }, 3.6)
      .to('#standC', { opacity: 1, duration: .5 }, 4.2);
  }, { onEnter: () => goSection('mid') });
})();

/* ── S8 인물 (가로 회랑) ── */
(() => {
  const track = $('#track');
  const dist = () => track.scrollWidth - innerWidth;
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
    .to(track, { x: () => -dist(), duration: 1 }, 0)
    .to('#corridor', { xPercent: -22, duration: 1 }, 0);
  ScrollTrigger.create({ trigger: '#s-people', start: 'top top', end: () => '+=' + (dist() + innerHeight), pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, refreshPriority: 100 - [...document.querySelectorAll('.scene')].indexOf(document.querySelector('#s-people')) });
  gsap.utils.toArray('.card').forEach(c => gsap.from(c, { opacity: 0, y: 40, duration: .8, scrollTrigger: { trigger: c, containerAnimation: tl, start: 'left 85%' } }));
})();

/* ── S9 기도의 벽 ── */
(() => {
  const SEALS = ['☉', '✦', '◆', '☥', '△', '●', '◐', '✧', '▽'];
  const SEED = [
    '이 땅에서 제 백성을 나가게 하소서', '오늘 매 맞은 소년의 상처가 덧나지 않게 하소서', '어머니 얼굴을 한 번만 더 보게 하소서',
    '벽돌 할당량이 내일은 줄게 하소서', '저를 비웃은 감독관의 눈을 열어 주소서', '짚을 주소서', '두려움을 이기게 하소서',
    '이 사슬이 끊어지게 하소서', '파라오의 마음을 열어 주소서', '오늘 밤만이라도 아이가 배불리 자게 하소서',
    '제가 무릎 꿇지 않게 하소서', '돌아갈 길을 잊지 않게 하소서', '저를 미워하지 않게 하소서', '나일이 붉어지게 하소서',
    '제가 지켜야 할 사람을 지키게 하소서', '저 사람을 미워하는 마음을 거두어 주소서', '하루만 더 버티게 하소서'
  ];
  const BAD = /(시발|씨발|ㅅㅂ|병신|개새|좆|fuck|010[-\s]?\d{3,4}|@\w+\.)/i;
  const stage = $('#smoke');
  let mine = [];
  try { mine = JSON.parse(localStorage.getItem('tk_prayers') || '[]'); } catch (e) {}
  const pool = () => SEED.concat(mine.map(m => m.t));
  const MAX = matchMedia('(hover:none),(pointer:coarse)').matches ? 9 : 13;
  function release(text, isMine = false, start = 0) {
    const el = document.createElement('div');
    el.className = 'slip' + (isMine ? ' mine' : '');
    el.dataset.seal = SEALS[(Math.random() * SEALS.length) | 0];
    el.textContent = '주여, ' + text;
    const w = stage.clientWidth;
    el.style.left = (isMine ? w / 2 - 140 : Math.random() * (w - 300)) + 'px';
    stage.appendChild(el);
    const dur = isMine ? 14 : 15 + Math.random() * 8;
    const tl = gsap.timeline({ onComplete: () => el.remove() });
    tl.fromTo(el, { y: isMine ? -innerHeight * .25 : 0, x: 0, rotate: (Math.random() - .5) * 8 },
      { y: -innerHeight - 160, x: (Math.random() - .5) * 140, rotate: (Math.random() - .5) * 14, duration: dur, ease: 'sine.in', force3D: true }, 0)
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur * .12, ease: 'none' }, 0)
      .to(el, { opacity: 0, duration: dur * .25, ease: 'none' }, dur * .75);
    if (start) tl.progress(start);
  }
  const pick = () => { const p = pool(); return p[(Math.random() * p.length) | 0]; };
  let timer = null;
  ScrollTrigger.create({
    trigger: '#s-prayer', start: 'top 95%', end: 'bottom 5%',
    onToggle(self) {
      clearInterval(timer);
      if (self.isActive) {
        // 들어오는 순간 이미 기도가 흐르고 있게: 화면 곳곳에 미리 띄워 둔다
        if (stage.childElementCount < 4) for (let i = 0; i < MAX - 3; i++) release(pick(), false, .08 + Math.random() * .72);
        timer = setInterval(() => { if (stage.childElementCount >= MAX) return; release(pick()); }, 1300);
      }
    }
  });
  $('#prayForm').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#prayInput'); const t = inp.value.trim().replace(/^주여[,\s]*/, '');
    if (!t) return;
    if (BAD.test(t)) { inp.value = ''; inp.placeholder = '그 기도는 올릴 수 없습니다'; return; }
    mine.push({ t, at: Date.now() }); try { localStorage.setItem('tk_prayers', JSON.stringify(mine.slice(-30))); } catch (e) {}
    release(t, true); inp.value = ''; inp.placeholder = '연기가 되어 올라갔습니다';
    // TODO: 공용 기도 저장 — Supabase/Firebase에 insert 하고, pool()에 서버 기도를 섞는다.
  });
})();

/* ── S10 파피루스 ── */
gsap.to('#papyrus', { clipPath: 'inset(0 0% 0 0%)', ease: 'power2.inOut', scrollTrigger: { trigger: '#s-rules', start: 'top 70%', end: 'top 10%', scrub: 1 } });
gsap.set('#s-rules', { height: 'auto', minHeight: '100vh' });

/* ── S11 탈리다 쿰 ── */
(() => {
  scene('#s-end', 3200, tl => {
    tl.fromTo('#opet', { scale: 1.05 }, { scale: 1.22, duration: 3 }, 0)
      .fromTo('#opetDay .od-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4 }, .1)
      .fromTo('#odA', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5 }, .25)
      .fromTo('#odB', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, .7)
      .to('#opetDay', { opacity: 0, scale: 1.04, duration: .3 }, 1.4)
      .to('#whiteout', { opacity: 1, duration: .4, ease: 'power2.in' }, 1.6)
      .to('#void', { opacity: 1, duration: .1 }, 2.0)
      .to('#whiteout', { opacity: 0, duration: .15 }, 2.1)
      .to({}, { duration: .75 }, 2.25);
  });

  const btn = $('#holdBtn'), V = $('#void'), bar = $('#holdRing');
  const st = { p: 0 }; let hold = null, done = false;
  const RF = [...document.querySelectorAll('#riser .rf')];
  const setFrames = f => RF.forEach((im, i) => { im.style.opacity = Math.max(0, 1 - Math.abs(f - i)).toFixed(3); });
  // 글자 쪼개기 (마스크 상승용)
  document.querySelectorAll('.fin .end-title, .fin .end-sub .w').forEach(el => {
    el.innerHTML = [...el.textContent].map(ch => ch === ' ' ? ' ' : `<span class="c">${ch}</span>`).join('');
  });
  const render = () => {
    const p = st.p;
    setFrames(p * 3);
    gsap.set('#riser', { opacity: .35 + .65 * p });
    V.style.setProperty('--p', p.toFixed(3));
    gsap.set('#finBeam', { opacity: p * .9, scaleX: 1 + p * 2.5 });
    gsap.set('#finGlow', { opacity: p * .8 });
    gsap.set('#finFloor', { scaleX: .25 + .75 * p });
    gsap.set('#finCam', { scale: 1 + .05 * p });
    bar.style.transform = `scaleX(${p})`;
  };
  // 노래 박동 → 십자가·빛·글자 (미리 뽑은 저음 엔벨로프 사용, file://에서도 동작)
  const B = window.OST_BEAT, rings = [...document.querySelectorAll('#finRings i')]; let ri = 0, beatOn = false;
  const val = (s, i) => s && i >= 0 && i < s.length ? (s.charCodeAt(i) - 48) / 63 : 0;
  const TOUCH = matchMedia('(hover:none),(pointer:coarse)').matches;
  function pulse(k) {
    const r = rings[ri++ % rings.length];
    gsap.fromTo(r, { scale: .25, opacity: .9 * k }, { scale: 2.6 + k * 1.4, opacity: 0, duration: 1.4, ease: 'expo.out', overwrite: true });
    if (k > .75 && !TOUCH) {
      gsap.fromTo('#flash', { opacity: .12 * k }, { opacity: 0, duration: .5, overwrite: true });
      gsap.fromTo('#riser', { scale: 1.035 }, { scale: 1, duration: .45, ease: 'power2.out', overwrite: 'auto' });
      const c = $('#endCross .core').getBoundingClientRect();
      window.dustBurst && window.dustBurst(c.left + c.width / 2, c.top + c.height / 2, 7);
    }
  }
  function startBeat() {
    if (beatOn || !B) return; beatOn = true;
    let last = -1, sm = 0, lastHit = -99, grid = -1; const t0 = performance.now() - 31600, dur = B.lo.length / B.fps, P = B.fps * 60 / 128.57, G0 = 948;
    (function loop() {
      if (!V.parentElement.classList.contains('live')) { requestAnimationFrame(loop); return; }
      const live = soundOn && !ost.paused;
      const t = live ? ost.currentTime : ((performance.now() - t0) / 1000) % dur;
      const i = Math.floor(t * B.fps);
      const v = Math.max(val(B.lo, i), val(B.all, i) * .6);
      sm += (v - sm) * (v > sm ? .6 : .2);
      if (!TOUCH || (i & 1)) V.style.setProperty('--b', (TOUCH ? sm * .55 : sm).toFixed(2));
      if (last >= 0 && i > last && i - last < 10) {
        for (const o of B.on) if (o > last && o <= i) { pulse(Math.min(1, .45 + val(B.lo, o))); lastHit = i; break; }
        const g = Math.floor((i - G0) / P);
        if (g !== grid) { grid = g; if (i - lastHit > 6) { pulse(.5); sm = Math.max(sm, .5); } }
      }
      last = i;
      requestAnimationFrame(loop);
    })();
  }
  function rise() {
    done = true; V.classList.add('risen');
    const r = $('#riser').getBoundingClientRect();
    if (soundOn) { targetVol = 1; gsap.to(ost, { volume: 1, duration: 1.2, ease: 'power2.out', overwrite: true }); }
    const tl = gsap.timeline();
    tl.to({ f: 3 }, { f: 4, duration: .35, ease: 'power2.out', onUpdate() { setFrames(this.targets()[0].f); } }, 0)
      .to('#finUi', { opacity: 0, y: 10, duration: .4 }, 0)
      .to('#flash', { opacity: 1, duration: .07, ease: 'none' }, .35)
      .to('#flash', { opacity: 0, duration: 1.6, ease: 'power2.out' }, .45)
      .call(() => window.dustBurst && window.dustBurst(r.left + r.width / 2, r.top + r.height * .45, 90), null, .42)
      .to(V, { '--p': 1, duration: .3 }, .4)
      .to('.fin-giant', { opacity: .5, duration: 2.4, ease: 'power2.inOut' }, .6)
      .to('#finBeam', { scaleX: 30, opacity: 0, duration: 1.6, ease: 'expo.out' }, .4)
      .fromTo('#finGlow', { scale: .8 }, { scale: 1.35, opacity: 1, duration: 2, ease: 'expo.out' }, .4)
      .to('#finFloor', { scaleX: 1.4, opacity: .5, duration: 2, ease: 'expo.out' }, .4)
      .to('#finCam', { scale: 1, duration: 2.4, ease: 'power3.out' }, .4)
      .to('#riser', { y: -8, duration: 2.4, ease: 'power3.out' }, .4)
      .to('#endCross .v', { scaleY: 1, duration: 1.3, ease: 'power3.inOut' }, .7)
      .to('#endCross .h', { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 1.4)
      .add(() => $('#endAfter').classList.add('on'), 1.6)
      .to('.fin .end-title .c', { y: '0%', duration: 1, stagger: .045, ease: 'power3.out' }, 1.7)
      .to('.fin .end-sub .w:nth-child(1) .c', { y: '0%', duration: .9, stagger: .09, ease: 'power3.out' }, 2.6)
      .to('.fin .end-sub .w:nth-child(2) .c', { y: '0%', duration: .7, stagger: .1, ease: 'power4.out' }, 3.6)
      .fromTo('#flash', { opacity: .28 }, { opacity: 0, duration: 1.2, ease: 'power2.out', immediateRender: false }, 3.6)
      .fromTo('#finGlow', { scale: 1.6 }, { scale: 1.35, duration: 1.6, ease: 'power2.out' }, 3.6)
      .add(() => V.classList.add('done-text'), 4.7)
      .to('.fin-next', { opacity: 1, y: 0, duration: 1.2 }, 4.9)
      .add(() => startBeat(), 1.9);
  }
  function start(e) {
    if (done || e.target.closest('.cta')) return; e.preventDefault();
    hold && hold.kill();
    hold = gsap.to(st, { p: 1, duration: 3.4 * (1 - st.p), ease: 'power1.inOut', onUpdate: render, onComplete: rise });
  }
  function stop() {
    if (done) return; hold && hold.kill();
    hold = gsap.to(st, { p: 0, duration: 1.4 * st.p + .01, ease: 'power2.out', onUpdate: render });
  }
  V.addEventListener('pointerdown', start);
  ['pointerup', 'pointercancel'].forEach(ev => addEventListener(ev, stop));
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
  render();
})();

/* nav anchors → lenis */
document.querySelectorAll('.hud-nav a').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { duration: 2.2 });
}));
addEventListener('load', () => ScrollTrigger.refresh());

/* ── 금가루 (스프라이트 재사용으로 가볍게) ── */
(() => {
  const cv = $('#dust'), ctx = cv.getContext('2d');
  let W, H, dpr = Math.min(devicePixelRatio || 1, 1.5), P = [];
  const N = innerWidth < 700 ? 40 : 80;
  const sprite2 = document.createElement('canvas'); sprite2.width = sprite2.height = 64;
  (() => { const s = sprite2.getContext('2d'), g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(230,238,255,1)'); g.addColorStop(.3, 'rgba(110,150,240,.55)'); g.addColorStop(1, 'rgba(60,90,200,0)');
    s.fillStyle = g; s.fillRect(0, 0, 64, 64); })();
  const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
  (() => { const s = sprite.getContext('2d'), g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,248,220,1)'); g.addColorStop(.3, 'rgba(255,205,120,.55)'); g.addColorStop(1, 'rgba(255,170,60,0)');
    s.fillStyle = g; s.fillRect(0, 0, 64, 64); })();
  function size() { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
  size(); addEventListener('resize', size);
  const spawn = (y) => ({ x: Math.random() * W, y: y ?? Math.random() * H, r: (Math.random() * 1.6 + .4) * dpr, vy: -(Math.random() * .35 + .08) * dpr, vx: (Math.random() - .5) * .15 * dpr, t: Math.random() * 6.28, s: Math.random() * .03 + .01, blue: Math.random() < .5 });
  for (let i = 0; i < N; i++) P.push(spawn());
  let boost = 0; const B = [];
  window.dustBurst = (x, y, n = 140) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, sp = (Math.random() * 9 + 2) * dpr; B.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5 * dpr, r: (Math.random() * 2 + .6) * dpr, life: 1 }); } };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { boost = Math.min(1, Math.abs(s.getVelocity()) / 2500); } });
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.t += p.s; p.x += p.vx + Math.sin(p.t) * .2 * dpr; p.y += p.vy * (1 + boost * 6);
      if (p.y < -10) Object.assign(p, spawn(H + 10));
      const bt = window.BEAT || 0;
      ctx.globalAlpha = Math.min(1, (.35 + .65 * Math.abs(Math.sin(p.t * 1.7))) * .8 * (1 + bt * .9));
      const d = p.r * 8 * (1 + bt * .35); ctx.drawImage(p.blue ? sprite2 : sprite, p.x - d / 2, p.y - d / 2, d, d);
    }
    for (let i = B.length - 1; i >= 0; i--) {
      const q = B[i]; q.x += q.vx; q.y += q.vy; q.vx *= .965; q.vy = q.vy * .965 + .04 * dpr; q.life -= .011;
      if (q.life <= 0) { B.splice(i, 1); continue; }
      ctx.globalAlpha = q.life; const d = q.r * 10; ctx.drawImage(sprite, q.x - d / 2, q.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();

/* ── 보이는 장면만 움직이게 ── */
document.querySelectorAll('.scene .stage').forEach(st => {
  const trg = st.parentElement.parentElement.classList.contains('pin-spacer') ? st.parentElement.parentElement : st.parentElement;
  ScrollTrigger.create({ trigger: trg, start: 'top bottom', end: 'bottom top', toggleClass: { targets: st, className: 'live' } });
});
/* ── 시네마: 장면마다 그레이딩·빛번짐·컷 ── */
document.querySelectorAll('.scene .stage').forEach((st, i) => {
  const id = st.parentElement.id;
  if (id !== 's-word' && id !== 's-rules' && id !== 's-end' && id !== 's-prayer') {
          }
  if (id === 's-word') return;
  const cut = document.createElement('div'); cut.className = 'cut'; st.appendChild(cut);
  gsap.fromTo(cut, { opacity: 1 }, { opacity: 0, ease: 'power1.out', scrollTrigger: { trigger: st.parentElement.parentElement.classList.contains('pin-spacer') ? st.parentElement.parentElement : st.parentElement, start: 'top 85%', end: 'top 15%', scrub: true } });
});

/* ── 신전: 인트로 숨쉬기 · 말씀 장면 기둥 지나가기 · 양옆 각인 띠 ── */
gsap.set('#gate .t-front, #s-word .t-front', { xPercent: -50, x: 0 });
gsap.set('#gate .t-mid', { xPercent: -50 });
gsap.to('#gate .temple', { scale: 1.05, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 });
gsap.fromTo('#s-word .t-front', { scale: 1 }, { scale: 1.35, ease: 'none', scrollTrigger: { trigger: '#s-word', start: 'top top', end: () => '+=' + innerHeight * 2.2, scrub: true } });
gsap.to('.inscr span', { yPercent: -55, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .6 } });

/* ── 이미지 저장 방지: 우클릭·길게 누르기·드래그 ── */
addEventListener('contextmenu', e => { if (!e.target.closest('input,textarea')) e.preventDefault(); });
addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });
document.querySelectorAll('img').forEach(i => { i.setAttribute('draggable', 'false'); });
/* ── 모바일: 이미지 미리 디코딩해서 장면 진입 때 빈 화면 깜빡임 방지 ── */
addEventListener('load', () => { document.querySelectorAll('img').forEach(i => { i.decode && i.decode().catch(() => {}); }); });

/* ── S12 프롤로그: 이야기의 첫 장면 → 셉세트라의 첫 명령이 훅으로 꽂힌다 ── */
(() => {
  const L = [...document.querySelectorAll('#pro > p')];
  { const t = document.getElementById('pvT'); t.innerHTML = t.innerHTML.split('<br>').map(s => [...s].map(c => c === ' ' ? ' ' : `<span class="c">${c}</span>`).join('')).join('<br>'); }
  scene('#s-prologue', 8400, tl => {
    tl.fromTo('#proBg', { scale: 1.12 }, { scale: 1, duration: 3.2 }, 0);
    L.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .32 }, .15 + i * .36));
    tl.to('#pro', { opacity: 0, y: -24, duration: .35 }, 2.75)
      .to('#proVeil', { opacity: 1, duration: .4 }, 2.8)
      // 셉세트라 얼굴이 어둠 속에서 다가온다
      .fromTo('#proSep', { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1.05, duration: 1.1, ease: 'power2.out' }, 3.0)
      .to('#proFinal', { opacity: 1, duration: .01 }, 3.6)
      .fromTo('#proFinal .glyph-row', { opacity: 0, letterSpacing: '1.4em' }, { opacity: .85, letterSpacing: '.7em', duration: .4 }, 3.6)
      // "가까이 오라." — 쾅
      .fromTo('#pc1', { opacity: 0, scale: 1.9, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .28, ease: 'power4.in' }, 4.0)
      .fromTo('#proFlash', { opacity: .55 }, { opacity: 0, duration: .5, ease: 'power2.out', immediateRender: false }, 4.28)
      .fromTo('#proSep', { scale: 1.05 }, { scale: 1.0, duration: .3, ease: 'power3.out', immediateRender: false }, 4.28)
      .call(() => { const r = document.getElementById('pc1').getBoundingClientRect(); window.dustBurst && window.dustBurst(r.left + r.width / 2, r.top + r.height / 2, 60); }, null, 4.3)
      .fromTo('#pc2', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35 }, 4.75)
      .fromTo('#pc3', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35 }, 5.1)
      // 모든 게 어둠으로 물러나고, 십자가가 그어진다
      .to(['#proSep', '#proFinal'], { opacity: 0, duration: .5 }, 5.8)
      .to('#proBg', { opacity: 0, duration: .5 }, 5.8)
      .fromTo('#proVoid', { opacity: 0 }, { opacity: 1, duration: .9, immediateRender: false }, 5.9)
      .fromTo('#proCross .v', { scaleY: 0 }, { scaleY: 1, duration: .55, ease: 'power3.inOut' }, 6.25)
      .fromTo('#proCross .h', { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, 6.75)
      .fromTo('#proCross .core', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .4 }, 7.1)
      .fromTo('#proFlash', { opacity: .35 }, { opacity: 0, duration: .5, immediateRender: false }, 7.15)
      .to('#proVerse', { opacity: 1, duration: .01 }, 7.3)
      .fromTo('#pvT .c', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .08, stagger: .028 }, 7.35)
      .fromTo('#pvR', { opacity: 0 }, { opacity: 1, duration: .3 }, 8.55)
      .fromTo('#proCta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .4 }, 8.9)
      .to({}, { duration: .6 }, 9.3);
  });
  ScrollTrigger.refresh();
})();

/* ── 전 구간 비트: 양옆 각인 기둥 띠·금가루가 노래 박자에 맞춰 뛴다 (소리 켰을 때) ── */
(() => {
  const B = window.OST_BEAT; if (!B) return;
  const L = [...document.querySelectorAll('.inscr')];
  const GR = () => document.querySelectorAll('.glyph-row');
  const TOUCH = matchMedia('(hover:none),(pointer:coarse)').matches;
  const val = (s, i) => (i >= 0 && i < s.length) ? (s.charCodeAt(i) - 48) / 63 : 0;
  const P = B.fps * 60 / 128.57, G0 = 948;
  let sm = 0, last = -1, lastHit = -99, grid = -1, f = 0;
  const PR = [...document.querySelectorAll('#proRings i')]; let pri = 0; const PC = document.getElementById('proCross');
  const PV = document.getElementById('proVoid'), SYN0 = performance.now() - 31600;
  const PS = document.getElementById('s-prologue');
  const crossOn = () => { if (!PC || gsap.getProperty('#proCross .h', 'scaleX') < .95) return false; const r = PS.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  const hit = k => {
    L.forEach(el => { el.style.setProperty('--k', k.toFixed(2)); el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); });
    if (crossOn()) { const r = PR[pri++ % PR.length]; gsap.fromTo(r, { scale: .25, opacity: .9 * k }, { scale: 2.6 + k * 1.4, opacity: 0, duration: 1.4, ease: 'expo.out', overwrite: true }); }
  };
  (function loop() {
    f++;
    let v = 0;
    const liveS = soundOn && !ost.paused, syn = !liveS && crossOn();
    if (liveS || syn) {
      const i = liveS ? Math.floor(ost.currentTime * B.fps) : Math.floor((((performance.now() - SYN0) / 1000) % (B.lo.length / B.fps)) * B.fps);
      v = Math.max(val(B.lo, i), val(B.all, i) * .6);
      if (last >= 0 && i > last && i - last < 10) {
        for (const o of B.on) if (o > last && o <= i) { hit(Math.min(1, .5 + val(B.lo, o))); lastHit = i; break; }
        const g = Math.floor((i - G0) / P);
        if (g !== grid) { grid = g; if (i - lastHit > 6 && i > G0) hit(.45); }
      }
      last = i;
    } else last = -1;
    sm += (v - sm) * (v > sm ? .6 : .14);
    window.BEAT = sm;
    if (!TOUCH || f % 2 === 0) { L.forEach(el => el.style.setProperty('--beat', sm.toFixed(2))); if (f % 3 === 0) { GR().forEach(el => el.style.setProperty('--beat', sm.toFixed(2))); } if (PC && f % 2 === 0) { PC.style.setProperty('--beat', sm.toFixed(2)); PV && PV.style.setProperty('--beat', sm.toFixed(2)); } }
    requestAnimationFrame(loop);
  })();
})();

/* ── 상형문자 줄: 장 제목마다 새겨 넣기 ── */
(() => {
  const G = '𓇳𓊽𓂀𓆣𓊹𓁐𓋴𓅓𓈖𓇋𓏏𓄿𓂋𓆑𓃭𓊪𓎛𓇯𓉐𓅱';
  const row = n => { let s = []; for (let i = 0; i < n; i++) s.push(G[Math.floor(Math.random() * G.length / 2) * 2] + G[Math.floor(Math.random() * G.length / 2) * 2 + 1]); return [...s.join('')].filter((c, i, a) => true); };
  const mk = n => { const p = document.createElement('p'); p.className = 'glyph-row'; p.setAttribute('aria-hidden', 'true'); const cs = [...G]; let out = []; for (let i = 0; i < n; i++) out.push(cs[(Math.random() * cs.length) | 0]); p.textContent = out.join(' '); return p; };
  ['#s-prayer .sec-title', '#reignText .reign-head', '.od-eyebrow', '.pro-info', '.fin .end-title', '#s-word .hebrew'].forEach(sel => document.querySelectorAll(sel).forEach(el => el.parentNode.insertBefore(mk(5), el)));
})();
