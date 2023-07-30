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

  return (
    <>
      <h3 className="text-center pb-3 pt-4">My stats</h3>
      <div className="d-grid justify-content-center text-center card p-5">
        <div className="d-flex justify-content-between pb-4">
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
            <p>
              {totalGames !== 0 ? (totalGuesses / totalGames).toFixed(2) : 0}
            </p>
          </div>
          <div>
            <h5>Total first tries</h5>
            <p>{totalFirstTries}</p>
          </div>
          <div>
            <h5>First tries rate</h5>
            <p>
              {totalGames !== 0
                ? ((totalFirstTries / totalGames) * 100).toFixed(2)
                : 0}{" "}
              %
            </p>
          </div>
        </div>
        <h4>Games won per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={gamesPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>Score development per day</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={scoresPerDay}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="Dates" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Value" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>Guesses per day</h4>
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
