import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CustomBarChart({ data }) {
  const fixedLengthLabel = (label) => {
    if (!label) return "";
    return label.split(") ")[label.split(") ").length-1]
  };

  const chartData = {
    labels: (data.labels || []).map(fixedLengthLabel),
    datasets: [
      {
        label: data.metric || "Custom Metric",
        data: data.values || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default CustomBarChart;
