import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify";

const refreshAcessToken = async (token) => {
	try {
		spotifyAPI.setAccessToken(token.accessToken);
		spotifyAPI.setRefreshToken(token.refreshToken);
		const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();

		console.log("REFRESHED TOKEN IS: ", refreshedToken);

		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // In case API withdraw the og refresh token
		};
	} catch (err) {
		console.error(err);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
};

export default NextAuth({
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, account, user }) {
			// Initial sign in
			if (account && user) {
				("INITIAL TOKEN");
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000,
				};
			}
			// If the previous token hasn't expired yet login
			if (Date.now() < token.accessTokenExpires) {
				console.log(token);
				console.log("TOKEN EXISTS");
				return token;
			}
			// If token has expired -> Refresh the token
			console.log("REFRESH TOKEN");
			return await refreshAcessToken(token);
		},

		async session({ session, token }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;
			return session;
		},
	},
});
