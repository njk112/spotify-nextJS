import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import {
	GET_SONG,
	isPlaying,
	currentTrackIdState,
} from "../graphql/reactivities/songReactivites";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import {
	SwitchHorizontalIcon,
	ReplyIcon,
	RewindIcon,
	PauseIcon,
	PlayIcon,
	FastForwardIcon,
} from "@heroicons/react/solid";

function Player() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	console.log(data);
	const { currentTrackIdState: currentTrack, isPlaying: playing } = data;
	const { data: session } = useSession();
	const songInfo = useSongInfo();
	const [volume, setVolume] = useState(50);

	const handlePlayPause = async () => {
		const currentPlaying = await spotifyAPI.getMyCurrentPlaybackState();
		console.log("apiIsPlaying");
		console.log(currentPlaying);
		if (currentPlaying.body?.is_playing) {
			spotifyAPI.pause();
			isPlaying(false);
		} else {
			spotifyAPI.play();
			isPlaying(true);
		}
	};

	useEffect(() => {
		async function fetchCurrentsong() {
			if (!songInfo) {
				const currentPlayingTrack = await spotifyAPI.getMyCurrentPlayingTrack();
				console.log("Now playing: ", currentPlayingTrack?.body?.item);
				if (currentPlayingTrack?.body?.item)
					currentTrackIdState(currentPlayingTrack.body.item.id);

				const currentPlaying = await spotifyAPI.getMyCurrentPlaybackState();
				if (currentPlaying.body?.is_playing === true) isPlaying(true);
			}
		}
		if (spotifyAPI.getAccessToken() && !currentTrack) {
			fetchCurrentsong();
			setVolume(50);
		}
	}, [currentTrack, spotifyAPI, session, songInfo]);

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
			{/* center */}
			<div className="flex items-center justify-evenly">
				<SwitchHorizontalIcon className="button" />
				<RewindIcon
					className="button"
					onClick={() => spotifyAPI.skipToPrevious()}
				/>
				{playing ? (
					<PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
				) : (
					<PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
				)}
				<FastForwardIcon
					className="button"
					onClick={() => spotifyAPI.skipToNext()}
				/>
				<ReplyIcon className="button" />
			</div>
		</div>
	);
}

export default Player;
