import { VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import useActiveDevice from "@hooks/useActiveDevice";
import { useCallback, useEffect, useState } from "react";

function Volume() {
	const [currentDevice, setCurrentDevice] = useState({
		devices: [],
		is_active: false
	});

	const [volume, setVolume] = useState(50);
	const deviceInfo = useActiveDevice();

	// eslint-disable-next-line react-hooks/exhaustive-deps
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
		if (currentDevice.is_active) {
			if (volume > 0 && volume < 100) {
				debounceAdjustVolume(volume);
			}
		}
	}, [currentDevice, debounceAdjustVolume, deviceInfo, volume]);

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

	return (
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
	);
}

export default Volume;
