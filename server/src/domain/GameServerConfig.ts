type ServerConfig = {
  core: {
    ticks: number;
  };
  game: {
    numberOfAI: number;
    playerSpeed: number;
  };
};

export const GameServerConfig: ServerConfig = {
  core: {
    ticks: 30,
  },
  game: {
    numberOfAI: 5,
    playerSpeed: 10,
  },
};
