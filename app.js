console.log("app.js loaded and running");

document.addEventListener("DOMContentLoaded", function () {
  // Global variables
  let chart;
  let currentIndex = 0;
  let dataFrames = []; // Array to hold each day's yield curve data (as objects with date and yields)
  let animationInterval = null;

  // --- STEP 1: Load CSV Data ---

  // --- STEP 2: Transform CSV Data ---
  // Convert each CSV row into an object with a date and an array of yields.
  function transformCSVData(csvData) {
    return csvData
      .filter((row) => row["Date"]) // Filter out any empty rows
      .map((row) => {
        return {
          date: row["Date"],
          yields: [
            parseFloat(row["1Mo"]),
            parseFloat(row["2Mo"]),
            parseFloat(row["3Mo"]),
            parseFloat(row["4Mo"]),
            parseFloat(row["6Mo"]),
            parseFloat(row["1Yr"]),
            parseFloat(row["2Yr"]),
            parseFloat(row["3Yr"]),
            parseFloat(row["5Yr"]),
            parseFloat(row["7Yr"]),
            parseFloat(row["10Yr"]),
            parseFloat(row["20Yr"]),
            parseFloat(row["30Yr"]),
          ],
        };
      });
  }

  console.log("first test dataFrames", dataFrames);
  // --- STEP 3: Initialize the Chart ---
function initChart() {
    if (!dataFrames || !dataFrames.length || !dataFrames[currentIndex]) {
        console.error("Required data not available for chart initialization");
        return;
    }

    const container = document.getElementById("container");
    if (!container) {
        console.error("Chart container element not found");
        return;
    }

    // Calculate global min/max from all frames' yields
    const globalMin = Math.min(...dataFrames.map(frame => Math.min(...frame.yields)));
    const globalMax = Math.max(...dataFrames.map(frame => Math.max(...frame.yields)));

    // Initialize with explicit configuration for all properties
    chart = Highcharts.chart("container", {
        chart: {
            type: 'line',
            animation: true
        },
        title: {
            text: "Yield Curve"
        },
        subtitle: {
            text: dataFrames[currentIndex].date
        },
        xAxis: {
            categories: [
                "1Mo", "2Mo", "3Mo", "4Mo", "6Mo", "1Yr", 
                "2Yr", "3Yr", "5Yr", "7Yr", "10Yr", "20Yr", "30Yr"
            ],
            title: {
                text: "Maturity"
            }
        },
        yAxis: {
            title: {
                text: "Yield (%)"
            },
            min: globalMin,
            max: globalMax
        },
        series: [{
            name: "Yield",
            data: dataFrames[currentIndex].yields
        }],
        plotOptions: {
            line: {
                animation: true,
                marker: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        }
    });

    console.log("Chart initialized with data:", {
        currentIndex,
        yields: dataFrames[currentIndex].yields,
        chartObject: chart
    });
}
  // --- STEP 4: Update the Chart for a New Frame ---
  function updateChart() {
    if (chart && dataFrames[currentIndex]) {
      console.log(chart);
      console.log("Updating chart with data:", dataFrames[currentIndex].yields);

      chart.series[0].setData(dataFrames[currentIndex].yields);

      // Update the subtitle with the current date
      chart.setTitle(null, { text: dataFrames[currentIndex].date });
    }
    document.getElementById("timeline").value = currentIndex;
  }

  // --- STEP 5: Set Up Controls ---
  function initControls() {
    const playPauseButton = document.getElementById("playPause");
    const timelineSlider = document.getElementById("timeline");

    // Toggle play/pause
    playPauseButton.addEventListener("click", function () {
      console.log("play button clicked");
      if (animationInterval) {
        stopAnimation();
        this.innerText = "Play";
      } else {
        startAnimation();
        this.innerText = "Pause";
      }
    });

    // Allow scrubbing through frames via the slider
    timelineSlider.addEventListener("input", function () {
      stopAnimation(); // Pause auto animation when scrubbing
      currentIndex = parseInt(this.value, 10);
      updateChart();
      playPauseButton.innerText = "Play"; // Update button text since auto play is stopped
    });
  }

  // --- STEP 6: Animation Functions ---
  function startAnimation() {
    // Update every 1 second (adjust as needed)
    if (!animationInterval) {
      animationInterval = setInterval(function () {
        currentIndex = (currentIndex + 1) % dataFrames.length;
        console.log("startAnimation called");
        updateChart();
      }, 1000);
    }
  }

  function stopAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }

  console.log("Starting PapaParse test...");
  Papa.parse("daily-treasury-rates.csv", {
    download: true,
    header: true,
    complete: function (results) {
      console.log("Parsed CSV Results:", results);
      dataFrames = transformCSVData(results.data);
      console.log("Transformed DataFrames:", dataFrames);
      // Set the timeline slider's max to match the number of data frames available
      document.getElementById("timeline").max = dataFrames.length - 1;
      // Only initialize chart if we have data
      if (dataFrames.length > 0) {
        initChart();
        initControls();
      } else {
        console.error("No data frames available after transformation");
      }
      console.log("PapaParse complete!");
    },
    error: function (err) {
      console.error("Error loading CSV:", err);
    },
  });
  // --- (Optional) Future: Integrate API Data ---
  // When ready to integrate the API, you might do something like:
  //
  // fetch("YOUR_API_ENDPOINT_HERE")
  //   .then(response => response.json())
  //   .then(apiData => {
  //     // Process apiData to update your dataFrames array
  //     // Possibly update the CSV file or use the API data directly
  //     // Then call updateChart() to refresh the visualization
  //   })
  //   .catch(error => console.error("API fetch error:", error));
});
