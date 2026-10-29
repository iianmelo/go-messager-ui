// hooks/use-chat-socket.ts
import { useEffect, useRef } from "react";
import useChatStore from "@/hooks/use-chat-store";
import { Message } from "@/app/data";

function resolveWebSocketUrl(token: string): string | null {
  const explicit = process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL;
  if (explicit) {
    const join = explicit.includes("?") ? "&" : "?";
    return `${explicit}${join}token=${encodeURIComponent(token)}`;
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api || api.startsWith("/")) return null;

  try {
    const url = new URL(api);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/chats";
    url.search = `token=${encodeURIComponent(token)}`;
    return url.toString();
  } catch {
    return null;
  }
}

export const useChatSocket = (receiverId: number) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setMessages = useChatStore((state) => state.setMessages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const addUnreadMessage = useChatStore((state) => state.addUnreadMessage);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }
    const wsUrl = resolveWebSocketUrl(token);
    if (!wsUrl) {
      return;
    }
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔌 WebSocket conectado!");
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        console.log("📥 Mensagem recebida:", data);

        const newMessage: Message = {
          id: data.senderId,
          avatar: data.senderId === data.receiverId ? data.senderAvatar : data.receiverAvatar,
          name: data.senderId === data.receiverId ? "You" : data.senderName,
          message: data.text,
          timestamp: new Date().toLocaleTimeString(),
          isSender: data.senderId === data.receiverId
        };

        if (selectedChat && data.senderId === selectedChat.receiver_id) {
          setMessages((prev) => [...prev, newMessage]);
        } else {
          addUnreadMessage(data.senderId);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem recebida:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket erro:", error);
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket desconectado.");
    };

    return () => {
      socket.close();
    };
  }, [receiverId, setMessages, selectedChat, addUnreadMessage]);

  const sendMessage = (text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket não está conectado.");
      return;
    }

    const message = {
      text,
      receiverId,
    };

    socketRef.current.send(JSON.stringify(message));
    console.log("📤 Mensagem enviada:", message);
  };

  return { sendMessage };
};