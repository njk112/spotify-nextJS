import useSpotify from "@hooks/useSpotify";
import { GET_SONG } from "@songReactivity";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
function useSongInfo() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	const { currentTrackIdState: currentTrack, changedSong: songHasChanged } =
		data;

	const [songInfo, setsongInfo] = useState(null);

	useEffect(() => {
		async function fetchSongInfo() {
			console.log("inside songInfo hook");
			console.log(currentTrack);
			if (currentTrack) {
				const trackInfo = await fetch(
					`https://api.spotify.com/v1/tracks/${currentTrack}`,
					{
						headers: { Authorization: `Bearer ${spotifyAPI.getAccessToken()}` },
					}
				).then((res) => res.json());

				setsongInfo(trackInfo);
			}
		}
		try {
			fetchSongInfo();
		} catch (err) {
			console.error(err);
		}
	}, [currentTrack, spotifyAPI, songHasChanged]);
	return songInfo;
}

export default useSongInfo;
