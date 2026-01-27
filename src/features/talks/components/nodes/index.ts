/**
 * Talks Feature - Node Components Index
 */

export { default as TextNode } from './TextNode'
export { default as ChoiceNode } from './ChoiceNode'
export { default as SetVarNode } from './SetVarNode'
export { default as EventNode } from './EventNode'

import type { NodeTypes } from '@xyflow/react'
import TextNodeComponent from './TextNode'
import ChoiceNodeComponent from './ChoiceNode'
import SetVarNodeComponent from './SetVarNode'
import EventNodeComponent from './EventNode'

export const nodeTypes: NodeTypes = {
    text: TextNodeComponent,
    choice: ChoiceNodeComponent,
    set_var: SetVarNodeComponent,
    event: EventNodeComponent,
}
