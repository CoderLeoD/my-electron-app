import { ElMessage } from 'element-plus'

export default class MySerialPort {
  constructor() {
    this.state = {
      portIndex: undefined,
      ports: [],
      isOpen: false,
      writeType: 1,
      readType: 1,
      isScroll: true,
      readValue: [],
      status: false,
      //port参数
      baudRate: '9600',
      dataBits: '8',
      stopBits: '1',
      parity: 'none',
      flowControl: 'none'
    }
    this.keepReading = false
    this.getPorts = this.getPorts.bind(this)
    this.handleRequestPort = this.handleRequestPort.bind(this)
    this.handleChildrenChange = this.handleChildrenChange.bind(this)
    this.readText = this.readText.bind(this)
    this.writeText = this.writeText.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.a2hex = this.a2hex.bind(this)
    this.hex2a = this.hex2a.bind(this)
    this.hex2atostr = this.hex2atostr.bind(this)
    this.reader = {}
    this.closed
  }

  async getPorts() {
    // 获取已授权的全部串口
    let ports = await navigator.serial.getPorts()
    this.setState({
      ports
    })
  }
  async handleRequestPort() {
    // 请求授权
    try {
      await navigator.serial.requestPort()
      await this.getPorts()
    } catch (e) {
      ElMessage.error(e.toString())
      throw new Error(e.toString())
    }
  }
  async openPort(portIndex, isOpen, callBack = null) {
    // 打开串口
    let port = this.state.ports[portIndex]
    if (!isOpen) {
      // 关闭串口
      this.keepReading = false
      this.reader.cancel()
      await this.closed
      this.handlePortOpen({
        portIndex,
        isOpen
      })
    } else {
      await port.open({
        baudRate: this.state.baudRate,
        dataBits: this.state.dataBits,
        stopBits: this.state.stopBits,
        parity: this.state.parity,
        flowControl: this.state.flowControl
      })
      this.handlePortOpen({
        portIndex,
        isOpen
      })
      this.keepReading = true
      this.closed = this.readUntilClosed(portIndex, callBack)
    }
  }
  async readUntilClosed(portIndex, callBack = null) {
    let port = this.state.ports[portIndex]
    while (port.readable && this.keepReading) {
      this.reader = port.readable.getReader()
      try {
        let readCache = []
        while (true) {
          const { value, done } = await this.reader.read()
          if (done) {
            break
          }
          readCache.push(...value)
          setTimeout(() => {
            if (readCache.length > 0) {
              this.readText(readCache)
              callBack(readCache)
              readCache = []
            }
          }, 300) //串口缓存
        }
      } catch (error) {
        ElMessage.error(error.toString())
      } finally {
        this.reader.releaseLock()
      }
      await port.close()
    }
  }
  handlePortOpen({ portIndex, isOpen }) {
    // 处理打开串口
    this.setState({
      portIndex,
      isOpen
    })
  }
  handleChildrenChange(type, value) {
    this.setState({
      [type]: value
    })
  }
  portWrite(value) {
    return new Promise(async (resolve, reject) => {
      if (!this.state.isOpen) {
        ElMessage.error('串口未打开')
        reject()
        return
      } else {
        let port = this.state.ports[this.state.portIndex]
        const writer = port.writable.getWriter()
        await writer.write(new Uint8Array(value))
        writer.releaseLock()
        resolve(value)
      }
    })
  }
  readText(value) {
    console.log(value, '读取')
    let newValue = this.state.readValue.concat({
      value,
      type: 1
    })
    this.setState({
      readValue: newValue
    })
  }
  writeText(value) {
    console.log(value, '写入')
    this.portWrite(value).then((res) => {
      let newValue = this.state.readValue.concat({
        value: res,
        type: 2
      })
      this.setState({
        readValue: newValue
      })
    })
  }
  handleClear() {
    this.setState({
      readValue: []
    })
  }
  componentDidMount() {
    this.getPorts()
  }
  handleState(status) {
    this.setState({
      status
    })
  }
  setState(obj) {
    Object.keys(this.state).forEach((key) => {
      if (obj[key] != undefined) {
        this.state[key] = obj[key]
      }
    })
  }
  //字节转字符串
  hex2atostr(arr) {
    return String.fromCharCode.apply(String, arr)
  }
  hex2a(hexx) {
    return String.fromCharCode(hexx)
  }
  //字符转16进制
  a2hex(str) {
    return str.charCodeAt(0)
  }
}
