async function init_1796_1836(svg_width, svg_height, start_year=1796, end_year=1836, svg_id='#native-hawaiian-population-1796-1836') {
    const width = svg_width;
    const height = svg_height;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const default_start_year = 1796;
    const default_end_year = 1836;
    // Retrieve data
    const filePath = "main/js/data/1796_1836.csv"
    let data = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePath}`)
    // Parse the data into appropriate types
    data = data.filter(d => Number(d.year) >= start_year).filter(d => Number(d.year) <= end_year);
    data.forEach(d => {
        d.year = Number(d.year);
        d.population = Number(d.native_hawaiian_population_estimate);
    });

    if (start_year !== default_start_year && end_year !== default_end_year) {
        console.log("Please reset chart!")
    } else if (end_year !== default_end_year) {
        populateDropdown('start-years', data);
    } else if (start_year !== default_start_year) {
        populateDropdown('end-years', data);
    } else {
        populateDropdown('start-years', data);
        populateDropdown('end-years', data);
    }

    // Create the SVG element
    const svg = d3
    .select(svg_id)
    .append('g')
    .attr('width', width)
    .attr('height', height);

    // Create a scale for the x-axis
    const xScale = d3
    .scaleLinear()
    .domain([start_year, end_year])
    .range([0, chartWidth])

    // Create a scale for the y-axis
    const yScale = d3
    .scaleLinear()
    .domain([0, 300000])
    .range([chartHeight, 0]);

    // Create the line generator
    const line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.population));

    // Append the line path
    svg.append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', (d) => margin.left + xScale(d.year))
            .attr('cy', (d) => margin.top + yScale(d.population))
            .attr('r', 5)
            .style('fill', 'steelblue')
            .style('stroke', 'black')

    // Append X-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickValues([1796,1806,1816,1826,1836]).tickFormat(d3.format('~d')))

    // Append Y-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale).tickValues([0,50000,100000,150000,200000,250000,300000]).tickFormat(d3.format('~s')))

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

function populateDropdown(dropDownId, data) {
    const dropdown = document.getElementById(dropDownId)
    dropdown.innerHTML = '<option value="">-- Select Year --</option>'

    const minValue = d3.min(data, d => +d.year);
    const maxValue = d3.max(data, d => +d.year);

    data.forEach(d => {
        if (d.year < maxValue && d.year > minValue) {
            const option = document.createElement("option");
            option.value = Number(d.year);
            option.textContent = d.year;
            dropdown.appendChild(option);
        }
    })
}