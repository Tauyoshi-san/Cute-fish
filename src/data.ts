import type {FoodId,SpeciesId} from './types';

export const FOODS:Record<FoodId,{name:string;icon:string;color:number;cost:number;desc:string}>={
  plankton:{name:'みどりのプランクトン',icon:'✦',color:0x9de36f,cost:8,desc:'自然派。コケ系の進化に。'},
  berry:{name:'サンベリー',icon:'●',color:0xff806e,cost:14,desc:'元気いっぱい。暖色の進化に。'},
  stardust:{name:'星くずフード',icon:'★',color:0xe9d8ff,cost:30,desc:'珍しい魚を育む特別食。'},
  protein:{name:'たんぱくキューブ',icon:'◆',color:0xffb45f,cost:22,desc:'力強いヒレの成長を助けるごはん。'},
  mineral:{name:'ミネラルゼリー',icon:'●',color:0x70d9dc,cost:26,desc:'大きな体と自然系の進化を育むゼリー。'}
};

export const SPECIES:Record<SpeciesId,{name:string;value:number;color:number;accent:number;hint:string;discoveryHint:string;stage:1|2|3}>={
  medaka:{name:'はじまりメダカ',value:35,color:0xf4d79b,accent:0x74d5bd,hint:'いろいろなごはんを試してみよう',discoveryHint:'ショップで稚魚を迎えてみよう',stage:1},
  sunfin:{name:'ヒレアカリ',value:95,color:0xffa047,accent:0x78d2b5,hint:'たんぱくキューブでさらに大きなヒレへ',discoveryHint:'暖色の実を何度か食べさせてみよう',stage:2},
  mossback:{name:'モスノセ',value:110,color:0x92d3ae,accent:0xd5cf68,hint:'ミネラルゼリーと水草でさらに大きく',discoveryHint:'緑のごはんと水草の多い環境が鍵',stage:2},
  neon:{name:'ネオンリボン',value:260,color:0x35bde0,accent:0xff796c,hint:'星くずと最高の水質で伝説の姿へ',discoveryHint:'3種類のごはんと輝く結晶を試そう',stage:2},
  solarcrown:{name:'サン・クラウンフィン',value:480,color:0xffa53f,accent:0x63d6ae,hint:'たんぱくキューブで育った第3段階',discoveryHint:'暖色の第2段階に力強いごはんを重ねよう',stage:3},
  grovewhale:{name:'花森のグロウフィン',value:520,color:0x76c99a,accent:0xf4c8d7,hint:'植物とミネラルに育まれた第3段階',discoveryHint:'植物系の第2段階にミネラルと水草を',stage:3},
  astral:{name:'ユニコーン・ループフィン',value:700,color:0xf4e8c7,accent:0xb7a4d8,hint:'星くずから生まれる伝説の第3段階',discoveryHint:'リボンの魚に星くずと最高の水質を',stage:3}
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
  {type:'basalt' as const,name:'玄武岩セット',icon:'🪨',cost:75,desc:'水槽を引き締める自然な黒い丸石'},
  {type:'graniteLarge' as const,name:'大きな花崗岩',icon:'🪨',cost:145,desc:'明るい色の巨大な丸岩'},
  {type:'slateLarge' as const,name:'大きな積層岩',icon:'🪨',cost:155,desc:'縦に重なる青灰色の大岩'},
  {type:'sandstoneLarge' as const,name:'大きな砂岩アーチ',icon:'🪨',cost:165,desc:'魚がくぐれる横長の自然岩'},
  {type:'treeBroadleaf' as const,name:'大きな水中広葉樹',icon:'🌳',cost:220,desc:'丸い樹冠を持つ立派な樹木'},
  {type:'treeWeeping' as const,name:'大きな枝垂れ樹',icon:'🌳',cost:235,desc:'細い葉が水中に揺れる樹木'},
  {type:'plantBroadleafLarge' as const,name:'大きな広葉水草',icon:'🌿',cost:135,desc:'前景を豊かにする幅広い水草'},
  {type:'grassMeadowLarge' as const,name:'大きな水草原',icon:'🌾',cost:145,desc:'背景を覆う背の高い草むら'}
];
