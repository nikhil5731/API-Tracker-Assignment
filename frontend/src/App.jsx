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
    <div className="h-screen w-screen overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center my-5">
        API Hit Tracking Dashboard
      </h1>
      <div className="flex justify-center flex-wrap">
        <div className="md:w-1/3">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Browser Statistics
          </h2>
          <BrowserPieChart data={browserStats} />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Custom Chart
          </h2>
          <select
            className="mb-4 p-2 border rounded bg-gray-100 border-gray-400 outline-none"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="os">Operating System</option>
            <option value="method">HTTP Method</option>
            <option value="endpoint">Endpoint</option>
            <option value="user_agent">User Agent</option>
            <option value="ip">IP Address</option>
          </select>
          <CustomBarChart data={customChartData} />
        </div>
      </div>
      <div className="my-10">
        <h2 className="text-xl font-semibold mb-2 text-center">API Hits</h2>
        <APIHitsTable hits={apiHits} />
      </div>
    </div>
  );
}

export default App;
