import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function StatsData() {
  const [gamesPerDay, setGamesPerDay] = useState([]);
  const [triesPerDay, setTriesPerDay] = useState([]);
  const [firstTriesPerDay, setFirstTriesPerDay] = useState([]);
  const [scoresPerDay, setScoresPerDay] = useState([]);

  useEffect(() => {
    const gamesPlayedData = localStorage.getItem("gamesPlayed");
    const triesPerDayData = localStorage.getItem("triesPerDay");
    const firstTriesPerDayData = localStorage.getItem("firstTriesPerDay");
    const scoresPerDayData = localStorage.getItem("scorePerDay");

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
          month: "numeric",
          day: "numeric",
        }),
        Value: parsedData[day].value,
      });
    }
    return dataPoints;
  };

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
