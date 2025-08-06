<template>
	<div>
		Profile Page {{ data }}
	</div>
</template>

<script setup>
	const user = useSupabaseUser()

	const { data } = await useAsyncData('user', () => {
		return $fetch('/api/profile/get-profile', {
			headers: useRequestHeaders(['cookie'])
		})
	})

</script>