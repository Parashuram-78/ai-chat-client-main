"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, type RegisterForm } from "@/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/axios";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { setToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export function RegisterForm() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const form = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: "", confirmPassword: "", email: "", password: "" },
	});

	async function onRegister(values: RegisterForm) {
		if (loading) return;
		setLoading(true);

		try {
			const response = await API.post("/user/register", values);
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
			<form onSubmit={form.handleSubmit(onRegister)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="e.g. John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? <LoaderCircleIcon className="animate-spin" /> : null}
					<span>Submit</span>
				</Button>
			</form>
		</Form>
	);
}
