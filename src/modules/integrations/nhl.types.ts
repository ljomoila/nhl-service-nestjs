export type PlayerPosition = "C" | "L" | "R" | "D" | "G";
export type GameState = "FUT" | "OFF" | "FINAL";

export type NhlTeam = {
  teamAbbrev: {
    default: string;
  };
  teamName: {
    default: string;
  };
  teamCommonName: {
    default: string;
  };
};

export type NhlNow = {
  standings: NhlTeam[];
};

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

export type PeriodDescriptor = {
  number: number;
  periodType: "REG" | "OT";
  maxRegulationPeriods: number;
};

export type NhlBoxscore = {
  id: number;
  homeTeam: NhlBoxscoreTeam;
  awayTeam: NhlBoxscoreTeam;
  gameState: GameState;
  periodDescriptor: PeriodDescriptor;
  clock?: {
    timeRemaining: string;
    running: boolean;
    inIntermission: boolean;
  };
  playerByGameStats?: {
    awayTeam: NhlBoxscorePlayers;
    homeTeam: NhlBoxscorePlayers;
  };
};

export type NhlGameGame = {
  id: number;
  gameState: string;
  periodDescriptor: PeriodDescriptor;
};

export type NhlGameGameWeek = {
  date: string;
  games: NhlGameGame[];
};

export type NhlGamesByDate = {
  nextStartDate: string;
  gameWeek: NhlGameGameWeek[];
};

export type NhlTeamRoster = {
  forwards: NhlRosterPlayer[];
  defensemen: NhlRosterPlayer[];
  goalies: NhlRosterPlayer[];
};

export type NhlRosterPlayer = {
  id: number;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  headshot: string;
  birthCountry: string;
  birthDate: string;

  positionCode: PlayerPosition;
  shootsCatches: "L" | "R";

  weightInPounds: number;
  heightInInches: number;
  weightInKilograms: number;
  heightInCentimeters: number;
};

export type NhlPlayerStats = {
  id: number;
  assists: number;
  avgToi: string;
  faceoffWinningPctg: number;
  gameWinningGoals: number;
  gamesPlayed: number;
  goals: number;
  leagueAbbrev: string;
  otGoals: number;
  pim: number;
  plusMinus: number;
  points: number;
  powerPlayGoals: number;
  powerPlayPoints: number;
  season: number;
  sequence: number;
  shootingPctg: number;
  shorthandedGoals: number;
  shorthandedPoints: number;
  shots: number;
  position: PlayerPosition;
  teamCommonName: {
    default: string;
  };
  teamName: {
    default: string;
  };
  teamPlaceNameWithPreposition: {
    default: string;
  };
};

export type NhlPlayerSeasonStats = {
  featuredStats: {
    season: number;
  };
  seasonTotals: NhlPlayerStats[];
};
