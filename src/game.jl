
type Game
    teams
    bills
    timeline

    function Game(bill_data_file)
        bills = JSON.parse(readall(bill_data_file))
        timeline = build_timeline(bills)

        new(Dict(), bills, timeline)
    end
end

add_lobbyist_to_team(g::Game, teamid, lobbyist) = add_lobbyist(g.teams[teamid], lobbyist)

function filter_overlapping_votes(bills)
    overlap = Any[]
    for (k,v) in bills
        for (k2,v2) in bills
            if k != k2 && v["num"] == v2["num"] && v["prefix"] == v2["prefix"]
                if !([k, k2] in overlap) && !([k2, k] in overlap)
                    push!(overlap, [k, k2])
                end
            end
        end
    end
    
    println(length(overlap), " overlapping actions found...")

    num = 0
    for (id1, id2) in overlap
        (haskey(bills, id1) && haskey(bills, id2)) || continue

        passed1 = get(bills[id1], "dateVote", -1)
        passed2 = get(bills[id2], "dateVote", -2)
        if passed1 == passed2
            println("removing: $id1, $id2")
            num += 1
            delete!(bills, id1)
        end
    end

    println(num, " removed!")

    bills
end

function filter_has_votes(bills)
    bills_with_votes = filter((k,b)->get(b, "action", "") == "passage", bills)
end

function build_timeline(bills)
    bills_with_votes = filter_has_votes(bills)
    bill_unique = filter_overlapping_votes(bills_with_votes)
end
