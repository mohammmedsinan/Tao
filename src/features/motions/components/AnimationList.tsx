/**
 * Motions Feature - Animation List Component
 * Sidebar list of animations
 */

import type { Animation } from '@/core/types'
import { Button } from '@/shared/components'

interface AnimationListProps {
    animations: Animation[]
    activeAnimationName: string | null
    onSelectAnimation: (name: string) => void
    onCreateAnimation: () => void
    onLoadSpriteSheet: () => void
}

export default function AnimationList({
    animations,
    activeAnimationName,
    onSelectAnimation,
    onCreateAnimation,
    onLoadSpriteSheet,
}: AnimationListProps) {
    return (
        <div className="w-64 bg-grid border-r border-neon-magenta/20 flex flex-col">
            <div className="p-4 border-b border-neon-magenta/20 space-y-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={onLoadSpriteSheet}>
                    LOAD SPRITE SHEET
                </Button>
                <Button variant="magenta" size="sm" className="w-full" onClick={onCreateAnimation}>
                    + NEW ANIMATION
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-2">
                {animations.length === 0 ? (
                    <div className="text-center text-holo/30 text-xs py-8">
                        No animations yet
                    </div>
                ) : (
                    <div className="space-y-1">
                        {animations.map((anim) => (
                            <button
                                key={anim.name}
                                onClick={() => onSelectAnimation(anim.name)}
                                className={`
                  w-full text-left px-3 py-2 text-sm transition-all
                  ${activeAnimationName === anim.name
                                        ? 'bg-neon-magenta/10 text-neon-magenta border-l-2 border-neon-magenta'
                                        : 'text-holo/70 hover:text-holo hover:bg-neon-magenta/5'
                                    }
                `}
                            >
                                <div>{anim.name}</div>
                                <div className="text-[10px] text-holo/40">
                                    {anim.frames.length} frames • {anim.fps} FPS
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
