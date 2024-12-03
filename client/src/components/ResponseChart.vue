// client/src/components/ResponseChart.vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  data: number[]
}

const props = defineProps<Props>()

const chartOptions = computed(() => {
  const labels = props.data.map((_, index) => `${index}`)
  const values = [...props.data]

  // Sort and get top 10
  const combined = labels.map((label, i) => ({ label, value: values[i] }))
  combined.sort((a, b) => b.value - a.value)
  const top10 = combined.slice(0, 10)

  return {
    chart: {
      type: 'bar',
      height: 800,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        distributed: true,
        columnWidth: '50%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: top10.map(item => item.label),
      labels: {
        style: {
          colors: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        },
        rotate: -45,
        rotateAlways: true
      }
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 10,
      labels: {
        style: {
          colors: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        },
        formatter: (value: number) => value.toFixed(2)
      }
    },
    grid: {
      borderColor: document.documentElement.classList.contains('dark') 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)'
    },
    theme: {
      mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
  }
})

const series = computed(() => [{
  data: [...props.data]
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map(item => item.value)
}])
</script>

<template>
  <div class="w-full">
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>