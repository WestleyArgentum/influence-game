

module InfluenceGame

using Base.Collections
using JSON

include("team.jl")
include("game.jl")


_game = Game("./data/112th-bills.json", "./data/112th-industries.json")

ateam = create_team(_game, "A Team")

all_industries = [ id for (id, data) in _game.industries ]
add_industries(ateam, all_industries)

end
