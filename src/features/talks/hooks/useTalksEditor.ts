/**
 * Talks Feature - useTalksEditor Hook
 * Manages React Flow editor state and synchronization with store
 */

import { useCallback, useEffect, useMemo } from 'react'
import { useNodesState, useEdgesState, addEdge, type Node, type Edge, type Connection } from '@xyflow/react'
import { useTalksStore } from '../store'
import type { DialogueNode, NodeText, NodeChoice, NodeSetVar, NodeEvent } from '@/core/types'
import { generateId } from '@/core/utils'

export function useTalksEditor() {
    const {
        data,
        activeGraphId,
        selectedNodeId,
        setActiveGraph,
        selectNode,
        updateNodePosition,
        connectNodes,
        addNode,
    } = useTalksStore()

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    // Get current graph
    const currentGraph = useMemo(() => {
        if (!data || !activeGraphId) return null
        return data.graphs[activeGraphId] ?? null
    }, [data, activeGraphId])

    // Get selected node data
    const selectedNode = useMemo(() => {
        if (!currentGraph || !selectedNodeId) return null
        return currentGraph.nodes[selectedNodeId] ?? null
    }, [currentGraph, selectedNodeId])

    // Sync store data to React Flow format
    useEffect(() => {
        if (!currentGraph) {
            setNodes([])
            setEdges([])
            return
        }

        // Convert store nodes to React Flow nodes
        const flowNodes: Node[] = Object.values(currentGraph.nodes).map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: { ...node, label: node.id },
            selected: node.id === selectedNodeId,
        }))

        // Generate edges from node connections
        const flowEdges: Edge[] = []
        Object.values(currentGraph.nodes).forEach((node) => {
            if ('next' in node && node.next) {
                flowEdges.push({
                    id: `${node.id}-${node.next}`,
                    source: node.id,
                    target: node.next,
                    type: 'smoothstep',
                    style: { stroke: '#00F0FF', strokeWidth: 2 },
                })
            }
            if (node.type === 'choice' && 'options' in node) {
                node.options.forEach((opt, idx) => {
                    if (opt.targetNodeId) {
                        flowEdges.push({
                            id: `${node.id}-choice-${idx}`,
                            source: node.id,
                            target: opt.targetNodeId,
                            type: 'smoothstep',
                            style: { stroke: '#FFFF00', strokeWidth: 2 },
                        })
                    }
                })
            }
        })

        setNodes(flowNodes)
        setEdges(flowEdges)
    }, [currentGraph, selectedNodeId, setNodes, setEdges])

    // Handle node position changes
    const handleNodesChange = useCallback(
        (changes: Parameters<typeof onNodesChange>[0]) => {
            onNodesChange(changes)

            if (!activeGraphId) return

            changes.forEach((change) => {
                if (change.type === 'position' && change.position && change.id) {
                    updateNodePosition(activeGraphId, change.id, change.position)
                }
            })
        },
        [activeGraphId, onNodesChange, updateNodePosition]
    )

    // Handle edge connections
    const handleConnect = useCallback(
        (connection: Connection) => {
            if (!activeGraphId || !connection.source || !connection.target) return

            setEdges((eds) => addEdge(connection, eds))
            connectNodes(activeGraphId, connection.source, connection.target)
        },
        [activeGraphId, setEdges, connectNodes]
    )

    // Handle node clicks
    const handleNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            selectNode(node.id)
        },
        [selectNode]
    )

    // Add new node
    const handleAddNode = useCallback(
        (type: 'text' | 'choice' | 'set_var' | 'event') => {
            if (!activeGraphId) return

            const id = generateId()
            const baseNode = {
                id,
                type,
                position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
            }

            let node: DialogueNode

            switch (type) {
                case 'text':
                    node = {
                        ...baseNode,
                        type: 'text',
                        speakerId: 'narrator',
                        locKey: 'dialogue.new',
                        next: null,
                    } as NodeText
                    break
                case 'choice':
                    node = {
                        ...baseNode,
                        type: 'choice',
                        textKey: 'dialogue.prompt',
                        options: [],
                    } as NodeChoice
                    break
                case 'set_var':
                    node = {
                        ...baseNode,
                        type: 'set_var',
                        variable: 'new_var',
                        value: true,
                        next: null,
                    } as NodeSetVar
                    break
                case 'event':
                    node = {
                        ...baseNode,
                        type: 'event',
                        eventName: 'new_event',
                        next: null,
                    } as NodeEvent
                    break
            }

            addNode(activeGraphId, node)
        },
        [activeGraphId, addNode]
    )

    return {
        nodes,
        edges,
        currentGraph,
        selectedNode,
        activeGraphId,
        onNodesChange: handleNodesChange,
        onEdgesChange,
        onConnect: handleConnect,
        onNodeClick: handleNodeClick,
        onAddNode: handleAddNode,
        setActiveGraph,
    }
}
