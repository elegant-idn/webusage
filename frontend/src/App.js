import React, { useState, useEffect } from "react";
import Filters from "./components/Filters";
import DataTable from "./components/DataTable";
import PieChart from "./components/PieChart";
import { fetchData } from "./components/apiUtils";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [pieDataArray, setPieDataArray] = useState([]);

  useEffect(() => {
    const queryParams = `?username=${deviceId}&url=${url}&duration=${duration}`;
    fetchData(queryParams, setData, setPieDataArray);
  }, [deviceId, url, duration]);

  const totalDurationSeconds = data.reduce(
    (total, item) => total + item.duration / 1000,
    0
  );

  return (
    <div className="app-container">
      <h1>Web Usage Data</h1>
      <Filters
        deviceId={deviceId}
        setDeviceId={setDeviceId}
        url={url}
        setUrl={setUrl}
        duration={duration}
        setDuration={setDuration}
      />
      <DataTable data={data} totalDurationSeconds={totalDurationSeconds} />
      <PieChart pieDataArray={pieDataArray} />
    </div>
  );
}

export default App;
