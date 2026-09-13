import { Helmet } from "react-helmet-async";
import OldItemGame from "../components/games/OldItemGame";

export default function Splash() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing legacy items game</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends legacy items by their icons."
        />
      </Helmet>
      <OldItemGame />
    </div>
  );
}
