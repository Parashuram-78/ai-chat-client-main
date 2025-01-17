import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/registerForm";
import Link from "next/link";

export const metadata = {
	title: "Register",
};

export default function RegisterPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-5">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterForm />
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link href="/auth/login" className="text-sm text-muted-foreground">
						Login instead?
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}
