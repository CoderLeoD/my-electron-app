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
    <canvas id="canvas"></canvas>
  </section>
  <section><img src="" alt="" id="img" /></section>
  <button @click="getCamera">调取摄像头</button>
  <button @click="tackcapture">拍照</button>
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
function tackcapture() {
  // 需要判断媒体流是否就绪
  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const img = document.querySelector('#img')
  const context = canvas.getContext('2d')
  const width = 320 // 视频和canvas的宽度
  let height = 0 //
  let streaming = true // 是否开始捕获媒体
  if (streaming) {
    context.drawImage(video, 0, 0, 350, 200) // 将视频画面捕捉后绘制到canvas里面
    img.src = canvas.toDataURL('image/png') // 将canvas的数据传送到img里
    alert(img.src) // 这边的值可以传入后端
  }

  // 监听视频流就位事件,即视频可以播放了
  video.addEventListener(
    'canplay',
    function() {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width)

        video.setAttribute('width', width)
        video.setAttribute('height', height)
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        streaming = true
      }
    },
    false
  )
}
</script>

<style scoped>
h1 {
  padding: 16px;
}
</style>
