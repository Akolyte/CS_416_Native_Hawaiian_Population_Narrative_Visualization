import { init_pre_1778 } from 'charts/pre_1778_line_chart.js';

const svg_id = '#native-hawaiian-population-chart';
const svg_id_with_legend = 'native-hawaiian-population-chart-with-legend';
const svg_width = 800;
const svg_height = 500;
var start_year = undefined;
var end_year = undefined;
var current_chart = 'pre_1778';

function clearChart(svg_id) {
    const svg = d3.select(svg_id);
    svg.selectAll("*").remove();
    if (document.getElementById(svg_id_with_legend) != null) {
        const elementToRemove = document.getElementById(svg_id_with_legend);
        elementToRemove.remove(); 
        const parentElement = document.querySelector(".flex-box-charts");
        const svg_new = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_new.setAttribute("width", "800");
        svg_new.setAttribute("height", "500");
        svg_new.setAttribute("id","native-hawaiian-population-chart")
        parentElement.appendChild(svg_new);
    }
}

function selectStartYear() {
    const selectedStartYear = document.getElementById("start-years").value;
    if (selectedStartYear) {
        alert("You selected year: " + selectedStartYear);
        start_year = selectedStartYear;
    }
}

function selectEndYear() {
    const selectedEndYear = document.getElementById("end-years").value;
    if (selectedEndYear) {
        alert("You selected year: " + selectedEndYear);
        end_year = selectedEndYear;
    }
}

function initChart(startYear, endYear, currentChart) {
    if (currentChart === 'pre_1778') {
        init_pre_1778(svg_width, svg_height, startYear, endYear, svg_id)
    }
}