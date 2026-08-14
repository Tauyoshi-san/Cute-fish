import type {FoodId,SpeciesId} from './types';
export const FOODS:Record<FoodId,{name:string;icon:string;color:number;cost:number;desc:string}>={plankton:{name:'みどりのプランクトン',icon:'✦',color:0x9de36f,cost:8,desc:'自然派。コケ系の進化に。'},berry:{name:'サンベリー',icon:'●',color:0xff806e,cost:14,desc:'元気いっぱい。暖色の進化に。'},stardust:{name:'星くずフード',icon:'★',color:0xe9d8ff,cost:30,desc:'珍しい光を宿す特別食。'}};
export const SPECIES:Record<SpeciesId,{name:string;value:number;color:number;accent:number;hint:string}>={medaka:{name:'はじまりメダカ',value:35,color:0xe7d9aa,accent:0xf4a261,hint:'いろいろな餌を試してみよう'},sunfin:{name:'ヒレアカリ',value:95,color:0xffa45b,accent:0xffe28a,hint:'サンベリーを好むようだ'},mossback:{name:'モスノセ',value:110,color:0x77bd7b,accent:0xd4ed8b,hint:'植物の多い水槽で発見'},neon:{name:'ゲーミングメダカ',value:260,color:0x55e7ff,accent:0xff64df,hint:'3種の餌と結晶が鍵'},astral:{name:'アストラル・ユニコ',value:700,color:0xf8edf9,accent:0xc898ff,hint:'伝説。星くずと最高の環境を'}};
export const SHOP=[
 {type:'plant' as const,name:'ミント水草',icon:'🌿',cost:45,desc:'水質と自然進化を助ける'},
 {type:'coral' as const,name:'コーラル水草',icon:'🌱',cost:55,desc:'水槽にやさしい彩りを加える'},
 {type:'stones' as const,name:'翡翠の小石',icon:'●',cost:35,desc:'底砂に自然なアクセントを作る'},
 {type:'driftwood' as const,name:'小さな流木',icon:'⌁',cost:70,desc:'魚が落ち着く隠れ場所になる'},
 {type:'crystal' as const,name:'ルミナ結晶',icon:'♦',cost:90,desc:'幻想進化を引き寄せる'},
 {type:'castle' as const,name:'石のアーチ',icon:'▱',cost:130,desc:'魚の幸福度を高める'},
 {type:'aerator' as const,name:'エアレーター',icon:'◌',cost:110,desc:'泡で水槽に動きを加える'},
 {type:'filter' as const,name:'ワイドフィルター',icon:'▤',cost:180,desc:'右奥にも置ける大型ろ過装置'},
 {type:'light' as const,name:'水槽ライト',icon:'━',cost:160,desc:'水槽上部を明るく照らす'}
];
