import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import spotifyAPI from "@lib/spotify";

function useSpotify() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			// If refresh access token attempt fails, direct user to login
			if (session.error === "RefreshAccessTokenError") {
				signIn();
			}
			try {
				spotifyAPI.setAccessToken(session.user.accessToken);
			} catch (err) {
				console.error(err);
			}
		}
	}, [session]);

	return spotifyAPI;
}

export default useSpotify;
