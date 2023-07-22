async function init_1850_1950(svg_width, svg_height, start_year=1850, end_year=1950, svg_id='#native-hawaiian-population-1850-1950') {
    const width = svg_width;
    const height = svg_height;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
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
        populateDropdown('start-years', data);
    } else if (start_year !== default_start_year) {
        populateDropdown('end-years', data);
    } else {
        populateDropdown('start-years', data);
        populateDropdown('end-years', data);
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
                    .text("Native Hawaiian Population: " + d.native_hawaiian_population);
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
                    .text("Part Hawaiian Population: " + d.part_hawaiian_population);
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