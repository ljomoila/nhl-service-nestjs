import { IsString } from "class-validator";

export class CreateTeamDto {
  @IsString()
  public name: string;

  @IsString()
  public value: string;
}
