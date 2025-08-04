<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../api/supabase'
import { currencyInitials } from '@/util/CurrencyInitials'

const convertedValue = ref<number>(NaN)
const loading = ref(true)
const currencyOptions = ref<string[]>([])
const baseCurrency = ref<string>('')
const targetCurrency = ref<string>('')
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
    convertedValue.value = Number((parseFloat(baseCurrencyValue.value) * data[0].rate).toFixed(2))
  }
  loading.value = false
}

const debouncedFetch = debounce(fetchCurrencies, 600)

onMounted(async () => {
  await fetchCurrencyOptions()
  loading.value = false
})

watch([baseCurrencyValue, targetCurrency, baseCurrency], () => {
  debouncedFetch()
})
</script>

<template>
  <div class="px-10 pt-8 pb-10 mb-6 max-w-xl w-full mx-auto font-mono shadow-dance-container">
    <h1 class="text-xl mb-6 text-center text-black shadow-dance-text">Simple Currency Converter</h1>

    <div class="flex flex-col gap-6 items-center">
      <input
        v-model="baseCurrencyValue"
        type="number"
        placeholder="Please enter your value here"
        class="p-2 rounded bg-white border text-black border-gray-400 w-full text-center"
      />

      <div class="w-full text-center">
        <select v-model="baseCurrency" class="p-2 text-black w-full text-center">
          <option disabled selected value="">Select Base Currency</option>
          <option v-for="c in currencyOptions" :key="c" :value="c">
            {{ currencyInitials[c] }} ({{ c }})
          </option>
        </select>
      </div>

      <div class="w-full text-center">
        <select v-model="targetCurrency" class="p-2 w-full text-center">
          <option disabled selected value="">Select Target Currency</option>
          <option v-for="c in currencyOptions" :key="c" :value="c">
            {{ currencyInitials[c] }} ({{ c }})
          </option>
        </select>
      </div>

      <div class="mt-4 text-center">
        <p v-if="!isNaN(convertedValue)" class="text-lg text-black animate-bounce">
          ( {{ targetCurrency }} ) {{ currencyInitials[targetCurrency] }}
          <a class="text-green-300">{{ new Intl.NumberFormat('en-US').format(convertedValue) }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
