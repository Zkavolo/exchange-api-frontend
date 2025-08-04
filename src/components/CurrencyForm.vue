<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '../api/supabase'
import { currencyInitials, currencyLogos } from '@/util/CurrencyInitials'

const convertedValue = ref<number>(0)
const loading = ref(true)
const currencyOptions = ref<string[]>([])
const baseCurrency = ref<string>('')
const targetCurrency = ref<string>('')
const baseCurrencyValue = ref<number>(0)

const formatter = computed(
  () =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: baseCurrency.value,
      minimumFractionDigits: 0,
    }),
)

const formattedValue = computed({
  get() {
    return baseCurrencyValue.value != null
      ? formatter.value.format(baseCurrencyValue.value)
      : formatter.value.format(0)
  },
  set(val: string) {
    const numericString = val.replace(/\D/g, '')
    const numeric = Number(numericString)
    baseCurrencyValue.value = isNaN(numeric) ? 0 : numeric
  },
})

function handleKeydown(e: KeyboardEvent) {
  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    return
  }
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault()
  }
}

function addAmount(amount: number) {
  baseCurrencyValue.value += amount
}

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
    convertedValue.value = Number(baseCurrencyValue.value * data[0].rate.toFixed(2))
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
    <div class="w-full text-center">
      <select
        v-model="baseCurrency"
        class="p-2 rounded w-full max-w-md text-center bg-yellow-200 focus:bg-yellow-400 focus:text-gray-600"
      >
        <option disabled selected value="">Select Base Currency</option>
        <option v-for="c in currencyOptions" :key="c" :value="c">
          {{ currencyInitials[c] }} ({{ c }})
        </option>
      </select>
    </div>

    <div class="w-full text-center">
      <select
        v-model="targetCurrency"
        class="p-2 rounded w-full max-w-md text-center bg-yellow-200 focus:bg-yellow-400 focus:text-gray-600"
      >
        <option disabled selected value="">Select Target Currency</option>
        <option v-for="c in currencyOptions" :key="c" :value="c">
          {{ currencyInitials[c] }} ({{ c }})
        </option>
      </select>
    </div>
    <div class="flex flex-col gap-6 items-center">
      <div
        v-if="(targetCurrency && baseCurrency !== null) || 0"
        class="w-full max-w-md text-center"
      >
        <input
          v-model="formattedValue"
          type="text"
          placeholder="Please enter your value here"
          @keypress="handleKeydown"
          class="p-2 rounded border w-full text-center bg-yellow-200 focus:bg-yellow-400 focus:text-gray-600"
        />
        <div class="flex flex-row gap-2 justify-center mt-2">
          <button
            @click="addAmount(1000)"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +1000
          </button>
          <button
            @click="addAmount(100)"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +100
          </button>
          <button
            @click="addAmount(10)"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +10
          </button>
        </div>
      </div>

      <div v-else class="text-gray-500">Please select a base and target currency to convert.</div>
      <div v-if="convertedValue !== 0 || null" class="mt-4 text-center">
        <h2 class="text-lg text-black mb-2">Result :</h2>
        <p class="text-lg text-black">
          {{ currencyLogos[targetCurrency] }}
          {{ new Intl.NumberFormat('en-US').format(convertedValue) }}
        </p>
      </div>
      <div v-else class="mt-4 text-center">
        <h2 class="text-lg text-yellow-200 mb-2">-------</h2>
        <p class="text-lg text-yellow-200">----------- -----------</p>
      </div>
    </div>
  </div>
</template>
