import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { initValues } from "../utils/saveStats";

export default function StatsData() {
  const [gamesPerDay, setGamesPerDay] = useState([]);
  const [triesPerDay, setTriesPerDay] = useState([]);
  const [firstTriesPerDay, setFirstTriesPerDay] = useState([]);
  const [scoresPerDay, setScoresPerDay] = useState([]);
  const [noData, setNoData] = useState(false);
  const [totalGames, setTotalGames] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [totalFirstTries, setTotalFirstTries] = useState(0);

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

    const gamesData = parse(gamesPlayedData);
    const triesData = parse(triesPerDayData);
    const firstTriesData = parse(firstTriesPerDayData);
    const scoredData = parse(scoresPerDayData);

    setGamesPerDay(gamesData[0]);
    setTriesPerDay(triesData[0]);
    setFirstTriesPerDay(firstTriesData[0]);
    setScoresPerDay(scoredData[0]);

    setTotalGames(gamesData[1]);
    setTotalGuesses(triesData[1]);
    setTotalFirstTries(firstTriesData[1]);
  }, []);

  const parse = (data) => {
    if (data === null) {
      return [[], 0];
    }
    const parsedData = JSON.parse(data);
    const days = Object.keys(parsedData);

    const dataPoints = [];
    let total = 0;

    for (const day of days) {
      dataPoints.push({
        Dates: new Date(day).toLocaleDateString(navigator.language, {
          dateStyle: "short",
        }),
        Value: parsedData[day].value,
      });
      total += parsedData[day].value;
    }
    return [dataPoints, total];
  };

  if (noData) {
    return (
      <div className="d-flex justify-content-center">
        <h2>No data available</h2>
      </div>
    );
  }

  const StatsTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { Dates, Value } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#181a1c",
            padding: "8px",
            border: "1px solid #353739",
            borderRadius: "0.2rem",
          }}
        >
          <p style={{ margin: 0, color: "#fff" }}>Date: {Dates}</p>
          <p style={{ margin: 0, color: "#fff" }}>Value: {Value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="statsWrapper">
      <div className="d-flex justify-content-between pb-4 gap-4">
        <div>
          <h5>Total games played</h5>
          <p>{totalGames}</p>
        </div>
        <div>
          <h5>Total guesses</h5>
          <p>{totalGuesses}</p>
        </div>
        <div>
          <h5>Average guesses per game</h5>
          <p>{totalGames !== 0 ? (totalGuesses / totalGames).toFixed(0) : 0}</p>
        </div>
        <div>
          <h5>Total first tries</h5>
          <p>{totalFirstTries}</p>
        </div>
        <div>
          <h5>First tries rate</h5>
          <p>
            {totalGames !== 0
              ? ((totalFirstTries / totalGames) * 100).toFixed(0)
              : 0}{" "}
            %
          </p>
        </div>
      </div>
      <div className="d-flex gap-3 flex-column">
        <h4>Games won per day</h4>
        <ResponsiveContainer width={"100%"} height={500}>
          <LineChart data={gamesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip content={<StatsTooltip />} />
            <Line type="monotone" dataKey="Value" stroke="#4C9AFF" />
          </LineChart>
        </ResponsiveContainer>
        <h4>Score development per day</h4>
        <ResponsiveContainer width={"100%"} height={500}>
          <LineChart data={scoresPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip content={<StatsTooltip />} />
            <Line type="monotone" dataKey="Value" stroke="#4C9AFF" />
          </LineChart>
        </ResponsiveContainer>
        <h4>Guesses per day</h4>
        <ResponsiveContainer width={"100%"} height={500}>
          <LineChart data={triesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip content={<StatsTooltip />} />
            <Line type="monotone" dataKey="Value" stroke="#4C9AFF" />
          </LineChart>
        </ResponsiveContainer>
        <h4>First tries per day</h4>
        <ResponsiveContainer width={"100%"} height={500}>
          <LineChart data={firstTriesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip content={<StatsTooltip />} />
            <Line type="monotone" dataKey="Value" stroke="#4C9AFF" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
