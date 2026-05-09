import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, IsUUID } from "class-validator";
import { PlayerDTO } from "src/modules/players/dto/player.dto";

export class TeamDTO {
  @ApiProperty()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public shortName: string;

  @ApiProperty()
  @IsString()
  public abbreviation: string;

  @ApiProperty()
  @IsDate()
  public createdAt: Date;

  @ApiProperty({ type: () => [PlayerDTO] })
  public players: PlayerDTO[];
}
