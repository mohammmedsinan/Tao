/**
 * Talks Feature - Custom Node Components
 * Event Node Component
 */

import type { NodeEvent } from '@/core/types'

interface EventNodeProps {
    data: NodeEvent & { label: string }
    selected: boolean
}

export default function EventNode({ data, selected }: EventNodeProps) {
    return (
        <div
            className={`
        min-w-[150px] p-3 bg-grid border-2 
        ${selected ? 'border-neon-cyan shadow-neon-cyan-sm' : 'border-neon-cyan/50'}
      `}
        >
            <div className="text-xs text-white bg-neon-magenta/50 px-2 py-0.5 inline-block mb-2">
                EVENT
            </div>
            <div className="text-holo text-sm font-code">{data.eventName}</div>
        </div>
    )
}
