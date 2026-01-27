/**
 * Animation/Motions module type definitions
 */

// Bounding box for collision detection
export interface BoundingBox {
    x: number
    y: number
    w: number
    h: number
}

// Body box with physics properties
export interface BodyBox {
    rect: BoundingBox
    isSensor: boolean
}

// Single animation frame
export interface AnimationFrame {
    index: number
    duration?: number
    origin: { x: number; y: number }
    bodyBox?: BodyBox
    hitBox?: BoundingBox
    hurtBox?: BoundingBox
}

// Animation clip definition
export interface Animation {
    name: string
    fps: number
    loop: boolean
    frames: AnimationFrame[]
}

// Sprite sheet grid configuration
export interface SpriteGrid {
    w: number
    h: number
    margin: number
    spacing: number
}

// Physics defaults for character
export interface PhysicsDefaults {
    friction: number
    restitution: number
    categoryBits: number
    maskBits: number
}

// Module data structure
export interface MotionsModuleData {
    sourceImage: string
    grid: SpriteGrid
    physicsDefaults: PhysicsDefaults
    animations: Record<string, Animation>
}

// Box types for editing
export type BoxType = 'body' | 'hit' | 'hurt'

// Store state
export interface MotionsState {
    data: MotionsModuleData | null
    activeAnimationName: string | null
    activeFrameIndex: number
    selectedBoxType: BoxType | null
    isPlaying: boolean
    zoom: number
    isDirty: boolean
}
