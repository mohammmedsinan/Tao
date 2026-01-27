/**
 * Dashboard Feature - Module Card Component
 * Card for navigating to a module (Talks, Motions, etc.)
 */

import { Link } from 'react-router-dom'
import { Panel } from '@/shared/components'

interface ModuleCardProps {
    to: string
    icon: string
    title: string
    description: string
    features: string[]
    variant: 'cyan' | 'magenta'
}

export default function ModuleCard({
    to,
    icon,
    title,
    description,
    features,
    variant,
}: ModuleCardProps) {
    const colorClasses = {
        cyan: {
            title: 'text-neon-cyan group-hover:glow-cyan',
            link: 'text-neon-cyan',
            panel: 'hover:border-neon-cyan',
        },
        magenta: {
            title: 'text-neon-magenta group-hover:glow-magenta',
            link: 'text-neon-magenta',
            panel: 'hover:border-neon-magenta border-neon-magenta/30',
        },
    }

    const colors = colorClasses[variant]

    return (
        <Link to={to} className="block group">
            <Panel variant={variant} className={`h-full ${colors.panel} transition-all`}>
                <div className="flex items-start gap-4">
                    <div className="text-5xl">{icon}</div>
                    <div className="flex-1">
                        <h3 className={`font-display text-lg ${colors.title} transition-all`}>
                            {title}
                        </h3>
                        <p className="text-sm text-holo/60 mt-2">
                            {description}
                        </p>
                        <ul className="text-xs text-holo/40 mt-4 space-y-1 font-code">
                            {features.map((feature, i) => (
                                <li key={i}>• {feature}</li>
                            ))}
                        </ul>
                        <div className={`mt-4 ${colors.link} text-xs font-display opacity-0 group-hover:opacity-100 transition-opacity`}>
                            LAUNCH MODULE →
                        </div>
                    </div>
                </div>
            </Panel>
        </Link>
    )
}
