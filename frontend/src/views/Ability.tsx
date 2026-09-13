import { Helmet } from "react-helmet-async";
import AbilitySpriteGame from "../components/games/AbilitySpriteGame";

export default function Ability() {
  return (
    <div>
      <Helmet>
        <title>Infinite LoLdle - Guessing champion abilities</title>
        <meta
          name="description"
          content="Infiniteloldle.com - Guess League of Legends champions infinitely by their abilities."
        />
      </Helmet>
      <AbilitySpriteGame />
    </div>
  );
}
