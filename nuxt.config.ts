// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },

	modules: [
		'@prisma/nuxt',
		'@nuxtjs/supabase',
	],

	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
	},

	runtimeConfig: {
		authSecret: process.env.NUXT_AUTH_SECRET,
		authOrigin: process.env.NUXT_AUTH_ORIGIN,
		// Github
		authGithubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
		authGithubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
		// Google
		authGoogleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
		authGoogleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
	}
})
