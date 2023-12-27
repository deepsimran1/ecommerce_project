import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const UserGraph = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchRegistrationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/monthlyReg",{
            headers:{
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const data = response.data;

        if (!data || data.length === 0) {
          console.error("No registration data available.");
          return;
        }

        const months = data.map((entry) => {
          return new Date(`${entry._id.year}-${entry._id.month}`);
        });

        const userCounts = data.map((entry) => {
          return entry.count;
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Number of Users Registered Monthly",
              data: userCounts,
              backgroundColor: "rgba(75,192,192,0.5)",
              borderWidth: 1,
              borderRadius: 10,
              hoverBackgroundColor: "rgba(75,192,192,1)"
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchRegistrationData();
  }, []);

  return (
    <>
      <div className="card p-3 shadow">
        <h2>User Registration Chart</h2>
        {chartData.labels && chartData.labels.length > 0 ? (
          <Bar
            key={JSON.stringify(chartData.labels)}
            data={chartData}
            options={{
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "month",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Users",
                  },
                  ticks: {
                    stepSize: 2,
                  },
                },
              },
            }}
          />
        ) : (
          <p>No data available for the chart.</p>
        )}
      </div>
    </>
  );
};

export default UserGraph;
