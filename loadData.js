console.log("hi")

d3.text("Data/textData.txt", function(error,data) {
    console.log("error:", error);
    console.log("text:", data);
});

d3.csv("data/csvData.csv", function(error, data) {
    data.forEach(function(d) {
        d.export = parseFloat(d.export);
    })
    console.log("csv:", data);
});

d3.json("data/jsData.json", function(error, data){
    console.log("error:",error);
    console.log("text:", data);
});

console.log("END OF LINE");