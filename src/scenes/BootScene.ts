import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 如果需要加载 SVG，可在此处
  }

  create() {
    this.scene.start('GameScene');
  }
}
