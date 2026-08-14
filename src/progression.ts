import {store} from './store';

export type ProgressAction='feed'|'clean'|'buy';
export type Progress={tutorialDone:boolean;day:string;feed:number;clean:number;buy:number;claimed:boolean};
const KEY='fancy-fish-progress-v1';
const today=()=>new Date().toISOString().slice(0,10);
const fresh=():Progress=>({tutorialDone:false,day:today(),feed:0,clean:0,buy:0,claimed:false});

export function getProgress():Progress{
  let value=fresh();
  try{value={...value,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{/* keep a safe fresh record */}
  if(value.day!==today())value={...fresh(),tutorialDone:value.tutorialDone};
  localStorage.setItem(KEY,JSON.stringify(value));
  return value;
}
function save(value:Progress){localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new Event('progresschange'))}
export function recordAction(action:ProgressAction){const value=getProgress();value[action]++;if(!value.claimed&&value.feed>=3&&value.clean>=1&&value.buy>=1){value.claimed=true;store.grantCoins(80);window.dispatchEvent(new CustomEvent('progressreward',{detail:80}))}save(value)}

function startTutorial(){const value=getProgress();if(value.tutorialDone||document.querySelector('.tutorial'))return;const steps=[['ようこそ、ファンシーフィッシュへ','魚をクリックすると、名前変更やごはんのお世話ができます。'],['右のコンソールを使います','ショップ・図鑑・配置編集は、いつでも右側のボタンから開けます。'],['毎日のお世話でコイン獲得','ごはん3回・掃除1回・買い物1回を達成すると、80コインを受け取れます。']];let index=0;const layer=document.createElement('div');layer.className='tutorial';const draw=()=>{const [title,body]=steps[index];layer.innerHTML=`<section><small>QUICK GUIDE ${index+1} / ${steps.length}</small><h2>${title}</h2><p>${body}</p><div><button data-skip>スキップ</button><button data-next>${index===steps.length-1?'はじめる':'次へ'}</button></div></section>`;layer.querySelector('[data-skip]')?.addEventListener('click',finish);layer.querySelector('[data-next]')?.addEventListener('click',()=>{if(++index<steps.length)draw();else finish()})};function finish(){value.tutorialDone=true;save(value);layer.remove()}document.body.append(layer);draw()}
window.setTimeout(startTutorial,600);
