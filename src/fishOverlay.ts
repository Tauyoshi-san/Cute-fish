import { store } from './store';
import { SPECIES } from './data';
import { assetUrl } from './assetUrl';

const layer = document.querySelector<HTMLDivElement>('#fish-overlay')!;
const bubbleLayer = document.querySelector<HTMLDivElement>('.fx-bubbles')!;
const app = document.querySelector<HTMLElement>('#app')!;
const cinematic = document.querySelector<HTMLElement>('#evolution-cinematic')!;
type Mode='cruise'|'dash'|'rest'|'explore';
type Motion={el:HTMLButtonElement;fishId:string;species:string;x:number;y:number;tx:number;ty:number;vx:number;vy:number;dir:1|-1;mode:Mode;until:number;phase:number};
const motions=new Map<string,Motion>();
const fishImage=(species:string)=>assetUrl(`assets/sprites/fish/seeds/${species}.png`);

function nextTarget(m:Motion,now:number){const roll=Math.random();m.mode=roll<.14?'dash':roll<.32?'rest':roll<.52?'explore':'cruise';m.until=now+(m.mode==='dash'?900:m.mode==='rest'?1600+Math.random()*2200:2600+Math.random()*4500);if(m.mode==='rest'){m.tx=m.x;m.ty=m.y;return}m.tx=10+Math.random()*76;m.ty=m.mode==='explore'?22+Math.random()*52:26+Math.random()*42;m.dir=m.tx>=m.x?1:-1}

function createFish(fishId:string){const fish=store.state.fish.find(f=>f.id===fishId);if(!fish)return;const spec=SPECIES[fish.species];const el=document.createElement('button');el.className='swimmer';el.dataset.fishId=fish.id;el.setAttribute('aria-label',`${fish.name} ${spec.name}`);el.innerHTML=`<span class="fish-motion"><img src="${fishImage(fish.species)}" alt=""></span><span class="fish-name">${fish.name} - ${spec.name}</span>`;el.onclick=()=>window.dispatchEvent(new CustomEvent('fishselect',{detail:fish.id}));layer.append(el);const m:Motion={el,fishId:fish.id,species:fish.species,x:fish.x*100,y:fish.y*100,tx:fish.x*100,ty:fish.y*100,vx:0,vy:0,dir:fish.dir,mode:'cruise',until:0,phase:Math.random()*Math.PI*2};nextTarget(m,performance.now());motions.set(fish.id,m)}

let evolutionBusy=false;
async function playEvolution(m:Motion,newSpecies:string,fishName:string){if(evolutionBusy){m.species=newSpecies;m.el.querySelector<HTMLImageElement>('img')!.src=fishImage(newSpecies);return}evolutionBusy=true;m.mode='rest';m.until=performance.now()+4000;app.style.setProperty('--focus-x',`${m.x}%`);app.style.setProperty('--focus-y',`${m.y}%`);cinematic.style.setProperty('--evo-x',`${m.x}%`);cinematic.style.setProperty('--evo-y',`${m.y}%`);cinematic.querySelector('p')!.textContent=`${fishName} 進化の予感…`;app.classList.add('evolution-focus');await new Promise(r=>setTimeout(r,1150));m.species=newSpecies;m.el.querySelector<HTMLImageElement>('img')!.src=fishImage(newSpecies);m.el.classList.add('evolving');cinematic.querySelector('p')!.textContent=`${SPECIES[newSpecies as keyof typeof SPECIES].name} に進化！`;app.classList.add('evolution-reveal');await new Promise(r=>setTimeout(r,950));app.classList.remove('evolution-focus','evolution-reveal');m.el.classList.remove('evolving');await new Promise(r=>setTimeout(r,450));evolutionBusy=false}
function reconcileFish(){const live=new Set(store.state.fish.map(f=>f.id));for(const[id,m]of motions)if(!live.has(id)){m.el.remove();motions.delete(id)}for(const fish of store.state.fish){let m=motions.get(fish.id);if(!m){createFish(fish.id);continue}const spec=SPECIES[fish.species];if(m.species!==fish.species&&!m.el.classList.contains('evolving'))void playEvolution(m,fish.species,fish.name);m.el.querySelector<HTMLElement>('.fish-name')!.textContent=`${fish.name} - ${spec.name}`;m.el.setAttribute('aria-label',`${fish.name} ${spec.name}`)}}

let last=performance.now();function animate(now:number){const dt=Math.min(34,now-last)/1000;last=now;for(const m of motions.values()){if(now>m.until||Math.hypot(m.tx-m.x,m.ty-m.y)<2)nextTarget(m,now);const dx=m.tx-m.x,dy=m.ty-m.y,dist=Math.max(1,Math.hypot(dx,dy));const speed=m.mode==='dash'?18:m.mode==='rest'?0:m.mode==='explore'?5.5:3.6;m.vx+=(dx/dist*speed-m.vx)*Math.min(1,dt*2.5);m.vy+=(dy/dist*speed-m.vy)*Math.min(1,dt*2.5);m.x=Math.max(7,Math.min(86,m.x+m.vx*dt));m.y=Math.max(18,Math.min(72,m.y+m.vy*dt));if(Math.abs(m.vx)>.3)m.dir=m.vx>0?1:-1;const bob=Math.sin(now/520+m.phase)*(m.mode==='rest'?.55:.28);const angle=Math.max(-8,Math.min(8,m.vy*1.1));m.el.style.transform=`translate3d(${m.x}vw,calc(${m.y}vh + ${bob}vh),0) rotate(${angle}deg)`;m.el.dataset.mode=m.mode;m.el.style.setProperty('--dir',String(m.dir));m.el.style.setProperty('--tail-speed',m.mode==='dash'?'.22s':m.mode==='rest'?'1.15s':'.55s')}requestAnimationFrame(animate)}

function buildBubbles(){bubbleLayer.innerHTML='';for(let i=0;i<42;i++){const b=document.createElement('i');const size=12+Math.random()*30;b.style.cssText=`--x:${3+Math.random()*94}%;--size:${size}px;--duration:${4+Math.random()*7}s;--delay:${-Math.random()*12}s;--drift:${-38+Math.random()*76}px`;bubbleLayer.append(b)}}

store.on(reconcileFish);reconcileFish();buildBubbles();requestAnimationFrame(animate);
