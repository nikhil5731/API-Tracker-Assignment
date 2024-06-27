import React from "react";

function APIHitsTable({ hits }) {
  return (
    <div
      className="overflow-x-auto w-full max-h-[70vh]"
    >
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Timestamp</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Endpoint</th>
            <th className="py-3 px-6 text-left">OS</th>
            <th className="py-3 px-6 text-left">IP</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {hits.map((hit, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(hit.timestamp).toLocaleString()}
              </td>
              <td className="py-3 px-6 text-left">{hit.request_type}</td>
              <td className="py-3 px-6 text-left">{hit.endpoint}</td>
              <td className="py-3 px-6 text-left">{hit.operating_system}</td>
              <td className="py-3 px-6 text-left">{hit.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default APIHitsTable;
