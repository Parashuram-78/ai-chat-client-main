import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

type EmptyChatProps = {
	streamResponse: string;
};

const EmptyChat = ({ streamResponse }: EmptyChatProps) => {
	return (
		<section
			className={cn(
				"flex flex-col items-center justify-center min-h-screen bg-secondary text-center px-5",
				streamResponse ? "" : "hidden md:flex",
			)}
		>
			<HelpCircle className="w-24 h-24 mb-8 text-gray-400 dark:text-gray-500" />
			<h1 className="text-4xl font-bold mb-4 text-gray-400 dark:text-gray-500">How can I assist you today?</h1>
			<p className="text-xl text-gray-400 max-w-2xl dark:text-gray-500">
				Whether you&apos;re looking to generate a document or need help with editing, I&apos;m here to make the process smooth
				and easy. Just enter a prompt to get started!
			</p>
		</section>
	);
};

export default EmptyChat;
