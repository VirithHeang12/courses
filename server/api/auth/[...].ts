import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const isProd = process.env.NODE_ENV === 'production'

export default NuxtAuthHandler({
	// Use Prisma adapter for NextAuth.js
	adapter: PrismaAdapter(prisma),

	// A secret string you define, to ensure correct encryption
	secret: useRuntimeConfig().authSecret,
	providers: [
		// @ts-expect-error Use .default here for it to work during SSR.
		GithubProvider.default({
			clientId: useRuntimeConfig().authGithubClientId,
			clientSecret: useRuntimeConfig().authGithubClientSecret
		}),
		// @ts-expect-error Use .default here for it to work during SSR.
		GoogleProvider.default({
			clientId: useRuntimeConfig().authGoogleClientId,
			clientSecret: useRuntimeConfig().authGoogleClientSecret
		})
	],
	session: {
		strategy: 'database'
	},
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/logout',
		error: '/auth/error',
	},
	cookies: {
		pkceCodeVerifier: {
			name: `${isProd ? '__Secure-' : ''}next-auth.pkce.code_verifier`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: isProd,
				maxAge: 900,
			},
		},
	},

})