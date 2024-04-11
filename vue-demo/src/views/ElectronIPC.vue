<template>
  <div>Electron IPC</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'



onMounted(() => {
  getPorts()
})

const serialPorts = ref([])

function getPorts() {
  // 监听从主进程传递过来的串口信息
  ipcRenderer.on('serial-ports', (event, ports) => {
    serialPorts.value = ports;
    console.log('xdl-来了，老弟', event)
    console.log('xdl-来了，老弟', ports)
  })
}



</script>

<style scoped>
</style>
