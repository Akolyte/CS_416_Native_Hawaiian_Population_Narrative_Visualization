// lineChart.js
// Chart dimensions
const width = 400;
const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;
// Sample data
async function init() {
    // Retrieve data
    let data = await d3.csv('https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/main/js/data/pre_1778.csv')
    console.log('Data retrieved successfully:', data);
    // Parse the data
    data.forEach(d => {
        d.year = Number(d.year); // Convert year to string
        d.population = Number(d.population);
    });

    // Create the SVG element
    const svg = d3
    .select('svg')
    .append('g')
    .attr('width', width)
    .attr('height', height);

    // Create a scale for the x-axis
    const xScale = d3
    .scalePoint()
    .domain(data.map(d => d.year))
    .range([0, chartWidth])
    .padding(0.5);

    // Create a scale for the y-axis
    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.population)])
    .range([chartHeight, 0]);

    // Create the line generator
    const line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.population));

    // Append the line path
    svg
    .append('path')
    .datum(data)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2);
}