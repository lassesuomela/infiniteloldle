import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVersusSocket } from "../../hooks/useVersusSocket";
import VersusLobby from "./VersusLobby";
import VersusGame from "./VersusGame";
import VersusScoreboard from "./VersusScoreboard";

export default function VersusRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { action, code: joinCode } = location.state || {};

  const [room, setRoom] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [gamePhase, setGamePhase] = useState("lobby"); // lobby | game | scoreboard
  const [roundInfo, setRoundInfo] = useState(null);
  const [pauseState, setPauseState] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [scores, setScores] = useState([]);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [roundEndInfo, setRoundEndInfo] = useState(null);
  const initialized = useRef(false);

  const updateRoom = useCallback((newRoom) => {
    setRoom(newRoom);
  }, []);

  const handlers = {
    onRoomCreated: ({ room, myUserId }) => {
      setMyPlayerId(myUserId);
      updateRoom(room);
      setGamePhase("lobby");
    },
    onRoomJoined: ({ room, myUserId }) => {
      setMyPlayerId(myUserId);
      updateRoom(room);
      if (room.state === "game_end") {
        setGamePhase("scoreboard");
      } else if (room.state === "lobby") {
        setGamePhase("lobby");
      } else {
        setGamePhase("game");
      }
    },
    onPlayerJoined: ({ room }) => {
      updateRoom(room);
    },
    onPlayerLeft: ({ room }) => {
      updateRoom(room);
    },
    onPlayerKicked: ({ playerId, room }) => {
      if (playerId === myPlayerId) {
        toast.error("You were kicked from the room");
        navigate("/game/versus");
        return;
      }
      updateRoom(room);
      toast.info("A player was kicked from the room");
    },
    onHostChanged: ({ newHostId, room }) => {
      updateRoom(room);
      if (newHostId === myPlayerId) {
        toast.info("You are now the host!");
      } else {
        toast.info("Host has changed");
      }
    },
    onGameStarted: ({ room }) => {
      updateRoom(room);
      setGamePhase("game");
    },
    onRoundStarted: ({ round, maxRounds, mode, roundData }) => {
      setRoundInfo({ round, maxRounds, mode, roundData });
      setLastCorrect(null);
      setRoundEndInfo(null);
      setPauseState(null);
    },
    onCorrectGuess: ({ playerId, nickname, answer, scores: newScores }) => {
      setLastCorrect({ playerId, nickname, answer });
      setScores(newScores);
      setRoundEndInfo({ answer, winnerNickname: nickname });
    },
    onRoundEnded: () => {
      // Round ended, next round will come via roundStarted
    },
    onGamePaused: ({ pauseState }) => {
      setPauseState(pauseState);
    },
    onGameResumed: ({ room }) => {
      setPauseState(null);
      updateRoom(room);
    },
    onGameEnded: ({ scoreboard }) => {
      setScoreboard(scoreboard);
      setGamePhase("scoreboard");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onAuthenticated: (_) => {
      init();
    },
  };

  const { emit } = useVersusSocket(handlers);

  const init = () => {
    if (action === "create") {
      emit("createRoom", {});
    } else if (action === "join") {
      emit("joinRoom", { code: joinCode });
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!action) {
      navigate("/game/versus");
      return;
    }
  }, [action, joinCode, navigate]);

  const handleStartGame = useCallback(() => {
    emit("startGame");
  }, [emit]);

  const handleKickPlayer = useCallback(
    (playerId) => {
      emit("kickPlayer", { playerId });
    },
    [emit],
  );

  const handleLeaveRoom = useCallback(() => {
    emit("leaveRoom");
    navigate("/game/versus");
  }, [emit, navigate]);

  const handleSubmitGuess = useCallback(
    (guess) => {
      emit("submitGuess", { guess });
    },
    [emit],
  );

  const handleForceResume = useCallback(() => {
    emit("forceResumeGame");
  }, [emit]);

  const handlePlayAgain = useCallback(() => {
    navigate("/game/versus");
  }, [navigate]);

  const shareLink = room
    ? `${window.location.origin}/game/versus?code=${room.code}`
    : "";

  if (!room) {
    return (
      <div className="container main pt-4 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Connecting...</span>
        </div>
        <p className="text-muted mt-3">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="container main pt-4 pb-5">
      <Helmet>
        <title>Infinite LoLdle - Versus Room {room.code}</title>
      </Helmet>

      {gamePhase === "lobby" && (
        <VersusLobby
          room={room}
          myPlayerId={myPlayerId}
          shareLink={shareLink}
          onStartGame={handleStartGame}
          onKickPlayer={handleKickPlayer}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {gamePhase === "game" && (
        <VersusGame
          room={room}
          myPlayerId={myPlayerId}
          roundInfo={roundInfo}
          pauseState={pauseState}
          roundEndInfo={roundEndInfo}
          scores={scores}
          lastCorrect={lastCorrect}
          onSubmitGuess={handleSubmitGuess}
          onForceResume={handleForceResume}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {gamePhase === "scoreboard" && (
        <VersusScoreboard
          scoreboard={scoreboard}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
