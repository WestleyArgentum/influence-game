
using JSON

bill_files = ["raw-112th-bills.json", "raw-113th-bills.json"]
bill_files_out = ["112th-bills.json", "113th-bills.json"]

bill_sets = [ JSON.parse(readall(f)) for f in bill_files ]

industry_map = JSON.parse(readall("crp-category-map.json"))

for bills in bill_sets
    for (aid, bill) in bills
        support = bill["positions"]["support"]
        oppose = bill["positions"]["oppose"]

        map!(support) do catcode
            industry_map[catcode]
        end
        map!(oppose) do catcode
            industry_map[catcode]
        end

        bill["positions"]["support"] = unique(support)
        bill["positions"]["oppose"] = unique(oppose)
    end
end

for i in 1:length(bill_files_out)
    outfile = open(bill_files_out[i], "w")
    write(outfile, json(bill_sets[i]))
    close(outfile)
end

industries = { ind for (c, ind) in industry_map }
industries = unique(industries)

outfile = open("industries.json", "w")
write(outfile, json(industries))
close(outfile)
