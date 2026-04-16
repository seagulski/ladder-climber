export const GAME_WIDTH = 432;
export const GAME_HEIGHT = 768;
export const HUD_HEIGHT = 52; // fixed panel at top

// 4 lane positions (x coordinates)
export const LANES = [72, 168, 264, 360];
export const LANE_COUNT = LANES.length;

// Player
export const PLAYER_SCALE = 3;
export const PLAYER_MOVE_DURATION = 140; // ms for lane swap
export const PLAYER_JUMP_VELOCITY = -340;
export const PLAYER_COYOTE_TIME = 100; // ms
export const PLAYER_JUMP_BUFFER = 100; // ms

// Scroll / climb
export const BASE_SCROLL_SPEED = 1.15;

// Ladders
export const LADDER_SEGMENT_HEIGHT = 64;
export const LADDER_WIDTH = 32;
export const LADDER_SPAWN_AHEAD = 400; // pixels above camera to spawn
export const LADDER_CLEANUP_BELOW = 200; // pixels below camera to destroy

// Floors
export const FLOOR_HEIGHT = 640;

// Visibility / promotion
export const VISIBILITY_PER_TICK = 0.08;   // passive gain from climbing
export const VISIBILITY_DODGE_BONUS = 3;    // near-miss bonus (future)
export const VISIBILITY_COFFEE_BONUS = 15;  // collecting coffee
export const COFFEE_SPEED_BOOST = 0.5;      // added to scroll speed
export const COFFEE_DURATION = 3000;        // ms

// Colors (for placeholder art)
export const COLORS = {
  player: 0x00ffcc,
  playerCoffee: 0xffcc00,
  ladder: 0x4a4a5a,
  ladderRung: 0x6a6a7a,
  background: 0x120f16,
  hud: 0xffffff,
  hudAccent: 0x00ffcc,
  hudBar: 0x00ffcc,
  hudBarBg: 0x2a2838,
  warning: 0xff6b6b,
  promotion: 0xffcc00
};
