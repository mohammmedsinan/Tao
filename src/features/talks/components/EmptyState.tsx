/**
 * Talks Feature - Empty State Component
 */

import { Button } from '@/shared/components'

interface EmptyStateProps {
    onCreateGraph: () => void
}

export default function EmptyState({ onCreateGraph }: EmptyStateProps) {
    return (
        <div className="flex-1 flex items-center justify-center bg-grid">
            <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="font-display text-neon-cyan text-xl mb-2">
                    NO GRAPH SELECTED
                </h3>
                <p className="text-holo/50 text-sm mb-4">
                    Create or select a dialogue graph to begin
                </p>
                <Button variant="cyan" onClick={onCreateGraph}>
                    CREATE FIRST GRAPH
                </Button>
            </div>
        </div>
    )
}
