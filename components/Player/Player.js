import SongInfo from "@SongInfoComponent";
import Controls from "@ControlsComponent";
import Volume from "@VolumeComponent";

function Player() {
	return (
		<div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			{/* left */}
			<SongInfo />
			{/* center */}
			<Controls />
			{/* right side */}
			<Volume />
		</div>
	);
}

export default Player;
