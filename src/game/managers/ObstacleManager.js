import { PATTERNS, ZONE_HAZARD_POOLS } from "../data/patterns.js";
import { LANES, LANE_COUNT, GAME_HEIGHT } from "../constants.js";

// --- 30 hazard variants across 7 behavior families ---
const HAZARD_CONFIGS = {
  // === STATIC BLOCKERS (sit on a lane, must dodge) ===
  meeting_block: { width: 40, height: 24, color: 0xff4444, label: "MTG", behavior: "static" },
  recurring_sync: { width: 40, height: 24, color: 0xee3333, label: "SYNC", behavior: "static" },
  agenda_free: { width: 38, height: 22, color: 0xdd4444, label: "???", behavior: "static" },
  calendar_conflict: { width: 42, height: 24, color: 0xcc3344, label: "CAL!", behavior: "static" },
  approval_bottleneck: { width: 44, height: 26, color: 0xbb4433, label: "WAIT", behavior: "static" },
  performance_review: { width: 42, height: 24, color: 0xcc2244, label: "REVW", behavior: "static" },

  // === MOVING HAZARDS (drift downward, read trajectory) ===
  slack_storm: { width: 32, height: 32, color: 0x7b68ee, label: "SLAK", behavior: "moving", velocityY: 12 },
  reply_all: { width: 28, height: 28, color: 0xff8844, label: "RE:", behavior: "moving", velocityY: 8 },
  notification_burst: { width: 26, height: 26, color: 0x8877ee, label: "PING", behavior: "moving", velocityY: 14 },
  email_chain: { width: 30, height: 28, color: 0xee7733, label: "FWD:", behavior: "moving", velocityY: 10 },
  urgent_request: { width: 28, height: 28, color: 0xff5555, label: "ASAP", behavior: "moving", velocityY: 16 },
  late_night_ping: { width: 24, height: 24, color: 0x6655cc, label: "11PM", behavior: "moving", velocityY: 11 },

  // === GLASS CEILINGS (signature lane-forcing barrier) ===
  glass_ceiling: { width: 56, height: 10, color: 0x88ccff, label: "", behavior: "static", alpha: 0.7 },
  invisible_barrier: { width: 56, height: 8, color: 0x6699cc, label: "", behavior: "static", alpha: 0.4 },
  promotion_freeze: { width: 56, height: 12, color: 0x99bbdd, label: "FRZN", behavior: "static", alpha: 0.6 },

  // === SOFT BLOCKERS (weaker, less threatening) ===
  buzzword_cloud: { width: 36, height: 20, color: 0x55aa77, label: "BUZZ", behavior: "static" },
  corporate_jargon: { width: 38, height: 20, color: 0x44bb66, label: "JRGN", behavior: "static" },
  synergy_vortex: { width: 34, height: 22, color: 0x55cc88, label: "SNRG", behavior: "static" },
  innovation_theater: { width: 40, height: 20, color: 0x44aa77, label: "INNV", behavior: "static" },
  values_poster: { width: 36, height: 18, color: 0x66bb88, label: "VALS", behavior: "static" },

  // === WIDE BARRIERS (span two lanes) ===
  budget_cut: { width: 80, height: 14, color: 0xcc3333, label: "BUDGET CUT", behavior: "wide" },
  layoff_wave: { width: 80, height: 16, color: 0xdd2222, label: "LAYOFFS", behavior: "wide" },
  hiring_freeze: { width: 80, height: 14, color: 0xbb4444, label: "FREEZE", behavior: "wide" },

  // === DELAYED TRIGGERS (telegraph then solidify) ===
  reorg_wave: { width: 44, height: 22, color: 0xdd44aa, label: "REORG", behavior: "delayed", delay: 1200 },
  executive_veto: { width: 48, height: 18, color: 0xaa22cc, label: "VETO", behavior: "delayed", delay: 800 },
  strategic_reset: { width: 46, height: 20, color: 0xcc33bb, label: "RESET", behavior: "delayed", delay: 1000 },
  priority_shift: { width: 42, height: 20, color: 0xbb44aa, label: "SHIFT", behavior: "delayed", delay: 900 },
  scope_creep: { width: 44, height: 22, color: 0xaa3399, label: "SCOPE", behavior: "delayed", delay: 1100 }
};

// --- 20 powerup types across 4 tiers ---
const POWERUP_CONFIGS = {
  // Common — Movement/Survival (spawn frequently)
  coffee: { width: 16, height: 20, color: 0xffaa00, label: "☕", effect: "speed", tier: 1 },
  double_espresso: { width: 16, height: 20, color: 0xff8800, label: "☕☕", effect: "speed_strong", tier: 1 },
  energy_drink: { width: 14, height: 20, color: 0x44ff44, label: "⚡", effect: "speed", tier: 1 },
  standing_desk: { width: 18, height: 16, color: 0x88cc66, label: "🪑", effect: "speed", tier: 1 },
  stretch_break: { width: 16, height: 16, color: 0x66ddaa, label: "🧘", effect: "speed", tier: 1 },

  // Uncommon — Defensive (spawn less often)
  headphones: { width: 18, height: 16, color: 0x44ccff, label: "🎧", effect: "shield", tier: 2 },
  focus_block: { width: 20, height: 18, color: 0x44ff88, label: "📅", effect: "clear_lane", tier: 2 },
  slack_mute: { width: 16, height: 16, color: 0x6688cc, label: "🔇", effect: "shield", tier: 2 },
  ooo_reply: { width: 18, height: 16, color: 0x88aadd, label: "✈️", effect: "shield", tier: 2 },
  email_filter: { width: 16, height: 16, color: 0x77bbcc, label: "📧", effect: "shield", tier: 2 },
  calendar_shield: { width: 18, height: 18, color: 0x55cc99, label: "🛡️", effect: "shield", tier: 2 },
  scope_lock: { width: 16, height: 16, color: 0x99aa55, label: "🔒", effect: "clear_lane", tier: 2 },

  // Rare — Career/Score boosts
  promotion_letter: { width: 16, height: 20, color: 0xffdd44, label: "📜", effect: "promote", tier: 3 },
  mentor_guidance: { width: 18, height: 18, color: 0xddaa44, label: "🧑‍🏫", effect: "promote", tier: 3 },
  performance_bonus: { width: 16, height: 16, color: 0xffcc00, label: "💰", effect: "score_boost", tier: 3 },
  recognition_award: { width: 18, height: 18, color: 0xffaa33, label: "🏆", effect: "score_boost", tier: 3 },
  visibility_multiplier: { width: 16, height: 16, color: 0xffee44, label: "👁️", effect: "vis_boost", tier: 3 },

  // Legendary — Game-changing (very rare)
  pto_shield: { width: 18, height: 18, color: 0x66ddff, label: "🏖️", effect: "invuln", tier: 4 },
  exit_package: { width: 20, height: 18, color: 0xff66aa, label: "📦", effect: "extra_life", tier: 4 },
  sabbatical: { width: 20, height: 20, color: 0xaa88ff, label: "🌴", effect: "invuln_long", tier: 4 }
};

export default class ObstacleManager {
  constructor(scene, difficultyManager) {
    this.scene = scene;
    this.difficulty = difficultyManager;
    this.hazards = [];
    this.powerups = [];
    this.nextSpawnY = 0;
    this.initialized = false;
    this.lastPatternId = null;
    this.recentPatternIds = [];

    // World events
    this.activeEvent = null;
    this.eventEndTime = 0;
    this.nextEventCheck = 15000;
  }

  update(cameraY, floorData, time) {
    const config = this.difficulty.getConfig(time);

    if (!this.initialized) {
      this.nextSpawnY = cameraY;
      this.initialized = true;
    }

    // World events
    this.updateEvents(time, config);

    // Spawn interval from difficulty
    const interval = Math.max(120, config.spawnInterval - floorData.hazardDensity * 10);

    // Spawn patterns above camera
    const spawnThreshold = cameraY - 600;
    while (this.nextSpawnY > spawnThreshold) {
      this.spawnPattern(this.nextSpawnY, floorData, config, time);
      this.nextSpawnY -= interval;
    }

    // Update hazard behaviors
    this.updateHazards(time);

    // Cleanup
    this.cleanup(cameraY + GAME_HEIGHT + 100);
  }

  updateHazards(time) {
    for (const h of this.hazards) {
      const behavior = h.getData("behavior");

      // Moving hazards drift
      if (behavior === "moving") {
        h.y += h.getData("velocityY") || 0;
      }

      // Delayed hazards: telegraph then solidify
      if (behavior === "delayed") {
        const spawnTime = h.getData("spawnTime");
        const delay = h.getData("delay") || 1000;
        const elapsed = time - spawnTime;

        if (elapsed < delay) {
          // Telegraph phase: blink
          const blink = Math.floor(elapsed / 120) % 2 === 0;
          h.setAlpha(blink ? 0.3 : 0.1);
          h.setData("solid", false);
        } else if (!h.getData("solid")) {
          // Activate
          h.setAlpha(1.0);
          h.setData("solid", true);
        }
      }

      // Sync labels
      const label = h.getData("label");
      if (label && !label.scene) return; // destroyed check
      if (label) {
        label.x = h.x;
        label.y = h.y;
      }
    }
  }

  spawnPattern(y, floorData, config, time) {
    const currentFloor = floorData.floorNumber;

    // Filter patterns for this floor
    let candidates = PATTERNS.filter(p =>
      currentFloor >= p.minFloor && currentFloor <= p.maxFloor
    );

    // No repeat
    if (this.lastPatternId && candidates.length > 1) {
      candidates = candidates.filter(p => p.id !== this.lastPatternId);
    }

    // No triple repeat
    candidates = candidates.filter(p => {
      const count = this.recentPatternIds.filter(id => id === p.id).length;
      return count < 2;
    });

    // Tag preference from difficulty
    if (config.preferTags && config.preferTags.length > 0) {
      candidates = candidates.map(p => {
        let weight = p.weight || 1;
        if (p.tags && p.tags.some(t => config.preferTags.includes(t))) {
          weight *= 1.5;
        }
        return { ...p, weight };
      });
    }

    // Breathing room: sometimes just a powerup
    if (Math.random() < config.powerupChance * 0.4) {
      this.spawnRandomPowerup(y, config);
      return;
    }

    const pattern = this.weightedPick(candidates);
    if (!pattern) return;

    // Track pattern history
    this.lastPatternId = pattern.id;
    this.recentPatternIds.push(pattern.id);
    if (this.recentPatternIds.length > 5) this.recentPatternIds.shift();

    // Resolve lanes
    const resolved = this.resolveLanes(pattern.safeLaneCount);

    // Spawn hazards — resolve category to specific type from zone pool
    const zoneId = floorData.zone.id;
    for (const hazard of pattern.hazards) {
      const x = this.resolveLaneRef(hazard.laneRef, resolved);
      if (x == null) continue;
      const type = hazard.type || this.resolveHazardType(hazard.category, zoneId);
      if (!type) continue;
      this.createHazard(x, y + (hazard.yOffset || 0), type, time);
    }

    // Spawn pattern powerups
    for (const pu of (pattern.powerups || [])) {
      if (Math.random() > (pu.chance || 1.0)) continue;
      const x = this.resolveLaneRef(pu.laneRef, resolved);
      if (x == null) continue;
      this.createPowerup(x, y + (pu.yOffset || 0), pu.type);
    }

    // Random powerup in safe lane
    if (!pattern.powerups && Math.random() < config.powerupChance) {
      const safeLane = resolved.safe[Math.floor(Math.random() * resolved.safe.length)];
      if (safeLane != null) {
        this.spawnRandomPowerup(y - 30, config, safeLane);
      }
    }
  }

  spawnRandomPowerup(y, config, forceLane) {
    const lane = forceLane || LANES[Math.floor(Math.random() * LANES.length)];

    // Tier-weighted selection: common=50%, uncommon=30%, rare=15%, legendary=5%
    const roll = Math.random();
    let tier;
    if (roll < 0.50) tier = 1;
    else if (roll < 0.80) tier = 2;
    else if (roll < 0.95) tier = 3;
    else tier = 4;

    // Pick random powerup from that tier
    const keys = Object.keys(POWERUP_CONFIGS).filter(k => POWERUP_CONFIGS[k].tier === tier);
    const type = keys[Math.floor(Math.random() * keys.length)];

    this.createPowerup(lane, y, type);
  }

  resolveLanes(safeLaneCount) {
    const shuffled = [...LANES].sort(() => Math.random() - 0.5);
    const safeCount = Math.min(Math.max(safeLaneCount, 1), LANE_COUNT);
    const safe = shuffled.slice(0, safeCount);
    const unsafe = shuffled.slice(safeCount);

    return {
      safe,
      unsafe,
      refs: {
        safeA: safe[0] ?? null,
        safeB: safe[1] ?? null,
        safeC: safe[2] ?? null,
        unsafeA: unsafe[0] ?? null,
        unsafeB: unsafe[1] ?? null,
        unsafeC: unsafe[2] ?? null
      }
    };
  }

  resolveLaneRef(ref, resolved) {
    return resolved.refs[ref] ?? null;
  }

  resolveHazardType(category, zoneId) {
    const pool = ZONE_HAZARD_POOLS[zoneId] || ZONE_HAZARD_POOLS.basement;
    const options = pool[category];
    if (!options || options.length === 0) return "meeting_block"; // fallback
    return options[Math.floor(Math.random() * options.length)];
  }

  createHazard(x, y, type, time) {
    const config = HAZARD_CONFIGS[type];
    if (!config) return null;

    let width = config.width;
    let height = config.height;

    if (config.behavior === "wide") {
      const laneIdx = LANES.indexOf(x);
      if (laneIdx >= 0 && laneIdx < LANES.length - 1) {
        x = (LANES[laneIdx] + LANES[laneIdx + 1]) / 2;
        width = LANES[laneIdx + 1] - LANES[laneIdx] + 20;
      }
    }

    // Bordered rectangle with inner fill
    const rect = this.scene.add.rectangle(x, y, width, height, config.color);
    rect.setStrokeStyle(1.5, 0xffffff, 0.3);
    if (config.alpha) rect.setAlpha(config.alpha);
    if (config.behavior === "delayed") rect.setAlpha(0.15);
    rect.setDepth(5);

    rect.setDataEnabled();
    rect.setData("type", type);
    rect.setData("behavior", config.behavior);
    rect.setData("solid", config.behavior !== "delayed");
    rect.setData("spawnTime", time || 0);
    rect.setData("delay", config.delay || 0);
    if (config.velocityY) rect.setData("velocityY", config.velocityY);

    if (config.label) {
      const label = this.scene.add.text(x, y, config.label, {
        fontFamily: "monospace",
        fontSize: config.label.length > 4 ? "7px" : "9px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(6);
      rect.setData("label", label);
    }

    this.hazards.push(rect);
    return rect;
  }

  createPowerup(x, y, type) {
    const config = POWERUP_CONFIGS[type];
    if (!config) return null;

    // Powerups get a glowing border
    const rect = this.scene.add.rectangle(x, y, config.width, config.height, config.color);
    rect.setStrokeStyle(2, 0xffffff, 0.5);
    rect.setDepth(5);

    rect.setDataEnabled();
    rect.setData("type", type);
    rect.setData("effect", config.effect);

    if (config.label) {
      const label = this.scene.add.text(x, y, config.label, {
        fontSize: "12px"
      }).setOrigin(0.5).setDepth(6);
      rect.setData("label", label);
    }

    // Bob + pulse animation
    this.scene.tweens.add({
      targets: rect,
      y: y - 5,
      yoyo: true,
      repeat: -1,
      duration: 500,
      ease: "Sine.easeInOut"
    });

    this.powerups.push(rect);
    return rect;
  }

  cleanup(killY) {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      if (h.y > killY) {
        const label = h.getData("label");
        if (label) label.destroy();
        h.destroy();
        this.hazards.splice(i, 1);
      }
    }
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      if (p.y > killY) {
        const label = p.getData("label");
        if (label) label.destroy();
        p.destroy();
        this.powerups.splice(i, 1);
      }
    }
  }

  destroyHazard(hazard) {
    const idx = this.hazards.indexOf(hazard);
    if (idx !== -1) this.hazards.splice(idx, 1);
    const label = hazard.getData("label");
    if (label) label.destroy();
    hazard.destroy();
  }

  destroyPowerup(powerup) {
    const idx = this.powerups.indexOf(powerup);
    if (idx !== -1) this.powerups.splice(idx, 1);
    const label = powerup.getData("label");
    if (label) label.destroy();
    powerup.destroy();
  }

  // --- World Events ---
  updateEvents(time, config) {
    // End active event
    if (this.activeEvent && time > this.eventEndTime) {
      this.scene.events.emit("world-event-end", this.activeEvent);
      this.activeEvent = null;
    }

    // Maybe start new event
    if (!this.activeEvent && time > this.nextEventCheck) {
      this.nextEventCheck = time + 20000 + Math.random() * 15000;

      if (Math.random() < (config.band >= 3 ? 0.25 : 0.10)) {
        this.startEvent(time);
      }
    }
  }

  startEvent(time) {
    const events = [
      { id: "quiet_week", label: "Quiet Week — reduced hazards", duration: 8000 },
      { id: "meeting_frenzy", label: "Meeting Frenzy — increased meetings", duration: 6000 },
      { id: "slack_overload", label: "Slack Overload — notification storm", duration: 5000 },
      { id: "reorg_event", label: "Reorg Event — everything shifts", duration: 6000 },
      { id: "budget_season", label: "Budget Season — cuts incoming", duration: 5000 },
      { id: "coffee_break", label: "Coffee Break — extra power-ups", duration: 7000 }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    this.activeEvent = event;
    this.eventEndTime = time + event.duration;

    this.scene.events.emit("world-event", event);
  }

  getActiveEvent() {
    return this.activeEvent;
  }

  weightedPick(items) {
    if (items.length === 0) return null;
    const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let roll = Math.random() * total;
    for (const item of items) {
      roll -= (item.weight || 1);
      if (roll <= 0) return item;
    }
    return items[items.length - 1];
  }
}
