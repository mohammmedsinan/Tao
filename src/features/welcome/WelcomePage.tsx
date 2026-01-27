/**
 * Welcome Feature - Main Page Component
 * Thin orchestrator that composes feature components
 */

import { useState, useCallback } from 'react'

import { useWelcome } from './hooks'
import {
    BootSequence,
    Logo,
    ActionCards,
    RecentProjects,
    InitializeForm,
    OpenProject,
} from './components'

export default function WelcomePage() {
    const [booting, setBooting] = useState(true)

    const {
        mode,
        setMode,
        projectName,
        setProjectName,
        error,
        loading,
        isElectron,
        recentProjects,
        handleOpenFolder,
        handleRecentProject,
        goBack,
    } = useWelcome()

    const handleBootComplete = useCallback(() => {
        setBooting(false)
    }, [])

    // Boot sequence view
    if (booting) {
        return <BootSequence onComplete={handleBootComplete} isElectron={isElectron} />
    }

    return (
        <div className="min-h-screen bg-void flex items-center justify-center bg-grid-pattern">
            <div className="w-full max-w-2xl p-8">
                {/* Logo */}
                <Logo />

                {/* Main Content */}
                {mode === 'welcome' && (
                    <div className="space-y-6">
                        <ActionCards
                            onInitialize={() => setMode('initialize')}
                            onOpen={() => setMode('open')}
                        />
                        <RecentProjects
                            projects={recentProjects}
                            onSelect={handleRecentProject}
                        />
                    </div>
                )}

                {mode === 'initialize' && (
                    <InitializeForm
                        projectName={projectName}
                        onProjectNameChange={setProjectName}
                        onSelectFolder={handleOpenFolder}
                        onBack={goBack}
                        error={error}
                        loading={loading}
                        isElectron={isElectron}
                    />
                )}

                {mode === 'open' && (
                    <OpenProject
                        onSelectFolder={handleOpenFolder}
                        onBack={goBack}
                        error={error}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    )
}
