const P=['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
const mem={};
function storeGet(k,fallback){try{const v=localStorage.getItem(k);return v==null?fallback:v}catch(e){return fallback}}
function storeSet(k,v){try{localStorage.setItem(k,v)}catch(e){mem[k]=v}}
function storeRemove(k){try{localStorage.removeItem(k)}catch(e){delete mem[k]}}
let D={items:[]},X={items:[]},W={items:[]},R=JSON.parse(storeGet('speed_regions','[]')||'[]'),current={pref:'兵庫県',city:'神戸市'};
const $=id=>document.getElementById(id); const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const map=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const xsearch=q=>`https://x.com/search?q=${encodeURIComponent(q)}&src=typed_query&f=live`;
function renderRegions(){const el=$('regions');el.innerHTML=R.length?R.map((r,i)=>`<div class="region"><button data-i="${i}">${esc(r.pref)} ${esc(r.city)}</button><button class="sub" data-del="${i}">削除</button></div>`).join(''):'<div class="muted">登録地域はありません。</div>';el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const r=R[+b.dataset.i];$('pref').value=r.pref;$('city').value=r.city;current=r;render()});el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{R.splice(+b.dataset.del,1);storeSet('speed_regions',JSON.stringify(R));renderRegions()})}
function render(){
 renderRegions();
 const items=D.items.filter(x=>x.pref===current.pref&&(!current.city||x.city===current.city));
 $('official').innerHTML=items.length?items.map(x=>`<div class="card"><span class="badge">警察公式</span><b>${esc(x.police_station||x.source||'公式情報')}</b><div class="muted">${esc(x.period||'')}</div>${(x.routes||[]).map(r=>`<div class="route"><b>${esc(r.route)}</b><br>時間：${esc(r.time)}<br>規制速度：${esc(r.speed)}<br>${esc(r.reason||'')}<br><a class="mapbtn" target="_blank" rel="noopener" href="${map(current.pref+' '+current.city+' '+r.route)}">地図を見る</a></div>`).join('')}<p>${esc((x.notes||[]).join(' / '))}</p></div>`).join(''):'<div class="card muted">この地域の登録済み公式情報はありません。</div>';
 const wi=W.items.filter(x=>x.pref===current.pref&&(!x.city||x.city===current.city));
 $('web').innerHTML=wi.length?wi.map(x=>`<div class="card"><span class="badge">一般Web</span><b>${esc(x.title)}</b><p>${esc(x.summary)}</p><div class="muted">${esc(x.date||'')}</div></div>`).join(''):'<div class="card muted">関連Web情報はまだ登録されていません。</div>';
 const xi=X.items.filter(x=>x.pref===current.pref&&(!x.city||x.city===current.city));
 const speedXi=xi.filter(x=>(x.category||'speed')==='speed');
 const freezeXi=xi.filter(x=>x.category==='freeze');
 const qBase=current.pref+' '+current.city;
 const xbox=(title,arr,query,label)=>`<div class="xgroup"><h3>${title}</h3>${arr.length?arr.map(x=>`<div class="card xpost"><span class="badge">X・${label}</span><b>${esc(x.author||'')}</b><div class="muted">${esc(x.date||'')}</div><p>${esc(x.text)}</p>${x.url?`<a class="mapbtn" target="_blank" rel="noopener" href="${esc(x.url)}">元投稿を見る</a>`:''}</div>`).join(''):'<div class="card muted">登録済みの投稿はありません。</div>'}<a class="mapbtn xsearch" target="_blank" rel="noopener" href="${xsearch(query)}">𝕏で「${esc(query)}」を検索</a></div>`;
 $('xinfo').innerHTML=xbox('🚔 速度取締り',speedXi,qBase+' 速度取締り','速度取締り')+xbox('❄️ 路面凍結',freezeXi,qBase+' 路面凍結','路面凍結');
 $('maps').innerHTML=`<div class="card">${esc(current.pref)} ${esc(current.city)}<br><a class="mapbtn" target="_blank" rel="noopener" href="${map(current.pref+' '+current.city)}">選択地域をGoogleマップで開く</a></div>`;
}
async function load(){try{const [d,x,w]=await Promise.all([fetch('data/speed.json?'+Date.now()).then(r=>r.json()),fetch('data/x.json?'+Date.now()).then(r=>r.json()).catch(()=>({items:[]})),fetch('data/web.json?'+Date.now()).then(r=>r.json()).catch(()=>({items:[]}))]);D=d;X=x;W=w}catch(e){console.log('data load',e)}render()}
P.forEach(x=>$('pref').insertAdjacentHTML('beforeend',`<option>${x}</option>`));$('pref').value=current.pref;$('city').value=current.city;
$('show').onclick=()=>{current={pref:$('pref').value,city:$('city').value.trim()};render()};
$('save').onclick=()=>{const r={...current};if(!r.city)return alert('市区町村を入力してください');if(!R.some(x=>x.pref===r.pref&&x.city===r.city)){if(R.length>=20)return alert('登録できる地域は最大20件です');R.push(r);storeSet('speed_regions',JSON.stringify(R));renderRegions()}};
$('logout').onclick=()=>window.dispatchEvent(new Event('speed-lock'));
window.addEventListener('speed-auth-ok',()=>load());
