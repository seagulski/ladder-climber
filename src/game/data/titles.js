// 200 career stages — full corporate ladder from Intern to You Are The Company
// Visibility thresholds ramp with increasing gaps

function buildStages() {
  const titles = [
    // Tier 1: Entry-Level Survival (intern form) — 20 titles
    "Intern (Unpaid)", "Intern (Paid)", "Intern (Paid, Occasionally)",
    "Temporary Associate", "Junior Associate",
    "Associate I", "Associate II", "Associate III",
    "Analyst Tier 1", "Analyst Tier 2", "Analyst Tier 3", "Analyst Tier 4", "Analyst Tier 5",
    "Reporting Analyst", "Business Analyst", "Process Analyst", "Strategy Analyst",
    "Senior Analyst", "Senior Analyst II", "Senior Analyst III",

    // Tier 2: The Respectable Middle (analyst form) — 20 titles
    "Specialist I", "Specialist II", "Specialist III",
    "Senior Specialist", "Lead Specialist", "Staff Specialist",
    "Staff Associate", "Senior Associate", "Senior Associate II", "Senior Associate III",
    "Operations Associate", "Strategic Associate", "Program Associate", "Enablement Associate",
    "Coordinator I", "Coordinator II", "Senior Coordinator",
    "Program Coordinator", "Operations Coordinator", "Initiative Coordinator",

    // Tier 3: First Illusion of Power (manager form) — 20 titles
    "Program Manager I", "Program Manager II", "Program Manager III",
    "Senior Program Manager", "Project Manager", "Project Manager II", "Senior Project Manager",
    "Delivery Manager", "Operations Manager", "Team Manager",
    "Group Manager", "Senior Manager", "Senior Manager II", "Senior Manager III",
    "Functional Lead", "Team Lead", "Strategic Lead", "Initiative Lead",
    "Staff Lead", "Senior Staff Lead",

    // Tier 4: Now We Start Sounding Dangerous (manager form) — 20 titles
    "Principal Associate", "Principal Specialist", "Principal Strategist",
    "Principal Program Manager", "Principal Lead", "Senior Principal Lead",
    "Staff Strategist", "Senior Staff Strategist", "Principal Staff Strategist",
    "Head of Delivery", "Head of Enablement", "Head of Strategic Delivery",
    "Head of Organizational Readiness", "Head of Process Excellence",
    "Head of Transformation Support", "Head of Strategic Programs",
    "Director", "Director II", "Senior Director", "Senior Director II",

    // Tier 5: Director Inflation (executive form) — 20 titles
    "Director of Operations", "Director of Strategic Operations",
    "Director of Delivery Excellence", "Director of Cross-Functional Delivery",
    "Director of Organizational Systems", "Director of Performance Systems",
    "Director of Team Synergies", "Director of Alignment",
    "Director of Strategic Alignment", "Director of Executive Alignment",
    "Director of Cross-Functional Alignment", "Director of Enterprise Alignment",
    "Director of Outcomes", "Director of Strategic Outcomes",
    "Director of Business Outcomes", "Director of Growth Operations",
    "Director of Business Transformation", "Director of Organizational Transformation",
    "Director of Change Enablement", "Director of Strategic Enablement",

    // Tier 6: VP Country (executive form) — 20 titles
    "Vice President of Operations", "Vice President of Strategic Operations",
    "Vice President of Delivery", "Vice President of Enablement",
    "Vice President of Transformation", "Vice President of Business Transformation",
    "Vice President of Organizational Design", "Vice President of Alignment",
    "Vice President of Strategic Alignment", "Vice President of Executive Alignment",
    "Vice President of Enterprise Readiness", "Vice President of Enterprise Programs",
    "Vice President of Visibility", "Vice President of Communications Strategy",
    "Vice President of Narrative Delivery", "Vice President of Business Architecture",
    "Vice President of Cross-Functional Synergies", "Vice President of Interdepartmental Optimization",
    "Vice President of Strategic Prioritization", "Vice President of Operational Excellence",

    // Tier 7: SVP and EVP Nonsense (executive form) — 20 titles
    "Senior Vice President of Operations", "Senior Vice President of Transformation",
    "Senior Vice President of Enterprise Programs", "Senior Vice President of Strategic Programs",
    "Senior Vice President of Organizational Strategy", "Senior Vice President of Alignment and Enablement",
    "Senior Vice President of Enterprise Synergies", "Senior Vice President of Narrative Execution",
    "Senior Vice President of Prioritization", "Senior Vice President of Vision Delivery",
    "Executive Vice President of Operations", "Executive Vice President of Strategy",
    "Executive Vice President of Transformation", "Executive Vice President of Alignment",
    "Executive Vice President of Strategic Alignment", "Executive Vice President of Vision",
    "Executive Vice President of Narrative", "Executive Vice President of Delivery Excellence",
    "Executive Vice President of Organizational Velocity", "Executive Vice President of Executive Readiness",

    // Tier 8: C-Suite Parody (entity form) — 20 titles
    "Chief Operations Officer", "Chief Strategy Officer",
    "Chief Enablement Officer", "Chief Alignment Officer",
    "Chief Transformation Officer", "Chief Prioritization Officer",
    "Chief Narrative Officer", "Chief Visibility Officer",
    "Chief Optimization Officer", "Chief Outcomes Officer",
    "Chief Synergy Officer", "Chief Performance Officer",
    "Chief Experience Officer", "Chief Strategic Officer",
    "Chief Executive Support Officer", "Chief Enterprise Readiness Officer",
    "Chief Organizational Velocity Officer", "Chief Systems of Systems Officer",
    "Chief Meta Officer", "Chief Officer Officer",

    // Tier 9: Post-Human Org Chart (entity form) — 20 titles
    "Global Head of Everything", "Global Head of Strategic Everything",
    "Worldwide Executive Presence", "Enterprise-Wide Decision Surface",
    "Board-Adjacent Leader", "Acting Interim Executive",
    "Interim Acting Executive", "Interim Acting Interim Executive",
    "Executive Placeholder", "Strategic Placeholder",
    "Corporate Entity", "Corporate Presence",
    "Organizational Force", "The Brand",
    "The Platform", "The Function",
    "The Business", "The Market",
    "The Organization", "The System",

    // Tier 10: Endgame Absurdity (entity form) — 20 titles
    "Executive Atmosphere", "Floating Governance Layer",
    "Strategic Cloudform", "Board Whisper",
    "The Initiative", "The Mandate",
    "The Directive", "Shareholder Echo",
    "Synergy Manifest", "Corporate Myth",
    "Revenue Apparition", "Alignment Engine",
    "Narrative Construct", "Human Capital Ghost",
    "Executive Abstraction", "Leadership Singularity",
    "Institutional Memory", "Permanent Interim",
    "The Problem", "You Are The Company"
  ];

  // Form mapping by tier (20 titles per tier)
  const formByTier = [
    "intern", "analyst", "manager", "manager",
    "executive", "executive", "executive",
    "entity", "entity", "entity"
  ];

  // Build visibility thresholds with increasing gaps
  const stages = [];
  let vis = 0;
  const baseGap = 50;

  for (let i = 0; i < titles.length; i++) {
    const tier = Math.floor(i / 20);
    const form = formByTier[tier] || "entity";

    stages.push({
      index: i,
      visibility: Math.floor(vis),
      title: titles[i],
      form
    });

    // Gap increases with tier — early promotions are faster, late ones are slower
    const tierMod = 1 + tier * 0.35;
    const posInTier = (i % 20) / 20;
    const gap = baseGap * tierMod * (1 + posInTier * 0.3);
    vis += gap;
  }

  return stages;
}

export const CAREER_STAGES = buildStages();

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
