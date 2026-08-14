import type {FoodId,SpeciesId} from './types';

export const FOODS:Record<FoodId,{name:string;icon:string;color:number;cost:number;desc:string}>={
  plankton:{name:'みどりのプランクトン',icon:'✦',color:0x9de36f,cost:8,desc:'自然派。コケ系の進化に。'},
  berry:{name:'サンベリー',icon:'●',color:0xff806e,cost:14,desc:'元気いっぱい。暖色の進化に。'},
  stardust:{name:'星くずフード',icon:'★',color:0xe9d8ff,cost:30,desc:'珍しい魚を育む特別食。'}
};

export const SPECIES:Record<SpeciesId,{name:string;value:number;color:number;accent:number;hint:string}>={
  medaka:{name:'はじまりメダカ',value:35,color:0xf4d79b,accent:0x74d5bd,hint:'いろいろなごはんを試してみよう'},
  sunfin:{name:'ヒレアカリ',value:95,color:0xffa047,accent:0x78d2b5,hint:'サンベリーを好むようだ'},
  mossback:{name:'モスノセ',value:110,color:0x92d3ae,accent:0xd5cf68,hint:'植物の多い水槽で発見'},
  neon:{name:'ネオンリボン',value:260,color:0x35bde0,accent:0xff796c,hint:'3種のごはんと結晶が鍵'},
  astral:{name:'アストラル・ループフィン',value:700,color:0xf4e8c7,accent:0xb7a4d8,hint:'伝説。星くずと最高の環境を'}
};

export const SHOP=[
  {type:'plant' as const,name:'ミント水草',icon:'🌿',cost:45,desc:'水質と自然進化を助ける'},
  {type:'coral' as const,name:'コーラル水草',icon:'🌱',cost:55,desc:'水槽にやさしい彩りを加える'},
  {type:'stones' as const,name:'翡翠の小石',icon:'●',cost:35,desc:'底砂に自然なアクセントを作る'},
  {type:'driftwood' as const,name:'小さな流木',icon:'⌁',cost:70,desc:'魚が落ち着ける場所になる'},
  {type:'crystal' as const,name:'ルミナ結晶',icon:'♦',cost:90,desc:'幻想進化を引き寄せる'},
  {type:'castle' as const,name:'石のアーチ',icon:'▱',cost:130,desc:'魚の幸福度を高める'},
  {type:'aerator' as const,name:'川石セット',icon:'🪨',cost:110,desc:'自然な色合いの丸い川石'},
  {type:'filter' as const,name:'アヌビアス',icon:'🌿',cost:180,desc:'岩に根づいた丈夫な広葉水草'},
  {type:'light' as const,name:'水草マット',icon:'🌱',cost:160,desc:'底床に広がる背の低い水草'},
  {type:'vallisneria' as const,name:'テープ水草',icon:'🌿',cost:85,desc:'魚が隠れられる背の高い自然水草'},
  {type:'basalt' as const,name:'玄武岩セット',icon:'🪨',cost:75,desc:'水槽を引き締める自然な黒い丸石'}
];
