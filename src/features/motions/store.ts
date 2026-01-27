/**
 * Motions Feature - Store
 * Zustand store for animation/motions module state
 */

import { create } from 'zustand'
import type { MotionsModuleData, Animation, AnimationFrame, BoundingBox, BoxType, MotionsState } from '@/core/types'

interface MotionsActions {
    setData: (data: MotionsModuleData) => void
    setSpriteSheet: (imagePath: string, gridW: number, gridH: number) => void
    setActiveAnimation: (name: string | null) => void
    setActiveFrame: (index: number) => void
    setSelectedBoxType: (type: BoxType | null) => void
    togglePlayback: () => void
    setZoom: (zoom: number) => void
    createAnimation: (name: string) => void
    deleteAnimation: (name: string) => void
    addFrame: (animName: string, spriteIndex: number) => void
    removeFrame: (animName: string, frameIndex: number) => void
    updateFrameBox: (animName: string, frameIndex: number, boxType: BoxType, rect: BoundingBox | null) => void
    updateFrameOrigin: (animName: string, frameIndex: number, origin: { x: number; y: number }) => void
    updateAnimationSettings: (animName: string, settings: Partial<Pick<Animation, 'fps' | 'loop'>>) => void
    markClean: () => void
}

export const useMotionsStore = create<MotionsState & MotionsActions>((set, get) => ({
    // State
    data: null,
    activeAnimationName: null,
    activeFrameIndex: 0,
    selectedBoxType: null,
    isPlaying: false,
    zoom: 4,
    isDirty: false,

    // Actions
    setData: (data) => set({ data }),

    setSpriteSheet: (imagePath, gridW, gridH) => {
        const { data } = get()
        if (!data) return

        set({
            data: {
                ...data,
                sourceImage: imagePath,
                grid: { ...data.grid, w: gridW, h: gridH },
            },
            isDirty: true,
        })
    },

    setActiveAnimation: (name) => set({ activeAnimationName: name, activeFrameIndex: 0 }),

    setActiveFrame: (index) => set({ activeFrameIndex: index }),

    setSelectedBoxType: (type) => set({ selectedBoxType: type }),

    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(8, zoom)) }),

    createAnimation: (name) => {
        const { data } = get()
        if (!data) return

        const newAnim: Animation = {
            name,
            fps: 12,
            loop: true,
            frames: [],
        }

        set({
            data: {
                ...data,
                animations: { ...data.animations, [name]: newAnim },
            },
            activeAnimationName: name,
            activeFrameIndex: 0,
            isDirty: true,
        })
    },

    deleteAnimation: (name) => {
        const { data, activeAnimationName } = get()
        if (!data) return

        const { [name]: _, ...remainingAnims } = data.animations

        set({
            data: { ...data, animations: remainingAnims },
            activeAnimationName: activeAnimationName === name ? null : activeAnimationName,
            isDirty: true,
        })
    },

    addFrame: (animName, spriteIndex) => {
        const { data } = get()
        if (!data || !data.animations[animName]) return

        const anim = data.animations[animName]
        const newFrame: AnimationFrame = {
            index: spriteIndex,
            origin: { x: data.grid.w / 2, y: data.grid.h },
        }

        set({
            data: {
                ...data,
                animations: {
                    ...data.animations,
                    [animName]: {
                        ...anim,
                        frames: [...anim.frames, newFrame],
                    },
                },
            },
            activeFrameIndex: anim.frames.length,
            isDirty: true,
        })
    },

    removeFrame: (animName, frameIndex) => {
        const { data, activeFrameIndex } = get()
        if (!data || !data.animations[animName]) return

        const anim = data.animations[animName]
        const newFrames = anim.frames.filter((_, i) => i !== frameIndex)

        set({
            data: {
                ...data,
                animations: {
                    ...data.animations,
                    [animName]: { ...anim, frames: newFrames },
                },
            },
            activeFrameIndex: Math.min(activeFrameIndex, newFrames.length - 1),
            isDirty: true,
        })
    },

    updateFrameBox: (animName, frameIndex, boxType, rect) => {
        const { data } = get()
        if (!data || !data.animations[animName]) return

        const anim = data.animations[animName]
        const frame = anim.frames[frameIndex]
        if (!frame) return

        let updatedFrame: AnimationFrame = { ...frame }

        switch (boxType) {
            case 'body':
                updatedFrame.bodyBox = rect ? { rect, isSensor: false } : undefined
                break
            case 'hit':
                updatedFrame.hitBox = rect ?? undefined
                break
            case 'hurt':
                updatedFrame.hurtBox = rect ?? undefined
                break
        }

        const newFrames = [...anim.frames]
        newFrames[frameIndex] = updatedFrame

        set({
            data: {
                ...data,
                animations: {
                    ...data.animations,
                    [animName]: { ...anim, frames: newFrames },
                },
            },
            isDirty: true,
        })
    },

    updateFrameOrigin: (animName, frameIndex, origin) => {
        const { data } = get()
        if (!data || !data.animations[animName]) return

        const anim = data.animations[animName]
        const frame = anim.frames[frameIndex]
        if (!frame) return

        const newFrames = [...anim.frames]
        newFrames[frameIndex] = { ...frame, origin }

        set({
            data: {
                ...data,
                animations: {
                    ...data.animations,
                    [animName]: { ...anim, frames: newFrames },
                },
            },
            isDirty: true,
        })
    },

    updateAnimationSettings: (animName, settings) => {
        const { data } = get()
        if (!data || !data.animations[animName]) return

        const anim = data.animations[animName]

        set({
            data: {
                ...data,
                animations: {
                    ...data.animations,
                    [animName]: { ...anim, ...settings },
                },
            },
            isDirty: true,
        })
    },

    markClean: () => set({ isDirty: false }),
}))
