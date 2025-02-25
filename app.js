console.log("app.js loaded and running");

document.addEventListener("DOMContentLoaded", function () {
  // Global variables
  let chart;
  let currentIndex = 0;
  let dataFrames = []; // Array to hold each day's yield curve data (with dynamic categories)
  let daysPerSecond = 1; // Default speed: 1 day per second

  // For high frame-rate animation
  let animationFrameId = null;
  let lastTimestamp = null;
  let accumulator = 0;

  // --- STEP 1: Load CSV Data ---
  // We'll load the CSV at the end using Papa.parse.

  // --- STEP 2: Transform CSV Data ---
  // This function now uses the CSV header order (from results.meta.fields) to dynamically
  // build the list of available categories (maturities) and the corresponding yields.
  
function transformCSVData(csvData, fields) {
  const transformed = csvData
    .filter(
      (row) =>
        row["Date"] &&
        row["Date"].trim() !== "" &&
        row["Date"].toLowerCase() !== "date" // filter out repeated header rows
    )
    .map((row) => {
      let categories = [];
      let yields = [];
      fields.forEach((field) => {
        if (field !== "Date") {
          const value = row[field];
          // Only include this field if it has a non-empty value
          if (value && value.trim() !== "") {
            categories.push(field);
            yields.push(parseFloat(value));
          }
        }
      });
      return {
        date: row["Date"],
        categories: categories,
        yields: yields,
      };
    });
  // Reverse to have the earliest date at index 0 (assuming CSV is newest-first)
  transformed.reverse();
  return transformed;
}

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

    // Calculate global min/max from all frames' yields (across all available values)
    const allYields = dataFrames.flatMap((frame) => frame.yields);
    const globalMin = Math.min(...allYields);
    const globalMax = Math.max(...allYields);

    chart = Highcharts.chart("container", {
      chart: {
        type: "line",
        animation: true,
      },
      title: {
        text: "Yield Curve",
      },
      subtitle: {
        text: dataFrames[currentIndex].date,
      },
      xAxis: {
        categories: dataFrames[currentIndex].categories,
        title: {
          text: "Maturity",
        },
      },
      yAxis: {
        title: {
          text: "Yield (%)",
        },
        // Uncomment below if you want to fix the y-axis range:
        // min: globalMin,
        // max: globalMax,
      },
      series: [
        {
          name: "Yield",
          color: "#0071A7",
          data: dataFrames[currentIndex].yields,
        },
      ],
      plotOptions: {
        line: {
          animation: true,
          marker: {
            enabled: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
    });

    console.log("Chart initialized with data:", {
      currentIndex,
      categories: dataFrames[currentIndex].categories,
      yields: dataFrames[currentIndex].yields,
    });
  }

  // --- STEP 4: Update the Chart for a New Frame ---
  function updateChart() {
    if (chart && dataFrames[currentIndex]) {
      console.log("Updating chart with data:", dataFrames[currentIndex].yields);
      // Update the series data
      chart.series[0].setData(dataFrames[currentIndex].yields);
      // Update the xAxis categories to reflect the available columns for this row
      chart.xAxis[0].setCategories(dataFrames[currentIndex].categories);
      // Update the subtitle with the current date
      chart.setTitle(null, { text: dataFrames[currentIndex].date });
    }
    // Update the timeline slider's position
    document.getElementById("timeline").value = currentIndex;
  }

  // --- STEP 5: Set Up Controls ---
  function initControls() {
    const playPauseButton = document.getElementById("playPause");
    const timelineSlider = document.getElementById("timeline");
    const speedSlider = document.getElementById("speedSlider");

    // Initialize daysPerSecond from the slider's default value
    daysPerSecond = parseInt(speedSlider.value, 10) || 1;

    // Update speed when the slider is changed
    speedSlider.addEventListener("input", function () {
      daysPerSecond = parseInt(this.value, 10);
      console.log("Speed updated to:", daysPerSecond, "days per second");
    });

    // Toggle play/pause button
    playPauseButton.addEventListener("click", function () {
      console.log("Play/Pause button clicked");
      if (animationFrameId) {
        stopAnimation();
        this.innerText = "Play";
      } else {
        startAnimation();
        this.innerText = "Pause";
      }
    });

    // Allow scrubbing through frames via the timeline slider
    timelineSlider.addEventListener("input", function () {
      stopAnimation(); // Pause auto-animation when scrubbing
      currentIndex = parseInt(this.value, 10);
      updateChart();
      playPauseButton.innerText = "Play"; // Reset button text since auto-play is stopped
    });
  }

  // --- STEP 6: High Frame-Rate Animation Functions ---
  // This uses requestAnimationFrame to update the chart at a high frame rate,
  // while advancing the data by whole days at the rate specified by daysPerSecond.
  function animationTick(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const delta = (timestamp - lastTimestamp) / 1000; // seconds elapsed
    lastTimestamp = timestamp;

    // Accumulate fractional days based on the elapsed time and speed setting
    accumulator += daysPerSecond * delta;

    // When a full day (or more) has accumulated, advance the current index
    if (accumulator >= 1) {
      const daysToAdvance = Math.floor(accumulator);
      currentIndex = (currentIndex + daysToAdvance) % dataFrames.length;
      accumulator -= daysToAdvance;
      updateChart();
    }
    animationFrameId = requestAnimationFrame(animationTick);
  }

  function startAnimation() {
    if (!animationFrameId) {
      lastTimestamp = null;
      accumulator = 0;
      animationFrameId = requestAnimationFrame(animationTick);
    }
  }

  function stopAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // --- STEP 7: Load the CSV and Initialize ---
  console.log("Starting PapaParse...");


Papa.parse("daily-treasury-rates.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    console.log("Parsed CSV Results:", results);

    // Get the CSV header fields (in order)
    const fields = results.meta.fields;
    console.log("CSV fields:", fields);

    // Transform the CSV data using the fields order to preserve column order
    dataFrames = transformCSVData(results.data, fields);
    console.log("Transformed DataFrames:", dataFrames);

    // Set the timeline slider's max to match the number of data frames available
    document.getElementById("timeline").max = dataFrames.length - 1;

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
});
