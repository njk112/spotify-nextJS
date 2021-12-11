import { makeVar, gql } from "@apollo/client";
export const centerTopPartVisible = makeVar(true);
export const GET_COLORS = gql`
	query getPlaylistIdState {
		centerTopPartVisible @client
	}
`;
