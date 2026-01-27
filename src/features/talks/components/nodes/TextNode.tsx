/**
 * Talks Feature - Custom Node Components
 * Text Node Component
 */

import type { NodeText } from '@/core/types'

interface TextNodeProps {
    data: NodeText & { label: string }
    selected: boolean
}

export default function TextNode({ data, selected }: TextNodeProps) {
    return (
        <div
            className={`
        min-w-[200px] p-3 bg-grid border-2 
        ${selected ? 'border-neon-cyan shadow-neon-cyan-sm' : 'border-neon-cyan/50'}
      `}
        >
            <div className="text-xs text-neon-cyan font-display mb-2">TEXT</div>
            <div className="text-holo text-sm font-code">{data.speakerId}</div>
            <div className="text-holo/70 text-xs mt-1">{data.locKey}</div>
        </div>
    )
}
