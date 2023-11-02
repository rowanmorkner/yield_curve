document.addEventListener("DOMContentLoaded", function () {
  let chart; // Declare the chart variable outside of the function for later reference
  let index = 0;

  let ds12302022 = [
    4.12, 4.41, 4.42, 4.69, 4.76, 4.73, 4.41, 4.22, 3.99, 3.96, 3.88, 4.14,
    3.97,
  ];
  let ds12292022 = [
    4.04, 4.39, 4.45, 4.66, 4.73, 4.71, 4.34, 4.16, 3.94, 3.91, 3.83, 4.09,
    3.92,
  ];
  let ds12282022 = [
    3.86, 4.33, 4.46, 4.66, 4.75, 4.71, 4.31, 4.18, 3.97, 3.97, 3.88, 4.13,
    3.98,
  ];
  let ds12272022 = [
    3.87, 4.32, 4.46, 4.66, 4.76, 4.75, 4.32, 4.17, 3.94, 3.93, 3.84, 4.1, 3.93,
  ];
  let ds12232022 = [
    3.8, 4.2, 4.34, 4.59, 4.67, 4.66, 4.31, 4.09, 3.86, 3.83, 3.75, 3.99, 3.82,
  ];
  let ds12222022 = [
    3.8, 4.2, 4.35, 4.57, 4.66, 4.64, 4.24, 4.02, 3.79, 3.77, 3.67, 3.91, 3.73,
  ];

  let Data = [
    ds12302022,
    ds12292022,
    ds12282022,
    ds12272022,
    ds12232022,
    ds12222022,
  ];
  let globalMin = Math.min(...Data.flat());
  function drawChart() {
    chart = Highcharts.chart("container", {
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
        min: globalMin, // Static minimum for simplicity
      },
      series: [
        {
          name: "Yield",
          data: Data[index],
        },
      ],
    });
  }

  // Initially draw the chart
  drawChart();

  // Handle the button click to toggle data
  document.getElementById("jumpForward").addEventListener("click", function () {
    // Increase the index and wrap around if necessary
    index = (index + 1) % Data.length;
    console.log("Current Data Index:", index);
    // Update the series data
    chart.series[0].setData(Data[index]);
  });

  document.getElementById("jumpBack").addEventListener("click", function () {
    console.log("Back button clicked!"); // For testing
    // Rest of your logic...
    index = (index - 1) % Data.length;

    // Update the series data
    chart.series[0].setData(Data[index]);
  });
});
