import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Panel from '@/components/ui/Panel'

type Mode = 'welcome' | 'initialize' | 'open'

interface BootLine {
    text: string
    status: 'ok' | 'loading' | 'waiting'
}

export default function Welcome() {
    const navigate = useNavigate()
    const { setProject, recentProjects } = useProjectStore()

    const [mode, setMode] = useState<Mode>('welcome')
    const [booting, setBooting] = useState(true)
    const [bootLines, setBootLines] = useState<BootLine[]>([])
    const [projectName, setProjectName] = useState('')
    const [projectPath, setProjectPath] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Check if running in Electron
    const isElectron = !!window.electronAPI

    // Boot sequence animation
    useEffect(() => {
        const lines = [
            '> INITIALIZING TAO_CORE...',
            '> MOUNTING SPRITE_ENGINE...',
            '> LOADING DIALOGUE_PARSER...',
            '> ESTABLISHING LUA_BRIDGE...',
            isElectron ? '> SYSTEM READY.' : '> BROWSER DEV MODE.',
        ]

        let index = 0
        const interval = setInterval(() => {
            if (index < lines.length) {
                setBootLines((prev) => [
                    ...prev,
                    { text: lines[index], status: index < lines.length - 1 ? 'ok' : 'waiting' },
                ])
                index++
            } else {
                clearInterval(interval)
                setTimeout(() => setBooting(false), 500)
            }
        }, 300)

        return () => clearInterval(interval)
    }, [isElectron])

    // Browser mode: bypass Electron and go straight to dashboard
    const handleBrowserModeStart = () => {
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

        setProject(projectPath || '/dev/browser-mode', mockConfig)
        navigate('/dashboard')
    }

    const handleOpenFolder = async () => {
        // Browser fallback mode
        if (!isElectron) {
            handleBrowserModeStart()
            return
        }

        setLoading(true)
        setError(null)

        try {
            const folderPath = await window.electronAPI.openFolder()
            if (!folderPath) {
                setLoading(false)
                return
            }

            if (mode === 'open') {
                // Validate existing project
                const result = await window.electronAPI.validateProject(folderPath)
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

                const result = await window.electronAPI.initializeProject(folderPath, projectName)
                if (result.success && result.config) {
                    setProject(folderPath, result.config)
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
    }

    const handleRecentProject = async (path: string) => {
        if (!window.electronAPI) return

        setLoading(true)
        const result = await window.electronAPI.validateProject(path)
        if (result.valid && result.config) {
            setProject(path, result.config)
            navigate('/dashboard')
        } else {
            setError('SYSTEM GLITCH: Project no longer valid at this location.')
        }
        setLoading(false)
    }

    // Boot sequence view
    if (booting) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center bg-grid-pattern">
                <div className="w-full max-w-xl p-8">
                    <div className="font-code text-neon-cyan text-sm space-y-1">
                        {bootLines.map((line, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="boot-line">{line.text}</span>
                                {line.status === 'ok' && (
                                    <span className="text-neon-yellow">[OK]</span>
                                )}
                                {line.status === 'loading' && (
                                    <span className="boot-cursor" />
                                )}
                            </div>
                        ))}
                        {bootLines.length < 5 && <span className="boot-cursor" />}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-void flex items-center justify-center bg-grid-pattern">
            <div className="w-full max-w-2xl p-8">
                {/* Logo */}
                <div className="text-center mb-12">
                    <h1
                        className="font-display text-6xl text-neon-cyan glow-cyan tracking-widest text-glitch"
                        data-text="TAO"
                    >
                        TAO
                    </h1>
                    <p className="text-holo/50 mt-4 font-code tracking-wider">
                        INSERT COIN TO CREATE • THE NEON FORGE FOR LOVE2D
                    </p>
                </div>

                {/* Main Content */}
                {mode === 'welcome' && (
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-6">
                            <Panel
                                variant="cyan"
                                glow
                                className="cursor-pointer hover:bg-neon-cyan/5 transition-colors"
                                onClick={() => setMode('initialize')}
                            >
                                <div className="text-center py-6">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <h3 className="font-display text-neon-cyan text-sm mb-2">
                                        INITIALIZE TAO
                                    </h3>
                                    <p className="text-xs text-holo/50 font-code">
                                        Create a new Love2D project with Tao integration
                                    </p>
                                </div>
                            </Panel>

                            <Panel
                                variant="magenta"
                                glow
                                className="cursor-pointer hover:bg-neon-magenta/5 transition-colors"
                                onClick={() => setMode('open')}
                            >
                                <div className="text-center py-6">
                                    <div className="text-4xl mb-4">📂</div>
                                    <h3 className="font-display text-neon-magenta text-sm mb-2">
                                        OPEN EXISTING
                                    </h3>
                                    <p className="text-xs text-holo/50 font-code">
                                        Open a folder with an existing Tao project
                                    </p>
                                </div>
                            </Panel>
                        </div>

                        {/* Recent Projects */}
                        {recentProjects.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                                    RECENT MISSIONS
                                </h4>
                                <div className="space-y-2">
                                    {recentProjects.map((project) => (
                                        <button
                                            key={project.path}
                                            onClick={() => handleRecentProject(project.path)}
                                            className="w-full text-left p-3 border border-neon-cyan/20 hover:border-neon-cyan/50 
                                 hover:bg-neon-cyan/5 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-holo group-hover:text-neon-cyan transition-colors">
                                                        {project.name}
                                                    </span>
                                                    <p className="text-xs text-holo/30 font-code mt-1 truncate max-w-md">
                                                        {project.path}
                                                    </p>
                                                </div>
                                                <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                                                    →
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Initialize Mode */}
                {mode === 'initialize' && (
                    <Panel variant="cyan" className="max-w-md mx-auto">
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="font-display text-neon-cyan text-lg mb-2">
                                    INITIALIZE NEW PROJECT
                                </h3>
                                <p className="text-xs text-holo/50">
                                    {isElectron
                                        ? 'Enter a project name and select a folder'
                                        : 'Browser dev mode - enter project details'
                                    }
                                </p>
                            </div>

                            {!isElectron && (
                                <div className="p-3 border border-neon-yellow bg-neon-yellow/10 text-neon-yellow text-xs font-code">
                                    ⚠️ BROWSER MODE: File system limited. For full features, run the Electron app.
                                </div>
                            )}

                            <Input
                                label="Project Name"
                                placeholder="my_awesome_game"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                autoFocus
                            />

                            {!isElectron && (
                                <Input
                                    label="Project Path (optional)"
                                    placeholder="/path/to/project"
                                    value={projectPath}
                                    onChange={(e) => setProjectPath(e.target.value)}
                                />
                            )}

                            {error && (
                                <div className="p-3 border border-neon-magenta bg-neon-magenta/10 text-neon-magenta text-xs font-code">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => {
                                        setMode('welcome')
                                        setError(null)
                                    }}
                                >
                                    ABORT
                                </Button>
                                <Button
                                    variant="cyan"
                                    className="flex-1"
                                    onClick={handleOpenFolder}
                                    disabled={loading || !projectName.trim()}
                                >
                                    {loading ? 'INITIALIZING...' : isElectron ? 'SELECT FOLDER' : 'START DEV MODE'}
                                </Button>
                            </div>
                        </div>
                    </Panel>
                )}

                {/* Open Mode */}
                {mode === 'open' && (
                    <Panel variant="magenta" className="max-w-md mx-auto">
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="font-display text-neon-magenta text-lg mb-2">
                                    OPEN EXISTING PROJECT
                                </h3>
                                <p className="text-xs text-holo/50">
                                    {isElectron
                                        ? 'Select a folder containing a Tao project'
                                        : 'Browser dev mode - enter project details'
                                    }
                                </p>
                            </div>

                            {!isElectron && (
                                <>
                                    <div className="p-3 border border-neon-yellow bg-neon-yellow/10 text-neon-yellow text-xs font-code">
                                        ⚠️ BROWSER MODE: File system limited. For full features, run the Electron app.
                                    </div>
                                    <Input
                                        label="Project Name"
                                        placeholder="my_existing_game"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                    <Input
                                        label="Project Path (optional)"
                                        placeholder="/path/to/project"
                                        value={projectPath}
                                        onChange={(e) => setProjectPath(e.target.value)}
                                    />
                                </>
                            )}

                            {error && (
                                <div className="p-3 border border-neon-magenta bg-neon-magenta/10 text-neon-magenta text-xs font-code">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => {
                                        setMode('welcome')
                                        setError(null)
                                    }}
                                >
                                    ABORT
                                </Button>
                                <Button
                                    variant="magenta"
                                    className="flex-1"
                                    onClick={handleOpenFolder}
                                    disabled={loading || (!isElectron && !projectName.trim())}
                                >
                                    {loading ? 'SCANNING...' : isElectron ? 'BROWSE' : 'START DEV MODE'}
                                </Button>
                            </div>
                        </div>
                    </Panel>
                )}

                {/* Footer */}
                <div className="text-center mt-12 text-holo/30 text-xs font-code">
                    TAO ENGINE v1.0.0 • FOR LOVE2D DEVELOPERS
                </div>
            </div>
        </div>
    )
}
