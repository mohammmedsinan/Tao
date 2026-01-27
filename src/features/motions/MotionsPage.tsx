/**
 * Motions Feature - Main Page Component
 * Thin orchestrator that composes feature components
 */

import { useEffect, useState } from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { Sidebar, Header } from '@/shared/layouts'
import { Button, Toast } from '@/shared/components'
import { DEFAULT_SPRITE_GRID, DEFAULT_PHYSICS } from '@/core/constants'

import { useMotionsStore } from './store'
import { useSpriteRenderer, useAnimationPlayback, useMotionsSave } from './hooks'
import {
    AnimationList,
    SpriteCanvas,
    Timeline,
    PropertiesPanel,
    CreateAnimationModal,
    AddFrameModal,
} from './components'

export default function MotionsPage() {
    const { projectPath, projectConfig } = useProjectStore()
    const characterId = projectConfig?.projectName?.toLowerCase().replace(/\s+/g, '_') || 'character'

    const {
        data,
        activeAnimationName,
        activeFrameIndex,
        selectedBoxType,
        zoom,
        isDirty,
        setData,
        setActiveAnimation,
        setActiveFrame,
        setSelectedBoxType,
        setZoom,
        createAnimation,
        addFrame,
        updateFrameBox,
        updateAnimationSettings,
        markClean,
    } = useMotionsStore()

    const { canvasRef } = useSpriteRenderer()
    const { isPlaying, togglePlayback } = useAnimationPlayback()
    const { toast, saveAndExport } = useMotionsSave({
        projectPath,
        characterId,
        data,
        onSaveComplete: markClean,
    })

    const [saving, setSaving] = useState(false)
    const [showAnimModal, setShowAnimModal] = useState(false)
    const [showFrameModal, setShowFrameModal] = useState(false)

    // Initialize with empty data if needed
    useEffect(() => {
        if (!data) {
            setData({
                sourceImage: '',
                grid: DEFAULT_SPRITE_GRID,
                physicsDefaults: DEFAULT_PHYSICS,
                animations: {},
            })
        }
    }, [data, setData])

    const handleSave = async () => {
        setSaving(true)
        await saveAndExport()
        setSaving(false)
    }

    const handleLoadSpriteSheet = async () => {
        // TODO: Implement sprite sheet loading via dialog
        console.log('Load sprite sheet - to be implemented')
    }

    const handleCreateAnimation = (name: string) => {
        createAnimation(name)
    }

    const handleAddFrame = (spriteIndex: number) => {
        if (activeAnimationName) {
            addFrame(activeAnimationName, spriteIndex)
        }
    }

    const handleAddBox = () => {
        if (!activeAnimationName || !selectedBoxType) return
        const rect = { x: -16, y: -32, w: 32, h: 32 }
        updateFrameBox(activeAnimationName, activeFrameIndex, selectedBoxType, rect)
    }

    const handleUpdateFps = (fps: number) => {
        if (activeAnimationName) {
            updateAnimationSettings(activeAnimationName, { fps })
        }
    }

    const handleToggleLoop = () => {
        if (activeAnimationName && currentAnim) {
            updateAnimationSettings(activeAnimationName, { loop: !currentAnim.loop })
        }
    }

    const animationList = data ? Object.values(data.animations) : []
    const currentAnim = activeAnimationName && data?.animations[activeAnimationName]
        ? data.animations[activeAnimationName]
        : null
    const currentFrame = currentAnim?.frames[activeFrameIndex] ?? null

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="TAO MOTIONS"
                    subtitle="Animation & Hitbox Editor"
                    actions={
                        <div className="flex items-center gap-3">
                            <Toast toast={toast} />
                            {isDirty && (
                                <span className="text-neon-yellow text-xs font-code animate-pulse">
                                    ● UNSAVED
                                </span>
                            )}
                            <Button
                                variant="magenta"
                                size="sm"
                                onClick={handleSave}
                                disabled={saving || !data || Object.keys(data.animations).length === 0}
                            >
                                {saving ? 'WRITING...' : 'WRITE TO MEMORY'}
                            </Button>
                        </div>
                    }
                />

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Animation List */}
                    <AnimationList
                        animations={animationList}
                        activeAnimationName={activeAnimationName}
                        onSelectAnimation={setActiveAnimation}
                        onCreateAnimation={() => setShowAnimModal(true)}
                        onLoadSpriteSheet={handleLoadSpriteSheet}
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Canvas */}
                        <SpriteCanvas
                            canvasRef={canvasRef}
                            zoom={zoom}
                            onZoomIn={() => setZoom(zoom + 1)}
                            onZoomOut={() => setZoom(zoom - 1)}
                            isPlaying={isPlaying}
                            onTogglePlayback={togglePlayback}
                            hasAnimation={!!currentAnim && currentAnim.frames.length > 0}
                        />

                        {/* Timeline */}
                        {currentAnim && (
                            <Timeline
                                frames={currentAnim.frames}
                                activeFrameIndex={activeFrameIndex}
                                onSelectFrame={setActiveFrame}
                                onAddFrame={() => setShowFrameModal(true)}
                            />
                        )}
                    </div>

                    {/* Right Sidebar - Properties */}
                    <PropertiesPanel
                        animation={currentAnim}
                        frame={currentFrame}
                        selectedBoxType={selectedBoxType}
                        onSelectBoxType={setSelectedBoxType}
                        onAddBox={handleAddBox}
                        onUpdateFps={handleUpdateFps}
                        onToggleLoop={handleToggleLoop}
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateAnimationModal
                open={showAnimModal}
                onClose={() => setShowAnimModal(false)}
                onConfirm={handleCreateAnimation}
            />
            <AddFrameModal
                open={showFrameModal}
                onClose={() => setShowFrameModal(false)}
                onConfirm={handleAddFrame}
            />
        </div>
    )
}
