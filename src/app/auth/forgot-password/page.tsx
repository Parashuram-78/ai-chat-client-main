import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgotPasswordForm";

export const metadata = {
	title: "Forgot Password",
};

export default function ForgotPasswordPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-5">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Forgot Password</CardTitle>
				</CardHeader>
				<CardContent>
					<ForgotPasswordForm />
				</CardContent>
			</Card>
		</main>
	);
}
