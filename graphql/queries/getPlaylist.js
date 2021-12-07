import { gql } from "@apollo/client";
export const GET_PLAYLIST = gql`
	query getPlaylist {
		playlistVariable @client
	}
`;
