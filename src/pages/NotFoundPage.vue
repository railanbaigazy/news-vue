<template>
  <div class="not-found">
    <h1>404 — Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/" class="btn">Go home</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  color: #1f2937;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #3b82f6;
  color: white;
}
</style>
