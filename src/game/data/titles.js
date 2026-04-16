// 100 career stages from Intern to You Are The Company
// Visibility thresholds ramp exponentially
export const CAREER_STAGES = [
  // Tier 1: Entry Hell (intern form)
  { index: 0,  visibility: 0,     title: "Intern (Unpaid)",              form: "intern" },
  { index: 1,  visibility: 60,    title: "Intern (Paid)",                form: "intern" },
  { index: 2,  visibility: 130,   title: "Intern (Paid, Sometimes)",     form: "intern" },
  { index: 3,  visibility: 210,   title: "Temporary Associate",          form: "intern" },
  { index: 4,  visibility: 300,   title: "Junior Associate",             form: "intern" },
  { index: 5,  visibility: 400,   title: "Associate I",                  form: "intern" },
  { index: 6,  visibility: 510,   title: "Associate II",                 form: "intern" },
  { index: 7,  visibility: 630,   title: "Associate III",                form: "intern" },
  { index: 8,  visibility: 760,   title: "Analyst Tier 1",               form: "intern" },
  { index: 9,  visibility: 900,   title: "Analyst Tier 2",               form: "intern" },

  // Tier 2: Analyst Grind (analyst form)
  { index: 10, visibility: 1050,  title: "Analyst Tier 3",               form: "analyst" },
  { index: 11, visibility: 1210,  title: "Analyst Tier 4",               form: "analyst" },
  { index: 12, visibility: 1380,  title: "Analyst Tier 5",               form: "analyst" },
  { index: 13, visibility: 1560,  title: "Reporting Analyst",            form: "analyst" },
  { index: 14, visibility: 1750,  title: "Business Analyst",             form: "analyst" },
  { index: 15, visibility: 1950,  title: "Process Analyst",              form: "analyst" },
  { index: 16, visibility: 2160,  title: "Strategy Analyst",             form: "analyst" },
  { index: 17, visibility: 2380,  title: "Senior Analyst",               form: "analyst" },
  { index: 18, visibility: 2610,  title: "Senior Analyst II",            form: "analyst" },
  { index: 19, visibility: 2850,  title: "Senior Analyst III",           form: "analyst" },

  // Tier 3: Specialist (analyst form)
  { index: 20, visibility: 3100,  title: "Specialist I",                 form: "analyst" },
  { index: 21, visibility: 3360,  title: "Specialist II",                form: "analyst" },
  { index: 22, visibility: 3630,  title: "Senior Specialist",            form: "analyst" },
  { index: 23, visibility: 3910,  title: "Lead Specialist",              form: "analyst" },
  { index: 24, visibility: 4200,  title: "Staff Specialist",             form: "analyst" },
  { index: 25, visibility: 4500,  title: "Senior Associate",             form: "analyst" },
  { index: 26, visibility: 4810,  title: "Operations Coordinator",       form: "analyst" },
  { index: 27, visibility: 5130,  title: "Program Coordinator",          form: "analyst" },
  { index: 28, visibility: 5460,  title: "Initiative Coordinator",       form: "analyst" },
  { index: 29, visibility: 5800,  title: "Enablement Associate",         form: "analyst" },

  // Tier 4: Manager Illusion (manager form)
  { index: 30, visibility: 6150,  title: "Program Manager I",            form: "manager" },
  { index: 31, visibility: 6510,  title: "Program Manager II",           form: "manager" },
  { index: 32, visibility: 6880,  title: "Senior Program Manager",       form: "manager" },
  { index: 33, visibility: 7260,  title: "Project Manager",              form: "manager" },
  { index: 34, visibility: 7650,  title: "Delivery Manager",             form: "manager" },
  { index: 35, visibility: 8050,  title: "Team Manager",                 form: "manager" },
  { index: 36, visibility: 8460,  title: "Group Manager",                form: "manager" },
  { index: 37, visibility: 8880,  title: "Senior Manager",               form: "manager" },
  { index: 38, visibility: 9310,  title: "Senior Manager II",            form: "manager" },
  { index: 39, visibility: 9750,  title: "Functional Lead",              form: "manager" },

  // Tier 5: Dangerous Titles (manager form)
  { index: 40, visibility: 10200, title: "Principal Associate",          form: "manager" },
  { index: 41, visibility: 10660, title: "Principal Strategist",         form: "manager" },
  { index: 42, visibility: 11130, title: "Staff Strategist",             form: "manager" },
  { index: 43, visibility: 11610, title: "Head of Enablement",           form: "manager" },
  { index: 44, visibility: 12100, title: "Head of Strategic Delivery",   form: "manager" },
  { index: 45, visibility: 12600, title: "Head of Process Excellence",   form: "manager" },
  { index: 46, visibility: 13110, title: "Head of Transformation",       form: "manager" },
  { index: 47, visibility: 13630, title: "Director",                     form: "manager" },
  { index: 48, visibility: 14160, title: "Director II",                  form: "manager" },
  { index: 49, visibility: 14700, title: "Senior Director",              form: "manager" },

  // Tier 6: Director Inflation (executive form)
  { index: 50, visibility: 15250, title: "Director of Operations",       form: "executive" },
  { index: 51, visibility: 15810, title: "Director of Alignment",        form: "executive" },
  { index: 52, visibility: 16380, title: "Director of Strategic Alignment", form: "executive" },
  { index: 53, visibility: 16960, title: "Director of Cross-Functional Alignment", form: "executive" },
  { index: 54, visibility: 17550, title: "Director of Outcomes",         form: "executive" },
  { index: 55, visibility: 18150, title: "Director of Strategic Outcomes", form: "executive" },
  { index: 56, visibility: 18760, title: "Director of Transformation",   form: "executive" },
  { index: 57, visibility: 19380, title: "Director of Change Enablement", form: "executive" },
  { index: 58, visibility: 20010, title: "Director of Enterprise Alignment", form: "executive" },
  { index: 59, visibility: 20650, title: "Director of Growth Operations", form: "executive" },

  // Tier 7: VP Country (executive form)
  { index: 60, visibility: 21300, title: "VP of Operations",             form: "executive" },
  { index: 61, visibility: 21960, title: "VP of Transformation",         form: "executive" },
  { index: 62, visibility: 22630, title: "VP of Alignment",              form: "executive" },
  { index: 63, visibility: 23310, title: "VP of Strategic Alignment",    form: "executive" },
  { index: 64, visibility: 24000, title: "VP of Enterprise Readiness",   form: "executive" },
  { index: 65, visibility: 24700, title: "VP of Narrative Delivery",     form: "executive" },
  { index: 66, visibility: 25410, title: "VP of Cross-Functional Synergies", form: "executive" },
  { index: 67, visibility: 26130, title: "VP of Interdepartmental Optimization", form: "executive" },
  { index: 68, visibility: 26860, title: "SVP of Transformation",        form: "executive" },
  { index: 69, visibility: 27600, title: "SVP of Vision Delivery",       form: "executive" },

  // Tier 8: C-Suite Parody (entity form)
  { index: 70, visibility: 28350, title: "EVP of Strategy",              form: "entity" },
  { index: 71, visibility: 29110, title: "EVP of Organizational Velocity", form: "entity" },
  { index: 72, visibility: 29880, title: "Chief Strategy Officer",       form: "entity" },
  { index: 73, visibility: 30660, title: "Chief Alignment Officer",      form: "entity" },
  { index: 74, visibility: 31450, title: "Chief Transformation Officer", form: "entity" },
  { index: 75, visibility: 32250, title: "Chief Narrative Officer",      form: "entity" },
  { index: 76, visibility: 33060, title: "Chief Visibility Officer",     form: "entity" },
  { index: 77, visibility: 33880, title: "Chief Synergy Officer",        form: "entity" },
  { index: 78, visibility: 34710, title: "Chief Meta Officer",           form: "entity" },
  { index: 79, visibility: 35550, title: "Chief Officer Officer",        form: "entity" },

  // Tier 9: Post-Human Org Chart (entity form)
  { index: 80, visibility: 36400, title: "Global Head of Everything",    form: "entity" },
  { index: 81, visibility: 37260, title: "Enterprise-Wide Decision Surface", form: "entity" },
  { index: 82, visibility: 38130, title: "Board-Adjacent Leader",        form: "entity" },
  { index: 83, visibility: 39010, title: "Interim Acting Executive",     form: "entity" },
  { index: 84, visibility: 39900, title: "Interim Acting Interim Executive", form: "entity" },
  { index: 85, visibility: 40800, title: "Executive Placeholder",        form: "entity" },
  { index: 86, visibility: 41710, title: "Corporate Entity",             form: "entity" },
  { index: 87, visibility: 42630, title: "Organizational Force",         form: "entity" },
  { index: 88, visibility: 43560, title: "The Brand",                    form: "entity" },
  { index: 89, visibility: 44500, title: "The Organization",             form: "entity" },

  // Tier 10: Endgame Absurdity (entity form)
  { index: 90, visibility: 45450, title: "Executive Atmosphere",         form: "entity" },
  { index: 91, visibility: 46410, title: "Floating Governance Layer",    form: "entity" },
  { index: 92, visibility: 47380, title: "Strategic Cloudform",          form: "entity" },
  { index: 93, visibility: 48360, title: "Board Whisper",                form: "entity" },
  { index: 94, visibility: 49350, title: "Synergy Manifest",             form: "entity" },
  { index: 95, visibility: 50350, title: "Corporate Myth",               form: "entity" },
  { index: 96, visibility: 51360, title: "Revenue Apparition",           form: "entity" },
  { index: 97, visibility: 52380, title: "Leadership Singularity",       form: "entity" },
  { index: 98, visibility: 53410, title: "Permanent Interim",            form: "entity" },
  { index: 99, visibility: 54450, title: "You Are The Company",          form: "entity" }
];

export function getStageForVisibility(visibility) {
  let current = CAREER_STAGES[0];
  for (const stage of CAREER_STAGES) {
    if (visibility >= stage.visibility) {
      current = stage;
    } else {
      break;
    }
  }
  return current;
}

export function getNextStage(currentIndex) {
  if (currentIndex + 1 < CAREER_STAGES.length) {
    return CAREER_STAGES[currentIndex + 1];
  }
  return null;
}
