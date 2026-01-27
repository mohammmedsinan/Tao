/**
 * Talks Feature - Create Graph Modal
 */

import { useState } from 'react'
import { Modal, ModalFooter, Input } from '@/shared/components'

interface CreateGraphModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (name: string) => void
}

export default function CreateGraphModal({ open, onClose, onConfirm }: CreateGraphModalProps) {
    const [name, setName] = useState('')

    const handleConfirm = () => {
        if (name.trim()) {
            onConfirm(name.trim())
            setName('')
            onClose()
        }
    }

    const handleClose = () => {
        setName('')
        onClose()
    }

    return (
        <Modal open={open} onClose={handleClose} title="CREATE NEW GRAPH" variant="cyan">
            <Input
                label="Graph Name"
                placeholder="e.g., intro_dialogue"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            <ModalFooter
                onCancel={handleClose}
                onConfirm={handleConfirm}
                confirmText="CREATE"
                confirmVariant="cyan"
                confirmDisabled={!name.trim()}
            />
        </Modal>
    )
}
