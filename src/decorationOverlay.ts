import {store} from './store';
import type {Decoration} from './types';
import {assetUrl} from './assetUrl';

const layer=document.querySelector<HTMLDivElement>('#decor-overlay')!;
const assets:Record<Decoration['type'],string>={plant:assetUrl('assets/decorations/items/plant-mint.png'),coral:assetUrl('assets/decorations/items/plant-coral.png'),stones:assetUrl('assets/decorations/items/stones-jade.png'),driftwood:assetUrl('assets/decorations/items/driftwood.png'),crystal:assetUrl('assets/decorations/items/crystal-violet.png'),castle:assetUrl('assets/decorations/items/stone-arch.png'),aerator:assetUrl('assets/decorations/items/aerator.png'),filter:assetUrl('assets/decorations/items/filter-wide.png'),light:assetUrl('assets/decorations/items/light-bar.png')};
const names:Record<Decoration['type'],string>={plant:'ミント水草',coral:'コーラル水草',stones:'翡翠の小石',driftwood:'小さな流木',crystal:'ルミナ結晶',castle:'石のアーチ',aerator:'エアレーター',filter:'ワイドフィルター',light:'水槽ライト'};
const limits:Record<Decoration['type'],[number,number]>={plant:[.45,1.8],coral:[.45,1.8],stones:[.5,1.8],driftwood:[.5,1.65],crystal:[.55,1.55],castle:[.65,1.4],aerator:[.55,1.5],filter:[.6,1.55],light:[.6,1.5]};
const nodes=new Map<string,HTMLButtonElement>();
let selected:string|null=null,editing=false,dragging:string|null=null;

const ui=document.createElement('div');
ui.id='decor-editor';
ui.innerHTML=`<button class="decor-edit-toggle">配置編集</button><div class="decor-toolbar" aria-label="装飾編集"><span class="decor-title">装飾を選択</span><button data-act="smaller">−</button><button data-act="larger">＋</button><button data-act="rotate">↻</button><button data-act="flip">↔</button><button data-act="back">奥へ</button><button data-act="front">手前へ</button><button data-act="store">収納</button><button data-act="done">完了</button></div><div class="decor-inventory"></div>`;
document.querySelector('#app')!.append(ui);
const toolbar=ui.querySelector<HTMLDivElement>('.decor-toolbar')!;
const inventory=ui.querySelector<HTMLDivElement>('.decor-inventory')!;

function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n))}
function current(){return store.state.decorations.find(d=>d.id===selected)}
function setEditing(value:boolean){editing=value;ui.classList.toggle('is-editing',editing);layer.classList.toggle('is-editing',editing);if(!editing){selected=null;dragging=null}render()}

function position(node:HTMLElement,d:Decoration){node.style.left=`${d.x*100}%`;node.style.top=`${d.y*100}%`;node.style.zIndex=String(10+d.z);node.style.transform=`translate(-50%,-100%) rotate(${d.rotation}deg) scale(${d.flipped?-d.scale:d.scale},${d.scale})`;node.classList.toggle('selected',editing&&d.id===selected);node.hidden=!d.placed}

function render(){
 const live=new Set(store.state.decorations.map(d=>d.id));
 for(const [id,node] of nodes)if(!live.has(id)){node.remove();nodes.delete(id)}
 for(const d of store.state.decorations){let node=nodes.get(d.id);if(!node){node=document.createElement('button');node.className=`tank-decor decor-${d.type}`;node.dataset.id=d.id;node.ariaLabel=`${names[d.type]}を移動`;node.innerHTML=`<img src="${assets[d.type]}" draggable="false" alt="">`;node.addEventListener('pointerdown',e=>{if(!editing)return;e.preventDefault();selected=d.id;dragging=d.id;node!.setPointerCapture(e.pointerId);render()});node.addEventListener('pointermove',e=>{if(dragging!==d.id)return;const box=layer.getBoundingClientRect();store.updateDecor(d.id,{x:clamp((e.clientX-box.left)/box.width,.06,.94),y:clamp((e.clientY-box.top)/box.height,.38,.96)})});node.addEventListener('pointerup',()=>dragging=null);node.addEventListener('pointercancel',()=>dragging=null);layer.append(node);nodes.set(d.id,node)}position(node,d)}
 const d=current();toolbar.classList.toggle('has-selection',!!d);ui.querySelector('.decor-title')!.textContent=d?`${names[d.type]} ${Math.round(d.scale*100)}%`:'装飾を選択';
 const stored=store.state.decorations.filter(d=>!d.placed);inventory.innerHTML=stored.length?`<b>収納中</b>${stored.map(d=>`<button data-restore="${d.id}"><img src="${assets[d.type]}" alt="">${names[d.type]}</button>`).join('')}`:'';inventory.classList.toggle('has-items',stored.length>0&&editing);
}

ui.querySelector('.decor-edit-toggle')!.addEventListener('click',()=>setEditing(!editing));
toolbar.addEventListener('click',e=>{const action=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-act]')?.dataset.act;if(!action)return;if(action==='done'){setEditing(false);return}const d=current();if(!d)return;const [min,max]=limits[d.type];if(action==='smaller')store.updateDecor(d.id,{scale:clamp(d.scale-.1,min,max)});if(action==='larger')store.updateDecor(d.id,{scale:clamp(d.scale+.1,min,max)});if(action==='rotate')store.updateDecor(d.id,{rotation:(d.rotation+15)%360});if(action==='flip')store.updateDecor(d.id,{flipped:!d.flipped});if(action==='back')store.updateDecor(d.id,{z:Math.max(0,d.z-1)});if(action==='front')store.updateDecor(d.id,{z:Math.max(...store.state.decorations.map(x=>x.z))+1});if(action==='store'){store.storeDecor(d.id);selected=null}});
inventory.addEventListener('click',e=>{const id=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-restore]')?.dataset.restore;if(id){store.placeDecor(id);selected=id}});
window.addEventListener('decorselect',e=>{selected=(e as CustomEvent<string>).detail;setEditing(true)});
store.on(render);render();
