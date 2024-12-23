import { app, BrowserWindow, screen } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  const { workAreaSize } = screen.getPrimaryDisplay()

  const iconPath = process.platform === 'win32'
    ? path.join(process.env.VITE_PUBLIC, 'iconico.ico')
    : path.join(process.env.VITE_PUBLIC, 'iconpng.png');

  win = new BrowserWindow({
    width: workAreaSize.width,
    height: workAreaSize.height,
    icon: iconPath,
    title: 'Sistema de stock - Lesdarus Software',
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      devTools: false
    },
  })

  win.setMenu(null)

  win.webContents.on('devtools-opened', () => {
    win?.webContents.closeDevTools()
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

import { exec } from 'node:child_process'
if (!VITE_DEV_SERVER_URL) {
  exec('javascript-obfuscator ./dist-electron --output ./dist-electron-obfuscated')
}
