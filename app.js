document.addEventListener("DOMContentLoaded", function () {
  let chart; // Declare the chart variable outside of the function for later reference
  let index = 0;

  let ds0 = [10, 5, 1];
  let ds1 = [5, 5, 5];
  let ds2 = [1, 5, 10];
  let Data = [ds0, ds1, ds2];

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
        min: 0, // Static minimum for simplicity
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
