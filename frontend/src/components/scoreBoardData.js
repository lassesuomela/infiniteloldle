import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";
import { Tooltip } from "react-tooltip";

import { saveScore } from "./saveStats";
import Config from "../configs/config";

export default function ScoreBoardData() {
  const [players, setPlayers] = useState([]);
  const [playerData, setPlayerData] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);

  useEffect(() => {
    axios
      .get(Config.url + "/scoreboard")
      .then((response) => {
        const data = response.data.scores;

        setPlayerCount(response.data.player_count);
        setRegisteredCount(response.data.registered_count);
        setPlayers(data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (!localStorage.getItem("token")) {
      return;
    }

    axios
      .get(Config.url + "/user", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success") {
          const data = response.data.player;

          saveScore(response.data.player.score);
          setPlayerData(data);

          if (!data.country) {
            // do put request to server to update country code

            axios
              .put(
                Config.url + "/user/country",
                {},
                {
                  headers: {
                    authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              )
              .then((res) => {
                if (response.data.status === "success") {
                  return;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h3 className="text-center pb-3 pt-4">Leaderboard</h3>
      <div className="d-flex justify-content-center text-center">
        <div className="card scoreboard">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Nickname</th>
                <th>Prestige</th>
                <th>Score</th>
                <th>Country</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, i) => (
                <tr key={player.nickname + i}>
                  <td>{i + 1}</td>
                  <td>{player.nickname}</td>
                  <td>{player.prestige}</td>
                  <td>{player.score}</td>
                  <td>
                    {player.country !== "n/a" && player.country !== null ? (
                      <>
                        <ReactCountryFlag
                          countryCode={player.country}
                          data-tooltip-id="country-tooltip"
                          data-tooltip-content={player.country}
                          style={{ fontSize: "1.5em" }}
                          svg
                        />
                        <Tooltip id="country-tooltip" />
                      </>
                    ) : (
                      "n/a"
                    )}
                  </td>
                  <td>{player.timestamp}</td>
                </tr>
              ))}
            </tbody>

            <tbody>
              <tr>
                <td>{playerData ? playerData.user_rank : "???"}</td>
                <td>{playerData ? playerData.nickname : "-"}</td>
                <td>{playerData ? playerData.prestige : "-"}</td>
                <td>{playerData ? playerData.score : "-"}</td>
                <td>
                  {playerData.country !== "n/a" &&
                  playerData.country !== null ? (
                    <>
                      <ReactCountryFlag
                        countryCode={playerData.country}
                        data-tooltip-id="user-country-tooltip"
                        data-tooltip-content={playerData.country}
                        style={{ fontSize: "1.5em" }}
                        svg
                      />
                      <Tooltip id="user-country-tooltip" />
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{playerData ? playerData.timestamp : "-"}</td>
              </tr>
            </tbody>
          </table>

          <div className="playerCount">
            <h5>
              Players: <span>{playerCount}</span>
            </h5>
            <h5>
              Registered: <span>{registeredCount}</span>
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}
