import { Helmet } from "react-helmet-async";
import ScoreBoardData from "../components/ScoreBoardData";

export default function ScoreBoard() {
  return (
    <>
      <div className="container">
        <Helmet>
          <title>Infinite LoLdle - Leaderboard</title>
          <meta
            name="description"
            content="Check out the top League of Legends quiz players and their scores."
          />
        </Helmet>

        <ScoreBoardData />
      </div>
    </>
  );
}
