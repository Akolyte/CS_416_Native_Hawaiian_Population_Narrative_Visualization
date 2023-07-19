const d3 = require('d3');

async function reshape() {
    const filePath = 'js/data/1900_2020_Population_By_County.csv'
    let data = await d3.csv(`https://raw.githubusercontent.com/Akolyte/CS_416_Native_Hawaiian_Population_Narrative_Visualization/${filePath}`)
    let reshapedData = [];

    data.forEach(row => {
        Object.keys(row).forEach(county => {
            if (county !== 'Year') { // Assuming 'year' is a column in your wide data
                reshapedData.push({
                    year: row.Year,
                    county: county,
                    population: row[county]
                });
            }
        });
    });

    console.log(data)
}

reshape()