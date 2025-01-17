"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginForm } from "@/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/axios";
import { setToken } from "@/lib/token";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	async function onLogin(values: LoginForm) {
		if (loading) return;
		setLoading(true);

		try {
			const response = await API.post("/user/login", values);
			if (response.data?.token) {
				setToken(response.data.token);
				toast({ title: response.data?.message ?? "Registered successfully" });
				router.replace("/");
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error))
				toast({ title: error.response?.data.message ?? "Internal Server Error", variant: "destructive" });
			else toast({ title: "Internal Server Error", variant: "destructive" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onLogin)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input placeholder="e.g. johndoe@gmail.com" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Link href="/auth/forgot-password" className="text-xs text-muted-foreground">
					Forgot Password?
				</Link>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? <LoaderCircleIcon className="animate-spin" /> : null}
					<span>Submit</span>
				</Button>
			</form>
		</Form>
	);
}
