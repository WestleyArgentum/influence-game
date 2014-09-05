

module InfluenceGame

using JSON

include("game.jl")
include("team.jl")

_game = Game("./data/112th-bills.json")

end
