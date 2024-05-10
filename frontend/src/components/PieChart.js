import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

function PieChart({ pieDataArray }) {
  return (
    <div className="chart-container">
      {pieDataArray &&
        pieDataArray.map((pieData, index) => (
          <React.Fragment key={index}>
            <h2 className="chart-header">Username: {pieData[0].username}</h2>
            <Pie
              data={{
                labels: pieData.map((item) => item.url),
                datasets: [
                  {
                    label: "Duration by URL",
                    data: pieData.map((item) => item.duration / 1000),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </React.Fragment>
        ))}
    </div>
  );
}

export default PieChart;
