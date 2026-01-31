const { contextBridge, ipcRenderer } =  require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Dialog operations
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
    openImage: () => ipcRenderer.invoke('dialog:openImage'),

    // Project operations
    validateProject: (path: string) => ipcRenderer.invoke('project:validate', path),
    initializeProject: (path: string, name: string) => ipcRenderer.invoke('project:initialize', path, name),

    // File system operations
    readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    writeFile: (path: string, content: string) => ipcRenderer.invoke('fs:writeFile', path, content),
    listDir: (path: string) => ipcRenderer.invoke('fs:listDir', path),
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path),
    readImage: (path: string) => ipcRenderer.invoke('fs:readImage', path),

    // Talks module operations
    talksSave: (projectPath: string, graphId: string, graphData: object) =>
        ipcRenderer.invoke('talks:save', projectPath, graphId, graphData),
    talksExportLua: (projectPath: string, graphId: string, luaContent: string) =>
        ipcRenderer.invoke('talks:exportLua', projectPath, graphId, luaContent),
    talksLoad: (projectPath: string) =>
        ipcRenderer.invoke('talks:load', projectPath),

    // Motions module operations
    motionsSave: (projectPath: string, characterId: string, animData: object) =>
        ipcRenderer.invoke('motions:save', projectPath, characterId, animData),
    motionsExportLua: (projectPath: string, characterId: string, luaContent: string) =>
        ipcRenderer.invoke('motions:exportLua', projectPath, characterId, luaContent),
    motionsLoad: (projectPath: string) =>
        ipcRenderer.invoke('motions:load', projectPath),

    // App events
    onMessage: (callback: (message: string) => void) => {
        ipcRenderer.on('main-process-message', (_event:any, message:string) => callback(message))
    }
})

// Type definitions for the exposed API
export interface ElectronAPI {
    openFolder: () => Promise<string | null>
    openImage: () => Promise<string | null>
    validateProject: (path: string) => Promise<{ valid: boolean; config: TaoProjectConfig | null }>
    initializeProject: (path: string, name: string) => Promise<{ success: boolean; config?: TaoProjectConfig; error?: string }>
    readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>
    writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>
    listDir: (path: string) => Promise<{ success: boolean; entries?: DirEntry[]; error?: string }>
    exists: (path: string) => Promise<boolean>
    readImage: (path: string) => Promise<{ success: boolean; dataUrl?: string; error?: string }>

    // Talks
    talksSave: (projectPath: string, graphId: string, graphData: object) => Promise<{ success: boolean; path?: string; error?: string }>
    talksExportLua: (projectPath: string, graphId: string, luaContent: string) => Promise<{ success: boolean; path?: string; error?: string }>
    talksLoad: (projectPath: string) => Promise<{ success: boolean; graphs?: Record<string, object>; error?: string }>

    // Motions
    motionsSave: (projectPath: string, characterId: string, animData: object) => Promise<{ success: boolean; path?: string; error?: string }>
    motionsExportLua: (projectPath: string, characterId: string, luaContent: string) => Promise<{ success: boolean; path?: string; error?: string }>
    motionsLoad: (projectPath: string) => Promise<{ success: boolean; characters?: Record<string, object>; error?: string }>

    onMessage: (callback: (message: string) => void) => void
}

export interface TaoProjectConfig {
    version: string
    projectName: string
    created: string
    paths: {
        assets: string
        output: string
        localization: string
    }
    modules: {
        talks: {
            defaultLanguage: string
            supportedLanguages: string[]
        }
        motions: {
            useAseprite: boolean
        }
    }
}

export interface DirEntry {
    name: string
    isDirectory: boolean
    path: string
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
