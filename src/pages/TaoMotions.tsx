import { useRef, useEffect, useState } from 'react'
import { useMotionsStore } from '@/stores/motionsStore'
import { useProjectStore } from '@/stores/projectStore'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Panel from '@/components/ui/Panel'
import Input from '@/components/ui/Input'
import { toLuaValue } from '@/utils/luaGenerator'

export default function TaoMotions() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [spriteImage, setSpriteImage] = useState<HTMLImageElement | null>(null)

    const {
        data,
        activeAnimationName,
        activeFrameIndex,
        selectedBoxType,
        isPlaying,
        zoom,
        isDirty,
        setData,
        setSpriteSheet,
        setActiveAnimation,
        setActiveFrame,
        setSelectedBoxType,
        togglePlayback,
        setZoom,
        createAnimation,
        addFrame,
        updateFrameBox,
        markClean,
    } = useMotionsStore()

    const { projectPath, projectConfig } = useProjectStore()
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const characterId = projectConfig?.projectName?.toLowerCase().replace(/\s+/g, '_') || 'character'

    // Modal states
    const [showAnimModal, setShowAnimModal] = useState(false)
    const [newAnimName, setNewAnimName] = useState('')
    const [showFrameModal, setShowFrameModal] = useState(false)
    const [newFrameIndex, setNewFrameIndex] = useState('0')

    // Initialize with empty data if needed
    useEffect(() => {
        if (!data) {
            setData({
                sourceImage: '',
                grid: { w: 32, h: 32, margin: 0, spacing: 0 },
                physicsDefaults: {
                    friction: 0.3,
                    restitution: 0,
                    categoryBits: 1,
                    maskBits: 65535,
                },
                animations: {},
            })
        }
    }, [data, setData])

    // Load sprite image
    useEffect(() => {
        if (data?.sourceImage) {
            const img = new Image()
            img.onload = () => setSpriteImage(img)
            img.src = data.sourceImage
        }
    }, [data?.sourceImage])

    // Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !data) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const { w, h } = data.grid
        const displayW = w * zoom
        const displayH = h * zoom

        canvas.width = displayW
        canvas.height = displayH

        ctx.imageSmoothingEnabled = false
        ctx.fillStyle = '#120E24'
        ctx.fillRect(0, 0, displayW, displayH)

        // Draw current frame
        if (spriteImage && activeAnimationName && data.animations[activeAnimationName]) {
            const anim = data.animations[activeAnimationName]
            const frame = anim.frames[activeFrameIndex]

            if (frame) {
                const cols = Math.floor(spriteImage.width / w)
                const sx = (frame.index % cols) * w
                const sy = Math.floor(frame.index / cols) * h

                ctx.drawImage(spriteImage, sx, sy, w, h, 0, 0, displayW, displayH)

                // Draw boxes
                const drawBox = (rect: { x: number; y: number; w: number; h: number }, color: string) => {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 2
                    ctx.setLineDash([4, 4])
                    ctx.strokeRect(
                        (rect.x + frame.origin.x) * zoom,
                        (rect.y + frame.origin.y) * zoom,
                        rect.w * zoom,
                        rect.h * zoom
                    )
                    ctx.setLineDash([])
                }

                if (frame.bodyBox) {
                    drawBox(frame.bodyBox.rect, '#00F0FF')
                }
                if (frame.hitBox) {
                    drawBox(frame.hitBox, '#FF00D4')
                }
                if (frame.hurtBox) {
                    drawBox(frame.hurtBox, '#FFE600')
                }

                // Draw origin marker
                ctx.fillStyle = '#FFFFFF'
                ctx.beginPath()
                ctx.arc(frame.origin.x * zoom, frame.origin.y * zoom, 4, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Draw grid overlay
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)'
        ctx.lineWidth = 1
        for (let x = 0; x <= displayW; x += zoom * 8) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, displayH)
            ctx.stroke()
        }
        for (let y = 0; y <= displayH; y += zoom * 8) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(displayW, y)
            ctx.stroke()
        }
    }, [data, spriteImage, activeAnimationName, activeFrameIndex, zoom])

    // Animation playback
    useEffect(() => {
        if (!isPlaying || !activeAnimationName || !data?.animations[activeAnimationName]) return

        const anim = data.animations[activeAnimationName]
        if (anim.frames.length === 0) return

        const interval = setInterval(() => {
            setActiveFrame((activeFrameIndex + 1) % anim.frames.length)
        }, 1000 / anim.fps)

        return () => clearInterval(interval)
    }, [isPlaying, activeAnimationName, activeFrameIndex, data, setActiveFrame])

    const handleLoadSpriteSheet = async () => {
        if (!window.electronAPI) return

        const path = await window.electronAPI.openFolder()
        if (path) {
            // For now, just set a placeholder - in real app would use file dialog for images
            const gridW = parseInt(prompt('Grid Width (px):') || '32')
            const gridH = parseInt(prompt('Grid Height (px):') || '32')
            setSpriteSheet(path, gridW, gridH)
        }
    }

    const handleCreateAnimation = () => {
        setShowAnimModal(true)
    }

    const confirmCreateAnimation = () => {
        if (newAnimName.trim()) {
            createAnimation(newAnimName.trim())
            setNewAnimName('')
            setShowAnimModal(false)
        }
    }

    const handleAddFrame = () => {
        setShowFrameModal(true)
    }

    const confirmAddFrame = () => {
        if (!activeAnimationName) return
        const idx = parseInt(newFrameIndex) || 0
        addFrame(activeAnimationName, idx)
        setNewFrameIndex('0')
        setShowFrameModal(false)
    }

    const handleAddBox = () => {
        if (!activeAnimationName || !selectedBoxType) return

        const rect = {
            x: -16,
            y: -32,
            w: 32,
            h: 32,
        }

        updateFrameBox(activeAnimationName, activeFrameIndex, selectedBoxType, rect)
    }

    // Save and export animation data
    const handleSaveAndExport = async () => {
        if (!data || !projectPath) {
            setToast({ type: 'error', message: 'No project loaded' })
            return
        }

        setSaving(true)
        setToast(null)

        try {
            if (window.electronAPI) {
                // Save JSON
                await window.electronAPI.motionsSave(projectPath, characterId, data)

                // Generate and save Lua
                const luaContent = generateMotionsLua(characterId, data)
                await window.electronAPI.motionsExportLua(projectPath, characterId, luaContent)
            }

            markClean()
            setToast({ type: 'success', message: 'MEMORY WRITTEN SUCCESSFULLY' })

            setTimeout(() => setToast(null), 3000)
        } catch (error) {
            setToast({ type: 'error', message: `WRITE FAILED: ${String(error)}` })
        } finally {
            setSaving(false)
        }
    }

    // Generate Lua animation file
    const generateMotionsLua = (charId: string, motionData: typeof data) => {
        const timestamp = new Date().toISOString()

        let lua = `--[[\n`
        lua += `    TAO MOTIONS - Generated Animation Data\n`
        lua += `    Character: ${charId}\n`
        lua += `    Timestamp: ${timestamp}\n`
        lua += `]]\n\n`

        lua += `local animations = {}\n\n`
        lua += `animations.sheet = "${motionData?.sourceImage || ''}"\n`
        lua += `animations.grid = { w = ${motionData?.grid.w || 32}, h = ${motionData?.grid.h || 32} }\n\n`

        lua += `animations.clips = ${toLuaValue(motionData?.animations || {}, 0)}\n\n`

        lua += `return animations\n`

        return lua
    }

    const animationList = data ? Object.values(data.animations) : []
    const currentAnim = activeAnimationName && data?.animations[activeAnimationName] ? data.animations[activeAnimationName] : null
    const currentFrame = currentAnim && currentAnim.frames[activeFrameIndex] ? currentAnim.frames[activeFrameIndex] : null

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="TAO MOTIONS"
                    subtitle="Animation & Hitbox Editor"
                    actions={
                        <div className="flex items-center gap-3">
                            {toast && (
                                <span className={`text-xs font-code ${toast.type === 'success' ? 'text-neon-cyan' : 'text-neon-magenta'
                                    }`}>
                                    {toast.message}
                                </span>
                            )}
                            {isDirty && (
                                <span className="text-neon-yellow text-xs font-code animate-pulse">
                                    ● UNSAVED
                                </span>
                            )}
                            <Button
                                variant="magenta"
                                size="sm"
                                onClick={handleSaveAndExport}
                                disabled={saving || !data || Object.keys(data.animations).length === 0}
                            >
                                {saving ? 'WRITING...' : 'WRITE TO MEMORY'}
                            </Button>
                        </div>
                    }
                />

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Animation List */}
                    <div className="w-64 bg-grid border-r border-neon-magenta/20 flex flex-col">
                        <div className="p-4 border-b border-neon-magenta/20 space-y-2">
                            <Button variant="ghost" size="sm" className="w-full" onClick={handleLoadSpriteSheet}>
                                LOAD SPRITE SHEET
                            </Button>
                            <Button variant="magenta" size="sm" className="w-full" onClick={handleCreateAnimation}>
                                + NEW ANIMATION
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto p-2">
                            {animationList.length === 0 ? (
                                <div className="text-center text-holo/30 text-xs py-8">
                                    No animations yet
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {animationList.map((anim) => (
                                        <button
                                            key={anim.name}
                                            onClick={() => setActiveAnimation(anim.name)}
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

                        {/* Sprite Sheet Info */}
                        {data?.sourceImage && (
                            <div className="p-4 border-t border-neon-magenta/20">
                                <div className="text-xs text-holo/50 mb-2">SPRITE SHEET</div>
                                <div className="text-xs text-holo font-code truncate">
                                    {data.sourceImage.split('/').pop()}
                                </div>
                                <div className="text-xs text-holo/40 mt-1">
                                    Grid: {data.grid.w}x{data.grid.h}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Canvas Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Toolbar */}
                        <div className="h-12 bg-grid border-b border-neon-magenta/20 flex items-center px-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={isPlaying ? 'magenta' : 'ghost'}
                                    onClick={togglePlayback}
                                    disabled={!currentAnim || currentAnim.frames.length === 0}
                                >
                                    {isPlaying ? '⏹ STOP' : '▶ PLAY'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleAddFrame}
                                    disabled={!activeAnimationName}
                                >
                                    + FRAME
                                </Button>
                            </div>

                            <div className="h-6 w-px bg-neon-magenta/20" />

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-holo/50">ZOOM:</span>
                                <Button size="sm" variant="ghost" onClick={() => setZoom(zoom - 0.5)}>-</Button>
                                <span className="text-xs text-holo w-12 text-center">{zoom}x</span>
                                <Button size="sm" variant="ghost" onClick={() => setZoom(zoom + 0.5)}>+</Button>
                            </div>

                            <div className="h-6 w-px bg-neon-magenta/20" />

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-holo/50">BOX:</span>
                                {(['body', 'hit', 'hurt'] as const).map((type) => (
                                    <Button
                                        key={type}
                                        size="sm"
                                        variant={selectedBoxType === type ?
                                            (type === 'body' ? 'cyan' : type === 'hit' ? 'magenta' : 'yellow') :
                                            'ghost'
                                        }
                                        onClick={() => setSelectedBoxType(selectedBoxType === type ? null : type)}
                                    >
                                        {type.toUpperCase()}
                                    </Button>
                                ))}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleAddBox}
                                    disabled={!selectedBoxType || !currentFrame}
                                >
                                    + ADD
                                </Button>
                            </div>
                        </div>

                        {/* Canvas */}
                        <div className="flex-1 flex items-center justify-center bg-void bg-grid-pattern overflow-auto p-8">
                            {activeAnimationName && currentAnim ? (
                                <div className="relative">
                                    <canvas
                                        ref={canvasRef}
                                        className="border border-neon-magenta/30"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                    <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-holo/50">
                                        Frame {activeFrameIndex + 1} / {currentAnim.frames.length}
                                    </div>
                                </div>
                            ) : (
                                <Panel className="text-center max-w-md">
                                    <div className="text-4xl mb-4">🎬</div>
                                    <h3 className="font-display text-neon-magenta text-lg mb-2">
                                        NO ANIMATION SELECTED
                                    </h3>
                                    <p className="text-holo/50 text-sm mb-4">
                                        Load a sprite sheet and create an animation to get started
                                    </p>
                                    <Button variant="magenta" onClick={handleCreateAnimation}>
                                        CREATE ANIMATION
                                    </Button>
                                </Panel>
                            )}
                        </div>

                        {/* Timeline */}
                        {currentAnim && currentAnim.frames.length > 0 && (
                            <div className="h-24 bg-grid border-t border-neon-magenta/20 p-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {currentAnim.frames.map((frame, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveFrame(i)}
                                            className={`
                        flex-shrink-0 w-16 h-16 border-2 flex items-center justify-center
                        ${activeFrameIndex === i
                                                    ? 'border-neon-magenta bg-neon-magenta/10'
                                                    : 'border-holo/20 hover:border-holo/40'
                                                }
                      `}
                                        >
                                            <span className="text-xs text-holo font-code">{frame.index}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleAddFrame}
                                        className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-holo/20 hover:border-neon-magenta/50 
                               flex items-center justify-center text-holo/30 hover:text-neon-magenta transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Frame Properties */}
                    <div className="w-72 bg-grid border-l border-neon-magenta/20 p-4 overflow-auto">
                        <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                            FRAME PROPERTIES
                        </h4>

                        {currentFrame ? (
                            <div className="space-y-4">
                                <Panel>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-holo/50">Sprite Index</span>
                                            <span className="text-neon-magenta font-code">{currentFrame.index}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-holo/50">Duration Mult</span>
                                            <span className="text-holo font-code">{currentFrame.durationMult}x</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-holo/50">Origin</span>
                                            <span className="text-holo font-code">
                                                {currentFrame.origin.x}, {currentFrame.origin.y}
                                            </span>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel>
                                    <h5 className="font-display text-[10px] text-neon-cyan mb-2">BODY BOX</h5>
                                    {currentFrame.bodyBox ? (
                                        <div className="text-xs text-holo/70 font-code">
                                            x: {currentFrame.bodyBox.rect.x}, y: {currentFrame.bodyBox.rect.y}<br />
                                            w: {currentFrame.bodyBox.rect.w}, h: {currentFrame.bodyBox.rect.h}<br />
                                            sensor: {currentFrame.bodyBox.isSensor ? 'yes' : 'no'}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-holo/30">Not defined</span>
                                    )}
                                </Panel>

                                <Panel>
                                    <h5 className="font-display text-[10px] text-neon-magenta mb-2">HIT BOX</h5>
                                    {currentFrame.hitBox ? (
                                        <div className="text-xs text-holo/70 font-code">
                                            x: {currentFrame.hitBox.x}, y: {currentFrame.hitBox.y}<br />
                                            w: {currentFrame.hitBox.w}, h: {currentFrame.hitBox.h}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-holo/30">Not defined</span>
                                    )}
                                </Panel>

                                <Panel>
                                    <h5 className="font-display text-[10px] text-neon-yellow mb-2">HURT BOX</h5>
                                    {currentFrame.hurtBox ? (
                                        <div className="text-xs text-holo/70 font-code">
                                            x: {currentFrame.hurtBox.x}, y: {currentFrame.hurtBox.y}<br />
                                            w: {currentFrame.hurtBox.w}, h: {currentFrame.hurtBox.h}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-holo/30">Not defined</span>
                                    )}
                                </Panel>
                            </div>
                        ) : (
                            <div className="text-center text-holo/30 text-xs py-8">
                                No frame selected
                            </div>
                        )}

                        {/* Animation Settings */}
                        {currentAnim && (
                            <div className="mt-6">
                                <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                                    ANIMATION SETTINGS
                                </h4>
                                <Panel>
                                    <div className="space-y-3">
                                        <Input
                                            label="FPS"
                                            type="number"
                                            value={currentAnim.fps}
                                            onChange={() => { }} // Would update store
                                            className="text-center"
                                        />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-holo/50">Loop</span>
                                            <button
                                                className={`
                          px-3 py-1 text-xs font-display border
                          ${currentAnim.loop
                                                        ? 'border-neon-magenta text-neon-magenta'
                                                        : 'border-holo/30 text-holo/50'
                                                    }
                        `}
                                            >
                                                {currentAnim.loop ? 'ON' : 'OFF'}
                                            </button>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Animation Modal */}
            {showAnimModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Panel variant="magenta" className="w-96">
                        <div className="space-y-4">
                            <h3 className="font-display text-neon-magenta text-lg">
                                CREATE NEW ANIMATION
                            </h3>
                            <Input
                                label="Animation Name"
                                placeholder="e.g., idle, run, attack"
                                value={newAnimName}
                                onChange={(e) => setNewAnimName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && confirmCreateAnimation()}
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowAnimModal(false)
                                        setNewAnimName('')
                                    }}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="magenta"
                                    className="flex-1"
                                    onClick={confirmCreateAnimation}
                                    disabled={!newAnimName.trim()}
                                >
                                    CREATE
                                </Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            )}

            {/* Add Frame Modal */}
            {showFrameModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Panel variant="magenta" className="w-96">
                        <div className="space-y-4">
                            <h3 className="font-display text-neon-magenta text-lg">
                                ADD FRAME
                            </h3>
                            <Input
                                label="Sprite Index (0-based)"
                                placeholder="0"
                                type="number"
                                value={newFrameIndex}
                                onChange={(e) => setNewFrameIndex(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && confirmAddFrame()}
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowFrameModal(false)
                                        setNewFrameIndex('0')
                                    }}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="magenta"
                                    className="flex-1"
                                    onClick={confirmAddFrame}
                                >
                                    ADD
                                </Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            )}
        </div>
    )
}
