const DEFAULT_DATA = [{"name": "PAINT", "items": [{"name": "PRIMARY / SECONDARY / PEARLESCENT", "local": 30000, "import": 45000}, {"name": "CHAMELEON", "local": 25000, "import": 37500}, {"name": "INTERIOR / DASHBOARD", "local": 15000, "import": 22500}]}, {"name": "APPEARANCE — BODY PART", "items": [{"name": "SPOILER", "local": 75000, "import": 112500}, {"name": "FRONT BUMPER", "local": 50000, "import": 75000}, {"name": "REAR BUMPER", "local": 35000, "import": 52500}, {"name": "SIDE SKIRT / HOOD", "local": 30000, "import": 45000}, {"name": "ROOF / EXHAUST", "local": 25000, "import": 37500}, {"name": "FRAME (ROLLCAGE) / GRILL / ENGINE BLOCK", "local": 20000, "import": 30000}, {"name": "LEFT FENDER / RIGHT FENDER / LIVERY / TRIM", "local": 15000, "import": 22500}]}, {"name": "WINDOW TINT", "items": [{"name": "0% / 10% / 50% / 60% / 80% / 100% / WINDOW (UMUM)", "local": 20000, "import": 30000}]}, {"name": "APPEARANCE — OTHER", "items": [{"name": "WINGS", "local": 30000, "import": 45000}, {"name": "STRUTS / FRONT VANITY PLATES / LICENSE PLATE HOLDER / LICENSE PLATE / PLAQUE / SPEAKERS / TRUNK / FUEL TANK / AERIALS / ARCH COVERS / HORNS / HYDRAULICS", "local": 15000, "import": 22500}]}, {"name": "INTERIOR", "items": [{"name": "VEHICLE EXTRAS", "local": 20000, "import": 30000}, {"name": "DOOR SPEAKER", "local": 13000, "import": 19500}, {"name": "INTERIOR / ORNAMENTS / DASHBOARD / DIAL / SHIFTING LEAVERS / SEATS / STEERING WHEELS", "local": 15000, "import": 22500}]}, {"name": "NEON & XENON", "items": [{"name": "NEON ALL 4 SIDE / XENON PEMASANGAN", "local": 25000, "import": 37500}, {"name": "NEON COLOR / XENON COLOR", "local": 15000, "import": 22500}]}, {"name": "WHEEL", "items": [{"name": "WHEEL TYPES / CAMBER (STANCER)", "local": 50000, "import": 75000}, {"name": "WHEEL COLOR / TIRE SMOKE COLOR / SPACERS (STANCER)", "local": 30000, "import": 45000}, {"name": "TIRE ENHANCEMENTS", "local": 25000, "import": 37500}, {"name": "TIRE DESIGN", "local": 15000, "import": 22500}]}, {"name": "SUSPENSION", "items": [{"name": "LOWERED", "local": 15000, "import": 22500}, {"name": "STREET", "local": 20000, "import": 30000}, {"name": "SPORTS", "local": 35000, "import": 52500}, {"name": "COMPETITION", "local": 60000, "import": 90000}]}, {"name": "PERFORMANCE — HARGA ASAS", "items": [{"name": "ENGINE MOTOR", "local": 120000, "import": 120000}, {"name": "ENGINE MOBIL", "local": 150000, "import": 150000}, {"name": "BRAKES", "local": 100000, "import": 100000}, {"name": "TRANSMISSION", "local": 140000, "import": 140000}, {"name": "ARMOUR", "local": 150000, "import": 150000}, {"name": "TURBO", "local": 110000, "import": 110000}, {"name": "RATA KANAN MOTOR", "local": 620000, "import": 620000}, {"name": "RATA KANAN MOBIL", "local": 650000, "import": 650000}]}, {"name": "EXTRAS", "items": [{"name": "EXTRAS 1 / 2 / 3 / 4 / 5", "local": 15000, "import": 22500}]}];
const STORAGE_KEY='kalkulatorHargaV1';
let data=loadData(), order=[], modalTarget=null;

const $=s=>document.querySelector(s);
const money=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
function loadData(){try{const x=localStorage.getItem(STORAGE_KEY);return x?JSON.parse(x):JSON.parse(JSON.stringify(DEFAULT_DATA))}catch(e){return JSON.parse(JSON.stringify(DEFAULT_DATA))}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); render();}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function total(){return order.reduce((a,x)=>a+x.price*x.qty,0)}
function render(){
 const q=$('#search').value.trim().toLowerCase(); let count=0;
 $('#catalog').innerHTML=data.map((cat,ci)=>{
   const items=cat.items.filter(x=>!q||cat.name.toLowerCase().includes(q)||x.name.toLowerCase().includes(q));
   if(!items.length)return '';
   count+=items.length;
   return `<div class="category"><div class="cat-title"><span>${esc(cat.name)}</span><span>${items.length} item</span></div><div class="cat-items">
   ${items.map((x)=>{
     const ii=cat.items.indexOf(x);
     return `<div class="item"><div class="item-name">${esc(x.name)}</div><div class="price local">Lokal<br>${money(x.local)}</div><div class="price imp">Import<br>${money(x.import)}</div>
     <div class="add-buttons"><button class="btn small" onclick="add(${ci},${ii},'local')">+ Lokal</button><button class="btn small" onclick="add(${ci},${ii},'import')">+ Import</button></div></div>`
   }).join('')}</div></div>`;
 }).join('')||'<div class="empty">Tidak ada item yang cocok dengan pencarian.</div>';
 $('#itemCount').textContent=count+' item';
 renderOrder(); renderAdmin();
}
function add(ci,ii,type){const x=data[ci].items[ii], price=x[type]; const key=ci+'-'+ii+'-'+type; const old=order.find(o=>o.key===key); if(old)old.qty++;else order.push({key,cat:data[ci].name,name:x.name,type,price,qty:1}); renderOrder()}
function renderOrder(){
 $('#orderCount').textContent=order.reduce((a,x)=>a+x.qty,0)+' item';
 $('#orderList').innerHTML=order.length?order.map((x,i)=>`<div class="order-row"><div class="order-top"><div><div class="order-name">${esc(x.name)}</div><div class="order-meta">${esc(x.cat)} · ${x.type==='local'?'Lokal':'Import'} · ${money(x.price)}</div></div><button class="remove" onclick="removeOrder(${i})">Hapus</button></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button><input type="number" min="1" value="${x.qty}" onchange="setQty(${i},this.value)"><button onclick="changeQty(${i},1)">+</button><b style="margin-left:auto">${money(x.price*x.qty)}</b></div></div>`).join(''):'<div class="empty">Belum ada item.<br>Pilih item dari daftar harga.</div>';
 $('#grandTotal').textContent=money(total());
}
function changeQty(i,d){order[i].qty=Math.max(1,order[i].qty+d);renderOrder()}
function setQty(i,v){order[i].qty=Math.max(1,parseInt(v)||1);renderOrder()}
function removeOrder(i){order.splice(i,1);renderOrder()}
function renderAdmin(){
 $('#adminList').innerHTML=data.map((cat,ci)=>`<div class="admin-cat"><div class="admin-cat-head"><input class="text-input" value="${esc(cat.name)}" onchange="renameCat(${ci},this.value)"><button class="btn small" onclick="addItem(${ci})">＋ Item</button><button class="btn danger small" onclick="deleteCat(${ci})">Hapus</button></div><div class="admin-items">
 ${cat.items.map((x,ii)=>`<div class="admin-item"><input class="text-input item-edit-name" value="${esc(x.name)}" onchange="renameItem(${ci},${ii},this.value)"><input class="text-input" type="number" min="0" value="${x.local}" onchange="changePrice(${ci},${ii},'local',this.value)"><input class="text-input" type="number" min="0" value="${x.import}" onchange="changePrice(${ci},${ii},'import',this.value)"><button class="btn danger small" onclick="deleteItem(${ci},${ii})">Hapus</button></div>`).join('')}
 </div></div>`).join('');
}
function renameCat(ci,v){if(v.trim()){data[ci].name=v.trim();save()}}
function renameItem(ci,ii,v){if(v.trim()){data[ci].items[ii].name=v.trim();save()}}
function changePrice(ci,ii,t,v){data[ci].items[ii][t]=Math.max(0,Number(v)||0);save()}
function deleteCat(ci){if(confirm('Hapus kategori beserta semua item di dalamnya?')){data.splice(ci,1);save()}}
function deleteItem(ci,ii){if(confirm('Hapus item ini?')){data[ci].items.splice(ii,1);save()}}
function addItem(ci){data[ci].items.push({name:'ITEM BARU',local:0,import:0});save()}
function openModal(title,body){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modal').classList.remove('hidden')}
$('#addCategory').onclick=()=>openModal('Tambah Kategori',`<div class="form"><label>Nama kategori<input id="newCat" class="text-input" placeholder="Contoh: ACCESSORIES"></label><div class="form-actions"><button class="btn ghost" onclick="closeModal()">Batal</button><button class="btn primary" onclick="createCat()">Simpan</button></div></div>`);
function createCat(){const v=$('#newCat').value.trim();if(v){data.push({name:v,items:[]});save();closeModal()}}
function closeModal(){$('#modal').classList.add('hidden')}
$('#closeModal').onclick=closeModal; $('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
$('#search').oninput=render;
$('#clearOrder').onclick=()=>{order=[];renderOrder()};
$('#resetData').onclick=()=>{if(confirm('Kembalikan semua harga dan kategori ke data awal?')){data=JSON.parse(JSON.stringify(DEFAULT_DATA));localStorage.removeItem(STORAGE_KEY);order=[];render()}};
render();
