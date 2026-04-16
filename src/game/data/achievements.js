export const ACHIEVEMENTS = [
  // --- Progress (10) ---
  { id: "first_day", name: "First Day", description: "Reach Associate I.",
    secret: false, type: "titleIndexAtLeast", value: 5 },
  { id: "settling_in", name: "Settling In", description: "Reach Analyst Tier 1.",
    secret: false, type: "titleIndexAtLeast", value: 8 },
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

  // --- Survival (5) ---
  { id: "still_employed", name: "Still Employed", description: "Survive 30 seconds.",
    secret: false, type: "timeAtLeast", value: 30000 },
  { id: "quarter_closed", name: "Quarter Closed", description: "Survive 60 seconds.",
    secret: false, type: "timeAtLeast", value: 60000 },
  { id: "long_tenure", name: "Long Tenure", description: "Survive 120 seconds.",
    secret: false, type: "timeAtLeast", value: 120000 },
  { id: "institutional_memory", name: "Institutional Memory", description: "Survive 180 seconds.",
    secret: false, type: "timeAtLeast", value: 180000 },
  { id: "unreasonably_retained", name: "Unreasonably Retained", description: "Survive 240 seconds.",
    secret: false, type: "timeAtLeast", value: 240000 },

  // --- Failure (5) ---
  { id: "career_realignment", name: "Career Realignment", description: "Get demoted for the first time.",
    secret: false, type: "demotionsAtLeast", value: 1 },
  { id: "needs_improvement", name: "Needs Improvement", description: "Get demoted 3 times in one run.",
    secret: false, type: "demotionsAtLeast", value: 3 },
  { id: "below_expectations", name: "Below Expectations", description: "Lose within 20 seconds.",
    secret: false, type: "loseWithinMs", value: 20000 },
  { id: "role_eliminated", name: "Role Eliminated", description: "Reach Manager tier, then lose.",
    secret: false, type: "custom", value: "role_eliminated" },
  { id: "sudden_exit", name: "Sudden Exit", description: "Lose within 5 seconds of a promotion.",
    secret: false, type: "custom", value: "sudden_exit" },

  // --- Skill (5) ---
  { id: "lateral_thinker", name: "Lateral Thinker", description: "Change lanes 15 times in one run.",
    secret: false, type: "laneChangesAtLeast", value: 15 },
  { id: "agile_workforce", name: "Agile Workforce", description: "Go 30 seconds without being hit.",
    secret: false, type: "noHitStreakAtLeast", value: 30000 },
  { id: "dodged_the_meeting", name: "Dodged the Meeting", description: "Change lanes 50 times in one run.",
    secret: false, type: "laneChangesAtLeast", value: 50 },
  { id: "glass_breaker", name: "Glass Breaker", description: "Reach the Management zone.",
    secret: false, type: "floorAtLeast", value: 126 },
  { id: "top_floor", name: "Top Floor", description: "Reach the Executive zone.",
    secret: false, type: "floorAtLeast", value: 276 },

  // --- Power-up (2) ---
  { id: "caffeinated", name: "Caffeinated", description: "Collect 5 Coffee power-ups in one run.",
    secret: false, type: "powerupAtLeast", key: "speed", value: 5 },
  { id: "wellness_initiative", name: "Wellness Initiative", description: "Collect 3 different power-up types in one run.",
    secret: false, type: "custom", value: "wellness_initiative" },

  // --- Secret (3) ---
  { id: "circle_back", name: "Circle Back", description: "Switch lanes back and forth 3 times quickly.",
    secret: true, type: "custom", value: "circle_back" },
  { id: "thought_leader", name: "Thought Leader", description: "Reach Director without collecting Coffee.",
    secret: true, type: "custom", value: "thought_leader" },
  { id: "the_void", name: "The Void", description: "Enter the Corporate Void.",
    secret: true, type: "floorAtLeast", value: 351 }
];
