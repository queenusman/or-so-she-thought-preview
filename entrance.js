(function () {
  var root = document.documentElement;
  var intro = document.getElementById('quIntro');
  if (!intro) return;

  if (!root.classList.contains('qu-intro-on')) {
    intro.remove();
    return;
  }

  var enterBtn = document.getElementById('quEnter');
  var skipBtn = document.getElementById('quSkip');
  var soundBtn = document.getElementById('quSound');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inerted = [];
  var prevFocus = document.activeElement;
  var leaving = false;
  var raf = 0;

  Array.prototype.forEach.call(document.body.children, function (el) {
    if (el !== intro && !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName) && !el.inert) {
      el.inert = true;
      inerted.push(el);
    }
  });
  if (enterBtn) enterBtn.focus({ preventScroll: true });

  var num = function (a) {
    return a.split(',').map(function (v) { return parseFloat(v); });
  };
  var door = num(intro.dataset.door || '50,58,24,58');
  var lampCfg = (intro.dataset.lamps || '').split(';').filter(Boolean).map(num);
  var stage = intro.querySelector('.qu-stage');
  var frame = intro.querySelector('.qu-frame');
  var photo = intro.querySelector('.qu-photo');
  var doorEl = intro.querySelector('.qu-door');
  var orb = intro.querySelector('.qu-orb');
  var wash = intro.querySelector('.qu-wash');
  var ar = 1.6;

  if (doorEl) {
    doorEl.style.cssText =
      'left:' + (door[0] - door[2] / 2) + '%;' +
      'top:' + (door[1] - door[3] / 2) + '%;' +
      'width:' + door[2] + '%;' +
      'height:' + door[3] + '%;' +
      (intro.dataset.arch === 'true' ? 'border-radius:50% 50% 0 0 / 22% 22% 0 0;' : '');
  }

  if (orb) {
    orb.style.cssText =
      'left:' + door[0] + '%;' +
      'top:' + door[1] + '%;' +
      'width:' + (door[2] * 1.4) + '%;' +
      'height:' + (door[3] * 1.2) + '%;' +
      '--os:' + Math.ceil(Math.max(100 / (door[2] * 1.4), 100 / (door[3] * 1.2)) * 2.4);
  }

  var lamps = lampCfg.map(function (c) {
    var g = document.createElement('div');
    var b = document.createElement('div');
    g.className = 'qu-glow';
    b.className = 'qu-bulb';
    g.style.cssText = 'left:' + c[0] + '%;top:' + c[1] + '%;width:' + c[2] + '%';
    b.style.cssText = 'left:' + c[0] + '%;top:' + c[1] + '%;width:' + (c[3] || 2.2) + '%';
    if (frame) {
      frame.insertBefore(g, wash);
      frame.insertBefore(b, wash);
    }
    return { g: g, b: b, x: c[0], v: 1, t: 1, n: 0 };
  });

  function layout() {
    if (!frame || !stage) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w = Math.max(vw, vh * ar);
    var h = w / ar;
    if (h < vh) {
      h = vh;
      w = h * ar;
    }
    var l = Math.min(0, Math.max(vw - w, vw / 2 - door[0] * w / 100));
    var t = Math.min(0, Math.max(vh - h, vh * 0.52 - door[1] * h / 100));
    frame.style.cssText = 'left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + 'px';
    stage.style.transformOrigin = (l + door[0] * w / 100) + 'px ' + (t + door[1] * h / 100) + 'px';
  }

  var src = intro.dataset.image;
  if (src && photo) {
    photo.onload = function () {
      if (photo.naturalWidth && photo.naturalHeight) {
        ar = photo.naturalWidth / photo.naturalHeight;
        layout();
      }
      intro.classList.add('is-loaded');
    };
    photo.onerror = function () {
      photo.removeAttribute('src');
    };
    photo.src = src;
  }

  layout();
  window.addEventListener('resize', layout);

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, verb = null, noise = null, brown = null;
  var modA = null, modB = null, ambSrcs = [];
  var soundPref = 'unset', ambOn = false, ambG = null, ambT = 0;

  function audio() {
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor();
      comp.connect(ctx.destination);
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp);

      verb = ctx.createConvolver();
      var len = Math.floor(ctx.sampleRate * 2.6);
      var ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (var c = 0; c < 2; c++) {
        var d = ir.getChannelData(c);
        for (var i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
        }
      }
      verb.buffer = ir;
      var vg = ctx.createGain();
      vg.gain.value = 0.6;
      verb.connect(vg);
      vg.connect(master);

      noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      var nd = noise.getChannelData(0);
      for (var j = 0; j < nd.length; j++) nd[j] = Math.random() * 2 - 1;

      brown = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      var bd = brown.getChannelData(0);
      var last = 0;
      for (var k = 0; k < bd.length; k++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        bd[k] = last * 3.5;
      }
    }
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  function wet(n, a) {
    if (!ctx || !verb) return;
    var g = ctx.createGain();
    g.gain.value = a;
    n.connect(g);
    g.connect(verb);
  }

  function panNode(p) {
    if (!ctx) return null;
    var n = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (n) n.pan.value = p;
    return n;
  }

  function out(node, p) {
    if (!ctx || !master) return;
    var n = panNode(p);
    if (n) {
      node.connect(n);
      n.connect(master);
    } else {
      node.connect(master);
    }
  }

  function crackle(amp, t, freq, p) {
    if (!ctx || !noise) return;
    t = t || ctx.currentTime;
    var s = ctx.createBufferSource();
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    s.buffer = noise;
    s.playbackRate.value = 0.8 + Math.random() * 0.8;
    f.type = 'bandpass';
    f.frequency.value = freq || 700 + Math.pow(Math.random(), 1.6) * 5500;
    f.Q.value = 1.5 + Math.random() * 4;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.006 + Math.random() * 0.02);
    s.connect(f);
    f.connect(g);
    out(g, p == null ? Math.random() * 1.2 - 0.6 : p);
    s.start(t, Math.random() * 1.5, 0.08);
  }

  function lick(amp, p) {
    if (!ctx || !noise) return;
    var t = ctx.currentTime;
    var s = ctx.createBufferSource();
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    s.buffer = noise;
    f.type = 'bandpass';
    f.frequency.value = 350 + Math.random() * 600;
    f.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    s.connect(f);
    f.connect(g);
    out(g, p);
    wet(g, 0.15);
    s.start(t, Math.random() * 1.5, 0.4);
  }

  function whuff(p) {
    if (!ctx || !brown) return;
    var t = ctx.currentTime;
    var s = ctx.createBufferSource();
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    s.buffer = brown;
    f.type = 'lowpass';
    f.frequency.value = 420;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    s.connect(f);
    f.connect(g);
    out(g, p || 0);
    s.start(t, Math.random() * 3, 0.45);
  }

  function flameEvent(o, drop) {
    if (!ambOn || !ctx) return;
    var p = Math.max(-0.8, Math.min(0.8, (o.x - 50) / 50 * 0.8));
    lick(0.015 + drop * 0.09, p);
    if (drop > 0.3) whuff(p);
    if (Math.random() < 0.5) crackle(0.01 + drop * 0.05, 0, 0, p);
  }

  function crackleLoop() {
    if (!ambOn) return;
    var cluster = Math.random() < 0.2 ? 3 + ((Math.random() * 4) | 0) : 1;
    for (var n = 0; n < cluster; n++) {
      setTimeout(function () {
        if (ambOn) crackle(0.006 + Math.pow(Math.random(), 3) * 0.07);
      }, n * (10 + Math.random() * 30));
    }
    ambT = setTimeout(crackleLoop, 90 + Math.random() * 1000);
  }

  function startAmb() {
    if (ambOn || !audio()) return;
    ambOn = true;
    var t = ctx.currentTime;
    ambG = ctx.createGain();
    ambG.gain.setValueAtTime(0.0001, t);
    ambG.gain.linearRampToValueAtTime(0.04, t + 1.2);
    ambG.connect(master);

    modA = ctx.createGain();
    modB = ctx.createGain();
    modA.connect(ambG);
    modB.connect(ambG);

    var a = ctx.createBufferSource();
    var fa = ctx.createBiquadFilter();
    var ga = ctx.createGain();
    a.buffer = brown;
    a.loop = true;
    fa.type = 'lowpass';
    fa.frequency.value = 450;
    ga.gain.value = 0.9;
    a.connect(fa);
    fa.connect(ga);
    ga.connect(modA);

    var b = ctx.createBufferSource();
    var fb = ctx.createBiquadFilter();
    var gb = ctx.createGain();
    b.buffer = noise;
    b.loop = true;
    fb.type = 'bandpass';
    fb.frequency.value = 950;
    fb.Q.value = 0.6;
    gb.gain.value = 0.22;
    b.connect(fb);
    fb.connect(gb);
    gb.connect(modB);

    a.start();
    b.start();
    ambSrcs = [a, b];
    crackle(0.05, t + 0.05, 1600, 0);
    crackleLoop();
  }

  function stopAmb(sec) {
    ambOn = false;
    clearTimeout(ambT);
    if (!ambG || !ctx) return;
    var t = ctx.currentTime;
    var d = sec || 0.05;
    ambG.gain.cancelScheduledValues(t);
    ambG.gain.setValueAtTime(Math.max(0.0001, ambG.gain.value), t);
    ambG.gain.linearRampToValueAtTime(0.0001, t + d);
    var toStop = ambSrcs.slice();
    setTimeout(function () {
      toStop.forEach(function (x) {
        try { x.stop(); } catch (e) {}
      });
    }, (d + 0.06) * 1000);
    ambG = modA = modB = null;
    ambSrcs = [];
  }

  function thump(delay) {
    if (!ctx || !master || !noise) return;
    var t = ctx.currentTime + delay;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    crackle(0.14, Math.max(ctx.currentTime + 0.01, t - 0.12), 900, 0);
    o.type = 'sine';
    o.frequency.setValueAtTime(85, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.9, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    o.connect(g);
    g.connect(master);
    wet(g, 0.35);
    o.start(t);
    o.stop(t + 1.8);

    var s = ctx.createBufferSource();
    var f = ctx.createBiquadFilter();
    var n = ctx.createGain();
    s.buffer = noise;
    f.type = 'lowpass';
    f.frequency.value = 280;
    n.gain.setValueAtTime(0.0001, t);
    n.gain.linearRampToValueAtTime(0.55, t + 0.008);
    n.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    s.connect(f);
    f.connect(n);
    n.connect(master);
    wet(n, 0.4);
    s.start(t, 0, 0.6);
  }

  function bright(delay) {
    if (!ctx || !master || !noise) return;
    var t = ctx.currentTime + delay;
    var peak = 1.7;
    var lp = ctx.createBiquadFilter();
    var pg = ctx.createGain();
    var mix = ctx.createGain();
    lp.type = 'lowpass';
    lp.Q.value = 0.7;
    mix.gain.value = 0.25;
    lp.frequency.setValueAtTime(180, t);
    lp.frequency.exponentialRampToValueAtTime(2200, t + peak);
    lp.frequency.exponentialRampToValueAtTime(500, t + 3.8);
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.linearRampToValueAtTime(0.09, t + peak);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 4);
    mix.connect(lp);
    lp.connect(pg);
    pg.connect(master);
    wet(pg, 0.55);

    [73.42, 73.9, 110, 110.5, 146.83].forEach(function (fq) {
      var o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = fq;
      o.detune.value = (Math.random() - 0.5) * 12;
      o.connect(mix);
      o.start(t);
      o.stop(t + 4.1);
    });

    var sub = ctx.createOscillator();
    var sg = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 36.7;
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.linearRampToValueAtTime(0.3, t + peak);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
    sub.connect(sg);
    sg.connect(master);
    sub.start(t);
    sub.stop(t + 3.7);

    var s = ctx.createBufferSource();
    var bp = ctx.createBiquadFilter();
    var ag = ctx.createGain();
    s.buffer = noise;
    s.loop = true;
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(400, t);
    bp.frequency.exponentialRampToValueAtTime(3500, t + peak);
    ag.gain.setValueAtTime(0.0001, t);
    ag.gain.linearRampToValueAtTime(0.06, t + peak);
    ag.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    s.connect(bp);
    bp.connect(ag);
    ag.connect(master);
    wet(ag, 0.4);
    s.start(t);
    s.stop(t + 3.5);

    var o = ctx.createOscillator();
    var g = ctx.createGain();
    var at = t + peak;
    o.type = 'sine';
    o.frequency.setValueAtTime(60, at);
    o.frequency.exponentialRampToValueAtTime(32, at + 0.9);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(0.45, at + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
    o.connect(g);
    g.connect(master);
    wet(g, 0.5);
    o.start(at);
    o.stop(at + 1.7);
  }

  function playEnter() {
    if (soundPref === 'off' || !audio()) return;
    ambOn = false;
    clearTimeout(ambT);
    thump(reduce ? 0.08 : 0.15);
    bright(reduce ? 0.12 : 0.25);
  }

  function setSound(on) {
    soundPref = on ? 'on' : 'off';
    if (soundBtn) {
      soundBtn.setAttribute('aria-pressed', String(on));
      soundBtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      soundBtn.textContent = '\u266a ' + (on ? 'Sound on' : 'Sound off');
    }
    if (on) startAmb();
    else stopAmb(0.3);
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      setSound(soundPref !== 'on');
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) {
      try { ctx.suspend(); } catch (e) {}
    } else if (soundPref !== 'off') {
      try { ctx.resume(); } catch (e) {}
    }
  });

  function flick(o, now) {
    if (now > o.n) {
      var prev = o.v;
      o.t = 0.72 + Math.random() * 0.28;
      if (Math.random() < 0.05) o.t = 0.45 + Math.random() * 0.15;
      o.n = now + 45 + Math.random() * 140;
      if (prev - o.t > 0.14 && ambOn) flameEvent(o, prev - o.t);
    }
    o.v += (o.t - o.v) * 0.22;
    return o.v;
  }

  function tick(now) {
    var sum = 0;
    lamps.forEach(function (o, i) {
      var v = flick(o, now) * (0.94 + 0.06 * Math.sin(now / (900 + i * 370)));
      o.g.style.opacity = v.toFixed(3);
      o.g.style.transform = 'translate(-50%,-50%) scale(' + (0.9 + 0.1 * v).toFixed(3) + ')';
      o.b.style.opacity = (0.55 + 0.45 * v).toFixed(3);
      o.b.style.transform = 'translate(-50%,-50%) scale(' + (0.85 + 0.15 * v).toFixed(3) + ')';
      sum += v;
    });
    if (lamps.length && wash) {
      var avg = sum / lamps.length;
      wash.style.opacity = (0.25 + 0.35 * avg).toFixed(3);
      if (modA && modB && ctx) {
        var m = Math.max(0.25, 0.3 + 1.3 * (avg - 0.4));
        modA.gain.setTargetAtTime(m, ctx.currentTime, 0.04);
        modB.gain.setTargetAtTime(Math.max(0.05, m * m), ctx.currentTime, 0.03);
      }
    }
    raf = requestAnimationFrame(tick);
  }

  if (reduce) {
    lamps.forEach(function (o) {
      o.g.style.opacity = 0.9;
      o.b.style.opacity = 0.95;
    });
  } else {
    raf = requestAnimationFrame(tick);
  }

  var calibrating = /[?&#]calibrate/.test(location.href);
  var onCalKey = null;
  if (calibrating && frame) {
    intro.classList.add('is-calibrating');
    var panel = document.createElement('div');
    var pts = [];
    var dots = [];
    panel.className = 'qu-cal';
    intro.appendChild(panel);

    function outCal() {
      var t = pts.length < 2
        ? (pts.length ? 'Now click the door\u2019s BOTTOM-RIGHT corner.' : 'Click the door\u2019s TOP-LEFT corner.')
        : 'Now click each lamp bulb. Backspace undoes the last click.';
      var s = '<b>' + t + '</b><br>';
      if (pts.length >= 2) {
        var a = pts[0], b = pts[1];
        s += 'data-door="' + ((a[0] + b[0]) / 2).toFixed(1) + ',' + ((a[1] + b[1]) / 2).toFixed(1) + ',' + Math.abs(b[0] - a[0]).toFixed(1) + ',' + Math.abs(b[1] - a[1]).toFixed(1) + '"<br>';
        s += 'data-lamps="' + pts.slice(2).map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1) + ',18,2.2'; }).join(';') + '"';
      }
      panel.innerHTML = s;
    }

    frame.addEventListener('click', function (e) {
      var r = frame.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * 100;
      var y = (e.clientY - r.top) / r.height * 100;
      pts.push([x, y]);
      var d = document.createElement('div');
      d.className = 'qu-dot';
      d.style.left = x + '%';
      d.style.top = y + '%';
      frame.appendChild(d);
      dots.push(d);
      outCal();
    });

    onCalKey = function (e) {
      if (e.key === 'Backspace' && pts.length) {
        pts.pop();
        var lastDot = dots.pop();
        if (lastDot) lastDot.remove();
        outCal();
      }
    };
    document.addEventListener('keydown', onCalKey);
    outCal();
  }

  var motes = intro.querySelector('.qu-motes');
  if (!reduce && motes) {
    for (var i = 0; i < 26; i++) {
      var m = document.createElement('span');
      var st = m.style;
      st.left = (18 + Math.random() * 64) + '%';
      st.setProperty('--s', (1.5 + Math.random() * 2.5).toFixed(1) + 'px');
      st.setProperty('--d', (14 + Math.random() * 16).toFixed(1) + 's');
      st.setProperty('--dl', (-Math.random() * 20).toFixed(1) + 's');
      st.setProperty('--x', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
      st.setProperty('--o', (0.25 + Math.random() * 0.55).toFixed(2));
      motes.appendChild(m);
    }
  }

  function finish() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', layout);
    if (ctx) {
      try { ctx.close(); } catch (e) {}
      ctx = null;
    }
    inerted.forEach(function (el) { el.inert = false; });
    root.classList.remove('qu-intro-on', 'qu-intro-ivory');
    intro.remove();
    document.removeEventListener('keydown', onKey);
    if (onCalKey) document.removeEventListener('keydown', onCalKey);
    if (prevFocus && prevFocus.focus) {
      try { prevFocus.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  function enter() {
    if (leaving) return;
    leaving = true;
    intro.classList.add('is-leaving');
    playEnter();
    var tOpen = reduce ? 250 : 350;
    var tDone = reduce ? 950 : 2100;
    var tEnd = tDone + (reduce ? 600 : 1050);
    setTimeout(function () { intro.classList.add('is-opening'); }, tOpen);
    setTimeout(function () { intro.classList.add('is-done'); }, tDone);
    setTimeout(finish, tEnd);
  }

  function skip() {
    if (leaving) return;
    leaving = true;
    intro.classList.add('is-skipping', 'is-done');
    if (ctx) stopAmb(0.15);
    setTimeout(finish, reduce ? 550 : 650);
  }

  function onKey(e) {
    if (calibrating) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      skip();
    } else if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === enterBtn) {
        e.preventDefault();
        if (skipBtn) skipBtn.focus();
      } else if (!e.shiftKey && document.activeElement === skipBtn) {
        e.preventDefault();
        if (enterBtn) enterBtn.focus();
      }
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', enter);
  if (skipBtn) skipBtn.addEventListener('click', skip);
  document.addEventListener('keydown', onKey);
})();
