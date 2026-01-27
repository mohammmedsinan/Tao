import { create } from 'zustand'

// ============================================
// Type Definitions (From TAO_DATA_SCHEMA.md)
// ============================================

export type UUID = string
export type LuaCode = string

export interface Vector2 {
    x: number
    y: number
}

// Node Types
export type FlowNodeType = 'text' | 'choice' | 'set_var' | 'event'

export interface BaseNode {
    id: UUID
    type: FlowNodeType
    editor: {
        position: Vector2
        color?: string
        notes?: string
    }
}

export interface NodeText extends BaseNode {
    type: 'text'
    speakerId: string
    emotion?: string
    locKey: string
    next: UUID | null
}

export interface NodeChoice extends BaseNode {
    type: 'choice'
    textKey: string
    options: {
        labelKey: string
        targetNodeId: UUID
        condition?: LuaCode
    }[]
}

export interface NodeSetVar extends BaseNode {
    type: 'set_var'
    variable: string
    value: string | number | boolean
    next: UUID
}

export interface NodeEvent extends BaseNode {
    type: 'event'
    eventName: string
    eventData?: Record<string, unknown>
    next: UUID | null
}

export type FlowNode = NodeText | NodeChoice | NodeSetVar | NodeEvent

export interface DialogueGraph {
    id: UUID
    name: string
    rootNodeId: UUID
    nodes: Record<UUID, FlowNode>
}

export interface TalksModuleData {
    variables: Record<string, unknown>
    graphs: Record<UUID, DialogueGraph>
}

// ============================================
// Store State
// ============================================

interface TalksState {
    // Current module data
    data: TalksModuleData | null

    // Currently active graph
    activeGraphId: UUID | null

    // Currently selected node
    selectedNodeId: UUID | null

    // Dirty state (unsaved changes)
    isDirty: boolean

    // Actions
    setData: (data: TalksModuleData) => void
    setActiveGraph: (graphId: UUID | null) => void
    selectNode: (nodeId: UUID | null) => void

    // Graph operations
    createGraph: (name: string) => UUID
    deleteGraph: (graphId: UUID) => void
    renameGraph: (graphId: UUID, name: string) => void

    // Node operations
    addNode: (graphId: UUID, node: FlowNode) => void
    updateNode: (graphId: UUID, nodeId: UUID, updates: Partial<FlowNode>) => void
    deleteNode: (graphId: UUID, nodeId: UUID) => void
    updateNodePosition: (graphId: UUID, nodeId: UUID, position: Vector2) => void

    // Connection operations
    connectNodes: (graphId: UUID, sourceId: UUID, targetId: UUID, choiceIndex?: number) => void

    // Reset
    reset: () => void
    markClean: () => void
}

const generateUUID = (): UUID => crypto.randomUUID()

const initialData: TalksModuleData = {
    variables: {},
    graphs: {}
}

export const useTalksStore = create<TalksState>((set) => ({
    data: null,
    activeGraphId: null,
    selectedNodeId: null,
    isDirty: false,

    setData: (data) => set({ data, isDirty: false }),

    setActiveGraph: (graphId) => set({ activeGraphId: graphId, selectedNodeId: null }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    createGraph: (name) => {
        const id = generateUUID()
        const rootNodeId = generateUUID()

        const rootNode: NodeText = {
            id: rootNodeId,
            type: 'text',
            speakerId: 'narrator',
            locKey: `dialogue.${name.toLowerCase().replace(/\s+/g, '_')}.start`,
            next: null,
            editor: {
                position: { x: 250, y: 100 }
            }
        }

        const newGraph: DialogueGraph = {
            id,
            name,
            rootNodeId,
            nodes: { [rootNodeId]: rootNode }
        }

        set((state) => ({
            data: {
                ...state.data ?? initialData,
                graphs: {
                    ...(state.data?.graphs ?? {}),
                    [id]: newGraph
                }
            },
            activeGraphId: id,
            isDirty: true
        }))

        return id
    },

    deleteGraph: (graphId) => {
        set((state) => {
            if (!state.data) return state

            const { [graphId]: _, ...remainingGraphs } = state.data.graphs
            return {
                data: { ...state.data, graphs: remainingGraphs },
                activeGraphId: state.activeGraphId === graphId ? null : state.activeGraphId,
                isDirty: true
            }
        })
    },

    renameGraph: (graphId, name) => {
        set((state) => {
            if (!state.data?.graphs[graphId]) return state

            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: { ...state.data.graphs[graphId], name }
                    }
                },
                isDirty: true
            }
        })
    },

    addNode: (graphId, node) => {
        set((state) => {
            if (!state.data?.graphs[graphId]) return state

            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: {
                            ...state.data.graphs[graphId],
                            nodes: {
                                ...state.data.graphs[graphId].nodes,
                                [node.id]: node
                            }
                        }
                    }
                },
                isDirty: true
            }
        })
    },

    updateNode: (graphId, nodeId, updates) => {
        set((state) => {
            if (!state.data?.graphs[graphId]?.nodes[nodeId]) return state

            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: {
                            ...state.data.graphs[graphId],
                            nodes: {
                                ...state.data.graphs[graphId].nodes,
                                [nodeId]: { ...state.data.graphs[graphId].nodes[nodeId], ...updates } as FlowNode
                            }
                        }
                    }
                },
                isDirty: true
            }
        })
    },

    deleteNode: (graphId, nodeId) => {
        set((state) => {
            if (!state.data?.graphs[graphId]) return state

            const { [nodeId]: _, ...remainingNodes } = state.data.graphs[graphId].nodes

            // Also clean up any references to this node
            const cleanedNodes = Object.fromEntries(
                Object.entries(remainingNodes).map(([id, node]) => {
                    if (node.type === 'text' || node.type === 'event') {
                        if (node.next === nodeId) {
                            return [id, { ...node, next: null }]
                        }
                    } else if (node.type === 'choice') {
                        return [id, {
                            ...node,
                            options: node.options.filter(opt => opt.targetNodeId !== nodeId)
                        }]
                    } else if (node.type === 'set_var') {
                        if (node.next === nodeId) {
                            return [id, { ...node, next: null as unknown as UUID }]
                        }
                    }
                    return [id, node]
                })
            )

            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: {
                            ...state.data.graphs[graphId],
                            nodes: cleanedNodes
                        }
                    }
                },
                selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
                isDirty: true
            }
        })
    },

    updateNodePosition: (graphId, nodeId, position) => {
        set((state) => {
            if (!state.data?.graphs[graphId]?.nodes[nodeId]) return state

            const node = state.data.graphs[graphId].nodes[nodeId]
            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: {
                            ...state.data.graphs[graphId],
                            nodes: {
                                ...state.data.graphs[graphId].nodes,
                                [nodeId]: {
                                    ...node,
                                    editor: { ...node.editor, position }
                                }
                            }
                        }
                    }
                },
                isDirty: true
            }
        })
    },

    connectNodes: (graphId, sourceId, targetId, choiceIndex) => {
        set((state) => {
            if (!state.data?.graphs[graphId]) return state

            const sourceNode = state.data.graphs[graphId].nodes[sourceId]
            if (!sourceNode) return state

            let updatedNode: FlowNode

            if (sourceNode.type === 'choice' && choiceIndex !== undefined) {
                const options = [...sourceNode.options]
                if (options[choiceIndex]) {
                    options[choiceIndex] = { ...options[choiceIndex], targetNodeId: targetId }
                }
                updatedNode = { ...sourceNode, options }
            } else if (sourceNode.type === 'text' || sourceNode.type === 'event') {
                updatedNode = { ...sourceNode, next: targetId }
            } else if (sourceNode.type === 'set_var') {
                updatedNode = { ...sourceNode, next: targetId }
            } else {
                return state
            }

            return {
                data: {
                    ...state.data,
                    graphs: {
                        ...state.data.graphs,
                        [graphId]: {
                            ...state.data.graphs[graphId],
                            nodes: {
                                ...state.data.graphs[graphId].nodes,
                                [sourceId]: updatedNode
                            }
                        }
                    }
                },
                isDirty: true
            }
        })
    },

    reset: () => set({ data: null, activeGraphId: null, selectedNodeId: null, isDirty: false }),

    markClean: () => set({ isDirty: false })
}))
