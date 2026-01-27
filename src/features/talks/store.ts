/**
 * Talks Feature - Store
 * Zustand store for dialogue/talks module state
 */

import { create } from 'zustand'
import type { TalksModuleData, DialogueGraph, DialogueNode, TalksState } from '@/core/types'
import { generateId } from '@/core/utils'

interface TalksActions {
    setData: (data: TalksModuleData) => void
    setActiveGraph: (graphId: string | null) => void
    selectNode: (nodeId: string | null) => void
    createGraph: (name: string) => void
    deleteGraph: (graphId: string) => void
    updateNodePosition: (graphId: string, nodeId: string, position: { x: number; y: number }) => void
    connectNodes: (graphId: string, sourceId: string, targetId: string) => void
    addNode: (graphId: string, node: DialogueNode) => void
    updateNode: (graphId: string, nodeId: string, updates: Partial<DialogueNode>) => void
    markClean: () => void
}

export const useTalksStore = create<TalksState & TalksActions>((set, get) => ({
    // State
    data: null,
    activeGraphId: null,
    selectedNodeId: null,
    isDirty: false,

    // Actions
    setData: (data) => set({ data }),

    setActiveGraph: (graphId) => set({ activeGraphId: graphId, selectedNodeId: null }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    createGraph: (name) => {
        const { data } = get()
        if (!data) return

        const id = generateId()
        const rootNodeId = generateId()

        const newGraph: DialogueGraph = {
            id,
            name,
            rootNodeId,
            nodes: {
                [rootNodeId]: {
                    id: rootNodeId,
                    type: 'text',
                    position: { x: 100, y: 100 },
                    speakerId: 'narrator',
                    locKey: `dialogue.${name.toLowerCase().replace(/\s+/g, '_')}.start`,
                    next: null,
                },
            },
        }

        set({
            data: {
                ...data,
                graphs: { ...data.graphs, [id]: newGraph },
            },
            activeGraphId: id,
            isDirty: true,
        })
    },

    deleteGraph: (graphId) => {
        const { data, activeGraphId } = get()
        if (!data) return

        const { [graphId]: _, ...remainingGraphs } = data.graphs

        set({
            data: { ...data, graphs: remainingGraphs },
            activeGraphId: activeGraphId === graphId ? null : activeGraphId,
            isDirty: true,
        })
    },

    updateNodePosition: (graphId, nodeId, position) => {
        const { data } = get()
        if (!data || !data.graphs[graphId]) return

        const graph = data.graphs[graphId]
        const node = graph.nodes[nodeId]
        if (!node) return

        set({
            data: {
                ...data,
                graphs: {
                    ...data.graphs,
                    [graphId]: {
                        ...graph,
                        nodes: {
                            ...graph.nodes,
                            [nodeId]: { ...node, position },
                        },
                    },
                },
            },
            isDirty: true,
        })
    },

    connectNodes: (graphId, sourceId, targetId) => {
        const { data } = get()
        if (!data || !data.graphs[graphId]) return

        const graph = data.graphs[graphId]
        const sourceNode = graph.nodes[sourceId]
        if (!sourceNode) return

        // Only update if node has a 'next' property
        if ('next' in sourceNode) {
            set({
                data: {
                    ...data,
                    graphs: {
                        ...data.graphs,
                        [graphId]: {
                            ...graph,
                            nodes: {
                                ...graph.nodes,
                                [sourceId]: { ...sourceNode, next: targetId } as DialogueNode,
                            },
                        },
                    },
                },
                isDirty: true,
            })
        }
    },

    addNode: (graphId, node) => {
        const { data } = get()
        if (!data || !data.graphs[graphId]) return

        const graph = data.graphs[graphId]

        set({
            data: {
                ...data,
                graphs: {
                    ...data.graphs,
                    [graphId]: {
                        ...graph,
                        nodes: { ...graph.nodes, [node.id]: node },
                    },
                },
            },
            isDirty: true,
        })
    },

    updateNode: (graphId, nodeId, updates) => {
        const { data } = get()
        if (!data || !data.graphs[graphId]) return

        const graph = data.graphs[graphId]
        const node = graph.nodes[nodeId]
        if (!node) return

        set({
            data: {
                ...data,
                graphs: {
                    ...data.graphs,
                    [graphId]: {
                        ...graph,
                        nodes: {
                            ...graph.nodes,
                            [nodeId]: { ...node, ...updates } as DialogueNode,
                        },
                    },
                },
            },
            isDirty: true,
        })
    },

    markClean: () => set({ isDirty: false }),
}))
