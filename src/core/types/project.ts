/**
 * Project-related type definitions
 */

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

export interface RecentProject {
    path: string
    name: string
    lastOpened: string
}

export interface ProjectState {
    projectPath: string | null
    projectConfig: TaoProjectConfig | null
    recentProjects: RecentProject[]
}
