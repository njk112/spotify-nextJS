import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { GET_SONG } from "../graphql/reactivities/songReactivites";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";

function Player() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	const { currentTrackIdState: currentTrack, isPlaying: playing } = data;
	const { data: session } = useSession();
	const songInfo = useSongInfo();

	useEffect(() => {
		async function fetchCurrentsong() {
			if (!songInfo) {
				console.log("Now playing: ", data.body?.item);
				const data = await spotifyAPI.getMyCurrentPlayingTrack();
				spotifyAPI.setCurrentIdTrack(data.body?.item?.id);

				const currentPlaying = await spotifyAPI.getMyCurrentPlaybackState();
				spotifyAPI.setIsPlaying(currentPlaying.body?.is_playing);
			}
		}
		if (spotifyAPI.getAccessToken() && !currentTrack) {
			fetchCurrentsong(setVolume(50));
		}
	}, [currentTrack, spotifyAPI, session, songInfo]);

	const [volume, setVolume] = useState(50);
	return (
		<div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			{/* left */}
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
		</div>
	);
}

export default Player;
