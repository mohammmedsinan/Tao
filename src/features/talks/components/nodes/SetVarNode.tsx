/**
 * Talks Feature - Custom Node Components
 * SetVar Node Component
 */

import type { NodeSetVar } from '@/core/types'

interface SetVarNodeProps {
    data: NodeSetVar & { label: string }
    selected: boolean
}

export default function SetVarNode({ data, selected }: SetVarNodeProps) {
    return (
        <div
            className={`
        min-w-[150px] p-3 bg-grid border-2 
        ${selected ? 'border-neon-magenta shadow-neon-magenta-sm' : 'border-neon-magenta/50'}
      `}
        >
            <div className="text-xs text-neon-magenta font-display mb-2">SET VAR</div>
            <div className="text-holo text-sm font-code">{data.variable}</div>
            <div className="text-holo/70 text-xs mt-1">= {String(data.value)}</div>
        </div>
    )
}
