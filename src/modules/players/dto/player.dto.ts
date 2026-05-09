import { ApiProperty } from "@nestjs/swagger";
import { PlayerType } from "@prisma/client";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class PlayerDTO {
  @ApiProperty()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsNumber()
  public nhlId: number;

  @ApiProperty()
  @IsString()
  public fullName: string;

  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  public nationality: string;

  @ApiProperty()
  @IsString()
  public playerType: PlayerType;
}

export class PlayerWithSeasonStatsDTO extends PlayerDTO {
  @ApiProperty()
  public gamesPlayed: number;

  @ApiProperty()
  public goals: number;

  @ApiProperty()
  public assists: number;

  @ApiProperty()
  public points: number;

  @ApiProperty()
  public penaltyMinutes: number;

  @ApiProperty()
  public plusMinus: number;
}
