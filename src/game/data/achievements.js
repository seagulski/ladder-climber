export const ACHIEVEMENTS = [
  // --- Progress (10) — each should feel like a real milestone ---
  { id: "spreadsheet_blooded", name: "Spreadsheet Blooded", description: "Reach Senior Analyst.",
    secret: false, type: "titleIndexAtLeast", value: 17 },
  { id: "people_manager", name: "People Manager", description: "Reach Program Manager.",
    secret: false, type: "titleIndexAtLeast", value: 30 },
  { id: "strategic_asset", name: "Strategic Asset", description: "Reach Director.",
    secret: false, type: "titleIndexAtLeast", value: 47 },
  { id: "executive_presence", name: "Executive Presence", description: "Reach VP tier.",
    secret: false, type: "titleIndexAtLeast", value: 60 },
  { id: "c_suite_adjacent", name: "C-Suite Adjacent", description: "Reach a Chief title.",
    secret: false, type: "titleIndexAtLeast", value: 72 },
  { id: "abstracted", name: "Abstracted", description: "Reach Corporate Entity.",
    secret: false, type: "titleIndexAtLeast", value: 86 },
  { id: "corporate_myth", name: "Corporate Myth", description: "Reach Corporate Myth.",
    secret: false, type: "titleIndexAtLeast", value: 95 },
  { id: "you_are_the_company", name: "You Are The Company", description: "Reach the final title.",
    secret: false, type: "titleIndexAtLeast", value: 99 },
  { id: "glass_breaker", name: "Glass Breaker", description: "Reach the Management zone.",
    secret: false, type: "floorAtLeast", value: 126 },
  { id: "top_floor", name: "Top Floor", description: "Reach the Executive zone.",
    secret: false, type: "floorAtLeast", value: 276 },

  // --- Survival (5) — starting at 45s so it's not automatic ---
  { id: "still_employed", name: "Still Employed", description: "Survive 45 seconds.",
    secret: false, type: "timeAtLeast", value: 45000 },
  { id: "quarter_closed", name: "Quarter Closed", description: "Survive 90 seconds.",
    secret: false, type: "timeAtLeast", value: 90000 },
  { id: "long_tenure", name: "Long Tenure", description: "Survive 150 seconds.",
    secret: false, type: "timeAtLeast", value: 150000 },
  { id: "institutional_memory", name: "Institutional Memory", description: "Survive 210 seconds.",
    secret: false, type: "timeAtLeast", value: 210000 },
  { id: "unreasonably_retained", name: "Unreasonably Retained", description: "Survive 300 seconds.",
    secret: false, type: "timeAtLeast", value: 300000 },

  // --- Failure (5) ---
  { id: "career_realignment", name: "Career Realignment", description: "Get demoted for the first time.",
    secret: false, type: "demotionsAtLeast", value: 1 },
  { id: "needs_improvement", name: "Needs Improvement", description: "Get demoted 3 times in one run.",
    secret: false, type: "demotionsAtLeast", value: 3 },
  { id: "below_expectations", name: "Below Expectations", description: "Lose within 15 seconds.",
    secret: false, type: "loseWithinMs", value: 15000 },
  { id: "role_eliminated", name: "Role Eliminated", description: "Reach Manager tier, then lose.",
    secret: false, type: "custom", value: "role_eliminated" },
  { id: "sudden_exit", name: "Sudden Exit", description: "Lose within 5 seconds of a promotion.",
    secret: false, type: "custom", value: "sudden_exit" },

  // --- Skill (5) ---
  { id: "lateral_thinker", name: "Lateral Thinker", description: "Change lanes 30 times in one run.",
    secret: false, type: "laneChangesAtLeast", value: 30 },
  { id: "agile_workforce", name: "Agile Workforce", description: "Go 45 seconds without being hit.",
    secret: false, type: "noHitStreakAtLeast", value: 45000 },
  { id: "dodged_the_meeting", name: "Dodged the Meeting", description: "Change lanes 75 times in one run.",
    secret: false, type: "laneChangesAtLeast", value: 75 },
  { id: "score_5k", name: "High Performer", description: "Reach a score of 5,000.",
    secret: false, type: "scoreAtLeast", value: 5000 },
  { id: "score_20k", name: "Top Talent", description: "Reach a score of 20,000.",
    secret: false, type: "scoreAtLeast", value: 20000 },

  // --- Power-up (2) ---
  { id: "caffeinated", name: "Caffeinated", description: "Collect 8 Coffee power-ups in one run.",
    secret: false, type: "powerupAtLeast", key: "speed", value: 8 },
  { id: "wellness_initiative", name: "Wellness Initiative", description: "Collect 4 different power-up types in one run.",
    secret: false, type: "custom", value: "wellness_initiative" },

  // --- Secret (3) ---
  { id: "circle_back", name: "Circle Back", description: "Switch lanes back and forth 3 times in 3 seconds.",
    secret: true, type: "custom", value: "circle_back" },
  { id: "thought_leader", name: "Thought Leader", description: "Reach Director without collecting Coffee.",
    secret: true, type: "custom", value: "thought_leader" },
  { id: "the_void", name: "The Void", description: "Enter the Corporate Void.",
    secret: true, type: "floorAtLeast", value: 351 }
];
