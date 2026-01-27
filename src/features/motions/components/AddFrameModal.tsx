/**
 * Motions Feature - Add Frame Modal
 */

import { useState } from 'react'
import { Modal, ModalFooter, Input } from '@/shared/components'

interface AddFrameModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (spriteIndex: number) => void
}

export default function AddFrameModal({ open, onClose, onConfirm }: AddFrameModalProps) {
    const [index, setIndex] = useState('0')

    const handleConfirm = () => {
        const idx = parseInt(index) || 0
        onConfirm(idx)
        setIndex('0')
        onClose()
    }

    const handleClose = () => {
        setIndex('0')
        onClose()
    }

    return (
        <Modal open={open} onClose={handleClose} title="ADD FRAME" variant="magenta">
            <Input
                label="Sprite Index (0-based)"
                placeholder="0"
                type="number"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            <ModalFooter
                onCancel={handleClose}
                onConfirm={handleConfirm}
                confirmText="ADD"
                confirmVariant="magenta"
            />
        </Modal>
    )
}
