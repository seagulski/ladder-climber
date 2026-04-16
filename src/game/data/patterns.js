// Pattern library — 15 authored encounter designs
// laneRef: safeA/B/C, unsafeA/B/C — resolved at spawn time
// tags: used by DifficultyManager to prefer patterns per band

export const PATTERNS = [
  // --- CALM / INTRO ---
  {
    id: "single_blocker",
    minFloor: 1, maxFloor: 999, weight: 10,
    tags: ["calm", "intro"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "meeting_block", yOffset: 0 }
    ]
  },
  {
    id: "single_buzz",
    minFloor: 1, maxFloor: 999, weight: 8,
    tags: ["calm", "intro"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "buzzword_cloud", yOffset: 0 }
    ]
  },
  {
    id: "coffee_corridor",
    minFloor: 1, maxFloor: 999, weight: 6,
    tags: ["reward", "recovery"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "meeting_block", yOffset: 20 }
    ],
    powerups: [
      { laneRef: "safeA", type: "coffee", yOffset: -10, chance: 1.0 }
    ]
  },
  {
    id: "promotion_runway",
    minFloor: 8, maxFloor: 999, weight: 3,
    tags: ["reward"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "buzzword_cloud", yOffset: 10 },
      { laneRef: "unsafeB", type: "meeting_block", yOffset: 30 }
    ],
    powerups: [
      { laneRef: "safeA", type: "promotion_letter", yOffset: -10, chance: 1.0 }
    ]
  },

  // --- STANDARD ---
  {
    id: "double_blocker",
    minFloor: 5, maxFloor: 999, weight: 8,
    tags: ["standard"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "meeting_block", yOffset: 0 },
      { laneRef: "unsafeB", type: "buzzword_cloud", yOffset: 0 }
    ]
  },
  {
    id: "drifter",
    minFloor: 3, maxFloor: 999, weight: 7,
    tags: ["standard", "moving"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "slack_storm", yOffset: 0 }
    ]
  },
  {
    id: "reply_chain",
    minFloor: 10, maxFloor: 999, weight: 6,
    tags: ["standard", "moving"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "reply_all", yOffset: 0 }
    ]
  },
  {
    id: "stagger",
    minFloor: 8, maxFloor: 999, weight: 7,
    tags: ["standard", "timing"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "meeting_block", yOffset: 0 },
      { laneRef: "unsafeB", type: "slack_storm", yOffset: 50 }
    ]
  },

  // --- ROUTING / SIGNATURE ---
  {
    id: "glass_ceiling_single",
    minFloor: 6, maxFloor: 999, weight: 6,
    tags: ["routing", "signature"],
    safeLaneCount: 3,
    hazards: [
      { laneRef: "unsafeA", type: "glass_ceiling", yOffset: 0 }
    ]
  },
  {
    id: "glass_ceiling_handoff",
    minFloor: 15, maxFloor: 999, weight: 5,
    tags: ["pressure", "routing"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "glass_ceiling", yOffset: 0 },
      { laneRef: "unsafeB", type: "slack_storm", yOffset: 40 }
    ]
  },

  // --- PRESSURE ---
  {
    id: "budget_slash",
    minFloor: 20, maxFloor: 999, weight: 5,
    tags: ["pressure", "wide"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "budget_cut", yOffset: 0 }
    ]
  },
  {
    id: "reorg_incoming",
    minFloor: 18, maxFloor: 999, weight: 5,
    tags: ["pressure", "delayed"],
    safeLaneCount: 2,
    hazards: [
      { laneRef: "unsafeA", type: "reorg_wave", yOffset: 0 },
      { laneRef: "unsafeB", type: "meeting_block", yOffset: 20 }
    ]
  },
  {
    id: "triple_threat",
    minFloor: 25, maxFloor: 999, weight: 4,
    tags: ["pressure", "combo"],
    safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", type: "meeting_block", yOffset: 0 },
      { laneRef: "unsafeB", type: "glass_ceiling", yOffset: 20 },
      { laneRef: "unsafeC", type: "slack_storm", yOffset: 40 }
    ]
  },

  // --- COMBO / EVENT ---
  {
    id: "executive_override",
    minFloor: 30, maxFloor: 999, weight: 3,
    tags: ["combo", "event"],
    safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", type: "executive_veto", yOffset: 0 },
      { laneRef: "unsafeB", type: "reorg_wave", yOffset: 30 },
      { laneRef: "unsafeC", type: "budget_cut", yOffset: 60 }
    ]
  },
  {
    id: "all_hands_panic",
    minFloor: 35, maxFloor: 999, weight: 3,
    tags: ["combo", "event"],
    safeLaneCount: 1,
    hazards: [
      { laneRef: "unsafeA", type: "slack_storm", yOffset: 0 },
      { laneRef: "unsafeB", type: "reply_all", yOffset: 20 },
      { laneRef: "unsafeC", type: "executive_veto", yOffset: 50 }
    ]
  }
];
