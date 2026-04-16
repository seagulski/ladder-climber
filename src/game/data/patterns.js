// Pattern library — 20 authored encounter designs
// Hazard types are picked from zone-appropriate pools at spawn time

// Zone-specific hazard pools — each zone favors different obstacles
export const ZONE_HAZARD_POOLS = {
  basement: {
    static: ["meeting_block", "buzzword_cloud", "approval_bottleneck"],
    moving: ["slack_storm", "notification_burst"],
    ceiling: ["glass_ceiling"],
    wide: ["budget_cut"],
    delayed: ["reorg_wave"]
  },
  cubicle: {
    static: ["meeting_block", "recurring_sync", "calendar_conflict", "buzzword_cloud", "corporate_jargon"],
    moving: ["slack_storm", "reply_all", "email_chain", "notification_burst"],
    ceiling: ["glass_ceiling", "promotion_freeze"],
    wide: ["budget_cut", "hiring_freeze"],
    delayed: ["reorg_wave", "priority_shift"]
  },
  lower_mgmt: {
    static: ["recurring_sync", "approval_bottleneck", "performance_review", "calendar_conflict"],
    moving: ["slack_storm", "reply_all", "urgent_request"],
    ceiling: ["glass_ceiling", "promotion_freeze", "invisible_barrier"],
    wide: ["budget_cut", "layoff_wave", "hiring_freeze"],
    delayed: ["reorg_wave", "executive_veto", "priority_shift"]
  },
  middle_mgmt: {
    static: ["performance_review", "approval_bottleneck", "calendar_conflict", "synergy_vortex"],
    moving: ["reply_all", "urgent_request", "email_chain", "late_night_ping"],
    ceiling: ["glass_ceiling", "invisible_barrier", "promotion_freeze"],
    wide: ["budget_cut", "layoff_wave"],
    delayed: ["executive_veto", "strategic_reset", "scope_creep", "priority_shift"]
  },
  upper_mgmt: {
    static: ["performance_review", "agenda_free", "innovation_theater", "values_poster"],
    moving: ["urgent_request", "late_night_ping", "notification_burst"],
    ceiling: ["glass_ceiling", "invisible_barrier"],
    wide: ["layoff_wave", "budget_cut"],
    delayed: ["executive_veto", "strategic_reset", "scope_creep"]
  },
  executive: {
    static: ["agenda_free", "values_poster", "innovation_theater"],
    moving: ["urgent_request", "late_night_ping"],
    ceiling: ["invisible_barrier", "glass_ceiling"],
    wide: ["layoff_wave"],
    delayed: ["executive_veto", "strategic_reset"]
  },
  void: {
    static: ["synergy_vortex", "innovation_theater", "values_poster", "corporate_jargon"],
    moving: ["late_night_ping", "urgent_request", "notification_burst"],
    ceiling: ["invisible_barrier"],
    wide: ["layoff_wave"],
    delayed: ["strategic_reset", "scope_creep", "executive_veto"]
  }
};

// Helper: pick a random hazard from a zone pool category
function zoneHazard(category) {
  return { laneCategory: category }; // resolved at spawn time
}

export const PATTERNS = [
  // --- CALM / INTRO ---
  {
    id: "single_blocker", minFloor: 1, maxFloor: 999, weight: 10,
    tags: ["calm", "intro"], safeLaneCount: 3,
    hazards: [{ laneRef: "unsafeA", category: "static", yOffset: 0 }]
  },
  {
    id: "single_soft", minFloor: 1, maxFloor: 999, weight: 8,
    tags: ["calm", "intro"], safeLaneCount: 3,
    hazards: [{ laneRef: "unsafeA", category: "static", yOffset: 0 }]
  },
  {
    id: "coffee_corridor", minFloor: 1, maxFloor: 999, weight: 6,
    tags: ["reward", "recovery"], safeLaneCount: 3,
    hazards: [{ laneRef: "unsafeA", category: "static", yOffset: 20 }],
    powerups: [{ laneRef: "safeA", type: "coffee", yOffset: -10, chance: 1.0 }]
  },
  {
    id: "promotion_runway", minFloor: 10, maxFloor: 999, weight: 3,
    tags: ["reward"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "static", yOffset: 10 },
      { laneRef: "unsafeB", category: "static", yOffset: 30 }
    ],
    powerups: [{ laneRef: "safeA", type: "promotion_letter", yOffset: -10, chance: 1.0 }]
  },

  // --- STANDARD ---
  {
    id: "double_blocker", minFloor: 5, maxFloor: 999, weight: 8,
    tags: ["standard"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "static", yOffset: 0 },
      { laneRef: "unsafeB", category: "static", yOffset: 0 }
    ]
  },
  {
    id: "drifter", minFloor: 3, maxFloor: 999, weight: 7,
    tags: ["standard", "moving"], safeLaneCount: 3,
    hazards: [{ laneRef: "unsafeA", category: "moving", yOffset: 0 }]
  },
  {
    id: "double_drift", minFloor: 12, maxFloor: 999, weight: 5,
    tags: ["standard", "moving"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "moving", yOffset: 0 },
      { laneRef: "unsafeB", category: "moving", yOffset: 40 }
    ]
  },
  {
    id: "stagger", minFloor: 8, maxFloor: 999, weight: 7,
    tags: ["standard", "timing"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "static", yOffset: 0 },
      { laneRef: "unsafeB", category: "moving", yOffset: 50 }
    ]
  },

  // --- ROUTING / SIGNATURE ---
  {
    id: "glass_ceiling_single", minFloor: 6, maxFloor: 999, weight: 6,
    tags: ["routing", "signature"], safeLaneCount: 3,
    hazards: [{ laneRef: "unsafeA", category: "ceiling", yOffset: 0 }]
  },
  {
    id: "glass_ceiling_handoff", minFloor: 15, maxFloor: 999, weight: 5,
    tags: ["pressure", "routing"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "ceiling", yOffset: 0 },
      { laneRef: "unsafeB", category: "moving", yOffset: 40 }
    ]
  },
  {
    id: "double_ceiling", minFloor: 25, maxFloor: 999, weight: 4,
    tags: ["pressure", "routing"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "ceiling", yOffset: 0 },
      { laneRef: "unsafeB", category: "ceiling", yOffset: 30 }
    ]
  },

  // --- PRESSURE ---
  {
    id: "budget_slash", minFloor: 20, maxFloor: 999, weight: 5,
    tags: ["pressure", "wide"], safeLaneCount: 2,
    hazards: [{ laneRef: "unsafeA", category: "wide", yOffset: 0 }]
  },
  {
    id: "delayed_incoming", minFloor: 18, maxFloor: 999, weight: 5,
    tags: ["pressure", "delayed"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "delayed", yOffset: 0 },
      { laneRef: "unsafeB", category: "static", yOffset: 20 }
    ]
  },
  {
    id: "triple_threat", minFloor: 25, maxFloor: 999, weight: 4,
    tags: ["pressure", "combo"], safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", category: "static", yOffset: 0 },
      { laneRef: "unsafeB", category: "ceiling", yOffset: 20 },
      { laneRef: "unsafeC", category: "moving", yOffset: 40 }
    ]
  },
  {
    id: "mixed_pressure", minFloor: 20, maxFloor: 999, weight: 5,
    tags: ["pressure"], safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", category: "delayed", yOffset: 0 },
      { laneRef: "unsafeB", category: "moving", yOffset: 30 }
    ]
  },

  // --- COMBO / EVENT ---
  {
    id: "executive_override", minFloor: 30, maxFloor: 999, weight: 3,
    tags: ["combo", "event"], safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", category: "delayed", yOffset: 0 },
      { laneRef: "unsafeB", category: "delayed", yOffset: 30 },
      { laneRef: "unsafeC", category: "wide", yOffset: 60 }
    ]
  },
  {
    id: "all_hands_panic", minFloor: 35, maxFloor: 999, weight: 3,
    tags: ["combo", "event"], safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", category: "moving", yOffset: 0 },
      { laneRef: "unsafeB", category: "moving", yOffset: 20 },
      { laneRef: "unsafeC", category: "delayed", yOffset: 50 }
    ]
  },
  {
    id: "gauntlet", minFloor: 40, maxFloor: 999, weight: 2,
    tags: ["combo"], safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", category: "static", yOffset: 0 },
      { laneRef: "unsafeB", category: "ceiling", yOffset: 25 },
      { laneRef: "unsafeC", category: "delayed", yOffset: 50 }
    ]
  },

  // --- RECOVERY (post-hit mercy) ---
  {
    id: "breather", minFloor: 1, maxFloor: 999, weight: 4,
    tags: ["recovery", "calm"], safeLaneCount: 3,
    hazards: [],
    powerups: [
      { laneRef: "safeA", type: "coffee", yOffset: 0, chance: 0.8 },
      { laneRef: "safeB", type: "headphones", yOffset: 10, chance: 0.4 }
    ]
  }
];
