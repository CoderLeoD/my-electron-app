<template>
  <el-row justify="center" v-show="portsList.length == 0">
    <el-col :span="7">
      <div style="margin-top: 200px">
        <span style="display: block">
          仅支持Chrome 89+或者Edge 89+浏览器(安全上下文（HTTPS）中可用)
        </span>
        <el-button type="primary" @click="obtainAuthorization">授权</el-button>
      </div>
    </el-col>
  </el-row>

  <el-form class="formBox" v-show="portsList.length > 0" ref="formRef" :model="form" label-width="100px">
    <el-row>
      <el-col :span="7">
        <div>
          <el-form-item label="串口">
            <el-select
              v-model="form.port"
              filterable
              placeholder="请选择串口"
              :disabled="isDisable"
            >
              <el-option
                v-for="item in portsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="波特率">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="form.baudRate"
              :fetch-suggestions="querySearch"
              placeholder="请输入波特率"
              :disabled="isDisable"
            >
              <template #suffix>
                <el-icon class="el-input__icon">
                  <Edit />
                </el-icon>
              </template>
              <template #default="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="数据位">
            <el-select v-model="form.dataBits" placeholder="请选择数据位" :disabled="isDisable">
              <el-option label="7" value="7"></el-option>
              <el-option label="8" value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="停止位">
            <el-select v-model="form.stopBits" placeholder="请选择停止位" :disabled="isDisable">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="校验位">
            <el-select v-model="form.parity" placeholder="请选择校验位" :disabled="isDisable">
              <el-option label="None" value="none"></el-option>
              <el-option label="Even" value="even"></el-option>
              <el-option label="Odd" value="odd"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="流控制">
            <el-select
              v-model="form.flowControl"
              placeholder="请选择流控制"
              :disabled="isDisable"
            >
              <el-option label="None" value="none"></el-option>
              <el-option label="HardWare" value="hardware"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示历史">
            <el-switch v-model="form.isShowHistory" @change="loadHistory" :style="{marginRight: '24px'}"></el-switch>
            <el-button type="danger" @click="clearHistory">清空历史</el-button>
          </el-form-item>
          
          <el-form-item label="串口操作">
            <el-button :type="btnType" @click="connectBtn">{{ btnText }}</el-button>
            <el-button type="info" @click="obtainAuthorization">新增授权</el-button>
          </el-form-item>
          
          <!-- 给串口发送信息 -->
          <el-form-item label="发送信息">
            <el-switch v-model="isShowSendArea"></el-switch>
          </el-form-item>
          <el-form-item label="发送区设置" v-show="isShowSendArea">
            <el-form-item label="信息格式">
              <el-radio-group v-model="form.type">
                <el-radio value="1">ASCII</el-radio>
                <el-radio value="2">HEX</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="信息内容">
              <el-input type="textarea" v-model="form.sendMsg"></el-input>
            </el-form-item>
            <div class="sendBox">
              <el-button type="primary" @click="sendCommon">发送</el-button>
            </div>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <el-form-item label="串口信息">
            <el-input
              type="textarea"
              v-model="form.desc"
              disabled
              :autosize="{ minRows: 21, maxRows: 25 }"
            ></el-input>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <p>注：Vue 无法获取串口的硬件信息，如果需要获取 串口的硬件信息，需要使用 Electron 或 其它第三方库</p>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import MySerialPort from '@/utils/MySerialPort'
import USBDevice from '@/utils/usb.json'

/**
 * DOM 元素
 */
// el-form 标签
const formRef = ref(null)

/**
 * 数据
 */
let myserialport = new MySerialPort()
const isShowSendArea = ref(false)
const btnType = ref('primary')
const btnText = ref('连接串口')
// 波特率建议列表
const restaurants = ref([])
// 端口列表
const portsList = ref([])
// from 表单
const form = ref({
  baudRate: '9600',
  dataBits: '8',
  stopBits: '1',
  parity: 'none',
  flowControl: 'none',
  desc: '',
  type: '1',
  isShowHistory: false,
  port: 0,
  sendMsg: '',
})

/**
 * 计算属性
 */

const isDisable = computed(() => {
  return btnType.value == 'danger'
})


/**
 * 生命周期
 */
onMounted(() => {
  if ('serial' in navigator) {
    myserialport = new MySerialPort()
    getPorts()
    navigator.serial.addEventListener('connect', () => {
      ElMessage({
        message: '设备已连接-mounted',
        type: 'success',
      })
      getPorts()
    })
    navigator.serial.addEventListener('disconnect', () => {
      ElMessage.error('设备已断开-mounted')
    })
    restaurants.value = loadAll()
  } else {
    ElMessage.error('当前为HTTP模式或者浏览器版本过低，不支持网页连接串口')
  }
})


async function getPorts() {
  await myserialport.getPorts()
  getPortInfo(myserialport.state.ports)
}

function loadAll() {
  return [
    { value: '110' },
    { value: '300' },
    { value: '600' },
    { value: '1200' },
    { value: '2400' },
    { value: '4800' },
    { value: '7200' },
    { value: '9600' },
    { value: '14400' },
    { value: '19200' },
    { value: '28800' },
    { value: '38400' },
    { value: '56000' },
    { value: '57600' },
    { value: '76800' },
    { value: '115200' },
    { value: '230400' },
    { value: '460800' }
  ]
}


/**
 * 授权
 */
async function obtainAuthorization() {
  if ('serial' in navigator) {
    console.log('The Web Serial API is supported.')
    if (!myserialport) {
      myserialport = new MySerialPort()
    }
    try {
      await myserialport.handleRequestPort()
      ElMessage({
        message: '串口授权成功-btn Click',
        type: 'success',
      })
      getPortInfo(myserialport.state.ports)
    } catch (error) {
      ElMessage({
        message: '未选择新串口授权！-btn Click',
        type: 'warning',
      })
    }
  } else {
    ElMessage.error('当前为HTTP模式或者浏览器版本过低，不支持网页连接串口')
  }
}
//串口列表初始化
function getPortInfo(portList) {
  portsList.value = []
  portList.map((port, index) => {
    const { usbProductId, usbVendorId } = port.getInfo()
    if (usbProductId === undefined || usbVendorId === undefined) {
      portsList.value.push({ label: '未知设备' + index, value: index })
    } else {
      const usbVendor = USBDevice.filter((item) => parseInt(item.vendor, 16) === usbVendorId)
      let usbProduct = []
      if (usbVendor.length === 1) {
        usbProduct = usbVendor[0].devices.filter(
          (item) => parseInt(item.devid, 16) === usbProductId
        )
      }
      portsList.value.push({ label: usbProduct[0].devname, value: index })
    }
  })
}
/**
 * form
 */
// 波特率建议
function querySearch(queryString, cb) {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // 调用 callback 返回建议列表的数据
  cb(results)
}
function createFilter(queryString) {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
// 加载历史
function loadHistory() {
  if (form.value.isShowHistory) {
    form.value.desc = readLi().join('')
  } else {
    const temp = readLi()
    if (temp.length > 0) {
      form.value.desc = temp[temp.length - 1].join('')
    }
  }
}
const readType = ref(1)
function readLi() {
  return myserialport.state.readValue.map((items, index) => {
    console.log('xdl-index', index)
    const item = items.value
    // const type = items.type // 1接收，2发送
    const body = []
    if (item !== undefined) {
      let strArr = []
      for (let hex of Array.from(item)) {
        strArr.push(hex.toString(16).toLocaleUpperCase())
      }
      if (strArr.includes('D') && strArr.includes('A')) {
        if (strArr.indexOf('A') - strArr.indexOf('D') === 1) {
          strArr.splice(strArr.indexOf('D'), 1)
          strArr.splice(strArr.indexOf('A'), 1, `<br key={0} />`)
        }
      }
      strArr = strArr.map((item) => {
        if (typeof item === 'string') {
          if (readType.value === 1) {
            return myserialport.hex2a(parseInt(item, 16))
          } else if (readType.value === 2) {
            return item + ' '
          }
        }
        return item
      })
      if (typeof strArr[strArr.length - 1] === 'string') {
        strArr.push('\r\n')
      }
      body.push(strArr.join(''))
    }
    return body
  })
}

// 清空历史
function clearHistory() {
  form.value.desc = ''
  myserialport.state.readValue = []
}

// 发送
function sendCommon() {
  if (myserialport.state.isOpen) {
    if (form.value.sendMsg.length !== 0) {
      const writeType = form.value.type
      const value = form.value.sendMsg
      const arr = []
      if (writeType == 1) {
        // ASCII
        for (let i = 0; i < value.length; i++) {
          arr.push(myserialport.a2hex(value[i]))
        }
      } else if (writeType == 2) {
        // HEX
        if (/^[0-9A-Fa-f]+$/.test(value) && value.length % 2 === 0) {
          for (let i = 0; i < value.length; i = i + 2) {
            arr.push(parseInt(value.substring(i, i + 2), 16))
          }
        } else {
          ElMessage.error('格式错误')
          return
        }
      }
      myserialport.writeText(arr)
    } else {
      ElMessage({
        message: '请输入发送的信息',
        type: 'warning',
      })
    }
  } else {
    ElMessage({
      message: '串口处于关闭状态，请连接串口',
      type: 'warning',
    })
  }
}

//连接
async function connectBtn() {
  if (btnType.value == 'primary') {
    try {
      myserialport.state.baudRate = form.value.baudRate
      myserialport.state.dataBits = form.value.dataBits
      myserialport.state.stopBits = form.value.stopBits
      myserialport.state.parity = form.value.parity
      myserialport.state.flowControl = form.value.flowControl
      await myserialport.openPort(form.value.port, true, callBack)
    } catch (error) {
      ElMessage.error('串口连接失败！请检查串口是否已被占用')
    }
    if (myserialport.state.isOpen) {
      ElMessage({
        message: '串口连接成功- 连接串口 btn Click',
        type: 'success',
      })
      btnType.value = 'danger'
      btnText.value = '关闭串口'
      console.log('xdl-连接的串口信息', myserialport)
    }
  } else {
    myserialport.openPort(form.value.port, false, callBack)
    ElMessage({
      message: '串口关闭成功- 关闭串口 btn Click',
      type: 'success',
    })
    btnType.value = 'primary'
    btnText.value = '连接串口'
  }
}
// 接受数据的回调
function callBack(value) {
  if (form.value.isShowHistory) {
    form.value.desc = readLi().join('')
  } else {
    if (value.length > 0) {
      form.value.desc = myserialport.hex2atostr(value)
    }
  }
}



</script>

<style scoped>
.formBox {
  padding-top: 36px;
}
.sendBox {
  width: 100%;
  padding-top: 12px;
  display: flex;
  justify-content: center;
}
</style>
