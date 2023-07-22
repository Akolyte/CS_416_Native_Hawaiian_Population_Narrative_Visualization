async function init_entire_timeline(svg_width, svg_height, start_year=1778, end_year=2020, svg_id='#native-hawaiian-population-entire-timeline') {
    const width = svg_width;
    const height = svg_height;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const default_start_year = 1778;
    const default_end_year = 2020;
    // Retrieve data
    const filePaths = ["main/js/data/pre_1778.csv","main/js/data/1796_1836.csv","main/js/data/1850_1950.csv","main/js/data/1960_2020.csv"]
    let data1 = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePaths[0]}`)
    let data2 = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePaths[1]}`)
    let data3 = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePaths[2]}`)
    let data4 = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePaths[3]}`)
    // Parse the data into appropriate types
    data1.forEach(d => {
        if (Number(d.year) === 1778) {
            d.year = Number(d.year);
            d.population = Number(d.population);
        }
    });
    data1 = data1.filter(d => {
        return d.year == 1778
    });
    data2.forEach(d => {
        d.year = Number(d.year);
        d.population = Number(d.native_hawaiian_population_estimate);
    });
    data3.forEach(d => {
        d.year = Number(d.year);
        d.native_hawaiian_population = Number(d.native_hawaiian_population);
        d.part_hawaiian_population = Number(d.part_hawaiian_population);
        d.population = d.native_hawaiian_population + d.part_hawaiian_population
    });
    data4.forEach(d => {
        d.year = Number(d.year);
        d.population = Number(d.total_hawaiian_descent_population);
    });

    let data = [];
    data = data.concat(data1)
    data = data.concat(data2)
    data = data.concat(data3)
    data = data.concat(data4)

    data = data.filter(d => Number(d.year) >= start_year).filter(d => Number(d.year) <= end_year);

    if (start_year !== default_start_year && end_year !== default_end_year) {
        console.log("Please reset chart!")
    } else if (end_year !== default_end_year) {
        populateDropdownFilterEnd('start-years', data);
    } else if (start_year !== default_start_year) {
        populateDropdownFilterStart('end-years', data);
    } else {
        populateDropdownFull('start-years', data);
        populateDropdownFull('end-years', data);
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
    .domain([0, 400000])
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
            .attr('cx', d => margin.left + xScale(d.year))
            .attr('cy', d => margin.top + yScale(d.population))
            .attr('r', 3)
            .style('fill', 'steelblue')
            .style('stroke', 'black')
            .on("mouseover", (d) => {
                // Show the tooltip on mouseover
                const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", "translate(" + (xScale(d.year) + 10) + "," + (yScale(d.population) - 20) + ")");

                tooltip.append("text")
                    .attr("y", 15)
                    .text("Year: " + d.year);

                tooltip.append("text")
                    .attr("y", 30)
                    .text("Population: " + d.population);
            })
            .on("mouseout", (d,i) => {
                // Remove the tooltip on mouseout
                svg.select(".tooltip").remove();
            })

    // Append X-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('~d')))

    // Append Y-axis
    svg.append('g')
        .attr("transform",`translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale).tickFormat(d3.format('~s')))

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
    .text("Native Hawaiian Population"); 
}
