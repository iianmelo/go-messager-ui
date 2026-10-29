import { SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "@/app/data";
import { ChatInput } from "@/components/ui/chat/chat-input";
import useChatStore from "@/hooks/use-chat-store";
import { useChatSocket } from "@/hooks/use-chat-socket";

function currentSender() {
  if (typeof window === "undefined") return { name: "Você", avatar: "" };
  try {
    const raw = window.localStorage.getItem("authUser");
    if (!raw) return { name: "Você", avatar: "" };
    const user = JSON.parse(raw) as { name?: string; avatar?: string };
    return { name: user.name || "Você", avatar: user.avatar || "" };
  } catch {
    return { name: "Você", avatar: "" };
  }
}

interface ChatBottombarProps {
  isMobile: boolean;
}

export default function ChatBottombar(_props: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const setMessages = useChatStore((state) => state.setMessages);
  const isLoading = false;
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { sendMessage: sendWebSocketMessage } = useChatSocket(selectedChat?.receiver_id || 0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      const sender = currentSender();
      const newMessage: Message = {
        id: Date.now(),
        name: sender.name,
        avatar: sender.avatar,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSender: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      sendWebSocketMessage(message.trim());
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Escreva uma mensagem..."
            className="rounded-md"
          />
        </motion.div>
        <Button
          className="h-9 w-9 shrink-0"
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          variant="ghost"
          size="icon"
          aria-label="Enviar"
          type="button"
        >
          <SendHorizontal size={22} className="text-muted-foreground" />
        </Button>
      </AnimatePresence>
    </div>
  );
}
