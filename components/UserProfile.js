import { useQuery } from "@apollo/client";
import { ChevronDownIcon } from "@heroicons/react/outline";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { GET_COLORS } from "@reactivities/colorReactivities";
import colorOptions from "@styles/stylingOptions";

function UserProfile() {
	const { data: session } = useSession();
	const { data } = useQuery(GET_COLORS);
	const { centerTopPartVisible } = data;

	const [colors, setColors] = useState(colorOptions.default);

	useEffect(() => {
		console.log(colorOptions);
		if (!centerTopPartVisible) {
			setColors(colorOptions.onChange);
		} else {
			setColors(colorOptions.default);
		}
	}, [centerTopPartVisible]);

	return (
		<div
			className={`flex items-center ${colors.background} ${colors.text} space-x-3 opacity-90
     hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 transition transform
	 duration-500 ease-out`}
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
