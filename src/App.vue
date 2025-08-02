<script setup lang="ts">
import ScrollingBackground from './components/ScrollingBackground.vue'
import CurrencyForm from './components/CurrencyForm.vue'
</script>

<template>
  <header>
    <div class="relative flex flex-col items-center justify-center min-h-screen">
      <div class="z-20">
        <CurrencyForm />
      </div>

      <div class="absolute inset-0 z-10">
        <ScrollingBackground />
      </div>
    </div>
  </header>
</template>
