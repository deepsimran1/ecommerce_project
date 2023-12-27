import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const ProductGraph = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchRegistrationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/productGraph",{
            headers:{
              Authorization:`Bearer ${token}`
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

        const productCounts = data.map((entry) => {
          return entry.count;
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Number of Products entered monthly",
              data: productCounts,
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              fill: false,
              tension:.35,
              pointHoverBackgroundColor:"rgba(75,192,192,1)"
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchRegistrationData();
  }, []);

  return (
    <>
      <div className="card p-3 shadow chart">
        <h2>Product Chart</h2>
        {chartData.labels && chartData.labels.length > 0 ? (
          <Line
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
                    text: "Number of Products",
                  },
                  ticks: {
                    stepSize: 2,
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                 
                },
              },
              elements: {
                point: {
                  radius: 3,
                  borderWidth: 2,
                  backgroundColor: "lavender",
                  borderColor: "rgba(75,192,192,1)",
                  pointHoverBackgroundColor:"rgba(75,192,192,1)",
                  pointStyle:'circle',
                  
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

export default ProductGraph;
