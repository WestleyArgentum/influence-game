

module InfluenceGame

using Base.Collections
using JSON

include("team.jl")
include("game.jl")


_game = Game("./data/112th-bills.json")

ateam = create_team(_game, "A Team")


end
