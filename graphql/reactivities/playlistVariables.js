import { makeVar, gql } from "@apollo/client";
export const playlistIdState = makeVar("37i9dQZF1EUMDoJuT8yJsl");
export const GET_PLAYLIST_ID = gql`
	query getPlaylistIdState {
		playlistIdState @client
	}
`;
