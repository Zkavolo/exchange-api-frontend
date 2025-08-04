<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../api/supabase'
import type { Currency } from '../api/Currency'

const currencies = ref<Currency[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase.from('currency').select('*')

  if (error) {
    console.error('Error fetching currencies:', error)
  } else if (data) {
    currencies.value = data as Currency[]
  }

  loading.value = false
})

const groupedCurrencies = computed(() => {
  const groups: Record<string, Currency[]> = {}
  for (const c of currencies.value) {
    if (!groups[c.base_currency]) {
      groups[c.base_currency] = []
    }
    groups[c.base_currency].push(c)
  }
  return groups
})
</script>

<template>
  <div
    class="absolute bg-yellow-100 text-black w-full h-full flex flex-col items-center justify-center font-mono"
  >
    <div v-if="loading"></div>

    <div v-else class="flex flex-col gap-150">
      <div class="currency-ticker">
        <ul>
          <li v-for="c in currencies" :key="c.id">
            <div v-if="c.base_currency !== c.code">
              {{ c.base_currency }}
              <a class="text-green-600"> 1</a> → {{ c.code }}
              <a class="text-green-300">{{ c.rate }}</a>
            </div>
            <div v-else>||</div>
          </li>
        </ul>
        <ul aria-hidden="true">
          <li v-for="c in currencies" :key="c.id">
            <div v-if="c.base_currency !== c.code">
              {{ c.base_currency }}
              <a class="text-green-600"> 1</a> → {{ c.code }}
              <a class="text-green-300">{{ c.rate }}</a>
            </div>
            <div v-else>||</div>
          </li>
        </ul>
      </div>
      <div class="currency-ticker reverse">
        <ul>
          <li v-for="c in currencies" :key="c.id">
            <div v-if="c.base_currency !== c.code">
              {{ c.base_currency }}
              <a class="text-green-600"> 1</a> → {{ c.code }}
              <a class="text-green-300">{{ c.rate }}</a>
            </div>
            <div v-else>||</div>
          </li>
        </ul>
        <ul aria-hidden="true">
          <li v-for="c in currencies" :key="c.id">
            <div v-if="c.base_currency !== c.code">
              {{ c.base_currency }}
              <a class="text-green-600"> 1</a> → {{ c.code }}
              <a class="text-green-300">{{ c.rate }}</a>
            </div>
            <div v-else>||</div>
          </li>
          +
        </ul>
      </div>
    </div>
  </div>
</template>
