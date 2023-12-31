async function init_1796_1836(svg_width, svg_height, start_year=1796, end_year=1836, svg_id='#native-hawaiian-population-1796-1836') {
    const width = svg_width;
    const height = svg_height;
    const margin = { top: 20, right: 100, bottom: 40, left: 60 };
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

    const annotations = [{
        type: d3.annotationCalloutElbow,
        connector: { end: "arrow" },
        note: { 
            label: "resulted in 5,000–175,000 deaths, spread through contact with foreigners",
            title: "Oku‘u (pestilence)",
            wrap: 300
        },
        x: xScale(1804) + margin.left,
        y: yScale(210000) + margin.top,
        dx: 127,
        dy: -50,
    }].map(function(d){ d.color = "#E8336D"; return d})

      const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
}
