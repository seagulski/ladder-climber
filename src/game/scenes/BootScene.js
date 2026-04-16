import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // No external assets yet — we use placeholder rectangles
    // This scene exists for future asset loading
  }

  create() {
    this.scene.start("TitleScene");
  }
}
