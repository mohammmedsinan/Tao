/**
 * Welcome Feature - Recent Projects Component
 */

interface RecentProject {
    name: string
    path: string
}

interface RecentProjectsProps {
    projects: RecentProject[]
    onSelect: (path: string) => void
}

export default function RecentProjects({ projects, onSelect }: RecentProjectsProps) {
    if (projects.length === 0) return null

    return (
        <div className="mt-8">
            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                RECENT MISSIONS
            </h4>
            <div className="space-y-2">
                {projects.map((project) => (
                    <button
                        key={project.path}
                        onClick={() => onSelect(project.path)}
                        className="w-full text-left p-3 border border-neon-cyan/20 hover:border-neon-cyan/50 
                       hover:bg-neon-cyan/5 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-holo group-hover:text-neon-cyan transition-colors">
                                    {project.name}
                                </span>
                                <p className="text-xs text-holo/40 font-code mt-1 truncate max-w-md">
                                    {project.path}
                                </p>
                            </div>
                            <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
