document.addEventListener('DOMContentLoaded', function () {
    const data = [5.56, 5.60, 5.62, 5.62, 5.58, 5.49, 5.12, 4.88, 4.72, 4.73, 4.69, 5.00, 4.81];
    const minValue = Math.min(...data); // Calculate the minimum value

    Highcharts.chart('container', {
        title: {
            text: 'Yield Curve',
        },
        subtitle: {
            text: 'Data from: 10/02/2023',
        },
        xAxis: {
            categories: ['1 Mo', '2 Mo', '3 Mo', '4 Mo', '6 Mo', '1 Yr', '2 Yr', '3 Yr', '5 Yr', '7 Yr', '10 Yr', '20 Yr', '30 Yr'],
            title: {
                text: 'Time'
            }
        },
        yAxis: {
            title: {
                text: 'Yield (%)'
            },
            min: minValue // Use the calculated minimum value
        },
        series: [{
            name: 'Yield',
            data: data
        }]
    });
});
