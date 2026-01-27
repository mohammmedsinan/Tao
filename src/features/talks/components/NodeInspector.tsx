/**
 * Talks Feature - Node Inspector Component
 * Shows properties of selected node
 */

import type { DialogueNode } from '@/core/types'
import { Panel } from '@/shared/components'

interface NodeInspectorProps {
    node: DialogueNode | null
}

export default function NodeInspector({ node }: NodeInspectorProps) {
    if (!node) {
        return (
            <div className="w-72 bg-grid border-l border-neon-cyan/20 p-4">
                <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                    NODE PROPERTIES
                </h4>
                <div className="text-holo/30 text-xs font-code text-center py-8">
                    SELECT A NODE
                </div>
            </div>
        )
    }

    return (
        <div className="w-72 bg-grid border-l border-neon-cyan/20 p-4">
            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                NODE PROPERTIES
            </h4>
            <Panel>
                <pre className="text-xs text-holo/70 font-code overflow-auto max-h-96">
                    {JSON.stringify(node, null, 2)}
                </pre>
            </Panel>
        </div>
    )
}
