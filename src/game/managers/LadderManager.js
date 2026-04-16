import {
  LANES,
  LANE_COUNT,
  LADDER_SEGMENT_HEIGHT,
  LADDER_WIDTH,
  LADDER_SPAWN_AHEAD,
  LADDER_CLEANUP_BELOW,
  GAME_HEIGHT
} from "../constants.js";

// Ladder colors per zone
const ZONE_LADDER_COLORS = {
  basement:    { rail: 0x3a3540, rung: 0x555060, highlight: 0x666172 },
  cubicle:     { rail: 0x404555, rung: 0x5a6070, highlight: 0x6a7080 },
  lower_mgmt:  { rail: 0x454060, rung: 0x605878, highlight: 0x706888 },
  middle_mgmt: { rail: 0x504568, rung: 0x6a5e80, highlight: 0x7a6e90 },
  upper_mgmt:  { rail: 0x484060, rung: 0x605575, highlight: 0x706585 },
  executive:   { rail: 0x353050, rung: 0x504570, highlight: 0x605580 },
  void:        { rail: 0x2a2540, rung: 0x403860, highlight: 0x504870 },
  default:     { rail: 0x3a3540, rung: 0x555060, highlight: 0x666172 }
};

export default class LadderManager {
  constructor(scene) {
    this.scene = scene;
    this.segments = [];
    this.highestY = 0;
    this.zoneId = "basement";
  }

  setZone(zoneId) {
    this.zoneId = zoneId;
  }

  createInitial(cameraY) {
    const bottomY = cameraY + GAME_HEIGHT + 100;
    const topY = cameraY - LADDER_SPAWN_AHEAD;

    for (let y = bottomY; y > topY; y -= LADDER_SEGMENT_HEIGHT) {
      this.spawnRow(y);
    }
    this.highestY = topY;
  }

  spawnRow(y) {
    for (let i = 0; i < LANE_COUNT; i++) {
      const seg = this.createSegment(LANES[i], y);
      this.segments.push(seg);
    }
  }

  createSegment(x, y) {
    const colors = ZONE_LADDER_COLORS[this.zoneId] || ZONE_LADDER_COLORS.default;
    const g = this.scene.add.graphics().setDepth(1);

    // Vertical rails
    g.fillStyle(colors.rail, 1);
    g.fillRect(x - LADDER_WIDTH / 2, y - LADDER_SEGMENT_HEIGHT, 3, LADDER_SEGMENT_HEIGHT);
    g.fillRect(x + LADDER_WIDTH / 2 - 3, y - LADDER_SEGMENT_HEIGHT, 3, LADDER_SEGMENT_HEIGHT);

    // Rung
    g.fillStyle(colors.rung, 1);
    g.fillRect(x - LADDER_WIDTH / 2, y - 4, LADDER_WIDTH, 6);

    // Rung highlight (top edge)
    g.fillStyle(colors.highlight, 0.5);
    g.fillRect(x - LADDER_WIDTH / 2 + 1, y - 4, LADDER_WIDTH - 2, 1);

    // Store data for cleanup
    g.setDataEnabled();
    g.setData("y", y);

    return g;
  }

  update(cameraY) {
    const spawnThreshold = cameraY - LADDER_SPAWN_AHEAD;
    while (this.highestY > spawnThreshold) {
      this.highestY -= LADDER_SEGMENT_HEIGHT;
      this.spawnRow(this.highestY);
    }

    const killY = cameraY + GAME_HEIGHT + LADDER_CLEANUP_BELOW;
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
      if (seg.getData("y") > killY) {
        seg.destroy();
        this.segments.splice(i, 1);
      }
    }
  }
}
