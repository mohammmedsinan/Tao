/**
 * Core types - centralized exports
 */

// Project types
export * from './project'

// Module types
export * from './talks'
export * from './motions'

// Common utility types
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
    path?: string
}

export interface ToastMessage {
    type: 'success' | 'error' | 'info'
    message: string
}
