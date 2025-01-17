"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { API } from "@/lib/axios";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { removeToken } from "@/lib/token";
import { formatDate } from "@/lib/formatDate";
import { LogOut } from "lucide-react";

export default function Profile() {
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const [user, setUser] = useState({ name: "", email: "", joinedOn: "" });

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await API.get("/user");
				if (response.data?.user)
					setUser({
						name: response.data.user.name,
						email: response.data.user.email,
						joinedOn: response.data.user.createdAt,
					});
			} catch (error: unknown) {
				if (axios.isAxiosError(error))
					toast({ title: error.response?.data.message ?? "Internal Server Error", variant: "destructive" });
				else toast({ title: "Internal Server Error", variant: "destructive" });
				router.replace("/auth/login");
			}
		};

		fetchUser();
	}, [router]);

	function handleLogout() {
		removeToken();
		router.replace("/auth/login");
		toast({ title: "Logout successfully", variant: "default" });
	}

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
			<Card className="w-full max-w-md bg-gray-800 border-gray-700">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold text-white">Profile</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex justify-center">
						<Avatar className="h-24 w-24 ring-2 ring-white">
							<AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
					</div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h2 className="text-xl font-semibold text-white text-center">{user.name}</h2>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="text-gray-300 text-center"
					>
						<p>Email: {user.email}</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="text-gray-400 text-sm text-center"
					>
						<p>Joined on: {user.joinedOn ? formatDate(user.joinedOn) : null}</p>
					</motion.div>
				</CardContent>
				<CardFooter>
					<Button
						variant="destructive"
						className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" /> Logout
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
