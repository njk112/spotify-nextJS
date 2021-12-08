import { useSession, signOut } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useQuery } from "@apollo/client";

import {
	GET_PLAYLIST_ID,
	playlistState,
} from "../graphql/reactivities/playlistVariables";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
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
	const { data: session } = useSession();
	const spotifyAPI = useSpotify();
	const [color, setColor] = useState(null);
	const { data } = useQuery(GET_PLAYLIST_ID);
	const { playlistIdState: playListId, playlistState: currentPlaylist } = data;

	useEffect(() => {
		setColor(shuffle(colorArr).pop());
	}, []);

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
	}, [spotifyAPI, playListId]);
	console.log(currentPlaylist);

	return (
		<div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
			<header className="absolute top-5 right-8">
				<div
					className="flex items-center bg-black text-white space-x-3 opacity-90
				 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
					onClick={signOut}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={session?.user.image}
						alt="User"
						className="rounded-full w-10 h-10"
					/>
					<h2>{session?.user.name}</h2>
					<ChevronDownIcon className="h-5 w-5" />
				</div>
			</header>
			<section
				className={`flex items-end space-x-7 
				bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
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
