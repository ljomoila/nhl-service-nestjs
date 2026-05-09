export const CacheKeys = {
  teamsAll: "teams:all",
  teamById: (id: string) => `teams:${id}`,
  teamWithPlayers: "teams:with-players",
};
