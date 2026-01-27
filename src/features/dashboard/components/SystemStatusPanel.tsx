/**
 * Dashboard Feature - System Status Panel
 * Shows project statistics
 */

import type { TaoProjectConfig } from '@/core/types'
import { Panel } from '@/shared/components'

interface SystemStatusPanelProps {
    config: TaoProjectConfig | null
    characterCount?: number
    dialogueCount?: number
    animationCount?: number
}

export default function SystemStatusPanel({
    config,
    characterCount = 0,
    dialogueCount = 0,
    animationCount = 0,
}: SystemStatusPanelProps) {
    const stats = [
        { label: 'Characters', value: characterCount, color: 'text-neon-cyan' },
        { label: 'Dialogues', value: dialogueCount, color: 'text-neon-cyan' },
        { label: 'Animations', value: animationCount, color: 'text-neon-magenta' },
        {
            label: 'Locales',
            value: config?.modules.talks.supportedLanguages.length || 0,
            color: 'text-neon-yellow'
        },
    ]

    return (
        <Panel>
            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                SYSTEM STATUS
            </h4>
            <div className="space-y-3">
                {stats.map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center">
                        <span className="text-sm text-holo/70">{label}</span>
                        <span className={`font-display ${color}`}>{value}</span>
                    </div>
                ))}
            </div>
        </Panel>
    )
}
