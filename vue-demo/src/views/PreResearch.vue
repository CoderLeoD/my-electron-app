<template>
  <h1>前端功能探索</h1>
  <hr />
  <div id="print-section">
    <p>你好</p>
  </div>
  <button @click="printBtn">打印</button>
  <hr />
  <video ref="video" autoplay></video>
  <section>
    <canvas ref="canvas"></canvas>
  </section>
  <section><img src="" alt="" ref="photoImg" /></section>
  <button @click="getCamera">调取摄像头</button>
  <button @click="tackCapture">拍照</button>
  <hr>
  <button @click="getConnection">网络连接信息对象</button>
  <button @click="getKeyboard">Navigator.keyboard</button>
</template>

<script setup>
import { ref } from 'vue'

// import pdf from 'vue-pdf'

/**
 * 一，打印机功能
 */
function printBtn() {
  // 假设你有一个要打印的元素，它有一个唯一的id为print-section
  const printSection = document.getElementById('print-section')

  printSection.innerHTML = '<h1>你好</h1>'
  // 使用HTML5的API来打印特定部分
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printSection.innerHTML)

  printWindow.document.close()
  printWindow.focus()

  // 调用window.print()函数来打印新窗口的内容
  printWindow.print()
  printWindow.close()
}

/**
 * 二，调取摄像头
 */
const video = ref(null)
function getCamera() {
  // const video = this.$refs.video

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.value.srcObject = stream
      })
      .catch((error) => {
        console.error('摄像头调用错误:', error)
      })
  } else {
    alert('您的浏览器不支持摄像头调用')
  }
}
const canvas = ref(null)
const photoImg = ref(null)
function tackCapture() {
  // 需要判断媒体流是否就绪
  const context = canvas.value.getContext('2d')
  const width = 320 // 视频和canvas的宽度
  let height = 0 //
  let streaming = true // 是否开始捕获媒体
  if (streaming) {
    context.drawImage(video.value, 0, 0, 350, 200) // 将视频画面捕捉后绘制到canvas里面
    photoImg.value.src = canvas.value.toDataURL('image/png') // 将canvas的数据传送到img里
    alert(photoImg.value.src) // 这边的值可以传入后端
  }

  // 监听视频流就位事件,即视频可以播放了
  video.value.addEventListener(
    'canplay',
    function() {
      if (!streaming) {
        height = video.value.videoHeight / (video.value.videoWidth / width)

        video.value.setAttribute('width', width)
        video.value.setAttribute('height', height)
        canvas.value.setAttribute('width', width)
        canvas.value.setAttribute('height', height)
        streaming = true
      }
    },
    false
  )
}

/**
 * 三，Navigator
 */
function getConnection() {
  // 提供一个 NetworkInformation 对象来获取设备的网络连接信息
  console.log('xdl-', navigator.connection)
}
function getKeyboard() {
  // 提供一个 NetworkInformation 对象来获取设备的网络连接信息
  console.log('xdl-', navigator.bluetooth)
}



</script>

<style scoped>
h1 {
  padding: 16px;
}
</style>
