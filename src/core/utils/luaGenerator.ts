/**
 * Lua Table Generator
 * Converts TypeScript objects to valid Lua table syntax
 */

export function toLuaValue(value: unknown, indent = 0): string {
    const spaces = '    '.repeat(indent)
    const innerSpaces = '    '.repeat(indent + 1)

    if (value === null || value === undefined) {
        return 'nil'
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false'
    }

    if (typeof value === 'number') {
        return String(value)
    }

    if (typeof value === 'string') {
        // Escape special characters and wrap in quotes
        const escaped = value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
        return `"${escaped}"`
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return '{}'

        const items = value.map((item, index) => {
            const luaValue = toLuaValue(item, indent + 1)
            return `${innerSpaces}[${index + 1}] = ${luaValue}`
        })

        return `{\n${items.join(',\n')}\n${spaces}}`
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
        if (entries.length === 0) return '{}'

        const items = entries.map(([key, val]) => {
            const luaKey = isValidLuaIdentifier(key) ? key : `["${key}"]`
            const luaValue = toLuaValue(val, indent + 1)
            return `${innerSpaces}${luaKey} = ${luaValue}`
        })

        return `{\n${items.join(',\n')}\n${spaces}}`
    }

    return 'nil'
}

function isValidLuaIdentifier(str: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)
}

/**
 * Generate a complete character Lua file
 */
export function generateCharacterLua(
    characterId: string,
    characterName: string,
    talksData?: object,
    motionsData?: object
): string {
    const timestamp = new Date().toISOString()

    let lua = `--[[\n`
    lua += `    TAO GENERATED FILE - DO NOT EDIT MANUALLY\n`
    lua += `    Character: ${characterName}\n`
    lua += `    Timestamp: ${timestamp}\n`
    lua += `]]\n\n`

    lua += `local character = {}\n\n`

    lua += `character.identity = {\n`
    lua += `    id = "${characterId}",\n`
    lua += `    name = "${characterName}"\n`
    lua += `}\n\n`

    if (talksData) {
        lua += `-- MODULE: TAO TALKS\n`
        lua += `character.talks = ${toLuaValue(talksData, 0)}\n\n`
    }

    if (motionsData) {
        lua += `-- MODULE: TAO MOTIONS\n`
        lua += `character.motions = ${toLuaValue(motionsData, 0)}\n\n`
    }

    lua += `return character\n`

    return lua
}

/**
 * Generate localization Lua file
 */
export function generateLocalizationLua(
    language: string,
    strings: Record<string, string>
): string {
    const timestamp = new Date().toISOString()

    let lua = `--[[\n`
    lua += `    TAO GENERATED LOCALIZATION - DO NOT EDIT MANUALLY\n`
    lua += `    Language: ${language.toUpperCase()}\n`
    lua += `    Timestamp: ${timestamp}\n`
    lua += `]]\n\n`

    lua += `local strings = ${toLuaValue(strings, 0)}\n\n`
    lua += `return strings\n`

    return lua
}

// Helper for nil handling  
const nil = null

/**
 * Export dialogue graph to Lua-compatible format
 */
export function exportDialogueGraph(graph: {
    id: string
    name: string
    rootNodeId: string
    nodes: Record<string, unknown>
}): object {
    const exportedNodes: Record<string, object> = {}

    for (const [nodeId, node] of Object.entries(graph.nodes)) {
        const n = node as {
            type: string
            speakerId?: string
            emotion?: string
            locKey?: string
            next?: string | null
            textKey?: string
            options?: { labelKey: string; targetNodeId: string; condition?: string }[]
            variable?: string
            value?: unknown
            eventName?: string
        }

        if (n.type === 'text') {
            exportedNodes[nodeId] = {
                type: 'text',
                text: n.locKey,
                spk: n.speakerId,
                mood: n.emotion || 'neutral',
                next: n.next || nil,
            }
        } else if (n.type === 'choice') {
            exportedNodes[nodeId] = {
                type: 'choice',
                opts: n.options?.map(opt => ({
                    txt: opt.labelKey,
                    next: opt.targetNodeId,
                    cond: opt.condition,
                })) || [],
            }
        } else if (n.type === 'set_var') {
            exportedNodes[nodeId] = {
                type: 'set_var',
                var: n.variable,
                val: n.value,
                next: n.next,
            }
        } else if (n.type === 'event') {
            exportedNodes[nodeId] = {
                type: 'event',
                name: n.eventName,
                next: n.next,
            }
        }
    }

    return {
        start: graph.rootNodeId,
        nodes: exportedNodes,
    }
}

/**
 * Export animation data to Lua-compatible format
 */
export function exportAnimationData(data: {
    sourceImage: string
    grid: { w: number; h: number }
    animations: Record<string, {
        name: string
        fps: number
        loop: boolean
        frames: {
            index: number
            origin: { x: number; y: number }
            bodyBox?: { rect: { x: number; y: number; w: number; h: number }; isSensor: boolean }
            hitBox?: { x: number; y: number; w: number; h: number }
            hurtBox?: { x: number; y: number; w: number; h: number }
        }[]
    }>
}): object {
    const anims: Record<string, object> = {}

    for (const [name, anim] of Object.entries(data.animations)) {
        anims[name] = {
            fps: anim.fps,
            loop: anim.loop,
            frames: anim.frames.map((frame) => ({
                idx: frame.index + 1, // Lua is 1-indexed
                ox: frame.origin.x,
                oy: frame.origin.y,
                body: frame.bodyBox ? {
                    x: frame.bodyBox.rect.x,
                    y: frame.bodyBox.rect.y,
                    w: frame.bodyBox.rect.w,
                    h: frame.bodyBox.rect.h,
                    sensor: frame.bodyBox.isSensor,
                } : undefined,
                hit: frame.hitBox,
                hurt: frame.hurtBox,
            })),
        }
    }

    return {
        sheet: data.sourceImage,
        w: data.grid.w,
        h: data.grid.h,
        anims,
    }
}
