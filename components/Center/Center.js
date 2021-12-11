import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useQuery } from "@apollo/client";
import {
	GET_PLAYLIST_ID,
	playlistState,
} from "@playlistReactivity";
import useSpotify from "@hooks/useSpotify";
import Songs from "@SongsComponent";
import UserProfile from "@UserProfileComponent";
import { useInView } from "react-intersection-observer";
import { centerTopPartVisible } from "@colorReactivity";

const colorArr = [
	"from-indigo-500",
	"from-blue-500",
	"from-green-500",
	"from-red-500",
	"from-yellow-500",
	"from-pink-500",
	"from-purple-500",
];

function Center() {
	const spotifyAPI = useSpotify();
	const [color, setColor] = useState(null);
	const { data } = useQuery(GET_PLAYLIST_ID);
	const { playlistIdState: playListId, playlistState: currentPlaylist } = data;
	const { ref, inView } = useInView({});

	useEffect(() => {
		setColor(shuffle(colorArr).pop());
	}, [playListId]);

	useEffect(() => {
		async function setCurrentPlaylist() {
			try {
				const data = await spotifyAPI.getPlaylist(playListId);
				playlistState(data.body);
			} catch (err) {
				console.error(err);
			}
		}

		if (spotifyAPI.getAccessToken()) {
			setCurrentPlaylist();
		}
	}, [spotifyAPI, playListId, currentPlaylist]);

	useEffect(() => {
		centerTopPartVisible(inView);
	}, [inView, ref]);

	return (
		<div className="flex-grow h-screen overflow-y-scroll scrollbar-hide overscroll-none ">
			<header className="absolute top-5 right-8">
				<UserProfile />
			</header>
			<section
				className={`flex items-end space-x-7 
				bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
				ref={ref}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					className="h-44 w-44 shadow-2xl"
					src={currentPlaylist?.images?.[0]?.url}
					alt="Playlist cover image"
				/>
				<div>
					<p>Playlist</p>
					<h1 className="text-2xl md:text-3xl xl:text-5xl font bold">
						{currentPlaylist?.name}
					</h1>
				</div>
			</section>
			<div>
				<Songs />
			</div>
		</div>
	);
}

export default Center;
