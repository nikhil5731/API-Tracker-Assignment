import React, { useState, useEffect } from "react";
import APIHitsTable from "./components/APIHitsTable";
import BrowserPieChart from "./components/BrowserPieChart.jsx";
import CustomBarChart from "./components/CustomBarChart";

function App() {
  const [apiHits, setApiHits] = useState([]);
  const [browserStats, setBrowserStats] = useState({});
  const [customChartData, setCustomChartData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState("os");

  useEffect(() => {
    fetchData();
  }, [selectedMetric]);

  const fetchData = async () => {
    try {
      const hitsResponse = await fetch("http://localhost:8000/dashboard/hits");
      const hitsData = await hitsResponse.json();
      setApiHits(hitsData);

      const browserStatsResponse = await fetch(
        "http://localhost:8000/dashboard/browser_stats"
      );
      const browserStatsData = await browserStatsResponse.json();
      setBrowserStats(browserStatsData);

      const customChartResponse = await fetch(
        `http://localhost:8000/dashboard/custom_chart?metric=${selectedMetric}`
      );
      const customChartData = await customChartResponse.json();
      setCustomChartData(customChartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container mx-auto overflow-hidden w-screen">
      <h1 className="text-3xl font-bold my-4 w-full overflow-hidden mx-auto text-center ">
        API Hit Tracking Dashboard
      </h1>
      <div className="flex justify-center items-center w-full overflow-hidden flex-wrap">
        <div className=" w-1/2">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Browser Statistics
          </h2>
          <BrowserPieChart data={browserStats} />
        </div>

        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Custom Chart
          </h2>
          <select
            className="mb-4 p-2 border rounded"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="os">Operating System</option>
            <option value="method">HTTP Method</option>
            <option value="endpoint">Endpoint</option>
            <option value="hour">Hour of Day</option>
            <option value="ip">IP Address</option>
          </select>
          <CustomBarChart data={customChartData} />
        </div>
      </div>
      <div className="mt-10 w-full p-5">
        <h2 className="text-xl font-semibold mb-2 text-center">API Hits</h2>
        <APIHitsTable hits={apiHits} />
      </div>
    </div>
  );
}

export default App;
