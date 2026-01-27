/**
 * Welcome Feature - Open Project Component
 */

import { Panel, Button } from '@/shared/components'

interface OpenProjectProps {
    onSelectFolder: () => void
    onBack: () => void
    error: string | null
    loading: boolean
}

export default function OpenProject({
    onSelectFolder,
    onBack,
    error,
    loading,
}: OpenProjectProps) {
    return (
        <Panel className="max-w-md mx-auto">
            <h3 className="font-display text-neon-magenta text-lg mb-6 text-center">
                OPEN EXISTING PROJECT
            </h3>

            <p className="text-sm text-holo/60 mb-6 text-center">
                Select a folder containing a <code className="text-neon-cyan">tao_config.json</code> file
            </p>

            {error && (
                <div className="text-neon-magenta text-xs font-code p-2 border border-neon-magenta/30 bg-neon-magenta/5 mb-4">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={onBack} disabled={loading}>
                    BACK
                </Button>
                <Button
                    variant="magenta"
                    className="flex-1"
                    onClick={onSelectFolder}
                    disabled={loading}
                >
                    {loading ? 'LOADING...' : 'SELECT FOLDER'}
                </Button>
            </div>
        </Panel>
    )
}
