"use client";

import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AutosizeTextarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/token";
import { API } from "@/lib/axios";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";

type ChatSidebarProps = {
	loading: boolean;
	streamResponse: string;
	setStreamResponse: Dispatch<SetStateAction<string>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
};

export function ChatSidebar({ loading, setLoading, setStreamResponse, streamResponse }: ChatSidebarProps) {
	const [prompt, setPrompt] = useState("");
	const [chats, setChats] = useState<{ role: "user" | "model"; text: string }[]>([]);
	const [isChatDone, setIsChatDone] = useState(false);

	const scrollRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [chats]);

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await API.get("/chat");
				if (response.data?.chat) setChats(response.data.chat.chats);
			} catch (error: unknown) {
				if (axios.isAxiosError(error))
					toast({ title: error.response?.data.message ?? "Internal Server Error", variant: "destructive" });
				else toast({ title: "Internal Server Error", variant: "destructive" });
			}
		};

		fetchChats();
	}, [isChatDone]);

	const handleStream = () => {
		if (loading || !prompt.trim()) return;

		const authData = getToken();
		if (!authData.token) return;

		setStreamResponse("");
		setLoading(true);

		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_API_URL}/api/chat/ask-ai?token=${encodeURIComponent(authData.token)}&prompt=${prompt}`,
		);

		eventSource.onmessage = event => {
			const data = JSON.parse(event.data);

			switch (data.event) {
				case "start":
					setChats(prev => [...prev, { role: "user", text: prompt }]);
					setPrompt("");
					break;
				case "chunk":
					setStreamResponse(prev => prev + data.text);
					break;
				case "end":
					setLoading(false);
					eventSource.close();
					setChats(prev => [...prev, { role: "model", text: streamResponse }]);
					setIsChatDone(!isChatDone);
					break;
				case "error":
					setLoading(false);
					eventSource.close();
					break;
				default:
					console.warn("Unknown event type:", data.event);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			setLoading(false);
		};

		return () => eventSource.close();
	};
	return (
		<div className={cn("h-screen", streamResponse ? "hidden md:block" : "")}>
			<header className="h-14 flex justify-between bg-secondary items-center px-5 border-r border-background">
				<Link href="/profile">
					<Image src={'../../public/icon.jpg'} alt="logo" width={40} height={40} className="rounded-full" />
				</Link>

				<ThemeToggle />
			</header>
			<ScrollArea ref={scrollRef} className="dark:bg-[#1b1b1b]">
				<aside className="h-[calc(100vh-3.5rem)] grid grid-rows-[1fr,auto] relative">
					{/* Prompts */}
					<section className="space-y-6 px-4 py-6">
						{chats?.length === 0 ? (
							<div className="text-center text-gray-500">Please enter a prompt to generate document.</div>
						) : (
							chats?.map((item, index) => (
								<div
									key={`Message-${index + 1}`}
									className={cn(
										"leading-loose",
										item.role === "model"
											? "bg-secondary rounded-xl py-3 px-4 w-4/5 border border-[#b9b9b9] dark:border-[#575757] cursor-pointer"
											: "",
									)}
									onClick={() => {
										if (item.role === "model") setStreamResponse(item.text);
									}}
								>
									{item.role === "user" ? (
										item.text
									) : (
										<Markdown className="line-clamp-3" remarkPlugins={[remarkGfm]}>
											{item.text}
										</Markdown>
									)}
								</div>
							))
						)}
					</section>

					{/* Input box for messaging */}
					<section className="bg-background dark:bg-[#1b1b1b] p-5 sticky bottom-0">
						<div className="bg-secondary rounded-2xl pt-2 pl-2 pr-3 pb-3 border border-[#b9b9b9] dark:border-[#575757]">
							<AutosizeTextarea
								placeholder="Type your query...."
								maxHeight={200}
								minHeight={80}
								className="resize-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
								value={prompt}
								onChange={e => setPrompt(e.target.value)}
								onKeyDown={e => {
									if (e.key === "Enter" && !e.shiftKey && prompt) {
										e.preventDefault();
										handleStream();
									}
								}}
							/>
							<div className="flex justify-end mt-2">
								<Button
									type="button"
									size="icon"
									variant="outline"
									className={cn(
										"bg-white hover:bg-white/80 hover:text-black text-black rounded-full transition-opacity",
										prompt ? "opacity-100" : "opacity-0",
									)}
									onClick={handleStream}
								>
									<ArrowUp strokeWidth={3} className="size-5" />
								</Button>
							</div>
						</div>
					</section>
				</aside>
			</ScrollArea>
		</div>
	);
}
