import { makeVar, gql } from "@apollo/client";
export const currentTrackIdState = makeVar(null);
export const isPlaying = makeVar(false);
export const GET_SONG = gql`
	query getPlaylistIdState {
		currentTrackIdState @client
		isPlaying @client
	}
`;
