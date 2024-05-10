import React from "react";

function DataTable({ data, totalDurationSeconds }) {
  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Device ID</th>
          <th>URL</th>
          <th>Duration (seconds)</th>
          <th>Visited On</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.username}</td>
            <td>{item.device}</td>
            <td>{item.url}</td>
            <td>{Math.floor(item.duration / 1000)}</td>
            <td>{new Date(item.timestamp).toLocaleString()}</td>
          </tr>
        ))}
        <tr className="bold-text">
          <td colSpan="3">Total Duration</td>
          <td colSpan="2">{Math.floor(totalDurationSeconds)} seconds</td>
        </tr>
      </tbody>
    </table>
  );
}

export default DataTable;
