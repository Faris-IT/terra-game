/* Mufa Terra — Phase 4: progres, upgrade, achievement, tantangan, koleksi, rekor, Eco Score */
const UP=[
{id:'inv',n:'Kapasitas Inventaris +5',c:100,e:'Tas +5 slot'},
{id:'sort',n:'Sorting Table Lv. 2',c:200,e:'Kapasitas gudang +10'},
{id:'store',n:'Storage Expansion',c:250,e:'Kapasitas gudang +20'},
{id:'aer',n:'Compost Aeration',c:300,e:'Waktu kompos −30%'},
{id:'hub',n:'Community Hub',c:300,e:'Membuka pesanan komunitas lanjutan'},
{id:'cart',n:'Logistics Cart',c:350,e:'Tas +5 slot'},
{id:'paper',n:'Paper Workshop Upgrade',c:400,e:'Waktu pulp dan kertas −30%'},
{id:'scan',n:'Quality Scanner',c:500,e:'Kualitas terlihat sebelum mengambil sampah dan di kartu resep'}];
const DC=[{id:'a',n:'Pilah 10 material',g:10,v:()=>ok-pg.d.ok0,xp:30,c:25},{id:'b',n:'Selesaikan 1 batch produksi',g:1,v:()=>pg.d.b,xp:30,c:25},{id:'c',n:'Penuhi 1 pesanan warga',g:1,v:()=>pg.d.o,xp:30,c:25}];
const WC=[{id:'a',n:'Kelola 60 unit material (pilah)',g:60,v:()=>ok-pg.w.ok0,xp:120,c:100},{id:'b',n:'Hasilkan 8 unit produk',g:8,v:()=>pg.w.u,xp:120,c:100},{id:'c',n:'Penuhi 3 pesanan warga',g:3,v:()=>pg.w.o,xp:120,c:100}];
const OR=[{id:'o1',n:'Kebun warga',need:{kompos:2},c:60,xp:25},{id:'o2',n:'Catatan RT',need:{kertas:2},c:70,xp:25},{id:'o3',n:'Pot untuk balai warga',need:{pot:1},c:50,xp:25},
{id:'o4',n:'Taman sekolah',need:{kompos:4,pot:1},c:150,xp:40,hub:1},{id:'o5',n:'Pameran daur ulang',need:{kertas:4,pot:2},c:220,xp:50,hub:1}];
const AC=[
{id:'fs',n:'First Sort',d:'Selesaikan pemilahan pertama',v:()=>ok>=1},
{id:'me',n:'Material Expert',d:'Temukan semua 7 material dasar',v:()=>types.every(t=>found[t])},
{id:'cc',n:'Circular Creator',d:'Hasilkan semua jenis produk (kompos, pulp, kertas, pot)',v:()=>['kompos','pulp','kertas','pot'].every(k=>found[k])},
{id:'cm',n:'Compost Master',d:'Hasilkan 10 batch kompos',v:()=>pg.rec.kc>=10},
{id:'rg',n:'River Guardian',d:'Kumpulkan 8 sampah di tepi Sungai Nirmala',v:()=>pg.rec.riv>=8},
{id:'cb',n:'Community Builder',d:'Buka Community Hub',v:()=>!!pg.up.hub},
{id:'qc',n:'Quality Controller',d:'Akurasi pemilahan ≥90% setelah ≥30 percobaan',v:()=>tot>=30&&acc()>=90},
{id:'tg',n:'Terra Guardian',d:'Selesaikan 5 misi utama awal',v:()=>qi>=QS.length},
{id:'gp',n:'Green Pioneer',d:'Restorasi bukit (wilayah belum tersedia)',v:()=>false,lock:1},
{id:'cp',n:'Coastal Protector',d:'Proyek pesisir (wilayah belum tersedia)',v:()=>false,lock:1}];
let pg={up:{},ach:{},rec:{maxCoins:0,prod:0,inU:0,outU:0,ch:0,riv:0,ord:0,kc:0},d:{k:'',ok0:0,b:0,o:0,cl:{},od:{}},w:{k:'',ok0:0,u:0,o:0,cl:{}},act:[],lastLv:1},tab='up',lastOk=0;
const dk=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()},wk=()=>'w'+Math.floor(Date.now()/604800000);
const capUp=()=>{CAP=10+(pg.up.inv?5:0)+(pg.up.cart?5:0)},SC=()=>30+(pg.up.sort?10:0)+(pg.up.store?20:0),stockN=()=>Object.values(st).reduce((a,e)=>a+e.n,0);
const rt=r=>Math.round(r.t*((r.f==='compost'&&pg.up.aer)||(r.f==='paper'&&pg.up.paper)?.7:1));
const sq=k=>pg.up.scan&&st[k]?` · kual. ${st[k].q}`:'',iq=o=>pg.up.scan?` (kual. ${o.q})`:'';
function roll(){if(pg.d.k!==dk(Date.now()))pg.d={k:dk(Date.now()),ok0:ok,b:0,o:0,cl:{},od:{}};if(pg.w.k!==wk())pg.w={k:wk(),ok0:ok,u:0,o:0,cl:{}}}
function active(){const k=dk(Date.now());if(!pg.act.includes(k))pg.act=pg.act.concat(k).slice(-14)}
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
function onClaim(r){const u=sum(r.out);pg.rec.prod+=u;pg.rec.outU+=u;pg.rec.inU+=sum(r.inp);pg.d.b++;pg.w.u+=u;if(r.id==='kompos')pg.rec.kc++;active()}
function onPick(o){if(o.z>21)pg.rec.riv++;active()}
function eco(){const d7=[0,1,2,3,4,5,6].map(i=>dk(Date.now()-i*864e5)),A=tot?ok/tot:0,M=Math.min(1,pg.rec.inU/Math.max(1,ok)),E=Math.min(1,ok/40),K=pg.act.filter(k=>d7.includes(k)).length/7;
 return{s:Math.round(100*(.3*A+.25*M+.25*E+.2*K)),A,M,E,K}}
/* ===== Buku Terra ===== */
function tUp(){let h=`<p class=sm>Tas ${inv.length}/${CAP} · Gudang ${stockN()}/${SC()}</p>`;
 UP.forEach(u=>{h+=`<div class=row><div><b>${u.n}</b><br><span class=sm>${u.e} · ${u.c} Coins</span></div><button data-act="buy:${u.id}" ${pg.up[u.id]||coins<u.c?'disabled':''}>${pg.up[u.id]?'Dimiliki':'Beli'}</button></div>`});return h}
function tKol(){let h='<p class=sm>Material yang pernah kamu temukan.</p>';
 types.forEach(t=>{h+=`<div class=row><div><b>${found[t]?T[t].n:'??? belum ditemukan'}</b><br><span class=sm>${found[t]?CAT[T[t].c]+' · '+T[t].w:'Jelajahi untuk menemukannya.'}</span></div></div>`});
 Object.keys(PN).forEach(k=>{h+=`<div class=row><div><b>${found[k]?PN[k]:'??? produk belum dibuat'}</b></div></div>`});return h}
function tAch(){return AC.map(a=>`<div class=row><div><b>${pg.ach[a.id]?'✓':a.lock?'🔒':'•'} ${a.n}</b><br><span class=sm>${a.d}</span></div></div>`).join('')}
function tTan(){const f=(L,p,t,l)=>`<h3>${l}</h3>`+L.map(c=>{const v=Math.min(c.g,c.v()),d=p.cl[c.id];return`<div class=row><div><b>${c.n}</b><br><span class=sm>${v}/${c.g} · ${c.xp} XP, ${c.c} Coins</span></div><button data-act="${t}:${c.id}" ${d||v<c.g?'disabled':''}>${d?'Selesai ✓':'Klaim'}</button></div>`}).join('');
 return f(DC,pg.d,'dc','Harian')+f(WC,pg.w,'wc','Mingguan')+'<p class=sm>Tidak ada penalti bila tidak bermain; tantangan baru muncul saat kamu kembali. Target disederhanakan untuk prototype.</p>'}
function tPes(){const w=ST.find(f=>f.id==='ware'),nr=Math.hypot(w.x-P.position.x,w.z-P.position.z)<w.r;
 let h=`<p class=sm>Antar pesanan dari Gudang Distribusi${nr?'':' (kamu belum di sana)'}. Tiap pesanan bisa dipenuhi sekali per hari.</p>`;
 OR.filter(o=>!o.hub||pg.up.hub).forEach(o=>{const ok2=Object.keys(o.need).every(x=>st[x]&&st[x].n>=o.need[x]),dn=pg.d.od[o.id];
  h+=`<div class=row><div><b>${o.n}</b><br><span class=sm>${Object.keys(o.need).map(x=>nm(x)+' '+(st[x]?st[x].n:0)+'/'+o.need[x]).join(', ')} → ${o.c} Coins, ${o.xp} XP, Trust +2</span></div><button data-act="od:${o.id}" ${dn||!ok2||!nr?'disabled':''}>${dn?'Selesai ✓':'Antar'}</button></div>`});
 return h+(pg.up.hub?'':'<p class=sm>Beli Community Hub di tab Upgrade untuk pesanan lanjutan.</p>')}
function tRek(){const e=eco(),r=pg.rec,P2=x=>Math.round(x*100);
 return`<div class=row><b>Eco Score ${e.s}/100</b></div><p class=sm>Kualitas pemilahan ${P2(e.A)}% (30%) · Pengelolaan material ${P2(e.M)}% (25%) · Pemulihan lingkungan ${P2(e.E)}% (25%) · Konsistensi 7 hari ${P2(e.K)}% (20%)</p>`+
 [['Akurasi pemilahan',acc()+'%'],['Total material terpilah',ok],['Coins tertinggi',Math.max(r.maxCoins,coins)],['Unit produk dihasilkan',r.prod],['Efisiensi produksi (hasil/bahan)',r.inU?P2(r.outU/r.inU)+'%':'-'],['Skor tantangan',r.ch],['Pesanan warga dipenuhi',r.ord]].map(([a,b])=>`<div class=row><span>${a}</span><b>${b}</b></div>`).join('')}
function bookH(fb){const TB=[['up','Upgrade'],['kol','Koleksi'],['ach','Pencapaian'],['tan','Tantangan'],['pes','Pesanan'],['rek','Rekor']];
 return`<h2>Buku Terra</h2><p class=sm>Eco Score ${eco().s} · Coins ${coins} · Lv ${lv()} ${LN(lv())}</p><div class=cats>${TB.map(([k,n])=>`<button data-act="tab:${k}">${tab===k?'▶ ':''}${n}</button>`).join('')}</div>`+fb+({up:tUp,kol:tKol,ach:tAch,tan:tTan,pes:tPes,rek:tRek})[tab]()}
function bookAct(a){const[t,k]=a.split(':');
 if(t==='tab'){tab=k;return render()}
 if(t==='buy'){const u=UP.find(x=>x.id===k);if(!u||pg.up[k]||coins<u.c)return;coins-=u.c;pg.up[k]=1;capUp();hud();return render({ok:true,t:`${u.n} dibeli: ${u.e}.`})}
 if(t==='dc'||t==='wc'){const L=t==='dc'?DC:WC,p=t==='dc'?pg.d:pg.w,c=L.find(x=>x.id===k);if(!c||p.cl[k]||c.v()<c.g)return;p.cl[k]=1;xp+=c.xp;coins+=c.c;pg.rec.ch+=c.xp;hud();return render({ok:true,t:`Tantangan selesai: ${c.n}. +${c.xp} XP, +${c.c} Coins.`})}
 if(t==='od'){const o=OR.find(x=>x.id===k),w=ST.find(f=>f.id==='ware');if(!o||pg.d.od[k])return;
  if(Math.hypot(w.x-P.position.x,w.z-P.position.z)>=w.r)return render({ok:false,t:'Antar pesanan dari Gudang Distribusi.'});
  if(!Object.keys(o.need).every(x=>st[x]&&st[x].n>=o.need[x]))return render({ok:false,t:'Stok belum cukup.'});
  for(const x in o.need){st[x].n-=o.need[x];if(st[x].n<=0)delete st[x]}
  pg.d.od[k]=1;pg.d.o++;pg.w.o++;pg.rec.ord++;coins+=o.c;xp+=o.xp;trust+=2;active();hud();render({ok:true,t:`Pesanan ${o.n} terpenuhi: +${o.c} Coins, +${o.xp} XP, Trust +2.`})}}
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='b')ui==='book'?close():ui||open('book')});
const mbk=document.createElement('button');mbk.textContent='Buku';mbk.onpointerdown=()=>ui==='book'?close():ui||open('book');$('mb').appendChild(mbk);
const ep=document.createElement('div');ep.className='pill';$('hud').appendChild(ep);
setInterval(()=>{roll();if(coins>pg.rec.maxCoins)pg.rec.maxCoins=coins;if(ok!==lastOk){lastOk=ok;active()}
 AC.forEach(a=>{if(!pg.ach[a.id]&&!a.lock&&a.v()){pg.ach[a.id]=1;xp+=50;toast(`Achievement: ${a.n} (+50 XP)`);hud()}});
 const l=lv();if(l>pg.lastLv)toast(`Naik level! Lv ${l} — ${LN(l)}`);pg.lastLv=l;ep.textContent='Eco Score '+eco().s},1000);
/* ===== Save ===== */
function exportProg(){return pg}
function importProg(s){try{const n=x=>Number.isFinite(x)?x:0,r=s.rec||{},dd=s.d||{},ww=s.w||{};
 pg.rec={maxCoins:n(r.maxCoins),prod:n(r.prod),inU:n(r.inU),outU:n(r.outU),ch:n(r.ch),riv:n(r.riv),ord:n(r.ord),kc:n(r.kc)};
 pg.up={};UP.forEach(u=>{if(s.up&&s.up[u.id])pg.up[u.id]=1});pg.ach={};AC.forEach(a=>{if(s.ach&&s.ach[a.id])pg.ach[a.id]=1});
 pg.d={k:dd.k||'',ok0:n(dd.ok0),b:n(dd.b),o:n(dd.o),cl:dd.cl||{},od:dd.od||{}};pg.w={k:ww.k||'',ok0:n(ww.ok0),u:n(ww.u),o:n(ww.o),cl:ww.cl||{}};
 pg.act=Array.isArray(s.act)?s.act.filter(x=>typeof x==='string').slice(-14):[];pg.lastLv=Math.max(1,n(s.lastLv));capUp();roll()}catch(e){}}
roll();booted=true;load();lastOk=ok;hud();
