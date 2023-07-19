async function reshape() {
    const filePath = 'main/js/data/1900_2020_Population_By_County.csv'
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

    console.log(reshapedData)
    // Convert data to CSV string
    const csvData = d3.csvFormat(data);

    // Create a blob from the data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create an anchor element and set the href and download attributes
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '1900_2020_population_by_county_clean.csv';

    // Append the anchor element to the body and click it to start download
    document.body.appendChild(a);
    a.click();

    // Clean up the DOM: remove the anchor element
    document.body.removeChild(a);
}