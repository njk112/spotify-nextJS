import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import client from "./../client";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session}>
			<ApolloProvider client={client}>
				<Component {...pageProps} />
			</ApolloProvider>
		</SessionProvider>
	);
}

export default MyApp;
