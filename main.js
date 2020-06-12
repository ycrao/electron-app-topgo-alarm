const { app, nativeImage, Tray, net, Notification } = require('electron')
const { createCanvas } = require('canvas')

let tray = null
const iconImage = './icon.png'

app.on('ready', () => {
  tray = new Tray(iconImage)
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
  const canvas = createCanvas(96, 96)
  // Copy the image contents to the canvas
  const ctx = canvas.getContext('2d')
  ctx.font = 'BOLD 32px LcdD'
  // ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'yellow'
  ctx.fillText(price, 0, 44)
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