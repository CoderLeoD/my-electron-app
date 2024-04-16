import { usePortDataStore } from '@/stores/port';

/**
 * electron 主线程发送来的 ports 信息
 */
window.electronAPI.onSerialPorts((value) => {
  console.log('xdl-来了，老弟', value)
})


/**
 * 接收 electron 发送过来的数据
 */
window.electronAPI.onSerialDatas((value) => {
  /**
   * 数据转换（value 为 Uint8Array 格式的数据）：
   * 根据你接收到的具体数据格式，你可能需要进行更复杂的解析。
   * 这取决于你与设备之间的通信协议以及你发送和接收数据的方式。
   */
  // 1, 如果是 ASCII 编码的，你可以使用 TextDecoder 对象将 Uint8Array 转换为字符串
  const decoder = new TextDecoder('utf-8');
  const receivedString = decoder.decode(value);
  console.log(receivedString);
  // 2, 如果是以其他编码格式（例如 UTF-16）发送的，你可以相应地修改 TextDecoder 的参数
  // const dataView = new DataView(value);
  // const receivedNumber = dataView.getInt32(0, true); // 第二个参数表示小端序
  // console.log(receivedNumber);
  const { setPortDatas } = usePortDataStore()
  setPortDatas(receivedString)
})


