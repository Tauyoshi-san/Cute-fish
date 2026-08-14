import Phaser from 'phaser';import './style.css';import {AquariumScene} from './AquariumScene';import './ui';import './fishOverlay';import './decorationOverlay';
new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#073f4b',scale:{mode:Phaser.Scale.RESIZE,width:1280,height:720},render:{antialias:true,pixelArt:false},scene:[AquariumScene],transparent:false});
