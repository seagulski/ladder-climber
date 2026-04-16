import Phaser from "phaser";
import BootScene from "./game/scenes/BootScene.js";
import TitleScene from "./game/scenes/TitleScene.js";
import GameScene from "./game/scenes/GameScene.js";
import DemotionScene from "./game/scenes/DemotionScene.js";
import GameOverScene from "./game/scenes/GameOverScene.js";
import LeaderboardScene from "./game/scenes/LeaderboardScene.js";
import PersonnelFileScene from "./game/scenes/PersonnelFileScene.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./game/constants.js";

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game",
  backgroundColor: "#120f16",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  roundPixels: true,
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    DemotionScene,
    GameOverScene,
    LeaderboardScene,
    PersonnelFileScene
  ]
});
