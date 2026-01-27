/**
 * Motions Feature - useMotionsSave Hook
 * Handles saving and exporting animation data
 */

import { useCallback } from 'react'
import { useToast } from '@/core/hooks'
import { motionsService } from '@/core/services'
import { toLuaValue } from '@/core/utils'
import type { MotionsModuleData } from '@/core/types'

interface UseMotionsSaveOptions {
    projectPath: string | null
    characterId: string
    data: MotionsModuleData | null
    onSaveComplete?: () => void
}

export function useMotionsSave({ projectPath, characterId, data, onSaveComplete }: UseMotionsSaveOptions) {
    const { toast, showSuccess, showError } = useToast()

    const generateMotionsLua = useCallback((charId: string, motionData: MotionsModuleData): string => {
        const timestamp = new Date().toISOString()

        let lua = `--[[\n`
        lua += `    TAO MOTIONS - Generated Animation Data\n`
        lua += `    Character: ${charId}\n`
        lua += `    Timestamp: ${timestamp}\n`
        lua += `]]\n\n`

        lua += `local animations = {}\n\n`
        lua += `animations.sheet = "${motionData.sourceImage}"\n`
        lua += `animations.grid = { w = ${motionData.grid.w}, h = ${motionData.grid.h} }\n\n`

        lua += `animations.clips = ${toLuaValue(motionData.animations, 0)}\n\n`

        lua += `return animations\n`

        return lua
    }, [])

    const saveAndExport = useCallback(async (): Promise<boolean> => {
        if (!data || !projectPath) {
            showError('No project loaded')
            return false
        }

        if (Object.keys(data.animations).length === 0) {
            showError('No animations to save')
            return false
        }

        try {
            // Save JSON
            await motionsService.save(projectPath, characterId, data)

            // Generate and save Lua
            const luaContent = generateMotionsLua(characterId, data)
            await motionsService.exportLua(projectPath, characterId, luaContent)

            showSuccess('MEMORY WRITTEN SUCCESSFULLY')
            onSaveComplete?.()
            return true
        } catch (error) {
            showError(`WRITE FAILED: ${String(error)}`)
            return false
        }
    }, [data, projectPath, characterId, generateMotionsLua, showSuccess, showError, onSaveComplete])

    return {
        toast,
        saveAndExport,
    }
}
