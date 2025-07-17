<template>
	<header>
		<NuxtLink to="/about">About</NuxtLink>
		<NuxtLink v-if="isAuthenticated" to="/profile">Profile</NuxtLink>
		<button v-if="!isAuthenticated" @click="signInHandler">Login</button>
		<button v-if="isAuthenticated" @click="signOutHandler">Logout</button>

	</header>
	<div>
		<NuxtPage />
	</div>
</template>


<script setup>

	const { signOut, status, signIn } = useAuth()

	const isAuthenticated = computed(() => status === 'authenticated')

	/**
	 * Sign out the user
	 * 
	 * @returns {void}
	 */
	function signOutHandler() {
		signOut({
			callbackUrl: '/'
		})
	}

	/**
	 * Sign in the user
	 * 
	 * @returns {void}
	 */
	function signInHandler() {
		signIn({
			providerId: 'google',
		})

	}
</script>