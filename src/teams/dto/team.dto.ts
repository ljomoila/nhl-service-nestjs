import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, IsUUID } from "class-validator";

export class CreateTeamDTO {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  public value: string;
}

export class TeamDTO extends CreateTeamDTO {
  @ApiProperty()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsDate()
  public createdAt: Date;
}
