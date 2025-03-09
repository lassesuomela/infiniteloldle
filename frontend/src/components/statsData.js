import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "../configs/config";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend,
} from "recharts";

import { getCountryName } from "../utils/resolveCountryCode";
import {
  tooltipContainerStyle,
  tooltipTextStyle,
} from "./styles/tooltipStyles";

export default function StatsData() {
  const [otherStat, setOtherStat] = useState([]);
  const [newPlayers, setNewPlayers] = useState([]);
  const [playerCountries, setPlayerCountries] = useState([]);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(Config.url + "/stats")
      .then((response) => {
        setNewPlayers(response.data.todays_players);
        setPlayerCountries(response.data.top_countries);

        const otherStats = {
          register_count: response.data.register_count,
          player_count: response.data.player_count,
          item_count: response.data.item_count,
          champion_count: response.data.champion_count,
          global_skin_count: response.data.global_skin_count,
          player_stats: response.data.player_stats,
          todays_player_count: response.data.todays_player_count,
          yesterdays_player_count: response.data.yesterdays_player_count,
          user_data: response.data.user_data,
          dau: response.data.dau,
          mau: response.data.mau,
          old_item_count: response.data.old_item_count,
          score_count_graph: response.data.score_count_graph,
        };

        setOtherStat(otherStats);

        const data = response.data.stats.reverse().map((stat) => {
          return {
            date: new Date(stat.date).toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            }),
            DAU: stat.dau,
            Requests: stat.requests,
          };
        });

        setData(data);

        const userData = otherStats.user_data.map((stat) => {
          return {
            date: new Date(stat.date).toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            }),
            Users: stat.users,
            Players: stat.players,
          };
        });

        setUserData(userData);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.error) {
          setMsg(error.response.data.error);
        }
      });
  }, []);

  if (msg.length > 0) {
    return (
      <>
        <h3 className="text-center">{msg}</h3>
      </>
    );
  }

  const PlayerCountryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { Country, Players } = payload[0].payload;
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipTextStyle}>{getCountryName(Country)}</p>
          <p style={tooltipTextStyle}>Players: {Players}</p>
        </div>
      );
    }
    return null;
  };

  const ScoreDistrTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { score_range, Players } = payload[0].payload;
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipTextStyle}>Scores: {score_range}</p>
          <p style={tooltipTextStyle}>Players: {Players}</p>
        </div>
      );
    }
    return null;
  };

  const PlayerTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { nickname, score } = payload[0].payload;

      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipTextStyle}>{nickname}</p>
          <p style={tooltipTextStyle}>Score: {score}</p>
        </div>
      );
    }
    return null;
  };

  const DauTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dauData = payload.find((entry) => entry.dataKey === "DAU");
      const requestsData = payload.find(
        (entry) => entry.dataKey === "Requests"
      );

      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipTextStyle}>Date: {label}</p>
          {dauData && <p style={tooltipTextStyle}>DAU: {dauData.value}</p>}
          {requestsData && (
            <p style={tooltipTextStyle}>Requests: {requestsData.value}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const UsersTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const usersData = payload.find((entry) => entry.dataKey === "Users");
      const playersData = payload.find((entry) => entry.dataKey === "Players");

      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipTextStyle}>Date: {label}</p>
          {usersData && (
            <p style={tooltipTextStyle}>Users: {usersData.value}</p>
          )}
          {playersData && (
            <p style={tooltipTextStyle}>Players: {playersData.value}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h3 className="text-center pb-3 pt-4">Statistics</h3>
      <div className="d-grid justify-content-center text-center card p-5">
        <h4 className="text-center pb-3 pt-4">Database</h4>
        <div className="d-flex justify-content-between">
          <div>
            <h5>Registered users</h5>
            <p>{otherStat.register_count}</p>
          </div>
          <div>
            <h5>Actual players</h5>
            <p>{otherStat.player_count}</p>
          </div>
          <div>
            <h5>Registered today</h5>
            <p>{otherStat.todays_player_count}</p>
          </div>
          <div>
            <h5>Registered yesterday</h5>
            <p>{otherStat.yesterdays_player_count}</p>
          </div>
          <div>
            <h5>MAU</h5>
            <p>{otherStat.mau}</p>
          </div>
          <div>
            <h5>DAU/MAU</h5>
            <p>{((otherStat.dau / otherStat.mau) * 100).toFixed(2)} %</p>
          </div>
        </div>
        <div className="d-flex justify-content-between pt-4 pb-4">
          <div>
            <h5>Champion count</h5>
            <p>{otherStat.champion_count}</p>
          </div>
          <div>
            <h5>Item count</h5>
            <p>{otherStat.item_count}</p>
          </div>
          <div>
            <h5>Old item count</h5>
            <p>{otherStat.old_item_count}</p>
          </div>
          <div>
            <h5>Skin count</h5>
            <p>{otherStat.global_skin_count}</p>
          </div>
        </div>
        <h4>Requests per day and daily active users</h4>
        <div className="pb-4 pt-2">
          <ComposedChart data={data} width={1000} height={500}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A9B3B9" />
            <XAxis dataKey="date" stroke="#A9B3B9" />
            <Tooltip content={<DauTooltip />} />
            <Legend wrapperStyle={{ color: "#A9B3B9" }} />

            <YAxis
              yAxisId="left"
              type="number"
              dataKey="Requests"
              name="Requests"
              stroke="#4C9AFF"
            />
            <YAxis
              yAxisId="right"
              type="number"
              dataKey="DAU"
              name="DAU"
              orientation="right"
              stroke="#2A9D8F"
            />

            <Bar
              yAxisId="right"
              dataKey="DAU"
              fill="#2A9D8F"
              fillOpacity={0.75}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Requests"
              stroke="#4C9AFF"
              strokeWidth={2}
              dot={{ fill: "#4C9AFF" }}
            />
          </ComposedChart>
        </div>
        <h4>Top 50 players</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={otherStat.player_stats}>
            <CartesianGrid strokeDasharray="2 2" stroke="#A9B3B9" />
            <XAxis dataKey="nickname" stroke="#A9B3B9" />
            <YAxis stroke="#A9B3B9" />
            <Tooltip content={<PlayerTooltip />} />
            <Line
              strokeWidth={2}
              type="monotone"
              dataKey="score"
              stroke="#4C9AFF"
            />
          </LineChart>
        </div>

        <h4>Gaining of users and players from past 30 days</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={userData}>
            <CartesianGrid strokeDasharray="2 2" stroke="#A9B3B9" />
            <XAxis dataKey="date" stroke="#A9B3B9" />
            <YAxis stroke="#A9B3B9" />
            <Tooltip content={<UsersTooltip />} />
            <Line
              strokeWidth={2}
              type="monotone"
              dataKey="Players"
              stroke="#4C9AFF"
            />
            <Line
              strokeWidth={2}
              type="monotone"
              dataKey="Users"
              stroke="#2A9D8F"
            />
          </LineChart>
        </div>

        <h4>Newest players from today</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={newPlayers}>
            <CartesianGrid strokeDasharray="2 2" stroke="#A9B3B9" />
            <XAxis dataKey="nickname" stroke="#A9B3B9" />
            <YAxis stroke="#A9B3B9" />
            <Tooltip content={<PlayerTooltip />} />
            <Line
              strokeWidth={2}
              type="monotone"
              dataKey="score"
              stroke="#4C9AFF"
            />
          </LineChart>
        </div>

        <h4>Top 20 countries</h4>
        <div className="pb-4 pt-2">
          <BarChart
            width={1000}
            height={500}
            data={playerCountries}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#A9B3B9" />
            <XAxis type="number" stroke="#A9B3B9" />
            <YAxis dataKey="Country" type="category" stroke="#A9B3B9" />
            <Tooltip
              content={<PlayerCountryTooltip />}
              cursor={{ fill: "var(--secondary-color)", opacity: 0.5 }}
            />
            <Bar dataKey="Players" fill="#2A9D8F" />
          </BarChart>
        </div>

        <h4>Score distribution graph</h4>
        <div className="pb-4 pt-2">
          <BarChart
            width={1000}
            height={500}
            data={otherStat.score_count_graph}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#A9B3B9" />
            <Legend wrapperStyle={{ color: "#A9B3B9" }} />
            <XAxis dataKey="score_range" type="category" stroke="#A9B3B9" />
            <YAxis dataKey="Players" type="number" stroke="#A9B3B9" />
            <Tooltip
              content={<ScoreDistrTooltip />}
              cursor={{ fill: "var(--secondary-color)", opacity: 0.5 }}
            />
            <Bar dataKey="Players" fill="#4C9AFF" />
          </BarChart>
        </div>
      </div>
    </>
  );
}
