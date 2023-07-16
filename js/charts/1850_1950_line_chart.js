// lineChart.js
// Chart dimensions
// Sample data
async function init() {
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    // Retrieve data
    let data = await d3.csv('https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/main/js/data/1850_1950.csv')
    console.log('Data retrieved successfully:', data);
    // Parse the data
    data.forEach(d => {
        d.year = Number(d.year); // Convert year to string
        d.native_hawaiian_population = Number(d.native_hawaiian_population);
        d.part_hawaiian_population = Number(d.part_hawaiian_population);
    });

    // Create the SVG element
    const svg = d3
    .select('#native-hawaiian-population-1850-1950')
    .append('g')
    .attr('width', width)
    .attr('height', height);

    // Create a scale for the x-axis
    const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, chartWidth])

    // Create a scale for the y-axis
    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.native_hawaiian_population)])
    .range([chartHeight, 0]);

    // Create the line generator
    const native_line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.native_hawaiian_population));

    const part_line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.part_hawaiian_population));

    // Append the line path for Native Hawaiians
    svg.append('path')
        .datum(data)
        .attr('d', native_line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

    // Append the line path for Part Hawaiians
    svg.append('path')
    .datum(data)
    .attr('d', part_line)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2);

    // Append X-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickValues([1850,1900,1950]).tickFormat(d3.format('~d')))

    // Append Y-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale).tickValues([0,20000,40000,60000,80000,100000]).tickFormat(d3.format('~s')))

    // Append x-axis label
    svg.append("text")
    .attr("y", height)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Year");

    // Append y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -(height/2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Population"); 
}