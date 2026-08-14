import Phaser from 'phaser';
import { store } from './store';
import { BACKGROUNDS, SPECIES } from './data';
import type { BackgroundId } from './types';

type FishView = {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Ellipse;
  label: Phaser.GameObjects.Text;
  fishId: string;
  targetX: number;
  targetY: number;
  speed: number;
};

export class AquariumScene extends Phaser.Scene {
  views = new Map<string, FishView>();
  decor = new Map<string, Phaser.GameObjects.Container>();
  tankBackground?: Phaser.GameObjects.Image;
  activeBackground?: BackgroundId;

  constructor() { super('aquarium'); }

  preload() { for(const [id,item] of Object.entries(BACKGROUNDS))this.load.image(`tank-background-${id}`,item.asset); }

  create() {
    this.cameras.main.setBackgroundColor('#073f4b');
    this.makeTextures();
    this.drawTank();
    this.scale.on('resize', () => this.scene.restart());
  }

  makeTextures() {
    if (this.textures.exists('fish')) return;
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffffff).fillEllipse(58, 32, 84, 38).fillTriangle(15, 32, 0, 12, 0, 52).fillCircle(83, 25, 4).generateTexture('fish', 100, 64);
    g.clear().fillStyle(0xffffff).fillCircle(5, 5, 5).generateTexture('bubble', 10, 10);
    g.destroy();
  }

  drawTank() {
    const w = this.scale.width, h = this.scale.height;
    const tank = this.add.image(w / 2, h / 2, `tank-background-${store.state.background}`);
    tank.setScale(Math.max(w / tank.width, h / tank.height)).setDepth(-2);
    this.tankBackground=tank;
    this.activeBackground=store.state.background;
    const bg = this.add.graphics();
    bg.fillStyle(0x8adbe6, .025).fillRect(0, 0, w, h);
    this.add.particles(0, 0, 'bubble', { x: { min: 0, max: w }, y: h * .82, lifespan: { min: 4500, max: 9000 }, speedY: { min: -48, max: -18 }, scale: { start: 1.35, end: .12 }, alpha: { start: .35, end: 0 }, frequency: 420, quantity: 1, blendMode: 'ADD' });
  }

  syncDecorations() {
    const live = new Set(store.state.fish.map(f => f.id));
    for (const [id, view] of this.views) if (!live.has(id)) { view.sprite.destroy(); view.glow.destroy(); view.label.destroy(); this.views.delete(id); }

    /* DOM overlay is the single fish renderer.
    for (const fish of store.state.fish) {
      const spec = SPECIES[fish.species];
      let view = this.views.get(fish.id);
      if (!view) {
        const sprite = this.add.image(0, 0, 'fish').setInteractive({ useHandCursor: true });
        const glow = this.add.ellipse(0, 0, 110, 58, spec.accent, .14);
        const label = this.add.text(0, 39, fish.name, { fontFamily: 'sans-serif', fontSize: '12px', color: '#eaffff', backgroundColor: '#073642aa', padding: { x: 6, y: 3 } }).setOrigin(.5);
        const startX = fish.x * this.scale.width, startY = fish.y * this.scale.height;
        glow.setPosition(startX, startY).setDepth(2);
        sprite.setPosition(startX, startY).setDepth(3);
        label.setPosition(startX, startY + 39).setDepth(4);
        sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          pointer.event.stopPropagation();
          window.dispatchEvent(new CustomEvent('fishselect', { detail: fish.id }));
        });
        view = { sprite, glow, label, fishId: fish.id, targetX: startX, targetY: startY, speed: 16 + Math.random() * 16 };
        this.views.set(fish.id, view);
      }
      const scale = fish.species === 'astral' ? 1.35 : fish.species === 'neon' ? 1.18 : 1;
      view.sprite.setTint(spec.color).setScale(fish.dir * scale, scale);
      view.glow.setFillStyle(spec.accent, fish.species === 'medaka' ? .06 : .22);
      view.label.setText(`${fish.name} - ${spec.name}`);
    } */

    for (const item of store.state.decorations) if (!this.decor.has(item.id)) {
      const c = this.add.container(item.x * this.scale.width, item.y * this.scale.height);
      if (item.type === 'plant') {
        for (let i = 0; i < 5; i++) c.add(this.add.ellipse((i - 2) * 10, 0, 18, 90 - i % 2 * 18, 0x60b87a, .8).setOrigin(.5, 1).setRotation((i - 2) * .12));
      } else if (item.type === 'crystal') c.add(this.add.polygon(0, 0, [0, -65, 24, -8, 13, 0, -13, 0, -24, -8], 0xa770ff, .75));
      else { c.add(this.add.rectangle(0, -25, 80, 55, 0xb7a58c, .85)); c.add(this.add.rectangle(0, -62, 24, 30, 0xd9c7a8, .9)); }
      this.decor.set(item.id, c);
    }
  }

  update(_: number, dt: number) {
    if(this.tankBackground&&this.activeBackground!==store.state.background){this.activeBackground=store.state.background;this.tankBackground.setTexture(`tank-background-${this.activeBackground}`)}
    for (const view of this.views.values()) {
      if (Phaser.Math.Distance.Between(view.sprite.x, view.sprite.y, view.targetX, view.targetY) < 18) {
        view.targetX = Phaser.Math.Between(80, this.scale.width - 80);
        view.targetY = Phaser.Math.Between(100, Math.max(130, this.scale.height * .72));
        const fish = store.state.fish.find(f => f.id === view.fishId);
        if (fish) fish.dir = view.targetX > view.sprite.x ? 1 : -1;
      }
      const angle = Phaser.Math.Angle.Between(view.sprite.x, view.sprite.y, view.targetX, view.targetY);
      const x = view.sprite.x + Math.cos(angle) * view.speed * dt / 1000;
      const y = view.sprite.y + Math.sin(angle) * view.speed * dt / 1000 + Math.sin(this.time.now / 500 + view.sprite.x) * .08;
      view.sprite.setPosition(x, y);
      view.glow.setPosition(x, y);
      view.label.setPosition(x, y + 39);
    }
  }
}
