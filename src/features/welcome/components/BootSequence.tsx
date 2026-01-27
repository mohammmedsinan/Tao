/**
 * Welcome Feature - Boot Sequence Component
 * Terminal-style boot animation
 */

import { useEffect, useState } from 'react'

export interface BootLine {
    text: string
    status: 'ok' | 'loading' | 'waiting'
}

interface BootSequenceProps {
    onComplete: () => void
    isElectron: boolean
}

export default function BootSequence({ onComplete, isElectron }: BootSequenceProps) {
    const [bootLines, setBootLines] = useState<BootLine[]>([])

    useEffect(() => {
        const lines = [
            '> INITIALIZING TAO_CORE...',
            '> MOUNTING SPRITE_ENGINE...',
            '> LOADING DIALOGUE_PARSER...',
            '> ESTABLISHING LUA_BRIDGE...',
            isElectron ? '> SYSTEM READY.' : '> BROWSER DEV MODE.',
        ]

        let index = 0
        const interval = setInterval(() => {
            if (index < lines.length) {
                setBootLines((prev) => [
                    ...prev,
                    { text: lines[index], status: index < lines.length - 1 ? 'ok' : 'waiting' },
                ])
                index++
            } else {
                clearInterval(interval)
                setTimeout(onComplete, 500)
            }
        }, 300)

        return () => clearInterval(interval)
    }, [isElectron, onComplete])

    return (
        <div className="min-h-screen bg-void flex items-center justify-center bg-grid-pattern">
            <div className="w-full max-w-xl p-8">
                <div className="font-code text-neon-cyan text-sm space-y-1">
                    {bootLines.map((line, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="boot-line">{line.text}</span>
                            {line.status === 'ok' && (
                                <span className="text-neon-yellow">[OK]</span>
                            )}
                            {line.status === 'loading' && (
                                <span className="boot-cursor" />
                            )}
                        </div>
                    ))}
                    {bootLines.length < 5 && <span className="boot-cursor" />}
                </div>
            </div>
        </div>
    )
}
