<template>
	<h1> Authentication error {{ errorCode }}. Please try again! </h1>
</template>

<script setup lang="ts">
	// Remember to disable the middleware protection from your page!
	definePageMeta({
		auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
	})

	const route = useRoute()
	const errorCode = computed(() => route.query.error)
</script>
