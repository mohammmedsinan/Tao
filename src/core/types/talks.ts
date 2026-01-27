/**
 * Dialogue/Talks module type definitions
 */

// Base node structure
export interface BaseNode {
    id: string
    type: 'text' | 'choice' | 'set_var' | 'event'
    position: { x: number; y: number }
}

// Text node - displays dialogue
export interface NodeText extends BaseNode {
    type: 'text'
    speakerId: string
    emotion?: string
    locKey: string
    next: string | null
}

// Choice node - player options
export interface NodeChoice extends BaseNode {
    type: 'choice'
    textKey: string
    options: {
        labelKey: string
        targetNodeId: string
        condition?: string
    }[]
}

// Variable node - set game state
export interface NodeSetVar extends BaseNode {
    type: 'set_var'
    variable: string
    value: unknown
    next: string | null
}

// Event node - trigger game event
export interface NodeEvent extends BaseNode {
    type: 'event'
    eventName: string
    next: string | null
}

// Union type for all nodes
export type DialogueNode = NodeText | NodeChoice | NodeSetVar | NodeEvent

// Dialogue graph structure
export interface DialogueGraph {
    id: string
    name: string
    rootNodeId: string
    nodes: Record<string, DialogueNode>
}

// Module data structure
export interface TalksModuleData {
    variables: Record<string, unknown>
    graphs: Record<string, DialogueGraph>
}

// Store state
export interface TalksState {
    data: TalksModuleData | null
    activeGraphId: string | null
    selectedNodeId: string | null
    isDirty: boolean
}
