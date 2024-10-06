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
  }
};

export const moveAIs = (AIs: Array<Player>) => {
  for (const ia of AIs) {
    //random 1 to 3
    const random = Math.floor(Math.random() * 3) + 1;
    if (ia.id.startsWith("IA") && random === 3) {
      ia.position.x +=
        (Math.floor(Math.random() * 3) - 1) * GameServerConfig.game.playerSpeed;
      ia.position.y +=
        (Math.floor(Math.random() * 3) - 1) * GameServerConfig.game.playerSpeed;
    }
  }
};

export const movePlayers = (players: Array<Player>) => {
  for (const player of players) {
    const { velocity, position } = player;

    // Apply velocity to position
    position.x += velocity.x;
    position.y += velocity.y;

    // Apply friction to gradually stop the player if no input is given
    velocity.x *= GameServerConfig.game.velocityFriction;
    velocity.y *= GameServerConfig.game.velocityFriction;

    // Check if velocity is sufficiently small to be set to zero
    if (Math.abs(velocity.x) < 0.01) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.01) velocity.y = 0;
  }
};
