/* ===================== DATA HELPERS ===================== */
function load(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function todayStr(d){
  d = d || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function fmtDateLabel(dateStr){
  const d = new Date(dateStr+'T00:00:00');
  const days=['Sekmadienis','Pirmadienis','Antradienis','Trečiadienis','Ketvirtadienis','Penktadienis','Šeštadienis'];
  const months=['saus','vas','kov','bal','geg','birž','liep','rugp','rugs','spal','lapkr','gruod'];
  return days[d.getDay()]+', '+d.getDate()+' '+months[d.getMonth()];
}
function stripDiacritics(s){
  const map = {'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z'};
  return String(s).split('').map(ch=>map[ch]||ch).join('');
}
function normName(s){ return stripDiacritics((s||'').toLowerCase().trim()); }
function keyIncludes(haystackNorm, key){ return haystackNorm.includes(stripDiacritics(String(key).toLowerCase())); }

/* ===================== SWIPE TO DELETE ===================== */
function attachSwipeToDelete(container, selector, onDelete){
  if(!container) return;
  container.querySelectorAll(selector).forEach(item=>{
    let startX=0, dx=0, dragging=false;
    item.style.touchAction = 'pan-y';
    item.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; dragging=true; dx=0; item.style.transition='none'; }, {passive:true});
    item.addEventListener('touchmove', e=>{
      if(!dragging) return;
      dx = e.touches[0].clientX - startX;
      if(dx<0) item.style.transform = `translateX(${Math.max(dx,-90)}px)`;
    }, {passive:true});
    item.addEventListener('touchend', ()=>{
      dragging=false; item.style.transition='transform .2s';
      if(dx < -60){
        item.style.transform='translateX(-100%)'; item.style.opacity='0';
        const id = item.dataset.id;
        setTimeout(()=>onDelete(id), 180);
      } else { item.style.transform='translateX(0)'; }
      dx=0;
    });
  });
}
function parseLocaleNumber(str){
  if(str==null || str==='') return NaN;
  const n = parseFloat(String(str).trim().replace(',', '.'));
  return isNaN(n) ? NaN : n;
}
function lowPresetsForUnit(unit){
  const presets = {
    'g':[50,100,150,200,300,500], 'kg':[0.5,1,1.5,2],
    'ml':[100,200,250,500], 'l':[0.25,0.5,1],
    'vnt':[1,2,3,5], 'šauk.':[1,2,3], 'žiupsnelis':[1]
  };
  return presets[unit] || [1,2,5,10];
}
function daysUntil(dateStr){
  if(!dateStr) return null;
  const now = new Date(todayStr()+'T00:00:00');
  const target = new Date(dateStr+'T00:00:00');
  return Math.round((target-now)/86400000);
}

/* ===================== STATIC OPTIONS ===================== */
const EQUIPMENT = [
  {id:'virykle', label:'Viryklė / kaitlentė', icon:'🔥'},
  {id:'orkaite', label:'Orkaitė', icon:'🧯'},
  {id:'mikrobanges', label:'Mikrobangų krosnelė', icon:'📦'},
  {id:'greitpuodis', label:'Greitpuodis', icon:'🫕'},
  {id:'airfryer', label:'Oro gruzdintuvė', icon:'🍟'},
  {id:'blenderis', label:'Blenderis', icon:'🥤'},
  {id:'skrudintuvas', label:'Skrudintuvas', icon:'🍞'},
  {id:'multivarke', label:'Multivarkė (lėtpuodis)', icon:'🍲'},
  {id:'grilis', label:'Grilis', icon:'🍗'},
  {id:'wok', label:'Wok / gili keptuvė', icon:'🥘'}
];
const BAR_TOOLS = [
  {id:'seikeris', label:'Šeikeris (kokteilių plaktuvė)', icon:'🍸'},
  {id:'grustuve', label:'Grūstuvė (muddler)', icon:'🥄'},
  {id:'kostuvas', label:'Koštuvas', icon:'🧉'}
];
const CATEGORY_LABELS = {pusryciai:'Pusryčiai', pietus:'Pietūs', vakariene:'Vakarienė', uzkandis:'Užkandis', desertas:'Desertas', kokteiliai:'Kokteiliai'};
const CUISINE_LABELS = {tradicinis:'Tradicinis', grill:'Grill', keptuveje:'Keptuvėje', kinietiska:'Kinų virtuvė', itale:'Itališka', meksikietiska:'Meksikietiška', sriuba:'Sriubos', desertas:'Saldumynai', indiska:'Indiška', rytu:'Rytų virtuvė'};
const DIET_LABELS = {vegetariska:'Vegetariška', veganiska:'Veganiška', 'be-glitimo':'Be glitimo', 'be-laktozes':'Be laktozės', karnivoras:'Karnivoras'};
const DIFFICULTY_LABELS = {lengvas:'Lengvas', vidutinis:'Vidutinis', sunkus:'Sudėtingas'};
function computeDifficulty(r){
  if(r.time<=15 && r.steps.length<=4) return 'lengvas';
  if(r.time<=45) return 'vidutinis';
  return 'sunkus';
}
const SPIRIT_LABELS = {romas:'Romas', degtine:'Degtinė', dzinas:'Džinas', viskis:'Viskis', tequila:'Tequila', konjakas:'Konjakas', kita:'Kita/mišrus'};
const SWEETNESS_LABELS = {saldus:'Saldus', vidutinis:'Vidutinis', sausas:'Sausas'};
const PANTRY_CATEGORIES = ['Daržovės','Vaisiai','Mėsa ir žuvis','Pieno produktai','Kiaušiniai','Grūdai, kruopos ir makaronai','Miltai ir dribsniai','Duona ir kepiniai','Ankštiniai','Konservai','Šaldyti produktai','Prieskoniai ir žolelės','Padažai ir aliejus','Kepimo produktai','Saldumynai ir užkandžiai','Sultys','Gėrimai','Alkoholiniai gėrimai','Kita'];
const FRESHNESS_CATEGORIES = ['Daržovės','Vaisiai','Mėsa ir žuvis'];
const FRESHNESS_OPTIONS = ['Šviežia','Konservuota'];
const LOCATIONS = ['Šaldytuvas','Šaldiklis','Spinta'];
const UNITS = ['g','kg','ml','l','vnt','šauk.','žiupsnelis'];

/* ===================== DEFAULT UNITS & SHELF LIFE ===================== */
// Standard unit per product keyword (so entering is faster and consistent)
const DEFAULT_UNIT_BY_KEYWORD = [
  ['pienas','l'],['grietinėl','ml'],['grietin','g'],['kefyr','l'],['jogurt','g'],['varškė','g'],['sūris','g'],['sviest','g'],
  ['kiaušin','vnt'],['mėsa','kg'],['jautien','kg'],['kiaulien','kg'],['vištien','kg'],['kalakut','kg'],['žuv','kg'],['lašiš','kg'],['krevet','g'],['kumpis','g'],['dešr','g'],['bekon','g'],
  ['bulv','kg'],['morka','kg'],['svogūn','kg'],['pomidor','kg'],['agurk','kg'],['paprika','vnt'],['cukinij','vnt'],['kopūst','vnt'],['brokoli','vnt'],['česnak','vnt'],['moliūg','kg'],['salot','g'],
  ['banan','vnt'],['obuoli','kg'],['citrin','vnt'],['apelsin','vnt'],['avokad','vnt'],['uog','g'],['vaisi','kg'],
  ['miltai','kg'],['dribsni','g'],['ryžiai','kg'],['grikiai','kg'],['makaron','g'],['bulgur','g'],['manų','g'],['kruop','g'],
  ['duon','vnt'],['cukr','kg'],['druska','g'],['aliej','l'],['padaž','ml'],['medus','g'],['kakav','g'],['šokolad','g'],
  ['lęšiai','g'],['pupel','g'],['avinžirni','g'],['žirniai','g'],['sultys','l'],['vanduo','l'],['kava','g'],['arbat','g'],
  ['alus','l'],['vynas','l'],['degtin','l'],['romas','l'],['viskis','l'],['džinas','l'],['tequila','l'],['konjak','l'],
];
function defaultUnitFor(name){
  const n = normName(name);
  for(const [key,u] of DEFAULT_UNIT_BY_KEYWORD){ if(keyIncludes(n, key)) return u; }
  return 'vnt';
}
// Shelf life in days, by [keyword, {Šaldytuvas, Šaldiklis, Spinta}]
const SHELF_LIFE = [
  ['pienas', {'Šaldytuvas':7, 'Šaldiklis':90, 'Spinta':1}],
  ['grietin', {'Šaldytuvas':14, 'Šaldiklis':60, 'Spinta':1}],
  ['jogurt', {'Šaldytuvas':14, 'Šaldiklis':60, 'Spinta':1}],
  ['kefyr', {'Šaldytuvas':10, 'Šaldiklis':60, 'Spinta':1}],
  ['varškė', {'Šaldytuvas':7, 'Šaldiklis':60, 'Spinta':1}],
  ['sūris', {'Šaldytuvas':21, 'Šaldiklis':120, 'Spinta':2}],
  ['sviest', {'Šaldytuvas':30, 'Šaldiklis':180, 'Spinta':3}],
  ['kiaušin', {'Šaldytuvas':28, 'Šaldiklis':0, 'Spinta':7}],
  ['malta', {'Šaldytuvas':2, 'Šaldiklis':90, 'Spinta':0}],
  ['vištien', {'Šaldytuvas':2, 'Šaldiklis':270, 'Spinta':0}],
  ['žuv', {'Šaldytuvas':2, 'Šaldiklis':180, 'Spinta':0}],
  ['lašiš', {'Šaldytuvas':2, 'Šaldiklis':180, 'Spinta':0}],
  ['krevet', {'Šaldytuvas':2, 'Šaldiklis':180, 'Spinta':0}],
  ['mėsa', {'Šaldytuvas':3, 'Šaldiklis':180, 'Spinta':0}],
  ['jautien', {'Šaldytuvas':4, 'Šaldiklis':270, 'Spinta':0}],
  ['kiaulien', {'Šaldytuvas':3, 'Šaldiklis':180, 'Spinta':0}],
  ['kumpis', {'Šaldytuvas':7, 'Šaldiklis':60, 'Spinta':0}],
  ['dešr', {'Šaldytuvas':7, 'Šaldiklis':60, 'Spinta':0}],
  ['bekon', {'Šaldytuvas':7, 'Šaldiklis':90, 'Spinta':0}],
  ['salot', {'Šaldytuvas':5, 'Šaldiklis':0, 'Spinta':1}],
  ['pomidor', {'Šaldytuvas':7, 'Šaldiklis':0, 'Spinta':4}],
  ['agurk', {'Šaldytuvas':7, 'Šaldiklis':0, 'Spinta':3}],
  ['paprika', {'Šaldytuvas':10, 'Šaldiklis':180, 'Spinta':4}],
  ['morka', {'Šaldytuvas':21, 'Šaldiklis':180, 'Spinta':7}],
  ['bulv', {'Šaldytuvas':30, 'Šaldiklis':0, 'Spinta':30}],
  ['svogūn', {'Šaldytuvas':30, 'Šaldiklis':0, 'Spinta':30}],
  ['česnak', {'Šaldytuvas':60, 'Šaldiklis':0, 'Spinta':60}],
  ['kopūst', {'Šaldytuvas':21, 'Šaldiklis':0, 'Spinta':7}],
  ['moliūg', {'Šaldytuvas':30, 'Šaldiklis':0, 'Spinta':30}],
  ['banan', {'Šaldytuvas':7, 'Šaldiklis':60, 'Spinta':5}],
  ['obuoli', {'Šaldytuvas':30, 'Šaldiklis':0, 'Spinta':10}],
  ['citrin', {'Šaldytuvas':21, 'Šaldiklis':0, 'Spinta':10}],
  ['apelsin', {'Šaldytuvas':21, 'Šaldiklis':0, 'Spinta':10}],
  ['avokad', {'Šaldytuvas':7, 'Šaldiklis':0, 'Spinta':4}],
  ['uog', {'Šaldytuvas':5, 'Šaldiklis':180, 'Spinta':1}],
  ['duon', {'Šaldytuvas':7, 'Šaldiklis':60, 'Spinta':4}],
  ['miltai', {'Šaldytuvas':0, 'Šaldiklis':365, 'Spinta':240}],
  ['dribsni', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':300}],
  ['ryžiai', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':720}],
  ['grikiai', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':365}],
  ['makaron', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':720}],
  ['cukr', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':1000}],
  ['druska', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':1000}],
  ['aliej', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':365}],
  ['medus', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':1000}],
  ['konserv', {'Šaldytuvas':0, 'Šaldiklis':0, 'Spinta':730}],
  ['sultys', {'Šaldytuvas':7, 'Šaldiklis':0, 'Spinta':180}],
];
function shelfLifeDays(name, location){
  if(!location) return null;
  const n = normName(name);
  for(const [key, map] of SHELF_LIFE){ if(keyIncludes(n, key)){ const d = map[location]; return d && d>0 ? d : null; } }
  return null;
}
function suggestExpiry(name, location){
  const days = shelfLifeDays(name, location);
  if(!days) return null;
  const d = new Date(); d.setDate(d.getDate()+days);
  return todayStr(d);
}

/* ===================== DIET / CARNIVORE AUTO-TAGGING ===================== */
const MEAT_FISH_KEYWORDS = ['vištien','jautien','kiaulien','mėsa','kumpis','lašiš','krevet','žuv','dešra','bekon','antien','kalakut','tuno','tunas'];
const DAIRY_KEYWORDS = ['pienas','pieno','sūris','sūrio','varškė','varškės','grietin','jogurt','sviest','mascarpone'];
const EGG_KEYWORDS = ['kiaušin'];
const HONEY_KEYWORDS = ['medus','medaus'];
const GLUTEN_KEYWORDS = ['miltai','duona','duonos','makaronai','bulgur','manų','tešla','tešlos','sausain','lakštai','tortilij','taco kiaut'];
const CARNIVORE_ALLOWED = MEAT_FISH_KEYWORDS.concat(EGG_KEYWORDS).concat(['druska','pipir','aliej','sviest','vanduo']);
function computeDiet(ingredients){
  const names = ingredients.map(i=>normName(i.name));
  const has = (list)=> names.some(n=> list.some(k=>keyIncludes(n,k)));
  const hasMeat = has(MEAT_FISH_KEYWORDS), hasDairy = has(DAIRY_KEYWORDS), hasEgg = has(EGG_KEYWORDS), hasHoney = has(HONEY_KEYWORDS), hasGluten = has(GLUTEN_KEYWORDS);
  const tags=[];
  if(!hasMeat) tags.push('vegetariska');
  if(!hasMeat && !hasDairy && !hasEgg && !hasHoney) tags.push('veganiska');
  if(!hasGluten) tags.push('be-glitimo');
  if(!hasDairy) tags.push('be-laktozes');
  const isCarnivore = names.length>0 && names.every(n => CARNIVORE_ALLOWED.some(k=>keyIncludes(n,k)));
  if(isCarnivore) tags.push('karnivoras');
  return tags;
}

/* ===================== INGREDIENT NUTRITION ENGINE (per 100g/100ml) ===================== */
// Best-effort approximate values (not brand-specific). Used to auto-derive recipe nutrition
// from ingredients, so it stays accurate when quantities or servings change.
const NUTRITION100 = [
  ['kiaušininiai makaronai', [131,5,25,1.1]],
  ['lazanijos lakštai', [131,5,25,1.1]],
  ['makaronai', [131,5,25,1.1]],
  ['spagečiai', [131,5,25,1.1]],
  ['virti ryžiai', [130,2.7,28,0.3]],
  ['ryžiai rizotui', [365,7,80,0.7]],
  ['ryžiai', [365,7,80,0.7]],
  ['avižiniai dribsniai', [375,13,60,7]],
  ['avižinis pienas', [45,1,7,1.5]],
  ['pienas', [42,3.4,5,1]],
  ['grietinėl', [340,2.1,3,34]],
  ['kefyras', [41,3.4,4.8,1]],
  ['jogurt', [61,3.5,4.7,3.3]],
  ['varškė', [98,11,3.4,4.3]],
  ['mascarpone', [429,4.5,4.5,44]],
  ['mocarelos sūris', [280,28,3,17]],
  ['fetos sūris', [264,14,4,21]],
  ['sūris', [380,25,1.3,31]],
  ['sviest', [717,0.9,0.1,81]],
  ['kiaušin', [143,13,1.1,10]],
  ['bananas', [89,1.1,23,0.3]],
  ['prinokę bananai', [89,1.1,23,0.3]],
  ['avokadas', [160,2,9,15]],
  ['citrinos sultys', [22,0.3,7,0.2]],
  ['citrina', [29,1.1,9.3,0.3]],
  ['pomidorų padažas', [30,1.5,6,0.3]],
  ['pomidorų pasta', [82,4.3,19,0.5]],
  ['pomidor', [18,0.9,3.9,0.2]],
  ['agurk', [15,0.7,3.6,0.1]],
  ['morka', [41,0.9,10,0.2]],
  ['svogūnų laiškai', [32,1.8,7,0.2]],
  ['svogūn', [40,1.1,9,0.1]],
  ['česnak', [149,6.4,33,0.5]],
  ['brokoliai', [34,2.8,7,0.4]],
  ['paprika', [31,1,6,0.3]],
  ['cukinija', [17,1.2,3.1,0.3]],
  ['kopūstas', [25,1.3,5.8,0.1]],
  ['burokėli', [43,1.6,10,0.2]],
  ['moliūgas', [26,1,7,0.1]],
  ['salierai', [16,0.7,3,0.2]],
  ['salieras', [16,0.7,3,0.2]],
  ['salotos', [15,1.4,2.9,0.2]],
  ['bulvytėms', [8,0.3,1.5,0.1]],
  ['bulv', [77,2,17,0.1]],
  ['grikiai', [343,13,72,3.4]],
  ['bulgurai', [342,12.3,76,1.3]],
  ['manų kruopos', [360,12.7,73,1.1]],
  ['miltai', [364,10,76,1]],
  ['tešla', [266,9,49,3]],
  ['duonos riekelė', [265,9,49,3.2]],
  ['duona', [265,9,49,3.2]],
  ['sausain', [380,7,73,6]],
  ['tortilij', [310,8,50,7]],
  ['taco kiaut', [480,7,60,23]],
  ['koldūnų tešlos lapeliai', [250,8,50,2]],
  ['raudonieji lęšiai', [116,9,20,0.4]],
  ['baltosios pupelės', [127,8.7,23,0.5]],
  ['juodosios pupelės', [127,8.7,23,0.5]],
  ['virti avinžirniai', [164,8.9,27,2.6]],
  ['avinžirniai', [164,8.9,27,2.6]],
  ['žirniai', [81,5.4,14,0.4]],
  ['sojos padažas', [53,8,4.9,0.1]],
  ['saldžiarūgštis padažas', [120,0.5,29,0.2]],
  ['majonez', [680,1,1,75]],
  ['medus', [304,0.3,82,0]],
  ['cukr', [387,0,100,0]],
  ['kakava', [228,20,58,14]],
  ['šokoladas', [546,7.6,59,31]],
  ['kava', [1,0.1,0,0]],
  ['alyvuogių aliejus', [884,0,0,100]],
  ['aliej', [884,0,0,100]],
  ['alyvuog', [115,0.8,6,11]],
  ['graikiniai riešutai', [654,15,14,65]],
  ['žemės riešutai', [567,25,16,49]],
  ['kukurūzų traškučiai', [500,7,63,26]],
  ['kukurūzų burbuolė', [86,3.3,19,1.4]],
  ['kukurūzai', [86,3.3,19,1.4]],
  ['ananas', [50,0.5,13,0.1]],
  ['sušaldytos uogos', [43,0.7,10,0.3]],
  ['uogos', [43,0.7,10,0.3]],
  ['sezoniniai vaisiai', [55,0.7,14,0.2]],
  ['obuoli', [52,0.3,14,0.2]],
  ['krevet', [99,24,0.2,0.3]],
  ['lašiš', [208,20,0,13]],
  ['žuvies filė', [110,20,0,3]],
  ['bekonas', [541,37,1.4,42]],
  ['rūkyta mėsa', [250,20,1,18]],
  ['kumpis', [145,21,1.5,6]],
  ['dešr', [280,13,2,25]],
  ['malta jautiena', [250,26,0,17]],
  ['jautienos kepsnys', [190,28,0,8]],
  ['jautien', [250,26,0,17]],
  ['malta kiauliena', [263,17,0,21]],
  ['kiaulien', [242,27,0,14]],
  ['malta mėsa', [250,17,0,20]],
  ['vištienos krūtinėlė', [165,31,0,3.6]],
  ['vištienos filė', [165,31,0,3.6]],
  ['vištienos šlaunelės', [209,26,0,11]],
  ['vištienos sparneliai', [290,27,0,19]],
  ['vištien', [165,31,0,3.6]],
  ['kalakut', [135,30,0,1.7]],
  ['tuno', [132,28,0,1.3]],
  ['daržovių sultinys', [5,0.3,1,0.1]],
  ['pievagrybiai', [22,3.1,3.3,0.3]],
  ['druska', [0,0,0,0]],
  ['pipir', [0,0,0,0]],
  ['krapai', [43,3.5,7,1.1]],
  ['prieskoniai', [8,0.3,1.5,0.1]],
  ['vanduo', [0,0,0,0]],
  ['bazilik', [23,3.2,2.7,0.6]],
  ['actas', [19,0,0.4,0]],
  ['uogien', [250,0.5,62,0.2]],
  ['špinat', [23,2.9,3.6,0.4]],
  ['curry', [10,0.5,1.5,0.3]],
  ['kokos pien', [230,2.3,6,24]],
  ['tahin', [595,17,21,53]],
  ['sultinys', [7,0.5,1,0.2]],
  ['spanguoli', [46,0.4,12,0.1]],
  ['garstyč', [66,4.4,5,3.3]],
  ['cinamon', [247,4,80,1.2]],
  ['baklažan', [25,1,6,0.2]],
  ['žiedini', [25,1.9,5,0.3]],
  ['batonas', [265,9,49,3.2]],
  ['petražol', [36,3,6,0.8]],
  ['sluoksniuota tešla', [551,7,45,38]],
  ['sezam', [573,17,23,50]],
  ['imbier', [80,1.8,18,0.8]],
  ['mocarela', [280,28,3,17]],
  ['rozmarin', [131,3.3,21,6]],
  ['džiūvės', [395,13,72,5]],
  ['žalieji lęšiai', [116,9,20,0.4]]
];
function nutritionFor100g(name){
  const n = normName(name);
  for(const [key,val] of NUTRITION100){ if(keyIncludes(n,key)) return val; }
  return [80,3,10,3]; // neutral fallback for unrecognized ingredients
}
const UNIT_GRAMS = [
  ['kiaušin',55],['bananas',120],['prinokę bananai',120],['avokadas',200],['citrina',100],
  ['agurk',200],['svogūn',110],['morka',70],['pomidor',120],['paprika',150],['cukinija',200],
  ['burokėli',110],['bulv',150],['kopūstas',1000],['duonos riekelė',30],['kukurūzų burbuolė',150],
  ['maltos mėsos kotletai',100],['koldūnų tešlos lapeliai',8],['česnak',5],['salieras',40],
  ['taco kiaut',12],['tortilij',45],['žuvies filė',150]
];
function gramsForVnt(name){
  const n = normName(name);
  for(const [key,g] of UNIT_GRAMS){ if(keyIncludes(n,key)) return g; }
  return 50;
}
function gramsForIngredient(ing){
  const q = ing.qty, u = ing.unit;
  if(u==='g') return q;
  if(u==='kg') return q*1000;
  if(u==='ml') return q; // approx density 1 for home cooking liquids
  if(u==='l') return q*1000;
  if(u==='šauk.') return q*15;
  if(u==='žiupsnelis') return q*0.4;
  if(u==='vnt') return q*gramsForVnt(ing.name);
  return q*10;
}
function computeIngredientsNutrition(ingredients, servings){
  let kcal=0, protein=0, carbs=0, fat=0;
  ingredients.forEach(ing=>{
    const grams = gramsForIngredient(ing);
    const [k,p,c,f] = nutritionFor100g(ing.name);
    kcal += grams/100*k; protein += grams/100*p; carbs += grams/100*c; fat += grams/100*f;
  });
  const s = servings || 1;
  return { kcal: Math.round(kcal/s), protein: Math.round(protein/s*10)/10, carbs: Math.round(carbs/s*10)/10, fat: Math.round(fat/s*10)/10 };
}

/* ===================== INGREDIENT SUBSTITUTIONS ===================== */
const SUBSTITUTES = [
  ['kiaušin', 'linų sėmenų + vandens mišinys (1 šauk. linų sėmenų + 3 šauk. vandens)'],
  ['pienas', 'augalinis pienas (avižinis, migdolų)'],
  ['sviest', 'aliejus arba margarinas'],
  ['grietinėl', 'kokosų grietinėlė'],
  ['varškė', 'grietininis sūris (varškės tipo)'],
  ['jogurt', 'kefyras arba grietinė'],
  ['medus', 'klevų sirupas arba cukrus'],
  ['citrinos sultys', 'actas (mažesniu kiekiu)'],
  ['majonez', 'graikiškas jogurtas'],
  ['sojos padažas', 'druska + trupinys česnako miltelių'],
  ['bulgurai', 'kuskusas arba grikiai'],
  ['makaronai', 'grikiai arba ryžiai'],
  ['duonos riekelė', 'traškūs duonos gabalėliai arba lavašas'],
];
function substituteFor(name){
  const n = normName(name);
  for(const [key,sub] of SUBSTITUTES){ if(keyIncludes(n,key)) return sub; }
  return null;
}

/* ===================== RECIPE BUILDER ===================== */
function mk(id,name,category,equipment,time,servings,kcal,protein,carbs,fat,ingredientsRaw,steps,cuisine){
  const ingredients = ingredientsRaw.map(([n,q,u])=>({name:n, qty:q, unit:u}));
  return { id, name, category, equipment, time, servings, kcal, protein, carbs, fat, ingredients, steps,
    builtin:true, cuisine: cuisine || 'tradicinis', diet: computeDiet(ingredients) };
}
function applyComputedNutrition(recipes){
  recipes.forEach(r=>{
    const computed = computeIngredientsNutrition(r.ingredients, r.servings);
    if(computed.kcal>0){ r.kcal=computed.kcal; r.protein=computed.protein; r.carbs=computed.carbs; r.fat=computed.fat; }
  });
}

/* ===================== BUILT-IN FOOD RECIPES ===================== */
const BUILTIN_RECIPES = [
mk('r01','Avižinė košė su bananu','pusryciai',['virykle'],10,1,320,10,55,7,
  [['Avižiniai dribsniai',50,'g'],['Pienas',200,'ml'],['Bananas',1,'vnt'],['Medus',1,'šauk.']],
  ['Puode užvirink pieną.','Suber avižinius dribsnius, virk ~5 min. maišydamas.','Supjaustyk bananą ir sudėk į košę.','Užpilk medumi ir patiekk.']),
mk('r02','Kiaušinienė su pomidorais','pusryciai',['virykle'],10,1,280,16,6,20,
  [['Kiaušiniai',3,'vnt'],['Pomidoras',1,'vnt'],['Sviestas',10,'g'],['Druska',1,'žiupsnelis']],
  ['Įkaitink keptuvę su sviestu.','Supjaustyk pomidorą kubeliais, pakepink 2 min.','Įmuši kiaušinius, pasūdyk.','Kepk ant vidutinės ugnies, kol sustings.']),
mk('r03','Grikiai su daržovėmis','pietus',['virykle'],25,2,380,12,60,9,
  [['Grikiai',150,'g'],['Morka',1,'vnt'],['Svogūnas',1,'vnt'],['Aliejus',2,'šauk.']],
  ['Išvirk grikius pagal instrukciją ant pakuotės.','Susmulkink morką ir svogūną.','Pakepink daržoves aliejuje, kol suminkštės.','Sumaišyk su išvirtais grikiais.']),
mk('r04','Vištienos krūtinėlė orkaitėje su bulvėmis','vakariene',['orkaite'],45,2,520,42,45,16,
  [['Vištienos krūtinėlė',400,'g'],['Bulvės',500,'g'],['Aliejus',2,'šauk.'],['Prieskoniai vištienai',1,'šauk.']],
  ['Įkaitink orkaitę iki 200°C.','Supjaustyk bulves griežinėliais, apibarstyk prieskoniais ir aliejumi.','Sudėk vištieną ir bulves į skardą.','Kepk 35–40 min., kol paruduos.']),
mk('r05','Makaronai su pomidorų padažu','pietus',['virykle'],20,2,450,14,70,12,
  [['Makaronai',200,'g'],['Pomidorų padažas',300,'g'],['Česnakas',2,'vnt'],['Alyvuogių aliejus',1,'šauk.']],
  ['Išvirk makaronus pagal instrukciją.','Pakepink smulkintą česnaką aliejuje.','Įpilk pomidorų padažą, pakaitink 5 min.','Sumaišyk su makaronais.'],'itale'),
mk('r06','Daržovių sriuba','pietus',['virykle'],35,4,180,6,28,4,
  [['Bulvės',300,'g'],['Morka',2,'vnt'],['Svogūnas',1,'vnt'],['Daržovių sultinys',1,'l']],
  ['Supjaustyk visas daržoves kubeliais.','Sudėk į puodą su sultiniu.','Virk ant vidutinės ugnies 25 min.','Prieš patiekiant pagardink prieskoniais.'],'sriuba'),
mk('r07','Bulvių košė su kotletu','vakariene',['virykle'],40,2,560,28,48,28,
  [['Bulvės',500,'g'],['Pienas',100,'ml'],['Sviestas',20,'g'],['Maltos mėsos kotletai',2,'vnt']],
  ['Nulupk ir išvirk bulves.','Sutrink su pienu ir sviestu į košę.','Iškepk kotletus keptuvėje abiem pusėm.','Patiekk košę su kotletais.']),
mk('r08','Grilio vištiena su daržovėmis','vakariene',['grilis'],30,2,420,40,18,20,
  [['Vištienos filė',400,'g'],['Cukinija',1,'vnt'],['Paprika',1,'vnt'],['Alyvuogių aliejus',2,'šauk.']],
  ['Marinuok vištieną aliejuje su prieskoniais 15 min.','Supjaustyk daržoves griežinėliais.','Kepk ant grilio abi puses po 6–7 min.','Grilink ir daržoves, patiekk kartu.'],'grill'),
mk('r09','Omletas su sūriu','pusryciai',['virykle'],10,1,300,18,4,24,
  [['Kiaušiniai',3,'vnt'],['Kietasis sūris',30,'g'],['Pienas',30,'ml'],['Sviestas',10,'g']],
  ['Išplak kiaušinius su pienu.','Įkaitink keptuvę su sviestu.','Supilk masę, kepk ant mažos ugnies.','Prieš sulankstant apibarstyk tarkuotu sūriu.']),
mk('r10','Avokado skrebutis','pusryciai',['skrudintuvas'],8,1,280,8,24,18,
  [['Duonos riekelė',2,'vnt'],['Avokadas',1,'vnt'],['Citrinos sultys',1,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Paskrudink duonos riekeles.','Sutrink avokadą su citrinos sultimis ir druska.','Užtepk ant skrebučių.','Patiekk iškart.']),
mk('r11','Vaisių ir jogurto kokteilis','uzkandis',['blenderis'],5,1,220,9,38,4,
  [['Bananas',1,'vnt'],['Uogos',100,'g'],['Jogurtas',150,'g'],['Medus',1,'šauk.']],
  ['Sudėk visus ingredientus į blenderį.','Plakti apie 1 min., kol taps vientisas.','Supilk į stiklinę.','Patiekk iškart.']),
mk('r12','Lęšių troškinys','pietus',['greitpuodis'],30,3,340,20,48,8,
  [['Raudonieji lęšiai',200,'g'],['Svogūnas',1,'vnt'],['Morka',1,'vnt'],['Pomidorų padažas',200,'g']],
  ['Sudėk visus ingredientus į greitpuodį.','Įpilk truputį vandens.','Troškink pagal greitpuodžio instrukciją ~15 min.','Prieš patiekiant pagardink prieskoniais.']),
mk('r13','Oro gruzdintuvėje keptos bulvytės','uzkandis',['airfryer'],25,2,260,5,42,8,
  [['Bulvės',400,'g'],['Aliejus',1,'šauk.'],['Prieskoniai bulvytėms',1,'šauk.']],
  ['Supjaustyk bulves lazdelėmis.','Apibarstyk aliejumi ir prieskoniais.','Kepk oro gruzdintuvėje 200°C apie 18–20 min.','Kelis kartus papurtyk krepšelį.']),
mk('r14','Oro gruzdintuvėje keptas vištienos filė','vakariene',['airfryer'],20,2,380,45,4,18,
  [['Vištienos filė',400,'g'],['Aliejus',1,'šauk.'],['Prieskoniai mėsai',1,'šauk.']],
  ['Apteptas vištieną aliejumi ir prieskoniais.','Sudėk į oro gruzdintuvę.','Kepk 180°C apie 14–16 min., apverskite per pusę.','Patikrink, ar iškepė iki galo.']),
mk('r15','Wok daržovės su krevetėmis','vakariene',['wok'],20,2,350,30,20,14,
  [['Krevetės',300,'g'],['Brokoliai',200,'g'],['Paprika',1,'vnt'],['Sojos padažas',2,'šauk.']],
  ['Įkaitink wok keptuvę su aliejumi.','Sudėk krevetes, kepk 2–3 min.','Įmesk daržoves, kepk ant stiprios ugnies 5 min.','Užpilk sojos padažu ir pamaišyk.'],'kinietiska'),
mk('r16','Rizotas su grybais','vakariene',['virykle'],35,2,460,12,65,16,
  [['Ryžiai rizotui',200,'g'],['Pievagrybiai',200,'g'],['Svogūnas',1,'vnt'],['Daržovių sultinys',600,'ml']],
  ['Pakepink smulkintą svogūną ir grybus.','Suber ryžius, trumpai pakepink.','Po truputį pilk karštą sultinį, maišydamas.','Virk ~20 min., kol ryžiai suminkštės.'],'itale'),
mk('r17','Bulgurų salotos su daržovėmis','pietus',['virykle'],20,2,320,10,50,8,
  [['Bulgurai',150,'g'],['Agurkas',1,'vnt'],['Pomidoras',1,'vnt'],['Citrinos sultys',1,'šauk.']],
  ['Išvirk bulgurus pagal instrukciją.','Supjaustyk agurką ir pomidorą kubeliais.','Sumaišyk su atvėsintais bulgurais.','Pagardink citrinos sultimis.']),
mk('r18','Sumuštinis su kumpiu ir sūriu','uzkandis',['skrudintuvas'],8,1,350,18,30,16,
  [['Duonos riekelė',2,'vnt'],['Kumpis',50,'g'],['Kietasis sūris',30,'g'],['Sviestas',5,'g']],
  ['Sudėk kumpį ir sūrį tarp duonos riekelių.','Ištepk išorę sviestu.','Skrudink tosteryje ar keptuvėje, kol sūris ištirps.','Perpjauk pusiau ir patiekk.']),
mk('r19','Mikrobangėse kepta bulvė su varške','pietus',['mikrobanges'],12,1,310,14,48,8,
  [['Bulvė',1,'vnt'],['Varškė',100,'g'],['Krapai',1,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Pradurk bulvę šakute keliose vietose.','Kepk mikrobangėse 6–8 min. galingiausiu režimu.','Perpjauk ir įdėk varškę.','Apibarstyk krapais ir druska.']),
mk('r20','Varškės apkepas','pusryciai',['orkaite'],40,4,280,18,30,9,
  [['Varškė',500,'g'],['Kiaušiniai',2,'vnt'],['Manų kruopos',3,'šauk.'],['Cukrus',2,'šauk.']],
  ['Sumaišyk varškę, kiaušinius, manus ir cukrų.','Sudėk masę į kepimo formą.','Kepk orkaitėje 180°C apie 30 min.','Leisk atvėsti prieš pjaustant.'],'desertas'),
mk('r21','Multivarkėje troškinta jautiena','vakariene',['multivarke'],90,4,480,35,20,26,
  [['Jautiena',600,'g'],['Svogūnas',1,'vnt'],['Morka',1,'vnt'],['Pomidorų pasta',2,'šauk.']],
  ['Supjaustyk jautieną gabaliukais.','Sudėk visus ingredientus į multivarkę.','Įjunk troškinimo režimą 60–70 min.','Prieš patiekiant pagardink prieskoniais.']),
mk('r22','Graikiškos salotos','pietus',[],15,2,260,7,12,20,
  [['Pomidorai',3,'vnt'],['Agurkas',1,'vnt'],['Fetos sūris',100,'g'],['Alyvuogės',50,'g']],
  ['Supjaustyk daržoves stambiais gabalais.','Sudėk į dubenį su alyvuogėmis.','Ant viršaus sudėk fetos sūrį.','Apibarstyk aliejumi ir prieskoniais.']),
mk('r23','Kiaušinių salotos su majonezu','pietus',['virykle'],20,2,340,14,8,28,
  [['Kiaušiniai',4,'vnt'],['Majonezas',3,'šauk.'],['Svogūnų laiškai',1,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Kietai išvirk kiaušinius (~9 min.).','Atvėsink ir supjaustyk kubeliais.','Sumaišyk su majonezu ir svogūnų laiškais.','Pagardink druska.']),
mk('r24','Blynai su varške','pusryciai',['virykle'],25,3,380,16,45,14,
  [['Miltai',200,'g'],['Kiaušiniai',2,'vnt'],['Pienas',300,'ml'],['Varškė',200,'g']],
  ['Sumaišyk miltus, kiaušinius ir pieną į tešlą.','Kepk plonus blynus keptuvėje.','Įdėk varškės įdaro į kiekvieną blyną.','Suvyniok ir patiekk.']),
mk('r25','Greitpuodyje virti barščiai','pietus',['greitpuodis'],35,4,220,8,30,7,
  [['Burokėliai',3,'vnt'],['Kopūstas',200,'g'],['Bulvės',200,'g'],['Pomidorų pasta',1,'šauk.']],
  ['Susmulkink visas daržoves.','Sudėk į greitpuodį su vandeniu ir pomidorų pasta.','Virk pagal greitpuodžio instrukciją ~15 min.','Prieš patiekiant pagardink prieskoniais.'],'sriuba'),
mk('r26','Kepta lašiša orkaitėje','vakariene',['orkaite'],25,2,420,38,4,28,
  [['Lašišos filė',400,'g'],['Citrina',1,'vnt'],['Alyvuogių aliejus',1,'šauk.'],['Krapai',1,'šauk.']],
  ['Įkaitink orkaitę iki 200°C.','Sudėk lašišą į skardą, apšlakstyk aliejumi ir citrina.','Apibarstyk krapais.','Kepk 15–18 min.']),
mk('r27','Uogų ir avižų smoothie bowl','pusryciai',['blenderis'],10,1,310,11,52,7,
  [['Sušaldytos uogos',150,'g'],['Bananas',1,'vnt'],['Avižinis pienas',100,'ml'],['Avižiniai dribsniai',2,'šauk.']],
  ['Sudėk uogas, bananą ir pieną į blenderį.','Plakti iki tirštos konsistencijos.','Supilk į dubenėlį.','Papuošk avižiniais dribsniais.']),
mk('r28','Traškūs avinžirniai orkaitėje','uzkandis',['orkaite'],35,2,210,9,28,7,
  [['Virti avinžirniai',250,'g'],['Aliejus',1,'šauk.'],['Prieskoniai',1,'šauk.']],
  ['Nusausink avinžirnius popieriniu rankšluosčiu.','Sumaišyk su aliejumi ir prieskoniais.','Kepk orkaitėje 200°C apie 25–30 min.','Kelis kartus pamaišyk kepimo metu.']),
mk('r29','Grilio jautienos kepsniai','vakariene',['grilis'],25,2,520,45,2,35,
  [['Jautienos kepsnys',400,'g'],['Aliejus',1,'šauk.'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Ištrauk mėsą iš šaldytuvo 20 min. prieš kepimą.','Ištepk aliejumi, pagardink druska ir pipirais.','Kepk ant įkaitusio grilio po 4–5 min. kiekvieną pusę.','Prieš pjaustant leisk mėsai "pailsėti" 5 min.'],'grill'),
mk('r30','Grilio daržovių iešmeliai','uzkandis',['grilis'],20,2,180,4,16,11,
  [['Cukinija',1,'vnt'],['Paprika',1,'vnt'],['Svogūnas',1,'vnt'],['Alyvuogių aliejus',1,'šauk.']],
  ['Supjaustyk daržoves stambiais kubeliais.','Sudėk kaitaliodamas ant iešmelių.','Apšlakstyk aliejumi ir pagardink.','Kepk ant grilio 10–12 min., apverčiant.'],'grill'),
mk('r31','Grilio lašiša su citrina','vakariene',['grilis'],20,2,400,37,3,27,
  [['Lašišos filė',400,'g'],['Citrina',1,'vnt'],['Alyvuogių aliejus',1,'šauk.'],['Krapai',1,'šauk.']],
  ['Ištepk lašišą aliejumi, pabarstyk krapais.','Kepk ant grilio odele žemyn 6–7 min.','Apversk ir kepk dar 3–4 min.','Patiekk su citrinos griežinėliais.'],'grill'),
mk('r32','Grilio kukurūzai su sviestu','uzkandis',['grilis'],15,4,180,4,26,7,
  [['Kukurūzų burbuolės',4,'vnt'],['Sviestas',30,'g'],['Druska',1,'žiupsnelis']],
  ['Nulupk kukurūzų lukštus.','Kepk ant grilio 10–12 min., pasukinėdamas.','Ištepk karštus kukurūzus sviestu.','Pagardink druska ir patiekk.'],'grill'),
mk('r33','Grilio krevečių iešmeliai','uzkandis',['grilis'],15,2,240,28,4,13,
  [['Krevetės',300,'g'],['Česnakas',2,'vnt'],['Alyvuogių aliejus',1,'šauk.'],['Citrina',1,'vnt']],
  ['Marinuok krevetes su česnaku, aliejumi ir citrina 10 min.','Suvarstyk ant iešmelių.','Kepk ant grilio po 2 min. kiekvieną pusę.','Patiekk su likusiais citrinos griežinėliais.'],'grill'),
mk('r34','Keptos vištienos šlaunelės keptuvėje','vakariene',['virykle'],35,2,480,38,4,32,
  [['Vištienos šlaunelės',500,'g'],['Aliejus',1,'šauk.'],['Prieskoniai vištienai',1,'šauk.']],
  ['Pagardink šlauneles prieskoniais.','Įkaitink keptuvę su aliejumi.','Kepk odele žemyn 8 min., tada apversk.','Kepk dar 10–12 min. ant mažesnės ugnies, kol iškeps.'],'keptuveje'),
mk('r35','Kepti balandėliai','vakariene',['virykle'],50,4,420,22,30,22,
  [['Kopūstas',1,'vnt'],['Malta mėsa',400,'g'],['Ryžiai',100,'g'],['Pomidorų padažas',200,'g']],
  ['Apvirink kopūsto lapus, kol suminkštės.','Sumaišyk maltą mėsą su iš pusės išvirtais ryžiais.','Suvyniok įdarą į kopūsto lapus.','Troškink keptuvėje su pomidorų padažu 30 min.'],'keptuveje'),
mk('r36','Kepta žuvis su bulvėmis keptuvėje','vakariene',['virykle'],30,2,460,32,38,20,
  [['Žuvies filė',400,'g'],['Bulvės',400,'g'],['Miltai',2,'šauk.'],['Aliejus',2,'šauk.']],
  ['Apvoliok žuvį miltuose.','Kepk keptuvėje po 3–4 min. kiekvieną pusę.','Bulves supjaustyk ir kepk atskirai iki auksinės spalvos.','Patiekk kartu.'],'keptuveje'),
mk('r37','Keptos cukinijos su česnaku','uzkandis',['virykle'],15,2,140,3,10,10,
  [['Cukinija',2,'vnt'],['Česnakas',2,'vnt'],['Alyvuogių aliejus',1,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Supjaustyk cukiniją griežinėliais.','Kepk keptuvėje su aliejumi 2–3 min. kiekvieną pusę.','Prieš pabaigą sudėk susmulkintą česnaką.','Pagardink druska ir patiekk.'],'keptuveje'),
mk('r38','Kepti varškėčiai','pusryciai',['virykle'],20,3,320,16,36,12,
  [['Varškė',400,'g'],['Kiaušiniai',1,'vnt'],['Miltai',4,'šauk.'],['Cukrus',2,'šauk.']],
  ['Sumaišyk varškę, kiaušinį, cukrų ir miltus.','Suformuok apvalius sūrelius, apvolyk miltuose.','Kepk keptuvėje ant vidutinės ugnies iš abiejų pusių.','Patiekk su grietine ar uogiene.'],'keptuveje'),
mk('r39','Kinietiški makaronai su vištiena','vakariene',['wok'],25,2,480,35,50,15,
  [['Kiaušininiai makaronai',200,'g'],['Vištienos filė',300,'g'],['Morka',1,'vnt'],['Sojos padažas',2,'šauk.']],
  ['Išvirk makaronus, nusausink.','Wok keptuvėje apkepink supjaustytą vištieną.','Įmesk susmulkintą morką, pakepink 3 min.','Sudėk makaronus ir sojos padažą, viską išmaišyk.'],'kinietiska'),
mk('r40','Saldžiarūgštė vištiena','vakariene',['wok'],30,2,520,34,55,18,
  [['Vištienos filė',400,'g'],['Ananasų gabaliukai',150,'g'],['Paprika',1,'vnt'],['Saldžiarūgštis padažas',100,'g']],
  ['Supjaustyk vištieną kubeliais ir apkepink wok keptuvėje.','Sudėk papriką, pakepink 3 min.','Įpilk saldžiarūgštį padažą ir ananasus.','Pakaitink 5 min., maišydamas, ir patiekk su ryžiais.'],'kinietiska'),
mk('r41','Kinietiški koldūnai garuose','uzkandis',['virykle'],35,4,260,12,32,9,
  [['Koldūnų tešlos lapeliai',20,'vnt'],['Malta kiauliena',250,'g'],['Kopūstas',100,'g'],['Sojos padažas',1,'šauk.']],
  ['Sumaišyk maltą mėsą su smulkintu kopūstu ir sojos padažu.','Sudėk įdarą į tešlos lapelius, suformuok koldūnus.','Virk garuose ~15 min.','Patiekk su sojos padažu makstymui.'],'kinietiska'),
mk('r42','Kung Pao vištiena su riešutais','vakariene',['wok'],25,2,500,36,28,26,
  [['Vištienos filė',400,'g'],['Žemės riešutai',60,'g'],['Paprika',1,'vnt'],['Sojos padažas',2,'šauk.']],
  ['Supjaustyk vištieną kubeliais.','Apkepink wok keptuvėje su papriku.','Įpilk sojos padažą ir pakaitink 3 min.','Prieš patiekiant apibarstyk riešutais.'],'kinietiska'),
mk('r43','Kinietiška keptų ryžių keptuvė','pietus',['wok'],20,2,420,14,60,12,
  [['Virti ryžiai',300,'g'],['Kiaušiniai',2,'vnt'],['Morka',1,'vnt'],['Sojos padažas',2,'šauk.']],
  ['Wok keptuvėje apkepink plaktus kiaušinius, išimk.','Pakepink smulkintą morką.','Sudėk ryžius ir sojos padažą, kepk 3–4 min.','Sumaišyk su kiaušiniais ir patiekk.'],'kinietiska'),
mk('r44','Naminė pica su daržovėmis','vakariene',['orkaite'],40,2,560,20,70,20,
  [['Picos tešla',300,'g'],['Pomidorų padažas',100,'g'],['Mocarelos sūris',150,'g'],['Paprika',1,'vnt']],
  ['Iškočiok tešlą ir sudėk ant skardos.','Patepk pomidorų padažu.','Apibarstyk sūriu ir sudėk daržoves.','Kepk orkaitėje 220°C apie 12–15 min.'],'itale'),
mk('r45','Lazanija','vakariene',['orkaite'],60,4,540,28,42,28,
  [['Lazanijos lakštai',250,'g'],['Malta mėsa',400,'g'],['Pomidorų padažas',300,'g'],['Mocarelos sūris',150,'g']],
  ['Paruošk mėsos padažą su pomidorų padažu.','Klok sluoksniais: lakštai, padažas, sūris.','Kartok sluoksnius, viršuje sūris.','Kepk orkaitėje 180°C apie 35–40 min.'],'itale'),
mk('r46','Spagečiai Karbonara','vakariene',['virykle'],20,2,560,24,58,26,
  [['Spagečiai',200,'g'],['Bekonas',100,'g'],['Kiaušiniai',2,'vnt'],['Kietasis sūris',40,'g']],
  ['Išvirk spagečius pagal instrukciją.','Apkepink bekoną keptuvėje.','Sumaišyk plaktus kiaušinius su tarkuotu sūriu.','Sujungk viską su karštais spagečiais ne ant ugnies, kad kiaušinis nesutraukėtų.'],'itale'),
mk('r47','Minestrone sriuba','pietus',['virykle'],35,4,240,9,34,7,
  [['Baltosios pupelės',200,'g'],['Morka',1,'vnt'],['Salieras',1,'vnt'],['Pomidorų padažas',200,'g']],
  ['Pakepink smulkintas daržoves.','Sudėk pomidorų padažą ir vandenį.','Virk 20 min.','Prieš pabaigą sudėk pupeles ir pakaitink 5 min.'],'itale'),
mk('r48','Tiramisu','desertas',[],20,4,380,7,34,24,
  [['Sausainiai Savoiardi',150,'g'],['Mascarpone sūris',250,'g'],['Kava',150,'ml'],['Kakava',1,'šauk.']],
  ['Pamirkyk sausainius kavoje.','Sudėk sluoksniu į indą.','Ant viršaus tepk mascarpone kremą.','Kartok sluoksnius, apibarstyk kakava ir šaldyk 2 val.'],'itale'),
mk('r49','Kesadilijos su sūriu ir vištiena','uzkandis',['virykle'],15,2,420,26,32,22,
  [['Tortilijos',2,'vnt'],['Vištienos filė',150,'g'],['Kietasis sūris',80,'g'],['Paprika',1,'vnt']],
  ['Apkepink supjaustytą vištieną su papriku.','Ant tortilijos sudėk įdarą ir sūrį, uždenk kita tortilija.','Kepk keptuvėje po 2 min. iš kiekvienos pusės.','Supjaustyk trikampiais ir patiekk.'],'meksikietiska'),
mk('r50','Jautienos takai','vakariene',['virykle'],25,2,460,28,36,22,
  [['Malta jautiena',300,'g'],['Taco kiautai',6,'vnt'],['Pomidoras',1,'vnt'],['Salotos',50,'g']],
  ['Apkepink maltą jautieną su meksikietiškais prieskoniais.','Susmulkink pomidorą ir salotas.','Įdėk mėsą į taco kiautus.','Papuošk daržovėmis ir patiekk.'],'meksikietiska'),
mk('r51','Burrito dubenėlis su pupelėmis','pietus',['virykle'],25,2,420,15,64,10,
  [['Ryžiai',150,'g'],['Juodosios pupelės',200,'g'],['Avokadas',1,'vnt'],['Kukurūzai',100,'g']],
  ['Išvirk ryžius.','Pašildyk pupeles ir kukurūzus.','Sudėk viską į dubenėlį sluoksniais.','Ant viršaus sudėk avokado griežinėlius.'],'meksikietiska'),
mk('r52','Guacamole su traškučiais','uzkandis',[],10,2,280,4,26,18,
  [['Avokadas',2,'vnt'],['Citrinos sultys',1,'šauk.'],['Pomidoras',1,'vnt'],['Kukurūzų traškučiai',100,'g']],
  ['Sutrink avokadus šakute.','Sumaišyk su citrinos sultimis ir smulkintu pomidoru.','Pagardink druska.','Patiekk su kukurūzų traškučiais.'],'meksikietiska'),
mk('r53','Meksikietiška vištienos sriuba','pietus',['virykle'],35,4,280,22,26,10,
  [['Vištienos filė',300,'g'],['Pomidorų padažas',200,'g'],['Kukurūzai',100,'g'],['Tortilijos',2,'vnt']],
  ['Išvirk vištieną sultinyje, susmulkink.','Sudėk pomidorų padažą ir kukurūzus.','Virk 15 min.','Patiekk su tortilijų juostelėmis viršuje.'],'meksikietiska'),
mk('r54','Žirnių sriuba su rūkyta mėsa','pietus',['virykle'],40,4,260,16,32,8,
  [['Žirniai',250,'g'],['Rūkyta mėsa',150,'g'],['Bulvės',200,'g'],['Svogūnas',1,'vnt']],
  ['Išmirkyk žirnius (jei sausi).','Sudėk visus ingredientus į puodą su vandeniu.','Virk ant mažos ugnies ~30 min.','Prieš patiekiant sugrūsk dalį žirnių tirštumui.'],'sriuba'),
mk('r55','Moliūgų kreminė sriuba','pietus',['virykle','blenderis'],30,4,200,4,28,8,
  [['Moliūgas',500,'g'],['Svogūnas',1,'vnt'],['Daržovių sultinys',600,'ml'],['Grietinėlė',50,'ml']],
  ['Supjaustyk moliūgą ir svogūną kubeliais.','Virk sultinyje 20 min., kol suminkštės.','Sutrink blenderiu iki lygios masės.','Įpilk grietinėlės ir pakaitink.'],'sriuba'),
mk('r56','Šaltibarščiai','pietus',[],15,2,220,9,26,9,
  [['Burokėliai (virti)',300,'g'],['Kefyras',400,'ml'],['Agurkas',1,'vnt'],['Kiaušiniai',2,'vnt']],
  ['Susmulkink virtus burokėlius ir agurką.','Sumaišyk su kefyru.','Atšaldyk šaldytuve bent 30 min.','Patiekk su perpjautu virtu kiaušiniu.'],'sriuba'),
mk('r57','Obuolių pyragas','desertas',['orkaite'],55,6,340,5,52,12,
  [['Obuoliai',4,'vnt'],['Miltai',250,'g'],['Cukrus',150,'g'],['Sviestas',100,'g']],
  ['Supjaustyk obuolius griežinėliais.','Sumaišyk miltus, cukrų ir sviestą į trupinių tešlą.','Sudėk pusę tešlos į formą, ant viršaus obuolius, tada likusią tešlą.','Kepk orkaitėje 180°C apie 40 min.'],'desertas'),
mk('r58','Šokoladiniai keksiukai','desertas',['orkaite'],30,6,290,4,38,14,
  [['Miltai',200,'g'],['Cukrus',150,'g'],['Kiaušiniai',2,'vnt'],['Šokoladas',100,'g']],
  ['Sumaišyk miltus ir cukrų.','Įmuši kiaušinius, gerai išmaišyk.','Sudėk sulaužytą šokoladą.','Kepk keksiukų formelėse 180°C apie 18–20 min.'],'desertas'),
mk('r59','Varškės spurgytės','desertas',['virykle'],25,4,310,10,38,13,
  [['Varškė',300,'g'],['Kiaušiniai',1,'vnt'],['Miltai',100,'g'],['Cukrus',2,'šauk.']],
  ['Sumaišyk varškę, kiaušinį, cukrų ir miltus.','Šaukštu formuok rutuliukus.','Kepk keptuvėje aliejuje iki auksinės spalvos.','Apibarstyk cukraus pudra.'],'desertas'),
mk('r60','Bananų duona','desertas',['orkaite'],55,6,270,5,44,9,
  [['Prinokę bananai',3,'vnt'],['Miltai',250,'g'],['Cukrus',100,'g'],['Kiaušiniai',2,'vnt']],
  ['Sutrink bananus šakute.','Sumaišyk su cukrumi ir kiaušiniais.','Įmaišyk miltus.','Kepk kepimo formoje 180°C apie 45 min.'],'desertas'),
mk('r61','Vaisių salotos su medumi ir riešutais','desertas',[],10,2,220,4,36,7,
  [['Sezoniniai vaisiai',400,'g'],['Medus',1,'šauk.'],['Graikiniai riešutai',30,'g'],['Citrinos sultys',1,'šauk.']],
  ['Supjaustyk vaisius gabaliukais.','Apšlakstyk citrinos sultimis, kad nepatamsėtų.','Užpilk medumi.','Apibarstyk susmulkintais riešutais.'],'desertas'),

/* ---- KARNIVORAS (tik mėsa, kiaušiniai, žuvis + druska/pipirai/aliejus/sviestas) ---- */
mk('r62','Keptas kiaulienos kepsnys su sviestu','vakariene',['virykle'],25,2,480,38,0,34,
  [['Kiaulienos kepsnys',400,'g'],['Sviestas',20,'g'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Pagardink mėsą druska ir pipirais.','Įkaitink keptuvę su sviestu.','Kepk po 4–5 min. kiekvieną pusę.','Leisk mėsai "pailsėti" 5 min. prieš pjaustant.'],'tradicinis'),
mk('r63','Kiaušinienė su bekonu','pusryciai',['virykle'],10,1,420,24,1,35,
  [['Kiaušiniai',3,'vnt'],['Bekonas',60,'g'],['Sviestas',10,'g'],['Druska',1,'žiupsnelis']],
  ['Apkepink bekoną keptuvėje iki traškaus.','Sviestą ištirpink toje pačioje keptuvėje.','Įmuši kiaušinius, pasūdyk.','Kepk ant mažos ugnies, kol sustings.'],'tradicinis'),
mk('r64','Karnivoro keptos vištienos šlaunelės','vakariene',['virykle'],30,2,460,37,0,33,
  [['Vištienos šlaunelės',500,'g'],['Sviestas',20,'g'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Pagardink šlauneles druska ir pipirais.','Kepk keptuvėje su sviestu odele žemyn 8 min.','Apversk ir kepk dar 10–12 min.','Patikrink, ar iškepė iki galo.'],'tradicinis'),
mk('r65','Virti kiaušiniai su sviestu','uzkandis',['virykle'],12,2,220,13,1,18,
  [['Kiaušiniai',4,'vnt'],['Sviestas',15,'g'],['Druska',1,'žiupsnelis']],
  ['Virk kiaušinius verdančiame vandenyje 8–9 min.','Atvėsink ir nulupk.','Perpjauk pusiau, sudėk sviesto griežinėlį.','Pagardink druska.'],'tradicinis'),
mk('r66','Keptas jautienos kepsnys (ribai)','vakariene',['grilis'],20,2,540,44,0,38,
  [['Jautienos kepsnys (ribai)',400,'g'],['Sviestas',20,'g'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Ištrauk mėsą 20 min. anksčiau, kad sušiltų.','Pagardink druska ir pipirais.','Kepk ant įkaitusio grilio po 3–4 min. kiekvieną pusę.','Ant karštos mėsos uždėk sviesto griežinėlį ir leisk pailsėti.'],'grill'),
mk('r67','Keptas lašišos filė su sviestu','vakariene',['virykle'],18,2,440,36,0,31,
  [['Lašišos filė',400,'g'],['Sviestas',20,'g'],['Druska',1,'žiupsnelis']],
  ['Įkaitink keptuvę su sviestu.','Kepk lašišą odele žemyn 5–6 min.','Apversk ir kepk dar 3–4 min.','Pagardink druska ir patiekk.'],'tradicinis'),
mk('r68','Keptos dešrelės','uzkandis',['virykle'],15,2,380,20,3,32,
  [['Grynos mėsos dešrelės',300,'g'],['Aliejus',1,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Įkaitink keptuvę su aliejumi.','Kepk dešreles ant vidutinės ugnies, sukiodamas.','Kepk ~10 min., kol paruduos iš visų pusių.','Patiekk karštas.'],'tradicinis'),
mk('r69','Kiaulienos šonkauliukai orkaitėje','vakariene',['orkaite'],70,3,520,36,0,40,
  [['Kiaulienos šonkauliukai',600,'g'],['Aliejus',1,'šauk.'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Įkaitink orkaitę iki 180°C.','Pagardink šonkauliukus druska, pipirais ir aliejumi.','Kepk folijoje uždengtus 50 min.','Nuimk foliją ir kepk dar 15–20 min., kol paruduos.'],'tradicinis'),
mk('r70','Keptas kalakutienos filė su sviestu','vakariene',['virykle'],20,2,340,42,0,17,
  [['Kalakutienos filė',400,'g'],['Sviestas',20,'g'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Pagardink filė druska ir pipirais.','Kepk keptuvėje su sviestu po 5–6 min. kiekvieną pusę.','Patikrink, ar iškepė iki galo.','Patiekk iškart.'],'tradicinis'),
mk('r71','Keptas tuno steikas','vakariene',['virykle'],10,2,320,48,0,13,
  [['Tuno steikas',350,'g'],['Aliejus',1,'šauk.'],['Druska',1,'žiupsnelis'],['Pipirai',1,'žiupsnelis']],
  ['Pagardink tuną druska ir pipirais.','Įkaitink keptuvę stipriai su aliejumi.','Kepk po 1–2 min. kiekvieną pusę (viduje lieka rausvas).','Supjaustyk griežinėliais ir patiekk.'],'tradicinis'),

/* ---- NAUJI RECEPTAI (2 atnaujinimas) ---- */
mk('r72','Bruschetta su pomidorais','uzkandis',['skrudintuvas'],10,2,220,6,28,9,
  [['Duonos riekelė',4,'vnt'],['Pomidorai',3,'vnt'],['Bazilikas',1,'šauk.'],['Balzaminis actas',1,'šauk.']],
  ['Paskrudink duonos riekeles.','Susmulkink pomidorus ir baziliką.','Pagardink actu ir aliejumi.','Sudėk ant skrebučių ir patiekk.'],'itale'),
mk('r73','Palačinkės su uogiene','pusryciai',['virykle'],25,4,340,9,52,10,
  [['Miltai',200,'g'],['Kiaušiniai',2,'vnt'],['Pienas',350,'ml'],['Uogienė',4,'šauk.']],
  ['Sumaišyk miltus, kiaušinius ir pieną į plonesnę tešlą nei blynams.','Kepk plonas palačinkes keptuvėje iš abiejų pusių.','Ant kiekvienos sudėk uogienės.','Suvyniok ir patiekk.']),
mk('r74','Sūrio ir daržovių frittata','pusryciai',['orkaite'],30,4,260,17,6,18,
  [['Kiaušiniai',6,'vnt'],['Paprika',1,'vnt'],['Špinatai',80,'g'],['Kietasis sūris',60,'g']],
  ['Išplak kiaušinius.','Sudėk susmulkintas daržoves ir sūrį į kepimo formą.','Užpilk kiaušiniais.','Kepk orkaitėje 180°C apie 20 min.']),
mk('r75','Curry vištiena su ryžiais','vakariene',['virykle'],35,3,480,32,45,18,
  [['Vištienos filė',400,'g'],['Kokosų pienas',200,'ml'],['Curry pasta',2,'šauk.'],['Ryžiai',200,'g']],
  ['Apkepink supjaustytą vištieną.','Įpilk curry pastą, pakepink 1 min.','Įpilk kokosų pieną, troškink 15 min.','Patiekk su virtais ryžiais.'],'indiska'),
mk('r76','Lęšių dal','pietus',['virykle'],30,3,290,15,42,7,
  [['Raudonieji lęšiai',250,'g'],['Svogūnas',1,'vnt'],['Curry pasta',1,'šauk.'],['Kokosų pienas',100,'ml']],
  ['Pakepink svogūną su curry pasta.','Sudėk lęšius ir vandenį, virk 15 min.','Įpilk kokosų pieną.','Pakaitink dar 5 min. ir patiekk.'],'indiska'),
mk('r77','Falafeliai su humusu','uzkandis',['airfryer'],25,3,340,14,38,15,
  [['Avinžirniai',300,'g'],['Svogūnas',1,'vnt'],['Tahini pasta',2,'šauk.'],['Citrinos sultys',1,'šauk.']],
  ['Sumalk avinžirnius su svogūnu ir prieskoniais.','Suformuok rutuliukus.','Kepk oro gruzdintuvėje 200°C apie 15 min.','Patiekk su humusu iš tahini ir citrinos sulčių.'],'rytu'),
mk('r78','Humusas su daržovėmis','uzkandis',[],10,3,220,8,24,11,
  [['Avinžirniai',300,'g'],['Tahini pasta',2,'šauk.'],['Citrinos sultys',1,'šauk.'],['Česnakas',1,'vnt']],
  ['Sudėk avinžirnius, tahini, citrinos sultis ir česnaką į trintuvą.','Trink iki lygios masės.','Jei per tirštas, įpilk truputį vandens.','Patiekk su šviežiomis daržovėmis.'],'rytu'),
mk('r79','Šašlykas','vakariene',['grilis'],30,4,480,38,4,32,
  [['Kiaulienos kepsnys',600,'g'],['Svogūnas',2,'vnt'],['Aliejus',2,'šauk.'],['Druska',1,'žiupsnelis']],
  ['Supjaustyk mėsą gabalais, marinuok su svogūnais bent 2 val.','Suvarstyk ant iešmų kaitaliojant su svogūnu.','Kepk ant grilio, sukiodamas, ~20 min.','Patiekk karštą.'],'grill'),
mk('r80','Cepelinai su mėsos įdaru','vakariene',['virykle'],70,4,520,22,68,18,
  [['Bulvės (tarkuotos)',1200,'g'],['Malta mėsa',300,'g'],['Svogūnas',1,'vnt'],['Kiaušiniai',1,'vnt']],
  ['Nutark bulves, nuspausk skystį.','Suformuok įdarą iš maltos mėsos ir svogūno.','Suformuok cepelinus iš bulvių masės su įdaru viduje.','Virk verdančiame vandenyje ~25 min., kol iškils.'],'tradicinis'),
mk('r81','Cibulinė sriuba su sūriu','pietus',['virykle'],40,4,260,10,24,14,
  [['Svogūnas',4,'vnt'],['Jautienos sultinys',800,'ml'],['Duonos riekelė',4,'vnt'],['Kietasis sūris',80,'g']],
  ['Ilgai kepink smulkintus svogūnus, kol paruduos (~20 min.).','Užpilk sultiniu ir virk 15 min.','Į kiekvieną dubenėlį įdėk skrebutį ir sūrio.','Trumpam pakaitink orkaitėje, kol sūris ištirps.'],'sriuba'),
mk('r82','Krevečių salotos su avokadu','pietus',[],15,2,300,26,10,18,
  [['Krevetės',250,'g'],['Avokadas',1,'vnt'],['Salotos',80,'g'],['Citrinos sultys',1,'šauk.']],
  ['Išvirk arba atšildyk krevetes.','Supjaustyk avokadą kubeliais.','Sumaišyk su salotomis.','Pagardink citrinos sultimis ir aliejumi.']),
mk('r83','Omletas su špinatais ir sūriu','pusryciai',['virykle'],12,1,320,20,5,24,
  [['Kiaušiniai',3,'vnt'],['Špinatai',50,'g'],['Kietasis sūris',30,'g'],['Sviestas',10,'g']],
  ['Pakepink špinatus keptuvėje su sviestu, kol suvys.','Išplak kiaušinius, supilk į keptuvę.','Apibarstyk sūriu.','Kepk ant mažos ugnies, kol sustings, sulankstyk.']),
mk('r84','Traškūs vištienos sparneliai orkaitėje','uzkandis',['orkaite'],45,3,420,30,8,30,
  [['Vištienos sparneliai',600,'g'],['Aliejus',1,'šauk.'],['Prieskoniai mėsai',1,'šauk.']],
  ['Įkaitink orkaitę iki 200°C.','Apibarstyk sparnelius prieskoniais ir aliejumi.','Kepk 35–40 min., apverčiant per pusę.','Patiekk karštus.'],'grill'),
mk('r85','Pievagrybių kremas ant skrebučio','uzkandis',['virykle'],20,2,260,8,22,15,
  [['Pievagrybiai',250,'g'],['Svogūnas',1,'vnt'],['Grietinėlė',50,'ml'],['Duonos riekelė',2,'vnt']],
  ['Pakepink grybus su svogūnu.','Sutrink su grietinėle iki tirštos masės.','Paskrudink duonos riekeles.','Užtepk grybų kremą ant skrebučių.']),
mk('r86','Graikiškas jogurtas su medumi ir riešutais','pusryciai',[],5,1,280,14,30,11,
  [['Graikiškas jogurtas',200,'g'],['Medus',1,'šauk.'],['Graikiniai riešutai',20,'g'],['Uogos',50,'g']],
  ['Sudėk jogurtą į dubenėlį.','Užpilk medumi.','Apibarstyk susmulkintais riešutais.','Papuošk uogomis.']),
mk('r87','Kalakuto kepsnys su spanguolių padažu','vakariene',['orkaite'],60,4,380,42,14,15,
  [['Kalakutienos krūtinėlė',600,'g'],['Spanguolės',100,'g'],['Cukrus',2,'šauk.'],['Aliejus',1,'šauk.']],
  ['Įkaitink orkaitę iki 190°C.','Pagardink kalakutieną ir kepk 40–45 min.','Troškink spanguoles su cukrumi, kol susidarys padažas.','Patiekk kepsnį su spanguolių padažu.'],'tradicinis'),
mk('r88','Prancūziški skrebučiai','pusryciai',['virykle'],15,2,340,12,38,15,
  [['Duonos riekelė',4,'vnt'],['Kiaušiniai',2,'vnt'],['Pienas',100,'ml'],['Cinamonas',1,'žiupsnelis']],
  ['Išplak kiaušinius su pienu ir cinamonu.','Pamirkyk duonos riekeles mišinyje.','Kepk keptuvėje iš abiejų pusių iki auksinės spalvos.','Patiekk su medumi ar uogiene.']),
mk('r89','Krevečių wok su curry padažu','vakariene',['wok'],20,2,380,28,18,20,
  [['Krevetės',300,'g'],['Kokosų pienas',150,'ml'],['Curry pasta',1,'šauk.'],['Paprika',1,'vnt']],
  ['Įkaitink wok su aliejumi.','Apkepink krevetes ir papriką 3 min.','Įpilk curry pastą ir kokosų pieną.','Pakaitink 5 min. ir patiekk su ryžiais.'],'indiska'),
mk('r90','Vištienos šlaunelės su medumi ir garstyčiomis','vakariene',['orkaite'],40,3,440,33,16,26,
  [['Vištienos šlaunelės',600,'g'],['Medus',2,'šauk.'],['Garstyčios',1,'šauk.'],['Aliejus',1,'šauk.']],
  ['Sumaišyk medų, garstyčias ir aliejų.','Aptepk vištienos šlauneles mišiniu.','Kepk orkaitėje 200°C apie 35 min.','Kelis kartus per kepimą apliežk susidariusiu padažu.']),
mk('r91','Šokoladinis avokado desertas','desertas',['blenderis'],10,2,260,5,26,17,
  [['Avokadas',2,'vnt'],['Kakava',3,'šauk.'],['Medus',2,'šauk.'],['Avižinis pienas',50,'ml']],
  ['Sudėk visus ingredientus į blenderį.','Plak, kol taps lygus ir kreminis.','Supilk į indelius.','Šaldyk bent 30 min. prieš patiekiant.'],'desertas'),

/* ---- NAUJI RECEPTAI (3 atnaujinimas) ---- */
mk('r92','Vištienos ir daržovių troškinys','vakariene',['virykle'],40,4,420,34,28,18,
  [['Vištienos filė',500,'g'],['Bulvės',400,'g'],['Morka',2,'vnt'],['Svogūnas',1,'vnt']],
  ['Supjaustyk vištieną ir daržoves.','Apkepink vištieną puode.','Sudėk daržoves ir įpilk vandens.','Troškink ant mažos ugnies 25 min.'],'tradicinis'),
mk('r93','Kreminė grybų sriuba','pietus',['virykle','blenderis'],30,4,220,6,18,14,
  [['Pievagrybiai',400,'g'],['Svogūnas',1,'vnt'],['Grietinėlė',100,'ml'],['Daržovių sultinys',600,'ml']],
  ['Pakepink grybus su svogūnu.','Įpilk sultinį, virk 15 min.','Sutrink blenderiu.','Įmaišyk grietinėlę ir pakaitink.'],'sriuba'),
mk('r94','Keptų daržovių salotos','pietus',['orkaite'],35,3,240,6,26,13,
  [['Cukinija',1,'vnt'],['Paprika',2,'vnt'],['Baklažanas',1,'vnt'],['Alyvuogių aliejus',3,'šauk.']],
  ['Supjaustyk daržoves gabalėliais.','Apšlakstyk aliejumi, pagardink.','Kepk orkaitėje 200°C apie 25 min.','Patiekk šiltas ar atvėsusias.'],'tradicinis'),
mk('r95','Jautienos guliašas','vakariene',['virykle'],80,4,480,38,24,26,
  [['Jautiena',600,'g'],['Svogūnas',2,'vnt'],['Paprika',1,'vnt'],['Pomidorų pasta',2,'šauk.']],
  ['Supjaustyk jautieną kubeliais, apkepink.','Sudėk svogūną ir papriką.','Įmaišyk pomidorų pastą ir vandenį.','Troškink ant mažos ugnies 1 val.'],'tradicinis'),
mk('r96','Ispaniškas omletas (tortilja)','pusryciai',['virykle'],30,4,320,14,26,18,
  [['Bulvės',400,'g'],['Kiaušiniai',6,'vnt'],['Svogūnas',1,'vnt'],['Alyvuogių aliejus',3,'šauk.']],
  ['Supjaustyk bulves plonais griežinėliais, apkepink su svogūnu.','Išplak kiaušinius, sumaišyk su bulvėmis.','Kepk keptuvėje ant mažos ugnies.','Apversk ir kepk kitą pusę.'],'tradicinis'),
mk('r97','Vištiena su citrina ir česnaku','vakariene',['virykle'],30,2,400,42,6,22,
  [['Vištienos filė',400,'g'],['Citrina',1,'vnt'],['Česnakas',3,'vnt'],['Alyvuogių aliejus',2,'šauk.']],
  ['Apkepink vištieną keptuvėje.','Sudėk smulkintą česnaką.','Užspausk citrinos sulčių.','Troškink 5 min. ir patiekk.'],'keptuveje'),
mk('r98','Daržovių karis','vakariene',['virykle'],35,4,360,10,48,15,
  [['Bulvės',300,'g'],['Žiediniai kopūstai',300,'g'],['Kokosų pienas',200,'ml'],['Curry pasta',2,'šauk.']],
  ['Pakepink curry pastą.','Sudėk supjaustytas daržoves.','Įpilk kokosų pieną ir vandenį.','Troškink 20 min., patiekk su ryžiais.'],'indiska'),
mk('r99','Kepta duona su česnaku','uzkandis',['orkaite'],15,4,220,6,32,8,
  [['Batonas',1,'vnt'],['Sviestas',50,'g'],['Česnakas',3,'vnt'],['Petražolės',1,'šauk.']],
  ['Sumaišyk minkštą sviestą su smulkintu česnaku ir petražolėmis.','Supjaustyk batoną riekelėmis.','Užtepk česnakiniu sviestu.','Kepk orkaitėje 180°C apie 10 min.'],'itale'),
mk('r100','Vištienos sriuba su makaronais','pietus',['virykle'],40,4,300,24,28,9,
  [['Vištienos filė',300,'g'],['Makaronai',150,'g'],['Morka',2,'vnt'],['Svogūnas',1,'vnt']],
  ['Išvirk vištieną sultinyje, išimk ir susmulkink.','Į sultinį sudėk daržoves, virk 10 min.','Suber makaronus, virk dar 8 min.','Grąžink vištieną ir patiekk.'],'sriuba'),
mk('r101','Bulvių plokštainis (kugelis)','vakariene',['orkaite'],75,6,340,10,40,16,
  [['Bulvės',1500,'g'],['Bekonas',150,'g'],['Svogūnas',1,'vnt'],['Kiaušiniai',2,'vnt']],
  ['Sutarkuok bulves ir nuspausk skystį.','Apkepink bekoną su svogūnu.','Sumaišyk viską su kiaušiniais.','Kepk orkaitėje 180°C apie 1 val.'],'tradicinis'),
mk('r102','Feta ir špinatų kepiniai','uzkandis',['orkaite'],35,4,320,12,26,19,
  [['Sluoksniuota tešla',250,'g'],['Fetos sūris',150,'g'],['Špinatai',150,'g'],['Kiaušiniai',1,'vnt']],
  ['Apkepink špinatus, atvėsink.','Sumaišyk su fetos sūriu.','Įdėk įdarą į tešlos gabalėlius.','Aptepk kiaušiniu ir kepk 200°C apie 20 min.'],'itale'),
mk('r103','Lęšių ir daržovių sriuba','pietus',['virykle'],35,4,260,14,40,5,
  [['Žalieji lęšiai',200,'g'],['Morka',2,'vnt'],['Salieras',1,'vnt'],['Pomidorų padažas',200,'g']],
  ['Susmulkink daržoves.','Sudėk viską į puodą su vandeniu.','Virk 25 min., kol lęšiai suminkštės.','Pagardink prieskoniais.'],'sriuba'),
mk('r104','Keptas kiaušinis ant skrebučio','pusryciai',['virykle'],10,1,300,14,28,15,
  [['Duonos riekelė',2,'vnt'],['Kiaušiniai',2,'vnt'],['Sviestas',10,'g'],['Sūris',30,'g']],
  ['Paskrudink duoną.','Iškepk kiaušinius keptuvėje su sviestu.','Uždėk sūrio ant karštos duonos.','Ant viršaus sudėk kiaušinius.'],'keptuveje'),
mk('r105','Vištienos kepsneliai su sezamu','vakariene',['orkaite'],30,3,420,38,12,24,
  [['Vištienos filė',500,'g'],['Sezamų sėklos',3,'šauk.'],['Sojos padažas',2,'šauk.'],['Medus',1,'šauk.']],
  ['Supjaustyk vištieną juostelėmis.','Apvoliok sojos padaže su medumi.','Apibarstyk sezamų sėklomis.','Kepk orkaitėje 200°C apie 20 min.'],'kinietiska'),
mk('r106','Morkų ir imbiero sriuba','pietus',['virykle','blenderis'],30,4,180,3,26,7,
  [['Morka',600,'g'],['Svogūnas',1,'vnt'],['Imbieras',20,'g'],['Daržovių sultinys',700,'ml']],
  ['Pakepink svogūną ir imbierą.','Sudėk morkas ir sultinį.','Virk 20 min.','Sutrink blenderiu iki vientisos masės.'],'sriuba'),
mk('r107','Mocarelos ir pomidorų salotos','uzkandis',[],10,2,280,14,8,22,
  [['Mocarela',150,'g'],['Pomidorai',3,'vnt'],['Bazilikas',1,'šauk.'],['Alyvuogių aliejus',2,'šauk.']],
  ['Supjaustyk mocarelą ir pomidorus griežinėliais.','Sudėk pakaitomis lėkštėje.','Apibarstyk baziliku.','Apšlakstyk aliejumi.'],'itale'),
mk('r108','Keptos bulvės su rozmarinu','uzkandis',['orkaite'],40,4,220,4,36,7,
  [['Bulvės',700,'g'],['Alyvuogių aliejus',3,'šauk.'],['Rozmarinas',1,'šauk.'],['Česnakas',3,'vnt']],
  ['Supjaustyk bulves skiltelėmis.','Apšlakstyk aliejumi, apibarstyk rozmarinu ir česnaku.','Kepk orkaitėje 200°C apie 30 min.','Kelis kartus apversk.'],'tradicinis'),
mk('r109','Kiaulienos karbonadas','vakariene',['virykle'],25,2,520,40,12,34,
  [['Kiaulienos kepsnys',400,'g'],['Kiaušiniai',1,'vnt'],['Džiūvėsiai',60,'g'],['Aliejus',3,'šauk.']],
  ['Išplak kiaulienos kepsnius plonai.','Pavoliok kiaušinyje, tada džiūvėsiuose.','Kepk keptuvėje su aliejumi iš abiejų pusių.','Patiekk su bulvėmis ar salotomis.'],'keptuveje')
];
applyComputedNutrition(BUILTIN_RECIPES);
BUILTIN_RECIPES.forEach(r=>{ r.difficulty = computeDifficulty(r); });

/* ===================== COCKTAILS ===================== */
const COCKTAILS = [
mk('k01','Mojito','kokteiliai',['grustuve'],5,1,180,0,18,0,
  [['Baltasis romas',50,'ml'],['Šviežios mėtos',8,'vnt'],['Žalioji laimo',1,'vnt'],['Cukranendrių cukrus',2,'šauk.'],['Sodos vanduo',100,'ml']],
  ['Stiklinėje sugrūsk mėtas su cukrumi ir laimo sultimis.','Įdėk ledo.','Įpilk romą, gerai išmaišyk.','Užpilk sodos vandeniu ir papuošk mėtos šakele.']),
mk('k02','Kuba Libre','kokteiliai',[],3,1,170,0,20,0,
  [['Baltasis romas',50,'ml'],['Kola',150,'ml'],['Laimas',1,'vnt']],
  ['Į stiklinę su ledu įpilk romą.','Užpilk kola.','Įspausk laimo sulčių.','Švelniai išmaišyk ir patiekk.']),
mk('k03','Vodka Tonic','kokteiliai',[],3,1,150,0,14,0,
  [['Vodka',50,'ml'],['Tonikas',150,'ml'],['Laimas',1,'vnt']],
  ['Į taurę su ledu įpilk vodką.','Užpilk toniku.','Įspausk laimo griežinėlį.','Švelniai išmaišyk.']),
mk('k04','Džino tonikas','kokteiliai',[],3,1,150,0,13,0,
  [['Džinas',50,'ml'],['Tonikas',150,'ml'],['Citrina',1,'vnt']],
  ['Į taurę su ledu įpilk džiną.','Užpilk toniku.','Papuošk citrinos griežinėliu.','Švelniai išmaišyk.']),
mk('k05','Aperol Spritz','kokteiliai',[],5,1,140,0,15,0,
  [['Aperol',60,'ml'],['Putojantis vynas',90,'ml'],['Sodos vanduo',30,'ml'],['Apelsinas',1,'vnt']],
  ['Į taurę su ledu įpilk Aperol.','Užpilk putojančiu vynu.','Papildyk sodos vandeniu.','Papuošk apelsino skiltele.']),
mk('k06','Margarita','kokteiliai',['seikeris','kostuvas'],5,1,200,0,18,0,
  [['Tequila',50,'ml'],['Apelsinų likeris',20,'ml'],['Šviežios laimo sultys',25,'ml'],['Druska',1,'žiupsnelis']],
  ['Taurės kraštelį sudrėkink laimu ir apvolyk druskoje.','Sumaišyk tequila, likerį ir laimo sultis su ledu.','Kratyk kokteilių maišytuve (arba stiklinėje) 10 sek.','Perpilk į paruoštą taurę.']),
mk('k07','Cosmopolitan','kokteiliai',['seikeris','kostuvas'],5,1,170,0,15,0,
  [['Vodka',40,'ml'],['Apelsinų likeris',15,'ml'],['Spanguolių sultys',30,'ml'],['Šviežios laimo sultys',15,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai išpurtyk.','Perkošk į šaltą taurę.','Papuošk apelsino žievele.']),
mk('k08','Pina Colada','kokteiliai',['blenderis'],5,1,300,1,32,8,
  [['Baltasis romas',50,'ml'],['Ananasų sultys',90,'ml'],['Kokosų kremas',30,'ml'],['Ledas',150,'g']],
  ['Sudėk visus ingredientus į blenderį.','Plak, kol taps vientisas ir purus.','Supilk į didelę taurę.','Papuošk ananaso gabaliuku.']),
mk('k09','Whiskey Sour','kokteiliai',['seikeris','kostuvas'],5,1,180,0,14,0,
  [['Viskis',50,'ml'],['Šviežios citrinos sultys',25,'ml'],['Cukraus sirupas',15,'ml'],['Kiaušinio baltymas',1,'vnt']],
  ['Sudėk visus ingredientus į maišytuvą be ledo, gerai pakratyk (sausas kratymas).','Įdėk ledo ir pakratyk dar kartą.','Perkošk į taurę su ledu.','Papuošk citrinos žievele.']),
mk('k10','Long Island Iced Tea','kokteiliai',[],5,1,250,0,22,0,
  [['Vodka',15,'ml'],['Baltasis romas',15,'ml'],['Džinas',15,'ml'],['Tequila',15,'ml'],['Kola',60,'ml']],
  ['Sudėk visus alkoholius į taurę su ledu.','Įspausk truputį citrinos sulčių.','Užpilk kola.','Švelniai išmaišyk ir patiekk.']),
mk('k11','Atsuktuvas (Screwdriver)','kokteiliai',[],3,1,160,0,17,0,
  [['Vodka',50,'ml'],['Apelsinų sultys',150,'ml']],
  ['Į taurę su ledu įpilk vodką.','Užpilk šviežiomis apelsinų sultimis.','Švelniai išmaišyk.','Papuošk apelsino griežinėliu.']),
mk('k12','Kruvinoji Marija','kokteiliai',[],5,1,150,1,12,0,
  [['Vodka',50,'ml'],['Pomidorų sultys',120,'ml'],['Vusterio padažas',5,'ml'],['Citrinos sultys',10,'ml']],
  ['Sudėk visus ingredientus į taurę su ledu.','Gerai išmaišyk.','Pagardink druska ir pipirais.','Papuošk salieru ar citrinos griežinėliu.']),
mk('k13','Negroni','kokteiliai',[],5,1,170,0,10,0,
  [['Džinas',30,'ml'],['Campari',30,'ml'],['Raudonasis vermutas',30,'ml'],['Apelsino žievelė',1,'vnt']],
  ['Sudėk visus ingredientus į taurę su ledu.','Švelniai išmaišyk apie 20 sek.','Papuošk apelsino žievele.','Patiekk atšaldytą.']),
mk('k14','Daiquiri','kokteiliai',['seikeris','kostuvas'],5,1,180,0,16,0,
  [['Baltasis romas',50,'ml'],['Šviežios laimo sultys',25,'ml'],['Cukraus sirupas',15,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į šaltą taurę.','Papuošk laimo griežinėliu.']),
mk('k15','Moscow Mule','kokteiliai',[],3,1,160,0,18,0,
  [['Vodka',50,'ml'],['Imbierinis alus',120,'ml'],['Laimo sultys',10,'ml']],
  ['Į taurę su ledu įpilk vodką ir laimo sultis.','Užpilk imbieriniu alumi.','Švelniai išmaišyk.','Papuošk mėtos šakele.']),
mk('k16','Caipirinha','kokteiliai',['grustuve'],5,1,190,0,17,0,
  [['Cachaça',50,'ml'],['Žalioji laimo',1,'vnt'],['Cukranendrių cukrus',2,'šauk.']],
  ['Supjaustyk laimą griežinėliais ir sudėk į taurę.','Sugrūsk su cukrumi.','Įdėk ledo ir įpilk cachaça.','Gerai išmaišyk ir patiekk.']),
mk('k17','Mai Tai','kokteiliai',['seikeris','kostuvas'],5,1,230,0,20,0,
  [['Tamsusis romas',30,'ml'],['Baltasis romas',30,'ml'],['Apelsinų likeris',15,'ml'],['Laimo sultys',20,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perpilk į taurę su ledu.','Papuošk mėtos šakele ir laimo griežinėliu.']),
mk('k18','Espresso Martini','kokteiliai',['seikeris','kostuvas'],5,1,210,1,20,0,
  [['Vodka',40,'ml'],['Kavos likeris',30,'ml'],['Šviežias espreso',30,'ml'],['Cukraus sirupas',10,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk, kol susidarys putos.','Perkošk į šaltą taurę.','Papuošk keliais kavos pupelėmis.']),
mk('k19','Paloma','kokteiliai',[],5,1,180,0,19,0,
  [['Tequila',50,'ml'],['Greipfrutų soda',120,'ml'],['Laimo sultys',10,'ml'],['Druska',1,'žiupsnelis']],
  ['Taurės kraštelį apvolyk druskoje.','Įpilk tequila ir laimo sultis su ledu.','Užpilk greipfrutų soda.','Švelniai išmaišyk.']),
mk('k20','Dark n Stormy','kokteiliai',[],3,1,190,0,22,0,
  [['Tamsusis romas',50,'ml'],['Imbierinis alus',120,'ml'],['Laimo sultys',10,'ml']],
  ['Į taurę su ledu įpilk laimo sultis.','Įpilk romą.','Švelniai užpilk imbieriniu alumi.','Papuošk laimo griežinėliu.']),
mk('k21','Sidecar','kokteiliai',['seikeris','kostuvas'],5,1,200,0,14,0,
  [['Konjakas',50,'ml'],['Apelsinų likeris',20,'ml'],['Citrinos sultys',20,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į šaltą taurę.','Papuošk citrinos žievele.']),
mk('k22','Manhattan','kokteiliai',['kostuvas'],5,1,190,0,8,0,
  [['Viskis',50,'ml'],['Raudonasis vermutas',20,'ml'],['Anguostura kartikliai',2,'ml']],
  ['Sudėk visus ingredientus su ledu į maišymo stiklinę.','Švelniai maišyk apie 20 sek.','Perkošk į šaltą taurę.','Papuošk vyšnia.']),
mk('k23','French 75','kokteiliai',['seikeris','kostuvas'],5,1,170,0,15,0,
  [['Džinas',30,'ml'],['Citrinos sultys',15,'ml'],['Cukraus sirupas',10,'ml'],['Putojantis vynas',90,'ml']],
  ['Sudėk džiną, citrinos sultis ir sirupą su ledu į maišytuvą.','Pakratyk ir perkošk į taurę.','Užpilk putojančiu vynu.','Papuošk citrinos žievele.']),
mk('k24','Tequila Sunrise','kokteiliai',[],5,1,190,0,22,0,
  [['Tequila',50,'ml'],['Apelsinų sultys',120,'ml'],['Granatų sirupas',10,'ml']],
  ['Į taurę su ledu įpilk tequila ir apelsinų sultis.','Švelniai išmaišyk.','Lėtai įpilk granatų sirupo per šaukštelio nugarėlę, kad nusėstų dugne.','Patiekk nemaišytą, kad matytųsi saulėtekio efektas.']),
mk('k25','Bellini','kokteiliai',[],5,1,150,0,17,0,
  [['Persikų nektaras',50,'ml'],['Prosekas',100,'ml']],
  ['Į taurę įpilk atšaldytą persikų nektarą.','Lėtai užpilk prosekas.','Švelniai išmaišyk vienu judesiu.','Patiekk iškart, kol putoja.']),

/* ---- NAUJI KOKTEILIAI (2 atnaujinimas) ---- */
mk('k26','Gin Fizz','kokteiliai',['seikeris','kostuvas'],5,1,150,0,15,0,
  [['Džinas',50,'ml'],['Citrinos sultys',25,'ml'],['Cukraus sirupas',15,'ml'],['Sodos vanduo',60,'ml']],
  ['Sudėk džiną, citrinos sultis ir sirupą su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į taurę su ledu.','Užpilk sodos vandeniu.']),
mk('k27','Amaretto Sour','kokteiliai',['seikeris','kostuvas'],5,1,200,0,22,0,
  [['Amaretto likeris',50,'ml'],['Citrinos sultys',25,'ml'],['Cukraus sirupas',10,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į taurę su ledu.','Papuošk vyšnia.']),
mk('k28','White Russian','kokteiliai',[],3,1,250,1,18,10,
  [['Vodka',50,'ml'],['Kavos likeris',25,'ml'],['Grietinėlė',30,'ml']],
  ['Į taurę su ledu įpilk vodką ir kavos likerį.','Švelniai išmaišyk.','Lėtai užpilk grietinėlę per šaukšto nugarėlę.','Patiekk nemaišytą.']),
mk('k29','Black Russian','kokteiliai',[],3,1,190,0,16,0,
  [['Vodka',50,'ml'],['Kavos likeris',25,'ml']],
  ['Į taurę su ledu įpilk vodką.','Įpilk kavos likerį.','Švelniai išmaišyk.','Patiekk atšaldytą.']),
mk('k30','Kir Royale','kokteiliai',[],3,1,110,0,10,0,
  [['Creme de Cassis likeris',15,'ml'],['Putojantis vynas',120,'ml']],
  ['Į taurę įpilk Creme de Cassis.','Lėtai užpilk putojančiu vynu.','Švelniai išmaišyk.','Patiekk iškart.']),
mk('k31','Irish Coffee','kokteiliai',[],8,1,220,1,20,10,
  [['Viskis',40,'ml'],['Karšta kava',120,'ml'],['Rudasis cukrus',1,'šauk.'],['Grietinėlė',30,'ml']],
  ['Į šiltą taurę įpilk viskį ir cukrų.','Užpilk karšta kava, išmaišyk.','Lėtai užpilk grietinėlę per šaukšto nugarėlę, kad plauktų viršuje.','Patiekk nemaišytą, karštą.']),
mk('k32','Old Fashioned','kokteiliai',['grustuve'],5,1,180,0,8,0,
  [['Viskis',50,'ml'],['Cukraus kubelis',1,'vnt'],['Anguostura kartikliai',2,'ml'],['Apelsino žievelė',1,'vnt']],
  ['Sugrūsk cukraus kubelį su kartikliais taurėje.','Įdėk ledo ir įpilk viskį.','Švelniai išmaišyk.','Papuošk apelsino žievele.']),
mk('k33','Tom Collins','kokteiliai',['seikeris','kostuvas'],5,1,150,0,14,0,
  [['Džinas',50,'ml'],['Citrinos sultys',25,'ml'],['Cukraus sirupas',15,'ml'],['Sodos vanduo',90,'ml']],
  ['Sudėk džiną, citrinos sultis ir sirupą su ledu.','Gerai pakratyk arba išmaišyk.','Perpilk į aukštą taurę su ledu.','Užpilk sodos vandeniu.']),
mk('k34','Bramble','kokteiliai',['seikeris','kostuvas'],5,1,190,0,18,0,
  [['Džinas',50,'ml'],['Citrinos sultys',20,'ml'],['Cukraus sirupas',10,'ml'],['Gervuogių likeris',15,'ml']],
  ['Sudėk džiną, citrinos sultis ir sirupą su ledu, pakratyk.','Perpilk į taurę su smulkintu ledu.','Lėtai užpilk gervuogių likerį per viršų.','Papuošk gervuoge.']),
mk('k35','Mimosa','kokteiliai',[],3,1,110,0,12,0,
  [['Putojantis vynas',90,'ml'],['Apelsinų sultys',90,'ml']],
  ['Į taurę įpilk atšaldytas apelsinų sultis.','Lėtai užpilk putojančiu vynu.','Švelniai išmaišyk vienu judesiu.','Patiekk iškart.']),
mk('k36','Rob Roy','kokteiliai',['kostuvas'],5,1,170,0,6,0,
  [['Viskis',50,'ml'],['Raudonasis vermutas',20,'ml'],['Anguostura kartikliai',2,'ml']],
  ['Sudėk visus ingredientus su ledu į maišymo stiklinę.','Švelniai maišyk apie 20 sek.','Perkošk į šaltą taurę.','Papuošk vyšnia.']),
mk('k37','Hugo','kokteiliai',[],5,1,130,0,15,0,
  [['Prosekas',100,'ml'],['Šeivamedžio sirupas',20,'ml'],['Sodos vanduo',30,'ml'],['Švieži mėtos lapeliai',5,'vnt']],
  ['Į taurę su ledu įpilk šeivamedžio sirupą.','Užpilk prosekas ir sodos vandeniu.','Švelniai išmaišyk.','Papuošk mėtos lapeliais.']),
mk('k38','Gimlet','kokteiliai',['seikeris','kostuvas'],5,1,170,0,12,0,
  [['Džinas',50,'ml'],['Laimo sultys',20,'ml'],['Cukraus sirupas',10,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į šaltą taurę.','Papuošk laimo griežinėliu.']),
mk('k39','Rusty Nail','kokteiliai',[],3,1,180,0,10,0,
  [['Viskis',40,'ml'],['Drambuie likeris',20,'ml']],
  ['Į taurę su ledu įpilk viskį.','Įpilk Drambuie likerį.','Švelniai išmaišyk.','Patiekk atšaldytą.']),
mk('k40','Kamikaze','kokteiliai',['seikeris','kostuvas'],5,1,180,0,16,0,
  [['Vodka',40,'ml'],['Apelsinų likeris',20,'ml'],['Laimo sultys',20,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į šaltą taurę.','Papuošk laimo griežinėliu.']),

/* ---- NAUJI KOKTEILIAI (3 atnaujinimas) ---- */
mk('k41','Blue Lagoon','kokteiliai',[],3,1,180,0,24,0,
  [['Vodka',40,'ml'],['Mėlynasis Curaçao',20,'ml'],['Limonadas',120,'ml']],
  ['Į taurę su ledu įpilk vodką ir Curaçao.','Užpilk limonadu.','Švelniai išmaišyk.','Papuošk citrinos griežinėliu.']),
mk('k42','Sex on the Beach','kokteiliai',[],5,1,200,0,24,0,
  [['Vodka',40,'ml'],['Persikų likeris',20,'ml'],['Apelsinų sultys',60,'ml'],['Spanguolių sultys',40,'ml']],
  ['Į taurę su ledu įpilk vodką ir persikų likerį.','Užpilk apelsinų ir spanguolių sultimis.','Švelniai išmaišyk.','Papuošk apelsino griežinėliu.']),
mk('k43','Mint Julep','kokteiliai',['grustuve'],5,1,180,0,12,0,
  [['Burbonas',60,'ml'],['Šviežios mėtos',10,'vnt'],['Cukraus sirupas',15,'ml']],
  ['Taurėje sugrūsk mėtą su sirupu.','Pripildyk smulkinto ledo.','Įpilk burboną, išmaišyk.','Papuošk mėtos šakele.']),
mk('k44','Tequila Sunset','kokteiliai',[],3,1,190,0,24,0,
  [['Tequila',50,'ml'],['Apelsinų sultys',120,'ml'],['Uogų sirupas',10,'ml']],
  ['Į taurę su ledu įpilk tequila ir apelsinų sultis.','Švelniai išmaišyk.','Įlašink uogų sirupo.','Patiekk nemaišytą.']),
mk('k45','Aperol Sour','kokteiliai',['seikeris','kostuvas'],5,1,160,0,16,0,
  [['Aperol',50,'ml'],['Citrinos sultys',25,'ml'],['Cukraus sirupas',10,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į taurę su ledu.','Papuošk apelsino griežinėliu.']),
mk('k46','Gin Basil Smash','kokteiliai',['grustuve','seikeris','kostuvas'],5,1,180,0,14,0,
  [['Džinas',50,'ml'],['Švieži baziliko lapai',10,'vnt'],['Citrinos sultys',20,'ml'],['Cukraus sirupas',15,'ml']],
  ['Sugrūsk baziliką maišytuve.','Įpilk džiną, citrinos sultis, sirupą ir ledą.','Gerai pakratyk.','Perkošk į taurę su ledu.']),
mk('k47','Vodka Cranberry','kokteiliai',[],3,1,160,0,20,0,
  [['Vodka',50,'ml'],['Spanguolių sultys',120,'ml'],['Laimas',1,'vnt']],
  ['Į taurę su ledu įpilk vodką.','Užpilk spanguolių sultimis.','Įspausk laimo.','Švelniai išmaišyk.']),
mk('k48','Godfather','kokteiliai',[],3,1,190,0,8,0,
  [['Viskis',45,'ml'],['Amaretto likeris',25,'ml']],
  ['Į taurę su ledu įpilk viskį.','Įpilk Amaretto.','Švelniai išmaišyk.','Patiekk atšaldytą.']),
mk('k49','Grasshopper','kokteiliai',['seikeris','kostuvas'],5,1,280,2,26,14,
  [['Mėtų likeris',30,'ml'],['Kakavos likeris',30,'ml'],['Grietinėlė',30,'ml']],
  ['Sudėk visus ingredientus su ledu į maišytuvą.','Gerai pakratyk.','Perkošk į šaltą taurę.','Papuošk mėtos lapeliu.']),
mk('k50','Boulevardier','kokteiliai',['kostuvas'],5,1,200,0,10,0,
  [['Burbonas',45,'ml'],['Campari',30,'ml'],['Raudonasis vermutas',30,'ml']],
  ['Sudėk visus ingredientus su ledu į maišymo stiklinę.','Maišyk 20 sek.','Perkošk į taurę su ledu.','Papuošk apelsino žievele.']),
mk('k51','Southside','kokteiliai',['grustuve','seikeris','kostuvas'],5,1,170,0,14,0,
  [['Džinas',50,'ml'],['Šviežios mėtos',8,'vnt'],['Laimo sultys',20,'ml'],['Cukraus sirupas',15,'ml']],
  ['Sugrūsk mėtą maišytuve.','Įpilk džiną, laimo sultis, sirupą ir ledą.','Gerai pakratyk.','Perkošk į šaltą taurę.']),
mk('k52','El Diablo','kokteiliai',[],5,1,200,0,22,0,
  [['Tequila',50,'ml'],['Juodųjų serbentų likeris',15,'ml'],['Laimo sultys',15,'ml'],['Imbierinis alus',100,'ml']],
  ['Į taurę su ledu įpilk tequila, likerį ir laimo sultis.','Užpilk imbieriniu alumi.','Švelniai išmaišyk.','Papuošk laimo griežinėliu.'])
];
const COCKTAIL_META = {
  k01:{spirit:'romas',sweetness:'vidutinis',refreshing:true}, k02:{spirit:'romas',sweetness:'saldus',refreshing:true},
  k03:{spirit:'degtine',sweetness:'sausas',refreshing:true}, k04:{spirit:'dzinas',sweetness:'sausas',refreshing:true},
  k05:{spirit:'kita',sweetness:'vidutinis',refreshing:true}, k06:{spirit:'tequila',sweetness:'vidutinis',refreshing:false},
  k07:{spirit:'degtine',sweetness:'vidutinis',refreshing:false}, k08:{spirit:'romas',sweetness:'saldus',refreshing:true},
  k09:{spirit:'viskis',sweetness:'vidutinis',refreshing:false}, k10:{spirit:'kita',sweetness:'vidutinis',refreshing:true},
  k11:{spirit:'degtine',sweetness:'saldus',refreshing:true}, k12:{spirit:'degtine',sweetness:'sausas',refreshing:false},
  k13:{spirit:'dzinas',sweetness:'sausas',refreshing:false}, k14:{spirit:'romas',sweetness:'vidutinis',refreshing:false},
  k15:{spirit:'degtine',sweetness:'vidutinis',refreshing:true}, k16:{spirit:'kita',sweetness:'saldus',refreshing:true},
  k17:{spirit:'romas',sweetness:'saldus',refreshing:true}, k18:{spirit:'degtine',sweetness:'saldus',refreshing:false},
  k19:{spirit:'tequila',sweetness:'vidutinis',refreshing:true}, k20:{spirit:'romas',sweetness:'vidutinis',refreshing:true},
  k21:{spirit:'konjakas',sweetness:'vidutinis',refreshing:false}, k22:{spirit:'viskis',sweetness:'sausas',refreshing:false},
  k23:{spirit:'dzinas',sweetness:'vidutinis',refreshing:true}, k24:{spirit:'tequila',sweetness:'saldus',refreshing:true},
  k25:{spirit:'kita',sweetness:'saldus',refreshing:true},
  k26:{spirit:'dzinas',sweetness:'vidutinis',refreshing:true}, k27:{spirit:'kita',sweetness:'saldus',refreshing:false},
  k28:{spirit:'degtine',sweetness:'saldus',refreshing:false}, k29:{spirit:'degtine',sweetness:'vidutinis',refreshing:false},
  k30:{spirit:'kita',sweetness:'saldus',refreshing:true}, k31:{spirit:'viskis',sweetness:'saldus',refreshing:false},
  k32:{spirit:'viskis',sweetness:'sausas',refreshing:false}, k33:{spirit:'dzinas',sweetness:'vidutinis',refreshing:true},
  k34:{spirit:'dzinas',sweetness:'saldus',refreshing:false}, k35:{spirit:'kita',sweetness:'saldus',refreshing:true},
  k36:{spirit:'viskis',sweetness:'sausas',refreshing:false}, k37:{spirit:'kita',sweetness:'saldus',refreshing:true},
  k38:{spirit:'dzinas',sweetness:'vidutinis',refreshing:false}, k39:{spirit:'viskis',sweetness:'sausas',refreshing:false},
  k40:{spirit:'degtine',sweetness:'vidutinis',refreshing:false},
  k41:{spirit:'degtine',sweetness:'saldus',refreshing:true}, k42:{spirit:'degtine',sweetness:'saldus',refreshing:true},
  k43:{spirit:'viskis',sweetness:'vidutinis',refreshing:true}, k44:{spirit:'tequila',sweetness:'saldus',refreshing:true},
  k45:{spirit:'kita',sweetness:'vidutinis',refreshing:true}, k46:{spirit:'dzinas',sweetness:'vidutinis',refreshing:true},
  k47:{spirit:'degtine',sweetness:'vidutinis',refreshing:true}, k48:{spirit:'viskis',sweetness:'saldus',refreshing:false},
  k49:{spirit:'kita',sweetness:'saldus',refreshing:false}, k50:{spirit:'viskis',sweetness:'sausas',refreshing:false},
  k51:{spirit:'dzinas',sweetness:'vidutinis',refreshing:true}, k52:{spirit:'tequila',sweetness:'vidutinis',refreshing:true}
};
COCKTAILS.forEach(c=>{ const m=COCKTAIL_META[c.id]||{spirit:'kita',sweetness:'vidutinis',refreshing:false}; Object.assign(c,m); });

/* ===================== STATE ===================== */
let equipment = load('vk_equipment', []);
let barTools = load('vk_barTools', []);
if(barTools.includes('baro_irankiai')){ barTools = ['seikeris','grustuve','kostuvas']; save('vk_barTools', barTools); }
let pantry = load('vk_pantry', []);
let customRecipes = load('vk_customRecipes', []);
let cookLog = load('vk_cookLog', []);
let calorieLog = load('vk_calorieLog', []);
let mealPlan = load('vk_mealPlan', {});
let favorites = load('vk_favorites', []);
let ratings = load('vk_ratings', {});
let notes = load('vk_notes', {});
let planTemplates = load('vk_planTemplates', []);
let productCache = load('vk_productCache', {});
let itemFrequency = load('vk_itemFrequency', {});
let logFrequency = load('vk_logFrequency', {});
let waterLog = load('vk_waterLog', {});
let collections = load('vk_collections', []);
let shoppingTemplates = load('vk_shoppingTemplates', []);
let settings = load('vk_settings', {goalKcal:2000, goalProtein:100, goalCarbs:230, goalFat:65, goalWaterMl:2000, theme:'light', showAlmostReady:true, onboarded:false, noEquipmentConfirmed:false, fontSize:'normal', lastBackupReminder:0});
if(!settings.fontSize) settings.fontSize = settings.fontLarge ? 'large' : 'normal';
if(settings.showAlmostReady===undefined) settings.showAlmostReady = true;
if(settings.goalWaterMl===undefined) settings.goalWaterMl = 2000;

let activeCollectionId = null;
let lastAction = null;

let onlyMakeable = false, quickTime = false, quickParty = false, favOnly = false, refreshingOnly = false;
let activeCategories = new Set(), activeCuisines = new Set(), activeDietFilters = new Set(), activeDifficulty = new Set();
let activeSpirits = new Set(), activeSweetness = new Set();
let recipeViewMode = 'food';
let logDate = todayStr();
let planWeekOffset = 0;
let expandedCats = new Set();
let pantryLocationFilter = 'visos';
let settingsEquipOpen = false;
let currentDetailServings = null, currentDetailRecipeId = null;
let scannerControls = null;
let cookModeRecipeId = null, cookModeStep = 0, cookModeWakeLock = null, cookModeTimer = null;

function allFood(){ return BUILTIN_RECIPES.concat(customRecipes); }
function allRecipes(){ return BUILTIN_RECIPES.concat(COCKTAILS).concat(customRecipes); }

/* ===================== INIT ===================== */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', settings.theme || 'light');
  applyFontSize();
  document.getElementById('fontSizeSelect').value = settings.fontSize;
  document.getElementById('themeToggle').checked = settings.theme === 'dark';
  document.getElementById('almostReadyToggle').checked = settings.showAlmostReady !== false;
  document.getElementById('setGoalWater').value = settings.goalWaterMl;
  renderEquipment();
  renderBarTools();
  renderPantry();
  renderRecipes();
  renderLog();
  renderPlan();
  renderStats();
  updateFilterBadge();
  document.getElementById('setGoalKcal').value = settings.goalKcal;
  document.getElementById('setGoalProtein').value = settings.goalProtein;
  document.getElementById('setGoalCarbs').value = settings.goalCarbs;
  document.getElementById('setGoalFat').value = settings.goalFat;
  updateBell();
  document.getElementById('bellBtn').addEventListener('click', ()=>{ switchView('pantry'); });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if(!newSW) return;
        newSW.addEventListener('statechange', () => {
          if(newSW.state==='activated' && navigator.serviceWorker.controller){
            // a genuinely new version took over (not the first install)
            if(!sessionStorage.getItem('vk_reloaded_for_update')){
              sessionStorage.setItem('vk_reloaded_for_update','1');
              toast('Įkeliama naujausia versija...');
              setTimeout(()=>location.reload(), 600);
            }
          }
        });
      });
      // actively check for a newer sw.js right away, not just on next natural visit
      reg.update().catch(()=>{});
    }).catch(()=>{});
  }
  if(!settings.onboarded){ setTimeout(openOnboarding, 300); }
  else { checkBackupReminder(); }
});

/* ===================== NAV ===================== */
const TITLES = {pantry:'Sandėlis', recipes:'Receptai', log:'Kalorijos', plan:'Savaitės planas', settings:'Nustatymai'};
function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.view===name));
  document.getElementById('pageTitle').textContent = TITLES[name];
  document.querySelector('main').scrollTop = 0;
}
function toast(msg, action){
  const t = document.getElementById('toast');
  t.innerHTML = action ? `<span>${msg}</span> <button class="toast-action" id="toastActionBtn">${action.label}</button>` : msg;
  t.classList.add('show');
  if(action){
    document.getElementById('toastActionBtn').onclick = ()=>{ action.fn(); t.classList.remove('show'); };
  }
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=>t.classList.remove('show'), action ? 5000 : 1800);
}
function closeModal(){
  stopScanner();
  cleanupCookMode();
  document.getElementById('modalOverlay').classList.add('hidden');
  document.getElementById('modalContent').innerHTML='';
}
function cleanupCookMode(){
  if(cookModeTimer){ clearInterval(cookModeTimer); cookModeTimer=null; }
  if(cookModeWakeLock){ try{ cookModeWakeLock.release(); }catch(e){} cookModeWakeLock=null; }
  cookModeRecipeId = null;
}
function openModal(html){
  document.getElementById('modalContent').innerHTML = '<button class="modal-close" onclick="closeModal()">✕</button>' + html;
  document.getElementById('modalOverlay').classList.remove('hidden');
}
document.addEventListener('click', (e)=>{ if(e.target.id==='modalOverlay') closeModal(); });

/* ===================== EQUIPMENT (Settings accordion) ===================== */
function toggleEquipSection(){
  settingsEquipOpen = !settingsEquipOpen;
  document.getElementById('equipBody').style.display = settingsEquipOpen ? 'block' : 'none';
  document.getElementById('equipChevron').classList.toggle('open', settingsEquipOpen);
}
function renderEquipment(){
  const grid = document.getElementById('equipGrid');
  grid.innerHTML = EQUIPMENT.map(e => `
    <div class="equip-chip ${equipment.includes(e.id)?'on':''}" onclick="toggleEquipment('${e.id}')">
      <span class="ico">${e.icon}</span><span class="lbl">${e.label}</span>
    </div>`).join('');
  document.getElementById('equipCount').textContent = equipment.length + ' pasirinkta';
}
function toggleEquipment(id){
  if(equipment.includes(id)) equipment = equipment.filter(x=>x!==id); else equipment.push(id);
  save('vk_equipment', equipment);
  renderEquipment(); renderRecipes();
}

let settingsBarOpen = false;
function toggleBarSection(){
  settingsBarOpen = !settingsBarOpen;
  document.getElementById('barBody').style.display = settingsBarOpen ? 'block' : 'none';
  document.getElementById('barChevron').classList.toggle('open', settingsBarOpen);
}
function renderBarTools(){
  const grid = document.getElementById('barGrid');
  if(!grid) return;
  grid.innerHTML = BAR_TOOLS.map(e => `
    <div class="equip-chip ${barTools.includes(e.id)?'on':''}" onclick="toggleBarTool('${e.id}')">
      <span class="ico">${e.icon}</span><span class="lbl">${e.label}</span>
    </div>`).join('');
  document.getElementById('barCount').textContent = barTools.length + ' pasirinkta';
}
function toggleBarTool(id){
  if(barTools.includes(id)) barTools = barTools.filter(x=>x!==id); else barTools.push(id);
  save('vk_barTools', barTools);
  renderBarTools(); renderRecipes();
}

/* ===================== ONBOARDING WIZARD ===================== */
const COMMON_START_ITEMS = [
  {name:'Pienas', category:'Pieno produktai', unit:'l', qty:1},
  {name:'Kiaušiniai', category:'Kiaušiniai', unit:'vnt', qty:10},
  {name:'Bulvės', category:'Daržovės', unit:'kg', qty:2},
  {name:'Duona', category:'Grūdai ir makaronai', unit:'vnt', qty:1},
  {name:'Sviestas', category:'Pieno produktai', unit:'g', qty:200},
  {name:'Druska', category:'Prieskoniai ir padažai', unit:'g', qty:500},
  {name:'Aliejus', category:'Prieskoniai ir padažai', unit:'l', qty:1},
  {name:'Cukrus', category:'Kepimo produktai', unit:'kg', qty:1},
];
let onboardStep = 0;
let onboardSelectedItems = new Set();
function openOnboarding(){
  onboardStep = 0;
  renderOnboardStep();
}
function renderOnboardStep(){
  if(onboardStep===0){
    openModal(`
      <h2>Sveiki! 👋</h2>
      <p>Per 3 trumpus žingsnius paruošime programėlę jums. Pradėkime nuo virtuvės prietaisų.</p>
      <div class="section-title" style="margin-top:0">Kokius prietaisus turite?</div>
      <div class="equip-grid" id="onboardEquipGrid">${EQUIPMENT.map(e=>`
        <div class="equip-chip ${equipment.includes(e.id)?'on':''}" onclick="toggleEquipment('${e.id}');this.classList.toggle('on')"><span class="ico">${e.icon}</span><span class="lbl">${e.label}</span></div>`).join('')}</div>
      <div class="section-title">Baro įrankiai (kokteiliams)</div>
      <div class="equip-grid" id="onboardBarGrid">${BAR_TOOLS.map(e=>`
        <div class="equip-chip ${barTools.includes(e.id)?'on':''}" onclick="toggleBarTool('${e.id}');this.classList.toggle('on')"><span class="ico">${e.icon}</span><span class="lbl">${e.label}</span></div>`).join('')}</div>
      <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="settings.noEquipmentConfirmed=true;save('vk_settings',settings);toast('Gerai, galėsite pridėti vėliau Nustatymuose')">Neturiu nė vieno</button>
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn-outline" onclick="skipOnboarding()">Praleisti visą</button>
        <button class="btn btn-primary" onclick="onboardStep=1;renderOnboardStep()">Kitas ›</button>
      </div>
    `);
  } else if(onboardStep===1){
    openModal(`
      <h2>Keli dažni produktai</h2>
      <p>Pažymėkite, ką turite namuose — pridėsime iškart su įprastais kiekiais (vėliau galėsite koreguoti).</p>
      <div id="onboardItemsList">${COMMON_START_ITEMS.map((it,i)=>`
        <div class="settings-row" style="cursor:pointer" onclick="toggleOnboardItem(${i})">
          <span>${it.name}</span>
          <input type="checkbox" ${onboardSelectedItems.has(i)?'checked':''} onclick="event.stopPropagation();toggleOnboardItem(${i})">
        </div>`).join('')}</div>
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn-outline" onclick="onboardStep=0;renderOnboardStep()">‹ Atgal</button>
        <button class="btn btn-primary" onclick="onboardStep=2;renderOnboardStep()">Kitas ›</button>
      </div>
    `);
  } else {
    openModal(`
      <h2>Kalorijų tikslas</h2>
      <p>Kiek kalorijų per dieną norite stebėti? Vėliau galėsite pakeisti Nustatymuose.</p>
      <label>Kalorijų tikslas (kcal)</label>
      <input type="number" id="onboardGoalKcal" value="${settings.goalKcal}">
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn-outline" onclick="onboardStep=1;renderOnboardStep()">‹ Atgal</button>
        <button class="btn btn-primary" onclick="finishOnboarding()">Baigti ✓</button>
      </div>
    `);
  }
}
function toggleOnboardItem(i){
  if(onboardSelectedItems.has(i)) onboardSelectedItems.delete(i); else onboardSelectedItems.add(i);
  renderOnboardStep();
}
function finishOnboarding(){
  const goal = parseInt(document.getElementById('onboardGoalKcal').value)||2000;
  settings.goalKcal = goal;
  settings.onboarded = true;
  save('vk_settings', settings);
  onboardSelectedItems.forEach(i=>{
    const it = COMMON_START_ITEMS[i];
    pantry.push({id:uid(), name:it.name, category:it.category, qty:it.qty, unit:it.unit, low:null, freshness:null, location:null, expiresOn:null});
  });
  save('vk_pantry', pantry);
  closeModal();
  renderEquipment(); renderPantry(); renderRecipes(); renderLog();
  toast('Viskas paruošta! Malonaus naudojimosi 🎉');
}
function skipOnboarding(){
  settings.onboarded = true;
  save('vk_settings', settings);
  closeModal();
}

/* ===================== BACKUP REMINDER ===================== */
function checkBackupReminder(){
  const DAY = 86400000;
  const hasData = pantry.length>0 || cookLog.length>0;
  if(!hasData) return;
  if(Date.now() - (settings.lastBackupReminder||0) > 14*DAY){
    settings.lastBackupReminder = Date.now();
    save('vk_settings', settings);
    setTimeout(()=>toast('💾 Nepamirškite pasidaryti atsarginės kopijos (Nustatymai)', {label:'Eksportuoti', fn: exportData}), 1200);
  }
}

/* ===================== PANTRY ===================== */
function lowStockItems(){ return pantry.filter(p => p.low!=null && p.qty <= p.low); }
function expiringSoonItems(){ return pantry.filter(p => p.expiresOn && daysUntil(p.expiresOn)!=null && daysUntil(p.expiresOn) <= 3 && daysUntil(p.expiresOn) >= 0); }
function expiredItems(){ return pantry.filter(p => p.expiresOn && daysUntil(p.expiresOn) < 0); }
function updateBell(){
  const alertCount = lowStockItems().length + expiringSoonItems().length + expiredItems().length;
  document.getElementById('bellBtn').classList.toggle('has-alert', alertCount>0);
}
function renderPantry(){
  const box = document.getElementById('pantryList');
  const alertBox = document.getElementById('pantryAlert');
  const low = lowStockItems(), expiring = expiringSoonItems(), expired = expiredItems();
  let alertHtml='';
  if(equipment.length===0 && !settings.noEquipmentConfirmed){
    alertHtml += `<div class="alert-banner"><div><strong>🔧 Nepasirinkote virtuvės prietaisų</strong>
      Kad receptai rodytų tikslų atitikimą, pasirinkite, ką turite.
      <div class="btn-row" style="margin-top:8px">
        <button class="btn btn-primary btn-sm" onclick="goToEquipmentSettings()">Pasirinkti dabar</button>
        <button class="btn btn-outline btn-sm" onclick="settings.noEquipmentConfirmed=true;save('vk_settings',settings);renderPantry()">Neturiu nė vieno</button>
      </div></div></div>`;
  }
  if(expired.length) alertHtml += `<div class="alert-banner"><div><strong>❌ Pasibaigęs galiojimas (${expired.length})</strong><ul>${expired.map(i=>`<li>${i.name}</li>`).join('')}</ul></div></div>`;
  if(expiring.length) alertHtml += `<div class="alert-banner"><div><strong>⏳ Greitai baigsis galiojimas (${expiring.length})</strong><ul>${expiring.map(i=>`<li>${i.name} — ${daysUntil(i.expiresOn)===0?'šiandien':daysUntil(i.expiresOn)+' d.'}</li>`).join('')}</ul></div></div>`;
  if(low.length) alertHtml += `<div class="alert-banner"><div><strong>⚠️ Baigiasi (${low.length})</strong><ul>${low.map(i=>`<li>${i.name} (liko ${i.qty} ${i.unit})</li>`).join('')}</ul></div></div>`;
  alertBox.innerHTML = alertHtml;
  updateBell();

  const locBox = document.getElementById('pantryLocFilter');
  const locs = ['visos'].concat(LOCATIONS);
  locBox.innerHTML = locs.map(l=>`<button class="toggle-chip ${pantryLocationFilter===l?'on':''}" onclick="setPantryLocFilter('${l}')">${l==='visos'?'Visos vietos':l}</button>`).join('');

  if(!pantry.length){
    box.innerHTML = `<div class="empty-state"><span class="big">🧺</span>Sandėlis tuščias.<br>Pridėkite produktų, kuriuos turite namuose.</div>`;
    renderAlmostReady(); return;
  }
  const filtered = pantryLocationFilter==='visos' ? pantry : pantry.filter(p=>p.location===pantryLocationFilter);
  let html='';
  PANTRY_CATEGORIES.forEach(cat=>{
    const items = filtered.filter(p=>p.category===cat);
    if(!items.length) return;
    const lowCount = items.filter(it=>it.low!=null && it.qty<=it.low).length;
    const isOpen = expandedCats.has(cat);
    html += `<div class="card pantry-cat" style="padding:0;overflow:hidden">
      <div class="cat-head" onclick="togglePantryCat('${cat}')">
        <span class="cat-chevron ${isOpen?'open':''}">›</span>
        <span class="cat-name">${cat}</span>
        <span class="cat-count">${items.length}${lowCount?` · ⚠️ ${lowCount}`:''}</span>
      </div>`;
    if(isOpen){
      html += `<div class="cat-body">`;
      items.forEach(it=>{
        const isLow = it.low!=null && it.qty <= it.low;
        const badges = [];
        if(it.freshness) badges.push(it.freshness);
        if(it.location) badges.push(it.location);
        if(it.expiresOn) badges.push('iki '+it.expiresOn.slice(5));
        html += `<div class="pantry-item ${isLow?'low':''}" data-id="${it.id}">
          <span class="pname">${it.name}${badges.length?`<br><small class="hint" style="margin:0">${badges.join(' · ')}</small>`:''}</span>
          <div class="qty-btns">
            <button onclick="adjustPantryQty('${it.id}',-1)">−</button>
            <span class="pqty">${it.qty} ${it.unit}</span>
            <button onclick="adjustPantryQty('${it.id}',1)">+</button>
          </div>
          <button class="icon-btn" onclick="openPantryForm('${it.id}')" title="Redaguoti">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
          <button class="icon-btn" onclick="deletePantryItem('${it.id}')" title="Trinti">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
          </button>
        </div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  });
  box.innerHTML = html || `<div class="empty-state"><span class="big">🔎</span>Nieko nerasta pagal pasirinktą vietą.</div>`;
  attachSwipeToDelete(box, '.pantry-item', deletePantryItem);
  renderUseItUpSoon();
  renderAlmostReady();
}
function setPantryLocFilter(l){ pantryLocationFilter=l; renderPantry(); }
function togglePantryCat(cat){ if(expandedCats.has(cat)) expandedCats.delete(cat); else expandedCats.add(cat); renderPantry(); }
function adjustPantryQty(id, delta){
  const it = pantry.find(p=>p.id===id); if(!it) return;
  const step = it.unit==='vnt' || it.unit==='šauk.' ? 1 : (it.unit==='kg'||it.unit==='l' ? 0.1 : 10);
  it.qty = Math.max(0, Math.round((it.qty + delta*step)*100)/100);
  save('vk_pantry', pantry); renderPantry(); renderRecipes();
}
function deletePantryItem(id){
  const idx = pantry.findIndex(p=>p.id===id);
  if(idx===-1) return;
  const removed = pantry[idx];
  pantry = pantry.filter(p=>p.id!==id);
  save('vk_pantry', pantry); renderPantry(); renderRecipes();
  toast('Produktas ištrintas', {label:'Anuliuoti', fn:()=>{ pantry.splice(idx,0,removed); save('vk_pantry', pantry); renderPantry(); renderRecipes(); }});
}
function goToEquipmentSettings(){
  switchView('settings');
  if(!settingsEquipOpen) toggleEquipSection();
}

/* ===================== PANTRY "APSIPIRKAU" CHECKLIST ===================== */
function openPantryShoppingDialog(){
  openModal(`
    <h2>✅ Apsipirkau</h2>
    <small class="hint">Pažymėkite, ką pirkote, nurodykite kiekį — bus sudėta į sandėlį.</small>
    <input type="text" id="boughtSearch" placeholder="Ieškoti produkto..." oninput="renderBoughtCatalog(this.value)" style="margin:10px 0">
    <div id="boughtCatalogBox" style="max-height:52vh;overflow-y:auto"></div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn btn-outline" onclick="openPantryForm()">Kito produkto nėra sąraše</button>
      <button class="btn btn-primary" onclick="confirmPantryShopping()">Sudėti į sandėlį</button>
    </div>
  `);
  renderBoughtCatalog('');
}
function renderBoughtCatalog(filter){
  const f = normName(filter||'');
  const box = document.getElementById('boughtCatalogBox');
  let html = '';
  Object.entries(SHOPPING_CATALOG).forEach(([cat, items])=>{
    const filtered = f ? items.filter(name=>normName(name).includes(f)) : items;
    if(!filtered.length) return;
    html += `<div style="font-weight:700;font-size:12.5px;color:var(--muted);margin:12px 0 4px">${cat}</div>`;
    filtered.forEach(name=>{
      const unit = defaultUnitFor(name);
      const safeName = name.replace(/"/g,'&quot;');
      html += `<div class="settings-row" style="align-items:center;gap:8px;padding:7px 0">
        <label style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;margin:0">
          <input type="checkbox" class="bought-chk" data-name="${safeName}" data-unit="${unit}" data-cat="${cat}" onchange="toggleBoughtQty(this)">
          <span>${name}</span>
        </label>
        <input type="text" inputmode="decimal" class="bought-qty" value="1" style="width:56px;display:none;padding:6px 8px">
        <span class="bought-unit-label" style="width:34px;font-size:12px;color:var(--muted);display:none">${unit}</span>
      </div>`;
    });
  });
  box.innerHTML = html || `<p class="hint">Nieko nerasta. Paspauskite „Kito produkto nėra sąraše" žemiau.</p>`;
}
function toggleBoughtQty(chk){
  const row = chk.closest('.settings-row');
  const qty = row.querySelector('.bought-qty');
  const unitLbl = row.querySelector('.bought-unit-label');
  const show = chk.checked ? 'inline-block' : 'none';
  qty.style.display = show;
  unitLbl.style.display = show;
}
function confirmPantryShopping(){
  const checked = document.querySelectorAll('#boughtCatalogBox .bought-chk:checked');
  if(!checked.length){ toast('Nepažymėjote nė vieno produkto'); return; }
  let added = 0;
  checked.forEach(chk=>{
    const name = chk.dataset.name;
    const unit = chk.dataset.unit;
    const cat = chk.dataset.cat;
    const row = chk.closest('.settings-row');
    const qty = parseLocaleNumber(row.querySelector('.bought-qty').value) || 1;
    const existing = pantry.find(p=>normName(p.name)===normName(name) && p.unit===unit);
    if(existing){ existing.qty = Math.round((existing.qty+qty)*100)/100; }
    else { pantry.push({id:uid(), name, category:cat, qty, unit, low:null, freshness:null, location:null, expiresOn:null}); }
    itemFrequency[name] = {count:((itemFrequency[name]&&itemFrequency[name].count)||0)+1, category:cat, unit};
    added++;
  });
  save('vk_pantry', pantry);
  save('vk_itemFrequency', itemFrequency);
  closeModal();
  renderPantry(); renderRecipes();
  toast(added+' produktai sudėti į sandėlį');
}

function renderUseItUpSoon(){
  const box = document.getElementById('useItUpBox');
  if(!box) return;
  const expiring = expiringSoonItems();
  if(!expiring.length){ box.innerHTML=''; return; }
  const matches = allFood().map(r=>{
    const usesExpiring = r.ingredients.filter(i => expiring.some(e => normName(e.name).includes(normName(i.name)) || normName(i.name).includes(normName(e.name))));
    return {r, usesExpiring};
  }).filter(x=>x.usesExpiring.length>0).sort((a,b)=>b.usesExpiring.length-a.usesExpiring.length).slice(0,3);
  if(!matches.length){ box.innerHTML=''; return; }
  box.innerHTML = `<div class="card" style="margin-bottom:12px">
    <div class="section-title" style="margin-top:0">⏳ Sunaudokite greičiau</div>
    ${matches.map(m=>`<div class="almost-row" onclick="openRecipeDetail('${m.r.id}')">
      <div class="aname">${m.r.name}</div><div class="amiss" style="color:var(--primary-dark)">naudoja: ${m.usesExpiring.map(i=>i.name).join(', ')}</div>
    </div>`).join('')}
  </div>`;
}
const SHOPPING_CATALOG = {
  'Pieno produktai': ['Pienas','Grietinė','Grietinėlė','Jogurtas','Varškė','Kietasis sūris','Fetos sūris','Mocarela','Sviestas','Kefyras'],
  'Kiaušiniai': ['Kiaušiniai'],
  'Mėsa ir žuvis': ['Vištienos filė','Vištienos šlaunelės','Jautiena','Kiauliena','Bekonas','Kumpis','Dešrelės','Lašiša','Krevetės','Tunas','Kalakutiena'],
  'Daržovės': ['Bulvės','Svogūnas','Česnakas','Morka','Pomidoras','Agurkas','Paprika','Cukinija','Kopūstas','Brokoliai','Salotos','Špinatai','Moliūgas'],
  'Vaisiai': ['Bananas','Obuolys','Citrina','Apelsinas','Avokadas','Uogos'],
  'Grūdai, kruopos ir makaronai': ['Ryžiai','Grikiai','Makaronai','Bulgurai'],
  'Miltai ir dribsniai': ['Miltai','Avižiniai dribsniai','Manų kruopos'],
  'Duona ir kepiniai': ['Duona','Batonas','Tortilijos'],
  'Ankštiniai': ['Lęšiai','Avinžirniai','Pupelės'],
  'Konservai': ['Konservuoti pomidorai','Kukurūzai','Žirneliai'],
  'Prieskoniai ir žolelės': ['Druska','Pipirai','Bazilikas','Krapai'],
  'Padažai ir aliejus': ['Aliejus','Alyvuogių aliejus','Sojos padažas','Majonezas','Pomidorų padažas','Garstyčios'],
  'Kepimo produktai': ['Cukrus','Medus','Mielės','Kepimo milteliai'],
  'Sultys': ['Apelsinų sultys','Obuolių sultys'],
  'Gėrimai': ['Kava','Arbata','Vanduo'],
};
const COMMON_PRODUCTS = Object.values(SHOPPING_CATALOG).flat();
const PRODUCT_CATEGORY_KEYWORDS = Object.entries(SHOPPING_CATALOG).flatMap(([cat,items])=>items.map(name=>[normName(name),cat]));
function guessCategoryByKeyword(name){
  const n = normName(name);
  for(const [key,cat] of PRODUCT_CATEGORY_KEYWORDS){ if(n.includes(key)||key.includes(n)) return cat; }
  return 'Kita';
}
function pantrySuggestionOptions(){
  const freq = Object.keys(itemFrequency).sort((a,b)=>(itemFrequency[b].count||0)-(itemFrequency[a].count||0));
  const merged = [...new Set(freq.concat(COMMON_PRODUCTS))];
  return merged.map(n=>`<option value="${n}">`).join('');
}
function topFrequentItems(n){
  return Object.entries(itemFrequency).sort((a,b)=>b[1].count-a[1].count).slice(0,n).map(([name])=>name);
}
let pfUnitManuallySet = false;
function openPantryForm(id, prefill){
  pfUnitManuallySet = false;
  const editing = id ? pantry.find(p=>p.id===id) : null;
  const pre = prefill || {};
  const cat = (editing && editing.category) || pre.category || PANTRY_CATEGORIES[0];
  const quick = !editing ? topFrequentItems(6) : [];
  openModal(`
    <h2>${editing?'Redaguoti produktą':'Pridėti produktą'}</h2>
    ${pre.fromScan ? `<small class="hint" style="margin-bottom:8px">Duomenys užpildyti iš Open Food Facts — patikrinkite prieš išsaugant.</small>` : ''}
    ${quick.length?`<div class="filter-row" style="margin-bottom:2px">${quick.map(n=>`<button class="toggle-chip" onclick="fillFromFrequent('${n.replace(/'/g,"\\'")}')">${n}</button>`).join('')}</div>`:''}
    <label>Pavadinimas</label>
    <input id="pf_name" list="pantryProductList" value="${editing?editing.name:(pre.name||'')}" placeholder="pvz. Bulvės, arba rinkitės iš sąrašo" oninput="onPantryNameChange()">
    <datalist id="pantryProductList">${pantrySuggestionOptions()}</datalist>
    <label>Kategorija</label>
    <select id="pf_cat" onchange="onPantryCatChange()">${PANTRY_CATEGORIES.map(c=>`<option ${cat===c?'selected':''}>${c}</option>`).join('')}</select>
    <div class="field-row">
      <div><label>Kiekis</label><input id="pf_qty" type="text" inputmode="decimal" placeholder="pvz. 1,5" value="${editing?String(editing.qty).replace('.',','):(pre.qty||'')}"></div>
      <div><label>Vnt.</label><select id="pf_unit" onchange="pfUnitManuallySet=true;refreshLowPresets()">${UNITS.map(u=>`<option ${(editing&&editing.unit===u)||(pre.unit===u)?'selected':''}>${u}</option>`).join('')}</select></div>
      <div><label>Min. riba</label>
        <input id="pf_low" type="text" inputmode="decimal" list="pf_low_list" placeholder="pvz. 2" value="${editing&&editing.low!=null?String(editing.low).replace('.',','):''}">
        <datalist id="pf_low_list"></datalist>
      </div>
    </div>
    <div id="pf_fresh_wrap" style="display:${FRESHNESS_CATEGORIES.includes(cat)?'block':'none'}">
      <label>Šviežumas</label>
      <select id="pf_fresh"><option value="">—</option>${FRESHNESS_OPTIONS.map(f=>`<option ${editing&&editing.freshness===f?'selected':''}>${f}</option>`).join('')}</select>
    </div>
    <label>Vieta</label>
    <select id="pf_loc" onchange="onPantryLocationChange()"><option value="">—</option>${LOCATIONS.map(l=>`<option ${editing&&editing.location===l?'selected':''}>${l}</option>`).join('')}</select>
    <label>Galioja iki (nebūtina)</label>
    <input id="pf_exp" type="date" value="${editing&&editing.expiresOn?editing.expiresOn:''}">
    <small class="hint" id="pf_exp_hint"></small>
    <small class="hint">Standartinis vienetas ir galiojimo laikas pasiūlomi automatiškai — galite juos koreguoti.</small>
    <button class="btn btn-primary" style="margin-top:16px" onclick="savePantryItem(${editing?`'${id}'`:'null'})">Išsaugoti</button>
  `);
  refreshLowPresets();
}
function onPantryNameChange(){
  const name = document.getElementById('pf_name').value;
  if(!name) return;
  // suggest default unit only if user hasn't manually chosen one
  const unitEl = document.getElementById('pf_unit');
  if(!pfUnitManuallySet){
    const u = defaultUnitFor(name);
    if(u) { unitEl.value = u; refreshLowPresets(); }
  }
  // remember chosen unit from frequency
  const remembered = itemFrequency[name];
  if(remembered && remembered.unit && !pfUnitManuallySet){ unitEl.value = remembered.unit; refreshLowPresets(); }
  maybeSuggestExpiry();
}
function onPantryLocationChange(){ maybeSuggestExpiry(); }
function maybeSuggestExpiry(){
  const name = document.getElementById('pf_name').value;
  const loc = document.getElementById('pf_loc').value;
  const expEl = document.getElementById('pf_exp');
  const hint = document.getElementById('pf_exp_hint');
  if(!name || !loc){ if(hint) hint.textContent=''; return; }
  const suggested = suggestExpiry(name, loc);
  if(suggested && !expEl.value){
    expEl.value = suggested;
    const days = shelfLifeDays(name, loc);
    if(hint) hint.textContent = `Pasiūlyta pagal tipinį galiojimą (~${days} d. ${loc.toLowerCase()}e). Galite koreguoti.`;
  }
}
function fillFromFrequent(name){
  document.getElementById('pf_name').value = name;
  const remembered = itemFrequency[name];
  if(remembered){
    if(remembered.category) document.getElementById('pf_cat').value = remembered.category;
    if(remembered.unit) document.getElementById('pf_unit').value = remembered.unit;
    onPantryCatChange();
  } else {
    const u = defaultUnitFor(name);
    if(u) document.getElementById('pf_unit').value = u;
  }
  refreshLowPresets();
  maybeSuggestExpiry();
}
function onPantryCatChange(){
  const cat = document.getElementById('pf_cat').value;
  document.getElementById('pf_fresh_wrap').style.display = FRESHNESS_CATEGORIES.includes(cat) ? 'block' : 'none';
}
function refreshLowPresets(){
  const unit = document.getElementById('pf_unit').value;
  const list = document.getElementById('pf_low_list');
  if(!list) return;
  list.innerHTML = lowPresetsForUnit(unit).map(v=>`<option value="${String(v).replace('.',',')}">`).join('');
}
function savePantryItem(id){
  const name = document.getElementById('pf_name').value.trim();
  const category = document.getElementById('pf_cat').value;
  const qty = parseLocaleNumber(document.getElementById('pf_qty').value) || 0;
  const unit = document.getElementById('pf_unit').value;
  const lowRaw = document.getElementById('pf_low').value;
  const low = lowRaw==='' ? null : parseLocaleNumber(lowRaw);
  const freshEl = document.getElementById('pf_fresh');
  const freshness = freshEl && freshEl.value ? freshEl.value : null;
  const locEl = document.getElementById('pf_loc');
  const location = locEl && locEl.value ? locEl.value : null;
  const expEl = document.getElementById('pf_exp');
  const expiresOn = expEl && expEl.value ? expEl.value : null;
  if(!name){ toast('Įveskite pavadinimą'); return; }
  if(id){
    const it = pantry.find(p=>p.id===id);
    Object.assign(it, {name, category, qty, unit, low, freshness, location, expiresOn});
  } else {
    pantry.push({id:uid(), name, category, qty, unit, low, freshness, location, expiresOn});
    itemFrequency[name] = {count:((itemFrequency[name]&&itemFrequency[name].count)||0)+1, category, unit};
    save('vk_itemFrequency', itemFrequency);
  }
  save('vk_pantry', pantry);
  closeModal(); renderPantry(); renderRecipes();
  toast('Išsaugota');
}

/* ===================== BARCODE SCANNING ===================== */
function isIOSStandalone(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return isIOS && window.navigator.standalone === true;
}
function openBarcodeScanner(){
  const iosHint = isIOSStandalone() ? `<div class="alert-banner" style="margin-top:10px"><div><strong>iPhone patarimas</strong>Jei kamera neatpažįsta kodo, Apple turi žinomą ydą su kamera Home Screen programėlėse. Pabandykite atidaryti šią programėlę tiesiai per Safari (ne per Home Screen ikoną) — ten skenavimas paprastai veikia patikimiau.</div></div>` : '';
  if(typeof ZXing === 'undefined'){
    openModal(`<h2>Skenavimas nepasiekiamas</h2><p>Nepavyko įkelti skenavimo bibliotekos (reikia interneto ryšio pirmą kartą atidarant programėlę).</p>${manualBarcodeFormHtml()}`);
    bindManualBarcodeForm();
    return;
  }
  openModal(`
    <h2>Skenuoti brūkšninį kodą</h2>
    <div style="border-radius:12px;overflow:hidden;background:#000;position:relative">
      <video id="scanVideo" style="width:100%;display:block" autoplay playsinline muted></video>
    </div>
    <p id="scanStatus" class="hint" style="margin-top:10px">Nukreipkite kamerą į brūkšninį kodą, laikykite ~10–15 cm atstumu geroje šviesoje.</p>
    ${iosHint}
    ${manualBarcodeFormHtml()}
    <button class="btn btn-outline" style="margin-top:10px" onclick="closeModal()">Atšaukti</button>
  `);
  bindManualBarcodeForm();
  try{
    const codeReader = new ZXing.BrowserMultiFormatReader();
    const videoElem = document.getElementById('scanVideo');
    codeReader.decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, videoElem, (result, err, controls)=>{
      scannerControls = controls;
      if(result){ controls.stop(); onBarcodeDetected(result.getText()); }
    }).catch(()=>{
      const s = document.getElementById('scanStatus');
      if(s) s.textContent = 'Nepavyko pasiekti kameros. Patikrinkite leidimus arba įveskite kodą rankiniu būdu žemiau.';
    });
  }catch(e){
    const s = document.getElementById('scanStatus');
    if(s) s.textContent = 'Skenavimas nepavyko. Įveskite kodą rankiniu būdu žemiau.';
  }
}
function manualBarcodeFormHtml(){
  return `<div style="margin-top:14px">
    <label>Arba įveskite kodą rankiniu būdu</label>
    <div style="display:flex;gap:8px">
      <input id="manualBarcode" type="text" inputmode="numeric" placeholder="pvz. 4770001234567">
      <button class="btn btn-primary btn-sm" id="manualBarcodeBtn">Ieškoti</button>
    </div>
  </div>`;
}
function bindManualBarcodeForm(){
  const btn = document.getElementById('manualBarcodeBtn');
  if(btn) btn.addEventListener('click', ()=>{
    const val = document.getElementById('manualBarcode').value.trim();
    if(val) onBarcodeDetected(val); else toast('Įveskite kodą');
  });
}
function stopScanner(){ if(scannerControls){ try{ scannerControls.stop(); }catch(e){} scannerControls=null; } }
async function onBarcodeDetected(code){
  stopScanner();
  closeModal();
  if(productCache[code]){
    toast('Rasta podėlyje (be interneto): '+productCache[code].name);
    openPantryForm(null, {name:productCache[code].name, category:'Kita', unit:'vnt', qty:1, fromScan:true});
    return;
  }
  if(!navigator.onLine){
    toast('Nėra interneto ryšio, o šis kodas dar nebuvo skenuotas anksčiau. Įveskite rankiniu būdu.');
    openPantryForm();
    return;
  }
  toast('Rastas kodas: '+code+' — ieškoma...');
  try{
    const resp = await fetch('https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(code)+'.json?fields=product_name,product_name_lt,quantity', {headers:{'User-Agent':'ManoVirtuve - Lietuviska maisto app'}});
    const data = await resp.json();
    if(data && data.status===1 && data.product){
      const name = data.product.product_name_lt || data.product.product_name || 'Nežinomas produktas';
      productCache[code] = {name, ts:Date.now()};
      save('vk_productCache', productCache);
      openPantryForm(null, {name, category:'Kita', unit:'vnt', qty:1, fromScan:true});
    } else {
      toast('Produktas nerastas duomenų bazėje. Įveskite rankiniu būdu.');
      openPantryForm();
    }
  }catch(e){
    toast('Nepavyko gauti duomenų. Įveskite rankiniu būdu.');
    openPantryForm();
  }
}

/* ===================== ALMOST READY SUGGESTIONS ===================== */
function toggleAlmostReadySetting(){
  settings.showAlmostReady = document.getElementById('almostReadyToggle').checked;
  save('vk_settings', settings); renderPantry();
}
function renderAlmostReady(){
  const box = document.getElementById('almostReadyBox');
  if(!settings.showAlmostReady){ box.innerHTML=''; return; }
  const candidates = allFood().map(r=>{
    const m = recipeMatch(r);
    const missing = r.ingredients.filter(i=>ingredientStatus(i)!=='ok').map(i=>i.name);
    return {r, m, missing};
  }).filter(c => c.m.equipOk && c.missing.length>=1 && c.missing.length<=3)
    .sort((a,b)=> a.missing.length-b.missing.length || b.m.pct-a.m.pct)
    .slice(0,4);
  if(!candidates.length){ box.innerHTML=''; return; }
  box.innerHTML = `<div class="card" style="margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span class="section-title" style="margin:0">🍳 Beveik galite pagaminti</span>
      <button class="icon-btn" onclick="hideAlmostReady()" title="Slėpti">✕</button>
    </div>
    ${candidates.map(c=>`<div class="almost-row" onclick="openRecipeDetail('${c.r.id}')">
        <div class="aname">${c.r.name}</div><div class="amiss">trūksta: ${c.missing.join(', ')}</div>
      </div>`).join('')}
  </div>`;
}
function hideAlmostReady(){
  settings.showAlmostReady = false; save('vk_settings', settings);
  const t = document.getElementById('almostReadyToggle'); if(t) t.checked = false;
  renderPantry();
  toast('Paslėpta. Vėl įjungti galite Nustatymuose.');
}

/* ===================== INGREDIENT MATCHING (with quantity sufficiency) ===================== */
function ingredientAvailable(ingName){
  const n = normName(ingName);
  return pantry.find(p => { const pn=normName(p.name); return pn===n || pn.includes(n) || n.includes(pn); });
}
function ingredientStatus(ing, scale){
  scale = scale || 1;
  const p = ingredientAvailable(ing.name);
  if(!p) return 'missing';
  if(p.unit !== ing.unit) return 'ok'; // can't compare quantities across units, assume fine
  return p.qty >= ing.qty*scale ? 'ok' : 'low';
}
function recipeMatch(recipe){
  const total = recipe.ingredients.length;
  const have = recipe.ingredients.filter(i => ingredientStatus(i)!=='missing').length;
  const equipOk = recipe.equipment.every(e => equipment.includes(e) || barTools.includes(e));
  return {pct: total? Math.round(have/total*100) : 100, have, total, equipOk};
}
function recentCookCounts(days){
  days = days || 21;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-days);
  const cutoffStr = todayStr(cutoff);
  const counts = {};
  cookLog.forEach(c=>{ if(c.date>=cutoffStr) counts[c.recipeId] = (counts[c.recipeId]||0)+1; });
  return counts;
}

/* ===================== RECIPE FILTER PANEL (multi-select) ===================== */
function updateFilterBadge(){
  const n = activeCategories.size + activeCuisines.size + activeDietFilters.size + activeSpirits.size + activeSweetness.size
    + (onlyMakeable?1:0) + (quickTime?1:0) + (quickParty?1:0) + (favOnly?1:0) + (refreshingOnly?1:0);
  const badge = document.getElementById('filterBadge');
  if(badge){ badge.textContent = n>0 ? n : ''; badge.style.display = n>0 ? 'inline-flex' : 'none'; }
}
function setRecipeMode(mode){
  recipeViewMode = mode;
  document.getElementById('modeFoodBtn').classList.toggle('on', mode==='food');
  document.getElementById('modeCocktailBtn').classList.toggle('on', mode==='cocktails');
  renderRecipes();
}
function openFilterPanel(){
  const isFood = recipeViewMode==='food';
  let html = `<h2>Filtrai</h2>`;
  if(isFood){
    html += filterGroupHtml('Kategorija', Object.entries(CATEGORY_LABELS).filter(([k])=>k!=='kokteiliai'), activeCategories, 'cat');
    html += filterGroupHtml('Virtuvė', Object.entries(CUISINE_LABELS), activeCuisines, 'cuis');
    html += filterGroupHtml('Mityba', Object.entries(DIET_LABELS), activeDietFilters, 'diet');
    html += filterGroupHtml('Sudėtingumas', Object.entries(DIFFICULTY_LABELS), activeDifficulty, 'diff');
    html += `<div class="section-title">Kita</div>
      <div class="filter-row" style="margin-bottom:0">
        <button class="toggle-chip ${onlyMakeable?'on':''}" onclick="this.classList.toggle('on');onlyMakeable=!onlyMakeable">Galiu pagaminti</button>
        <button class="toggle-chip ${quickTime?'on':''}" onclick="this.classList.toggle('on');quickTime=!quickTime">⏱ ≤15 min</button>
        <button class="toggle-chip ${quickParty?'on':''}" onclick="this.classList.toggle('on');quickParty=!quickParty">👥 Svečiams</button>
        <button class="toggle-chip ${favOnly?'on':''}" onclick="this.classList.toggle('on');favOnly=!favOnly">★ Mėgstami</button>
      </div>`;
  } else {
    html += filterGroupHtml('Alkoholio bazė', Object.entries(SPIRIT_LABELS), activeSpirits, 'spirit');
    html += filterGroupHtml('Saldumas', Object.entries(SWEETNESS_LABELS), activeSweetness, 'sweet');
    html += `<div class="section-title">Kita</div>
      <div class="filter-row" style="margin-bottom:0">
        <button class="toggle-chip ${refreshingOnly?'on':''}" onclick="this.classList.toggle('on');refreshingOnly=!refreshingOnly">🧊 Gaivus</button>
        <button class="toggle-chip ${favOnly?'on':''}" onclick="this.classList.toggle('on');favOnly=!favOnly">★ Mėgstami</button>
      </div>`;
  }
  html += `<div class="btn-row" style="margin-top:18px">
    <button class="btn btn-outline" onclick="clearAllFilters()">Išvalyti</button>
    <button class="btn btn-primary" onclick="applyFiltersAndClose()">Rodyti</button>
  </div>`;
  openModal(html);
}
function filterGroupHtml(title, entries, activeSet, prefix){
  const setMap = {cat:'activeCategories',cuis:'activeCuisines',diet:'activeDietFilters',diff:'activeDifficulty',spirit:'activeSpirits',sweet:'activeSweetness'};
  return `<div class="section-title">${title}</div>
    <div class="filter-row" style="margin-bottom:14px">
      ${entries.map(([k,v])=>`<button class="toggle-chip ${activeSet.has(k)?'on':''}" onclick="this.classList.toggle('on');toggleSetVal(${setMap[prefix]},'${k}')">${v}</button>`).join('')}
    </div>`;
}
function toggleSetVal(set, val){ if(set.has(val)) set.delete(val); else set.add(val); }
function clearAllFilters(){
  activeCategories.clear(); activeCuisines.clear(); activeDietFilters.clear(); activeDifficulty.clear();
  activeSpirits.clear(); activeSweetness.clear();
  onlyMakeable=false; quickTime=false; quickParty=false; favOnly=false; refreshingOnly=false;
  closeModal(); renderRecipes(); updateFilterBadge();
  toast('Filtrai išvalyti');
}
function applyFiltersAndClose(){ closeModal(); renderRecipes(); updateFilterBadge(); }
function toggleFavorite(id, ev){
  if(ev) ev.stopPropagation();
  if(favorites.includes(id)) favorites = favorites.filter(x=>x!==id); else favorites.push(id);
  save('vk_favorites', favorites);
  renderRecipes();
  const star = document.getElementById('detailFavStar');
  if(star) star.textContent = favorites.includes(currentDetailRecipeId) ? '★' : '☆';
}

/* ===================== RECIPE LIST + DETAIL ===================== */
function multiTermMatch(text, terms){ return terms.every(t=>text.includes(t)); }
function renderRecipes(){
  const searchRaw = normName(document.getElementById('recipeSearch').value);
  const searchTerms = searchRaw.split(',').map(s=>s.trim()).filter(Boolean);
  let pool = recipeViewMode==='cocktails' ? COCKTAILS : allFood();
  let list = pool.map(r => ({...r, _match: recipeMatch(r)}));
  if(activeCollectionId){
    const col = collections.find(c=>c.id===activeCollectionId);
    if(col) list = list.filter(r => col.recipeIds.includes(r.id));
  }
  if(searchTerms.length) list = list.filter(r => {
    const hay = normName(r.name) + ' ' + r.ingredients.map(i=>normName(i.name)).join(' ');
    return multiTermMatch(hay, searchTerms);
  });
  if(recipeViewMode==='food'){
    if(activeCategories.size) list = list.filter(r => activeCategories.has(r.category));
    if(activeCuisines.size) list = list.filter(r => activeCuisines.has(r.cuisine));
    activeDietFilters.forEach(tag => { list = list.filter(r => r.diet.includes(tag)); });
    if(activeDifficulty.size) list = list.filter(r => activeDifficulty.has(r.difficulty));
    if(onlyMakeable) list = list.filter(r => r._match.equipOk && r._match.pct>=80);
    if(quickTime) list = list.filter(r => r.time<=15);
    if(quickParty) list = list.filter(r => r.servings>=4);
  } else {
    if(activeSpirits.size) list = list.filter(r => activeSpirits.has(r.spirit));
    if(activeSweetness.size) list = list.filter(r => activeSweetness.has(r.sweetness));
    if(refreshingOnly) list = list.filter(r => r.refreshing);
  }
  if(favOnly) list = list.filter(r => favorites.includes(r.id));
  const recent = recentCookCounts();
  list.sort((a,b)=> (b._match.equipOk - a._match.equipOk) || (b._match.pct - a._match.pct) || ((recent[a.id]||0)-(recent[b.id]||0)));

  const colBanner = document.getElementById('collectionBanner');
  if(colBanner){
    const col = activeCollectionId ? collections.find(c=>c.id===activeCollectionId) : null;
    colBanner.innerHTML = col ? `<div class="toggle-chip on" style="margin-bottom:10px">📁 ${col.name} <span onclick="clearCollectionFilter()" style="margin-left:6px;cursor:pointer">✕</span></div>` : '';
  }
  const box = document.getElementById('recipeList');
  if(!list.length){ box.innerHTML = `<div class="empty-state"><span class="big">🔍</span>Nieko nerasta pagal jūsų filtrus.</div>`; return; }
  box.innerHTML = list.map(r => {
    const m = r._match;
    const badgeClass = !m.equipOk ? 'match-low' : (m.pct>=90?'match-100':(m.pct>=50?'match-mid':'match-low'));
    const isFav = favorites.includes(r.id);
    return `<div class="recipe-card" onclick="openRecipeDetail('${r.id}')">
      <div class="match-badge ${badgeClass}">${m.pct}%</div>
      <div class="rinfo">
        <div class="rname">${r.name}</div>
        <div class="rmeta">
          ${r.category!=='kokteiliai'?`<span class="tag">${CATEGORY_LABELS[r.category]||r.category}</span>`:`<span class="tag">${SPIRIT_LABELS[r.spirit]||'Kokteilis'}</span>`}
          <span>⏱ ${r.time} min</span><span>🔥 ${r.kcal} kcal</span>
          ${!m.equipOk?'<span style="color:var(--danger)">Trūksta įrangos</span>':''}
        </div>
      </div>
      <button class="icon-btn fav-star" onclick="toggleFavorite('${r.id}', event)" title="Mėgstamas">${isFav?'★':'☆'}</button>
    </div>`;
  }).join('');
}
function openRecipeDetail(id){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  currentDetailRecipeId = id;
  currentDetailServings = r.servings;
  renderRecipeDetailBody(r);
}
function renderRecipeDetailBody(r){
  const N = currentDetailServings;
  const scale = N / r.servings;
  const ingHtml = r.ingredients.map(i=>{
    const status = ingredientStatus(i, scale);
    const scaledQty = Math.round(i.qty*scale*100)/100;
    const sub = status!=='ok' ? substituteFor(i.name) : null;
    const label = status==='ok' ? '✓ turite' : (status==='low' ? '⚠ nepakanka' : 'trūksta');
    return `<li class="${status==='ok'?'have':'miss'}">
      <span>${i.name} — ${scaledQty} ${i.unit}${sub?`<br><small class="hint" style="margin:2px 0 0">galimas pakaitalas: ${sub}</small>`:''}</span>
      <span class="chk">${label}</span></li>`;
  }).join('');
  const equipHtml = r.equipment.length ? r.equipment.map(e=>{
    const eq = EQUIPMENT.find(x=>x.id===e) || BAR_TOOLS.find(x=>x.id===e);
    const owned = equipment.includes(e) || barTools.includes(e);
    return `<span class="tag" style="${owned?'':'color:var(--danger);background:var(--danger-tint)'}">${eq?eq.icon+' '+eq.label:e}</span>`;
  }).join(' ') : '<span class="tag">Įranga nereikalinga</span>';
  const isCocktail = r.category==='kokteiliai';
  const isFav = favorites.includes(r.id);
  const dietHtml = r.diet && r.diet.length ? r.diet.map(d=>`<span class="tag" style="background:var(--primary-tint);color:var(--primary-dark)">${DIET_LABELS[d]}</span>`).join(' ') : '';
  const cocktailTagsHtml = isCocktail ? `<span class="tag">${SPIRIT_LABELS[r.spirit]}</span> <span class="tag">${SWEETNESS_LABELS[r.sweetness]}</span>${r.refreshing?' <span class="tag">🧊 Gaivus</span>':''}` : '';
  const myRating = ratings[r.id] || 0;
  const starsHtml = [1,2,3,4,5].map(i=>`<span onclick="setRating('${r.id}',${i})" style="cursor:pointer;font-size:20px;color:${i<=myRating?'var(--accent)':'var(--border)'}">★</span>`).join('');
  const myNote = notes[r.id] || '';
  openModal(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-right:38px">
      <h2 style="margin-bottom:6px">${r.name}</h2>
      <button class="icon-btn fav-star" id="detailFavStar" style="font-size:22px" onclick="toggleFavorite('${r.id}')">${isFav?'★':'☆'}</button>
    </div>
    <div class="rmeta" style="margin-bottom:8px">
      ${!isCocktail?`<span class="tag">${CATEGORY_LABELS[r.category]}</span>`:cocktailTagsHtml}
      <span>⏱ ${r.time} min</span>
      ${r.difficulty?`<span class="tag" style="background:var(--surface-2);color:var(--text)">${DIFFICULTY_LABELS[r.difficulty]}</span>`:''}
    </div>
    <div style="margin-bottom:8px">${equipHtml}</div>
    ${dietHtml?`<div style="margin-bottom:10px">${dietHtml}</div>`:''}
    <div style="margin-bottom:10px">${starsHtml}</div>

    <div style="display:flex;align-items:center;gap:10px;margin:10px 0">
      <span style="font-weight:700;font-size:13px">Porcijos:</span>
      <div class="qty-btns">
        <button onclick="changeDetailServings(-1)">−</button>
        <span class="pqty" style="min-width:24px;text-align:center">${N}</span>
        <button onclick="changeDetailServings(1)">+</button>
      </div>
      <small class="hint" style="margin:0">iš viso ${Math.round(r.kcal*scale)} kcal</small>
    </div>

    <div class="nutri-grid">
      <div class="nutri-box"><b>${r.kcal}</b><span>kcal/porc.</span></div>
      <div class="nutri-box"><b>${r.protein}g</b><span>baltymai</span></div>
      <div class="nutri-box"><b>${r.carbs}g</b><span>angliav.</span></div>
      <div class="nutri-box"><b>${r.fat}g</b><span>riebalai</span></div>
    </div>
    <small class="hint">Maistinė vertė apskaičiuota pagal ingredientus (apytikslė, ne konkretaus gamintojo).</small>
    <div class="section-title" style="margin-top:16px">Ingredientai (${N} porc.)</div>
    <ul class="ing-list">${ingHtml}</ul>
    <div class="section-title">Gaminimas</div>
    <ol class="steps-list">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>

    <div class="section-title">Mano pastaba</div>
    <textarea id="recipeNoteInput" rows="2" placeholder="pvz. dedu mažiau druskos...">${myNote}</textarea>
    <button class="btn btn-secondary btn-sm" style="margin-top:6px" onclick="saveNote('${r.id}')">Išsaugoti pastabą</button>

    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-primary" onclick="cookRecipe('${r.id}')">${isCocktail?'Pažymėti kaip išgertą':'Pažymėti kaip pagamintą'}</button>
      ${!isCocktail?`<button class="btn btn-secondary" onclick="openAddToPlan('${r.id}')">+ Į planą</button>`:''}
    </div>
    <div class="btn-row" style="margin-top:8px">
      ${!isCocktail?`<button class="btn btn-outline" onclick="openCookMode('${r.id}')">👨‍🍳 Gaminti</button>`:''}
      <button class="btn btn-outline" onclick="openCollectionPicker('${r.id}')">📁 Kolekcija</button>
      <button class="btn btn-outline" onclick="shareRecipe('${r.id}')">📤 Dalintis</button>
      <button class="btn btn-outline" onclick="exportRecipePDF('${r.id}')">📄 PDF</button>
    </div>
    ${!r.builtin?`<button class="btn btn-danger" style="margin-top:8px" onclick="deleteCustomRecipe('${r.id}')">Trinti receptą</button>`:''}
  `);
}
async function shareRecipe(id){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  const text = `${r.name}\n\nIngredientai:\n${r.ingredients.map(i=>`- ${i.name} ${i.qty}${i.unit}`).join('\n')}\n\nGaminimas:\n${r.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
  if(navigator.share){
    try{ await navigator.share({title:r.name, text}); }catch(e){}
  } else {
    try{ await navigator.clipboard.writeText(text); toast('Nukopijuota į iškarpinę'); }
    catch(e){ toast('Nepavyko pasidalinti'); }
  }
}
function exportRecipePDF(id){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  const N = currentDetailServings || r.servings;
  const scale = N / r.servings;
  const win = window.open('', '_blank');
  if(!win){ toast('Leiskite iškylantiesiems langams, kad sukurtumėte PDF'); return; }
  const ingHtml = r.ingredients.map(i=>`<li>${i.name} — ${Math.round(i.qty*scale*100)/100} ${i.unit}</li>`).join('');
  const stepsHtml = r.steps.map(s=>`<li>${s}</li>`).join('');
  win.document.write(`<!DOCTYPE html><html lang="lt"><head><meta charset="utf-8"><title>${r.name}</title>
    <style>
      body{font-family:Georgia,serif;max-width:640px;margin:30px auto;padding:0 20px;color:#2B2620;line-height:1.6}
      h1{color:#4A7C59;border-bottom:3px solid #E8A33D;padding-bottom:8px}
      .meta{color:#666;font-size:14px;margin-bottom:20px}
      h2{color:#4A7C59;margin-top:24px;font-size:18px}
      ul,ol{padding-left:22px}
      .nutri{display:flex;gap:16px;margin:16px 0;flex-wrap:wrap}
      .nutri div{background:#f5f0e8;padding:8px 14px;border-radius:8px;font-size:14px}
      .foot{margin-top:30px;font-size:12px;color:#999;text-align:center}
    </style></head><body>
    <h1>${r.name}</h1>
    <div class="meta">${N} porcijos · ${r.time} min · ${r.kcal} kcal/porc.</div>
    <div class="nutri"><div><b>${r.kcal}</b> kcal</div><div><b>${r.protein}g</b> baltymų</div><div><b>${r.carbs}g</b> angliav.</div><div><b>${r.fat}g</b> riebalų</div></div>
    <h2>Ingredientai</h2><ul>${ingHtml}</ul>
    <h2>Gaminimas</h2><ol>${stepsHtml}</ol>
    <div class="foot">Sukurta su „Mano Virtuvė" programėle</div>
    </body></html>`);
  win.document.close();
  setTimeout(()=>{ win.print(); }, 400);
  toast('Atsidarys spausdinimo langas — pasirinkite „Išsaugoti kaip PDF"');
}

/* ===================== RECIPE COLLECTIONS ===================== */
function openCollectionPicker(recipeId){
  openModal(`
    <h2>Pridėti į kolekciją</h2>
    ${collections.length?`<div style="margin-bottom:12px">${collections.map(c=>`
      <div class="settings-row" style="cursor:pointer" onclick="toggleRecipeInCollection('${c.id}','${recipeId}')">
        <span>${c.name} (${c.recipeIds.length})</span>
        <input type="checkbox" ${c.recipeIds.includes(recipeId)?'checked':''} onclick="event.stopPropagation();toggleRecipeInCollection('${c.id}','${recipeId}')">
      </div>`).join('')}</div>` : '<p class="hint">Kolekcijų dar neturite.</p>'}
    <label>Nauja kolekcija</label>
    <div style="display:flex;gap:8px">
      <input id="newCollectionName" placeholder="pvz. Greiti pietūs į darbą">
      <button class="btn btn-primary btn-sm" onclick="createCollectionWith('${recipeId}')">+ Sukurti</button>
    </div>
  `);
}
function toggleRecipeInCollection(colId, recipeId){
  const c = collections.find(x=>x.id===colId);
  if(!c) return;
  if(c.recipeIds.includes(recipeId)) c.recipeIds = c.recipeIds.filter(x=>x!==recipeId);
  else c.recipeIds.push(recipeId);
  save('vk_collections', collections);
  openCollectionPicker(recipeId);
}
function createCollectionWith(recipeId){
  const name = document.getElementById('newCollectionName').value.trim();
  if(!name){ toast('Įveskite pavadinimą'); return; }
  collections.push({id:uid(), name, recipeIds:[recipeId]});
  save('vk_collections', collections);
  openCollectionPicker(recipeId);
  toast('Kolekcija sukurta');
}
function openCollectionsBrowser(){
  openModal(`
    <h2>Kolekcijos</h2>
    ${collections.length?collections.map(c=>`
      <div class="recipe-card" style="justify-content:space-between">
        <div class="rinfo" onclick="filterByCollection('${c.id}')"><div class="rname" style="font-size:15px">${c.name}</div><div class="rmeta"><span class="tag">${c.recipeIds.length} receptai</span></div></div>
        <button class="icon-btn" onclick="deleteCollection('${c.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </div>`).join('') : '<p class="hint">Kolekcijų dar neturite — pridėkite receptą į kolekciją jo aprašyme.</p>'}
  `);
}
function filterByCollection(colId){
  activeCollectionId = colId;
  closeModal(); renderRecipes();
  toast('Rodoma kolekcija');
}
function clearCollectionFilter(){ activeCollectionId = null; renderRecipes(); }
function deleteCollection(id){
  collections = collections.filter(c=>c.id!==id);
  save('vk_collections', collections);
  openCollectionsBrowser();
}

function setRating(id, val){
  ratings[id] = ratings[id]===val ? 0 : val;
  save('vk_ratings', ratings);
  const r = allRecipes().find(x=>x.id===id);
  if(r) renderRecipeDetailBody(r);
}
function saveNote(id){
  const val = document.getElementById('recipeNoteInput').value.trim();
  if(val) notes[id] = val; else delete notes[id];
  save('vk_notes', notes);
  toast('Pastaba išsaugota');
}
function changeDetailServings(delta){
  currentDetailServings = Math.max(1, currentDetailServings + delta);
  const r = allRecipes().find(x=>x.id===currentDetailRecipeId);
  if(r) renderRecipeDetailBody(r);
}
function deleteCustomRecipe(id){
  const idx = customRecipes.findIndex(r=>r.id===id);
  if(idx===-1) return;
  const removed = customRecipes[idx];
  customRecipes = customRecipes.filter(r=>r.id!==id);
  save('vk_customRecipes', customRecipes);
  closeModal(); renderRecipes();
  toast('Receptas ištrintas', {label:'Anuliuoti', fn:()=>{ customRecipes.splice(idx,0,removed); save('vk_customRecipes', customRecipes); renderRecipes(); }});
}
function surpriseMe(){
  const pool = (recipeViewMode==='cocktails' ? COCKTAILS : allFood()).map(r=>({...r,_match:recipeMatch(r)})).filter(r=>r._match.equipOk);
  if(!pool.length){ toast('Nėra tinkamų receptų su jūsų įranga'); return; }
  const recent = recentCookCounts();
  const weighted = pool.map(r=>({r, w: 1/((recent[r.id]||0)+1) + r._match.pct/100}));
  const totalW = weighted.reduce((s,x)=>s+x.w,0);
  let rnd = Math.random()*totalW;
  let chosen = weighted[0].r;
  for(const x of weighted){ rnd -= x.w; if(rnd<=0){ chosen = x.r; break; } }
  openRecipeDetail(chosen.id);
}

/* ===================== CUSTOM RECIPE FORM ===================== */
function openRecipeForm(){
  openModal(`
    <h2>Naujas receptas</h2>
    <label>Pavadinimas</label><input id="rf_name" placeholder="pvz. Mano salotos">
    <label>Kategorija</label>
    <select id="rf_cat">${Object.entries(CATEGORY_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
    <label>Reikalinga įranga</label>
    <div class="equip-grid" style="margin-bottom:6px">${EQUIPMENT.map(e=>`
      <div class="equip-chip" data-eq="${e.id}" onclick="this.classList.toggle('on')"><span class="ico">${e.icon}</span><span class="lbl">${e.label}</span></div>`).join('')}</div>
    <div class="field-row">
      <div><label>Laikas (min)</label><input id="rf_time" type="number" value="20"></div>
      <div><label>Porcijos</label><input id="rf_servings" type="number" value="2"></div>
      <div><label>Kcal / porc.</label><input id="rf_kcal" type="number" value="300"></div>
    </div>
    <div class="field-row">
      <div><label>Baltymai (g)</label><input id="rf_protein" type="number" value="10"></div>
      <div><label>Angliav. (g)</label><input id="rf_carbs" type="number" value="30"></div>
      <div><label>Riebalai (g)</label><input id="rf_fat" type="number" value="10"></div>
    </div>
    <div class="section-title">Ingredientai</div>
    <div id="rf_ingredients"></div>
    <button class="btn btn-outline btn-sm" onclick="addIngRow()">+ Ingredientas</button>
    <div class="section-title">Žingsniai</div>
    <div id="rf_steps"></div>
    <button class="btn btn-outline btn-sm" onclick="addStepRow()">+ Žingsnis</button>
    <button class="btn btn-primary" style="margin-top:16px" onclick="saveCustomRecipe()">Išsaugoti receptą</button>
  `);
  addIngRow(); addIngRow(); addStepRow(); addStepRow();
}
function addIngRow(){
  const row = document.createElement('div');
  row.className='field-row'; row.style.marginBottom='6px'; row.dataset.ingRow='';
  row.innerHTML = `<input placeholder="Pavadinimas" class="ing-name"><input placeholder="Kiekis" type="number" class="ing-qty"><select class="ing-unit">${UNITS.map(u=>`<option>${u}</option>`).join('')}</select>`;
  document.getElementById('rf_ingredients').appendChild(row);
}
function addStepRow(){
  const row = document.createElement('div');
  row.style.marginBottom='6px'; row.dataset.stepRow='';
  row.innerHTML = `<input placeholder="Žingsnio aprašymas">`;
  document.getElementById('rf_steps').appendChild(row);
}
function saveCustomRecipe(){
  const name = document.getElementById('rf_name').value.trim();
  if(!name){ toast('Įveskite pavadinimą'); return; }
  const category = document.getElementById('rf_cat').value;
  const equip = Array.from(document.querySelectorAll('.equip-chip[data-eq]')).filter(c=>c.classList.contains('on')).map(c=>c.dataset.eq);
  const time = parseInt(document.getElementById('rf_time').value)||0;
  const servings = parseInt(document.getElementById('rf_servings').value)||1;
  const kcal = parseInt(document.getElementById('rf_kcal').value)||0;
  const protein = parseInt(document.getElementById('rf_protein').value)||0;
  const carbs = parseInt(document.getElementById('rf_carbs').value)||0;
  const fat = parseInt(document.getElementById('rf_fat').value)||0;
  const ingredients = Array.from(document.querySelectorAll('[data-ing-row]')).map(row=>{
    const n = row.querySelector('.ing-name').value.trim();
    const q = parseFloat(row.querySelector('.ing-qty').value)||0;
    const u = row.querySelector('.ing-unit').value;
    return n ? {name:n, qty:q, unit:u} : null;
  }).filter(Boolean);
  const steps = Array.from(document.querySelectorAll('[data-step-row] input')).map(i=>i.value.trim()).filter(Boolean);
  if(!ingredients.length){ toast('Pridėkite bent vieną ingredientą'); return; }
  const newRecipe = {id:'c'+uid(), name, category, equipment:equip, time, servings, kcal, protein, carbs, fat, ingredients, steps, builtin:false, cuisine:'tradicinis', diet:computeDiet(ingredients)};
  newRecipe.difficulty = computeDifficulty(newRecipe);
  customRecipes.push(newRecipe);
  save('vk_customRecipes', customRecipes);
  closeModal(); renderRecipes();
  toast('Receptas pridėtas');
}

/* ===================== COOK MODE ===================== */
async function openCookMode(id){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  cookModeRecipeId = id; cookModeStep = 0;
  try{ if('wakeLock' in navigator){ cookModeWakeLock = await navigator.wakeLock.request('screen'); } }catch(e){ cookModeWakeLock=null; }
  renderCookModeStep();
}
function renderCookModeStep(){
  const r = allRecipes().find(x=>x.id===cookModeRecipeId);
  if(!r) return;
  const step = r.steps[cookModeStep];
  const isLast = cookModeStep === r.steps.length-1;
  const timeMatch = step.match(/(\d+)(?:–\d+)?\s*min/);
  openModal(`
    <div style="text-align:center">
      <small class="hint">${r.name} — žingsnis ${cookModeStep+1} iš ${r.steps.length}</small>
      <p style="font-size:20px;font-weight:600;margin:24px 0;line-height:1.4">${step}</p>
      ${timeMatch ? `<button class="btn btn-secondary" id="cookTimerBtn" onclick="startCookTimer(${timeMatch[1]})">⏱ Pradėti laikmatį (${timeMatch[1]} min)</button><div id="cookTimerDisplay" style="margin-top:10px;font-size:22px;font-weight:700"></div>` : ''}
      <div class="btn-row" style="margin-top:24px">
        <button class="btn btn-outline" onclick="cookModeStep=Math.max(0,cookModeStep-1);renderCookModeStep()" ${cookModeStep===0?'disabled':''}>‹ Atgal</button>
        ${isLast ? `<button class="btn btn-primary" onclick="exitCookMode(true)">Baigti gaminti ✓</button>` : `<button class="btn btn-primary" onclick="cookModeStep++;renderCookModeStep()">Kitas ›</button>`}
      </div>
      <button class="btn btn-outline" style="margin-top:10px" onclick="exitCookMode(false)">Išeiti</button>
    </div>
  `);
}
function startCookTimer(minutes){
  if(cookModeTimer) clearInterval(cookModeTimer);
  let seconds = minutes*60;
  const display = document.getElementById('cookTimerDisplay');
  const btn = document.getElementById('cookTimerBtn');
  if(btn) btn.style.display='none';
  cookModeTimer = setInterval(()=>{
    seconds--;
    const m = Math.floor(seconds/60), s = seconds%60;
    if(display) display.textContent = m+':'+String(s).padStart(2,'0');
    if(seconds<=0){
      clearInterval(cookModeTimer); cookModeTimer=null;
      if(display) display.textContent = '✅ Laikas!';
      try{
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const osc = ctx.createOscillator(); osc.frequency.value=880; osc.connect(ctx.destination);
        osc.start(); setTimeout(()=>osc.stop(), 400);
      }catch(e){}
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
    }
  },1000);
}
function exitCookMode(markCooked){
  const rid = cookModeRecipeId;
  cleanupCookMode();
  closeModal();
  if(markCooked && rid){
    const r = allRecipes().find(x=>x.id===rid);
    if(r){ currentDetailServings = r.servings; currentDetailRecipeId = rid; cookRecipe(rid); }
  }
}

/* ===================== "COOKED" PORTION DIALOG ===================== */
function cookRecipe(id){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  const madeServings = currentDetailServings || r.servings;
  const isCocktail = r.category==='kokteiliai';
  openModal(`
    <h2>${isCocktail?'Pažymėti kaip išgertą':'Pagaminta!'}</h2>
    <small class="hint">Pagaminta ${madeServings} ${isCocktail?'porc.':'porcijų'}. Pasirinkite, kaip įtraukti.</small>
    <div class="btn-row" style="flex-direction:column;gap:10px;margin-top:14px">
      <button class="btn btn-primary" onclick="chooseCookMode('${id}',${madeServings},'self')">🍽 Tik sau</button>
      <button class="btn btn-secondary" onclick="chooseCookMode('${id}',${madeServings},'shared')">👥 Sau ir kitiems</button>
      <button class="btn btn-outline" onclick="confirmCooked('${id}',${madeServings},'onlycooked')">Tik pagaminau (nevalgiau)</button>
    </div>
  `);
}
function chooseCookMode(id, madeServings, mode){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  const isCocktail = r.category==='kokteiliai';
  if(mode==='self'){
    // ate all made portions myself (or choose how many)
    openModal(`
      <h2>${isCocktail?'Kiek išgėrėte?':'Kiek porcijų suvalgėte?'}</h2>
      <small class="hint">Iš sandėlio nurašysime tik jūsų suvalgytų porcijų ingredientus.</small>
      ${portionPickerHtml(madeServings, madeServings)}
      <button class="btn btn-primary" style="margin-top:18px" onclick="confirmCooked('${id}',${madeServings},'self')">Patvirtinti</button>
    `);
    updateEatenKcal(r);
  } else {
    // shared: all ingredients removed, but I only log my portions
    openModal(`
      <h2>Kiek porcijų suvalgėte jūs?</h2>
      <small class="hint">Iš sandėlio bus nurašyti visi ${madeServings} porcijų ingredientai (viską suvalgė jūs ir kiti), o į jūsų kalorijas įrašysime tik jūsų suvalgytas porcijas.</small>
      ${portionPickerHtml(1, madeServings)}
      <button class="btn btn-primary" style="margin-top:18px" onclick="confirmCooked('${id}',${madeServings},'shared')">Patvirtinti</button>
    `);
    updateEatenKcal(r);
  }
}
function portionPickerHtml(defaultVal, maxVal){
  const presets = [];
  for(let i=1;i<=Math.max(5,maxVal);i++) presets.push(i);
  return `<label style="margin-top:12px">Jūsų suvalgytos porcijos</label>
    <div style="display:flex;align-items:center;gap:12px;margin-top:6px">
      <div class="qty-btns">
        <button onclick="adjustEatenPortions(-1)">−</button>
        <span class="pqty" id="eatenPortions" style="min-width:30px;text-align:center" data-val="${defaultVal}" data-max="${maxVal}">${defaultVal}</span>
        <button onclick="adjustEatenPortions(1)">+</button>
      </div>
      <small class="hint" id="eatenKcal" style="margin:0"></small>
    </div>
    <div class="filter-row" style="margin-top:8px">${presets.map(p=>`<button class="toggle-chip" onclick="setEatenPortions(${p})">${p}</button>`).join('')}</div>`;
}
function setEatenPortions(v){
  const el = document.getElementById('eatenPortions');
  if(!el) return;
  el.dataset.val = v; el.textContent = v;
  const r = allRecipes().find(x=>x.id===currentDetailRecipeId);
  if(r) updateEatenKcal(r);
}
function adjustEatenPortions(delta){
  const el = document.getElementById('eatenPortions');
  let v = parseInt(el.dataset.val) + delta;
  v = Math.max(0, v);
  el.dataset.val = v; el.textContent = v;
  const r = allRecipes().find(x=>x.id===currentDetailRecipeId);
  if(r) updateEatenKcal(r);
}
function updateEatenKcal(r){
  const el = document.getElementById('eatenPortions');
  if(!el) return;
  const v = parseInt(el.dataset.val);
  const kc = document.getElementById('eatenKcal');
  if(kc) kc.textContent = '≈ '+Math.round(r.kcal*v)+' kcal';
}
function confirmCooked(id, madeServings, mode){
  const r = allRecipes().find(x=>x.id===id);
  if(!r) return;
  const isCocktail = r.category==='kokteiliai';
  const eaten = mode==='onlycooked' ? 0 : parseInt(document.getElementById('eatenPortions').dataset.val);
  // Determine how much to deduct from pantry:
  // - self: deduct only the portions eaten
  // - shared: deduct all made portions
  // - onlycooked: deduct all made portions
  const deductServings = mode==='self' ? eaten : madeServings;
  const scale = deductServings / r.servings;
  r.ingredients.forEach(ing=>{
    const p = ingredientAvailable(ing.name);
    if(p && p.unit===ing.unit){ p.qty = Math.max(0, Math.round((p.qty-ing.qty*scale)*100)/100); }
  });
  save('vk_pantry', pantry);
  cookLog.push({id:uid(), date:todayStr(), recipeId:r.id, recipeName:r.name});
  save('vk_cookLog', cookLog);
  if(eaten>0){
    calorieLog.push({id:uid(), date:todayStr(), name:r.name+(eaten>1?` (${eaten} porc.)`:''), kcal:Math.round(r.kcal*eaten), protein:Math.round(r.protein*eaten), carbs:Math.round(r.carbs*eaten), fat:Math.round(r.fat*eaten)});
    save('vk_calorieLog', calorieLog);
  }
  closeModal();
  renderPantry(); renderRecipes(); renderLog(); renderStats();
  toast(mode==='onlycooked' ? 'Pažymėta kaip pagaminta' : (isCocktail?'Įtraukta į žurnalą':'Įtraukta į kalorijų žurnalą'));
}

/* ===================== CALORIE LOG (with unit-based auto nutrition) ===================== */
function shiftLogDate(delta){
  const d = new Date(logDate+'T00:00:00'); d.setDate(d.getDate()+delta);
  const candidate = todayStr(d);
  if(candidate > todayStr()){ toast('Tolimesnių dienų dar nėra'); return; }
  logDate = candidate; renderLog();
}
function goToToday(){ logDate = todayStr(); renderLog(); }
function renderLog(){
  document.getElementById('logDateLabel').textContent = fmtDateLabel(logDate);
  const nextBtn = document.getElementById('logNextBtn');
  if(nextBtn){ const atToday = logDate>=todayStr(); nextBtn.disabled = atToday; nextBtn.style.opacity = atToday?'0.35':'1'; }
  const entries = calorieLog.filter(e=>e.date===logDate);
  const totalKcal = entries.reduce((s,e)=>s+e.kcal,0);
  const totalP = entries.reduce((s,e)=>s+(e.protein||0),0);
  const totalC = entries.reduce((s,e)=>s+(e.carbs||0),0);
  const totalF = entries.reduce((s,e)=>s+(e.fat||0),0);
  document.getElementById('kcalGoalLabel').textContent = `${totalKcal} / ${settings.goalKcal} kcal`;
  const pct = Math.min(100, Math.round(totalKcal/settings.goalKcal*100));
  const fill = document.getElementById('kcalProgressFill');
  fill.style.width = pct+'%';
  fill.classList.toggle('over', totalKcal>settings.goalKcal);
  document.getElementById('macroRow').innerHTML = [
    ['Baltymai', totalP, settings.goalProtein], ['Angliav.', totalC, settings.goalCarbs], ['Riebalai', totalF, settings.goalFat]
  ].map(([label,val,goal])=>`
    <div class="macro-col"><div style="font-size:11px;color:var(--muted)">${label}</div>
      <div class="bar"><span style="width:${Math.min(100,Math.round(val/goal*100))}%"></span></div>
      <div style="font-size:11px">${val}/${goal}g</div></div>`).join('');
  const list = document.getElementById('logEntries');
  if(!entries.length){
    list.innerHTML = `<div class="empty-state"><span class="big">🍽</span>Šiai dienai įrašų nėra.</div>`;
  } else {
    list.innerHTML = entries.map(e=>`
      <div class="log-entry" data-id="${e.id}"><div><div class="lname">${e.name}</div><div class="lmeta">${e.kcal} kcal · B${e.protein||0} A${e.carbs||0} R${e.fat||0}</div></div>
        <button class="icon-btn" onclick="deleteLogEntry('${e.id}')">✕</button></div>`).join('');
    attachSwipeToDelete(list, '.log-entry', deleteLogEntry);
  }
  renderWeekChart();
}
function deleteLogEntry(id){
  const idx = calorieLog.findIndex(e=>e.id===id);
  if(idx===-1) return;
  const removed = calorieLog[idx];
  calorieLog = calorieLog.filter(e=>e.id!==id);
  save('vk_calorieLog', calorieLog); renderLog();
  toast('Įrašas ištrintas', {label:'Anuliuoti', fn:()=>{ calorieLog.splice(idx,0,removed); save('vk_calorieLog', calorieLog); renderLog(); }});
}
const LOG_UNITS = ['vnt','g','kg','ml','l','porcija'];
function openLogForm(){
  const quick = Object.entries(logFrequency).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([n])=>n);
  openModal(`
    <h2>Pridėti maisto įrašą</h2>
    ${quick.length?`<div class="filter-row" style="margin-bottom:2px">${quick.map(n=>`<button class="toggle-chip" onclick="document.getElementById('lf_name').value='${n.replace(/'/g,"\\'")}';tryAutoNutrition()">${n}</button>`).join('')}</div>`:''}
    <label>Pavadinimas</label><input id="lf_name" list="pantryProductList" placeholder="pvz. Kiaušiniai" oninput="tryAutoNutrition()">
    <datalist id="pantryProductList">${pantrySuggestionOptions()}</datalist>
    <div class="field-row" style="grid-template-columns:1fr 1fr">
      <div><label>Kiekis</label><input id="lf_qty" type="text" inputmode="decimal" value="1" placeholder="pvz. 3" oninput="tryAutoNutrition()"></div>
      <div><label>Vienetas</label><select id="lf_unit" onchange="tryAutoNutrition()">${LOG_UNITS.map(u=>`<option>${u}</option>`).join('')}</select></div>
    </div>
    <div id="lf_autohint"></div>
    <div class="field-row">
      <div><label>Kcal</label><input id="lf_kcal" type="number"></div>
      <div><label>Baltymai</label><input id="lf_protein" type="number" value="0"></div>
      <div><label>Angliav.</label><input id="lf_carbs" type="number" value="0"></div>
    </div>
    <label>Riebalai (g)</label><input id="lf_fat" type="number" value="0">
    <small class="hint">Įvedę žinomą produktą (pvz. „kiaušiniai", „bananas") ir kiekį, kalorijas apskaičiuosime automatiškai. Galite ir pataisyti rankiniu būdu.</small>
    <button class="btn btn-primary" style="margin-top:16px" onclick="saveLogEntry()">Pridėti</button>
  `);
}
function tryAutoNutrition(){
  const name = document.getElementById('lf_name').value.trim();
  const qty = parseLocaleNumber(document.getElementById('lf_qty').value);
  const unit = document.getElementById('lf_unit').value;
  const hint = document.getElementById('lf_autohint');
  if(!name || isNaN(qty)){ if(hint) hint.innerHTML=''; return; }
  const n = normName(name);
  const known = NUTRITION100.some(([key])=>keyIncludes(n,key));
  let grams;
  if(unit==='porcija'){ if(hint) hint.innerHTML=''; return; }
  else grams = gramsForIngredient({name, qty, unit});
  const [k,p,c,f] = nutritionFor100g(name);
  const kcal = Math.round(grams/100*k), protein = Math.round(grams/100*p*10)/10, carbs = Math.round(grams/100*c*10)/10, fat = Math.round(grams/100*f*10)/10;
  document.getElementById('lf_kcal').value = kcal;
  document.getElementById('lf_protein').value = protein;
  document.getElementById('lf_carbs').value = carbs;
  document.getElementById('lf_fat').value = fat;
  if(hint) hint.innerHTML = `<small class="hint" style="color:var(--primary-dark)">${known?'✓ Apskaičiuota automatiškai':'≈ Apytikslis įvertis (produktas nežinomas) — patikrinkite'} (~${Math.round(grams)} g)</small>`;
}
function saveLogEntry(){
  const name = document.getElementById('lf_name').value.trim();
  const kcal = parseInt(document.getElementById('lf_kcal').value)||0;
  const qty = document.getElementById('lf_qty').value.trim();
  const unit = document.getElementById('lf_unit').value;
  if(!name || !kcal){ toast('Įveskite pavadinimą ir kalorijas'); return; }
  const displayName = qty && qty!=='1' ? `${name} (${qty} ${unit})` : (qty==='1' && unit!=='porcija' ? `${name} (1 ${unit})` : name);
  calorieLog.push({ id:uid(), date:logDate, name:displayName, kcal,
    protein: parseInt(document.getElementById('lf_protein').value)||0,
    carbs: parseInt(document.getElementById('lf_carbs').value)||0,
    fat: parseInt(document.getElementById('lf_fat').value)||0 });
  save('vk_calorieLog', calorieLog);
  logFrequency[name] = (logFrequency[name]||0)+1;
  save('vk_logFrequency', logFrequency);
  closeModal(); renderLog();
  toast('Įrašyta');
}
function renderWeekChart(){
  const days=[]; const base = new Date(logDate+'T00:00:00');
  for(let i=6;i>=0;i--){ const d = new Date(base); d.setDate(base.getDate()-i); days.push(todayStr(d)); }
  const totals = days.map(d => calorieLog.filter(e=>e.date===d).reduce((s,e)=>s+e.kcal,0));
  const max = Math.max(settings.goalKcal, ...totals, 1);
  const dayLabels=['S','P','A','T','K','Pn','Š'];
  document.getElementById('weekChart').innerHTML = days.map((d,i)=>{
    const h = Math.max(4, Math.round(totals[i]/max*80));
    const over = totals[i]>settings.goalKcal;
    const dow = new Date(d+'T00:00:00').getDay();
    return `<div class="bar-wrap"><div class="bar ${over?'over':''}" style="height:${h}px" title="${totals[i]} kcal"></div><div class="lbl">${dayLabels[dow]}</div></div>`;
  }).join('');
  renderWater();
}

/* ===================== WATER TRACKING ===================== */
function renderWater(){
  const box = document.getElementById('waterBox');
  if(!box) return;
  const ml = waterLog[logDate] || 0;
  const pct = Math.min(100, Math.round(ml/settings.goalWaterMl*100));
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--muted)">
      <span>💧 Vanduo</span><span>${ml} / ${settings.goalWaterMl} ml</span>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:#5B9BD5"></div></div>
    <div class="btn-row" style="margin-top:8px">
      <button class="btn btn-outline btn-sm" onclick="addWater(200)">+200 ml</button>
      <button class="btn btn-outline btn-sm" onclick="addWater(330)">+330 ml</button>
      <button class="btn btn-outline btn-sm" onclick="addWater(500)">+500 ml</button>
    </div>`;
}
function addWater(ml){
  waterLog[logDate] = (waterLog[logDate]||0) + ml;
  save('vk_waterLog', waterLog);
  renderWater();
}

/* ===================== CALORIE HISTORY ===================== */
function openCalorieHistory(){
  const dates = [...new Set(calorieLog.map(e=>e.date))].sort().reverse();
  if(!dates.length){ toast('Įrašų istorijos dar nėra'); return; }
  const byMonth = {};
  dates.forEach(d=>{
    const monthKey = d.slice(0,7);
    if(!byMonth[monthKey]) byMonth[monthKey]=[];
    byMonth[monthKey].push(d);
  });
  const monthNames=['Sausis','Vasaris','Kovas','Balandis','Gegužė','Birželis','Liepa','Rugpjūtis','Rugsėjis','Spalis','Lapkritis','Gruodis'];
  let html = `<h2>Kalorijų istorija</h2>`;
  Object.keys(byMonth).sort().reverse().forEach(monthKey=>{
    const [y,m] = monthKey.split('-');
    const monthDates = byMonth[monthKey];
    const monthTotal = monthDates.reduce((s,d)=>s+calorieLog.filter(e=>e.date===d).reduce((s2,e)=>s2+e.kcal,0),0);
    const avg = Math.round(monthTotal/monthDates.length);
    html += `<div class="section-title">${monthNames[parseInt(m)-1]} ${y} — vidut. ${avg} kcal/d.</div>`;
    monthDates.forEach(d=>{
      const total = calorieLog.filter(e=>e.date===d).reduce((s,e)=>s+e.kcal,0);
      const over = total>settings.goalKcal;
      html += `<div class="log-entry" style="cursor:pointer" onclick="jumpToLogDate('${d}')">
        <span class="lname">${fmtDateLabel(d)}</span>
        <span class="lmeta" style="color:${over?'var(--danger)':'var(--primary)'}">${total} kcal ${over?'⚠':'✓'}</span>
      </div>`;
    });
  });
  openModal(html);
}
function jumpToLogDate(d){ logDate = d; closeModal(); renderLog(); }


/* ===================== MEAL PLAN + TEMPLATES + VARIETY ENGINE ===================== */
const SLOT_LABELS = {pusryciai:'Pusryčiai', pietus:'Pietūs', vakariene:'Vakarienė', uzkandis:'Užkandis'};
function getWeekDates(offset){
  const now = new Date(); const day = now.getDay();
  const mondayOffset = day===0?-6:1-day;
  const monday = new Date(now); monday.setDate(now.getDate()+mondayOffset+offset*7);
  const dates=[]; for(let i=0;i<7;i++){ const d=new Date(monday); d.setDate(monday.getDate()+i); dates.push(todayStr(d)); }
  return dates;
}
function shiftPlanWeek(delta){ planWeekOffset+=delta; renderPlan(); }
function getSlotEntry(dayPlan, slot){
  const v = dayPlan[slot];
  if(!v) return null;
  if(typeof v === 'string') return {id:v, servings:null}; // legacy format
  return v;
}
function renderPlan(){
  const dates = getWeekDates(planWeekOffset);
  const first = new Date(dates[0]+'T00:00:00'), last = new Date(dates[6]+'T00:00:00');
  const fmt = d => d.getDate()+'.'+(d.getMonth()+1);
  document.getElementById('planWeekLabel').textContent = planWeekOffset===0 ? `Ši savaitė (${fmt(first)}–${fmt(last)})` : `${fmt(first)} – ${fmt(last)}`;
  const dayNames=['Sekmadienis','Pirmadienis','Antradienis','Trečiadienis','Ketvirtadienis','Penktadienis','Šeštadienis'];
  const html = dates.map(date=>{
    const dayPlan = mealPlan[date] || {};
    const dow = new Date(date+'T00:00:00').getDay();
    let dayKcal = 0;
    const slots = Object.keys(SLOT_LABELS).map(slot=>{
      const entry = getSlotEntry(dayPlan, slot);
      const r = entry ? allFood().find(x=>x.id===entry.id) : null;
      const servings = entry && entry.servings ? entry.servings : (r?r.servings:null);
      if(r) dayKcal += Math.round(r.kcal*(servings/r.servings));
      return `<div class="slot-row ${r?'filled':''}" onclick="openAddToPlan(null,'${date}','${slot}')">
        <span class="slabel">${SLOT_LABELS[slot]}</span>
        <span class="sname">${r?`${r.name}${servings!==r.servings?` (${servings} porc.)`:''}`:'Pasirinkti receptą'}</span>
        ${r?`<span class="sremove" onclick="event.stopPropagation();removeFromPlan('${date}','${slot}')">✕</span>`:''}
      </div>`;
    }).join('');
    return `<div class="day-block">
      <div class="day-head"><span class="dname">${dayNames[dow]}, ${fmt(new Date(date+'T00:00:00'))}</span><span class="dkcal">${dayKcal} kcal</span></div>
      ${slots}
    </div>`;
  }).join('');
  document.getElementById('planGrid').innerHTML = html;
  renderShoppingList();
}
let pendingPlanSlot=null;
function openAddToPlan(recipeId, date, slot){
  if(recipeId){
    const dates = getWeekDates(0);
    const r = allFood().find(x=>x.id===recipeId);
    openModal(`
      <h2>Pridėti į planą</h2>
      <label>Diena</label>
      <select id="ap_date">${dates.map(d=>`<option value="${d}">${fmtDateLabel(d)}</option>`).join('')}</select>
      <label>Valgymas</label>
      <select id="ap_slot">${Object.entries(SLOT_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
      <label>Kiek porcijų gaminsite?</label>
      <input id="ap_servings" type="number" min="1" value="${r?r.servings:2}">
      <button class="btn btn-primary" style="margin-top:16px" onclick="confirmAddToPlan('${recipeId}')">Pridėti</button>
    `);
  } else {
    pendingPlanSlot = {date, slot};
    const recent = recentCookCounts();
    const plannedThisWeek = countPlannedThisWeek();
    const primary = allFood().filter(r=>r.category===slot);
    const rest = allFood().filter(r=>r.category!==slot);
    const scoreVariety = r => (recent[r.id]||0) + (plannedThisWeek[r.id]||0);
    primary.sort((a,b)=>scoreVariety(a)-scoreVariety(b));
    const unique = [...new Map(primary.concat(rest).map(r=>[r.id,r])).values()];
    openModal(`
      <h2>${SLOT_LABELS[slot]} — pasirinkite receptą</h2>
      <small class="hint">Viršuje siūlomi rečiau kartoti patiekalai, kad racionas būtų įvairesnis.</small>
      <div style="max-height:55vh;overflow-y:auto;margin-top:8px">
      ${unique.map(r=>{
        const timesRecent = recent[r.id]||0;
        return `<div class="recipe-card" onclick="assignPlanSlot('${r.id}')">
        <div class="match-badge match-mid" style="width:38px;height:38px;font-size:11px">${r.kcal}</div>
        <div class="rinfo"><div class="rname" style="font-size:14.5px">${r.name}</div>
          <div class="rmeta"><span class="tag">${CATEGORY_LABELS[r.category]}</span>${timesRecent?`<span style="color:var(--muted)">gaminta ${timesRecent}× per 3 sav.</span>`:'<span style="color:var(--primary)">naujiena racione</span>'}</div></div>
      </div>`;}).join('')}
      </div>
    `);
  }
}
function countPlannedThisWeek(){
  const dates = getWeekDates(planWeekOffset);
  const counts={};
  dates.forEach(d=>{ const dp=mealPlan[d]; if(dp) Object.values(dp).forEach(v=>{ const e=getSlotEntry({s:v},'s'); if(e) counts[e.id]=(counts[e.id]||0)+1; }); });
  return counts;
}
function confirmAddToPlan(recipeId){
  const date = document.getElementById('ap_date').value;
  const slot = document.getElementById('ap_slot').value;
  const servings = parseInt(document.getElementById('ap_servings').value) || allFood().find(x=>x.id===recipeId).servings;
  if(!mealPlan[date]) mealPlan[date]={};
  mealPlan[date][slot]={id:recipeId, servings};
  save('vk_mealPlan', mealPlan);
  closeModal(); renderPlan();
  toast('Pridėta į planą');
}
function assignPlanSlot(recipeId){
  if(!pendingPlanSlot) return;
  const {date, slot} = pendingPlanSlot;
  const r = allFood().find(x=>x.id===recipeId);
  if(!mealPlan[date]) mealPlan[date]={};
  mealPlan[date][slot]={id:recipeId, servings:r?r.servings:2};
  save('vk_mealPlan', mealPlan);
  pendingPlanSlot=null;
  closeModal(); renderPlan();
  toast('Pridėta į planą');
}
function removeFromPlan(date, slot){
  if(mealPlan[date]){ delete mealPlan[date][slot]; save('vk_mealPlan', mealPlan); }
  renderPlan();
}
function autoFillWeek(){
  const dates = getWeekDates(planWeekOffset);
  const recent = recentCookCounts();
  const usedThisFill = {};
  const slots = ['pusryciai','pietus','vakariene'];
  dates.forEach(date=>{
    if(!mealPlan[date]) mealPlan[date]={};
    slots.forEach(slot=>{
      if(mealPlan[date][slot]) return; // don't overwrite existing
      let candidates = allFood().filter(r=>r.category===slot).map(r=>({r,m:recipeMatch(r)})).filter(x=>x.m.equipOk);
      if(!candidates.length) candidates = allFood().filter(r=>r.category===slot).map(r=>({r,m:recipeMatch(r)}));
      if(!candidates.length) return;
      candidates.sort((a,b)=>{
        const scoreA = (recent[a.r.id]||0)+(usedThisFill[a.r.id]||0)*3 - a.m.pct/100;
        const scoreB = (recent[b.r.id]||0)+(usedThisFill[b.r.id]||0)*3 - b.m.pct/100;
        return scoreA-scoreB;
      });
      const chosen = candidates[0].r;
      mealPlan[date][slot] = {id:chosen.id, servings:chosen.servings};
      usedThisFill[chosen.id] = (usedThisFill[chosen.id]||0)+1;
    });
  });
  save('vk_mealPlan', mealPlan);
  renderPlan();
  toast('Savaitė užpildyta įvairiais patiekalais');
}
function savePlanAsTemplate(){
  const dates = getWeekDates(planWeekOffset);
  const hasAny = dates.some(d=>mealPlan[d] && Object.keys(mealPlan[d]).length);
  if(!hasAny){ toast('Planas tuščias — nėra ko išsaugoti'); return; }
  openModal(`
    <h2>Išsaugoti kaip šabloną</h2>
    <label>Šablono pavadinimas</label>
    <input id="tpl_name" placeholder="pvz. Įprasta darbo savaitė">
    <button class="btn btn-primary" style="margin-top:16px" onclick="confirmSaveTemplate()">Išsaugoti</button>
  `);
}
function confirmSaveTemplate(){
  const name = document.getElementById('tpl_name').value.trim();
  if(!name){ toast('Įveskite pavadinimą'); return; }
  const dates = getWeekDates(planWeekOffset);
  const data = dates.map(d=>mealPlan[d]||{});
  planTemplates.push({id:uid(), name, data});
  save('vk_planTemplates', planTemplates);
  closeModal(); renderPlan();
  toast('Šablonas išsaugotas');
}
function openTemplates(){
  if(!planTemplates.length){ toast('Dar neturite išsaugotų šablonų'); return; }
  openModal(`
    <h2>Plano šablonai</h2>
    <small class="hint">Pritaikius, šablonas užpildys rodomą savaitę.</small>
    <div style="margin-top:10px">
    ${planTemplates.map(t=>`<div class="recipe-card" style="justify-content:space-between">
      <div class="rinfo" onclick="applyTemplate('${t.id}')"><div class="rname" style="font-size:15px">${t.name}</div><div class="rmeta"><span class="tag">Spustelėkite pritaikyti</span></div></div>
      <button class="icon-btn" onclick="deleteTemplate('${t.id}')" title="Trinti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
    </div>`).join('')}
    </div>
  `);
}
function applyTemplate(id){
  const t = planTemplates.find(x=>x.id===id);
  if(!t) return;
  const dates = getWeekDates(planWeekOffset);
  dates.forEach((d,i)=>{ mealPlan[d] = Object.assign({}, t.data[i]||{}); });
  save('vk_mealPlan', mealPlan);
  closeModal(); renderPlan();
  toast('Šablonas pritaikytas');
}
function deleteTemplate(id){
  planTemplates = planTemplates.filter(t=>t.id!==id);
  save('vk_planTemplates', planTemplates);
  openTemplates();
}
function guessPantryCategory(name){
  const n = normName(name);
  for(const cat of PANTRY_CATEGORIES){
    const existing = pantry.find(p=>p.category===cat && (normName(p.name).includes(n)||n.includes(normName(p.name))));
    if(existing) return cat;
  }
  return guessCategoryByKeyword(name);
}
let shoppingChecked = new Set();
function renderShoppingList(){
  const dates = getWeekDates(planWeekOffset);
  const need = {};
  dates.forEach(date=>{
    const dp = mealPlan[date];
    if(!dp) return;
    Object.entries(dp).forEach(([slot,v])=>{
      const entry = getSlotEntry(dp, slot);
      if(!entry) return;
      const r = allFood().find(x=>x.id===entry.id);
      if(!r) return;
      const scale = (entry.servings||r.servings)/r.servings;
      r.ingredients.forEach(ing=>{
        const key = normName(ing.name)+'|'+ing.unit;
        if(!need[key]) need[key] = {key, name:ing.name, unit:ing.unit, qty:0};
        need[key].qty += ing.qty*scale;
      });
    });
  });
  const missing = Object.values(need).map(n=>{
    const have = pantry.find(p=>{const pn=normName(p.name); return pn===normName(n.name)||pn.includes(normName(n.name))||normName(n.name).includes(pn);});
    const haveQty = (have && have.unit===n.unit) ? have.qty : 0;
    const missingQty = Math.max(0, Math.round((n.qty-haveQty)*100)/100);
    return {...n, missingQty, category: guessPantryCategory(n.name)};
  }).filter(n=>n.missingQty>0);
  const box = document.getElementById('shoppingListBox');
  if(!missing.length){ box.innerHTML=''; return; }
  const grouped = {};
  missing.forEach(m=>{ if(!grouped[m.category]) grouped[m.category]=[]; grouped[m.category].push(m); });
  box.innerHTML = `<div class="card" style="margin-top:10px">
    <div class="section-title" style="margin-top:0">🛒 Reikia nupirkti šiai savaitei</div>
    ${Object.entries(grouped).map(([cat,items])=>`
      <div style="font-weight:700;font-size:12.5px;color:var(--muted);margin:10px 0 4px">${cat}</div>
      <ul class="ing-list">${items.map(m=>`
        <li class="${shoppingChecked.has(m.key)?'have':'miss'}">
          <span style="display:flex;align-items:center;gap:8px">
            <input type="checkbox" ${shoppingChecked.has(m.key)?'checked':''} onchange="toggleShoppingCheck('${m.key}')">
            <span style="${shoppingChecked.has(m.key)?'text-decoration:line-through':''}">${m.name} — ${m.missingQty} ${m.unit}</span>
          </span>
        </li>`).join('')}
      </ul>`).join('')}
    <button class="btn btn-primary" style="margin-top:12px" onclick="openBoughtDialog()">✅ Apsipirkau</button>
    <small class="hint" style="margin-top:6px">Pažymėkite pirktus produktus, tada „Apsipirkau" iškart sudės juos į sandėlį su standartiniais kiekiais ir galiojimu.</small>
  </div>`;
  window._lastShoppingMissing = missing;
}
function toggleShoppingCheck(key){ if(shoppingChecked.has(key)) shoppingChecked.delete(key); else shoppingChecked.add(key); renderShoppingList(); }
function openBoughtDialog(){
  const missing = window._lastShoppingMissing || [];
  const checked = missing.filter(m=>shoppingChecked.has(m.key));
  const items = checked.length ? checked : missing;
  if(!items.length){ toast('Nėra ką pridėti'); return; }
  openModal(`
    <h2>Apsipirkau</h2>
    <small class="hint">Patikslinkite kiekius ir laikymo vietą — galiojimas pasiūlomas automatiškai. Pažymėti bus sudėti į sandėlį.</small>
    <div style="max-height:55vh;overflow-y:auto;margin-top:10px">
    ${items.map((m,i)=>{
      const unit = defaultUnitFor(m.name);
      return `<div class="card" style="padding:10px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <input type="checkbox" id="bought_chk_${i}" checked>
          <b style="font-size:14px">${m.name}</b>
        </div>
        <div class="field-row">
          <div><input type="text" inputmode="decimal" id="bought_qty_${i}" value="${m.missingQty||1}" placeholder="Kiekis"></div>
          <div><select id="bought_unit_${i}">${UNITS.map(u=>`<option ${u===(m.unit||unit)?'selected':''}>${u}</option>`).join('')}</select></div>
          <div><select id="bought_loc_${i}" onchange="updateBoughtExpiry(${i},'${m.name.replace(/'/g,"\\'")}')"><option value="">Vieta</option>${LOCATIONS.map(l=>`<option>${l}</option>`).join('')}</select></div>
        </div>
        <input type="date" id="bought_exp_${i}" style="margin-top:6px" placeholder="Galioja iki">
        <input type="hidden" id="bought_name_${i}" value="${m.name.replace(/"/g,'&quot;')}">
        <input type="hidden" id="bought_cat_${i}" value="${m.category||'Kita'}">
      </div>`;
    }).join('')}
    </div>
    <button class="btn btn-primary" style="margin-top:12px" onclick="confirmBought(${items.length})">Sudėti į sandėlį</button>
  `);
}
function updateBoughtExpiry(i, name){
  const loc = document.getElementById('bought_loc_'+i).value;
  const expEl = document.getElementById('bought_exp_'+i);
  if(loc && !expEl.value){
    const suggested = suggestExpiry(name, loc);
    if(suggested) expEl.value = suggested;
  }
}
function confirmBought(count){
  let added = 0;
  for(let i=0;i<count;i++){
    const chk = document.getElementById('bought_chk_'+i);
    if(!chk || !chk.checked) continue;
    const name = document.getElementById('bought_name_'+i).value;
    const qty = parseLocaleNumber(document.getElementById('bought_qty_'+i).value) || 1;
    const unit = document.getElementById('bought_unit_'+i).value;
    const loc = document.getElementById('bought_loc_'+i).value || null;
    const exp = document.getElementById('bought_exp_'+i).value || null;
    const cat = document.getElementById('bought_cat_'+i).value || 'Kita';
    // merge into existing pantry item of same name+unit, else add new
    const existing = pantry.find(p=>normName(p.name)===normName(name) && p.unit===unit);
    if(existing){ existing.qty = Math.round((existing.qty+qty)*100)/100; if(loc) existing.location=loc; if(exp) existing.expiresOn=exp; }
    else { pantry.push({id:uid(), name, category:cat, qty, unit, low:null, freshness:null, location:loc, expiresOn:exp}); }
    itemFrequency[name] = {count:((itemFrequency[name]&&itemFrequency[name].count)||0)+1, category:cat, unit};
    added++;
  }
  save('vk_pantry', pantry);
  save('vk_itemFrequency', itemFrequency);
  shoppingChecked.clear();
  closeModal();
  renderPantry(); renderRecipes(); renderPlan();
  toast(added+' produktai sudėti į sandėlį');
}
function quickAddToPantry(name, qty, unit){
  pantry.push({id:uid(), name, category:'Kita', qty, unit, low:null, freshness:null, location:null, expiresOn:null});
  save('vk_pantry', pantry);
  renderPantry(); renderRecipes();
  toast(name+' pridėta į sandėlį');
}

/* ===================== SHOPPING TEMPLATES ===================== */
function openShoppingTemplates(){
  openModal(`
    <h2>🛒 Pirkinių šablonai</h2>
    <small class="hint">Įprasti pirkiniai, kuriuos galite greitai sudėti į sandėlį (pvz. „Savaitės pagrindas").</small>
    <div style="margin-top:12px">
    ${shoppingTemplates.length?shoppingTemplates.map(t=>`
      <div class="recipe-card" style="justify-content:space-between">
        <div class="rinfo" onclick="applyShoppingTemplate('${t.id}')"><div class="rname" style="font-size:15px">${t.name}</div><div class="rmeta"><span class="tag">${t.items.length} prekės</span></div></div>
        <button class="icon-btn" onclick="deleteShoppingTemplate('${t.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </div>`).join('') : '<p class="hint">Šablonų dar nėra.</p>'}
    </div>
    <button class="btn btn-outline" style="margin-top:10px" onclick="openNewShoppingTemplate()">+ Naujas šablonas</button>
  `);
}
function openNewShoppingTemplate(){
  openModal(`
    <h2>Naujas pirkinių šablonas</h2>
    <label>Pavadinimas</label>
    <input id="st_name" placeholder="pvz. Savaitės pagrindas">
    <label>Prekės (kiekviena naujoje eilutėje)</label>
    <textarea id="st_items" rows="8" placeholder="Pienas&#10;Kiaušiniai&#10;Duona&#10;Sviestas"></textarea>
    <small class="hint">Įrašykite po vieną prekę eilutėje. Kiekius ir vienetus galėsite patikslinti sudėdami į sandėlį.</small>
    <button class="btn btn-primary" style="margin-top:14px" onclick="saveShoppingTemplate()">Išsaugoti</button>
  `);
}
function saveShoppingTemplate(){
  const name = document.getElementById('st_name').value.trim();
  const raw = document.getElementById('st_items').value.trim();
  if(!name || !raw){ toast('Įveskite pavadinimą ir bent vieną prekę'); return; }
  const items = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  shoppingTemplates.push({id:uid(), name, items});
  save('vk_shoppingTemplates', shoppingTemplates);
  openShoppingTemplates();
  toast('Šablonas išsaugotas');
}
function applyShoppingTemplate(id){
  const t = shoppingTemplates.find(x=>x.id===id);
  if(!t) return;
  const missing = t.items.map(name=>({key:normName(name)+'|'+defaultUnitFor(name), name, unit:defaultUnitFor(name), missingQty:1, category:guessPantryCategory(name)}));
  window._lastShoppingMissing = missing;
  shoppingChecked = new Set(missing.map(m=>m.key));
  closeModal();
  openBoughtDialog();
}
function deleteShoppingTemplate(id){
  shoppingTemplates = shoppingTemplates.filter(t=>t.id!==id);
  save('vk_shoppingTemplates', shoppingTemplates);
  openShoppingTemplates();
}

/* ===================== STATS ===================== */
function renderStats(){
  const box = document.getElementById('statsBox');
  if(!box) return;
  if(!cookLog.length){ box.innerHTML = `<small class="hint">Kai pradėsite žymėti receptus kaip pagamintus, čia matysite savo statistiką.</small>`; return; }
  const counts = {};
  cookLog.forEach(c=>{ counts[c.recipeName] = (counts[c.recipeName]||0)+1; });
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const uniqueCount = Object.keys(counts).length;
  box.innerHTML = `<div>Iš viso pagaminta / išgerta: <b>${cookLog.length}</b> kartų</div>
    <div style="margin-top:4px">Skirtingų receptų išbandyta: <b>${uniqueCount}</b></div>
    <div class="section-title" style="margin-top:10px">TOP receptai</div>
    ${top.map(([name,count])=>`<div class="log-entry"><span class="lname">${name}</span><span class="lmeta">${count}×</span></div>`).join('')}`;
}

/* ===================== UNIT CONVERTER ===================== */
const VOLUME_TO_ML = {'ml':1,'l':1000,'tsp':5,'tbsp':15,'cup':240};
const WEIGHT_TO_G = {'g':1,'kg':1000};
function runConverter(){
  const val = parseLocaleNumber(document.getElementById('conv_value').value);
  const from = document.getElementById('conv_from').value;
  const to = document.getElementById('conv_to').value;
  const out = document.getElementById('conv_result');
  if(isNaN(val)){ out.textContent=''; return; }
  const isWeight = WEIGHT_TO_G[from]!=null, isWeightTo = WEIGHT_TO_G[to]!=null;
  if(isWeight !== isWeightTo){ out.textContent = 'Svorio ir tūrio vienetų tiesiogiai konvertuoti negalima (priklauso nuo produkto tankio).'; return; }
  const table = isWeight ? WEIGHT_TO_G : VOLUME_TO_ML;
  const result = val*table[from]/table[to];
  out.textContent = val+' '+from+' ≈ '+(Math.round(result*100)/100)+' '+to;
}

/* ===================== SETTINGS ===================== */
function saveGoals(){
  settings.goalKcal = parseInt(document.getElementById('setGoalKcal').value)||2000;
  settings.goalProtein = parseInt(document.getElementById('setGoalProtein').value)||100;
  settings.goalCarbs = parseInt(document.getElementById('setGoalCarbs').value)||230;
  settings.goalFat = parseInt(document.getElementById('setGoalFat').value)||65;
  save('vk_settings', settings);
  renderLog();
  toast('Tikslai išsaugoti');
}
function toggleTheme(){
  settings.theme = document.getElementById('themeToggle').checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', settings.theme);
  save('vk_settings', settings);
}
function applyFontSize(){
  document.documentElement.classList.remove('text-large','text-xlarge');
  if(settings.fontSize==='large') document.documentElement.classList.add('text-large');
  else if(settings.fontSize==='xlarge') document.documentElement.classList.add('text-xlarge');
}
function setFontSize(){
  settings.fontSize = document.getElementById('fontSizeSelect').value;
  applyFontSize();
  save('vk_settings', settings);
}
function saveWaterGoal(){
  settings.goalWaterMl = parseInt(document.getElementById('setGoalWater').value)||2000;
  save('vk_settings', settings);
  renderWater();
  toast('Vandens tikslas išsaugotas');
}

/* ===================== STANDALONE KITCHEN TIMER ===================== */
let standaloneTimer = null, standaloneSeconds = 0;
function openStandaloneTimer(){
  standaloneSeconds = 0;
  openModal(`
    <h2 style="text-align:center">⏱ Virtuvės laikmatis</h2>
    <div style="text-align:center;font-size:48px;font-weight:800;margin:20px 0" id="standaloneDisplay">00:00</div>
    <div class="field-row" style="grid-template-columns:1fr 1fr 1fr">
      <button class="btn btn-secondary" onclick="addStandaloneTime(60)">+1 min</button>
      <button class="btn btn-secondary" onclick="addStandaloneTime(300)">+5 min</button>
      <button class="btn btn-secondary" onclick="addStandaloneTime(600)">+10 min</button>
    </div>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-primary" id="standaloneStartBtn" onclick="startStandaloneTimer()">Pradėti</button>
      <button class="btn btn-outline" onclick="resetStandaloneTimer()">Atstatyti</button>
    </div>
  `);
  updateStandaloneDisplay();
}
function addStandaloneTime(sec){ standaloneSeconds += sec; updateStandaloneDisplay(); }
function updateStandaloneDisplay(){
  const d = document.getElementById('standaloneDisplay');
  if(!d) return;
  const m = Math.floor(standaloneSeconds/60), s = standaloneSeconds%60;
  d.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function startStandaloneTimer(){
  if(standaloneTimer || standaloneSeconds<=0) return;
  const btn = document.getElementById('standaloneStartBtn');
  if(btn) btn.textContent = 'Vyksta...';
  standaloneTimer = setInterval(()=>{
    standaloneSeconds--;
    updateStandaloneDisplay();
    if(standaloneSeconds<=0){
      clearInterval(standaloneTimer); standaloneTimer=null;
      try{
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const osc = ctx.createOscillator(); osc.frequency.value=880; osc.connect(ctx.destination);
        osc.start(); setTimeout(()=>osc.stop(), 400);
      }catch(e){}
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
      if(btn) btn.textContent = 'Pradėti';
    }
  }, 1000);
}
function resetStandaloneTimer(){
  if(standaloneTimer){ clearInterval(standaloneTimer); standaloneTimer=null; }
  standaloneSeconds = 0;
  updateStandaloneDisplay();
  const btn = document.getElementById('standaloneStartBtn');
  if(btn) btn.textContent = 'Pradėti';
}

/* ===================== FLOATING QUICK ADD ===================== */
function openQuickAddMenu(){
  openModal(`
    <h2>Greitas veiksmas</h2>
    <div class="btn-row" style="flex-direction:column;gap:10px">
      <button class="btn btn-primary" onclick="closeModal();switchView('pantry');setTimeout(openPantryForm,250)">🧺 Pridėti sandėlio prekę</button>
      <button class="btn btn-primary" onclick="closeModal();switchView('log');setTimeout(openLogForm,250)">🍽 Pridėti maisto įrašą</button>
      <button class="btn btn-secondary" onclick="closeModal();openStandaloneTimer()">⏱ Virtuvės laikmatis</button>
      <button class="btn btn-outline" onclick="closeModal();switchView('recipes');setTimeout(openRecipeForm,250)">📖 Pridėti savo receptą</button>
    </div>
  `);
}

/* ===================== HELP / USER MANUAL ===================== */
/* SVARBU: šį turinį reikia atnaujinti su kiekvienu programėlės atnaujinimu, kad atspindėtų esamas funkcijas. */
function openHelp(){
  openModal(`
    <h2>Kaip naudotis programėle</h2>
    <div class="section-title" style="margin-top:0">🧺 Sandėlis</div>
    <p>Sekate, kokių produktų turite namuose. Pridėkite produktą mygtuku viršuje arba nuskenuokite brūkšninį kodą (jei kamera neveikia, kodą galima įvesti ranka — produktas surandamas Open Food Facts duomenų bazėje). Įvedant produktą, standartinis vienetas (pvz. pienas — litrai, mėsa — kilogramai) ir galiojimo laikas pagal laikymo vietą pasiūlomi automatiškai — galite koreguoti. Kategorijos suskleidžiamos. Viršuje matysite „Beveik galite pagaminti" ir „Sunaudokite greičiau" pasiūlymus. Produktus galima ištrinti perbraukus pirštu į kairę.</p>

    <div class="section-title">📖 Receptai</div>
    <p>Perjunkite tarp „Maistas" ir „Kokteiliai". Paieška veikia pagal kelis ingredientus vienu metu (per kablelį). „Filtrai" — kategorija, virtuvė, mityba (įsk. karnivorą), sudėtingumas; kokteiliams — bazė, saldumas, gaivumas. Galite pažymėti mėgstamus (★), įvertinti, palikti pastabą, pridėti į kolekciją, pasidalinti arba išsaugoti PDF. Keičiant porcijas viskas perskaičiuojama. „Gaminimo režimas" veda per žingsnius su laikmačiais. Pažymint pagamintą, pasirenkate „Tik sau" (nurašomos tik jūsų porcijos) arba „Sau ir kitiems" (nurašomi visi ingredientai, o kalorijos skaičiuojamos tik jūsų porcijoms).</p>

    <div class="section-title">🔥 Kalorijos</div>
    <p>Pridėkite įrašą nurodydami kiekį ir vienetą — kalorijos žinomiems produktams apskaičiuojamos automatiškai. Matote dienos progresą, makro balansą, vandens sekimą ir savaitės grafiką. „📍 Šiandien" grąžina į dabartinę dieną. „Istorija" rodo praeities dienas pagal mėnesį. Įrašus galima trinti perbraukus.</p>

    <div class="section-title">📅 Planas</div>
    <p>Planuokite savaitės valgius. „Užpildyti savaitę" parenka įvairius patiekalus. Pridedant nurodote porcijų skaičių, kad pirkinių sąrašas (sugrupuotas pagal kategorijas) būtų tikslus. „Apsipirkau" mygtukas iškart sudeda pirktus produktus į sandėlį su standartiniais kiekiais ir galiojimu. Planus ir pirkinių sąrašus galima išsaugoti kaip šablonus.</p>

    <div class="section-title">⚙️ Nustatymai</div>
    <p>Pasirenkate virtuvės prietaisus ir atskirai baro įrankius (šeikeris, grūstuvė, koštuvas). Nustatote kalorijų/vandens tikslus, temą, teksto dydį (trys dydžiai). Galite eksportuoti/importuoti duomenis (atsarginė kopija) arba viską ištrinti. Statistika rodo dažniausiai gaminamus patiekalus.</p>

    <div class="section-title">💡 Patarimai</div>
    <ul style="padding-left:18px;font-size:14px;line-height:1.6">
      <li>Ištrynus per klaidą — apačioje kelias sekundes rodomas „Anuliuoti" mygtukas.</li>
      <li>Apvalus + mygtukas apačioje leidžia greitai pridėti bet ką ar įjungti virtuvės laikmatį.</li>
      <li>Visi duomenys saugomi tik telefone — periodiškai darykite atsarginę kopiją.</li>
    </ul>
  `);
}
function exportData(){
  const backup = { vk_equipment: equipment, vk_barTools: barTools, vk_pantry: pantry, vk_customRecipes: customRecipes,
    vk_cookLog: cookLog, vk_calorieLog: calorieLog, vk_mealPlan: mealPlan, vk_settings: settings,
    vk_favorites: favorites, vk_ratings: ratings, vk_notes: notes, vk_planTemplates: planTemplates,
    vk_productCache: productCache, vk_itemFrequency: itemFrequency, vk_logFrequency: logFrequency,
    vk_waterLog: waterLog, vk_collections: collections, vk_shoppingTemplates: shoppingTemplates, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mano-virtuve-atsargine-kopija-'+todayStr()+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Atsisiunčiama...');
}
function importData(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const data = JSON.parse(e.target.result);
      ['vk_equipment','vk_barTools','vk_pantry','vk_customRecipes','vk_cookLog','vk_calorieLog','vk_mealPlan','vk_settings','vk_favorites','vk_ratings','vk_notes','vk_planTemplates','vk_productCache','vk_itemFrequency','vk_logFrequency','vk_waterLog','vk_collections','vk_shoppingTemplates'].forEach(k=>{
        if(data[k]!==undefined) save(k, data[k]);
      });
      toast('Duomenys atkurti. Perkraunama...');
      setTimeout(()=>location.reload(), 900);
    }catch(err){ toast('Nepavyko nuskaityti failo'); }
  };
  reader.readAsText(file);
}
function resetAllData(){
  if(!confirm('Ar tikrai norite ištrinti VISUS duomenis? Šio veiksmo atšaukti negalima.')) return;
  ['vk_equipment','vk_barTools','vk_pantry','vk_customRecipes','vk_cookLog','vk_calorieLog','vk_mealPlan','vk_settings','vk_favorites','vk_ratings','vk_notes','vk_planTemplates','vk_productCache','vk_itemFrequency','vk_logFrequency','vk_waterLog','vk_collections','vk_shoppingTemplates'].forEach(k=>localStorage.removeItem(k));
  location.reload();
}
