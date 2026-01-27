/**
 * useAsyncAction Hook
 * Provides loading state and error handling for async actions
 */

import { useState, useCallback } from 'react'

interface UseAsyncActionReturn<T> {
    loading: boolean
    error: string | null
    execute: (...args: unknown[]) => Promise<T | undefined>
    reset: () => void
}

export function useAsyncAction<T>(
    action: (...args: unknown[]) => Promise<T>
): UseAsyncActionReturn<T> {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const execute = useCallback(async (...args: unknown[]) => {
        setLoading(true)
        setError(null)
        try {
            const result = await action(...args)
            return result
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
            return undefined
        } finally {
            setLoading(false)
        }
    }, [action])

    const reset = useCallback(() => {
        setError(null)
    }, [])

    return {
        loading,
        error,
        execute,
        reset
    }
}
