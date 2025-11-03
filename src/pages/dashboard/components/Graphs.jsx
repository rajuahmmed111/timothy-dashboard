
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const Graphs = () => {
  const barData = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        label: "Users",
        data: [100, 150, 120, 250, 280, 200, 250, 100, 280, 350, 380, 420],
        backgroundColor: "#22c55e",
        borderRadius: 0,
        borderSkipped: false,
      },
    ],
  };

  const lineData = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Growth",
        data: [2, 4, 3, 8, 6, 4, 8, 20],
        borderColor: "#15803d",
        backgroundColor: "rgba(21, 128, 61, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#15803d",
        pointBorderColor: "#15803d",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#22c55e",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          stepSize: 100,
          callback: function (value) {
            return value === 0 ? "0" : value;
          },
        },
        beginAtZero: true,
        max: 500,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#15803d",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
          borderDash: [3, 3],
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          stepSize: 4,
          callback: function (value) {
            return value < 10 ? "0" + value : value;
          },
        },
        beginAtZero: true,
        max: 20,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-darkGray">User Grow</h3>
          <div className="flex items-center gap-2 text-brandGray cursor-pointer">
            <span className="text-sm">Month</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-darkGray">
            Revenue Growth
          </h3>
          <div className="flex items-center gap-2 text-brandGray cursor-pointer">
            <span className="text-sm">Month</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="h-64">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};
