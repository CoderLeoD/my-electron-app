<!-- 
  4，多个button，依次获取数据，每次获取一个串口

  通过过滤能不能自动选择串口，然后点击按钮可以直接选中对应串口？
 -->
<template>
  <div class="about">
    <input type="text" v-model="servalData" name="" id="" hidden>
    <p>条码数据：{{ servalData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const servalData = ref('')


</script>

<style>

</style>



