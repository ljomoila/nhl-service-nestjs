export type PlayerPosition = "C" | "L" | "R" | "D" | "G";

export type NhlBoxscoreTeam = {
  id: number;
  abbrev: string;
  commonName: {
    default: string;
  };
  score: number;
};

export interface NhlBoxscorePlayerStats {
  playerId: number;
  name: {
    /// "C. Caufield"
    default: string;
  };
  position: PlayerPosition;
  goals: number;
  assists: number;
}

export interface NhlBoxscoreGoalieStats extends NhlBoxscorePlayerStats {
  /** Time on ice, e.g. "20:15" */
  toi: string;
  saves: number;
  shotsAgainst: number;
  goalsAgainst: number;
}

export type NhlBoxscorePlayers = {
  forwards: NhlBoxscorePlayerStats[];
  defense: NhlBoxscorePlayerStats[];
  goalies: NhlBoxscoreGoalieStats[];
};

export type NhlBoxScore = {
  id: number;
  homeTeam: NhlBoxscoreTeam;
  awayTeam: NhlBoxscoreTeam;
  gameState: string;
  clock: {
    timeRemaining: string;
    running: boolean;
    inIntermission: boolean;
  };
  playerByGameStats: {
    awayTeam: NhlBoxscorePlayers;
    homeTeam: NhlBoxscorePlayers;
  };
};
