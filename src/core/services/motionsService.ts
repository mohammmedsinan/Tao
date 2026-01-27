/**
 * Motions Service
 * Handles all animation/motions module IPC operations
 */

import type { ServiceResult, MotionsModuleData } from '../types'

const isElectron = () => typeof window !== 'undefined' && !!window.electronAPI

export const motionsService = {
    /**
     * Save animation data to JSON
     */
    async save(projectPath: string, characterId: string, animData: MotionsModuleData): Promise<ServiceResult> {
        if (!isElectron()) {
            console.log('[motionsService] Browser mode: save simulated', { characterId })
            return { success: true, path: `${projectPath}/tao/motions/${characterId}.json` }
        }
        return window.electronAPI.motionsSave(projectPath, characterId, animData)
    },

    /**
     * Export animation data to Lua
     */
    async exportLua(projectPath: string, characterId: string, luaContent: string): Promise<ServiceResult> {
        if (!isElectron()) {
            console.log('[motionsService] Browser mode: exportLua simulated', { characterId })
            return { success: true, path: `${projectPath}/src/generated/motions/${characterId}.lua` }
        }
        return window.electronAPI.motionsExportLua(projectPath, characterId, luaContent)
    },

    /**
     * Load all animation data from a project
     */
    async load(projectPath: string): Promise<ServiceResult<Record<string, object>>> {
        if (!isElectron()) {
            console.log('[motionsService] Browser mode: load returning empty')
            return { success: true, data: {} }
        }
        const result = await window.electronAPI.motionsLoad(projectPath)
        return {
            success: result.success,
            data: result.characters,
            error: result.error
        }
    }
}
