import { create } from 'zustand'

// ============================================
// Type Definitions (From TAO_DATA_SCHEMA.md)
// ============================================

export type UUID = string
export type FilePath = string

export interface Vector2 {
    x: number
    y: number
}

export interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export interface KeyFrame {
    index: number
    durationMult: number
    origin: Vector2
    bodyBox?: {
        rect: Rect
        isSensor: boolean
    }
    hitBox?: Rect
    hurtBox?: Rect
    triggers?: {
        sfx?: string
        vfx?: string
        method?: string
    }[]
}

export interface AnimationClip {
    name: string
    fps: number
    loop: boolean
    frames: KeyFrame[]
}

export interface MotionsModuleData {
    sourceImage: FilePath
    grid: { w: number; h: number; margin: number; spacing: number }
    physicsDefaults: {
        friction: number
        restitution: number
        categoryBits: number
        maskBits: number
    }
    animations: Record<string, AnimationClip>
}

// ============================================
// Store State
// ============================================

interface MotionsState {
    // Current module data
    data: MotionsModuleData | null

    // UI State
    activeAnimationName: string | null
    activeFrameIndex: number
    selectedBoxType: 'body' | 'hit' | 'hurt' | null
    isPlaying: boolean

    // Canvas state
    zoom: number
    pan: Vector2

    // Dirty state
    isDirty: boolean

    // Actions
    setData: (data: MotionsModuleData) => void
    setSpriteSheet: (path: FilePath, gridW: number, gridH: number) => void

    // UI Actions
    setActiveAnimation: (name: string | null) => void
    setActiveFrame: (index: number) => void
    setSelectedBoxType: (type: 'body' | 'hit' | 'hurt' | null) => void
    togglePlayback: () => void
    setZoom: (zoom: number) => void
    setPan: (pan: Vector2) => void

    // Animation operations
    createAnimation: (name: string) => void
    deleteAnimation: (name: string) => void
    renameAnimation: (oldName: string, newName: string) => void
    updateAnimation: (name: string, updates: Partial<AnimationClip>) => void

    // Frame operations
    addFrame: (animName: string, spriteIndex: number) => void
    removeFrame: (animName: string, frameIndex: number) => void
    updateFrame: (animName: string, frameIndex: number, updates: Partial<KeyFrame>) => void
    reorderFrames: (animName: string, fromIndex: number, toIndex: number) => void

    // Box operations
    updateFrameBox: (
        animName: string,
        frameIndex: number,
        boxType: 'body' | 'hit' | 'hurt',
        rect: Rect | null,
        isSensor?: boolean
    ) => void

    // Reset
    reset: () => void
    markClean: () => void
}

const initialData: MotionsModuleData = {
    sourceImage: '',
    grid: { w: 32, h: 32, margin: 0, spacing: 0 },
    physicsDefaults: {
        friction: 0.3,
        restitution: 0,
        categoryBits: 1,
        maskBits: 65535
    },
    animations: {}
}

export const useMotionsStore = create<MotionsState>((set) => ({
    data: null,
    activeAnimationName: null,
    activeFrameIndex: 0,
    selectedBoxType: null,
    isPlaying: false,
    zoom: 2,
    pan: { x: 0, y: 0 },
    isDirty: false,

    setData: (data) => set({ data, isDirty: false }),

    setSpriteSheet: (path, gridW, gridH) => {
        set((state) => ({
            data: {
                ...(state.data ?? initialData),
                sourceImage: path,
                grid: { ...state.data?.grid ?? initialData.grid, w: gridW, h: gridH }
            },
            isDirty: true
        }))
    },

    setActiveAnimation: (name) => set({ activeAnimationName: name, activeFrameIndex: 0, isPlaying: false }),

    setActiveFrame: (index) => set({ activeFrameIndex: index }),

    setSelectedBoxType: (type) => set({ selectedBoxType: type }),

    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(8, zoom)) }),

    setPan: (pan) => set({ pan }),

    createAnimation: (name) => {
        set((state) => {
            if (!state.data || state.data.animations[name]) return state

            const newAnim: AnimationClip = {
                name,
                fps: 12,
                loop: true,
                frames: []
            }

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [name]: newAnim
                    }
                },
                activeAnimationName: name,
                isDirty: true
            }
        })
    },

    deleteAnimation: (name) => {
        set((state) => {
            if (!state.data) return state

            const { [name]: _, ...remaining } = state.data.animations
            return {
                data: { ...state.data, animations: remaining },
                activeAnimationName: state.activeAnimationName === name ? null : state.activeAnimationName,
                isDirty: true
            }
        })
    },

    renameAnimation: (oldName, newName) => {
        set((state) => {
            if (!state.data || !state.data.animations[oldName] || state.data.animations[newName]) return state

            const anim = state.data.animations[oldName]
            const { [oldName]: _, ...remaining } = state.data.animations

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...remaining,
                        [newName]: { ...anim, name: newName }
                    }
                },
                activeAnimationName: state.activeAnimationName === oldName ? newName : state.activeAnimationName,
                isDirty: true
            }
        })
    },

    updateAnimation: (name, updates) => {
        set((state) => {
            if (!state.data?.animations[name]) return state

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [name]: { ...state.data.animations[name], ...updates }
                    }
                },
                isDirty: true
            }
        })
    },

    addFrame: (animName, spriteIndex) => {
        set((state) => {
            if (!state.data?.animations[animName]) return state

            const anim = state.data.animations[animName]
            const newFrame: KeyFrame = {
                index: spriteIndex,
                durationMult: 1,
                origin: { x: state.data.grid.w / 2, y: state.data.grid.h }
            }

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [animName]: {
                            ...anim,
                            frames: [...anim.frames, newFrame]
                        }
                    }
                },
                activeFrameIndex: anim.frames.length,
                isDirty: true
            }
        })
    },

    removeFrame: (animName, frameIndex) => {
        set((state) => {
            if (!state.data?.animations[animName]) return state

            const anim = state.data.animations[animName]
            const newFrames = anim.frames.filter((_, i) => i !== frameIndex)

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [animName]: { ...anim, frames: newFrames }
                    }
                },
                activeFrameIndex: Math.min(state.activeFrameIndex, newFrames.length - 1),
                isDirty: true
            }
        })
    },

    updateFrame: (animName, frameIndex, updates) => {
        set((state) => {
            if (!state.data?.animations[animName]?.frames[frameIndex]) return state

            const anim = state.data.animations[animName]
            const newFrames = [...anim.frames]
            newFrames[frameIndex] = { ...newFrames[frameIndex], ...updates }

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [animName]: { ...anim, frames: newFrames }
                    }
                },
                isDirty: true
            }
        })
    },

    reorderFrames: (animName, fromIndex, toIndex) => {
        set((state) => {
            if (!state.data?.animations[animName]) return state

            const anim = state.data.animations[animName]
            const newFrames = [...anim.frames]
            const [moved] = newFrames.splice(fromIndex, 1)
            newFrames.splice(toIndex, 0, moved)

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [animName]: { ...anim, frames: newFrames }
                    }
                },
                activeFrameIndex: toIndex,
                isDirty: true
            }
        })
    },

    updateFrameBox: (animName, frameIndex, boxType, rect, isSensor = false) => {
        set((state) => {
            if (!state.data?.animations[animName]?.frames[frameIndex]) return state

            const anim = state.data.animations[animName]
            const frame = anim.frames[frameIndex]
            const newFrames = [...anim.frames]

            if (boxType === 'body') {
                newFrames[frameIndex] = {
                    ...frame,
                    bodyBox: rect ? { rect, isSensor } : undefined
                }
            } else if (boxType === 'hit') {
                newFrames[frameIndex] = {
                    ...frame,
                    hitBox: rect ?? undefined
                }
            } else if (boxType === 'hurt') {
                newFrames[frameIndex] = {
                    ...frame,
                    hurtBox: rect ?? undefined
                }
            }

            return {
                data: {
                    ...state.data,
                    animations: {
                        ...state.data.animations,
                        [animName]: { ...anim, frames: newFrames }
                    }
                },
                isDirty: true
            }
        })
    },

    reset: () => set({
        data: null,
        activeAnimationName: null,
        activeFrameIndex: 0,
        selectedBoxType: null,
        isPlaying: false,
        zoom: 2,
        pan: { x: 0, y: 0 },
        isDirty: false
    }),

    markClean: () => set({ isDirty: false })
}))
