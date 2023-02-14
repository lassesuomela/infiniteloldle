import React from 'react';
import ScoreBoardData from "../components/scoreBoardData";
import {Helmet} from "react-helmet";

export default function ScoreBoard() {

    return (
        <>
            <div className="container">

                <Helmet>
                    <title>Infiniteloldle - Leaderboard</title>
                    <meta name="description" content="Infiniteloldle.com - Leaderboard of the top 10 players." />
                </Helmet>
                
                <h3 className="text-center pb-3 pt-4">Leaderboard</h3>

                <div className="d-flex justify-content-center text-center">
                    <div className="card scoreboard">
                        <ScoreBoardData/>
                    </div>
                </div>
            </div>
        </>
    )
}
