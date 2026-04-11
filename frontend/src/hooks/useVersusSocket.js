import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://www.infiniteloldle.com";

export function useVersusSocket(handlers) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (handlers.onConnect) handlers.onConnect(socket.id);
    });

    socket.on("disconnect", () => {
      if (handlers.onDisconnect) handlers.onDisconnect();
    });

    socket.on("roomCreated", (data) => {
      if (handlers.onRoomCreated) handlers.onRoomCreated(data);
    });

    socket.on("roomJoined", (data) => {
      if (handlers.onRoomJoined) handlers.onRoomJoined(data);
    });

    socket.on("playerJoined", (data) => {
      if (handlers.onPlayerJoined) handlers.onPlayerJoined(data);
    });

    socket.on("playerLeft", (data) => {
      if (handlers.onPlayerLeft) handlers.onPlayerLeft(data);
    });

    socket.on("playerKicked", (data) => {
      if (handlers.onPlayerKicked) handlers.onPlayerKicked(data);
    });

    socket.on("hostChanged", (data) => {
      if (handlers.onHostChanged) handlers.onHostChanged(data);
    });

    socket.on("gameStarted", (data) => {
      if (handlers.onGameStarted) handlers.onGameStarted(data);
    });

    socket.on("roundStarted", (data) => {
      if (handlers.onRoundStarted) handlers.onRoundStarted(data);
    });

    socket.on("correctGuess", (data) => {
      if (handlers.onCorrectGuess) handlers.onCorrectGuess(data);
    });

    socket.on("roundEnded", (data) => {
      if (handlers.onRoundEnded) handlers.onRoundEnded(data);
    });

    socket.on("gamePaused", (data) => {
      if (handlers.onGamePaused) handlers.onGamePaused(data);
    });

    socket.on("gameResumed", (data) => {
      if (handlers.onGameResumed) handlers.onGameResumed(data);
    });

    socket.on("gameEnded", (data) => {
      if (handlers.onGameEnded) handlers.onGameEnded(data);
    });

    socket.on("error", (data) => {
      if (handlers.onError) handlers.onError(data);
    });

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
