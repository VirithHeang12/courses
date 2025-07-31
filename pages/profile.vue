<template>
	<div>
		Profile Page
	</div>
</template>

<script setup>
	const { data } = await useAsyncData('user', () => {
		return $fetch('/api/profile/get-profile', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	})

</script>