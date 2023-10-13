document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    let allData = [];

    // Fetch and parse CSV data
    fetch('daily-treasury-rates.csv')
        .then(response => response.text())
        .then(csv => {
            allData = Papa.parse(csv, {
                header: true,
                dynamicTyping: true
            }).data;

            // Populate the date selector
            populateDateSelector(allData);

            // Initialize chart with the first data row if available
            if (allData.length > 0) {
                updateChart(Object.values(allData[0]).slice(1));
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Event listener for date selector changes
    document.getElementById('dateSelector').addEventListener('change', function(event) {
        const selectedDate = event.target.value;
        const selectedData = allData.find(row => row.Date === selectedDate);
        if (selectedData) {
            updateChart(Object.values(selectedData).slice(1)); 
        }
    });

    // Function to populate date selector
    function populateDateSelector(data) {
        data.forEach(row => {
            const option = document.createElement('option');
            option.value = row.Date;
            option.textContent = row.Date;
            document.getElementById('dateSelector').appendChild(option);
        });
    }

    // Function to update chart
    function updateChart(data) {
        Highcharts.chart('container', {
            title: {
                text: 'Yield Curve',
            },
            xAxis: {
                categories: ['1 Mo', '2 Mo', '3 Mo', '4 Mo', '6 Mo', '1 Yr', '2 Yr', '3 Yr', '5 Yr', '7 Yr', '10 Yr', '20 Yr', '30 Yr'],
            },
            yAxis: {
                title: {
                    text: 'Yield (%)'
                },
                min: Math.min(...data) 
            },
            series: [{
                name: 'Yield',
                data: data
            }]
        });
    }
});
