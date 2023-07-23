async function init_1850_1950(svg_width, svg_height, start_year=1850, end_year=1950, svg_id='#native-hawaiian-population-1850-1950') {
    const width = svg_width;
    const height = svg_height;
    const margin = { top: 20, right: 100, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const default_start_year = 1850;
    const default_end_year = 1950;
    // Retrieve data
    const filePath = "main/js/data/1850_1950.csv";
    let data = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePath}`);
    // Parse the data into appropriate types
    data = data.filter(d => Number(d.year) >= start_year).filter(d => Number(d.year) <= end_year);
    data.forEach(d => {
        d.year = Number(d.year);
        d.native_hawaiian_population = Number(d.native_hawaiian_population);
        d.part_hawaiian_population = Number(d.part_hawaiian_population);
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

    // Delete other svg element
    const elementToRemove = document.getElementById("native-hawaiian-population-chart");
    elementToRemove.remove(); 
    
    // Create the SVG element
    const parentElement = document.querySelector(".flex-box-charts");
    const svg_new = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // Set attributes for the SVG element
    svg_new.setAttribute("width", "800");
    svg_new.setAttribute("height", "530");
    svg_new.setAttribute("id","native-hawaiian-population-chart-with-legend")
    parentElement.appendChild(svg_new);
    
    // Select the SVG element
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
    const native_line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.native_hawaiian_population));

    const part_line = d3
    .line()
    .x(d => margin.left + xScale(d.year))
    .y(d => margin.top + yScale(d.part_hawaiian_population));

    // Define legend
    const legendData = [
        { color: "steelblue", label: "Native-Hawaiian" },
        { color: "red", label: "Part-Hawaiian" }
      ];

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

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', (d) => margin.left + xScale(d.year))
            .attr('cy', (d) => margin.top + yScale(d.native_hawaiian_population))
            .attr('r', 5)
            .style('fill', 'steelblue')
            .style('stroke', 'black')
            .on("mouseover", (d) => {
                // Show the tooltip on mouseover
                const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", "translate(" + (xScale(d.year) + 10) + "," + (yScale(d.native_hawaiian_population) - 20) + ")");

                tooltip.append("text")
                    .attr("y", 15)
                    .text("Year: " + d.year);

                tooltip.append("text")
                    .attr("y", 30)
                    .text("Population: " + d.native_hawaiian_population);
            })
            .on("mouseout", (d,i) => {
                // Remove the tooltip on mouseout
                svg.select(".tooltip").remove();
            })

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', (d) => margin.left + xScale(d.year))
            .attr('cy', (d) => margin.top + yScale(d.part_hawaiian_population))
            .attr('r', 5)
            .style('fill', 'red')
            .style('stroke', 'black')
            .on("mouseover", (d) => {
                // Show the tooltip on mouseover
                const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", "translate(" + (xScale(d.year) + 10) + "," + (yScale(d.part_hawaiian_population) - 20) + ")");

                tooltip.append("text")
                    .attr("y", 15)
                    .text("Year: " + d.year);

                tooltip.append("text")
                    .attr("y", 30)
                    .text("Population: " + d.part_hawaiian_population);
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
    .text("Population"); 

    // Create legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left}, ${chartHeight + margin.bottom})`);

    // Create squares for each legend item
    const squareSize = 20;
    const squareSpacing = 10;

    const squares = legend.selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * (squareSize + squareSpacing))
    .attr("width", squareSize)
    .attr("height", squareSize)
    .style("fill", d => d.color);

    // Add labels to the legend
    const labelOffset = 5;

    const labels = legend.selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", squareSize + labelOffset)
    .attr("y", (d, i) => i * (squareSize + squareSpacing) + squareSize / 2)
    .attr("dy", "0.35em")
    .text(d => d.label);

    // Add the horizontal line annotation
    const annotations = [{
        type: d3.annotationXYThreshold,
        note: {
            title: "Native Hawaiian Population in 1836:",
            label: "100% Native Hawaiian population continues to trend downwards, while the number of Part-Hawaiian people begin to rise",
            wrap: 250
          },
        subject: {
            x1: xScale(1850) + margin.left,
            x2: xScale(1950) + margin.left,
        },
        x: xScale(1880) + margin.left,
        y: yScale(108579) + margin.top,
        dy: -100,
        dx: 162,
    }].map(function(d){ d.color = "#E8336D"; return d})

      const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
}
