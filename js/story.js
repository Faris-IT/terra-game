/* Mufa Terra — Phase 3: Pasar Lestari, Sungai Nirmala, NPC, dialog, misi, perubahan visual */
let qi=0,base=0,talked={},visited={},binOn=false,tip=0,un={pasar:0,sungai:0},envP=-1,stage='Kondisi awal',dl=null;
/* ===== Dunia baru ===== */
const pl=mesh(new THREE.PlaneGeometry(20,28),0xd8c9a3,33,.03,0);pl.rotation.x=-Math.PI/2;pl.receiveShadow=true;
[[29,-8,0xf2905a],[34,-8,0xe6b65c],[39,-8,0x68ba6d],[29,9,0x4ca9cb],[34,9,0xf2905a],[39,9,0xe6b65c]].forEach(([x,z,c])=>{
 mesh(BX(2.8,1.4,2),0x7a5230,x,.7,z).castShadow=true;mesh(BX(3.4,.2,2.8),c,x,2,z);col.push({x,z,r:1.7})});
label('Pasar Lestari',23.5,3.4,0,4.6);
const bar1=mesh(BX(.2,1.2,26),0xf2905a,23.5,.6,0);
const binM=mesh(BX(1,1.2,1),0x888888,26,.6,0);label('Tempat Pengumpulan',26,2.2,0,3.6);
const bank=mesh(new THREE.PlaneGeometry(90,3.5),0xe6c98a,0,.03,23.5);bank.rotation.x=-Math.PI/2;
const wm=new THREE.MeshLambertMaterial({color:0x7a6a4a,transparent:true,opacity:.9});
const rv=new THREE.Mesh(new THREE.PlaneGeometry(130,12),wm);rv.rotation.x=-Math.PI/2;rv.position.set(0,.04,31);sc.add(rv);
const bar2=mesh(BX(60,1.2,.2),0xf2905a,0,.6,21.5);label('Sungai Nirmala',-10,3,23,4);
mesh(BX(3,2,2.4),0x7a5230,4,1,22);mesh(BX(3.6,.25,3),0x2d8c57,4,2.1,22);col.push({x:4,z:22,r:1.9});label('Pos Pemantauan Sungai',4,3.3,22,5);
[[28,-3,'makanan'],[31,3,'kardus'],[34,-1,'pet'],[37,5,'residu'],[30,-6,'makanan'],[40,0,'daun'],[33,7,'kardus'],[26,5,'makanan'],[36,-6,'pet'],[39,6,'makanan'],
 [-10,23,'pet'],[0,24,'residu'],[8,23,'kaleng'],[-20,24,'pet'],[18,24,'residu'],[-30,22,'kaleng']].forEach(([x,z,t])=>{
 const m=new THREE.Mesh(T[t].g,mat(T[t].col));m.position.set(x,.35,z);m.castShadow=true;sc.add(m);items.push({t,x,z,m,q:Math.round(rnd(30,100)),alive:true})});
/* sampah dekoratif yang berganti bunga saat lingkungan pulih */
let sd=11;const rr=()=>(sd=(sd*16807)%2147483647)/2147483647,lit=[],flo=[];
for(let i=0;i<30;i++){let x=0,z=0;for(let k=0;k<20;k++){x=(rr()-.5)*84;z=-30+rr()*48;if(Math.hypot(x,z)>5&&!ST.some(f=>Math.hypot(f.x-x,f.z-z)<4)&&!col.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+1.2))break}
 const L=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,0),mat(i%3?0x555555:0x8fd3f0));L.position.set(x,.2,z);sc.add(L);lit.push(L);
 const F=mesh(SP(.2),[0xf2905a,0xe6b65c,0xf4fbf6][i%3],x,.25,z);F.visible=false;flo.push(F)}
gr.material=new THREE.MeshLambertMaterial({color:0x8fa86a});
function env(){envP=ok;const p=Math.min(1,ok/40),n=Math.floor(p*lit.length),C=h=>new THREE.Color(h);
 lit.forEach((m,i)=>m.visible=i>=n);flo.forEach((m,i)=>m.visible=i<n);
 wm.color.copy(C(0x7a6a4a)).lerp(C(0x4ca9cb),p);gr.material.color.copy(C(0x8fa86a)).lerp(C(0x68ba6d),p);
 sc.background.copy(C(0xb9c8c0)).lerp(C(0x9fd8f0),p);sc.fog.color.copy(sc.background);
 stage=p<.25?'Kondisi awal':p<.6?'Tahap pemulihan':p<1?'Tahap berkembang':'Tahap lestari'}
function gate(){const p=P.position;if(!un.pasar&&p.x>23)p.x=23;if(!un.sungai&&p.z>21)p.z=21;if(p.z>24.5)p.z=24.5}
function apply(){if(un.pasar)sc.remove(bar1);if(un.sungai)sc.remove(bar2)}
function unlock(u){un[u]=1;apply();toast(u==='pasar'?'Chapter 2: The Market Challenge — Pasar Lestari terbuka':'Chapter 3: A River’s Story — Sungai Nirmala terbuka')}
/* ===== NPC ===== */
const NP=[];
function npc(id,n,x,z,c,hc){const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);
 mesh(CY(.38,.4,.9),c,0,1.05,0,g);mesh(SP(.32),0xd9a577,0,1.78,0,g);mesh(CY(.2,.36,.22),hc,0,2.08,0,g);
 [-.52,.52].forEach(a=>mesh(CY(.11,.11,.7),0xd9a577,a,1.2,0,g));[-.2,.2].forEach(a=>mesh(CY(.13,.13,.7),0x3a4a6a,a,.35,0,g));
 g.traverse(o=>o.isMesh&&(o.castShadow=true));label(n,x,2.9,z,3);NP.push(g);col.push({x,z,r:.6});
 EXT.push({id:'npc:'+id,n,v:'Bicara dengan',x,z,r:2.8,fn:()=>talk(id)})}
npc('faris','Pak Faris',3,11,0x4ca9cb,0xe6b65c);npc('edukator','Edukator Lingkungan',-5,-8,0x68ba6d,0xf4fbf6);npc('pedagang','Pedagang Pasar',32,0,0xf2905a,0x7a5230);
EXT.push({id:'bin',n:'Tempat Pengumpulan',v:'Aktifkan',x:26,z:0,r:2.6,fn:()=>{if(binOn)return toast('Tempat pengumpulan sudah aktif');binOn=true;trust+=2;binM.material=mat(0x2d8c57);toast('Tempat pengumpulan pasar aktif (+2 Trust)');hud()}});
(function nl(){requestAnimationFrame(nl);NP.forEach(g=>{g.rotation.y=Math.atan2(P.position.x-g.position.x,P.position.z-g.position.z);g.position.y=Math.sin(performance.now()/600+g.position.x)*.02})})();
/* ===== Dialog ===== */
const FNAME={faris:'Pak Faris — Ketua Komunitas',pedagang:'Pedagang Pasar',edukator:'Edukator Lingkungan'};
const TIPS=['Kualitas material 0–100: makin bersih dan terpilah, makin mudah diterima fasilitas.','Tidak semua simbol daur ulang diterima semua fasilitas; kondisi, kebersihan, dan jenis material menentukan.','Baterai dan limbah elektronik termasuk B3 rumah tangga; serahkan ke pengelola berwenang, jangan diolah sendiri.','Kompos butuh bahan basah (kaya nitrogen) dan kering (kaya karbon), udara, dan kelembapan yang terjaga.','Pembersihan permukaan belum tentu berarti pencemaran pulih; sebagian kasus perlu pemeriksaan profesional.','Warna air di game hanyalah indikator ilustratif, bukan hasil pengukuran kualitas air.','Mencegah sampah dari sumbernya lebih berkelanjutan daripada mengumpulkannya setelah sampai ke sungai atau laut.'];
function lines(id){
 if(id==='faris')return qi===0?['Selamat datang di Tim Terra! Kampung Arunika dulu bersih, tapi penduduk dan sampah bertambah, sementara kebiasaan memilah belum merata.','Masalahnya bukan hanya sampah: fasilitas terbatas, biaya, dan koordinasi juga kurang. Kita butuh sistem yang dipelihara bersama.','Kenali dulu kampung ini: kunjungi tiga fasilitas (Pusat Pemilahan, Compost Center, Workshop, atau Gudang).']:['Ingat: lingkungan yang baik bukan hasil satu aksi besar, tapi sistem yang dipelihara bersama.',qi<QS.length?'Misimu sekarang: '+QS[qi].o():'Semua misi awal selesai. Jelajahi Sungai Nirmala dan terus rawat kampung.'];
 if(id==='pedagang')return qi===2?['Pasar ramai, sisa sayur dan kemasan menumpuk tiap hari.','Kalau dipilah dari sumbernya, sisa organik bisa jadi kompos. Aktifkan tempat pengumpulan di sisi barat pasar, lalu bantu pilah sampah.']:['Terima kasih sudah membantu pasar. Memilah dari sumbernya membuat semuanya lebih mudah.'];
 return['Ada sedikit pengetahuan untukmu:',TIPS[tip++%TIPS.length]]}
function talk(id){talked[id]=1;dl={id,lines:lines(id),i:0};open('dlg');qh()}
function dlgH(){return`<h2>${FNAME[dl.id]}</h2><p>${dl.lines[dl.i]}</p><button data-dl>${dl.i<dl.lines.length-1?'Lanjut':'Selesai'}</button>`}
function dlgNext(){if(dl.i<dl.lines.length-1){dl.i++;render()}else close()}
/* ===== Misi (berbasis data) ===== */
const mk=b=>b?'✓':'•',pr=()=>Math.max(0,ok-base);
const QS=[
{n:'Hari Pertama',xp:100,c:50,p:()=>talked.faris&&Object.keys(visited).length>=3,o:()=>`${mk(talked.faris)} Temui Pak Faris · Kunjungi fasilitas (${Math.min(3,Object.keys(visited).length)}/3)`},
{n:'Empat Kategori',xp:120,c:60,u:'pasar',p:()=>pr()>=12&&acc()>=80,o:()=>`Pilah 12 material dengan benar (${Math.min(12,pr())}/12), akurasi ≥80% (kini ${acc()}%)`},
{n:'Pasar Lebih Bersih',xp:150,c:80,p:()=>talked.pedagang&&binOn&&pr()>=8,o:()=>`${mk(talked.pedagang)} Bicara dengan Pedagang Pasar · ${mk(binOn)} Aktifkan tempat pengumpulan · Pilah ${Math.min(8,pr())}/8`},
{n:'Kompos Pertama',xp:200,c:100,p:()=>!!found.kompos,o:()=>'Buat batch kompos di Compost Center, lalu ambil hasilnya'},
{n:'Kertas Kedua',xp:220,c:100,u:'sungai',p:()=>!!found.kertas,o:()=>'Olah kardus bersih menjadi kertas daur ulang di Workshop Kertas'}];
const CH=['A New Beginning','The Market Challenge','A River’s Story'];
const qp=document.createElement('div');qp.className='pill';qp.id='qst';qp.style.borderColor='var(--e)';$('hud').appendChild(qp);
function qh(){qp.textContent=(qi<QS.length?`Misi ${qi+1}/${QS.length} ${QS[qi].n}: ${QS[qi].o()}`:'Misi awal selesai — jelajahi Sungai Nirmala')+` · Kampung: ${stage}`}
function questH(){let h=`<h2>Misi</h2><p class=sm>Chapter ${un.sungai?3:un.pasar?2:1}: ${CH[un.sungai?2:un.pasar?1:0]} · Kampung: ${stage}</p>`;
 QS.forEach((q,i)=>h+=`<div class=row><div><b>${i<qi?'✓':i===qi?'▶':'•'} ${q.n}</b><br><span class=sm>${i===qi?q.o():i<qi?'Selesai':'Belum dibuka'}</span></div><span class=sm>${q.xp} XP · ${q.c} Coins</span></div>`);return h}
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='j')ui==='quests'?close():ui||open('quests')});
const mq=document.createElement('button');mq.id='mq';mq.textContent='Misi';mq.onpointerdown=()=>ui==='quests'?close():ui||open('quests');$('mb').appendChild(mq);
setInterval(()=>{ST.forEach(f=>{if(Math.hypot(f.x-P.position.x,f.z-P.position.z)<f.r)visited[f.id]=1});
 if(qi<QS.length&&QS[qi].p()){const q=QS[qi];xp+=q.xp;coins+=q.c;trust+=5;toast(`Misi selesai: ${q.n} (+${q.xp} XP, +${q.c} Coins)`);
  if(q.u)setTimeout(()=>unlock(q.u),2400);qi++;base=ok;hud()}
 if(ok!==envP)env();qh();if(ui==='quests')render()},1000);
/* ===== Save ===== */
function exportStory(){return{qi,base,talked,visited,binOn,tip,un}}
function importStory(s){try{qi=Math.min(QS.length,Math.max(0,s.qi|0));base=s.base|0;talked=s.talked||{};visited=s.visited||{};binOn=!!s.binOn;tip=s.tip|0;
 un={pasar:s.un&&s.un.pasar?1:0,sungai:s.un&&s.un.sungai?1:0};apply();if(binOn)binM.material=mat(0x2d8c57);envP=-1}catch(e){}}
load();hud();env();qh();
