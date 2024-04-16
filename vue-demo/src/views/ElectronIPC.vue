<template>
  <div>Electron IPC</div>
  <h1>串口发送数据：{{ portValue }}</h1>
  <h1>串口发送数据：{{ portData.portDatas }}</h1>
</template>

<script setup>
import { usePortDataStore } from '@/stores/port';
import { computed } from 'vue'

const portData = usePortDataStore()

const portValue = computed(() => portData.portDatas)

</script>

<style scoped>
</style>
