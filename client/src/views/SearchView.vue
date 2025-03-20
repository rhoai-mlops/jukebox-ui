// client/src/views/SearchView.vue
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import AutocompleteSearch from '@/components/AutocompleteSearch.vue'
import CountryList from '@/components/CountryList.vue'

const probabilities = ref<number[]>([])
const countryCodes = ref<string[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchTrack = async (trackId: string) => {
  isLoading.value = true
  error.value = null
  probabilities.value = []
  countryCodes.value = []

  try {
    const requestBody = {
      inputs: [
        {
          name: "input",
          shape: [1, 1],
          datatype: "STRING",
          data: [[trackId]]
        }
      ]
    }

    const response = await axios.post('/api/v2/models/jukebox/infer', requestBody)
    
    if (response.data?.outputs) {
      probabilities.value = response.data.outputs[0].data
      countryCodes.value = response.data.outputs[1].data
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while searching 💩'
    console.error('Search Error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      Predict Track Popularity 🔮
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <AutocompleteSearch @search="searchTrack" />
      
      <!-- Error Message -->
      <div 
        v-if="error" 
        class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ error }}
      </div>

      <CountryList 
        :probabilities="probabilities"
        :country-codes="countryCodes"
        :is-loading="isLoading"
      />
    </div>
  </div>
</template>