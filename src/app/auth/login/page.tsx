import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/loginForm";
import Link from "next/link";

export const metadata = {
	title: "Login",
};

export default function LoginPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-5">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link href="/auth/register" className="text-sm text-muted-foreground">
						Register instead?
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}
