import {store} from './store';
import {recordAction} from './progression';

const tank=document.querySelector<HTMLElement>('#camera-stage')!;
const dirt=document.createElement('div');
dirt.id='dirt-overlay';
tank.append(dirt);

function renderDirt(){
  const count=Math.min(6,store.state.cleanSpots);
  dirt.innerHTML=Array.from({length:count},(_,i)=>`<button aria-label="汚れを掃除" style="--x:${10+(i*29)%78}%;--y:${28+(i*19)%51}%;--r:${-18+i*13}deg;--s:${.72+(i%3)*.16}"></button>`).join('');
  dirt.style.setProperty('--murk',String(Math.max(0,(72-store.state.water)/100)));
  dirt.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{if(store.state.cleanSpots){store.clean();recordAction('clean')}}));
}

store.on(renderDirt);
renderDirt();
window.setInterval(()=>store.advanceTime(),30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)store.advanceTime()});
