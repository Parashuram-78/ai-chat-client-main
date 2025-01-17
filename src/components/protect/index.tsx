"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { API } from "@/lib/axios";
import axios from "axios";
import { useEffect, type ReactNode } from "react";

export function Protect({ children }: { children: ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				await API.get("/user");
			} catch (error: unknown) {
				if (axios.isAxiosError(error))
					toast({ title: error.response?.data.message ?? "Internal Server Error", variant: "destructive" });
				else toast({ title: "Internal Server Error", variant: "destructive" });
				router.replace("/auth/login");
			}
		};

		fetchUser();
	}, [router]);

	return children;
}
