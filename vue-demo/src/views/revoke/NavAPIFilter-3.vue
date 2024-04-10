<!-- 
  3，添加过滤功能
 -->
<template>
  <button v-if="!port" @click="chooseSerial">选择扫码枪串口</button>
</template>

<script setup>
import { ref } from 'vue'
const port = ref(null)
//选择串口设备
const chooseSerial = async () => {
  if ('serial' in navigator) {
    try {
      port.value = (await navigator.serial.requestPort()) || null
      console.log('选择串口成功')
      port.value && openSerial()
    } catch (e) {
      console.log('选择串口失败')
    }
  } else {
    console.log('浏览器不支持serial API')
  }
}

//打开串口读取数据
const openSerial = async () => {
  const { usbProductId, usbVendorId } = port.value.getInfo()
  console.log('xdl-设备信息, port.value', port.value)
  console.log('xdl-设备信息', usbProductId, usbVendorId)
  // 串口时设置 9600 波特率
  // await port.value.open({ baudRate: 9600 })
  // USB 时, 任意值都行
  await port.value.open({ baudRate: 9600 })
  try {
    /**
     * getReader() 方法在 Chrome 106 之后, 可以通过设置 {mode: "byob"} 参数来控制内存的分配方式
     */
    const reader = port.value.readable.getReader()
    let data = '' //扫码数据
    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        // 允许 serial port 在随后被关闭
        reader.releaseLock()
        break
      }
      // value 是一个 Uint8Array
      console.log('xdl-value===', value)
      data = `${data}${value}`
      if (value.includes('\r')) {
        //读取结束
        let codeData = data
        data = '' //清空下次读取不会叠加
        console.log(`二维码数据:${codeData}`)
        //处理拿到数据逻辑
      }
    }
  } catch (error) {
    console.error(error)
    port.value = null
  } finally {
    reader.releaseLock()
    console.log('关闭串口')
    await port.value.close()
    port.value = null
  }
}
</script>
