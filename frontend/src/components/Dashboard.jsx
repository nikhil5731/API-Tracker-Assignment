import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [browserData, setBrowserData] = useState({});
  const [criteriaData, setCriteriaData] = useState({});

  useEffect(() => {
    axios.get('/api/hits').then(response => {
      setData(response.data);
      // Process data for charts here
      const browsers = {};
      response.data.forEach(hit => {
        const browser = hit.user_agent.split(' ')[0];
        browsers[browser] = (browsers[browser] || 0) + 1;
      });
      setBrowserData({
        labels: Object.keys(browsers),
        datasets: [{
          data: Object.values(browsers),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
      });
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">API Hit Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl mb-2">Number of Requests by Browser</h3>
        <Pie data={browserData} />
      </div>
      <div className="mb-8">
        <h3 className="text-xl mb-2">Number of Requests by Criteria</h3>
        <Bar data={criteriaData} />
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/6 py-2">Timestamp</th>
            <th className="w-1/6 py-2">Request Type</th>
            <th className="w-1/6 py-2">Endpoint</th>
            <th className="w-1/6 py-2">User Agent</th>
            <th className="w-1/6 py-2">Operating System</th>
            <th className="w-1/6 py-2">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {/* {data?.map(hit => (
            <tr key={hit.id} className="text-center">
              <td className="border px-4 py-2">{hit.timestamp}</td>
              <td className="border px-4 py-2">{hit.request_type}</td>
              <td className="border px-4 py-2">{hit.endpoint}</td>
              <td className="border px-4 py-2">{hit.user_agent}</td>
              <td className="border px-4 py-2">{hit.operating_system}</td>
              <td className="border px-4 py-2">{hit.ip_address}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
