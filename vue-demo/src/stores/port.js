import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePortDataStore = defineStore('portData', () => {
  const portDatas = ref(0)
  function setPortDatas(value) {
    portDatas.value = value
  }

  return { portDatas, setPortDatas }
})
