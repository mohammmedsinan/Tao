import { useProjectStore } from '@/stores/projectStore'

interface HeaderProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
    const projectConfig = useProjectStore((state) => state.projectConfig)

    return (
        <header className="h-14 bg-grid border-b border-neon-cyan/20 flex items-center justify-between px-6 drag-region">
            {/* Left: Title */}
            <div className="flex items-center gap-4 drag-none">
                <div>
                    <h2 className="font-display text-sm text-neon-cyan tracking-wider">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs text-holo/50 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Center: Project Name */}
            <div className="absolute left-1/2 -translate-x-1/2 drag-none">
                {projectConfig && (
                    <div className="text-xs text-holo/50 font-code">
                        <span className="text-neon-yellow">●</span> {projectConfig.projectName}
                    </div>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 drag-none">
                {actions}
            </div>
        </header>
    )
}
