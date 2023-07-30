import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { initValues } from "./saveStats";
export default function StatsData() {
  const [gamesPerDay, setGamesPerDay] = useState([]);
  const [triesPerDay, setTriesPerDay] = useState([]);
  const [firstTriesPerDay, setFirstTriesPerDay] = useState([]);
  const [scoresPerDay, setScoresPerDay] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setNoData(true);
      return;
    }

    const gamesPlayedData = localStorage.getItem("gamesPlayed");
    const triesPerDayData = localStorage.getItem("triesPerDay");
    const firstTriesPerDayData = localStorage.getItem("firstTriesPerDay");
    const scoresPerDayData = localStorage.getItem("scorePerDay");

    const today = new Date().toISOString().split("T")[0];

    if (
      gamesPlayedData === null ||
      triesPerDayData === null ||
      firstTriesPerDayData === null ||
      scoresPerDayData === null ||
      JSON.parse(gamesPlayedData)[today] === undefined ||
      JSON.parse(triesPerDayData)[today] === undefined ||
      JSON.parse(firstTriesPerDayData)[today] === undefined ||
      JSON.parse(scoresPerDayData)[today] === undefined
    ) {
      initValues();
    }

    setGamesPerDay(parse(gamesPlayedData));
    setTriesPerDay(parse(triesPerDayData));
    setFirstTriesPerDay(parse(firstTriesPerDayData));
    setScoresPerDay(parse(scoresPerDayData));
  }, []);

  const parse = (data) => {
    if (data === null) {
      return [];
    }
    const parsedData = JSON.parse(data);
    const days = Object.keys(parsedData);

    const dataPoints = [];

    for (const day of days) {
      dataPoints.push({
        Dates: new Date(day).toLocaleDateString(navigator.language, {
          dateStyle: "short",
        }),
        Value: parsedData[day].value,
      });
    }
    return dataPoints;
  };

  if (noData) {
    return (
      <div className="d-flex justify-content-center">
        <h2>No data available</h2>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-center pb-3 pt-4">My stats</h3>
      <div className="d-grid justify-content-center text-center card p-5">
        <h4>Games per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={gamesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>Scores per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={scoresPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>Tries per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={triesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>First tries per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={firstTriesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
      </div>
    </>
  );
}
