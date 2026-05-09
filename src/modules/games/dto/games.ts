import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { PlayerPosition } from "src/modules/integrations/nhl.types";

export class GamePlayerStatsDTO {
  @ApiProperty({ description: "Player's lastname e.g. 'Caufield'" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Player's country abbreviation e.g. 'CAN'" })
  @IsString()
  country: string;

  @ApiProperty({ description: "Number of goals scored by the player" })
  @IsNumber()
  goals: number;

  @ApiProperty({ description: "Number of assists made by the player" })
  @IsNumber()
  assists: number;

  @ApiProperty({
    description: "Player's position e.g. 'C', 'L', 'R', 'D', 'G'",
  })
  @IsString()
  position: PlayerPosition;
}

export class GameGoalieStatsDTO extends GamePlayerStatsDTO {
  @ApiProperty({ description: "Time on ice, e.g. '20:15'" })
  @IsString()
  toi: string;

  @ApiProperty({ description: "Number of saves made by the goalie" })
  @IsNumber()
  saves: number;

  @ApiProperty({ description: "Number of shots faced by the goalie" })
  @IsNumber()
  shotsAgainst: number;

  @ApiProperty({ description: "Number of goals allowed by the goalie" })
  @IsNumber()
  goalsAgainst: number;
}

export class GameTeamDTO {
  @ApiProperty({ description: "Team's unique (NHL) identifier" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Team's abbreviation e.g. 'MTL'" })
  @IsString()
  abbreviation: string;

  @ApiProperty({ description: "Team's full name e.g. 'Montreal Canadiens'" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Team's score in the game" })
  @IsNumber()
  score: number;

  @ApiProperty({
    type: [GamePlayerStatsDTO],
    description: "List of players in the team",
  })
  players: GamePlayerStatsDTO[];
}

export class GameBoxscoreDTO {
  @ApiProperty({ description: "Unique identifier for the game" })
  @IsNumber()
  gameId: number;

  @ApiProperty({ description: "Current period of the game" })
  @IsNumber()
  period: number;

  @ApiProperty({ description: "Time remaining in the current period" })
  @IsString()
  timeRemaining: string;

  @ApiProperty({ description: "Current status of the game" })
  @IsString()
  status: string;

  @ApiProperty({ type: GameTeamDTO, description: "Home team details" })
  homeTeam: GameTeamDTO;

  @ApiProperty({ type: GameTeamDTO, description: "Away team details" })
  awayTeam: GameTeamDTO;
}
