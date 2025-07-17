<template>
	<header>
		<NuxtLink to="/about">About</NuxtLink>
		<NuxtLink to="/profile">Profile</NuxtLink>
		<button v-if="!isAuthenticated" @click="signInHandler">Login</button>
		<button v-if="isAuthenticated" @click="signOutHandler">Logout</button>
		{{ status }}
	</header>
	<div>
		<NuxtPage />
	</div>
</template>

<script setup>

	const { signOut, status, signIn } = useAuth()

	const isAuthenticated = computed(() => {
		return status.value === 'authenticated'
	})

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