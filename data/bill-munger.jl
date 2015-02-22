
using JSON

bill_files = ["raw-112th-bills.json", "raw-113th-bills.json"]
bill_files_out = ["112th-bills.json", "113th-bills.json"]

bill_sets = [ JSON.parse(readall(f)) for f in bill_files ]

crp_categories = JSON.parse(readall("crp-categories.json"))

for bills in bill_sets
    for (aid, bill) in bills
        support = bill["positions"]["support"]
        oppose = bill["positions"]["oppose"]

        map!(support) do catcode
            crp_categories[catcode]["Industry"]
        end
        map!(oppose) do catcode
            crp_categories[catcode]["Industry"]
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
