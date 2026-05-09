import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, IsUUID } from "class-validator";
import { PlayerDTO } from "src/modules/players/dto/player.dto";

export class TeamDTO {
  @ApiProperty({ description: "Team's unique identifier (UUID)" })
  @IsUUID()
  public id: string;

  @ApiProperty({ description: "Team's name" })
  @IsString()
  public name: string;

  @ApiProperty({ description: "Team's short name" })
  @IsString()
  public shortName: string;

  @ApiProperty({ description: "Team's abbreviation" })
  @IsString()
  public abbreviation: string;

  @ApiProperty({
    description: "Date when the team was created in the local DB",
  })
  @IsDate()
  public createdAt: Date;

  @ApiProperty({
    description: "List of players in the team",
    type: () => [PlayerDTO],
  })
  public players: PlayerDTO[];
}
