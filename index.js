const { app, Menu, Tray } = require('electron')
const path = require('path')
const bg = require('himawari-bg')
const pkg = require('./package.json')

const second = 1000
const minute = second * 60

let tray = null
let timer = null
let shouldQuit = false

shouldQuit = app.makeSingleInstance((argv, wd) => {
  console.log('Second app instance opened, but was prevented:', argv, wd)
})

if (shouldQuit) app.quit()
else app.on('ready', ready)

function ready () {
  if (app.dock) app.dock.hide()

  const iconPath = path.join(__dirname, 'assets', 'Icon-Template.png')

  tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `hi8 v${pkg.version}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Update Desktop',
      submenu: [
        {
          label: 'Now',
          click: update
        },
        { type: 'separator' },
        {
          label: 'Every 10 minutes',
          type: 'radio',
          click: update,
          checked: true
        },
        {
          label: 'Every hour',
          type: 'radio',
          click: update
        },
        {
          label: 'Off',
          type: 'radio',
          click: update
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click () { app.quit() }
    }
  ])

  tray.setToolTip('hi8')
  tray.setContextMenu(contextMenu)
  setBackground()
  resetTimer(minute * 10)
}

function update ({ label }) {
  switch (label) {
    case 'Now': setBackground(); break
    case 'Every 10 minutes': resetTimer(minute * 10); break
    case 'Every hour': resetTimer(minute * 60); break
    default: resetTimer()
  }
}

function resetTimer (ms) {
  clearInterval(timer)
  if (ms) timer = setInterval(setBackground, ms)
}

function setBackground () {
  let outfile = path.join(app.getPath('pictures'), 'Himawari-8', `${Date.now()}.jpg`)

  bg({ outfile })
}
