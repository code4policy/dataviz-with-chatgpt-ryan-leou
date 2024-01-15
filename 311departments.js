// Your JavaScript code for creating the bar chart
d3.csv("boston_311_2023.csv").then(function(data) {

    // Populate neighborhood dropdown options
    const neighborhoods = Array.from(new Set(data.map(d => d.neighborhood)));
    const neighborhoodDropdown = d3.select("#neighborhoodDropdown");
    
    neighborhoodDropdown.selectAll("option")
        .data(neighborhoods)
        .enter().append("option")
        .text(d => d);

    // Initial rendering
    updateBarChart(data);

    // Event listener for dropdown change
    neighborhoodDropdown.on("change", function() {
        const selectedNeighborhood = this.value;
        const filteredData = data.filter(d => d.neighborhood === selectedNeighborhood);
        updateBarChart(filteredData, selectedNeighborhood);
    });

    // Function to update the bar chart


    function updateBarChart(filteredData, selectedNeighborhood) {
        const groupedData = d3.nest()
            .key(d => d.subject)
            .entries(filteredData);

        groupedData.sort((a, b) => b.values.length - a.values.length);

        const top10Data = groupedData.slice(0, 10);

        const svgWidth = 600;
        const svgHeight = 400;
        const margin = { top: 60, right: 20, bottom: 200, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        d3.select("#chart2 svg").remove(); // Remove previous chart

         const svg2 = d3.select("#chart2").append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);

        x.domain(top10Data.map(d => d.key));
        y.domain([0, d3.max(top10Data, d => d.values.length)]);

        svg2.selectAll(".bar")
            .data(top10Data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.key))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.values.length))
            .attr("height", d => height - y(d.values.length));

        svg2.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat((d, i) => top10Data[i].key.split(' ').join('\n'))
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg2.append("g")
            .call(d3.axisLeft(y));

        svg2.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text(`Boston 311 Call Summary - ${selectedNeighborhood}`);

        const citationLink = svg2.append("a")
            .attr("xlink:href", "https://data.boston.gov/dataset/311-service-requests")
            .attr("target", "_blank")
            .append("text")
            .attr("x", width - 55)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("text-decoration", "underline")
            .text("Source: City of Boston");

        svg2.append("text")
            .attr("x", width)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text("Produced by Ryan Leou with assistance from Chat GPT");
    }

}).catch(function(error) {
    console.log(error);
});
