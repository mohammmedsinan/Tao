/**
 * Motions Feature - Properties Panel Component
 * Animation and frame properties editor
 */

import type { Animation, AnimationFrame, BoxType } from '@/core/types'
import { Panel, Button } from '@/shared/components'

interface PropertiesPanelProps {
    animation: Animation | null
    frame: AnimationFrame | null
    selectedBoxType: BoxType | null
    onSelectBoxType: (type: BoxType | null) => void
    onAddBox: () => void
    onUpdateFps: (fps: number) => void
    onToggleLoop: () => void
}

export default function PropertiesPanel({
    animation,
    frame,
    selectedBoxType,
    onSelectBoxType,
    onAddBox,
    onUpdateFps,
    onToggleLoop,
}: PropertiesPanelProps) {
    if (!animation) {
        return (
            <div className="w-72 bg-grid border-l border-neon-magenta/20 p-4">
                <div className="text-holo/30 text-xs text-center py-8">
                    Select an animation
                </div>
            </div>
        )
    }

    const boxTypes: { type: BoxType; label: string; color: string }[] = [
        { type: 'body', label: 'BODY', color: 'cyan' },
        { type: 'hit', label: 'HIT', color: 'magenta' },
        { type: 'hurt', label: 'HURT', color: 'yellow' },
    ]

    return (
        <div className="w-72 bg-grid border-l border-neon-magenta/20 p-4 space-y-4 overflow-y-auto">
            {/* Animation Settings */}
            <Panel>
                <h4 className="font-display text-xs text-holo/50 mb-3 tracking-wider">
                    ANIMATION SETTINGS
                </h4>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-holo/50 block mb-1">FPS</label>
                        <input
                            type="number"
                            value={animation.fps}
                            onChange={(e) => onUpdateFps(parseInt(e.target.value) || 12)}
                            className="w-full bg-void border border-neon-magenta/30 px-2 py-1 text-sm text-holo font-code"
                            min={1}
                            max={60}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-holo/50">LOOP</span>
                        <button
                            onClick={onToggleLoop}
                            className={`
                px-3 py-1 text-xs font-display border transition-colors
                ${animation.loop
                                    ? 'border-neon-magenta text-neon-magenta'
                                    : 'border-holo/30 text-holo/50'
                                }
              `}
                        >
                            {animation.loop ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>
            </Panel>

            {/* Box Editor */}
            {frame && (
                <Panel>
                    <h4 className="font-display text-xs text-holo/50 mb-3 tracking-wider">
                        HITBOX EDITOR
                    </h4>
                    <div className="space-y-2">
                        {boxTypes.map(({ type, label, color }) => (
                            <button
                                key={type}
                                onClick={() => onSelectBoxType(selectedBoxType === type ? null : type)}
                                className={`
                  w-full px-3 py-2 text-xs font-display border transition-all text-left
                  ${selectedBoxType === type
                                        ? `border-neon-${color} text-neon-${color} bg-neon-${color}/10`
                                        : 'border-holo/30 text-holo/50 hover:border-neon-magenta/50'
                                    }
                `}
                            >
                                {label} BOX
                                {frame[`${type}Box` as keyof AnimationFrame] && (
                                    <span className="float-right">✓</span>
                                )}
                            </button>
                        ))}
                        {selectedBoxType && (
                            <Button
                                variant="magenta"
                                size="sm"
                                className="w-full mt-2"
                                onClick={onAddBox}
                            >
                                ADD {selectedBoxType.toUpperCase()} BOX
                            </Button>
                        )}
                    </div>
                </Panel>
            )}

            {/* Frame Info */}
            {frame && (
                <Panel>
                    <h4 className="font-display text-xs text-holo/50 mb-3 tracking-wider">
                        FRAME DATA
                    </h4>
                    <pre className="text-xs text-holo/70 font-code overflow-auto max-h-40">
                        {JSON.stringify(frame, null, 2)}
                    </pre>
                </Panel>
            )}
        </div>
    )
}
