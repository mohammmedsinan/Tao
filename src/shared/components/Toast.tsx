/**
 * Toast Component
 * Notification display component
 */

import type { ToastMessage } from '@/core/types'

interface ToastProps {
    toast: ToastMessage | null
    className?: string
}

export default function Toast({ toast, className = '' }: ToastProps) {
    if (!toast) return null

    const typeStyles = {
        success: 'text-neon-cyan',
        error: 'text-neon-magenta',
        info: 'text-neon-yellow'
    }

    return (
        <span className={`text-xs font-code ${typeStyles[toast.type]} ${className}`}>
            {toast.message}
        </span>
    )
}
