/**
 * Talks Service
 * Handles all dialogue/talks module IPC operations
 */

import type { ServiceResult, DialogueGraph } from '../types'

const isElectron = () => typeof window !== 'undefined' && !!window.electronAPI

export const talksService = {
    /**
     * Save a dialogue graph to JSON
     */
    async save(projectPath: string, graphId: string, graphData: DialogueGraph): Promise<ServiceResult> {
        if (!isElectron()) {
            console.log('[talksService] Browser mode: save simulated', { graphId })
            return { success: true, path: `${projectPath}/tao/talks/${graphId}.json` }
        }
        return window.electronAPI.talksSave(projectPath, graphId, graphData)
    },

    /**
     * Export a dialogue graph to Lua
     */
    async exportLua(projectPath: string, graphId: string, luaContent: string): Promise<ServiceResult> {
        if (!isElectron()) {
            console.log('[talksService] Browser mode: exportLua simulated', { graphId })
            return { success: true, path: `${projectPath}/src/generated/talks/${graphId}.lua` }
        }
        return window.electronAPI.talksExportLua(projectPath, graphId, luaContent)
    },

    /**
     * Load all dialogue graphs from a project
     */
    async load(projectPath: string): Promise<ServiceResult<Record<string, object>>> {
        if (!isElectron()) {
            console.log('[talksService] Browser mode: load returning empty')
            return { success: true, data: {} }
        }
        const result = await window.electronAPI.talksLoad(projectPath)
        return {
            success: result.success,
            data: result.graphs,
            error: result.error
        }
    }
}
