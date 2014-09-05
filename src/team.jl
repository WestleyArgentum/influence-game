
type Team
    id
    name
    industries

    score
    total_score

    Team(id, name) = new(id, name, Any[], Any[], 0)
end

add_industry(t::Team, industry) = push!(t.industries, industry)

function add_industries(t::Team, industries)
    for industry in industries
        add_industry(t, industry)
    end
end
