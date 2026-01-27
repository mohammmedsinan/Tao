/**
 * Talks Feature - Main Page Component
 * Thin orchestrator that composes feature components
 */

import { useEffect, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useProjectStore } from '@/stores/projectStore'
import { Sidebar, Header } from '@/shared/layouts'
import { Button, Toast } from '@/shared/components'

import { useTalksStore } from './store'
import { useTalksEditor, useTalksSave } from './hooks'
import {
    GraphList,
    NodeToolbar,
    NodeInspector,
    CreateGraphModal,
    EmptyState,
    nodeTypes,
} from './components'

export default function TalksPage() {
    const { projectPath } = useProjectStore()
    const { data, isDirty, setData, createGraph, markClean } = useTalksStore()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [saving, setSaving] = useState(false)

    const {
        nodes,
        edges,
        currentGraph,
        selectedNode,
        activeGraphId,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onAddNode,
        setActiveGraph,
    } = useTalksEditor()

    const { toast, saveAndExport } = useTalksSave({
        projectPath,
        data,
        onSaveComplete: markClean,
    })

    // Initialize with empty data if needed
    useEffect(() => {
        if (!data) {
            setData({ variables: {}, graphs: {} })
        }
    }, [data, setData])

    const handleSave = async () => {
        setSaving(true)
        await saveAndExport()
        setSaving(false)
    }

    const handleCreateGraph = (name: string) => {
        createGraph(name)
    }

    const graphList = data ? Object.values(data.graphs) : []

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="TAO TALKS"
                    subtitle="Dialogue System"
                    actions={
                        <div className="flex items-center gap-3">
                            <Toast toast={toast} />
                            {isDirty && (
                                <span className="text-neon-yellow text-xs font-code animate-pulse">
                                    ● UNSAVED
                                </span>
                            )}
                            <Button
                                variant="cyan"
                                size="sm"
                                onClick={handleSave}
                                disabled={saving || !data || Object.keys(data.graphs).length === 0}
                            >
                                {saving ? 'WRITING...' : 'WRITE TO MEMORY'}
                            </Button>
                        </div>
                    }
                />

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Graph List */}
                    <GraphList
                        graphs={graphList}
                        activeGraphId={activeGraphId}
                        onSelectGraph={setActiveGraph}
                        onCreateGraph={() => setShowCreateModal(true)}
                    />

                    {/* Main Editor Area */}
                    {!activeGraphId || !currentGraph ? (
                        <EmptyState onCreateGraph={() => setShowCreateModal(true)} />
                    ) : (
                        <div className="flex-1 relative">
                            <NodeToolbar onAddNode={onAddNode} disabled={!activeGraphId} />

                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onNodeClick={onNodeClick}
                                nodeTypes={nodeTypes}
                                fitView
                                className="bg-void"
                            >
                                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e1e3f" />
                                <Controls className="!bg-grid !border-neon-cyan/30" />
                                <MiniMap
                                    className="!bg-grid !border-neon-cyan/30"
                                    nodeColor="#00F0FF"
                                    maskColor="rgba(10, 10, 26, 0.8)"
                                />
                            </ReactFlow>
                        </div>
                    )}

                    {/* Right Sidebar - Node Inspector */}
                    {activeGraphId && selectedNode && (
                        <NodeInspector node={selectedNode} />
                    )}
                </div>
            </div>

            {/* Create Graph Modal */}
            <CreateGraphModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onConfirm={handleCreateGraph}
            />
        </div>
    )
}
