import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://www.infiniteloldle.com";

export function useVersusSocket(handlers) {
  const socketRef = useRef(null);
  // Always keep a ref to the latest handlers so socket listeners
  // are never stale, even after re-renders.
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = socket;

    const on = (event, key) => {
      socket.on(event, (data) => {
        if (handlersRef.current[key]) handlersRef.current[key](data);
      });
    };

    socket.on("connect", () => {
      if (handlersRef.current.onConnect) handlersRef.current.onConnect(socket.id);
    });

    socket.on("disconnect", () => {
      if (handlersRef.current.onDisconnect) handlersRef.current.onDisconnect();
    });

    on("roomCreated", "onRoomCreated");
    on("roomJoined", "onRoomJoined");
    on("playerJoined", "onPlayerJoined");
    on("playerLeft", "onPlayerLeft");
    on("playerKicked", "onPlayerKicked");
    on("hostChanged", "onHostChanged");
    on("gameStarted", "onGameStarted");
    on("roundStarted", "onRoundStarted");
    on("correctGuess", "onCorrectGuess");
    on("roundEnded", "onRoundEnded");
    on("gamePaused", "onGamePaused");
    on("gameResumed", "onGameResumed");
    on("gameEnded", "onGameEnded");
    on("error", "onError");
    on("authenticated", "onAuthenticated");
    on("guessResult", "onGuessResult");
    on("settingsUpdated", "onSettingsUpdated");
    on("lobbyReset", "onLobbyReset");
    on("kicked", "onKicked");

    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const getSocketId = useCallback(() => {
    return socketRef.current?.id;
  }, []);

  return { emit, getSocketId };
}
