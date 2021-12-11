import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function Login({ providers }) {
	return (
		<div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
			<div className="mb-5">
				<Image
					src="/images/spotifyLogo.png"
					alt="Spotify Logo"
					width="320"
					height="320"
				/>
			</div>

			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						className="bg-[#18D860] text-white p-5 rounded-full"
						onClick={() =>
							signIn(provider.id, {
								callbackUrl: "/"
							})
						}
					>
						Login with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();
	return {
		props: {
			providers
		}
	};
}
