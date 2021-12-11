import {
	SwitchHorizontalIcon,
	ReplyIcon,
	RewindIcon,
	PauseIcon,
	PlayIcon,
	FastForwardIcon,
} from "@heroicons/react/solid";
import { useQuery } from "@apollo/client";
import {
	GET_SONG,
	isPlaying,
	changedSong
} from "@songReactivity";
import useSpotify from "@hooks/useSpotify";

function Controls () {
    const { data } = useQuery(GET_SONG);
    const spotifyAPI = useSpotify();

    const {
		currentTrackIdState: currentTrack,
		isPlaying: playing,
		changedSong: songHasChanged
	} = data;

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

	const handleNext = async () => {
		try {
			await spotifyAPI.skipToNext();
			changedSong(!songHasChanged);
		} catch (err) {
			console.error(err);
		}
	};

	const handlePrevious = async () => {
		try {
			spotifyAPI.skipToPrevious();
			changedSong(!songHasChanged);
		} catch (err) {
			console.error(err);
		}
	};

    return (
        <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" onClick={handlePrevious} />
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
        <FastForwardIcon className="button" onClick={handleNext} />
        <ReplyIcon className="button" />
    </div>
    )
}

export default Controls;
