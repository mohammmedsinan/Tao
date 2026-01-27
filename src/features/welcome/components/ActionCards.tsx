/**
 * Welcome Feature - Action Cards Component
 * Initialize/Open project selection cards
 */

import { Panel } from '@/shared/components'

interface ActionCardsProps {
    onInitialize: () => void
    onOpen: () => void
}

export default function ActionCards({ onInitialize, onOpen }: ActionCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <Panel
                variant="cyan"
                glow
                className="cursor-pointer hover:bg-neon-cyan/5 transition-colors"
                onClick={onInitialize}
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
                onClick={onOpen}
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
    )
}
