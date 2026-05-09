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
  const [guessResult, setGuessResult] = useState(null);
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
    onPlayerJoined: ({ player, room }) => {
      updateRoom(room);
      toast.info(`${player.nickname} joined the room`);
    },
    onPlayerLeft: ({ room }) => {
      updateRoom(room);
    },
    onPlayerKicked: ({ kicked, room }) => {
      if (kicked.id === myPlayerId) {
        toast.error("You were kicked from the room");
        navigate("/game/versus");
        return;
      }
      updateRoom(room);
      // PLayer name was kicked from the room
      toast.info(`${kicked.nickname} was kicked from the room`);
    },
    onKicked: () => {
      // The server disconnects our socket after this; just navigate away
      navigate("/game/versus");
      toast.info("You have been kicked from the room");
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
    onRoundStarted: ({ round, maxRounds, mode, roundData, imageBase64 }) => {
      setRoundInfo({ round, maxRounds, mode, roundData, imageBase64 });
      setLastCorrect(null);
      setRoundEndInfo(null);
      setPauseState(null);
    },
    onCorrectGuess: ({ playerId, nickname, answer, scores: newScores }) => {
      setLastCorrect({ playerId, nickname, answer });
      setScores(newScores);
      setRoundEndInfo({ answer, winnerNickname: nickname });
    },
    onGuessResult: (data) => {
      setGuessResult(data);
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
    onSettingsUpdated: ({ room }) => {
      updateRoom(room);
    },
    onLobbyReset: ({ room }) => {
      updateRoom(room);
      setScoreboard([]);
      setScores([]);
      setRoundInfo(null);
      setRoundEndInfo(null);
      setGuessResult(null);
      setPauseState(null);
      setGamePhase("lobby");
    },
    onError: ({ message }) => {
      toast.error(message);
      if (message === "Room not found") {
        navigate("/game/versus");
      }
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
    emit("returnToLobby");
  }, [emit]);

  const handleUpdateSettings = useCallback(
    (settings) => {
      emit("updateSettings", { settings });
    },
    [emit],
  );

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
          onUpdateSettings={handleUpdateSettings}
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
          guessResult={guessResult}
          onSubmitGuess={handleSubmitGuess}
          onForceResume={handleForceResume}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {gamePhase === "scoreboard" && (
        <VersusScoreboard
          scoreboard={scoreboard}
          room={room}
          myPlayerId={myPlayerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
