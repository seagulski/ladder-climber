import { FLOOR_HEIGHT } from "../constants.js";

export const ZONES = {
  basement: {
    id: "basement",
    label: "LOWER OPERATIONS — BASEMENT RECORDS",
    startFloor: 1, endFloor: 50,
    bgColor: 0x0e0c12, accentColor: 0x2a2830,
    hazardDensityBase: 1, scrollSpeedMod: 1.0
  },
  cubicle: {
    id: "cubicle",
    label: "CUBICLE FARM — TEAM PRODUCTIVITY",
    startFloor: 51, endFloor: 125,
    bgColor: 0x12101a, accentColor: 0x33303e,
    hazardDensityBase: 2, scrollSpeedMod: 1.1
  },
  lower_mgmt: {
    id: "lower_mgmt",
    label: "MANAGEMENT — LOWER OPERATIONS",
    startFloor: 126, endFloor: 175,
    bgColor: 0x141220, accentColor: 0x3a3550,
    hazardDensityBase: 2, scrollSpeedMod: 1.2
  },
  middle_mgmt: {
    id: "middle_mgmt",
    label: "MANAGEMENT — CROSS-FUNCTIONAL DELIVERY",
    startFloor: 176, endFloor: 225,
    bgColor: 0x161428, accentColor: 0x443a58,
    hazardDensityBase: 3, scrollSpeedMod: 1.3
  },
  upper_mgmt: {
    id: "upper_mgmt",
    label: "MANAGEMENT — STRATEGIC ALIGNMENT",
    startFloor: 226, endFloor: 275,
    bgColor: 0x141225, accentColor: 0x3d3555,
    hazardDensityBase: 3, scrollSpeedMod: 1.4
  },
  executive: {
    id: "executive",
    label: "EXECUTIVE FLOOR — RESTRICTED ACCESS",
    startFloor: 276, endFloor: 350,
    bgColor: 0x0c0a18, accentColor: 0x2a2545,
    hazardDensityBase: 3, scrollSpeedMod: 1.5
  },
  void: {
    id: "void",
    label: "CORPORATE VOID",
    startFloor: 351, endFloor: 9999,
    bgColor: 0x060410, accentColor: 0x1a1530,
    hazardDensityBase: 4, scrollSpeedMod: 1.6
  }
};

const ZONE_ORDER = [
  ZONES.basement, ZONES.cubicle, ZONES.lower_mgmt,
  ZONES.middle_mgmt, ZONES.upper_mgmt, ZONES.executive, ZONES.void
];

// Floor name pools for special milestone floors
const FLOOR_NAMES = {
  basement: [
    "RECORDS ANNEX", "ARCHIVE STORAGE", "FACILITIES OVERFLOW",
    "SUPPORT SERVICES", "LOWER OPERATIONS", "UTILITY ACCESS"
  ],
  cubicle: [
    "TEAM PRODUCTIVITY", "CLIENT SERVICES", "STRATEGIC ENABLEMENT",
    "CROSS-FUNCTIONAL DELIVERY", "ALIGNMENT OPERATIONS", "BUSINESS SYSTEMS"
  ],
  lower_mgmt: [
    "PERFORMANCE OPERATIONS", "INITIATIVE PLANNING", "RESOURCE ALLOCATION",
    "DELIVERY EXCELLENCE", "TALENT MANAGEMENT"
  ],
  middle_mgmt: [
    "CROSS-FUNCTIONAL DELIVERY", "STAKEHOLDER ENGAGEMENT", "ORGANIZATIONAL DESIGN",
    "STRATEGIC PROGRAMS", "ENTERPRISE READINESS"
  ],
  upper_mgmt: [
    "STRATEGIC ALIGNMENT", "EXECUTIVE LIAISON", "VISION DELIVERY",
    "NARRATIVE OPERATIONS", "TRANSFORMATION OFFICE"
  ],
  executive: [
    "EXECUTIVE ACCESS", "BOARD OPERATIONS", "STRATEGIC COMMAND",
    "ENTERPRISE LEADERSHIP", "C-SUITE CORRIDOR"
  ],
  void: [
    "UNDEFINED", "NULL REFERENCE", "ABSTRACT LAYER",
    "RECURSIVE FUNCTION", "INFINITE LOOP"
  ]
};

export function getZoneForFloor(floorNumber) {
  for (const zone of ZONE_ORDER) {
    if (floorNumber >= zone.startFloor && floorNumber <= zone.endFloor) return zone;
  }
  return ZONES.void;
}

export function getFloorNumber(distanceClimbed) {
  return Math.floor(distanceClimbed / FLOOR_HEIGHT) + 1;
}

export function getDepthInZone(floorNumber, zone) {
  return floorNumber - zone.startFloor + 1;
}

export function getFloorLabel(floorNumber) {
  const zone = getZoneForFloor(floorNumber);
  // Only show named labels every 10 floors
  if (floorNumber % 10 !== 0) return null;
  const names = FLOOR_NAMES[zone.id] || FLOOR_NAMES.basement;
  const name = names[Math.floor(floorNumber / 10) % names.length];
  return `FLOOR ${floorNumber} — ${name}`;
}

export function getFloorData(floorNumber) {
  const zone = getZoneForFloor(floorNumber);
  const depth = getDepthInZone(floorNumber, zone);
  const totalFloors = zone.endFloor - zone.startFloor + 1;
  const progress = Math.min(depth / totalFloors, 1);

  return {
    floorNumber,
    zone,
    depth,
    progress,
    hazardDensity: zone.hazardDensityBase + Math.floor(progress * 2),
    rewardBias: Math.max(0.06, 0.28 - progress * 0.20),
    scrollSpeedMod: zone.scrollSpeedMod + progress * 0.1
  };
}
