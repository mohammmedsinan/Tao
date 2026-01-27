/**
 * Theme Constants
 * Centralized theme configuration
 */

export const COLORS = {
    // Primary palette
    neonCyan: '#00F0FF',
    neonMagenta: '#FF00FF',
    neonYellow: '#FFFF00',

    // Background
    void: '#0A0A1A',
    grid: '#12121F',

    // Text
    holo: '#E0E0FF',

    // Status
    success: '#00F0FF',
    error: '#FF00FF',
    warning: '#FFFF00',
} as const

export const FONTS = {
    display: "'Orbitron', monospace",
    code: "'JetBrains Mono', 'Fira Code', monospace",
} as const

export const SPACING = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
} as const

export const BORDER_RADIUS = {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
} as const

export const SHADOWS = {
    neonCyan: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
    neonMagenta: '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
    neonYellow: '0 0 10px rgba(255, 255, 0, 0.5), 0 0 20px rgba(255, 255, 0, 0.3)',
} as const
