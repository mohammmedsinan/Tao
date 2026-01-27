/**
 * File System Service
 * Abstracts file system operations with browser fallback
 */

import type { ServiceResult } from '../types'

const isElectron = () => typeof window !== 'undefined' && !!window.electronAPI

export const fileService = {
    /**
     * Read a file's contents
     */
    async readFile(path: string): Promise<ServiceResult<string>> {
        if (!isElectron()) {
            console.warn('[fileService] Browser mode: readFile not available')
            return { success: false, error: 'File system not available in browser' }
        }
        return window.electronAPI.readFile(path)
    },

    /**
     * Write content to a file
     */
    async writeFile(path: string, content: string): Promise<ServiceResult> {
        if (!isElectron()) {
            console.warn('[fileService] Browser mode: writeFile simulated', { path })
            return { success: true }
        }
        return window.electronAPI.writeFile(path, content)
    },

    /**
     * Check if a path exists
     */
    async exists(path: string): Promise<boolean> {
        if (!isElectron()) {
            return false
        }
        return window.electronAPI.exists(path)
    },

    /**
     * List directory contents
     */
    async listDir(path: string): Promise<ServiceResult<{ name: string; isDirectory: boolean; path: string }[]>> {
        if (!isElectron()) {
            return { success: false, error: 'File system not available in browser' }
        }
        const result = await window.electronAPI.listDir(path)
        return {
            success: result.success,
            data: result.entries,
            error: result.error
        }
    },

    /**
     * Read an image file as base64 data URL
     */
    async readImage(path: string): Promise<ServiceResult<string>> {
        if (!isElectron()) {
            return { success: false, error: 'File system not available in browser' }
        }
        const result = await window.electronAPI.readImage(path)
        return {
            success: result.success,
            data: result.dataUrl,
            error: result.error
        }
    }
}
