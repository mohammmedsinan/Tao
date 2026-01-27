/**
 * useToast Hook
 * Provides toast notification state management
 */

import { useState, useCallback } from 'react'
import type { ToastMessage } from '../types'

interface UseToastReturn {
    toast: ToastMessage | null
    showToast: (message: ToastMessage) => void
    hideToast: () => void
    showSuccess: (message: string) => void
    showError: (message: string) => void
}

export function useToast(autoHideMs = 3000): UseToastReturn {
    const [toast, setToast] = useState<ToastMessage | null>(null)

    const hideToast = useCallback(() => {
        setToast(null)
    }, [])

    const showToast = useCallback((message: ToastMessage) => {
        setToast(message)
        if (autoHideMs > 0) {
            setTimeout(hideToast, autoHideMs)
        }
    }, [autoHideMs, hideToast])

    const showSuccess = useCallback((message: string) => {
        showToast({ type: 'success', message })
    }, [showToast])

    const showError = useCallback((message: string) => {
        showToast({ type: 'error', message })
    }, [showToast])

    return {
        toast,
        showToast,
        hideToast,
        showSuccess,
        showError
    }
}
