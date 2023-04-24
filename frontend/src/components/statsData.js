import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "../configs/config";
import {
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend,
} from "recharts";

export default function StatsData() {
  const [stats, setStats] = useState([]);
  const [otherStat, setOtherStat] = useState([]);
  const [newPlayers, setNewPlayers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(Config.url + "/stats")
      .then((response) => {
        setStats(response.data.stats);
        setNewPlayers(response.data.todays_players);

        const data = {
          register_count: response.data.register_count,
          player_count: response.data.player_count,
          item_count: response.data.item_count,
          champion_count: response.data.champion_count,
          global_skin_count: response.data.global_skin_count,
          player_stats: response.data.player_stats,
          todays_player_count: response.data.todays_player_count,
        };

        console.log(data);
        setOtherStat(data);
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

  const data = stats.map((stat) => {
    return {
      date: new Date(stat.date).toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
      }),
      DAU: stat.dau,
      Requests: stat.requests,
    };
  });

  return (
    <>
      <h3 className="text-center pb-3 pt-4">Statistics</h3>
      <div className="d-grid justify-content-center text-center card p-5">
        <h4 className="text-center pb-3 pt-4">Database</h4>
        <div className="d-flex justify-content-between pt-4 pb-4">
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
            <h5>Item count</h5>
            <p>{otherStat.item_count}</p>
          </div>
          <div>
            <h5>Champion count</h5>
            <p>{otherStat.champion_count}</p>
          </div>
          <div>
            <h5>Skin count</h5>
            <p>{otherStat.global_skin_count}</p>
          </div>
        </div>
        <h4>Requests per day and daily active users</h4>
        <div className="pb-4 pt-2">
          <ComposedChart data={data} width={1000} height={500}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Legend />
            <YAxis
              yAxisId="left"
              type="number"
              dataKey="Requests"
              name="Requests"
              stroke="#005A82"
            />
            <YAxis
              yAxisId="right"
              type="number"
              dataKey="DAU"
              name="DAU"
              orientation="right"
              stroke="#0397AB"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Requests"
              stroke="#005A82"
            />
            <Bar
              yAxisId="right"
              dataKey="DAU"
              fill="#0397AB"
              fillOpacity={0.75}
            />
          </ComposedChart>
        </div>
        <h4>Top 50 players</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={otherStat.player_stats}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="nickname" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#005A82" />
          </LineChart>
        </div>
        <h4>25 of newest players from today</h4>
        <div className="pb-4 pt-2">
          <LineChart width={1000} height={500} data={newPlayers}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="nickname" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#005A82" />
          </LineChart>
        </div>
      </div>
    </>
  );
}
