<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHealth } from './api/health'

const status = ref('Checking API…')
const healthy = ref(false)

onMounted(async () => {
  try {
    const result = await getHealth()
    healthy.value = result.status === 'UP'
    status.value = `${result.service} is ${result.status}`
  } catch {
    status.value = 'API is unavailable'
  }
})
</script>

<template>
  <main class="shell">
    <section class="card" aria-labelledby="title">
      <p class="eyebrow">Java + Vue starter</p>
      <h1 id="title">npdemo</h1>
      <p class="intro">Ready for the first product workflow.</p>
      <p class="status" :class="{ healthy }" role="status">
        <span aria-hidden="true"></span>{{ status }}
      </p>
    </section>
  </main>
</template>
