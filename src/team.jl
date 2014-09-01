
type Team
    id
    name
    lobbyists

    score
    total_score

    Team(id, name) = new(id, name, Dict(), Any[], 0)
end

add_lobbyist(t::Team, lobbyist) = (t.lobbyists[lobbyist.id] = lobbyist)
