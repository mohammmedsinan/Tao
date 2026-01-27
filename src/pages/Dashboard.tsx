import { Link } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Panel from '@/components/ui/Panel'
import Button from '@/components/ui/Button'

export default function Dashboard() {
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
                    <div className="mb-8">
                        <h1 className="font-display text-2xl text-neon-cyan glow-cyan mb-2">
                            WELCOME, DEVELOPER
                        </h1>
                        <p className="text-holo/60 font-code">
                            Project: <span className="text-neon-yellow">{projectConfig?.projectName}</span>
                        </p>
                    </div>

                    {/* Module Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Tao Talks Card */}
                        <Link to="/talks" className="block group">
                            <Panel variant="cyan" className="h-full hover:border-neon-cyan transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">💬</div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg text-neon-cyan group-hover:glow-cyan transition-all">
                                            TAO TALKS
                                        </h3>
                                        <p className="text-sm text-holo/60 mt-2">
                                            Dialogue System & Narrative Engine
                                        </p>
                                        <ul className="text-xs text-holo/40 mt-4 space-y-1 font-code">
                                            <li>• Node-based dialogue editor</li>
                                            <li>• Localization support</li>
                                            <li>• Branching narratives</li>
                                            <li>• Event triggers</li>
                                        </ul>
                                        <div className="mt-4 text-neon-cyan text-xs font-display opacity-0 group-hover:opacity-100 transition-opacity">
                                            LAUNCH MODULE →
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Link>

                        {/* Tao Motions Card */}
                        <Link to="/motions" className="block group">
                            <Panel variant="magenta" className="h-full hover:border-neon-magenta transition-all border-neon-magenta/30">
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">🎬</div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg text-neon-magenta group-hover:glow-magenta transition-all">
                                            TAO MOTIONS
                                        </h3>
                                        <p className="text-sm text-holo/60 mt-2">
                                            Animation & Hitbox Editor
                                        </p>
                                        <ul className="text-xs text-holo/40 mt-4 space-y-1 font-code">
                                            <li>• Sprite sheet loader</li>
                                            <li>• Animation timeline</li>
                                            <li>• Hitbox/hurtbox editor</li>
                                            <li>• Box2D physics data</li>
                                        </ul>
                                        <div className="mt-4 text-neon-magenta text-xs font-display opacity-0 group-hover:opacity-100 transition-opacity">
                                            LAUNCH MODULE →
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Link>
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Project Details */}
                        <Panel className="col-span-2">
                            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                                PROJECT CONFIGURATION
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm font-code">
                                <div>
                                    <span className="text-holo/50">Version:</span>
                                    <span className="ml-2 text-neon-cyan">{projectConfig?.version}</span>
                                </div>
                                <div>
                                    <span className="text-holo/50">Created:</span>
                                    <span className="ml-2 text-holo">
                                        {projectConfig?.created ? new Date(projectConfig.created).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-holo/50">Default Language:</span>
                                    <span className="ml-2 text-neon-yellow">
                                        {projectConfig?.modules.talks.defaultLanguage.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-holo/50">Assets Path:</span>
                                    <span className="ml-2 text-holo">{projectConfig?.paths.assets}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-neon-cyan/20">
                                <span className="text-holo/50 text-xs">Location:</span>
                                <p className="text-xs text-holo/70 font-code mt-1 break-all">{projectPath}</p>
                            </div>
                        </Panel>

                        {/* Quick Stats */}
                        <Panel>
                            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                                SYSTEM STATUS
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-holo/70">Characters</span>
                                    <span className="font-display text-neon-cyan">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-holo/70">Dialogues</span>
                                    <span className="font-display text-neon-cyan">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-holo/70">Animations</span>
                                    <span className="font-display text-neon-magenta">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-holo/70">Locales</span>
                                    <span className="font-display text-neon-yellow">
                                        {projectConfig?.modules.talks.supportedLanguages.length || 0}
                                    </span>
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* Future Modules Teaser */}
                    <div className="mt-8">
                        <h4 className="font-display text-xs text-holo/30 mb-4 tracking-wider">
                            COMING SOON
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            {['TAO SOUNDS', 'TAO MAPS', 'TAO CONFIGS'].map((name) => (
                                <div
                                    key={name}
                                    className="p-4 border border-holo/10 bg-void/50 text-center opacity-50 cursor-not-allowed"
                                >
                                    <div className="text-2xl mb-2">🔒</div>
                                    <span className="font-display text-xs text-holo/30">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
