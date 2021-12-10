import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import {
	GET_SONG,
	isPlaying,
	currentTrackIdState,
	changedSong,
} from "../graphql/reactivities/songReactivites";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import {
	SwitchHorizontalIcon,
	ReplyIcon,
	RewindIcon,
	PauseIcon,
	PlayIcon,
	FastForwardIcon,
	VolumeUpIcon,
	VolumeOffIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import useActiveDevice from "../hooks/useActiveDevice";

function Player() {
	const spotifyAPI = useSpotify();
	const { data } = useQuery(GET_SONG);
	const {
		currentTrackIdState: currentTrack,
		isPlaying: playing,
		changedSong: songHasChanged,
	} = data;
	const { data: session } = useSession();
	const songInfo = useSongInfo();
	const deviceInfo = useActiveDevice();

	const [currentDevice, setCurrentDevice] = useState({
		devices: [],
		is_active: false,
	});
	const [volume, setVolume] = useState(50);

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

	const debounceAdjustVolume = useCallback(
		debounce((volume) => {
			try {
				spotifyAPI.setVolume(volume);
			} catch (err) {
				console.error(err);
			}
		}, 500),
		[]
	);

	useEffect(() => {
		async function fetchCurrentsong() {
			if (!songInfo) {
				try {
					const currentPlayingTrack =
						await spotifyAPI.getMyCurrentPlayingTrack();
					console.log("Now playing: ", currentPlayingTrack?.body?.item);
					if (currentPlayingTrack?.body?.item)
						currentTrackIdState(currentPlayingTrack.body.item.id);
				} catch (err) {
					console.error(err);
				}

				try {
					const currentPlaying = await spotifyAPI.getMyCurrentPlaybackState();
					if (currentPlaying.body?.is_playing === true) isPlaying(true);
				} catch (err) {
					console.log(err);
				}
			}
		}

		if (spotifyAPI.getAccessToken() && !currentTrack) {
			fetchCurrentsong();
		}
	}, [currentTrack, spotifyAPI, session, songInfo]);

	useEffect(() => {
		function checkActiveDevices() {
			const activeDevices = deviceInfo?.body?.devices?.filter(
				(device) => device.is_active === true
			);

			if (activeDevices?.length > 0) {
				let deviceObj = {};
				deviceObj.devices = activeDevices[0];
				deviceObj.is_active = true;
				setCurrentDevice(deviceObj);
				if (deviceObj.devices?.volume_percent)
					setVolume(deviceObj.devices.volume_percent);
			}
		}
		checkActiveDevices();
	}, [deviceInfo]);

	useEffect(() => {
		if (currentDevice.is_active) {
			if (volume > 0 && volume < 100) {
				debounceAdjustVolume(volume);
			}
		}
	}, [currentDevice, debounceAdjustVolume, deviceInfo, volume]);

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
				<RewindIcon className="button" onClick={handlePrevious} />
				{playing ? (
					<PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
				) : (
					<PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
				)}
				<FastForwardIcon className="button" onClick={handleNext} />
				<ReplyIcon className="button" />
			</div>
			{/* right side */}
			<div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
				<VolumeOffIcon
					onClick={() => volume > 0 && setVolume(volume - 10)}
					className="button"
				/>
				<input
					type="range"
					min={0}
					max={100}
					value={volume}
					className="w-14 md:w-28 input:bg-black"
					onChange={(e) => setVolume(Number(e.target.value))}
				/>
				<VolumeUpIcon
					className="button"
					onClick={() => volume < 100 && setVolume(volume + 10)}
				/>
			</div>
		</div>
	);
}

export default Player;
