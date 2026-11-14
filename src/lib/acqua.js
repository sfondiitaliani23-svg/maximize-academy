// Sfondo «acqua» dell'accesso (14/11/2026): superficie liquida scura con celle che si muovono
// e riflessi d'oro sui bordi. Spunto: «Liquid Fractal Cells» (Pinterest / Adobe Stock), rifatto da zero:
// shader nostro (gocce morbide su due scale, piegate da un'onda lenta, con luce e riflessi), nessun file o codice di altri.
// Leggero: disegna a risoluzione ridotta, si ferma quando la pagina non si vede, fermo con il movimento ridotto.
// Senza WebGL resta lo sfondo di schegge (CSS).
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;
uniform vec2 r;uniform float t;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
// distanza «morbida» dal centro della cella più vicina: le celle diventano gocce tonde, non spigoli
float goccia(vec2 p,float tt){vec2 i=floor(p),f=fract(p);float s=0.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=h2(i+g);
  o=.5+.4*sin(tt+6.2831*o);float d=length(g+o-f);s+=exp(-7.*d);}
 return -log(s)/7.;}
float altezza(vec2 p){
 p+=.22*vec2(sin(p.y*1.3+t*.35),sin(p.x*1.1-t*.3));
 return goccia(p*2.6,t*.4)+.45*goccia(p*5.4+vec2(3.1,1.7),t*.55);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
 float e=.004;
 float h=altezza(uv);
 vec3 n=normalize(vec3(altezza(uv+vec2(e,0.))-h,altezza(uv+vec2(0.,e))-h,e*3.2));
 vec3 L=normalize(vec3(-.4,.55,.75));
 float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),14.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.5,-.3,.8)),n),vec3(0.,0.,1.)),0.),22.);
 vec3 oro=vec3(.78,.64,.40);
 vec3 c=vec3(.012,.011,.01)+oro*spec*.95+vec3(1.,.92,.74)*pow(spec,3.)*.6+oro*spec2*.35;
 float v=smoothstep(1.2,.2,length((gl_FragCoord.xy/r)-.5)*1.5);
 gl_FragColor=vec4(c*v,1.);
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
  const uR = gl.getUniformLocation(pr, 'r');
  const uT = gl.getUniformLocation(pr, 't');
  const fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCALA = 0.6; // risoluzione ridotta: il liquido è morbido, non serve di più
  let id = 0;
  const t0 = performance.now();
  const misura = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALA));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALA));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(uR, w, h);
  };
  const disegna = (ms) => { misura(); gl.uniform1f(uT, ((ms - t0) / 1000) * 0.6 + 12); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  const giro = (ms) => { disegna(ms); id = requestAnimationFrame(giro); };
  const avvia = () => { cancelAnimationFrame(id); if (fermo || document.hidden) { disegna(performance.now()); return; } id = requestAnimationFrame(giro); };
  canvas.classList.add('is-on');
  avvia();
  addEventListener('resize', avvia);
  document.addEventListener('visibilitychange', avvia);
  return () => { cancelAnimationFrame(id); removeEventListener('resize', avvia); document.removeEventListener('visibilitychange', avvia); };
}
