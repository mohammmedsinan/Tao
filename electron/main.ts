import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - import.meta.env.VITE_DEV_SERVER_URL
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        title: 'TAO - The Way of Love2D',
        backgroundColor: '#120E24', // Void Purple
        titleBarStyle: 'hiddenInset',
        titleBarOverlay: {
            color: '#120E24',
            symbolColor: '#00F0FF',
            height: 40
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
}

// Quit when all windows are closed, except on macOS
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

// ============================================
// IPC HANDLERS - File System Operations
// ============================================

// Open folder dialog
ipcMain.handle('dialog:openFolder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
})

// Check if path is a valid Tao project
ipcMain.handle('project:validate', async (_event, projectPath: string) => {
    try {
        const configPath = path.join(projectPath, 'tao', 'tao_config.json')
        const exists = fs.existsSync(configPath)
        if (exists) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            return { valid: true, config }
        }
        return { valid: false, config: null }
    } catch {
        return { valid: false, config: null }
    }
})

// Initialize a new Tao project
ipcMain.handle('project:initialize', async (_event, projectPath: string, projectName: string) => {
    try {
        const taoDir = path.join(projectPath, 'tao')
        const charactersDir = path.join(taoDir, 'characters')
        const localizationDir = path.join(taoDir, 'localization')

        // Create directories
        fs.mkdirSync(taoDir, { recursive: true })
        fs.mkdirSync(charactersDir, { recursive: true })
        fs.mkdirSync(localizationDir, { recursive: true })

        // Create config file
        const config = {
            version: '1.0.0',
            projectName,
            created: new Date().toISOString(),
            paths: {
                assets: 'assets',
                output: 'src/generated',
                localization: 'tao/localization'
            },
            modules: {
                talks: {
                    defaultLanguage: 'en',
                    supportedLanguages: ['en']
                },
                motions: {
                    useAseprite: false
                }
            }
        }

        fs.writeFileSync(
            path.join(taoDir, 'tao_config.json'),
            JSON.stringify(config, null, 2)
        )

        // Create default localization file
        fs.writeFileSync(
            path.join(localizationDir, 'en.json'),
            JSON.stringify({}, null, 2)
        )

        return { success: true, config }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// Read file
ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8')
        return { success: true, content }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// Write file
ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string) => {
    try {
        const dir = path.dirname(filePath)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(filePath, content, 'utf-8')
        return { success: true }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// List directory
ipcMain.handle('fs:listDir', async (_event, dirPath: string) => {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true })
        return {
            success: true,
            entries: entries.map(e => ({
                name: e.name,
                isDirectory: e.isDirectory(),
                path: path.join(dirPath, e.name)
            }))
        }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// Check if path exists
ipcMain.handle('fs:exists', async (_event, filePath: string) => {
    return fs.existsSync(filePath)
})

// ============================================
// TALKS MODULE - Save dialogue data
// ============================================

ipcMain.handle('talks:save', async (_event, projectPath: string, graphId: string, graphData: object) => {
    try {
        const talksDir = path.join(projectPath, 'tao', 'talks')
        fs.mkdirSync(talksDir, { recursive: true })

        // Save as JSON
        const jsonPath = path.join(talksDir, `${graphId}.json`)
        fs.writeFileSync(jsonPath, JSON.stringify(graphData, null, 2))

        return { success: true, path: jsonPath }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

ipcMain.handle('talks:exportLua', async (_event, projectPath: string, graphId: string, luaContent: string) => {
    try {
        const outputDir = path.join(projectPath, 'src', 'generated', 'talks')
        fs.mkdirSync(outputDir, { recursive: true })

        const luaPath = path.join(outputDir, `${graphId}.lua`)
        fs.writeFileSync(luaPath, luaContent)

        return { success: true, path: luaPath }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

ipcMain.handle('talks:load', async (_event, projectPath: string) => {
    try {
        const talksDir = path.join(projectPath, 'tao', 'talks')
        if (!fs.existsSync(talksDir)) {
            return { success: true, graphs: {} }
        }

        const files = fs.readdirSync(talksDir).filter(f => f.endsWith('.json'))
        const graphs: Record<string, object> = {}

        for (const file of files) {
            const content = fs.readFileSync(path.join(talksDir, file), 'utf-8')
            const graphId = file.replace('.json', '')
            graphs[graphId] = JSON.parse(content)
        }

        return { success: true, graphs }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// ============================================
// MOTIONS MODULE - Save animation data
// ============================================

ipcMain.handle('motions:save', async (_event, projectPath: string, characterId: string, animData: object) => {
    try {
        const motionsDir = path.join(projectPath, 'tao', 'motions')
        fs.mkdirSync(motionsDir, { recursive: true })

        // Save as JSON
        const jsonPath = path.join(motionsDir, `${characterId}.json`)
        fs.writeFileSync(jsonPath, JSON.stringify(animData, null, 2))

        return { success: true, path: jsonPath }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

ipcMain.handle('motions:exportLua', async (_event, projectPath: string, characterId: string, luaContent: string) => {
    try {
        const outputDir = path.join(projectPath, 'src', 'generated', 'motions')
        fs.mkdirSync(outputDir, { recursive: true })

        const luaPath = path.join(outputDir, `${characterId}.lua`)
        fs.writeFileSync(luaPath, luaContent)

        return { success: true, path: luaPath }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

ipcMain.handle('motions:load', async (_event, projectPath: string) => {
    try {
        const motionsDir = path.join(projectPath, 'tao', 'motions')
        if (!fs.existsSync(motionsDir)) {
            return { success: true, characters: {} }
        }

        const files = fs.readdirSync(motionsDir).filter(f => f.endsWith('.json'))
        const characters: Record<string, object> = {}

        for (const file of files) {
            const content = fs.readFileSync(path.join(motionsDir, file), 'utf-8')
            const characterId = file.replace('.json', '')
            characters[characterId] = JSON.parse(content)
        }

        return { success: true, characters }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})

// Open file dialog for images
ipcMain.handle('dialog:openImage', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }
        ]
    })
    return result.canceled ? null : result.filePaths[0]
})

// Read image as base64 for display
ipcMain.handle('fs:readImage', async (_event, imagePath: string) => {
    try {
        const data = fs.readFileSync(imagePath)
        const ext = path.extname(imagePath).slice(1)
        const base64 = data.toString('base64')
        return { success: true, dataUrl: `data:image/${ext};base64,${base64}` }
    } catch (error) {
        return { success: false, error: String(error) }
    }
})
