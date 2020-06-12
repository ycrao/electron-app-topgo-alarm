const { app, BrowserWindow, Notification } = require('electron')

const isDarwin = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';
let image = __dirname + '/icon.png'

function createWindow () {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 并且为你的应用加载index.html
  // win.loadFile('index.html')
  win.loadURL('https://chart.tubiaojia.com/tubiaojia.html?symbol=mAu(T+D)')
  // 打开开发者工具
  // win.webContents.openDevTools()

  win.setProgressBar(0.2)
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

app.on('ready', () => {
  if (isDarwin) {
    app.dock.hide()
  }
  showMsg('测试', '这是一条测试信息')
})

//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。

function showMsg(title, body) {
  if (title || body) {
    msg = new Notification({
      title: title,
      body: body + '\n' + new Date().toLocaleString(),
      icon: image
    })
  }
  if (msg != null) {
    console.info("Message: " + msg.body)
    msg.show()
  }
}