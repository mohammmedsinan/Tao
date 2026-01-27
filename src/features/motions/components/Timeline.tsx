/**
 * Motions Feature - Timeline Component
 * Frame timeline for animation editing
 */

import type { AnimationFrame } from '@/core/types'
import { Button } from '@/shared/components'

interface TimelineProps {
    frames: AnimationFrame[]
    activeFrameIndex: number
    onSelectFrame: (index: number) => void
    onAddFrame: () => void
}

export default function Timeline({
    frames,
    activeFrameIndex,
    onSelectFrame,
    onAddFrame,
}: TimelineProps) {
    return (
        <div className="h-24 bg-grid border-t border-neon-magenta/20 flex items-center px-4 gap-2 overflow-x-auto">
            {frames.map((frame, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectFrame(idx)}
                    className={`
            w-12 h-12 flex-shrink-0 border-2 transition-all
            flex items-center justify-center text-xs font-code
            ${idx === activeFrameIndex
                            ? 'border-neon-magenta bg-neon-magenta/20 text-neon-magenta'
                            : 'border-holo/30 text-holo/50 hover:border-neon-magenta/50'
                        }
          `}
                >
                    {frame.index}
                </button>
            ))}
            <Button
                variant="ghost"
                size="sm"
                onClick={onAddFrame}
                className="flex-shrink-0"
            >
                + FRAME
            </Button>
        </div>
    )
}
