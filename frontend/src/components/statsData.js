import React, { useState, useEffect } from "react";
import axios from "axios";

import Config from "../configs/config";

export default function StatsData() {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    axios
      .get(Config.url + "/stats")
      .then((response) => {
        setStats(response.data.stats);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h3 className="text-center pb-3 pt-4">Statistics</h3>
      <div className="d-flex justify-content-center text-center">
        {stats.map((stat) => (
          <div>
            <p>{stat.id}</p>
            <p>{new Date(stat.date).toLocaleDateString()}</p>
            <p>{stat.dau}</p>
            <p>{stat.requests}</p>
          </div>
        ))}
      </div>
    </>
  );
}
