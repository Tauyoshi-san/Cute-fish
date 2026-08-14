import {store} from './store';

export type ProgressAction='feed'|'clean'|'buy';
type MissionId='feed_once'|'feed_three'|'clean_once'|'shop_once'|'care_combo';
export type Progress={tutorialDone:boolean;missionId:MissionId;feed:number;clean:number;buy:number;completed:number};
export type Mission={id:MissionId;title:string;description:string;reward:number;target:Partial<Record<ProgressAction,number>>};
const KEY='fancy-fish-progress-v2';
export const MISSIONS:Mission[]=[
  {id:'feed_once',title:'ごはんの時間',description:'魚にごはんを1回あげよう',reward:15,target:{feed:1}},
  {id:'feed_three',title:'もぐもぐタイム',description:'魚にごはんを3回あげよう',reward:35,target:{feed:3}},
  {id:'clean_once',title:'水槽をピカピカに',description:'水槽の汚れを1つ掃除しよう',reward:25,target:{clean:1}},
  {id:'shop_once',title:'水辺のお買い物',description:'ショップで商品を1つ買おう',reward:20,target:{buy:1}},
  {id:'care_combo',title:'しっかりお世話',description:'ごはんを2回あげて、汚れを1つ掃除しよう',reward:50,target:{feed:2,clean:1}}
];
const randomMission=(except?:MissionId)=>{const choices=MISSIONS.filter(m=>m.id!==except);return choices[Math.floor(Math.random()*choices.length)].id};
const fresh=(tutorialDone=false,except?:MissionId):Progress=>({tutorialDone,missionId:randomMission(except),feed:0,clean:0,buy:0,completed:0});
const validMission=(id:unknown):id is MissionId=>MISSIONS.some(m=>m.id===id);

export function getProgress():Progress{
  let raw:Partial<Progress>={};
  try{raw=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('fancy-fish-progress-v1')||'{}')}catch{/* use defaults */}
  const value:Progress={...fresh(Boolean(raw.tutorialDone)),...raw,missionId:validMission(raw.missionId)?raw.missionId:randomMission(),feed:Math.max(0,Number(raw.feed)||0),clean:Math.max(0,Number(raw.clean)||0),buy:Math.max(0,Number(raw.buy)||0),completed:Math.max(0,Number(raw.completed)||0)};
  localStorage.setItem(KEY,JSON.stringify(value));
  return value;
}
export function getMission(progress=getProgress()){return MISSIONS.find(m=>m.id===progress.missionId)!}
function save(value:Progress){localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new Event('progresschange'))}
const achieved=(progress:Progress,mission:Mission)=>Object.entries(mission.target).every(([key,target])=>progress[key as ProgressAction]>=(target||0));
export function recordAction(action:ProgressAction){const value=getProgress(),mission=getMission(value);value[action]++;if(!achieved(value,mission)){save(value);window.dispatchEvent(new Event('missionprogress'));return}const reward=mission.reward;value.completed++;const previous=value.missionId;Object.assign(value,fresh(value.tutorialDone,previous),{completed:value.completed});save(value);store.grantCoins(reward);window.dispatchEvent(new CustomEvent('progressreward',{detail:{reward,title:mission.title}}))}

function startTutorial(){const value=getProgress();if(value.tutorialDone||document.querySelector('.tutorial'))return;const steps=[['ようこそ、ファンシーフィッシュへ','魚をクリックすると、名前変更やごはんのお世話ができます。'],['右のコンソールを使います','ショップ・図鑑・配置編集は、いつでも右側のボタンから開けます。'],['ミッションでコイン獲得','表示されたミッションを達成すると報酬を獲得し、次のミッションへ進みます。']];let index=0;const layer=document.createElement('div');layer.className='tutorial';const draw=()=>{const [title,body]=steps[index];layer.innerHTML=`<section><small>QUICK GUIDE ${index+1} / ${steps.length}</small><h2>${title}</h2><p>${body}</p><div><button data-skip>スキップ</button><button data-next>${index===steps.length-1?'はじめる':'次へ'}</button></div></section>`;layer.querySelector('[data-skip]')?.addEventListener('click',finish);layer.querySelector('[data-next]')?.addEventListener('click',()=>{if(++index<steps.length)draw();else finish()})};function finish(){value.tutorialDone=true;save(value);layer.remove()}document.body.append(layer);draw()}
window.setTimeout(startTutorial,600);
