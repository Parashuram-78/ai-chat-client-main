"use client";

import { Protect } from "@/components/protect";
import dynamic from "next/dynamic";
const ChatComponent = dynamic(() => import("@/components/chat").then(mode => mode.ChatComponent), { ssr: false });

export default function ChatPage() {
	return (
		<Protect>
			<ChatComponent />
		</Protect>
	);
}
