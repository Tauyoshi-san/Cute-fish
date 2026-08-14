import type {SpeciesId} from './types';
import {assetUrl} from './assetUrl';

export const FISH_ASSETS:Record<SpeciesId,string>={
  medaka:assetUrl('assets/sprites/fish/seeds/medaka-v2.png'),
  sunfin:assetUrl('assets/sprites/fish/seeds/sunfin-v2.png'),
  mossback:assetUrl('assets/sprites/fish/seeds/mossback-v2.png'),
  neon:assetUrl('assets/sprites/fish/seeds/neon-v2.png'),
  solarcrown:assetUrl('assets/sprites/fish/seeds/solarcrown.png'),
  grovewhale:assetUrl('assets/sprites/fish/seeds/grovewhale.png'),
  astral:assetUrl('assets/sprites/fish/seeds/unicornloop.png'),
  saplingback:assetUrl('assets/sprites/fish/seeds/saplingback.png'),
  greattreeleviathan:assetUrl('assets/sprites/fish/seeds/greattreeleviathan.png'),
  stonecalf:assetUrl('assets/sprites/fish/seeds/stonecalf.png'),
  cragwhale:assetUrl('assets/sprites/fish/seeds/cragwhale.png'),
  petalbloom:assetUrl('assets/sprites/fish/seeds/petalbloom.png'),
  floralqueen:assetUrl('assets/sprites/fish/seeds/floralqueen.png')
};

export function fishAsset(species:SpeciesId){return FISH_ASSETS[species]}
