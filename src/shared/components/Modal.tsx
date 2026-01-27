/**
 * Modal Component
 * Reusable modal dialog with Night City styling
 */

import { useEffect, type ReactNode } from 'react'
import Panel from './Panel'
import Button from './Button'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    variant?: 'cyan' | 'magenta' | 'yellow'
    showClose?: boolean
    className?: string
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    variant = 'cyan',
    showClose = true,
    className = ''
}: ModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    if (!open) return null

    const variantColors = {
        cyan: 'text-neon-cyan',
        magenta: 'text-neon-magenta',
        yellow: 'text-neon-yellow'
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal content */}
            <div
                className={`relative z-10 w-full max-w-md mx-4 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <Panel glow>
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className={`font-display text-lg ${variantColors[variant]}`}>
                                {title}
                            </h3>
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="text-holo/50 hover:text-holo transition-colors text-xl leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        {children}
                    </div>
                </Panel>
            </div>
        </div>
    )
}

// Modal footer with action buttons
interface ModalFooterProps {
    onCancel: () => void
    onConfirm: () => void
    cancelText?: string
    confirmText?: string
    confirmVariant?: 'cyan' | 'magenta' | 'yellow'
    confirmDisabled?: boolean
    loading?: boolean
}

export function ModalFooter({
    onCancel,
    onConfirm,
    cancelText = 'CANCEL',
    confirmText = 'CONFIRM',
    confirmVariant = 'cyan',
    confirmDisabled = false,
    loading = false
}: ModalFooterProps) {
    return (
        <div className="flex gap-3 mt-4">
            <Button
                variant="ghost"
                className="flex-1"
                onClick={onCancel}
                disabled={loading}
            >
                {cancelText}
            </Button>
            <Button
                variant={confirmVariant}
                className="flex-1"
                onClick={onConfirm}
                disabled={confirmDisabled || loading}
            >
                {loading ? 'LOADING...' : confirmText}
            </Button>
        </div>
    )
}
