import { ChevronDownIcon } from "@heroicons/react/outline";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

function UserProfile() {
	const { data: session } = useSession();

	return (
		<div
			className="flex items-center bg-black text-white space-x-3 opacity-90
     hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
			onClick={signOut}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={session?.user.image}
				alt="User"
				className="rounded-full w-10 h-10"
			/>
			<h2>{session?.user.name}</h2>
			<ChevronDownIcon className="h-5 w-5" />
		</div>
	);
}

export default UserProfile;
