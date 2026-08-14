export type FoodId='plankton'|'berry'|'stardust'|'protein'|'mineral';
export type SpeciesId='medaka'|'sunfin'|'mossback'|'neon'|'solarcrown'|'grovewhale'|'astral';
export type DecorationType='plant'|'coral'|'stones'|'driftwood'|'crystal'|'castle'|'aerator'|'filter'|'light'|'vallisneria'|'basalt'|'graniteLarge'|'slateLarge'|'sandstoneLarge'|'treeBroadleaf'|'treeWeeping'|'plantBroadleafLarge'|'grassMeadowLarge';
export interface Fish{id:string;name:string;species:SpeciesId;x:number;y:number;dir:1|-1;hunger:number;happiness:number;foods:FoodId[];bornAt:number}
export interface Decoration{id:string;type:DecorationType;x:number;y:number;scale:number;rotation:number;flipped:boolean;z:number;placed:boolean}
export interface GameState{schemaVersion:number;coins:number;pearls:number;water:number;cleanSpots:number;fish:Fish[];decorations:Decoration[];inventory:Record<FoodId,number>;discovered:SpeciesId[];lastTick:number}
