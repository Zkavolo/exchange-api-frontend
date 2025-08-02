<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../api/supabase'
import type { Currency } from '../api/Currency'
import Multiselect from 'vue-multiselect'

const convertedValue = ref<String | null>(null)
const loading = ref(true)
const currencyOptions = ref<string[]>([])
const baseCurrency = ref<string | null>(null)
const targetCurrency = ref<string | null>(null)
const baseCurrencyValue = ref<string>('')

function debounce(fn: (...args: any[]) => void, delay = 500) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

async function fetchCurrencyOptions() {
  const { data, error } = await supabase.from('currency').select('base_currency')

  if (error) {
    console.error('Error fetching currency options:', error)
    return
  }

  currencyOptions.value = [...new Set(data.map((c) => c.base_currency))]
  console.log('Fetched currency options:', currencyOptions.value)
}

async function fetchCurrencies() {
  if (!baseCurrency.value && targetCurrency.value === null) return

  loading.value = true
  const { data, error } = await supabase
    .from('currency')
    .select('*')
    .eq('base_currency', baseCurrency.value)
    .eq('code', targetCurrency.value)

  if (error) {
    console.error('Error fetching currencies:', error)
  } else {
    console.log('Fetched currencies:', data[0].rate)
    convertedValue.value = (parseFloat(baseCurrencyValue.value) * data[0].rate).toFixed(2)
    console.log('Fetched currencies:', convertedValue.value)
  }
  loading.value = false
}

const debouncedFetch = debounce(fetchCurrencies, 600)

onMounted(async () => {
  await fetchCurrencyOptions()
  loading.value = false
})

watch([baseCurrencyValue, targetCurrency], () => {
  debouncedFetch()
})
</script>

<template>
  <div
    class="bg-black text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 border border-gray-700"
  >
    <h2 class="text-xl mb-4">Currency Data</h2>

    <div class="flex flex-col gap-4">
      <input
        v-model="baseCurrencyValue"
        type="text"
        placeholder="value"
        class="p-2 rounded bg-gray-700 border border-gray-400"
      />

      <div>
        <label class="block mb-1 text-gray-300">Base Currency</label>
        <select
          v-model="baseCurrency"
          class="p-2 rounded bg-gray-800 border border-gray-500 text-white w-52"
        >
          <option disabled value="">-- Select Base Currency --</option>
          <option v-for="c in currencyOptions" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 text-gray-300">Target Currency</label>
        <select
          v-model="targetCurrency"
          class="p-2 rounded bg-gray-800 border border-gray-500 text-white w-52"
        >
          <option disabled value="">-- Select Target Currency --</option>
          <option v-for="c in currencyOptions" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>

      <div class="mt-4 text-white">
        <p>{{ targetCurrency }} {{ convertedValue }}</p>
      </div>
    </div>
  </div>
</template>
