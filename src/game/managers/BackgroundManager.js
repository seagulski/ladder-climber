import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

export default class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.currentZoneId = null;
    this.lines = [];
    this.nextLineY = 0;
  }

  init(cameraY) {
    this.nextLineY = cameraY + GAME_HEIGHT;
  }

  update(cameraY, zone) {
    // Zone change — update background color
    if (zone.id !== this.currentZoneId) {
      this.currentZoneId = zone.id;
      this.scene.cameras.main.setBackgroundColor(zone.bgColor);
    }

    // Subtle horizontal lines for wall texture
    const spawnThreshold = cameraY - 300;
    while (this.nextLineY > spawnThreshold) {
      this.nextLineY -= 80 + Math.random() * 120;
      const line = this.scene.add.rectangle(
        GAME_WIDTH / 2, this.nextLineY,
        GAME_WIDTH, 1,
        zone.accentColor,
        0.15
      ).setDepth(0);
      this.lines.push(line);
    }

    // Cleanup
    const killY = cameraY + GAME_HEIGHT + 200;
    for (let i = this.lines.length - 1; i >= 0; i--) {
      if (this.lines[i].y > killY) {
        this.lines[i].destroy();
        this.lines.splice(i, 1);
      }
    }
  }
}
