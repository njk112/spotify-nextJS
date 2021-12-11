import { useSession } from "next-auth/react";
import useSpotify from "@hooks/useSpotify";
import { GET_SONG, isPlaying, currentTrackIdState } from "@songReactivity";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import useSongInfo from "@hooks/useSongInfo";
function SongInfo() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	const { currentTrackIdState: currentTrack } = data;
	const { data: session } = useSession();
	const songInfo = useSongInfo();

	useEffect(() => {
		async function fetchCurrentsong() {
			if (!songInfo) {
				try {
					const currentPlayingTrack =
						await spotifyAPI.getMyCurrentPlayingTrack();
					console.log(
						"Now playing: ",
						currentPlayingTrack?.body?.item
					);
					if (currentPlayingTrack?.body?.item)
						currentTrackIdState(currentPlayingTrack.body.item.id);
				} catch (err) {
					console.error(err);
				}

				try {
					const currentPlaying =
						await spotifyAPI.getMyCurrentPlaybackState();
					if (currentPlaying.body?.is_playing === true)
						isPlaying(true);
				} catch (err) {
					console.log(err);
				}
			}
		}

		if (spotifyAPI.getAccessToken() && !currentTrack) {
			fetchCurrentsong();
		}
	}, [currentTrack, spotifyAPI, session, songInfo]);
	return (
		<div className="flex items-center space-x-4">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				className="hidden md:inline h-10 w-10"
				src={songInfo?.album?.images?.[0]?.url}
				alt=""
			/>
			<div>
				<h3>{songInfo?.name}</h3>
				<p>{songInfo?.artists?.[0]?.name}</p>
			</div>
		</div>
	);
}

export default SongInfo;
