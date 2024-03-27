const { app, BrowserWindow } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')

// 添加一个createWindow()方法来将index.html加载进一个新的BrowserWindow实例。
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      /**
       * 使用一个相对当前正在执行JavaScript文件的路径，这样您的相对路径将在开发模式和打包模式中都将有效。
       * 
       * __dirname 字符串指向当前正在执行脚本的路径 (在本例中，它指向你的项目的根文件夹)。
       * path.join API 将多个路径联结在一起，创建一个跨平台的路径字符串。
       */
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // win.loadFile('index.html')
  win.loadFile('./vue-demo/dist/index.html')
}

// 调用createWindow()函数来打开您的窗口。
app.whenReady().then(() => {
  createWindow()
})

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