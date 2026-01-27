/**
 * Motions Feature - Create Animation Modal
 */

import { useState } from 'react'
import { Modal, ModalFooter, Input } from '@/shared/components'

interface CreateAnimationModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (name: string) => void
}

export default function CreateAnimationModal({ open, onClose, onConfirm }: CreateAnimationModalProps) {
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
        <Modal open={open} onClose={handleClose} title="CREATE NEW ANIMATION" variant="magenta">
            <Input
                label="Animation Name"
                placeholder="e.g., idle, run, attack"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            <ModalFooter
                onCancel={handleClose}
                onConfirm={handleConfirm}
                confirmText="CREATE"
                confirmVariant="magenta"
                confirmDisabled={!name.trim()}
            />
        </Modal>
    )
}
