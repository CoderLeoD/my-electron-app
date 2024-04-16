const { app, BrowserWindow, ipcMain } = require('electron');
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('node:path');

const { SerialPort } = require('serialport');

let mainWindow;

// 添加一个createWindow()方法来将index.html加载进一个新的BrowserWindow实例。
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      // nodeIntegration: false,
      nodeIntegration: true,
      // contextIsolation: false,
      contextIsolation: true,
      /**
       * 使用一个相对当前正在执行JavaScript文件的路径，这样您的相对路径将在开发模式和打包模式中都将有效。
       * 
       * __dirname 字符串指向当前正在执行脚本的路径 (在本例中，它指向你的项目的根文件夹)。
       * path.join API 将多个路径联结在一起，创建一个跨平台的路径字符串。
       */
      preload: path.join(__dirname, '/preload.js')
    },
  })

  // 设置安全的Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': `script-src 'self' http://localhost:*`
      }
    });
  });

  // mainWindow.loadFile('index.html')
  // mainWindow.loadFile('./vue-demo/dist/index.html')
  mainWindow.loadURL('http://localhost:5173')


  /**
   * 方案0: 纯 Vue 的 B/S 模型中, Vue 可以识别出有多少个串口, 但是不能识别 串口的硬件信息, 但是 Vue 通过测试, 匹配成功端口之后, 是可以 接收到 串口发送的数据的
   * 
   * 如果要获取 串口的硬件 信息, 比如 串口名称 等, 就需要 electron 来介入了.
   */


  /**
   * 方案一: electron 获取串口列表之后, 发送给 Vue, 而后在 前端页面展示 串口列表, 用户可灵活选择串口某一个串口进行连接
   * 
   * 目前 阻塞障碍: electron 与 vue 通讯方面, serialport 12 版本的很多 API 语法发生变化, 需要多查看 serialport API
   * 
  */
  // sendPortsToVue(mainWindow);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  /**
   * 方案二: 前端界面不选择串口, electron 进行监控, 只要收到 串口数据就 记录/发送/显示
   * 
   * 创建 serial port 监听
   * 
   * 该方案 可以实现: 无论哪个串口有数据发送进来就会记录发送
   */
  watchPortsData();
}

// 方案一对应函数
function sendPortsToVue(mainWindow) {
  // 获取串口信息
  console.log('xdl-electron', SerialPort)
  SerialPort.list().then(ports => {
    console.log('xdl-electron-send-msg', ports)
    setTimeout(() => {
      /**
       * 发送所有 ports 给前端这种形式可能存在一个问题：
       * electron 主线程这边获取到 ports 发送给 Vue 渲染线程时，Vue 还没有准备完毕，没有完成接收动作。
       * 这样的话，数据就会丢失。
       * 
       * 暂时的方案是 延迟500ms 发送，但当 Vue 越来越大时，时间就不确定了。
       * 
       * 这样看来，方案二会好一点，方案二可以在接收到 串口数据 之后 再 send，此时 Vue 应该渲染完毕，
       * 即使不渲染完毕，操作员看到页面没有数据，再次执行扫码等操作也就可以将数据发送成功
       */
      mainWindow.webContents.send('serial-ports', ports);
    }, 500);
  })
}

// 方案二对应函数
function watchPortsData() {
  SerialPort.list().then(ports => {
    console.log('xdl-electron-ports', ports)
    ports.forEach(port => {
      if (port.path) {
        const sp = new SerialPort({ path: port.path, baudRate: 9600 }, err => {
          if (err) {
            return console.error('Error opening port: ', err.message);
          }
        });
   
        sp.on('data', data => {
          console.log(`Data received: ${data}`);
          // 在这里处理接收到的数据
          mainWindow.webContents.send('serial-datas', data);
        });
   
        sp.on('error', err => {
          console.error('Error: ', err.message);
        });
      }
    });
  })
}


// 调用createWindow()函数来打开您的窗口。
// app.whenReady().then(() => {
//   createWindow()
// })


/**
 * 可以使用 ipcMain 在主线程中监控渲染线程 send 的信号
 */
ipcMain.on('open-serial-port', (event, portName) => {
  // 在此处添加打开串口的代码
  // 例如：SerialPort.open(portName);
  console.log('xdl-来了，老弟，这里是 electron 中 open-serial-port', event)
  console.log('xdl-来了，老弟，这里是 electron 中 open-serial-port', portName)
});




/**
 * 管理窗口的生命周期
 * 应用程序窗口在每个OS下有不同的行为，Electron将在app中实现这些约定的责任交给开发者们。
 * 
 * 一般而言，你可以使用 进程 全局的 platform 属性来专门为某些操作系统运行代码。
 */

/**
 * 1, 关闭所有窗口时退出应用 (Windows & Linux)
 * 
 * 在 Windows 和 Linux 上，关闭所有窗口通常会完全退出一个应用程序。
 * 
 * 为了实现这一点，你需要监听 app 模块的 'window-all-closed' 事件。如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * 2, 如果没有窗口打开则打开一个窗口 (macOS)
 * 
 * 当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
 * 
 * 为了实现这一特性，监听 app 模块的 activate 事件。如果没有任何浏览器窗口是打开的，则调用 createWindow() 方法。
 * 
 * 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件。 通过在您现有的 whenReady() 回调中附上您的事件监听器来完成这个操作。
 */
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

