/**
 * Default Values
 * Centralized default configurations
 */

import type { SpriteGrid, PhysicsDefaults, TaoProjectConfig } from '../types'

export const DEFAULT_SPRITE_GRID: SpriteGrid = {
    w: 32,
    h: 32,
    margin: 0,
    spacing: 0,
}

export const DEFAULT_PHYSICS: PhysicsDefaults = {
    friction: 0.3,
    restitution: 0,
    categoryBits: 1,
    maskBits: 0xFFFF,
}

export const DEFAULT_ANIMATION_FPS = 12
export const DEFAULT_ANIMATION_LOOP = true

export const DEFAULT_NODE_POSITION = { x: 100, y: 100 }

export const createDefaultProjectConfig = (projectName: string): TaoProjectConfig => ({
    version: '1.0.0',
    projectName,
    created: new Date().toISOString(),
    paths: {
        assets: 'assets',
        output: 'src/generated',
        localization: 'tao/localization'
    },
    modules: {
        talks: {
            defaultLanguage: 'en',
            supportedLanguages: ['en']
        },
        motions: {
            useAseprite: false
        }
    }
})
