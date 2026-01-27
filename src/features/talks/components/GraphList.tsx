/**
 * Talks Feature - Graph List Component
 * Displays list of dialogue graphs in sidebar
 */

import type { DialogueGraph } from '@/core/types'
import { Button } from '@/shared/components'

interface GraphListProps {
    graphs: DialogueGraph[]
    activeGraphId: string | null
    onSelectGraph: (id: string) => void
    onCreateGraph: () => void
}

export default function GraphList({
    graphs,
    activeGraphId,
    onSelectGraph,
    onCreateGraph
}: GraphListProps) {
    return (
        <div className="w-64 bg-grid border-r border-neon-cyan/20 flex flex-col">
            <div className="p-4 border-b border-neon-cyan/20">
                <Button variant="cyan" size="sm" className="w-full" onClick={onCreateGraph}>
                    + NEW GRAPH
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {graphs.length === 0 ? (
                    <div className="text-holo/30 text-xs text-center py-4 font-code">
                        NO GRAPHS DETECTED
                    </div>
                ) : (
                    graphs.map((graph) => (
                        <button
                            key={graph.id}
                            onClick={() => onSelectGraph(graph.id)}
                            className={`
                w-full text-left px-3 py-2 text-sm font-code transition-all
                ${activeGraphId === graph.id
                                    ? 'bg-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan'
                                    : 'text-holo/70 hover:bg-neon-cyan/10 hover:text-holo'
                                }
              `}
                        >
                            {graph.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}
