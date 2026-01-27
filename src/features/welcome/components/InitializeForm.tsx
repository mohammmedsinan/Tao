/**
 * Welcome Feature - Initialize Form Component
 */

import { Panel, Button, Input } from '@/shared/components'

interface InitializeFormProps {
    projectName: string
    onProjectNameChange: (name: string) => void
    onSelectFolder: () => void
    onBack: () => void
    error: string | null
    loading: boolean
    isElectron: boolean
}

export default function InitializeForm({
    projectName,
    onProjectNameChange,
    onSelectFolder,
    onBack,
    error,
    loading,
    isElectron,
}: InitializeFormProps) {
    return (
        <Panel className="max-w-md mx-auto">
            <h3 className="font-display text-neon-cyan text-lg mb-6 text-center">
                INITIALIZE NEW PROJECT
            </h3>

            <div className="space-y-4">
                <Input
                    label="Project Name"
                    placeholder="my_awesome_game"
                    value={projectName}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    autoFocus
                />

                {error && (
                    <div className="text-neon-magenta text-xs font-code p-2 border border-neon-magenta/30 bg-neon-magenta/5">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" className="flex-1" onClick={onBack} disabled={loading}>
                        BACK
                    </Button>
                    <Button
                        variant="cyan"
                        className="flex-1"
                        onClick={onSelectFolder}
                        disabled={loading || !projectName.trim()}
                    >
                        {loading ? 'LOADING...' : isElectron ? 'SELECT FOLDER' : 'START DEV MODE'}
                    </Button>
                </div>
            </div>
        </Panel>
    )
}
