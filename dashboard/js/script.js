(function renewData() {
  fetch("/api/result/entry")
    .then(response => response.json())
    .then(data => showCharts(data))
    .catch(error => console.log(error));

  setTimeout(renewData, 5000);
})();

const charts = {};

const countItems = (data, label) => {
  return data.reduce((acc, item) => {
    Object.keys(acc).includes(item[label])
      ? acc[item[label]]++
      : (acc[item[label]] = 1);
    return acc;
  }, {});
};

const getHours = (start, end) => {
  const hours = [];
  for (let i = start; i <= end; i++) {
    hours.push(i);
  }
  return hours;
};

const getUsePerHour = args => {
  const {data, label, start, end} = args;
  const usePerHour = {};

  getHours(start, end).map(hour => (usePerHour[hour] = 0));

  data.map(item => {
    const hour = new Date(item[label]).getHours();
    if (Object.keys(usePerHour).includes(hour.toString())) usePerHour[hour]++;
  });

  return usePerHour;
};

const generateChart = args => {
  const {element, data, label} = args;

  return new Chart(element, {
    type: "horizontalBar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: label,
          data: Object.values(data),
        },
      ],
    },
  });
};

const updateChart = args => {
  const {chart, data, label} = args;

  // Remove old data
  chart.data.labels.pop();
  chart.data.datasets.forEach(dataset => {
    dataset.data.pop();
  });

  // Add new data
  chart.data.labels = Object.keys(data);
  chart.data.datasets.forEach(dataset => {
    dataset.label = label;
    dataset.data = Object.values(data);
  });

  chart.update(0);
};

const updateHourChart = args => {
  const {chart, data, label} = args;
  // Remove old data
  chart.data.labels.pop();
  chart.data.datasets.forEach(dataset => {
    dataset.data.pop();
  });

  // Add new data
  chart.data.labels = Object.keys(data).map(
    hour => `${`0${hour}`.slice(-2)}:00`
  );
  chart.data.datasets.forEach(dataset => {
    dataset.label = label;
    dataset.data = Object.values(data).map((item, i) => ({
      t: new Date(item.datetime),
      y: Object.values(data)[i],
    }));
  });

  chart.update(0);
};

const showCharts = data => {
  const formattedData = countItems(data, "device");
  if (!charts.deviceChart) {
    const mix = document.getElementById("mixChart").getContext("2d");
    charts.deviceChart = generateChart({
      element: mix,
      data: formattedData,
      label: "Gebruik apparaten",
    });
  } else {
    updateChart({
      chart: charts.deviceChart,
      data: formattedData,
      label: "Gebruik apparaten",
    });
  }

  const formattedData2 = countItems(data, "action");
  if (!charts.actionChart) {
    const mix2 = document.getElementById("mixChart2").getContext("2d");
    charts.actionChart = generateChart({
      element: mix2,
      data: formattedData2,
      label: "Gebruik acties",
    });
  } else {
    updateChart({
      chart: charts.actionChart,
      data: formattedData2,
      label: "Gebruik acties",
    });
  }

  const formattedData3 = getUsePerHour({
    data: data,
    label: "datetime",
    start: 7,
    end: 17,
  });
  if (!charts.dayChart) {
    const mix3 = document.getElementById("mixChart3").getContext("2d");
    charts.dayChart = new Chart(mix3, {
      type: "line",
      data: {
        labels: Object.keys(formattedData3).map(
          hour => `${`0${hour}`.slice(-2)}:00`
        ),
        datasets: [
          {
            label: "Gebruik per uur",
            data: Object.values(formattedData3).map((item, i) => ({
              t: new Date(item.datetime),
              y: Object.values(formattedData3)[i],
            })),
          },
        ],
      },
    });
  } else {
    updateHourChart({
      chart: charts.dayChart,
      data: formattedData3,
      label: "Gebruik per uur",
    });
  }
};
