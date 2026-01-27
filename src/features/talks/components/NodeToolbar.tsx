/**
 * Talks Feature - Node Toolbar Component
 * Toolbar for adding new nodes to the graph
 */

import { Button } from '@/shared/components'

type NodeType = 'text' | 'choice' | 'set_var' | 'event'

interface NodeToolbarProps {
    onAddNode: (type: NodeType) => void
    disabled?: boolean
}

export default function NodeToolbar({ onAddNode, disabled = false }: NodeToolbarProps) {
    const nodeTypes: { type: NodeType; label: string; color: string }[] = [
        { type: 'text', label: '+ TEXT', color: 'cyan' },
        { type: 'choice', label: '+ CHOICE', color: 'yellow' },
        { type: 'set_var', label: '+ SET VAR', color: 'magenta' },
        { type: 'event', label: '+ EVENT', color: 'cyan' },
    ]

    return (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            {nodeTypes.map(({ type, label, color }) => (
                <Button
                    key={type}
                    variant={color as 'cyan' | 'magenta' | 'yellow'}
                    size="sm"
                    onClick={() => onAddNode(type)}
                    disabled={disabled}
                >
                    {label}
                </Button>
            ))}
        </div>
    )
}
