type ServerConfig = {
  core: {
    ticks: number;
    maxTimeToCompute: number;
  };
  game: {
    numberOfAI: number;
    playerSpeed: number;
    velocityFriction: number;
  };
};

export const GameServerConfig: ServerConfig = {
  core: {
    ticks: 30,
    maxTimeToCompute: 1000 / 30,
  },
  game: {
    numberOfAI: 5,
    playerSpeed: 10,
    velocityFriction: 0.8,
  },
};
