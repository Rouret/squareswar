import { GameServerConfig } from "domain/GameServerConfig";
import type { MoveEvent, Player } from "types";

export const handlePlayersMove = (moveEvent: MoveEvent, player: Player) => {
  switch (moveEvent.name) {
    case "up":
      player.velocity.y = -GameServerConfig.game.playerSpeed;
      break;
    case "down":
      player.velocity.y = GameServerConfig.game.playerSpeed;
      break;
    case "left":
      player.velocity.x = -GameServerConfig.game.playerSpeed;
      break;
    case "right":
      player.velocity.x = GameServerConfig.game.playerSpeed;
      break;
    case "stop_up":
      if (player.velocity.y < 0) player.velocity.y = 0; // Arrête si le joueur montait
      break;
    case "stop_down":
      if (player.velocity.y > 0) player.velocity.y = 0; // Arrête si le joueur descendait
      break;
    case "stop_left":
      if (player.velocity.x < 0) player.velocity.x = 0; // Arrête si le joueur allait à gauche
      break;
    case "stop_right":
      if (player.velocity.x > 0) player.velocity.x = 0; // Arrête si le joueur allait à droite
      break;
  }
};

export const moveAIs = (AIs: Array<Player>) => {
  /*  for (const ia of AIs) {
    const random = Math.floor(Math.random() * 3) + 1;
    if (ia.id.startsWith("IA") && random === 3) {
      ia.position.x +=
        (Math.floor(Math.random() * 3) - 1) * GameServerConfig.game.playerSpeed;
      ia.position.y +=
        (Math.floor(Math.random() * 3) - 1) * GameServerConfig.game.playerSpeed;
    }
  } */
};

export const movePlayers = (players: Array<Player>) => {
  for (const player of players) {
    const { velocity, position } = player;

    position.x += velocity.x;
    position.y += velocity.y;

    // Check if velocity is sufficiently small to be set to zero
    if (Math.abs(velocity.x) < 0.01) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.01) velocity.y = 0;
  }
};
