import { InMemoryCache } from "@apollo/client";
import { playlistIdState } from "./reactivities/playlistVariables";

export default new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				playlistIdState: {
					read() {
						return playlistIdState();
					},
				},
			},
		},
	},
});
