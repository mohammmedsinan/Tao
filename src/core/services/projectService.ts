/**
 * Project Service
 * Handles project-level IPC operations
 */

import type { ServiceResult, TaoProjectConfig } from '../types'

const isElectron = () => typeof window !== 'undefined' && !!window.electronAPI

export const projectService = {
    /**
     * Validate if a folder contains a valid Tao project
     */
    async validate(projectPath: string): Promise<{ valid: boolean; config: TaoProjectConfig | null }> {
        if (!isElectron()) {
            console.log('[projectService] Browser mode: validate returning false')
            return { valid: false, config: null }
        }
        return window.electronAPI.validateProject(projectPath)
    },

    /**
     * Initialize a new Tao project
     */
    async initialize(projectPath: string, projectName: string): Promise<ServiceResult<TaoProjectConfig>> {
        if (!isElectron()) {
            // Create mock config for browser mode
            const mockConfig: TaoProjectConfig = {
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
            return { success: true, data: mockConfig }
        }

        const result = await window.electronAPI.initializeProject(projectPath, projectName)
        return {
            success: result.success,
            data: result.config,
            error: result.error
        }
    },

    /**
     * Check if running in Electron
     */
    isElectron
}
