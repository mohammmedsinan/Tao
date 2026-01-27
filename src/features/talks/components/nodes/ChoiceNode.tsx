/**
 * Talks Feature - Custom Node Components
 * Choice Node Component
 */

import type { NodeChoice } from '@/core/types'

interface ChoiceNodeProps {
    data: NodeChoice & { label: string }
    selected: boolean
}

export default function ChoiceNode({ data, selected }: ChoiceNodeProps) {
    return (
        <div
            className={`
        min-w-[200px] p-3 bg-grid border-2 
        ${selected ? 'border-neon-yellow shadow-neon-yellow-sm' : 'border-neon-yellow/50'}
      `}
        >
            <div className="text-xs text-neon-yellow font-display mb-2">CHOICE</div>
            <div className="text-holo/70 text-xs">{data.textKey}</div>
            <div className="mt-2 space-y-1">
                {data.options.map((opt, i) => (
                    <div key={i} className="text-xs text-neon-yellow/70 pl-2 border-l border-neon-yellow/30">
                        {opt.labelKey}
                    </div>
                ))}
            </div>
        </div>
    )
}
