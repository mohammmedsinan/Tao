/**
 * Talks Feature - useTalksSave Hook
 * Handles saving and exporting dialogue graphs
 */

import { useCallback } from 'react'
import { useToast } from '@/core/hooks'
import { talksService } from '@/core/services'
import { toLuaValue } from '@/core/utils'
import type { TalksModuleData, DialogueGraph } from '@/core/types'

interface UseTalksSaveOptions {
    projectPath: string | null
    data: TalksModuleData | null
    onSaveComplete?: () => void
}

export function useTalksSave({ projectPath, data, onSaveComplete }: UseTalksSaveOptions) {
    const { toast, showSuccess, showError } = useToast()

    const generateDialogueLua = useCallback((graphId: string, graph: DialogueGraph): string => {
        const timestamp = new Date().toISOString()

        let lua = `--[[\n`
        lua += `    TAO TALKS - Generated Dialogue\n`
        lua += `    Graph: ${graph.name}\n`
        lua += `    Timestamp: ${timestamp}\n`
        lua += `]]\n\n`

        lua += `local dialogue = {}\n\n`
        lua += `dialogue.id = "${graphId}"\n`
        lua += `dialogue.name = "${graph.name}"\n`
        lua += `dialogue.start = "${graph.rootNodeId}"\n\n`

        lua += `dialogue.nodes = ${toLuaValue(graph.nodes, 0)}\n\n`

        lua += `return dialogue\n`

        return lua
    }, [])

    const saveAndExport = useCallback(async (): Promise<boolean> => {
        if (!data || !projectPath) {
            showError('No project loaded')
            return false
        }

        if (Object.keys(data.graphs).length === 0) {
            showError('No graphs to save')
            return false
        }

        try {
            for (const [graphId, graph] of Object.entries(data.graphs)) {
                // Save JSON
                await talksService.save(projectPath, graphId, graph)

                // Generate and save Lua
                const luaContent = generateDialogueLua(graphId, graph)
                await talksService.exportLua(projectPath, graphId, luaContent)
            }

            showSuccess('MEMORY WRITTEN SUCCESSFULLY')
            onSaveComplete?.()
            return true
        } catch (error) {
            showError(`WRITE FAILED: ${String(error)}`)
            return false
        }
    }, [data, projectPath, generateDialogueLua, showSuccess, showError, onSaveComplete])

    return {
        toast,
        saveAndExport,
    }
}
