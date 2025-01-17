"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { resetPasswordSchema, type ResetPasswordForm } from "@/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/axios";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export function ResetPasswordForm() {
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const params = useParams();

	const form = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { confirmPassword: "", password: "" },
	});

	async function onResetPassword(values: ResetPasswordForm) {
		if (loading) return;
		setLoading(true);

		try {
			const response = await API.put(`/user/reset-password/${params.id}`, values);
			if (response.data) {
				toast({ title: "Password has been reset successfully, login with new credentials" });
				router.replace("/auth/login");
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
			<form onSubmit={form.handleSubmit(onResetPassword)} className="space-y-8">
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
