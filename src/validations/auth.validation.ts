import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().min(1, { message: "Name is required." }),
		email: z.string().min(1, { message: "E-mail is required." }).email({ message: "Please enter a valid email" }),
		password: z.string().min(6, "Password must be at least 6 characters long"),
		confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
	})
	.refine(data => data.password === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

export const loginSchema = z.object({
	email: z.string().min(1, { message: "E-mail is required." }).email({ message: "Please enter a valid email" }),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, { message: "E-mail is required." }).email({ message: "Please enter a valid email" }),
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters long"),
		confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
	})
	.refine(data => data.password === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
