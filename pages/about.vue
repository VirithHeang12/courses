<template>
	<div>
		<h1>About Us</h1>
		<p>Welcome to our about page! Here you can learn more about our mission and values.</p>
		<p>We are committed to providing the best service possible and ensuring customer satisfaction.</p>
	</div>

	<button @click="createCustomer">Create Customer</button>
</template>

<script setup>
	/**
	 * Create customer  
	 *
	 * @returns {void}
	 */
	async function createCustomer() {
		const data = await $fetch('/api/customers/create', {
			method: 'POST',
			body: {
				name: 'New Customer'
			},
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

</script>