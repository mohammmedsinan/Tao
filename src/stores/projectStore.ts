import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TaoProjectConfig {
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

interface ProjectState {
    // Project Info
    projectPath: string | null
    projectConfig: TaoProjectConfig | null

    // Recent Projects
    recentProjects: { path: string; name: string; lastOpened: string }[]

    // Actions
    setProject: (path: string, config: TaoProjectConfig) => void
    clearProject: () => void
    addRecentProject: (path: string, name: string) => void
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projectPath: null,
            projectConfig: null,
            recentProjects: [],

            setProject: (path, config) => {
                set({ projectPath: path, projectConfig: config })
                // Also add to recent projects
                get().addRecentProject(path, config.projectName)
            },

            clearProject: () => {
                set({ projectPath: null, projectConfig: null })
            },

            addRecentProject: (path, name) => {
                const recent = get().recentProjects.filter((p) => p.path !== path)
                recent.unshift({
                    path,
                    name,
                    lastOpened: new Date().toISOString(),
                })
                // Keep only last 5 recent projects
                set({ recentProjects: recent.slice(0, 5) })
            },
        }),
        {
            name: 'tao-project-storage',
            partialize: (state) => ({ recentProjects: state.recentProjects }),
        }
    )
)
