import Profile from "@/components/profile";
import { Protect } from "@/components/protect";

export const metadata = {
	title: "Profile",
};

export default function ProfilePage() {
	return (
		<Protect>
			<Profile />
		</Protect>
	);
}
