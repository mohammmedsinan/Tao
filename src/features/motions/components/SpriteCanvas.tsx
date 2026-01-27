/**
 * Motions Feature - Sprite Canvas Component
 * Main sprite preview and hitbox editor canvas
 */

import type { RefObject } from 'react'
import { Button } from '@/shared/components'

interface SpriteCanvasProps {
    canvasRef: RefObject<HTMLCanvasElement>
    zoom: number
    onZoomIn: () => void
    onZoomOut: () => void
    isPlaying: boolean
    onTogglePlayback: () => void
    hasAnimation: boolean
}

export default function SpriteCanvas({
    canvasRef,
    zoom,
    onZoomIn,
    onZoomOut,
    isPlaying,
    onTogglePlayback,
    hasAnimation,
}: SpriteCanvasProps) {
    return (
        <div className="flex-1 bg-void flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b border-neon-magenta/20">
                <Button variant="ghost" size="sm" onClick={onZoomOut}>
                    −
                </Button>
                <span className="text-xs text-holo/50 font-code w-16 text-center">
                    {zoom}x
                </span>
                <Button variant="ghost" size="sm" onClick={onZoomIn}>
                    +
                </Button>
                <div className="w-px h-4 bg-neon-magenta/20 mx-2" />
                <Button
                    variant={isPlaying ? 'magenta' : 'ghost'}
                    size="sm"
                    onClick={onTogglePlayback}
                    disabled={!hasAnimation}
                >
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                </Button>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        className="border border-neon-magenta/30 shadow-lg"
                        style={{
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
