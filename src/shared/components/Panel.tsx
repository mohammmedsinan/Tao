import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    className?: string
    variant?: 'cyan' | 'magenta' | 'default'
    glow?: boolean
}

export default function Panel({ children, className, variant = 'default', glow = false, ...props }: PanelProps) {
    const borderColor = {
        default: 'border-neon-cyan/30',
        cyan: 'border-neon-cyan',
        magenta: 'border-neon-magenta',
    }

    const glowStyle = {
        default: '',
        cyan: glow ? 'shadow-neon-cyan-sm' : '',
        magenta: glow ? 'shadow-neon-magenta-sm' : '',
    }

    return (
        <div
            className={clsx(
                'relative bg-grid border p-4',
                borderColor[variant],
                glowStyle[variant],
                'hud-panel hud-panel-bottom',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
