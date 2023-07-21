const svg_id = '#native-hawaiian-population-chart';
const svg_id_with_legend = '#native-hawaiian-population-chart-with-legend';
const svg_id_with_legend_raw = 'native-hawaiian-population-chart-with-legend';
const svg_width = 800;
const svg_height = 500;

function clearChart(svg_id) {
    const svg = d3.select(svg_id);
    svg.selectAll("*").remove();
    if (document.getElementById(svg_id_with_legend_raw) != null) {
        const elementToRemove = document.getElementById(svg_id_with_legend_raw);
        elementToRemove.remove(); 
        const parentElement = document.querySelector(".flex-box-charts");
        const svg_new = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_new.setAttribute("width", "800");
        svg_new.setAttribute("height", "500");
        svg_new.setAttribute("id","native-hawaiian-population-chart")
        parentElement.appendChild(svg_new);
    }
}

// TODO Add function selectYear that extracts year and plugs it into our charts. 