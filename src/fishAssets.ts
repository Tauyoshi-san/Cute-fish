import type {SpeciesId} from './types';

export const FISH_ASSETS:Record<SpeciesId,string>={
  medaka:'/assets/sprites/fish/seeds/medaka-v2.png',
  sunfin:'/assets/sprites/fish/seeds/sunfin-v2.png',
  mossback:'/assets/sprites/fish/seeds/mossback-v2.png',
  neon:'/assets/sprites/fish/seeds/neon-v2.png',
  astral:'/assets/sprites/fish/seeds/astral-v2.png'
};

export function fishAsset(species:SpeciesId){return FISH_ASSETS[species]}
