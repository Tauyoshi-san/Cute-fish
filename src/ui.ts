import {FOODS, SHOP, SPECIES, SUBSTRATES} from './data';
import {store} from './store';
import type {FoodId,SubstrateId} from './types';
import {getAudioSettings,playSfx,setMuted,setVolume,setSfxVolume} from './audio';
import {getMission,getProgress,recordAction} from './progression';
import {fishAsset} from './fishAssets';
import {DECOR_ASSETS,FOOD_ASSETS} from './itemAssets';

let selected = store.state.fish[0]?.id;
let panel: 'home' | 'shop' | 'book' | 'decor' = 'home';
let decorSelected:string|null=null;
const hud = document.querySelector<HTMLElement>('#hud')!;
const toast = (message: string) => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2400);
};
function showMissionComplete(title:string,reward:number){
  document.querySelector('.mission-complete')?.remove();
  const layer=document.createElement('div');
  layer.className='mission-complete';
  const confetti=Array.from({length:18},(_,i)=>`<i style="--angle:${i*20}deg;--delay:${(i%4)*.05}s;--color:${['#f58f79','#f6ca62','#78cfc1','#8dc9e8'][i%4]}"></i>`).join('');
  layer.innerHTML=`<div class="mission-burst">${confetti}</div><section><small>MISSION COMPLETE!</small><b>${title}</b><span>🪙 <strong>+${reward}</strong> コイン</span></section>`;
  document.body.append(layer);
  void playSfx('missionComplete');
  window.setTimeout(()=>layer.classList.add('leaving'),2200);
  window.setTimeout(()=>layer.remove(),2700);
}
const bar = (value: number) => `<span class="meter"><i style="width:${value}%"></i></span>`;
const coinPrice = (value:number) => `<span class="coin-price">${value}<i aria-hidden="true">🪙</i></span>`;

function fishPanel() {
  const fish = store.state.fish.find(item => item.id === selected) || store.state.fish[0];
  if (!fish) return '<p class="console-empty">魚を迎えてください</p>';
  selected = fish.id;
  return `<div class="console-section fish-summary">
    <p class="eyebrow">SELECTED FISH</p>
    <div class="fish-title"><img src="${fishAsset(fish.species)}" alt=""><h2>${fish.name}<small>${SPECIES[fish.species].name}</small></h2></div>
    <div class="stats"><label>おなか ${bar(fish.hunger)}</label><label>ごきげん ${bar(fish.happiness)}</label></div>
    <p class="hintline">進化のヒント：${SPECIES[fish.species].hint}</p>
  </div><div class="console-section"><h3>ごはんをあげる</h3><div class="cards">${(Object.keys(FOODS) as FoodId[]).map(id => `<button class="food" data-food="${id}" ${store.state.inventory[id] ? '' : 'disabled'}><img class="item-thumb" src="${FOOD_ASSETS[id]}" alt=""><b>${FOODS[id].name}</b><span>所持 ${store.state.inventory[id]}</span></button>`).join('')}</div><p class="history">食べたもの：${fish.foods.length ? fish.foods.map(id => FOODS[id].icon).join('　') : 'まだありません'}</p><button class="sell" ${store.state.fish.length === 1 ? 'disabled' : ''}>この魚を ${SPECIES[fish.species].value} コインで送り出す</button></div>`;
}

function shopPanel() {
  return `<div class="console-section"><p class="eyebrow">AQUARIUM SHOP</p><h2>水辺ショップ<small>ごはんと配置アイテム</small></h2><h3>ごはん</h3><div class="shopgrid">${(Object.keys(FOODS) as FoodId[]).map(id => `<button data-buyfood="${id}"><b><img class="shop-thumb" src="${FOOD_ASSETS[id]}" alt="">${FOODS[id].name}</b><span>${FOODS[id].desc}</span><em>${coinPrice(FOODS[id].cost)}</em></button>`).join('')}</div><h3>底砂</h3><div class="shopgrid substrate-shop">${(Object.keys(SUBSTRATES) as SubstrateId[]).map(id=>{const item=SUBSTRATES[id],owned=store.state.ownedSubstrates.includes(id),selected=store.state.substrate===id;return `<button data-substrate="${id}" class="${selected?'selected':''}"><b><i class="substrate-swatch substrate-${id}"></i>${item.name}</b><span>${item.desc}</span><em>${selected?'使用中':owned?'選択する':coinPrice(item.cost)}</em></button>`}).join('')}</div><h3>水槽アイテム</h3><div class="shopgrid">${SHOP.map(item => `<button data-decor="${item.type}"><b><img class="shop-thumb" src="${DECOR_ASSETS[item.type]}" alt="">${item.name}</b><span>${item.desc}</span><em>${coinPrice(item.cost)}</em></button>`).join('')}</div><button class="primary" data-fish>稚魚を迎える · ${coinPrice(55)}</button></div>`;
}

function bookPanel() {
  const ids=Object.keys(SPECIES) as (keyof typeof SPECIES)[];
  const discovered=ids.filter(id=>store.state.discovered.includes(id)).length;
  const completion=Math.round(discovered/ids.length*100);
  return `<div class="console-section"><p class="eyebrow">AQUA ARCHIVE</p><div class="archive-title"><h2>いきもの図鑑<small>進化を見つけて記録しよう</small></h2><strong><span>コンプ率</span><b>${completion}%</b></strong></div><div class="species">${ids.map(id => { const got = store.state.discovered.includes(id), item = SPECIES[id]; return `<article class="${got ? '' : 'locked'}">${got?`<img src="${fishAsset(id)}" alt="${item.name}">`:'<span class="unknown-fish" aria-label="未発見の魚">？</span>'}<div><b>${got ? item.name : '？'}</b><span>${got ? item.hint : `ヒント：${item.discoveryHint}`}</span></div><em>${got ? item.value + ' コイン' : '未発見'}</em></article>`; }).join('')}</div></div>`;
}

function homePanel(){const progress=getProgress(),mission=getMission(progress),parts=Object.entries(mission.target).map(([key,target])=>{const label=key==='feed'?'ごはん':key==='clean'?'掃除':'買い物',current=Math.min(progress[key as 'feed'|'clean'|'buy'],target||0);return `<span class="${current>=(target||0)?'done':''}">${label} ${current}/${target}</span>`}).join('');return `<div class="console-section console-home"><p class="eyebrow">AQUARIUM STATUS</p><h2>水槽のお世話<small>魚をクリックすると、ごはん画面が開きます</small></h2><section class="daily-goals mission-card"><header><b>ミッション</b><em>報酬 ${mission.reward} コイン</em></header><strong>${mission.title}</strong><p>${mission.description}</p><div>${parts}</div></section><div class="home-fish">${store.state.fish.map(f=>`<button data-openfish="${f.id}"><img src="${fishAsset(f.species)}" alt=""><b>${f.name}</b><span>${SPECIES[f.species].name}</span></button>`).join('')}</div></div>`}
function decorPanel(){const placed=store.state.decorations.filter(d=>d.placed),stored=store.state.decorations.filter(d=>!d.placed);return `<div class="console-section decor-console"><p class="eyebrow">LAYOUT EDITOR</p><h2>配置編集<small>装飾を選ぶと、水槽下部に調整バーが開きます</small></h2><div class="decor-list">${placed.length?placed.map(x=>`<button data-pickdecor="${x.id}" class="${x.id===decorSelected?'active':''}"><span><img src="${DECOR_ASSETS[x.type]}" alt=""></span><b>${SHOP.find(i=>i.type===x.type)?.name||x.type}</b></button>`).join(''):'<p>配置中の装飾はありません</p>'}</div><p class="decor-guide">水槽内では装飾を上下左右へドラッグできます。</p>${stored.length?`<h3>収納中</h3><div class="decor-list">${stored.map(x=>`<button data-restoredecor="${x.id}"><span><img src="${DECOR_ASSETS[x.type]}" alt=""></span><b>${SHOP.find(i=>i.type===x.type)?.name||x.type}</b></button>`).join('')}</div>`:''}</div>`}

function openFishDialog(id:string){selected=id;const fish=store.state.fish.find(f=>f.id===id);if(!fish)return;document.querySelector('.fish-dialog')?.remove();const dialog=document.createElement('div');dialog.className='fish-dialog';dialog.innerHTML=`<div class="fish-dialog-card"><button class="dialog-close" aria-label="閉じる">×</button><form class="fish-rename"><label for="fish-name-input">魚の名前</label><div><input id="fish-name-input" name="fishName" maxlength="12" value="${fish.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" autocomplete="off"><button type="submit">変更</button></div></form>${fishPanel()}</div>`;document.body.append(dialog);dialog.querySelector('.dialog-close')!.addEventListener('click',()=>dialog.remove());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.remove()});dialog.querySelector<HTMLFormElement>('.fish-rename')!.addEventListener('submit',e=>{e.preventDefault();const input=dialog.querySelector<HTMLInputElement>('#fish-name-input')!;if(store.renameFish(id,input.value)){toast('名前を変更しました');openFishDialog(id)}else{input.focus()}});bind(dialog)}

function render() {
  const state = store.state;
  document.querySelector<HTMLElement>('#camera-stage')!.dataset.substrate=state.substrate;
  const audio=getAudioSettings();
  hud.innerHTML = `<aside class="tank-console"><div class="console-head"><div class="brand"><b>FANCY</b><span>FISH</span></div><div class="resources"><span class="help-tip" tabindex="0" data-tooltip="ショップで餌や水槽アイテムを購入するためのコインです。">🪙 ${state.coins}</span><span class="help-tip" tabindex="0" data-tooltip="特別なごほうびとして集める、貴重なパールです。">🫧 ${state.pearls}</span><span class="water-gauge help-tip" tabindex="0" data-tooltip="水槽のきれいさです。魚のごきげんや進化条件に影響します。" aria-label="水質 ${Math.round(state.water)}"><b>水質</b>${bar(state.water)}</span></div><div class="sound-control"><button class="help-tip" data-tooltip="水槽のBGMをオン・オフします。" data-mute aria-label="BGMを${audio.muted?'オン':'オフ'}">${audio.muted?'🔇':'🔊'}</button><label class="help-tip" tabindex="0" data-tooltip="水槽内で流れる環境BGMの音量です。"><span>BGM</span><input data-volume type="range" min="0" max="100" value="${Math.round(audio.volume*100)}" aria-label="BGM音量"><output>${Math.round(audio.volume*100)}%</output></label></div></div><nav class="console-tabs"><button data-tab="home" class="${panel === 'home' ? 'active' : ''}">🐟<small>お世話</small></button><button data-tab="shop" class="${panel === 'shop' ? 'active' : ''}">🛒<small>ショップ</small></button><button data-tab="book" class="${panel === 'book' ? 'active' : ''}">⭐<small>図鑑</small></button><button data-tab="decor" class="${panel === 'decor' ? 'active' : ''}">✥<small>配置</small></button></nav><div class="console-body">${panel==='home'?homePanel():panel==='shop'?shopPanel():panel==='book'?bookPanel():decorPanel()}</div><div class="console-actions"><button data-clean ${state.cleanSpots ? '' : 'disabled'}>✨ お掃除 ${state.cleanSpots}</button><button data-ad>🎁 ごほうび</button></div></aside>`;
  hud.querySelector('.sound-control label')?.insertAdjacentHTML('afterend',`<label class="sfx-control help-tip" tabindex="0" data-tooltip="餌やり・掃除・進化などの効果音の音量です。"><span>効果音</span><input data-sfx-volume type="range" min="0" max="100" value="${Math.round(audio.sfxVolume*100)}" aria-label="効果音の音量"><output>${Math.round(audio.sfxVolume*100)}%</output></label>`);
  bind();
}

function bind(root:ParentNode=hud) {
  root.querySelectorAll<HTMLElement>('[data-tab]').forEach(button => button.onclick = () => { panel = button.dataset.tab as typeof panel;window.dispatchEvent(new CustomEvent('decor-mode',{detail:panel==='decor'})); render(); });
  root.querySelectorAll<HTMLElement>('[data-openfish]').forEach(button=>button.onclick=()=>openFishDialog(button.dataset.openfish!));
  root.querySelectorAll<HTMLElement>('[data-pickdecor]').forEach(button=>button.onclick=()=>{decorSelected=button.dataset.pickdecor!;window.dispatchEvent(new CustomEvent('decor-pick',{detail:decorSelected}));render()});
  root.querySelectorAll<HTMLElement>('[data-decoract]').forEach(button=>button.onclick=()=>window.dispatchEvent(new CustomEvent('decor-action',{detail:button.dataset.decoract})));
  root.querySelectorAll<HTMLElement>('[data-restoredecor]').forEach(button=>button.onclick=()=>window.dispatchEvent(new CustomEvent('decor-restore',{detail:button.dataset.restoredecor})));
  root.querySelector<HTMLElement>('[data-mute]')?.addEventListener('click',()=>void setMuted(!getAudioSettings().muted));
  root.querySelector<HTMLInputElement>('[data-volume]')?.addEventListener('input',e=>{const input=e.currentTarget as HTMLInputElement;setVolume(Number(input.value)/100);const output=input.parentElement?.querySelector('output');if(output)output.textContent=`${input.value}%`});
  root.querySelector<HTMLInputElement>('[data-sfx-volume]')?.addEventListener('input',e=>{const input=e.currentTarget as HTMLInputElement;setSfxVolume(Number(input.value)/100);const output=input.parentElement?.querySelector('output');if(output)output.textContent=`${input.value}%`});
  root.querySelector('[data-clean]')?.addEventListener('click', () => { if(!store.state.cleanSpots)return;store.clean();void playSfx('cleanSwish');recordAction('clean');toast('水槽がきれいになった！ +12 コイン'); });
  root.querySelectorAll<HTMLElement>('[data-food]').forEach(button => button.onclick = () => { const fishId=selected!,food=button.dataset.food as FoodId,origin=button.getBoundingClientRect(),evolved=store.feed(fishId,food);if(evolved===null){void playSfx('fail');return}void playSfx('feedToss');recordAction('feed');document.querySelector('.fish-dialog')?.remove();requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent('feed-effect',{detail:{fishId,food,origin}})));if(evolved)toast(`進化！ ${SPECIES[evolved].name} になった`);setTimeout(()=>openFishDialog(fishId),1450); });
  root.querySelector('.sell')?.addEventListener('click', () => { if (selected && store.sell(selected)) { selected = store.state.fish[0]?.id; document.querySelector('.fish-dialog')?.remove(); toast('新しい飼い主へ送り出しました'); } });
  root.querySelectorAll<HTMLElement>('[data-buyfood]').forEach(button => button.onclick = () => { const id = button.dataset.buyfood as FoodId; if(store.buyFood(id, FOODS[id].cost)){void playSfx('buySuccess');recordAction('buy');toast(`${FOODS[id].name}を購入`)}else{void playSfx('fail');toast('コインが足りません')} });
  root.querySelectorAll<HTMLElement>('[data-substrate]').forEach(button=>button.onclick=()=>{const id=button.dataset.substrate as SubstrateId,item=SUBSTRATES[id],owned=store.state.ownedSubstrates.includes(id);if(store.buySubstrate(id,item.cost)){void playSfx(owned?'tap':'buySuccess');if(!owned)recordAction('buy');toast(`${item.name}に変更しました`)}else{void playSfx('fail');toast('コインが足りません')}});
  root.querySelectorAll<HTMLElement>('[data-decor]').forEach(button => button.onclick = () => { const item = SHOP.find(value => value.type === button.dataset.decor)!; if(store.addDecor(item.type, item.cost)){void playSfx('buySuccess');recordAction('buy');toast(`${item.name}を設置しました`)}else{void playSfx('fail');toast('コインが足りません')} });
  root.querySelector('[data-fish]')?.addEventListener('click', () => {if(store.buyFish()){void playSfx('fishArrive');recordAction('buy');toast('新しい稚魚が仲間入り！')}else{void playSfx('fail');toast('コイン不足、または水槽が満員です')}});
  root.querySelector('[data-ad]')?.addEventListener('click', () => { const overlay = document.createElement('div'); overlay.className = 'ad'; overlay.innerHTML = '<div><small>REWARD PREVIEW</small><b>水辺からの贈りもの</b><span>広告SDK接続前のデモです</span><button>受け取る · +150 コイン</button></div>'; document.body.append(overlay); overlay.querySelector('button')!.onclick = () => { store.reward(); overlay.remove(); toast('ごほうび +150 コイン'); }; });
}

window.addEventListener('fishselect', event => openFishDialog((event as CustomEvent<string>).detail));
window.addEventListener('decorselect',event=>{decorSelected=(event as CustomEvent<string>).detail;panel='decor';window.dispatchEvent(new CustomEvent('decor-pick',{detail:decorSelected}));render()});
window.addEventListener('decor-selection',event=>{decorSelected=(event as CustomEvent<string|null>).detail;if(panel==='decor')render()});
window.addEventListener('audiochange',()=>{const audio=getAudioSettings(),mute=hud.querySelector<HTMLButtonElement>('[data-mute]'),volume=hud.querySelector<HTMLInputElement>('[data-volume]'),output=volume?.parentElement?.querySelector('output');if(mute){mute.textContent=audio.muted?'🔇':'🔊';mute.ariaLabel=`BGMを${audio.muted?'オン':'オフ'}`}if(volume&&document.activeElement!==volume)volume.value=String(Math.round(audio.volume*100));if(output)output.textContent=`${Math.round(audio.volume*100)}%`});
window.addEventListener('progresschange',()=>{if(panel==='home')render()});
window.addEventListener('missionprogress',()=>void playSfx('missionStep'));
window.addEventListener('progressreward',event=>{const detail=(event as CustomEvent<{reward:number;title:string}>).detail;showMissionComplete(detail.title,detail.reward)});
store.on(render);
render();
