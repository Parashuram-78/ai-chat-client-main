import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/resetPasswordForm";

export const metadata = {
	title: "Reset Password",
};

export default function ResetPasswordPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-5">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Reset Password</CardTitle>
				</CardHeader>
				<CardContent>
					<ResetPasswordForm />
				</CardContent>
			</Card>
		</main>
	);
}
