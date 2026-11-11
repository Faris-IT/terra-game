const $=i=>document.getElementById(i),rnd=(a,b)=>a+Math.random()*(b-a);
const ren=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});
ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x9fd8f0);sc.fog=new THREE.Fog(0x9fd8f0,35,95);
const cam=new THREE.PerspectiveCamera(60,1,.1,200);
sc.add(new THREE.AmbientLight(0xffffff,.65));
const sun=new THREE.DirectionalLight(0xfff2d0,.8);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});sun.shadow.mapSize.set(1024,1024);
sc.add(sun,sun.target);
const mats={},mat=c=>mats[c]||(mats[c]=new THREE.MeshLambertMaterial({color:c}));
const mesh=(g,c,x=0,y=0,z=0,p=sc)=>{const m=new THREE.Mesh(g,mat(c));m.position.set(x,y,z);p.add(m);return m};
const BX=(w,h,d)=>new THREE.BoxGeometry(w,h,d),CY=(a,b,h,s=10)=>new THREE.CylinderGeometry(a,b,h,s),SP=r=>new THREE.SphereGeometry(r,12,10);
/* ===== Dunia: Kampung Arunika (prosedural) ===== */
const gr=mesh(new THREE.PlaneGeometry(130,130),0x68ba6d);gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;
const path=mesh(new THREE.PlaneGeometry(4,60),0xe6b65c,0,.02,-6);path.rotation.x=-Math.PI/2;
const col=[];
function house(x,z,c){mesh(BX(5,3,5),c,x,1.5,z).castShadow=true;const r=mesh(new THREE.ConeGeometry(4.3,2,4),0xc4573a,x,4,z);r.rotation.y=Math.PI/4;r.castShadow=true;col.push({x,z,r:3.4})}
[[-14,-10,0xf4e3c1],[-16,6,0xf2c9a0],[12,-14,0xd8e8c2],[16,4,0xf4e3c1],[-6,-20,0xf2c9a0],[8,-24,0xd8e8c2]].forEach(h=>house(...h));
// Pusat Pemilahan
mesh(BX(8,3.5,5),0x4ca9cb,0,1.75,-14).castShadow=true;mesh(BX(8.6,.4,5.6),0x2d6f8a,0,3.7,-14);
mesh(BX(5,.9,.2),0xf4fbf6,0,2.6,-11.4);
col.push({x:-2.5,z:-14,r:3},{x:2.5,z:-14,r:3});
[[-1.8,0x68ba6d],[-.6,0x4ca9cb],[.6,0x888888],[1.8,0xf2905a]].forEach(([x,c])=>{mesh(BX(.9,.9,.9),c,x,.45,-10.6).castShadow=true});
mesh(CY(1.4,1.4,8,16),0x4ca9cb,0,4,-8.5).material=new THREE.MeshBasicMaterial({color:0x4ca9cb,transparent:true,opacity:.25});
// Fasilitas (Phase 2)
const ST=[{id:'sort',n:'Pusat Pemilahan',x:0,z:-10.5,r:4.8},{id:'compost',n:'Compost Center',x:-9,z:-1,r:4.8},{id:'paper',n:'Workshop Kertas & Kreatif',x:6,z:-6,r:4.8},{id:'ware',n:'Gudang Distribusi',x:-4,z:6,r:4.8}];
function label(t,x,y,z,w=4.5){const c=document.createElement('canvas');c.width=400;c.height=64;const g=c.getContext('2d');g.fillStyle='#10281c';g.fillRect(0,0,400,64);g.fillStyle='#f4fbf6';g.font='bold 26px sans-serif';g.textAlign='center';g.fillText(t,200,42);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),fog:false}));s.scale.set(w,w*64/400,1);s.position.set(x,y,z);sc.add(s)}
function fac(x,z,w,d,c,rc,r,t,lw){mesh(BX(w,2.6,d),c,x,1.3,z).castShadow=true;mesh(BX(w+.4,.3,d+.4),rc,x,2.75,z);col.push({x,z,r});label(t,x,3.9,z,lw)}
fac(-9,-1,4,3,0x7a5230,0x2d8c57,2.6,'Compost Center',4.2);fac(6,-6,4.5,3.5,0xe6b65c,0xc4573a,2.9,'Workshop Kertas & Kreatif',6);fac(-4,6,5,3.5,0xf2905a,0x2d6f8a,3,'Gudang Distribusi',4.6);label('Pusat Pemilahan',0,4.9,-14,4.6);
// Pohon (geometri dibagi)
const tg=CY(.25,.35,2,6),fg=new THREE.ConeGeometry(1.4,3,7);
let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
for(let i=0,n=0;i<80&&n<34;i++){const x=(R()-.5)*84,z=(R()-.5)*84;
 if(Math.hypot(x,z)<12||Math.hypot(x,z+14)<10||col.some(c=>Math.hypot(c.x-x,c.z-z)<5.5)||Math.abs(x)<3||x>22||z>20)continue;
 const t=new THREE.Mesh(tg,mat(0x7a5230));t.position.set(x,1,z);sc.add(t);
 const f=new THREE.Mesh(fg,mat(i%2?0x2d8c57:0x3a9e62));f.position.set(x,3.5,z);f.castShadow=true;sc.add(f);col.push({x,z,r:.6});n++}
/* ===== Karakter prosedural ===== */
const P=new THREE.Group();sc.add(P);P.position.set(0,0,8);
mesh(CY(.38,.4,.9),0x2d8c57,0,1.05,0,P);mesh(SP(.32),0xf2c9a0,0,1.78,0,P);
mesh(new THREE.SphereGeometry(.34,12,6,0,6.28,0,1.2),0xf2905a,0,1.8,0,P);
mesh(SP(.05),0x111111,-.12,1.8,.28,P);mesh(SP(.05),0x111111,.12,1.8,.28,P);
const limb=(x,y,c)=>{const g=new THREE.Group();g.position.set(x,y,0);P.add(g);mesh(CY(.11,.11,.7),c,0,-.3,0,g);return g};
const aL=limb(-.52,1.45,0xf2c9a0),aR=limb(.52,1.45,0xf2c9a0),lL=limb(-.2,.65,0x3a4a6a),lR=limb(.2,.65,0x3a4a6a);
P.traverse(o=>o.isMesh&&(o.castShadow=true));
/* ===== Data sampah ===== */
const CAT={organik:'Organik',daur:'Daur ulang',residu:'Residu',b3:'B3 rumah tangga'};
const T={
pet:{n:'Botol PET',c:'daur',col:0x8fd3f0,g:CY(.15,.15,.55,8),w:'Botol PET yang kosong dan bersih termasuk daur ulang; diproses mitra industri menjadi flakes.'},
kardus:{n:'Kardus',c:'daur',col:0xb98a55,g:BX(.6,.4,.5),w:'Kardus kering termasuk daur ulang; bisa diolah menjadi pulp dan kertas daur ulang.'},
makanan:{n:'Sisa makanan',c:'organik',col:0xe0903a,g:SP(.25),w:'Sisa makanan adalah organik; dapat dikomposkan setelah dipisah dari kemasan.'},
daun:{n:'Daun kering',c:'organik',col:0x9a7a2e,g:BX(.5,.08,.4),w:'Daun kering adalah organik dan bahan kaya karbon untuk kompos.'},
kaleng:{n:'Kaleng aluminium',c:'daur',col:0xc8c8d0,g:CY(.17,.17,.4,10),w:'Aluminium termasuk daur ulang logam; dilebur di fasilitas industri.'},
residu:{n:'Bungkus plastik kotor',c:'residu',col:0x555555,g:new THREE.IcosahedronGeometry(.28,0),w:'Kemasan kotor bercampur tidak bisa dimanfaatkan lewat jalur yang tersedia, jadi masuk residu.'},
baterai:{n:'Baterai rumah tangga',c:'b3',col:0xd94a3a,g:CY(.1,.1,.35,8),w:'Baterai adalah B3 rumah tangga; jangan dicampur sampah biasa, serahkan ke pengelola berwenang.'}};
const types=['pet','kardus','makanan','daun','kaleng','residu','baterai'];
const sp=[[-4,2],[5,-3],[-9,-4],[10,-8],[-12,12],[14,12],[3,14],[-3,-6],[8,6],[-18,-2],[18,-6],[0,-22],[-10,-16],[12,-20]];
const items=sp.map(([x,z],i)=>{const t=types[i%7],m=new THREE.Mesh(T[t].g,mat(T[t].col));m.position.set(x,.35,z);m.castShadow=true;sc.add(m);return{t,x,z,m,q:Math.round(rnd(30,100)),alive:true}});
const qlab=q=>q>=90?'Bersih':q>=70?'Sedikit kotor':q>=40?'Tercampur':'Terkontaminasi';
/* ===== State ===== */
const CAP=10;let inv=[],S={organik:0,daur:0,residu:0,b3:0},xp=0,ok=0,tot=0,found={},ui=null;
const lv=()=>1+Math.floor(xp/40),acc=()=>tot?Math.round(ok/tot*100):0;
function hud(){const left=items.filter(i=>i.alive).length;
 $('st').textContent=`Lv ${lv()} Eco Beginner · XP ${xp} · Tas ${inv.length}/${CAP} · Akurasi ${acc()}%`;
 $('obj').textContent=inv.length?`Bawa ${inv.length} material ke Pusat Pemilahan (menara biru)`:left?`Kumpulkan sampah di kampung (${left} tersisa)`:'Semua sampah terpilah! Prototype Phase 1 tercapai.'}
let tt;function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(tt);tt=setTimeout(()=>e.style.display='none',2200)}
/* ===== UI inventaris & pemilahan ===== */
function open(m,fb){ui=m;$('panel').style.display='block';render(fb)}
function close(){ui=null;$('panel').style.display='none'}
function render(fb){const so=ui==='sort';
 let h=`<h2>${so?'Pusat Pemilahan':'Inventaris'}</h2><p class=sm>${so?'Pilih kategori yang benar. Kategori ini penyederhanaan game; aturan pemilahan daerah bisa berbeda.':'Kapasitas '+inv.length+'/'+CAP}</p>`;
 if(fb)h+=`<div class="fb ${fb.ok?'ok':'no'}">${fb.t}</div>`;
 if(!inv.length)h+='<p>Tas kosong.</p>';
 inv.forEach((it,i)=>{const d=T[it.t];h+=`<div class=row><div><b>${d.n}</b><br><span class=sm>Kualitas ${it.q} · ${qlab(it.q)}${so?'':'<br>'+d.w}</span></div>`+(so?'<div class=cats>'+Object.keys(CAT).map(k=>`<button data-i=${i} data-k=${k}>${CAT[k]}</button>`).join('')+'</div>':'')+'</div>'});
 if(so)h+=`<p class=sm>Tersortir: Organik ${S.organik} · Daur ulang ${S.daur} · Residu ${S.residu} · B3 ${S.b3}</p>`;
 $('panel').innerHTML=h+'<button class=x id=cl>Tutup</button>';
 $('cl').onclick=close;
 $('panel').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>sortIt(+b.dataset.i,b.dataset.k))}
function sortIt(i,k){const it=inv[i],d=T[it.t];tot++;let fb;
 if(k===d.c){inv.splice(i,1);S[k]++;ok++;xp+=5;fb={ok:true,t:`Benar! ${d.n} → ${CAT[k]}. ${d.w}`}}
 else fb={ok:false,t:`Belum tepat: ${d.n} bukan ${CAT[k]}. ${d.w}`};
 hud();render(fb)}
/* ===== Interaksi ===== */
const SX=0,SZ=-10.5;
function near(){let b=null,bd=2.3;items.forEach(i=>{if(!i.alive)return;const d=Math.hypot(i.x-P.position.x,i.z-P.position.z);if(d<bd){bd=d;b=i}});
 if(b)return{k:'item',o:b};if(Math.hypot(SX-P.position.x,SZ-P.position.z)<4.8)return{k:'st'};return null}
function act(){if(ui)return;const n=near();if(!n)return;
 if(n.k==='st')return open('sort');
 if(inv.length>=CAP)return toast('Tas penuh — bawa ke Pusat Pemilahan');
 const o=n.o;o.alive=false;sc.remove(o.m);inv.push({t:o.t,q:o.q});toast('Mengambil '+T[o.t].n);
 if(!found[o.t]){found[o.t]=1;xp+=10;toast('Material baru: '+T[o.t].n+' (+10 XP)')}hud()}
/* ===== Input ===== */
const keys={};let yaw=0,pitch=.5,dist=8,jx=0,jy=0;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k==='e')act();if(k==='i')ui?close():open('inv');if(k==='escape')ui?close():open('menu')});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
const cv=$('c');cv.addEventListener('pointermove',e=>{if(e.buttons&1||e.pointerType==='touch'){yaw-=e.movementX*.005;pitch=Math.min(1.1,Math.max(.15,pitch+e.movementY*.004))}});
cv.addEventListener('wheel',e=>dist=Math.min(12,Math.max(5,dist+e.deltaY*.01)));
const joy=$('joy'),kn=$('knob');
function jm(e){const r=joy.getBoundingClientRect();let x=(e.clientX-r.left-55)/40,y=(e.clientY-r.top-55)/40;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}jx=x;jy=y;kn.style.transform=`translate(${x*30}px,${y*30}px)`}
joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);jm(e)});joy.addEventListener('pointermove',e=>{if(e.buttons)jm(e)});
joy.addEventListener('pointerup',()=>{jx=jy=0;kn.style.transform=''});
$('eb').onpointerdown=act;$('ib').onpointerdown=()=>ui?close():open('inv');
function rs(){ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
/* ===== Loop ===== */
let last=performance.now(),ph=0;
function loop(n){requestAnimationFrame(loop);const dt=Math.min((n-last)/1000,.05);last=n;
 let ix=(keys.d?1:0)-(keys.a?1:0)+jx,iy=(keys.w?1:0)-(keys.s?1:0)-jy;const l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
 if(ui)ix=iy=0;
 const mv=Math.hypot(ix,iy)>.05;
 if(mv){const sp2=keys.shift?7:4.2,dx=-Math.sin(yaw)*iy+Math.cos(yaw)*ix,dz=-Math.cos(yaw)*iy-Math.sin(yaw)*ix;
  P.position.x+=dx*sp2*dt;P.position.z+=dz*sp2*dt;P.rotation.y=Math.atan2(dx,dz);ph+=dt*(keys.shift?12:8)}
 col.forEach(c=>{const dx=P.position.x-c.x,dz=P.position.z-c.z,d=Math.hypot(dx,dz),m=c.r+.45;if(d<m&&d>0){P.position.x=c.x+dx/d*m;P.position.z=c.z+dz/d*m}});
 P.position.x=Math.max(-45,Math.min(45,P.position.x));P.position.z=Math.max(-45,Math.min(45,P.position.z));
 typeof gate==='function'&&gate();const sw=mv?Math.sin(ph)*.8:0;aL.rotation.x=sw;aR.rotation.x=-sw;lL.rotation.x=-sw;lR.rotation.x=sw;
 P.children[0].position.y=1.05+(mv?Math.abs(Math.sin(ph))*.04:Math.sin(n/500)*.015);
 items.forEach((i,k)=>{if(i.alive){i.m.position.y=.35+Math.sin(n/400+k)*.08;i.m.rotation.y+=dt}});
 const tx=P.position.x,ty=1.6,tz=P.position.z;
 cam.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*dist,Math.max(.6,ty+Math.sin(pitch)*dist),tz+Math.cos(yaw)*Math.cos(pitch)*dist);cam.lookAt(tx,ty,tz);
 sun.position.set(tx+20,30,tz+10);sun.target.position.copy(P.position);
 const nr=ui?null:near(),pe=$('prompt');
 if(nr){pe.style.display='block';pe.textContent=nr.k==='st'?'E: '+(nr.s.v||'Buka')+' '+nr.s.n:'E: Ambil '+T[nr.o.t].n}else pe.style.display='none';
 ren.render(sc,cam)}
hud();requestAnimationFrame(loop);
