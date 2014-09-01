
type Game
    teams

    bills
    lobbyists

    timeline

    Game() = new(Dict(), Dict(), Dict(), Any[])
end

add_lobbyist_to_team(g::Game, teamid, lobbyist) = add_lobbyist(g.teams[teamid], lobbyist)