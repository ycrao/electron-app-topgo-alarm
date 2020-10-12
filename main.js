const { app, nativeImage, Tray, net, Notification, Menu } = require('electron')
const { createCanvas } = require('canvas')

let tray = null
// const iconImage = './icon.png'
const iconImage = nativeImage.createFromPath('./icon.png')

const base64ImageStr = 'data:image/png;base64,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'

const icon = nativeImage.createFromDataURL(base64ImageStr)

app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.setIcon(iconImage);
  }
  tray = new Tray(icon)
  contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Gold Price Listener')
  var count = 0
  setInterval(() => {
    if (count++ % 2 == 0) {
      handleRequest('xau')
    } else {
      handleRequest('autd')
    }
  }, 1000*10)
})


function getBase64ImageDataUrl(price) {
  const canvas = createCanvas(96, 48)
  // Copy the image contents to the canvas
  const ctx = canvas.getContext('2d')
  ctx.font = 'BOLD 32px LcdD'
  // ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  if (process.platform === 'darwin') {
    ctx.fillStyle = 'black'
  } else {
    ctx.fillStyle = 'yellow'
  }
  ctx.fillText(price, 0, 20)
  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  const dataURL = canvas.toDataURL('image/png')
  return dataURL
}

function handleRequest(symbol) {
  var url = tip = null;
  if (symbol === 'xau') {
    url = "https://hq.sinajs.cn/?_=" + Date.now() + "/&list=gds_AUTD"
    tip = ' usd/oz'
  } else {
    url = "https://hq.sinajs.cn/?_=" + Date.now() + "/&list=hf_XAU"
    tip = ' cny/g'
  }
  const request = net.request(url)
  request.on('response', (response) => {
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      var respStr = chunk.toString().replace('var hq_str_gds_AUTD="', '')
      respStr = respStr.replace('var hq_str_hf_XAU="', '')
      respStr = respStr.replace('"', '')
      var prices = respStr.split(',')
      var goldPrice = prices[0]
      var imageDataURL = getBase64ImageDataUrl(goldPrice)
      var dataURLImage = nativeImage.createFromDataURL(imageDataURL)
      tray.setImage(dataURLImage)
      tray.setToolTip(symbol + ': ' + goldPrice + tip)
      // showMsg('金价提醒', symbol + ': ' + goldPrice + tip)
    })
    response.on('end', () => {
      // console.log('No more data in response.')
    })
  })
  request.end()
}

function showMsg(title, body) {
  if (title || body) {
    msg = new Notification({
      title: title,
      body: body + '\n' + new Date().toLocaleString(),
      icon: iconImage,
    })
  }
  if (msg != null) {
    console.info("Message: " + msg.body)
    msg.show()
  }
}