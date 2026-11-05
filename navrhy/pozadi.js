/* Rozcestník návrhů: tekuté pozadí jako na redeye.red a šetrné živé náhledy. Hlavní je plynulost.
 * Náhledy sdílí vlákno se stránkou, proto běží jen ty na obrazovce: načtou se po zastavení scrollu, po jednom,
 * a mimo obrazovku se vypnou. Pozadí při scrollu nekreslí, ve skryté záložce taky ne, na slabém zařízení si samo
 * sníží rozlišení a nakonec zůstane stát. Bez WebGL nebo při omezení animací zůstane klidný přechod z html::before. */
(function () {
  var scrollUntil = 0;
  function markScroll() { scrollUntil = performance.now() + 160; }
  window.addEventListener('scroll', markScroll, { passive: true });
  window.addEventListener('touchmove', markScroll, { passive: true });

  (function nahledy() {
    if (!('IntersectionObserver' in window)) return;
    var LOAD_TIMEOUT_MS = 2500;
    var queue = [], busy = null, busyTimer = 0;
    function finish() { clearTimeout(busyTimer); busy = null; pump(); }
    function pump() {
      if (busy || !queue.length) return;
      if (performance.now() < scrollUntil) { setTimeout(pump, 120); return; }
      var f = queue.shift();
      if (!f.nahledVisible || f.nahledOn) { pump(); return; }
      busy = f;
      f.nahledOn = true;
      busyTimer = setTimeout(finish, LOAD_TIMEOUT_MS);
      f.contentWindow.location.replace(f.nahledUrl);
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var f = entry.target.querySelector('iframe');
        if (!f) return;
        f.nahledVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!f.nahledOn && queue.indexOf(f) < 0) { queue.push(f); pump(); }
        } else if (f.nahledOn) {
          f.nahledOn = false;
          if (busy === f) finish();
          f.contentWindow.location.replace('about:blank');
        }
      });
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll('.desk iframe, .phone iframe').forEach(function (f) {
      var src = f.getAttribute('src');
      if (!src) return;
      f.nahledUrl = new URL(src, location.href).href;
      f.removeAttribute('src');
      f.removeAttribute('loading');
      f.addEventListener('load', function () { if (busy === f) finish(); });
      seen.observe(f.parentElement);
    });
  })();

  (function tekutina() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;z-index:-1;display:block;width:100%;height:100%;pointer-events:none';
    var gl = null;
    try { gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' }); } catch (e) { gl = null; }
    if (!gl) return;
    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision mediump float;',
      'uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;uniform float k0;uniform vec2 kp;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      'return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<3;k++){v+=a*n(p);p*=2.03;a*=.5;}return v/.875;}',
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 asp=vec2(r.x/r.y,1.)*1.6;vec2 p=uv*asp;',
      'vec2 q=vec2(fbm(p+t*.05),fbm(p+vec2(5.2,1.3)-t*.04));',
      'vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*.03),fbm(p+3.*q+vec2(8.3,2.8)));',
      'float f=fbm(p+2.5*w);',
      'float d=length(p-m*asp);f+=.35*exp(-d*d*3.);',
      'float dc=length(p-kp*asp);f+=k0*.7*exp(-pow((dc-(1.-k0)*2.2)*5.,2.));',
      'vec3 a=vec3(.42,.17,1.),b=vec3(1.,.24,.5),c=vec3(.78,1.,.24),e=vec3(.03,.03,.05);',
      'float k=fract(s*.00025);vec3 col=mix(a,b,smoothstep(.2,.8,q.x+k));col=mix(col,c,smoothstep(.55,.95,w.y-k*.5)*.6);',
      'col=mix(e,col,smoothstep(.35,.95,f));gl_FragColor=vec4(col,1.);}',
    ].join('\n');
    function shader(type, src) {
      var o = gl.createShader(type);
      gl.shaderSource(o, src);
      gl.compileShader(o);
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
    }
    var vs = shader(gl.VERTEX_SHADER, VS), fs = shader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['r', 't', 'm', 's', 'k0', 'kp'].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });

    var touch = window.matchMedia('(hover: none)').matches;
    var SCALES = [0.35, 0.25, 0.18];
    var FRAME_MS = 33, SLOW_MS = 40, WINDOW = 40, SLOW_LIMIT = 12, GRACE_MS = 2500;
    var EASE = touch ? 0.05 : 0.09, FADE = touch ? 0.012 : 0.022;
    var level = touch ? 1 : 0, frozen = false, sizedW = 0, sizedH = 0;
    var mx = 0.7, my = 0.6, tx = 0.7, ty = 0.6, pulse = 0, kx = 0.5, ky = 0.5;
    var last = 0, prev = 0, samples = 0, slow = 0, now = 0;

    function size() {
      sizedW = innerWidth; sizedH = innerHeight;
      cv.width = Math.max(1, Math.round(sizedW * SCALES[level]));
      cv.height = Math.max(1, Math.round(sizedH * SCALES[level]));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function draw() {
      mx += (tx - mx) * EASE; my += (ty - my) * EASE;
      pulse = Math.max(0, pulse - FADE);
      gl.uniform2f(U.r, cv.width, cv.height);
      gl.uniform1f(U.t, now / 1000);
      gl.uniform2f(U.m, mx, my);
      gl.uniform1f(U.s, window.scrollY);
      gl.uniform1f(U.k0, pulse);
      gl.uniform2f(U.kp, kx, ky);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    size();
    // Lišta prohlížeče na mobilu mění výšku při scrollu: plátno se jen roztáhne, přepočítá se až při větší změně.
    window.addEventListener('resize', function () {
      if (innerWidth === sizedW && Math.abs(innerHeight - sizedH) < 160) return;
      size();
      if (frozen) draw();
    });
    window.addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button, input, select, textarea, summary, label')) return;
      pulse = 1; kx = e.clientX / innerWidth; ky = 1 - e.clientY / innerHeight;
    });
    document.body.insertBefore(cv, document.body.firstChild);

    function watchSpeed(t) {
      var gap = t - prev;
      prev = t;
      if (t < GRACE_MS || gap > 500) return;
      samples++;
      if (gap > SLOW_MS) slow++;
      if (samples < WINDOW) return;
      var tooSlow = slow > SLOW_LIMIT;
      samples = 0; slow = 0;
      if (!tooSlow) return;
      if (level < SCALES.length - 1) { level++; size(); } else { frozen = true; }
    }
    function frame(t) {
      if (frozen) return;
      requestAnimationFrame(frame);
      if (document.hidden) { prev = t; return; }
      if (t < scrollUntil) { prev = t; return; }
      watchSpeed(t);
      if (t - last < FRAME_MS) return;
      last = t;
      now = t;
      draw();
    }
    now = performance.now();
    draw();
    requestAnimationFrame(frame);
  })();
})();
