<template>
  <div>
    <button @click="signInHandler">Sign in</button>

    {{ status }}
    {{ data }}
  </div>
</template>

<script setup>
  const { signIn, status, data } = useAuth()

  const signInHandler = async () => {
    const result = await signIn('github')
  }
</script>