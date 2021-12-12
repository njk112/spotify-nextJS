import {
	SwitchHorizontalIcon,
	ReplyIcon,
	RewindIcon,
	PauseIcon,
	PlayIcon,
	FastForwardIcon
} from "@heroicons/react/solid";
import { useQuery } from "@apollo/client";
import { GET_SONG, isPlaying, currentTrackIdState } from "@songReactivity";

import { GET_PLAYLIST_ID } from "@playlistReactivity";
import useSpotify from "@hooks/useSpotify";

function Controls() {
	const spotifyAPI = useSpotify();

	const { data } = useQuery(GET_SONG);
	const { isPlaying: playing, currentTrackIdState: currentSong } = data;

	const { data: playListData } = useQuery(GET_PLAYLIST_ID);
	const { playlistState: currentPlaylist } = playListData;

	const handlePlayPause = async () => {
		try {
			const currentPlaying = await spotifyAPI.getMyCurrentPlaybackState();
			if (currentPlaying.body?.is_playing) {
				spotifyAPI.pause();
				isPlaying(false);
			} else {
				spotifyAPI.play();
				isPlaying(true);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handlePreviousNext = async (value) => {
		const currentlyPlaying = currentPlaylist?.tracks?.items?.findIndex(
			(track) => track.track?.id === currentSong
		);

		if (currentlyPlaying === -1) {
			if (value < 0) await spotifyAPI.skipToPrevious();
			else await spotifyAPI.skipToNext();
		} else {
			try {
				const nextTrack =
					currentPlaylist?.tracks?.items[currentlyPlaying + value]
						?.track;
				spotifyAPI.play({
					uris: [nextTrack.uri]
				});
				currentTrackIdState(nextTrack.id);
			} catch (err) {
				console.error(err);
			}
		}
	};

	return (
		<div className="flex items-center justify-evenly">
			<SwitchHorizontalIcon className="button" />
			<RewindIcon
				className="button"
				onClick={() => handlePreviousNext(-1)}
			/>
			{playing ? (
				<PauseIcon
					className="button w-10 h-10"
					onClick={handlePlayPause}
				/>
			) : (
				<PlayIcon
					className="button w-10 h-10"
					onClick={handlePlayPause}
				/>
			)}
			<FastForwardIcon
				className="button"
				onClick={() => handlePreviousNext(1)}
			/>
			<ReplyIcon className="button" />
		</div>
	);
}

export default Controls;
