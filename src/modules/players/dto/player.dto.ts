import { ApiProperty } from "@nestjs/swagger";
import { PlayerType } from "@prisma/client";
import { IsNumber, IsString, IsUUID } from "class-validator";
import { PlayerPosition } from "src/modules/integrations/nhl.types";

export class PlayerDTO {
  @ApiProperty({ description: "Player's unique identifier (UUID)" })
  @IsUUID()
  public id: string;

  @ApiProperty({ description: "Player's NHL unique identifier" })
  @IsNumber()
  public nhlId: number;

  @ApiProperty({ description: "Player's full name" })
  @IsString()
  public fullName: string;

  @ApiProperty({ description: "Player's first name" })
  @IsString()
  public firstName: string;

  @ApiProperty({ description: "Player's last name" })
  @IsString()
  public lastName: string;

  @ApiProperty({ description: "Player's nationality" })
  @IsString()
  public nationality: string;

  @ApiProperty({ description: "Player's type" })
  @IsString()
  public playerType: PlayerType;
}

export class PlayerWithSeasonStatsDTO extends PlayerDTO {
  @ApiProperty({ description: "Number of games played in the season" })
  public gamesPlayed: number;

  @ApiProperty({ description: "Number of goals scored in the season" })
  public goals: number;

  @ApiProperty({ description: "Number of assists in the season" })
  public assists: number;

  @ApiProperty({ description: "Total points in the season" })
  public points: number;

  @ApiProperty({ description: "Total penalty minutes in the season" })
  public penaltyMinutes: number;

  @ApiProperty({ description: "Plus/minus rating in the season" })
  public plusMinus: number;

  @ApiProperty({ description: "Average time on ice per game in the season" })
  public avgToi: string;

  @ApiProperty({
    description: "Player's faceoff winning percentage in the season",
  })
  public faceoffWinningPctg: number;

  @ApiProperty({ description: "Number of game-winning goals in the season" })
  public gameWinningGoals: number;

  @ApiProperty({ description: "Number of overtime goals in the season" })
  public otGoals: number;

  @ApiProperty({ description: "Total penalty minutes in the season" })
  public pim: number;

  @ApiProperty({ description: "Number of power play goals in the season" })
  public powerPlayGoals: number;

  @ApiProperty({ description: "Number of power play points in the season" })
  public powerPlayPoints: number;

  @ApiProperty({ description: "Number of shots taken in the season" })
  public shots: number;

  @ApiProperty({ description: "Shooting percentage in the season" })
  public shootingPctg: number;

  @ApiProperty({ description: "Number of shorthanded goals in the season" })
  public shorthandedGoals: number;

  @ApiProperty({ description: "Number of shorthanded points in the season" })
  public shorthandedPoints: number;

  @ApiProperty({ description: "Player's position" })
  public position: PlayerPosition;
}
