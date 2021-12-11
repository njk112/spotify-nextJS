import { InMemoryCache } from "@apollo/client";
import {
	playlistIdState,
	playlistState,
} from "@playlistReactivity";

import {
	currentTrackIdState,
	isPlaying,
	changedSong,
} from "@songReactivity";

import { centerTopPartVisible } from "@colorReactivity";

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
				centerTopPartVisible: {
					read() {
						return centerTopPartVisible();
					},
				},
			},
		},
	},
});
