import {store} from './store';
import type {Decoration} from './types';

const layer=document.querySelector<HTMLDivElement>('#decor-overlay')!;
const backLayer=document.querySelector<HTMLDivElement>('#decor-overlay-back')!;
const assets:Record<Decoration['type'],string>={plant:'/assets/decorations/items/plant-mint.png',coral:'/assets/decorations/items/plant-coral.png',stones:'/assets/decorations/items/stones-jade.png',driftwood:'/assets/decorations/items/driftwood.png',crystal:'/assets/decorations/items/crystal-violet.png',castle:'/assets/decorations/items/stone-arch.png',aerator:'/assets/decorations/items/aerator.png',filter:'/assets/decorations/items/filter-wide.png',light:'/assets/decorations/items/light-bar.png'};
const limits:Record<Decoration['type'],[number,number]>={plant:[.45,2.6],coral:[.45,2.6],stones:[.5,2.8],driftwood:[.5,2.5],crystal:[.55,2.4],castle:[.65,2.4],aerator:[.45,2.8],filter:[.45,2.6],light:[.45,2.8]};
const nodes=new Map<string,HTMLButtonElement>();
let selected:string|null=null,editing=false,dragging:string|null=null;
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const current=()=>store.state.decorations.find(d=>d.id===selected);

const editor=document.createElement('div');
editor.id='decor-editor';
editor.innerHTML=`<div class="decor-toolbar"><span class="decor-title" title="ドラッグして移動">⠿ 位置・サイズを調整</span><div class="decor-toolbar-actions"><button data-act="smaller">− 小さく</button><button data-act="larger">＋ 大きく</button><button data-act="rotate">↻ 回転</button><button data-act="flip">↔ 反転</button><button data-act="back">奥へ</button><button data-act="front">手前へ</button><button data-act="store">収納</button><button data-act="done">完了</button></div></div>`;
document.querySelector('#app')!.append(editor);
const toolbar=editor.querySelector<HTMLDivElement>('.decor-toolbar')!;
const dragHandle=editor.querySelector<HTMLElement>('.decor-title')!;
let toolbarDrag:{pointerId:number;dx:number;dy:number}|null=null;

function position(node:HTMLElement,d:Decoration){node.style.left=`${d.x*100}%`;node.style.top=`${d.y*100}%`;node.style.zIndex=String(10+d.z);node.style.transform=`translate(-50%,-100%) rotate(${d.rotation}deg) scale(${d.flipped?-d.scale:d.scale},${d.scale})`;node.classList.toggle('selected',editing&&d.id===selected);node.hidden=!d.placed}
function announce(){window.dispatchEvent(new CustomEvent('decor-selection',{detail:selected}))}
function render(){const live=new Set(store.state.decorations.map(d=>d.id));for(const[id,node]of nodes)if(!live.has(id)){node.remove();nodes.delete(id)}for(const d of store.state.decorations){let node=nodes.get(d.id);if(!node){node=document.createElement('button');node.className=`tank-decor decor-${d.type}`;node.dataset.id=d.id;node.ariaLabel='装飾を移動';node.innerHTML=`<img src="${assets[d.type]}" draggable="false" alt="">`;node.addEventListener('pointerdown',e=>{if(!editing)return;e.preventDefault();selected=d.id;dragging=d.id;node!.setPointerCapture(e.pointerId);render();announce()});node.addEventListener('pointermove',e=>{if(dragging!==d.id)return;const box=layer.getBoundingClientRect();store.updateDecor(d.id,{x:clamp((e.clientX-box.left)/box.width,.05,.95),y:clamp((e.clientY-box.top)/box.height,.12,.96)})});node.addEventListener('pointerup',()=>dragging=null);node.addEventListener('pointercancel',()=>dragging=null);nodes.set(d.id,node)}const target=d.z<=0?backLayer:layer;if(node.parentElement!==target)target.append(node);position(node,d)}layer.classList.toggle('is-editing',editing);backLayer.classList.toggle('is-editing',editing);editor.classList.toggle('is-editing',editing);toolbar.classList.toggle('has-selection',!!current());editor.querySelector('.decor-title')!.textContent=current()?'位置・サイズを調整':'装飾を選択'}

window.addEventListener('decor-mode',e=>{editing=(e as CustomEvent<boolean>).detail;if(!editing){selected=null;dragging=null}render();announce()});
window.addEventListener('decor-pick',e=>{selected=(e as CustomEvent<string>).detail;editing=true;render();announce()});
window.addEventListener('decor-action',e=>{const action=(e as CustomEvent<string>).detail,d=current();if(!d)return;const[min,max]=limits[d.type];if(action==='smaller')store.updateDecor(d.id,{scale:clamp(d.scale-.1,min,max)});if(action==='larger')store.updateDecor(d.id,{scale:clamp(d.scale+.1,min,max)});if(action==='rotate')store.updateDecor(d.id,{rotation:(d.rotation+15)%360});if(action==='flip')store.updateDecor(d.id,{flipped:!d.flipped});if(action==='back')store.updateDecor(d.id,{z:clamp(d.z-1,-20,20)});if(action==='front')store.updateDecor(d.id,{z:clamp(d.z+1,-20,20)});if(action==='store'){store.storeDecor(d.id);selected=null;announce()}render()});
window.addEventListener('decor-restore',e=>{const id=(e as CustomEvent<string>).detail;store.placeDecor(id);selected=id;editing=true;render();announce()});
toolbar.addEventListener('click',e=>{const action=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-act]')?.dataset.act;if(!action)return;if(action==='done'){editing=false;selected=null;render();announce();window.dispatchEvent(new CustomEvent('decor-editor-done'));return}window.dispatchEvent(new CustomEvent('decor-action',{detail:action}))});
dragHandle.addEventListener('pointerdown',e=>{e.preventDefault();const box=toolbar.getBoundingClientRect();toolbarDrag={pointerId:e.pointerId,dx:e.clientX-box.left,dy:e.clientY-box.top};dragHandle.setPointerCapture(e.pointerId);toolbar.classList.add('dragging')});
dragHandle.addEventListener('pointermove',e=>{if(!toolbarDrag||toolbarDrag.pointerId!==e.pointerId)return;const tank=document.querySelector<HTMLElement>('#camera-stage')!.getBoundingClientRect();const box=toolbar.getBoundingClientRect();const left=clamp(e.clientX-toolbarDrag.dx,tank.left+8,tank.right-box.width-8);const top=clamp(e.clientY-toolbarDrag.dy,tank.top+8,tank.bottom-box.height-8);toolbar.style.left=`${left}px`;toolbar.style.top=`${top}px`;toolbar.style.bottom='auto';toolbar.style.transform='none'});
const finishToolbarDrag=(e:PointerEvent)=>{if(!toolbarDrag||toolbarDrag.pointerId!==e.pointerId)return;toolbarDrag=null;toolbar.classList.remove('dragging')};
dragHandle.addEventListener('pointerup',finishToolbarDrag);dragHandle.addEventListener('pointercancel',finishToolbarDrag);
store.on(render);render();
