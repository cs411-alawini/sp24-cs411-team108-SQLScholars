// src/GradeGraph.js
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

// Register the necessary components for your chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Grades for Anthropology Assignments",
    },
  },
};

const GradeGraph = ({ studentGrades }) => {
  const data = {
    labels: studentGrades.map((g) => g.assignmentId),
    datasets: [
      {
        label: "Grade",
        data: studentGrades.map((g) => g.grade),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} options={options} />;
};

export default GradeGraph;
