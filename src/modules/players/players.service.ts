import { Injectable } from "@nestjs/common";
import { PlayerWithSeasonStatsDTO } from "./dto/player.dto";
import { NhlService } from "src/modules/integrations/nhl.service";

@Injectable()
export class PlayersService {
  constructor(private readonly nhlService: NhlService) {}

  async getCurrentSeasonStats(
    nhlId: number,
  ): Promise<PlayerWithSeasonStatsDTO> {
    return await this.nhlService.getPlayersCurrentSeasonStats(nhlId);
  }
}
