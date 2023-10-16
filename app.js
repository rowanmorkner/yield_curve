document.addEventListener("DOMContentLoaded", function () {
  var data = { csvURL: window.location.origin + "/test.csv" };

  let minValue = 0; // Calculate the minimum value
  // let minValue = Math.min(...data); // Calculate the minimum value

  Highcharts.chart("container", {
    title: {
      text: "Yield Curve",
    },
    subtitle: {
      text: "Data from: 10/02/2023",
    },
    xAxis: {
      categories: [
        "1 Mo",
        "2 Mo",
        "3 Mo",
        "4 Mo",
        "6 Mo",
        "1 Yr",
        "2 Yr",
        "3 Yr",
        "5 Yr",
        "7 Yr",
        "10 Yr",
        "20 Yr",
        "30 Yr",
      ],
      title: {
        text: "Maturity",
      },
    },
    yAxis: {
      title: {
        text: "Yield (%)",
      },
      min: minValue, // Use the calculated minimum value
    },
    series: [
      {
        name: "Yield",
        // data: { csv: csvData },
        data: fakeData[index],
      },
    ],
  });
});
let index = 1;
let ds1 = [
  5.6, 5.61, 5.61, 5.63, 5.57, 5.37, 4.96, 4.74, 4.62, 4.66, 4.66, 5.03, 4.85,
];
let fakeData = [[1, 2, 3], ds1, [7, 6, 8]];
