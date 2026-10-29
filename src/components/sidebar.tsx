'use client'

import { useEffect, useState } from 'react';
import { GolangIcon } from '@/assets';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ListUserButton } from './list-users';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { getUserInfo } from '@/services/user';
import UserProfileModal from './user-profile';

interface Chat {
  id: number;
  user_id: number;
  name: string;
  variant: "secondary" | "ghost";
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
  receiver_id: number;
  receiver: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
  group_id?: number;
  avatar: string;
  messages: {
    receiverId: number;
    senderId: number;
    name: string;
    text: string;
    isLoading?: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  isMobile: boolean;
  onNewChat: (chat: Chat) => void;
}

export function Sidebar({
	isCollapsed,
	chats,
	selectedChat,
	onChatSelect,
	isMobile,
	onNewChat,
}: SidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const userProfile = await getUserInfo();
				setData(userProfile);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};
		fetchUserProfile();
	}, [update]);

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredChats = chats.filter((chat) =>
    normalize(chat.name || "").includes(normalize(searchTerm))
  );

	return (
		<div
			data-collapsed={isCollapsed}
			className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
		>
			{!isCollapsed && (
				<div className="flex flex-col gap-2">
					{/* chats search bar */}
					<div className="flex items-center gap-4"></div>
					<div className="relative w-full">
						<Image
							src={GolangIcon}
							alt="Logo"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
							width={24}
							height={24}
						/>
						<input
							type="text"
							placeholder="Pesquisar chats..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 p-2 border rounded-md text-sm dark:bg-muted dark:text-white"
						/>
					</div>
					<div className="flex justify-between p-2 items-center">
						<div className="flex gap-2 items-center text-2xl">
							<p className="font-medium">Chats</p>
							<span>({filteredChats.length})</span>
						</div>

						<div>
							<ListUserButton onNewChat={onNewChat} />
						</div>
					</div>
				</div>
			)}
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				<ScrollArea className="flex-1">
					<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
						{filteredChats.length > 0 ? (
							filteredChats.map((chat, index) =>
								isCollapsed ? (
									<TooltipProvider key={index}>
										<Tooltip delayDuration={0}>
											<TooltipTrigger asChild>
												<button
													onClick={() =>
														onChatSelect(chat)
													}
													className={cn(
														buttonVariants({
															variant:
																selectedChat?.id ===
																chat.id
																	? 'secondary'
																	: 'ghost',
															size: 'icon',
														}),
														'h-11 w-11 md:h-12 md:w-12 rounded-full',
														selectedChat?.id ===
															chat.id &&
															'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted/80 dark:hover:text-white'
													)}
												>
													<Avatar className="h-9 w-9">
														{chat.avatar ? (
															<AvatarImage
																src={chat.avatar}
																alt={chat.name}
															/>
														) : null}
														<AvatarFallback>
															{(chat.name || "?").charAt(0)}
														</AvatarFallback>
													</Avatar>
													<span className="sr-only">
														{chat.name}
													</span>
												</button>
											</TooltipTrigger>
											<TooltipContent
												side="right"
												className="flex items-center gap-4"
											>
												{chat.name}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : (
									<button
										key={index}
										onClick={() => onChatSelect(chat)}
										className={cn(
											buttonVariants({
												variant:
													selectedChat?.id === chat.id
														? 'secondary'
														: 'ghost',
												size: 'lg',
											}),
											selectedChat?.id === chat.id &&
												'dark:bg-muted dark:hover:bg-muted/80 dark:hover:text-white',
											'justify-start gap-3 px-3 py-2 h-auto'
										)}
									>
										<Avatar>
											{chat.avatar ? (
												<AvatarImage
													src={chat.avatar}
													alt={chat.name}
												/>
											) : null}
											<AvatarFallback>
												{(chat.name || "?").charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col items-start text-left overflow-hidden">
											<span className="font-medium">
												{chat.name}
											</span>
											{(chat.messages?.length || 0) > 0 && (
												<span className="text-xs text-muted-foreground truncate max-w-[150px]">
													{chat.messages[
														chat.messages.length - 1
													]?.isLoading
														? 'Typing...'
														: chat.messages[
																chat.messages
																	.length - 1
														  ]?.text ||
														  'Desconhecido'}
												</span>
											)}
										</div>
									</button>
								)
							)
						) : (
							<div className="flex flex-col items-center justify-center py-10 px-4 text-center">
								<div className="bg-muted/30 p-4 rounded-full mb-4">
									<MessageSquare className="h-8 w-8 text-muted-foreground" />
								</div>
								{searchTerm ? (
									<>
										<h3 className="font-medium mb-1">
											Nenhum chat encontrado
										</h3>
										<p className="text-sm text-muted-foreground mb-4">
											Não encontramos nenhum chat com o termo pesquisado.
										</p>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSearchTerm("")}
										>
											Limpar pesquisa
										</Button>
									</>
								) : (
									<>
										<h3 className="font-medium mb-1">
											Nenhuma conversa ainda
										</h3>
										<p className="text-sm text-muted-foreground">
											Comece uma conversa pela lista de contatos.
										</p>
									</>
								)}
							</div>
						)}
					</nav>
				</ScrollArea>
			</nav>

			{/* User Profile Card */}
			<div className="mt-auto border-t pt-2">
				<button
					onClick={() => setIsProfileOpen(true)}
					className={cn(
						"w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors",
						isCollapsed ? "justify-center" : "justify-start"
					)}
				>
					<Avatar className="h-10 w-10">
						{data?.avatar ? (
							<AvatarImage src={data.avatar} alt={data?.name} />
						) : null}
						<AvatarFallback>{data?.name?.charAt(0) || "A"}</AvatarFallback>
					</Avatar>
					{!isCollapsed && (
						<div className="flex flex-col items-start">
							<span className="font-medium text-sm">{data?.name}</span>
							<span className="text-xs text-muted-foreground">{data?.email}</span>
						</div>
					)}
				</button>
			</div>

			<UserProfileModal
				isOpen={isProfileOpen}
				onClose={() => setIsProfileOpen(false)}
				setUpdate={setUpdate}
			/>
		</div>
	);
}
