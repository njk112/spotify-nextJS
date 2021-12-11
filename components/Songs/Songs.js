import { useQuery } from "@apollo/client";
import { GET_PLAYLIST_ID } from "@playlistReactivity";
import Song from "@SongComponent";
function Songs() {
	const { data } = useQuery(GET_PLAYLIST_ID);
	const { playlistState: currentPlaylist } = data;
	return (
		<div className="px-8 flex flex-col  soac-y-1 pb-28 text-white">
			{currentPlaylist?.tracks.items.map((track, i) => (
				<Song key={track.track.id} track={track} order={i} />
			))}
		</div>
	);
}

export default Songs;
