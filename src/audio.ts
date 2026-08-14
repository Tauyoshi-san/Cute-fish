const storageKey='fancy-fish-audio-v1';
type AudioSettings={muted:boolean;volume:number;sfxVolume:number};
const defaults:AudioSettings={muted:false,volume:.32,sfxVolume:.55};
function loadSettings():AudioSettings{try{return{...defaults,...JSON.parse(localStorage.getItem(storageKey)||'null')}}catch{return defaults}}

const settings=loadSettings();
const bgm=new Audio('/assets/sound/spo_ge_suityu02.mp3');
bgm.loop=true;
bgm.volume=settings.volume;
bgm.muted=settings.muted;
bgm.preload='auto';
let started=false;

function save(){localStorage.setItem(storageKey,JSON.stringify(settings));window.dispatchEvent(new CustomEvent('audiochange',{detail:getAudioSettings()}))}
export function getAudioSettings(){return{...settings,playing:started&&!bgm.paused}}
export async function setMuted(muted:boolean){settings.muted=muted;bgm.muted=muted;save();if(!muted)await startBgm()}
export function setVolume(volume:number){settings.volume=Math.max(0,Math.min(1,volume));bgm.volume=settings.volume;if(settings.volume>0&&settings.muted){settings.muted=false;bgm.muted=false}save();if(!settings.muted)void startBgm()}
export function setSfxVolume(volume:number){settings.sfxVolume=Math.max(0,Math.min(1,volume));save()}

type Sfx='tap'|'feed'|'buy'|'clean'|'reward'|'evolve'|'place'|'feedToss'|'eatMunch'|'buySuccess'|'fail'|'cleanSwish'|'missionStep'|'missionComplete'|'fishArrive'|'evolveStart'|'evolveComplete';
let audioContext:AudioContext|undefined;
const sampleUrls:Partial<Record<Sfx,string>>={feedToss:'/assets/sound/sfx/feed-toss.wav',eatMunch:'/assets/sound/sfx/eat-munch.wav',buySuccess:'/assets/sound/sfx/buy-success.wav',fail:'/assets/sound/sfx/action-fail.wav',cleanSwish:'/assets/sound/sfx/clean-swish.wav',missionStep:'/assets/sound/sfx/mission-step.wav',missionComplete:'/assets/sound/sfx/mission-complete.wav',fishArrive:'/assets/sound/sfx/fish-arrive.wav',evolveStart:'/assets/sound/sfx/evolve-start.wav',evolveComplete:'/assets/sound/sfx/evolve-complete.wav'};
const sampleBases=new Map(Object.entries(sampleUrls).map(([kind,url])=>{const audio=new Audio(url);audio.preload='auto';return[kind,audio]}));
export async function playSfx(kind:Sfx){if(settings.sfxVolume<=0)return;const base=sampleBases.get(kind);if(base){const sample=base.cloneNode() as HTMLAudioElement;sample.volume=Math.min(1,settings.sfxVolume*.9);try{await sample.play()}catch{/* next user gesture will allow audio */}return}audioContext??=new AudioContext();const ctx=audioContext;if(ctx.state==='suspended')await ctx.resume();const now=ctx.currentTime,gain=ctx.createGain(),osc=ctx.createOscillator();const tones:Record<'tap'|'feed'|'buy'|'clean'|'reward'|'evolve'|'place',[number,number,OscillatorType,number]>={tap:[520,660,'sine',.09],feed:[420,820,'sine',.18],buy:[620,1040,'triangle',.2],clean:[760,1380,'sine',.25],reward:[560,1320,'triangle',.32],evolve:[320,1520,'sine',.55],place:[240,440,'triangle',.14]};const[start,end,type,duration]=tones[kind as keyof typeof tones];osc.type=type;osc.frequency.setValueAtTime(start,now);osc.frequency.exponentialRampToValueAtTime(end,now+duration);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.002,settings.sfxVolume*.28),now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+duration+.02)}

async function startBgm(){if(settings.muted)return;if(started&&!bgm.paused)return;try{await bgm.play();started=true;removeUnlockListeners();window.dispatchEvent(new CustomEvent('audiochange',{detail:getAudioSettings()}))}catch{/* First user gesture will unlock playback. */}}
function removeUnlockListeners(){window.removeEventListener('pointerdown',startBgm);window.removeEventListener('keydown',startBgm);window.removeEventListener('touchstart',startBgm)}
window.addEventListener('pointerdown',startBgm,{passive:true});window.addEventListener('keydown',startBgm);window.addEventListener('touchstart',startBgm,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){bgm.pause();return}if(started)void startBgm()});
void startBgm();

document.addEventListener('pointerdown',event=>{const el=(event.target as HTMLElement).closest<HTMLButtonElement>('button');if(!el||el.disabled)return;if(el.matches('[data-ad],.ad button'))void playSfx('reward');else if(el.matches('[data-decoract],[data-act],[data-pickdecor],[data-restoredecor]'))void playSfx('place');else if(!el.matches('[data-food],[data-buyfood],[data-decor],[data-fish],[data-clean]'))void playSfx('tap')});
