// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },

	modules: ['@sidebase/nuxt-auth', '@prisma/nuxt'],

	auth: {
		isEnabled: true,
		disableServerSideAuth: false,
		originEnvKey: 'AUTH_ORIGIN',
		baseURL: 'http://localhost:3000/api/auth',
		provider: {
			type: 'authjs',
			trustHost: false,
			defaultProvider: 'google',
			addDefaultCallbackUrl: true,
		},
		sessionRefresh: {
			enablePeriodically: true,
			enableOnWindowFocus: true,
		},
		globalAppMiddleware: {
			isEnabled: true,
		},
	},

	runtimeConfig: {
		authSecret: process.env.NUXT_AUTH_SECRET,
		authOrigin: process.env.NUXT_AUTH_ORIGIN,
		// Github
		authGithubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
		authGithubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
		// Google
		authGoogleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
		authGoogleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET
	}
})