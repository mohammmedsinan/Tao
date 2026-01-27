/**
 * Motions Feature - useAnimationPlayback Hook
 * Handles animation playback loop
 */

import { useEffect } from 'react'
import { useMotionsStore } from '../store'

export function useAnimationPlayback() {
    const {
        data,
        activeAnimationName,
        activeFrameIndex,
        isPlaying,
        setActiveFrame,
        togglePlayback,
    } = useMotionsStore()

    // Animation playback loop
    useEffect(() => {
        if (!isPlaying || !activeAnimationName || !data?.animations[activeAnimationName]) return

        const anim = data.animations[activeAnimationName]
        if (anim.frames.length === 0) return

        const interval = setInterval(() => {
            setActiveFrame((activeFrameIndex + 1) % anim.frames.length)
        }, 1000 / anim.fps)

        return () => clearInterval(interval)
    }, [isPlaying, activeAnimationName, activeFrameIndex, data, setActiveFrame])

    return {
        isPlaying,
        togglePlayback,
        currentFrameIndex: activeFrameIndex,
        totalFrames: activeAnimationName && data?.animations[activeAnimationName]
            ? data.animations[activeAnimationName].frames.length
            : 0,
    }
}
