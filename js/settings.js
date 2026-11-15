/* Mufa Terra — Phase 5: pengaturan, aksesibilitas, grafis, audio, tutorial, uji sistem */
const SK='mufa-terra-settings';
let cfg={gfx:matchMedia('(pointer:coarse)').matches?0:1,ts:1,hc:0,rfx:0,cam:1,snd:1,vol:.5,fps:0,tut:0},tres=null,fpsV=60;
try{const s=JSON.parse(localStorage.getItem(SK));if(s&&typeof s==='object')for(const k in cfg)if(typeof s[k]==='number'&&isFinite(s[k]))cfg[k]=s[k]}catch(e){}
if(![0,1,2].includes(cfg.gfx))cfg.gfx=1;cfg.ts=Math.min(1.3,Math.max(1,cfg.ts));cfg.cam=Math.min(2,Math.max(.5,cfg.cam));cfg.vol=Math.min(1,Math.max(0,cfg.vol));
const saveCfg=()=>{try{localStorage.setItem(SK,JSON.stringify(cfg))}catch(e){}},GN=['Rendah','Sedang','Tinggi'];
document.head.insertAdjacentHTML('beforeend',`<style>.pill{font-size:calc(13px*var(--ts,1))}#panel{font-size:calc(14px*var(--ts,1))}#panel .sm{font-size:calc(12px*var(--ts,1))}#panel button{font-size:calc(13px*var(--ts,1))}
body.hc .pill,body.hc #panel{background:#000;border:2px solid #fff;color:#fff}body.hc button{background:#ffe066;color:#000}body.hc .fb.ok{background:#14532d}body.hc .fb.no{background:#7c2d12}body.hc #prompt{background:#14532d}
#tut{position:fixed;left:50%;bottom:130px;transform:translateX(-50%);width:min(440px,92vw);display:none;border-color:var(--e)}#fps{position:fixed;right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);display:none}
button:focus-visible{outline:3px solid #fff}@media (pointer:coarse){#tut{bottom:215px}}</style>`);
const fp=document.createElement('div');fp.id='fps';fp.className='pill';document.body.appendChild(fp);
function applyCfg(){const g=cfg.gfx,dpr=devicePixelRatio||1,sh=g>0;
 ren.setPixelRatio(g===0?1:g===1?Math.min(dpr,1.5):Math.min(dpr,2));
 if(ren.shadowMap.enabled!==sh){ren.shadowMap.enabled=sh;sc.traverse(o=>{if(o.material)o.material.needsUpdate=true})}
 sun.castShadow=sh;sun.shadow.mapSize.set(g===2?1024:512,g===2?1024:512);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}
 sc.fog.far=[55,75,95][g];cam.far=[60,85,110][g];cam.updateProjectionMatrix();
 document.documentElement.style.setProperty('--ts',cfg.ts);document.body.classList.toggle('hc',!!cfg.hc);
 window.rfx=!!cfg.rfx;window.camS=cfg.cam;rs();fp.style.display=cfg.fps?'block':'none'}
/* ===== Audio (Web Audio API, tanpa file) ===== */
let AX=null;
const ensureAX=()=>{if(!AX){try{AX=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AX&&AX.state==='suspended')AX.resume()};
['pointerdown','keydown'].forEach(v=>addEventListener(v,ensureAX));
function sfx(f,d=.12,type='sine',f2){if(!cfg.snd||cfg.vol<=0||!AX||AX.state!=='running')return;const o=AX.createOscillator(),g=AX.createGain(),t=AX.currentTime;
 o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(cfg.vol*.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AX.destination);o.start(t);o.stop(t+d)}
let s0={ok,tot,n:inv.length,coins,l:lv()};
setInterval(()=>{if(ok>s0.ok)sfx(660,.15,'triangle',880);else if(tot>s0.tot)sfx(220,.2,'sawtooth',160);
 if(inv.length>s0.n)sfx(440,.08,'square');if(coins>s0.coins)sfx(880,.1,'sine',1100);if(lv()>s0.l)sfx(523,.3,'triangle',1047);
 s0={ok,tot,n:inv.length,coins,l:lv()}},100);
/* ===== FPS & grafis adaptif ===== */
let fc=0,ft=performance.now(),low=0;
(function f(){requestAnimationFrame(f);fc++;const n=performance.now();if(n-ft>4500){fc=0;ft=n;return}
 if(n-ft>=2000){fpsV=Math.round(fc*1000/(n-ft));fc=0;ft=n;fp.textContent=fpsV+' FPS';
  if(fpsV<24&&cfg.gfx>0){if(++low>=2){cfg.gfx--;saveCfg();applyCfg();toast('FPS rendah — grafis diturunkan ke '+GN[cfg.gfx]);low=0}}else low=0}})();
/* ===== Tutorial 6 langkah ===== */
const TS=[['Bergerak dan kamera','Gerakkan karakter dengan WASD (atau joystick) dan putar kamera dengan menyeret mouse atau layar.'],['Dekati objek','Berjalan ke sampah yang naik-turun di tanah sampai muncul tulisan interaksi.'],['Ambil sampah','Tekan E (atau tombol E) untuk mengambil sampah ke tas.'],['Buka inventaris','Tekan I (atau tombol Tas) untuk melihat nama, kualitas, dan penjelasan material.'],['Pilah material','Bawa sampah ke Pusat Pemilahan (menara biru), tekan E, lalu pilih kategori yang benar.'],['Kirim ke fasilitas','Buka Compost Center, Workshop Kertas, atau Gudang Distribusi untuk melanjutkan perjalanan material.']];
let ti=cfg.tut||ok>0?6:0,tmoved=0,tlast=null,tyaw=yaw,tinv=inv.length,tok=ok;
const tt=document.createElement('div');tt.id='tut';tt.className='pill';document.body.appendChild(tt);
function tutRender(){if(ti>=6){tt.style.display='none';return}tt.style.display='block';
 tt.innerHTML=`<b>Tutorial ${ti+1}/6 — ${TS[ti][0]}</b><br>${TS[ti][1]} <button id=tsk>Lewati</button>`;
 $('tsk').onclick=()=>{ti=6;cfg.tut=1;saveCfg();tutRender()}}
function tutStart(){ti=0;tmoved=0;tlast=null;tyaw=yaw;tinv=inv.length;tok=ok;cfg.tut=0;saveCfg();tutRender()}
setInterval(()=>{if(ti>=6)return;const p=P.position;if(tlast)tmoved+=Math.hypot(p.x-tlast.x,p.z-tlast.z);tlast={x:p.x,z:p.z};let d=false;
 if(ti===0)d=tmoved>5&&Math.abs(yaw-tyaw)>.3;
 else if(ti===1){const n=near();d=!!n&&n.k==='item'}
 else if(ti===2)d=inv.length>tinv;
 else if(ti===3)d=ui==='inv';
 else if(ti===4)d=ok>tok;
 else d=['compost','paper','ware'].includes(ui);
 if(d){ti++;tinv=inv.length;tok=ok;toast('Langkah tutorial selesai ✓');if(ti>=6){cfg.tut=1;saveCfg()}tutRender()}},300);
/* ===== Panel pengaturan ===== */
function setH(fb){const o=(k,v,l)=>`<button data-st="${k}:${v}">${cfg[k]===v?'▶ ':''}${l}</button>`,r=(n,b)=>`<div class=row><b>${n}</b><div class=cats>${b}</div></div>`;
 let h='<h2>Pengaturan</h2>'+fb+
 r('Grafis',o('gfx',0,'Rendah')+o('gfx',1,'Sedang')+o('gfx',2,'Tinggi'))+r('Ukuran teks',o('ts',1,'100%')+o('ts',1.15,'115%')+o('ts',1.3,'130%'))+
 r('Kontras tinggi',o('hc',0,'Mati')+o('hc',1,'Aktif'))+r('Kurangi efek visual',o('rfx',0,'Mati')+o('rfx',1,'Aktif'))+
 r('Sensitivitas kamera',o('cam',.5,'Rendah')+o('cam',1,'Normal')+o('cam',1.5,'Tinggi')+o('cam',2,'Sangat tinggi'))+
 r('Suara',o('snd',0,'Mati')+o('snd',1,'Aktif'))+r('Volume',o('vol',.25,'25%')+o('vol',.5,'50%')+o('vol',.75,'75%')+o('vol',1,'100%'))+
 r('Tampilkan FPS',o('fps',0,'Mati')+o('fps',1,'Aktif'))+
 '<div class=row><button data-st="tut:0">Ulangi tutorial</button><button data-st="test:0">Uji sistem</button></div>';
 if(tres)h+='<h3>Hasil uji</h3>'+tres.map(([n,k])=>`<div class=row><span>${k?'✓':'✗'} ${n}</span></div>`).join('');
 return h+'<p class=sm>Semua dialog tampil sebagai teks (subtitle). Efek visual dikurangi menghentikan animasi objek. Pengaturan ulang tombol belum tersedia.</p>'}
function setAct(a){const[k,v]=a.split(':');
 if(k==='open')return open('set');
 if(k==='tut'){close();return tutStart()}
 if(k==='test')return runTests();
 cfg[k]=+v;saveCfg();applyCfg();render()}
/* ===== Uji sistem (bab 19.6) ===== */
async function runTests(){tres=[];const A=(n,f)=>{let r=false;try{r=!!f()}catch(e){}tres.push([n,r])};
 const p=P.position,px=p.x,pz=p.z;
 p.x=-40;p.z=-40;A('Objek jauh tidak bisa diinteraksikan',()=>near()===null);p.x=px;p.z=pz;
 const s1=st;st={};A('Produksi tidak jalan tanpa bahan',()=>REC.every(r=>!canMake(r)));
 add('pet',3,80);add('pet',3,60);A('Stok bertambah konsisten (6 unit, kualitas rata-rata 70)',()=>st.pet.n===6&&st.pet.q===70);st=s1;
 A('Save/load konsisten',()=>{save();const d=JSON.parse(localStorage.getItem(SAVE));return d.v===V&&d.coins===coins&&d.xp===xp&&d.inv.length===inv.length});
 A('Kamera di atas tanah',()=>cam.position.y>=.5);
 A('Panel muat di layar kecil',()=>$('panel').getBoundingClientRect().width<=innerWidth);
 const c=col[0];p.x=c.x;p.z=c.z;await new Promise(r=>setTimeout(r,250));const d=Math.hypot(p.x-c.x,p.z-c.z);p.x=px;p.z=pz;
 tres.push(['Karakter tidak menembus objek',d>=c.r+.4]);
 tres.push([`Grafis ${GN[cfg.gfx]}: ${fpsV} FPS (target ≥25)`,fpsV>=25]);render()}
applyCfg();tutRender();
