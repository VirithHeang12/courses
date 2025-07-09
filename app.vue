<template>
  <div>
    <template v-for="provider in providers">
      <button @click="signInHandler(provider.id)">Sign in with {{ provider.name }}</button>
    </template>

    {{ status }}
    {{ data }}

    <button @click="signOutHandler">Sign out</button>
  </div>
</template>

<script setup>
  const { signIn, status, data, signOut, getProviders } = useAuth()

  const providers = await getProviders()

  const signInHandler = async (providerId) => {
    await signIn(providerId)
  }

  const signOutHandler = async () => {
    await signOut()
  }
</script>