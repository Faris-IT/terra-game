/* Mufa Terra — Phase 2: kualitas, fasilitas, resep, crafting, distribusi, ekonomi, save/load */
const SAVE='mufa-terra-save',V=2;
let coins=30,trust=0,st={},batches={},lastSave=0,noSave=false,booted=false;
const PN={kompos:'Kompos',pulp:'Pulp kertas',kertas:'Kertas daur ulang',pot:'Pot kreatif'};
const PR={kompos:12,kertas:20,pot:25},MV={pet:8,kardus:5,kaleng:12,makanan:3,daun:2};
const REC=[
{id:'kompos',f:'compost',n:'Kompos',inp:{makanan:2,daun:2},q:{makanan:40,daun:40},t:24,cost:10,out:{kompos:3},note:'Butuh bahan basah (nitrogen) dan kering (karbon); pengomposan memerlukan waktu.'},
{id:'pulp',f:'paper',n:'Kardus → pulp',inp:{kardus:3},q:{kardus:70},t:15,cost:5,out:{pulp:2},note:'Kardus harus kering dan cukup bersih.'},
{id:'kertas',f:'paper',n:'Pulp → kertas daur ulang',inp:{pulp:2},q:{},t:30,cost:15,out:{kertas:2},note:'Pulp diproses menjadi lembaran kertas.'},
{id:'pot',f:'paper',n:'Pot kreatif (penggunaan ulang)',inp:{pet:1,kompos:1},q:{pet:90},t:20,cost:10,out:{pot:1},note:'Penggunaan ulang: wadah bersih dipakai kembali, bukan didaur ulang industri.'}];
const EXT=[],FN={};ST.forEach(f=>FN[f.id]=f.n);
const nm=k=>(T[k]||{}).n||PN[k]||k,pv=(k,q)=>Math.round((PR[k]||MV[k]||0)*q/100);
const qc=q=>q>=90?'Bersih':q>=70?'Sedikit kotor':q>=40?'Tercampur':'Terkontaminasi';
const LN=l=>l<=5?'Eco Beginner':l<=10?'Waste Explorer':'Circular Creator';
const stockTxt=()=>Object.keys(st).map(k=>nm(k)+' '+st[k].n+' (kual. '+st[k].q+')').join(' · ')||'kosong';
const have=r=>Object.keys(r.inp).every(k=>st[k]&&st[k].n>=r.inp[k]&&(!r.q[k]||st[k].q>=r.q[k]));
const canMake=r=>have(r)&&coins>=r.cost&&!batches[r.f];
function add(k,n,q){const e=st[k]||(st[k]={n:0,q});e.q=Math.round((e.q*e.n+q*n)/(e.n+n));e.n+=n}
document.head.insertAdjacentHTML('beforeend','<style>button:disabled{opacity:.4;cursor:not-allowed}.cats .x{margin-top:0}</style>');
/* sampah tambahan (respawn = simulasi siklus material) */
[[2,4],[12,-2],[-8,10],[6,-17],[-9,-16],[16,-10],[-20,8],[20,-1],[-2,-24],[4,20]].forEach(([x,z],i)=>{
 const t=['makanan','daun','makanan','kardus','pet','kardus','daun','kaleng','pet','kardus'][i],m=new THREE.Mesh(T[t].g,mat(T[t].col));
 m.position.set(x,.35,z);m.castShadow=true;sc.add(m);items.push({t,x,z,m,q:Math.round(rnd(30,100)),alive:true})});
/* ===== Interaksi ===== */
function near(){let b=null,bd=2.3;items.forEach(i=>{if(!i.alive)return;const d=Math.hypot(i.x-P.position.x,i.z-P.position.z);if(d<bd){bd=d;b=i}});
 if(b)return{k:'item',o:b};const f=EXT.concat(ST).find(f=>Math.hypot(f.x-P.position.x,f.z-P.position.z)<f.r);return f?{k:'st',s:f}:null}
function act(){if(ui)return;const n=near();if(!n)return;
 if(n.k==='st')return n.s.fn?n.s.fn():open(n.s.id);
 if(inv.length>=CAP)return toast('Tas penuh — bawa ke Pusat Pemilahan');
 const o=n.o;o.alive=false;o.cd=45;sc.remove(o.m);inv.push({t:o.t,q:o.q});toast('Mengambil '+T[o.t].n);
 if(!found[o.t]){found[o.t]=1;xp+=10;toast('Material baru: '+T[o.t].n+' (+10 XP)')}hud()}
/* ===== Pemilahan & kualitas ===== */
function sortIt(i,k){const it=inv[i],d=T[it.t],raw=d.c==='b3'||d.c==='residu';tot++;let fb;
 if(k!==d.c)fb={ok:false,t:`Belum tepat: ${d.n} bukan ${CAT[k]}. ${d.w}`};
 else if(it.q<40&&!raw){tot--;fb={ok:false,t:`${d.n} terkontaminasi berat (kualitas ${it.q}); jalur produksi tidak menerimanya. Bersihkan dulu.`}}
 else{inv.splice(i,1);add(it.t,1,it.q);ok++;xp+=5;fb={ok:true,t:`Benar! ${d.n} → ${CAT[k]}. ${d.w}`}}
 hud();render(fb)}
function clean(i){const it=inv[i];if(coins<5)return render({ok:false,t:'Coins tidak cukup untuk pembersihan.'});
 it.q=Math.min(100,it.q+25);coins-=5;xp+=5;hud();render({ok:true,t:`${T[it.t].n} dibersihkan: kualitas ${it.q} (${qc(it.q)}).`})}
/* ===== Produksi ===== */
function start(id){const r=REC.find(x=>x.id===id);if(!r||!canMake(r))return render({ok:false,t:'Syarat belum terpenuhi.'});
 let s=0,c=0;for(const k in r.inp){s+=st[k].q*r.inp[k];c+=r.inp[k];st[k].n-=r.inp[k];if(st[k].n<=0)delete st[k]}
 coins-=r.cost;batches[r.f]={r:r.id,left:r.t,q:Math.round(s/c)};hud();render({ok:true,t:`Batch ${r.n} dimulai.`})}
function claim(f){const b=batches[f];if(!b||b.left>0)return;const r=REC.find(x=>x.id===b.r);
 for(const k in r.out){add(k,r.out[k],b.q);if(!found[k]){found[k]=1;xp+=10}}xp+=20;delete batches[f];
 hud();render({ok:true,t:`Hasil diambil: ${Object.keys(r.out).map(k=>nm(k)+' ×'+r.out[k]).join(', ')} (kualitas ${b.q}). +20 XP`})}
/* ===== Distribusi ===== */
function sell(k){const e=st[k];if(!e)return;const t=pv(k,e.q)*e.n-(PR[k]?5:0);
 if(t<=0)return render({ok:false,t:'Nilai terlalu rendah untuk dijual.'});
 coins+=t;xp+=5;const n=e.n;delete st[k];hud();render({ok:true,t:`Menjual ${n} ${nm(k)}: +${t} Coins.`})}
function donate(k){const e=st[k];if(!e)return;if(--e.n<=0)delete st[k];xp+=10;trust+=1;hud();render({ok:true,t:`${nm(k)} dibagikan ke warga. +10 XP, Trust +1.`})}
function handover(k){const e=st[k];if(!e)return;const n=e.n;delete st[k];
 if(k==='baterai'){xp+=15*n;trust+=3*n}hud();
 render({ok:true,t:k==='baterai'?`${n} baterai diserahkan ke pengelola berwenang. +${15*n} XP, Trust +${3*n}.`:`${n} residu diserahkan ke pengelola. Residu tidak bernilai jual.`})}
/* ===== Panel ===== */
function bagH(so,fb){let h=`<h2>${so?'Pusat Pemilahan':'Inventaris'}</h2><p class=sm>${so?'Pilih kategori yang benar. Kategori ini penyederhanaan game; aturan pemilahan daerah bisa berbeda.':'Tas '+inv.length+'/'+CAP+' · Coins '+coins}</p>`+fb;
 if(!inv.length)h+='<p>Tas kosong.</p>';
 inv.forEach((it,i)=>{const d=T[it.t],cl=it.q<90&&d.c!=='b3'&&d.c!=='residu';
  h+=`<div class=row><div><b>${d.n}</b><br><span class=sm>Kualitas ${it.q} · ${qc(it.q)}${so?'':'<br>'+d.w}</span></div>`+(so?`<div class=cats>${Object.keys(CAT).map(k=>`<button data-i=${i} data-k=${k}>${CAT[k]}</button>`).join('')}${cl?`<button class=x data-c=${i}>Bersihkan (5 Coins)</button>`:''}</div>`:'')+'</div>'});
 return h+(so?`<p class=sm>Stok terpilah: ${stockTxt()}</p>`:'')}
function facH(fb){const f=ui,b=batches[f];let h=`<h2>${FN[f]}</h2><p class=sm>Coins ${coins} · Stok: ${stockTxt()}</p>`+fb;
 if(b){const r=REC.find(x=>x.id===b.r);h+=b.left>0?`<div class="fb ok">Memproses ${r.n}… ${b.left} detik</div>`:`<div class="fb ok">Batch ${r.n} selesai.</div><button id=cm>Ambil hasil</button>`}
 REC.filter(r=>r.f===f).forEach(r=>{const need=Object.keys(r.inp).map(k=>`${nm(k)} ${st[k]?st[k].n:0}/${r.inp[k]}${r.q[k]?' (kual. ≥'+r.q[k]+')':''}`).join(', ');
  h+=`<div class=row><div><b>${r.n}</b><br><span class=sm>Bahan: ${need}<br>→ ${Object.keys(r.out).map(k=>nm(k)+' ×'+r.out[k]).join(', ')} · ${r.t} dtk · ${r.cost} Coins<br>${r.note}</span></div><button data-r=${r.id} ${canMake(r)?'':'disabled'}>Mulai</button></div>`});
 return h+'<p class=sm>Angka bahan dan waktu adalah balancing game yang disederhanakan, bukan standar industri.</p>'}
function wareH(fb){let h=`<h2>Gudang Distribusi</h2><p class=sm>Coins ${coins} · Trust ${trust}. Biaya distribusi produk: 5 Coins per penjualan.</p>`+fb;
 const ks=Object.keys(st);if(!ks.length)h+='<p>Gudang kosong.</p>';
 ks.forEach(k=>{const e=st[k],p=pv(k,e.q);h+=`<div class=row><div><b>${nm(k)} ×${e.n}</b><br><span class=sm>Kualitas ${e.q} · ${qc(e.q)}</span></div><div class=cats>`+
  (p>0?`<button data-s=${k}>Jual semua (+${p*e.n-(PR[k]?5:0)})</button>`:'')+(PR[k]?`<button data-d=${k}>Donasikan 1</button>`:'')+(k==='baterai'||k==='residu'?`<button data-h=${k}>Serahkan</button>`:'')+'</div></div>'});
 return h}
function render(f){const fb=f?`<div class="fb ${f.ok?'ok':'no'}">${f.t}</div>`:'';let h;
 if(ui==='menu')h=`<h2>Menu</h2><p class=sm>Progres tersimpan otomatis di browser ini (localStorage).</p>${fb}<button id=sv>Simpan sekarang</button> <button id=rst class=x>Hapus save &amp; mulai ulang</button><p class=sm>Sampah yang muncul kembali adalah simulasi siklus material. Visual dan angka adalah ilustrasi game.</p>`;
 else if(ui==='dlg')h=dlgH(fb);else if(ui==='quests')h=questH(fb);else if(ui==='ware')h=wareH(fb);else if(ui==='compost'||ui==='paper')h=facH(fb);else h=bagH(ui==='sort',fb);
 $('panel').innerHTML=h+'<button class=x id=cl>Tutup</button>';
 const q=s=>$('panel').querySelectorAll(s);$('cl').onclick=close;
 q('[data-k]').forEach(b=>b.onclick=()=>sortIt(+b.dataset.i,b.dataset.k));q('[data-c]').forEach(b=>b.onclick=()=>clean(+b.dataset.c));
 q('[data-r]').forEach(b=>b.onclick=()=>start(b.dataset.r));q('[data-s]').forEach(b=>b.onclick=()=>sell(b.dataset.s));
 q('[data-d]').forEach(b=>b.onclick=()=>donate(b.dataset.d));q('[data-h]').forEach(b=>b.onclick=()=>handover(b.dataset.h));
 q('[data-dl]').forEach(b=>b.onclick=dlgNext);if($('cm'))$('cm').onclick=()=>claim(ui);if($('sv'))$('sv').onclick=()=>{save();render({ok:true,t:'Tersimpan.'})};
 if($('rst')){let c=0;$('rst').onclick=()=>{if(!c){c=1;$('rst').textContent='Yakin? Klik lagi';return}noSave=true;try{localStorage.removeItem(SAVE);localStorage.removeItem(SAVE+'-bak')}catch(e){}location.reload()}}}
/* ===== HUD ===== */
function objective(){if(inv.length)return`Bawa ${inv.length} material ke Pusat Pemilahan (menara biru)`;
 const rd=Object.keys(batches).find(f=>batches[f]&&batches[f].left<=0);if(rd)return`Ambil hasil produksi di ${FN[rd]}`;
 const rc=REC.find(canMake);if(rc)return`Proses di ${FN[rc.f]}: ${rc.n}`;
 if(Object.keys(st).length)return'Kumpulkan bahan lagi untuk resep, atau jual/bagikan di Gudang Distribusi';
 return`Kumpulkan sampah di kampung (${items.filter(i=>i.alive).length} tersisa)`}
function hud(){$('st').textContent=`Lv ${lv()} ${LN(lv())} · XP ${xp} · Coins ${coins} · Trust ${trust} · Tas ${inv.length}/${CAP} · Akurasi ${acc()}%`;
 $('obj').textContent=objective();if(Date.now()-lastSave>3000)save()}
/* ===== Save / load (versi schema + backup) ===== */
function save(){if(noSave||!booted)return;try{const o=localStorage.getItem(SAVE);if(o)localStorage.setItem(SAVE+'-bak',o);lastSave=Date.now();
 localStorage.setItem(SAVE,JSON.stringify({v:V,p:[P.position.x,P.position.z],xp,coins,trust,inv,st,found,ok,tot,b:batches,it:items.map(i=>[i.alive?1:0,i.q]),sy:typeof exportStory==='function'?exportStory():null}))}catch(e){}}
function load(){const rd=k=>{try{const d=JSON.parse(localStorage.getItem(k));return d&&d.v===V?d:null}catch(e){return null}};
 const d=rd(SAVE)||rd(SAVE+'-bak');if(!d)return false;const n=x=>Number.isFinite(x)?x:0;
 try{xp=n(d.xp);coins=n(d.coins);trust=n(d.trust);ok=n(d.ok);tot=n(d.tot);
 inv=(d.inv||[]).filter(i=>T[i.t]&&Number.isFinite(i.q)).slice(0,CAP);
 st={};for(const k in d.st||{}){const e=d.st[k];if((T[k]||PN[k])&&e.n>0&&Number.isFinite(e.q))st[k]={n:Math.floor(e.n),q:e.q}}
 found=d.found||{};batches={};for(const f in d.b||{}){const b=d.b[f];if(b&&FN[f]&&REC.some(r=>r.id===b.r))batches[f]={r:b.r,left:n(b.left),q:n(b.q)}}
 (d.it||[]).forEach((a,i)=>{const o=items[i];if(!o)return;o.q=n(a[1]);if(a[0]){if(!o.alive)sc.add(o.m);o.alive=true}else if(o.alive){o.alive=false;sc.remove(o.m);o.cd=20}});
 if(d.p){P.position.x=n(d.p[0]);P.position.z=n(d.p[1])}if(d.sy&&typeof importStory==='function')importStory(d.sy);return true}catch(e){return false}}
/* ===== Timer game (berhenti saat tab tidak aktif) ===== */
setInterval(()=>{if(document.hidden)return;let ch=0;
 for(const f in batches){const b=batches[f];if(b.left>0&&--b.left===0){toast(`Batch di ${FN[f]} selesai!`);ch=1}}
 items.forEach(o=>{if(!o.alive&&o.cd>0&&--o.cd===0){o.alive=true;o.q=Math.round(rnd(30,100));sc.add(o.m)}});
 if(ch)hud();if(ui==='compost'||ui==='paper')render()},1000);
setInterval(save,15000);addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>document.hidden&&save());
if($('mn'))$('mn').onpointerdown=()=>ui?close():open('menu');
load();hud();
