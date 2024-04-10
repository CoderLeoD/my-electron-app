<!-- 
  4，多个button，依次获取数据，每次获取一个串口

  通过过滤能不能自动选择串口，然后点击按钮可以直接选中对应串口？
 -->
<template>
  <div>
    <button @click="connectToSerialPort" :disabled="connected">Connect</button>
    <button @click="disconnectFromSerialPort" :disabled="!connected">Disconnect</button>
    <div v-if="connected">
      <input type="text" v-model="dataToSend" />
      <button @click="sendData">Send</button>
    </div>
    <ul>
      <li v-for="(data, index) in receivedData" :key="index">{{ data }}</li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SerialPortData',
  data() {
    return {
      port: null,
      connected: false,
      receivedData: [],
      dataToSend: ''
    };
  },
  methods: {
    async connectToSerialPort() {
      try {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: 9600 });
        this.connected = true;
        this.readLoop();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async disconnectFromSerialPort() {
      try {
        await this.port.close();
        this.connected = false;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async sendData() {
      try {
        const writer = this.port.writable.getWriter();
        await writer.write(this.dataToSend);
        await writer.releaseLock();
        this.dataToSend = '';
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async readLoop() {
      try {
        const reader = this.port.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          this.receivedData.push(value);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
};
</script>
