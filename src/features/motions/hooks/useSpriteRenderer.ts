/**
 * Motions Feature - useSpriteRenderer Hook
 * Handles canvas rendering of sprites and bounding boxes
 */

import { useEffect, useRef, useState, type RefObject } from 'react'
import { useMotionsStore } from '../store'

interface UseSpriteRendererReturn {
    canvasRef: RefObject<HTMLCanvasElement>
    spriteImage: HTMLImageElement | null
}

export function useSpriteRenderer(): UseSpriteRendererReturn {
    const canvasRef = useRef<HTMLCanvasElement>(null!)
    const [spriteImage, setSpriteImage] = useState<HTMLImageElement | null>(null)

    const {
        data,
        activeAnimationName,
        activeFrameIndex,
        zoom,
    } = useMotionsStore()

    // Load sprite image when source changes
    useEffect(() => {
        if (data?.sourceImage) {
            const img = new Image()
            img.onload = () => setSpriteImage(img)
            img.src = data.sourceImage
        } else {
            setSpriteImage(null)
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

                // Draw boxes helper
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

                // Draw bounding boxes
                if (frame.bodyBox) {
                    drawBox(frame.bodyBox.rect, '#00F0FF') // Cyan for body
                }
                if (frame.hitBox) {
                    drawBox(frame.hitBox, '#FF00D4') // Magenta for hit
                }
                if (frame.hurtBox) {
                    drawBox(frame.hurtBox, '#FFE600') // Yellow for hurt
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

    return {
        canvasRef,
        spriteImage,
    }
}
