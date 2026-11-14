// Sfondo «acqua» dell'accesso (14/11/2026): superficie liquida scura con celle che si muovono
// e riflessi d'oro sui bordi. Spunto: «Liquid Fractal Cells» (Pinterest / Adobe Stock), rifatto da zero:
// shader nostro (gocce morbide su due scale, piegate da un'onda lenta, con luce e riflessi), nessun file o codice di altri.
// Leggero: disegna a risoluzione ridotta, si ferma quando la pagina non si vede, fermo con il movimento ridotto.
// Senza WebGL resta lo sfondo di schegge (CSS).
// 14/11/2026 sera: al passaggio del cursore (o del dito) l'acqua si increspa in anelli che si allargano
// e una luce d'oro morbida illumina la superficie lì sotto (spunto: «Hover Water Animation», @code_x_sg).
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;
uniform vec2 r;uniform float t;uniform float ts;uniform vec2 m;uniform float mi;uniform vec3 g[10];
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
float goccia(vec2 p,float tt){vec2 i=floor(p),f=fract(p);float s=0.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 gg=vec2(float(x),float(y));vec2 o=h2(i+gg);
  o=.5+.4*sin(tt+6.2831*o);float d=length(gg+o-f);s+=exp(-7.*d);}
 return -log(s)/7.;}
float onde(vec2 p){float w=0.;
 for(int k=0;k<10;k++){float age=ts-g[k].z;if(age<0.||age>3.)continue;
  float d=length(p-g[k].xy);w+=sin(34.*d-11.*age)*exp(-5.*d)*exp(-1.6*age)*smoothstep(0.,.15,age)*.05;}
 return w;}
float altezza(vec2 p){
 p+=.22*vec2(sin(p.y*1.3+t*.35),sin(p.x*1.1-t*.3));
 return goccia(p*2.6,t*.4)+.45*goccia(p*5.4+vec2(3.1,1.7),t*.55);}
float tutto(vec2 p){return altezza(p)+onde(p);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
 float e=.004;
 float h=tutto(uv);
 vec3 n=normalize(vec3(tutto(uv+vec2(e,0.))-h,tutto(uv+vec2(0.,e))-h,e*3.2));
 vec3 V=vec3(0.,0.,1.);
 vec3 L=normalize(vec3(-.4,.55,.75));
 float spec=pow(max(dot(reflect(-L,n),V),0.),14.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.5,-.3,.8)),n),V),0.),22.);
 // luce del cursore: una lampada d'oro poco sopra l'acqua
 vec2 dm=m-uv;float dist=length(dm);
 vec3 Lm=normalize(vec3(dm,.28));
 float specM=pow(max(dot(reflect(-Lm,n),V),0.),18.)*exp(-dist*2.2)*mi;
 float alone=exp(-dist*dist*7.)*mi;
 vec3 oro=vec3(.78,.64,.40);
 vec3 c=vec3(.012,.011,.01)+oro*spec*.95+vec3(1.,.92,.74)*pow(spec,3.)*.6+oro*spec2*.35;
 c+=oro*specM*1.8+vec3(1.,.93,.78)*pow(specM,2.)*1.+oro*alone*.16;
 float v=smoothstep(1.2,.2,length((gl_FragCoord.xy/r)-.5)*1.5);
 gl_FragColor=vec4(c*max(v,alone),1.);
}`;

export function avviaAcqua(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return () => {};
  const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return () => {};
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const t0 = performance.now();
  const uR = gl.getUniformLocation(pr, 'r');
  const uT = gl.getUniformLocation(pr, 't');
  const uTs = gl.getUniformLocation(pr, 'ts');
  const uM = gl.getUniformLocation(pr, 'm');
  const uMi = gl.getUniformLocation(pr, 'mi');
  const uG = gl.getUniformLocation(pr, 'g');
  // Cursore: posizione nello spazio dello shader, intensità che sale e scende piano, scia di 10 anelli.
  const scia = new Float32Array(30).fill(-99);
  let nScia = 0;
  let mx = 0; let my = 0; let mT = 0; let mOn = 0; let ultimo = { x: 9, y: 9, t: 0 };
  const inUv = (cx, cy) => {
    const h = canvas.clientHeight || 1; const w = canvas.clientWidth || 1;
    return [(cx - w / 2) / h, (h / 2 - cy) / h];
  };
  const muovi = (e) => {
    const [x, y] = inUv(e.clientX, e.clientY);
    mx = x; my = y; mT = 1;
    const ora = (performance.now() - t0) / 1000;
    if (Math.hypot(x - ultimo.x, y - ultimo.y) > 0.06 || ora - ultimo.t > 0.35) {
      scia[nScia * 3] = x; scia[nScia * 3 + 1] = y; scia[nScia * 3 + 2] = ora;
      nScia = (nScia + 1) % 10; ultimo = { x, y, t: ora };
    }
    if (fermo) { mOn = 1; requestAnimationFrame(disegna); }
  };
  const esce = () => { mT = 0; };
  addEventListener('pointermove', muovi, { passive: true });
  addEventListener('pointerdown', muovi, { passive: true });
  document.documentElement.addEventListener('pointerleave', esce);
  const fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCALA = 0.6; // risoluzione ridotta: il liquido è morbido, non serve di più
  let id = 0;
  const misura = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALA));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALA));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(uR, w, h);
  };
  const disegna = (ms) => {
    misura();
    const sec = (ms - t0) / 1000;
    const dt = Math.min(0.1, Math.max(0, sec - (disegna.prima ?? sec)));
    disegna.prima = sec;
    mOn += (mT - mOn) * Math.min(1, dt * 4);
    gl.uniform1f(uT, sec * 0.6 + 12);
    gl.uniform1f(uTs, sec);
    gl.uniform2f(uM, mx, my);
    gl.uniform1f(uMi, mOn);
    gl.uniform3fv(uG, scia);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const giro = (ms) => { disegna(ms); id = requestAnimationFrame(giro); };
  const avvia = () => { cancelAnimationFrame(id); if (fermo || document.hidden) { disegna(performance.now()); return; } id = requestAnimationFrame(giro); };
  canvas.classList.add('is-on');
  avvia();
  addEventListener('resize', avvia);
  document.addEventListener('visibilitychange', avvia);
  return () => {
    cancelAnimationFrame(id); removeEventListener('resize', avvia); document.removeEventListener('visibilitychange', avvia);
    removeEventListener('pointermove', muovi); removeEventListener('pointerdown', muovi); document.documentElement.removeEventListener('pointerleave', esce);
  };
}
