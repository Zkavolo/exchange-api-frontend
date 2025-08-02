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
    console.log('Fetched currencies:', currencies.value)
  }

  loading.value = false
})

// 👇 group by base_currency
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
    class="absolute bg-black text-amber-50 w-full h-full flex flex-col items-center justify-center"
  >
    <div v-if="loading"></div>

    <div v-else class="flex flex-col gap-10">
      <div v-for="(list, base) in groupedCurrencies" :key="base" class="currency-ticker">
        <ul>
          <li v-for="c in list" :key="c.id">{{ c.base_currency }} → {{ c.code }} : {{ c.rate }}</li>
        </ul>
        <ul aria-hidden="true">
          <li v-for="c in list" :key="c.id">{{ c.base_currency }} → {{ c.code }} : {{ c.rate }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
