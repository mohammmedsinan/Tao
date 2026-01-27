/**
 * useModal Hook
 * Provides modal state management
 */

import { useState, useCallback } from 'react'

interface UseModalReturn<T = void> {
    isOpen: boolean
    data: T | null
    open: (data?: T) => void
    close: () => void
}

export function useModal<T = void>(): UseModalReturn<T> {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<T | null>(null)

    const open = useCallback((modalData?: T) => {
        setData(modalData ?? null)
        setIsOpen(true)
    }, [])

    const close = useCallback(() => {
        setIsOpen(false)
        setData(null)
    }, [])

    return {
        isOpen,
        data,
        open,
        close
    }
}
