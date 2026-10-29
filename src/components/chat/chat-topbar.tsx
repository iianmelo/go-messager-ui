import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserData } from "../../app/data";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";

interface ChatTopbarProps {
  selectedUser: UserData;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          {selectedUser.avatar ? (
            <AvatarImage
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="w-10 h-10"
            />
          ) : null}
          <AvatarFallback>{selectedUser.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
        </div>
      </div>

    </ExpandableChatHeader>
  );
}
