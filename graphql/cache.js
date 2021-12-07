import { InMemoryCache } from "@apollo/client";
import { playlistVariable } from "./reactivities/playlistVariable";

export default new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				playlistReactivity: {
					read() {
						return playlistReactivity();
					},
				},
			},
		},
	},
});
