"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export function ForgotPasswordForm() {
	const [loading, setLoading] = useState(false);

	const form = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	async function onForgotPassword(values: ForgotPasswordForm) {
		if (loading) return;
		setLoading(true);

		try {
			const response = await API.post("/user/forgot-password", values);
			if (response.data) toast({ title: response.data?.message ?? "Check your email for password reset link" });
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
			<form onSubmit={form.handleSubmit(onForgotPassword)} className="space-y-8">
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
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? <LoaderCircleIcon className="animate-spin" /> : null}
					<span>Submit</span>
				</Button>
			</form>
		</Form>
	);
}
