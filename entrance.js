(function () {
  var root = document.getElementById('quIntro');
  if (!root) return;

  var STORAGE_KEY = 'qu_intro_seen_v1';
  var url = new URL(location.href);
  var force = url.searchParams.has('intro');
  var calibrate = url.searchParams.has('calibrate');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var seen = false;
  try { seen = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}

  if (seen && !force && !calibrate) {
    document.documentElement.classList.remove('qu-intro-on', 'qu-intro-ivory');
    root.remove();
    return;
  }

  document.documentElement.classList.add('qu-intro-on');
  try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}

  var ENTER_MS = reduced ? 650 : 2500;
  var SKIP_MS = reduced ? 550 : 750;
  var MOTES = reduced ? 0 : 28;
  var BG_VOL = 0.05;
  var CHIME_VOL = 0.14;
  var DOOR_VOL = 0.22;
  var RAMP_SEC = 1.6;
  var FADE_SEC = 1.1;

  var scene = root.querySelector('.qu-scene');
  var frame = root.querySelector('.qu-frame');
  var photo = root.querySelector('.qu-photo');
  var door = root.querySelector('.qu-door');
  var orb = root.querySelector('.qu-orb');
  var motes = root.querySelector('.qu-motes');
  var enterBtn = document.getElementById('quEnter');
  var skipBtn = document.getElementById('quSkip');
  var soundBtn = document.getElementById('quSound');
  var prevFocus = document.activeElement;

  function parseNum(v, fb) { var n = parseFloat(v); return isFinite(n) ? n : fb; }
  function parseDoor(str) {
    var p = (str || '').split(',').map(Number);
    return { cx: p[0] || 50, cy: p[1] || 58, w: p[2] || 24, h: p[3] || 58 };
  }
  function parseLamps(str) {
    if (!str) return [];
    return str.split(';').map(function (s) {
      var p = s.split(',').map(Number);
      return { x: p[0], y: p[1], r: p[2] || 18, i: p[3] || 2 };
    }).filter(function (l) { return isFinite(l.x) && isFinite(l.y); });
  }

  var doorSpec = parseDoor(root.dataset.door);
  var arch = root.dataset.arch === 'true';
  var lamps = parseLamps(root.dataset.lamps);
  var imgSrc = (root.dataset.image || '').trim();

  door.style.left = (doorSpec.cx - doorSpec.w / 2) + '%';
  door.style.top = (doorSpec.cy - doorSpec.h / 2) + '%';
  door.style.width = doorSpec.w + '%';
  door.style.height = doorSpec.h + '%';
  if (arch) door.style.borderRadius = (doorSpec.w / 2) + '% / ' + (doorSpec.w / 2 * 1.4) + '% 0 0';
  orb.style.left = doorSpec.cx + '%';
  orb.style.top = doorSpec.cy + '%';
  orb.style.width = (doorSpec.w * 0.6) + '%';
  orb.style.setProperty('--os', Math.max(14, Math.round(80 / Math.max(10, doorSpec.w))));

  lamps.forEach(function (l) {
    var g = document.createElement('div');
    g.className = 'qu-glow';
    g.style.left = l.x + '%'; g.style.top = l.y + '%';
    g.style.width = (l.r * 2.2) + '%';
    g.style.opacity = Math.min(1, 0.35 * l.i);
    frame.insertBefore(g, door);

    var b = document.createElement('div');
    b.className = 'qu-bulb';
    b.style.left = l.x + '%'; b.style.top = l.y + '%';
    b.style.width = (l.r * 0.24) + '%';
    b.style.opacity = Math.min(1, 0.65 * l.i);
    frame.insertBefore(b, door);
  });

  function fitFrame() {
    var nw = photo.naturalWidth, nh = photo.naturalHeight;
    if (!nw || !nh) {
      frame.style.left = '0'; frame.style.top = '0';
      frame.style.width = '100%'; frame.style.height = '100%';
      return;
    }
    var vw = window.innerWidth, vh = window.innerHeight;
    var ia = nw / nh, va = vw / vh, w, h;
    if (ia > va) { h = vh; w = h * ia; } else { w = vw; h = w / ia; }
    frame.style.width = w + 'px'; frame.style.height = h + 'px';
    frame.style.left = ((vw - w) / 2) + 'px';
    frame.style.top = ((vh - h) / 2) + 'px';
  }
  window.addEventListener('resize', fitFrame);

  if (imgSrc) {
    var probe = new Image();
    probe.onload = function () {
      photo.src = imgSrc;
      fitFrame();
      root.classList.add('is-loaded');
    };
    probe.src = imgSrc;
  }

  for (var i = 0; i < MOTES; i++) {
    var s = document.createElement('span');
    var size = (1.5 + Math.random() * 2.5).toFixed(1) + 'px';
    s.style.setProperty('--s', size);
    s.style.left = (Math.random() * 100).toFixed(1) + '%';
    s.style.setProperty('--x', ((Math.random() - 0.5) * 140).toFixed(0) + 'px');
    s.style.setProperty('--o', (0.25 + Math.random() * 0.55).toFixed(2));
    s.style.setProperty('--d', (11 + Math.random() * 14).toFixed(1) + 's');
    s.style.setProperty('--dl', (-Math.random() * 18).toFixed(1) + 's');
    motes.appendChild(s);
  }

  var ac, master, droneGain;
  var soundWant = false;
  var soundStarted = false;

  function ensureAudio() {
    if (ac) return ac;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ac = new Ctx();
    master = ac.createGain();
    master.gain.value = 0.0001;
    master.connect(ac.destination);
    return ac;
  }

  function startDrone() {
    if (soundStarted) return;
    var ctx = ensureAudio();
    if (!ctx) return;
    soundStarted = true;

    var now = ctx.currentTime;
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, now);
    droneGain.gain.exponentialRampToValueAtTime(BG_VOL, now + RAMP_SEC);

    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    lp.Q.value = 0.7;

    [[110, 0.55], [164.81, 0.28], [220, 0.22], [277.18, 0.12]].forEach(function (pair, idx) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = idx % 2 ? 'triangle' : 'sine';
      o.frequency.value = pair[0];
      o.detune.value = (idx - 1.5) * 4;
      g.gain.value = pair[1];
      o.connect(g);
      g.connect(lp);
      o.start(now);
    });

    var bufLen = ctx.sampleRate * 2;
    var buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    var data = buf.getChannelData(0);
    var last = 0;
    for (var k = 0; k < bufLen; k++) {
      var w = Math.random() * 2 - 1;
      data[k] = (last + 0.02 * w) / 1.02;
      last = data[k];
      data[k] *= 0.14;
    }
    var noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 650;
    bp.Q.value = 1.8;
    noise.connect(bp);
    bp.connect(lp);
    noise.start(now);

    lp.connect(droneGain);
    droneGain.connect(master);
  }

  function setSound(on) {
    soundWant = on;
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.innerHTML = on ? '&#9834; Sound on' : '&#9834; Enable sound';
    soundBtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
    if (on) {
      var ctx = ensureAudio();
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        startDrone();
        var t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
        master.gain.linearRampToValueAtTime(1, t + 0.35);
      }
    } else if (ac && master) {
      var t2 = ac.currentTime;
      master.gain.cancelScheduledValues(t2);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t2);
      master.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.25);
    }
  }

  function playChime() {
    if (!soundWant || !ac || !master || ac.state !== 'running') return;
    var now = ac.currentTime;
    [440, 659.25, 880, 1318.5].forEach(function (freq, idx) {
      var o = ac.createOscillator();
      var g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      var start = now + idx * 0.07;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(CHIME_VOL / (idx + 1.2), start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 2.4);
      o.connect(g);
      g.connect(master);
      o.start(start);
      o.stop(start + 2.5);
    });
  }

  function playDoor() {
    if (!soundWant || !ac || !master || ac.state !== 'running') return;
    var now = ac.currentTime;
    var len = Math.floor(ac.sampleRate * 1.4);
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      var x = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.sin(Math.min(1, x * 2.5) * Math.PI) * (1 - x * 0.6);
    }
    var src = ac.createBufferSource();
    src.buffer = buf;
    var filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(190, now);
    filter.frequency.exponentialRampToValueAtTime(920, now + 0.9);
    filter.Q.value = 2.4;
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(DOOR_VOL, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(now);
  }

  function stopAudio() {
    if (!ac || !master) return;
    try {
      var t = ac.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + FADE_SEC);
      setTimeout(function () { try { ac.close(); } catch (e) {} }, (FADE_SEC + 0.2) * 1000);
    } catch (e) {}
  }

  soundBtn.addEventListener('click', function () { setSound(!soundWant); });

  var leaving = false;
  function finish() {
    stopAudio();
    root.classList.add('is-done');
    document.documentElement.classList.remove('qu-intro-on', 'qu-intro-ivory');
    try {
      if (prevFocus && prevFocus.focus && prevFocus !== document.body) {
        prevFocus.focus({ preventScroll: true });
      }
    } catch (e) {}
    setTimeout(function () { root.remove(); }, 1200);
  }

  enterBtn.addEventListener('click', function () {
    if (leaving) return;
    leaving = true;
    root.classList.add('is-leaving', 'is-opening');
    playChime();
    playDoor();
    setTimeout(finish, ENTER_MS);
  });

  skipBtn.addEventListener('click', function () {
    if (leaving) return;
    leaving = true;
    root.classList.add('is-skipping');
    setTimeout(finish, SKIP_MS);
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') skipBtn.click();
  });

  if (calibrate) {
    root.classList.add('is-calibrating');
    var box = document.createElement('div');
    box.className = 'qu-cal';
    root.appendChild(box);
    var pts = [];
    var lampPts = [];
    var mode = 'door';
    function renderCal() {
      root.querySelectorAll('.qu-dot').forEach(function (n) { n.remove(); });
      pts.forEach(function (pt) {
        var dot = document.createElement('div');
        dot.className = 'qu-dot';
        dot.style.left = pt.x + '%'; dot.style.top = pt.y + '%';
        root.appendChild(dot);
      });
      lampPts.forEach(function (lp) {
        var dot = document.createElement('div');
        dot.className = 'qu-dot';
        dot.style.borderColor = '#C5BAC1';
        dot.style.left = lp.x + '%'; dot.style.top = lp.y + '%';
        root.appendChild(dot);
      });
      var dAttr = '';
      if (pts.length >= 2) {
        var x1 = pts[0].x, y1 = pts[0].y, x2 = pts[1].x, y2 = pts[1].y;
        var cx = ((x1 + x2) / 2).toFixed(1), cy = ((y1 + y2) / 2).toFixed(1);
        var w = Math.abs(x2 - x1).toFixed(1), h = Math.abs(y2 - y1).toFixed(1);
        dAttr = 'data-door="' + cx + ',' + cy + ',' + w + ',' + h + '"';
      }
      var lAttr = lampPts.length ? ' data-lamps="' + lampPts.map(function (p) { return p.x + ',' + p.y + ',18,2.2'; }).join(';') + '"' : '';
      box.innerHTML = 'Mode: <b>' + mode + '</b> (press <b>L</b> to switch to lamps, <b>R</b> to reset).<br>' +
        '<code>' + (dAttr + lAttr || 'Click top-left and bottom-right of the doorway.') + '</code>';
    }
    renderCal();
    root.addEventListener('click', function (e) {
      if (e.target === box || box.contains(e.target)) return;
      var rect = root.getBoundingClientRect();
      var x = +(((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      var y = +(((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      if (mode === 'door') { if (pts.length >= 2) pts = []; pts.push({ x: x, y: y }); }
      else { lampPts.push({ x: x, y: y }); }
      renderCal();
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'l' || e.key === 'L') { mode = mode === 'door' ? 'lamps' : 'door'; renderCal(); }
      if (e.key === 'r' || e.key === 'R') { pts = []; lampPts = []; renderCal(); }
    });
  }

  try { enterBtn.focus({ preventScroll: true }); } catch (e) {}
})();
