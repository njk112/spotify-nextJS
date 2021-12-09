import { InMemoryCache } from "@apollo/client";
import {
	playlistIdState,
	playlistState,
} from "./reactivities/playlistVariables";

import {
	currentTrackIdState,
	isPlaying,
	changedSong,
} from "./reactivities/songReactivites";

export default new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				playlistIdState: {
					read() {
						return playlistIdState();
					},
				},
				playlistState: {
					read() {
						return playlistState();
					},
				},
				currentTrackIdState: {
					read() {
						return currentTrackIdState();
					},
				},
				isPlaying: {
					read() {
						return isPlaying();
					},
				},
				changedSong: {
					read() {
						return changedSong();
					},
				},
			},
		},
	},
});
