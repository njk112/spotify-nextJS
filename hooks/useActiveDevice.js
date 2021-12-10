import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
function useActiveDevice() {
	const spotifyAPI = useSpotify();

	const [activeDevices, setActiveDevices] = useState(null);

	useEffect(() => {
		async function getCurrentDevices() {
			const activeDevices = await spotifyAPI.getMyDevices();
			setActiveDevices(activeDevices);
		}
		try {
			getCurrentDevices();
		} catch (err) {
			console.error(err);
		}
	}, [spotifyAPI]);

	return activeDevices;
}

export default useActiveDevice;
