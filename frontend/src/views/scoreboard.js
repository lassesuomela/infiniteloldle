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
                
                <ScoreBoardData/>
            </div>
        </>
    )
}
