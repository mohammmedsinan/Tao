/**
 * Dashboard Feature - Main Page Component
 * Thin orchestrator that composes feature components
 */

import { useProjectStore } from '@/stores/projectStore'
import { Sidebar, Header } from '@/shared/layouts'
import { Button } from '@/shared/components'

import {
    WelcomeBanner,
    ModuleCard,
    ProjectConfigPanel,
    SystemStatusPanel,
    ComingSoon,
} from './components'

// Module configuration data
const MODULES = [
    {
        to: '/talks',
        icon: '💬',
        title: 'TAO TALKS',
        description: 'Dialogue System & Narrative Engine',
        features: [
            'Node-based dialogue editor',
            'Localization support',
            'Branching narratives',
            'Event triggers',
        ],
        variant: 'cyan' as const,
    },
    {
        to: '/motions',
        icon: '🎬',
        title: 'TAO MOTIONS',
        description: 'Animation & Hitbox Editor',
        features: [
            'Sprite sheet loader',
            'Animation timeline',
            'Hitbox/hurtbox editor',
            'Box2D physics data',
        ],
        variant: 'magenta' as const,
    },
]

export default function DashboardPage() {
    const { projectConfig, projectPath, clearProject } = useProjectStore()

    const handleCloseProject = () => {
        clearProject()
    }

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="DASHBOARD"
                    subtitle="Command Center"
                    actions={
                        <Button variant="ghost" size="sm" onClick={handleCloseProject}>
                            CLOSE PROJECT
                        </Button>
                    }
                />

                <main className="flex-1 overflow-auto p-6 bg-grid-pattern">
                    {/* Welcome Banner */}
                    <WelcomeBanner projectName={projectConfig?.projectName} />

                    {/* Module Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {MODULES.map((module) => (
                            <ModuleCard key={module.to} {...module} />
                        ))}
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ProjectConfigPanel config={projectConfig} projectPath={projectPath} />
                        <SystemStatusPanel config={projectConfig} />
                    </div>

                    {/* Future Modules Teaser */}
                    <ComingSoon />
                </main>
            </div>
        </div>
    )
}
