import React from 'react';
import ScoreBoardData from "../components/ScoreBoardData";

export default function ScoreBoard() {

    return (
        <div className="container">
            <h3 className="text-center pb-3 pt-4">Scoreboard</h3>

            <div className=" d-flex justify-content-center text-center">
                <div className="card p-5 w-75">
                    <ScoreBoardData/>
                </div>
            </div>
        </div>
    )
}
