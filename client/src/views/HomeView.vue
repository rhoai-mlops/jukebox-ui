// client/src/views/HomeView.vue
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import AudioFeatureSlider from '@/components/AudioFeatureSlider.vue'
import ResponseChart from '@/components/ResponseChart.vue'
import { featureConfigs } from '@/utils/normalization'

const audioFeatures = ref({
  is_explicit: 0,
  duration_ms: 237000,
  danceability: 0.735,
  energy: 0.578,
  key: 5,
  loudness: -11.84,
  mode: 0,
  speechiness: 0.0461,
  acousticness: 0.514,
  instrumentalness: 0.0902,
  liveness: 0.0817,
  valence: 0.624,
  tempo: 98.002
})

const orderedFeatures = [
  'is_explicit',
  'duration_ms',
  'danceability',
  'energy',
  'key',
  'loudness',
  'mode',
  'speechiness',
  'acousticness',
  'instrumentalness',
  'liveness',
  'valence',
  'tempo'
] as const

const updateFeature = (feature: keyof typeof audioFeatures.value, value: number) => {
  audioFeatures.value[feature] = value
}

const inferenceResponse = ref<any>(null)
const chartData = ref<number[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const showLocation = async () => {
  const normalizedData = orderedFeatures.map(feature => {
    const value = audioFeatures.value[feature]
    const config = featureConfigs[feature]
    return Number(config.normalize(value).toFixed(4))
  })

  console.log('Normalized Location:', normalizedData)

  console.log('input:', import.meta.env.INPUT_NODE)

  const requestBody = {
    inputs: [
      {
        name: import.meta.env.INPUT_NODE || 'dense_input',
        shape: [1, 13],
        datatype: "FP32",
        data: normalizedData
      }
    ]
  }

  try {
    isLoading.value = true
    error.value = null
    
    const response = await axios.post('/api/v2/models/jukebox/infer', requestBody)
    inferenceResponse.value = response.data
    console.log('Inference Response:', response.data)
    
    // Extract the data array for the chart
    if (response.data?.outputs?.[0]?.data) {
      chartData.value = response.data.outputs[0].data
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    console.error('Inference Error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <div class="container mx-auto px-4">
    <!-- <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Jukebox AI</h1> -->
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column - Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Audio Features</h2>
          <button
            @click="showLocation"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Predict Location</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <!-- Sliders -->
        <div class="space-y-6">
          <AudioFeatureSlider
            v-for="feature in orderedFeatures"
            :key="feature"
            :label="feature"
            :value="audioFeatures[feature]"
            @update:value="(value) => updateFeature(feature, value)"
          />
        </div>
      </div>

      <!-- Right Column - Results -->
      <div class="space-y-6">
        <!-- Results Chart -->
        <div v-if="chartData.length" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Response Distribution</h2>
          <ResponseChart :data="chartData" />
        </div>

        <!-- Raw Response Data -->
        <div v-if="inferenceResponse" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Raw Response</h2>
          <div class="max-h-60 overflow-y-auto">
            <pre class="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded">{{ JSON.stringify(inferenceResponse, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the raw data */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-900 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>