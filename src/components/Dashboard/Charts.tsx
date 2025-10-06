import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

// ✅ Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charts: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API endpoint: replace with your backend endpoint
        const res = await fetch("/api/sales/weekly");
        const data = await res.json();

        // Assume API returns something like:
        // { labels: ["Mon", "Tue", "Wed"], values: [1200, 1900, 800] }

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Sales",
              data: data.values,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.3)",
              tension: 0.4,
              pointBackgroundColor: "#3b82f6",
              pointRadius: 4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // ✅ Helps with responsiveness
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151", // dark gray
          font: { size: 12, weight: "normal" },
        },
      },
      title: {
        display: true,
        text: "Weekly Sales Trends",
        font: { size: 16, weight: "bold" },
        color: "#111827", // near-black
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280", // gray-500
        },
        grid: {
          color: "rgba(209, 213, 219, 0.2)", // light gray grid
        },
      },
      y: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.2)",
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80 w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Sales Trends
      </h3>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default Charts;
