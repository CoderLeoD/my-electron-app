/**
 * 通过预加载脚本从渲染器访问Node.js。
 * 
 * 现在，最后要做的是输出Electron的版本号和它的依赖项到你的web页面上。
 * 
 * 在主进程通过Node的全局 process 对象访问这个信息是微不足道的。 然而，你不能直接在主进程中编辑DOM，因为它无法访问渲染器 文档 上下文。 它们存在于完全不同的进程！
 * 
 * 这是将 预加载 脚本连接到渲染器时派上用场的地方。 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境。
 */

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

/**
 * 上面的代码访问 Node.js process.versions 对象，并运行一个基本的 replaceText 辅助函数将版本号插入到 HTML 文档中。
 * 
 * 要将此脚本附加到渲染器流程，请在你现有的 BrowserWindow 构造器中将路径中的预加载脚本传入 webPreferences.preload 选项。(也就是 main.js 中的 BrowserWindow() 方法)
 */

/**
 * 主线程 与 渲染线程 通讯 预加载
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onSerialPorts: (callback) => ipcRenderer.on('serial-ports', (_event, value) => callback(value)),
  onSerialDatas: (callback) => ipcRenderer.on('serial-datas', (_event, value) => callback(value))
})

