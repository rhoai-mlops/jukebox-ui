// client/src/components/ResponseChart.vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  data: number[]
}

const props = defineProps<Props>()

const chartOptions = computed(() => {
  const labels = props.data.map((_, index) => `${index}`)
  const values = [...props.data]

  // Sort data while keeping original indices as labels
  const combined = labels.map((label, i) => ({ label, value: values[i] }))
  combined.sort((a, b) => b.value - a.value)

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
    colors: ['#3B82F6'], // blue-500
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: combined.map(item => item.label),
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
      tickAmount: 10, // This will give us 10 evenly spaced ticks
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
  data: [...props.data].sort((a, b) => b - a)
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