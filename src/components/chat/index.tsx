"use client";

import { useState } from "react";
import { ChatContents } from "./contents";
import { ChatSidebar } from "./sidebar";
import EmptyChat from "./empty-chat";

export function ChatComponent() {
	const [streamResponse, setStreamResponse] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<main className="relative min-h-screen grid grid-cols-1 md:grid-cols-[25rem,1fr] place-content-center">
			<ChatSidebar
				setStreamResponse={setStreamResponse}
				streamResponse={streamResponse}
				loading={loading}
				setLoading={setLoading}
			/>
			{streamResponse ? (
				<ChatContents streamResponse={streamResponse} loading={loading} setStreamResponse={setStreamResponse} />
			) : (
				<EmptyChat streamResponse={streamResponse} />
			)}
		</main>
	);
}
