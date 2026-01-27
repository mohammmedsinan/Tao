import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'

interface SidebarProps {
    collapsed?: boolean
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
    const location = useLocation()
    const projectConfig = useProjectStore((state) => state.projectConfig)

    const navItems = [
        {
            path: '/dashboard',
            label: 'DASHBOARD',
            icon: '◈',
            color: 'text-neon-yellow'
        },
        {
            path: '/talks',
            label: 'TAO TALKS',
            icon: '💬',
            color: 'text-neon-cyan',
            description: 'Dialogue System'
        },
        {
            path: '/motions',
            label: 'TAO MOTIONS',
            icon: '🎬',
            color: 'text-neon-magenta',
            description: 'Animation Editor'
        },
    ]

    return (
        <aside
            className={`
        h-full bg-grid border-r border-neon-cyan/20 flex flex-col
        transition-all duration-300 ease-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
        >
            {/* Logo Section */}
            <div className="p-4 border-b border-neon-cyan/20">
                <Link to="/dashboard" className="block">
                    <h1
                        className={`
              font-display text-neon-cyan glow-cyan tracking-wider
              transition-all duration-300
              ${collapsed ? 'text-xl text-center' : 'text-2xl'}
            `}
                    >
                        {collapsed ? '道' : 'TAO'}
                    </h1>
                    {!collapsed && (
                        <p className="text-xs text-holo/50 mt-1 font-code">
                            The Way of Love2D
                        </p>
                    )}
                </Link>
            </div>

            {/* Project Info */}
            {!collapsed && projectConfig && (
                <div className="p-4 border-b border-neon-cyan/20">
                    <div className="text-xs text-holo/50 uppercase tracking-wider mb-1">
                        Project
                    </div>
                    <div className="text-sm text-holo truncate">
                        {projectConfig.projectName}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center gap-3 px-3 py-3 mb-1 rounded-none
                border border-transparent transition-all duration-200
                ${isActive
                                    ? `border-neon-cyan/50 bg-neon-cyan/10 ${item.color}`
                                    : 'text-holo/70 hover:text-holo hover:border-neon-cyan/30 hover:bg-neon-cyan/5'
                                }
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && (
                                <div>
                                    <div className={`font-display text-xs ${isActive ? item.color : ''}`}>
                                        {item.label}
                                    </div>
                                    {item.description && (
                                        <div className="text-[10px] text-holo/50 mt-0.5">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neon-cyan/20">
                <div className={`text-xs text-holo/30 ${collapsed ? 'text-center' : ''}`}>
                    {collapsed ? 'v1.0' : 'TAO Engine v1.0.0'}
                </div>
            </div>
        </aside>
    )
}
