import React from "react";

function APIHitsTable({ hits }) {
  return (
    <div className="overflow-x-auto w-full max-h-[70vh]">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left w-[12.5%]">ID</th>
            <th className="py-3 px-6 text-left w-[12.5%]">Endpoint</th>
            <th className="py-3 px-6 text-left w-[12.5%]">Type</th>
            <th className="py-3 px-6 text-left w-[12.5%]">Timestamp</th>
            <th className="py-3 px-6 text-left w-[12.5%]">Payload</th>
            <th className="py-3 px-6 text-left w-[12.5%]">OS</th>
            <th className="py-3 px-6 text-left w-[12.5%]">IP</th>
            <th className="py-3 px-6 text-left w-[12.5%]">User Agent</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {hits.map((hit, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left w-[12.5%]">R{hit.id}</td>
              <td className="py-3 px-6 text-left w-[12.5%]">{hit.endpoint}</td>
              <td className="py-3 px-6 text-left w-[12.5%]">{hit.request_type}</td>
              <td className="py-3 px-6 text-left w-[12.5%]">
                {new Date(hit.timestamp).toLocaleString()}
              </td>
              <td className="py-3 px-6 text-left w-[12.5%]">
                {hit.request_body.match(/b'(.*)'/)[1]}
              </td>
              <td className="py-3 px-6 text-left w-[12.5%]">{hit.operating_system}</td>
              <td className="py-3 px-6 text-left w-[12.5%]">{hit.ip_address}</td>
              <td className="py-3 px-6 text-left w-[12.5%]">{hit.user_agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default APIHitsTable;
