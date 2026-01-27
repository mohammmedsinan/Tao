/**
 * Dashboard Feature - Project Config Panel
 * Shows project configuration details
 */

import type { TaoProjectConfig } from '@/core/types'
import { Panel } from '@/shared/components'

interface ProjectConfigPanelProps {
    config: TaoProjectConfig | null
    projectPath: string | null
}

export default function ProjectConfigPanel({ config, projectPath }: ProjectConfigPanelProps) {
    return (
        <Panel className="col-span-2">
            <h4 className="font-display text-xs text-holo/50 mb-4 tracking-wider">
                PROJECT CONFIGURATION
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-code">
                <div>
                    <span className="text-holo/50">Version:</span>
                    <span className="ml-2 text-neon-cyan">{config?.version}</span>
                </div>
                <div>
                    <span className="text-holo/50">Created:</span>
                    <span className="ml-2 text-holo">
                        {config?.created ? new Date(config.created).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
                <div>
                    <span className="text-holo/50">Default Language:</span>
                    <span className="ml-2 text-neon-yellow">
                        {config?.modules.talks.defaultLanguage.toUpperCase()}
                    </span>
                </div>
                <div>
                    <span className="text-holo/50">Assets Path:</span>
                    <span className="ml-2 text-holo">{config?.paths.assets}</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neon-cyan/20">
                <span className="text-holo/50 text-xs">Location:</span>
                <p className="text-xs text-holo/70 font-code mt-1 break-all">{projectPath}</p>
            </div>
        </Panel>
    )
}
