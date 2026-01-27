/**
 * Welcome Feature - useWelcome Hook
 * Handles project initialization and opening
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import { projectService } from '@/core/services'

export type WelcomeMode = 'welcome' | 'initialize' | 'open'

export function useWelcome() {
    const navigate = useNavigate()
    const { setProject, recentProjects } = useProjectStore()

    const [mode, setMode] = useState<WelcomeMode>('welcome')
    const [projectName, setProjectName] = useState('')
    const [projectPath, setProjectPath] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const isElectron = !!window.electronAPI

    const handleBrowserModeStart = useCallback(() => {
        if (!projectName.trim()) {
            setError('PROJECT NAME REQUIRED')
            return
        }

        // Create a mock config for browser development
        const mockConfig = {
            version: '1.0.0',
            projectName: projectName,
            created: new Date().toISOString(),
            paths: {
                assets: 'assets',
                output: 'src/generated',
                localization: 'tao/localization',
            },
            modules: {
                talks: {
                    defaultLanguage: 'en',
                    supportedLanguages: ['en'],
                },
                motions: {
                    useAseprite: false,
                },
            },
        }

        setProject(projectPath || '/dev/browser-mode', mockConfig)
        navigate('/dashboard')
    }, [projectName, projectPath, setProject, navigate])

    const handleOpenFolder = useCallback(async () => {
        // Browser fallback mode
        if (!isElectron) {
            handleBrowserModeStart()
            return
        }

        setLoading(true)
        setError(null)

        try {
            const folderPath = await projectService.selectFolder()
            if (!folderPath) {
                setLoading(false)
                return
            }

            if (mode === 'open') {
                // Validate existing project
                const result = await projectService.validate(folderPath)
                if (result.valid && result.config) {
                    setProject(folderPath, result.config)
                    navigate('/dashboard')
                } else {
                    setError('SYSTEM GLITCH: Invalid Tao project. No tao_config.json found.')
                }
            } else if (mode === 'initialize') {
                // Initialize new project
                if (!projectName.trim()) {
                    setError('PROJECT NAME REQUIRED')
                    setLoading(false)
                    return
                }

                const result = await projectService.initialize(folderPath, projectName)
                if (result.success && result.data) {
                    setProject(folderPath, result.data)
                    navigate('/dashboard')
                } else {
                    setError(`SYSTEM GLITCH: ${result.error}`)
                }
            }
        } catch (err) {
            setError(`SYSTEM GLITCH: ${String(err)}`)
        } finally {
            setLoading(false)
        }
    }, [isElectron, mode, projectName, setProject, navigate, handleBrowserModeStart])

    const handleRecentProject = useCallback(async (path: string) => {
        if (!window.electronAPI) return

        setLoading(true)
        const result = await projectService.validate(path)
        if (result.valid && result.config) {
            setProject(path, result.config)
            navigate('/dashboard')
        } else {
            setError('SYSTEM GLITCH: Project no longer valid at this location.')
        }
        setLoading(false)
    }, [setProject, navigate])

    const goBack = useCallback(() => {
        setMode('welcome')
        setError(null)
    }, [])

    return {
        mode,
        setMode,
        projectName,
        setProjectName,
        projectPath,
        setProjectPath,
        error,
        loading,
        isElectron,
        recentProjects,
        handleOpenFolder,
        handleRecentProject,
        goBack,
    }
}
