import useSpotify from "../hooks/useSpotify";
import { GET_SONG } from "../graphql/reactivities/songReactivites";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
function useSongInfo() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	const { currentTrackIdState: currentTrack } = data;

	const [songInfo, setsongInfo] = useState(null);

	useEffect(() => {
		async function fetchSongInfo() {
			if (currentTrack) {
				const trackInfo = await fetch(
					`https://api.spotify.com/v1/tracks/${currentTrack}`,
					{
						headers: { Authorization: `Bearer ${spotifyAPI.getAccessToken()}` },
					}
				).then((res) => res.json());
				console.log("inside fetch");

				setsongInfo(trackInfo);
			}
		}
		fetchSongInfo();
	}, [currentTrack, spotifyAPI]);
	return songInfo;
}

export default useSongInfo;
