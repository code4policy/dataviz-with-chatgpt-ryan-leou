// Your JavaScript code for creating the bar chart
d3.csv("311_boston_data.csv").then(function(data) {
    // Assuming your CSV has headers "reason" and "count"

    // Sort data by count in descending order
    data.sort((a, b) => b.Count - a.Count);

    // Select only the top 10 reasons
    const top10Data = data.slice(0, 10);

    // Set up the SVG canvas
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 60, right: 20, bottom: 200, left: 100 }; // Increased top and bottom margin
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg1 = d3.select("#chart1").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale functions
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Map data to domain using top 10 data
    x.domain(top10Data.map(d => d.reason));
    y.domain([0, d3.max(top10Data, d => +d.Count)]);

    // Create bars
    svg1.selectAll(".bar")
        .data(top10Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.reason))
        .attr("width", x.bandwidth())
        .attr("y", d => y(+d.Count))
        .attr("height", d => height - y(+d.Count));

    // Add x-axis with rotated labels
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat((d, i) => {
                // Rotate labels 45 degrees
                return top10Data[i].reason.split(' ').join('\n'); // Insert line break for multiple lines
            })
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Add y-axis
    svg1.append("g")
        .call(d3.axisLeft(y));

    // Add title
    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Boston 311 Call Summary by Category");

  // Add subtitle
    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Hygiene and Cleanliness Dominate 311 Calls in Boston");

    // Add citation as hyperlink
    const citationLink = svg.append("a")
        .attr("xlink:href", "https://data.boston.gov/dataset/311-service-requests")
        .attr("target", "_blank") // Open link in a new tab
        .append("text")
        .attr("x", width - 55)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Source: City of Boston");

    // Add authorship credit
    svg1.append("text")
        .attr("x", width)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .text("Produced by Ryan Leou with assistance from Chat GPT");

}).catch(function(error) {
    console.log(error);
});
