/**
 * Dashboard Feature - Coming Soon Section
 * Teaser for future modules
 */

interface ComingSoonProps {
    modules?: string[]
}

const DEFAULT_MODULES = ['TAO SOUNDS', 'TAO MAPS', 'TAO CONFIGS']

export default function ComingSoon({ modules = DEFAULT_MODULES }: ComingSoonProps) {
    return (
        <div className="mt-8">
            <h4 className="font-display text-xs text-holo/30 mb-4 tracking-wider">
                COMING SOON
            </h4>
            <div className="grid grid-cols-3 gap-4">
                {modules.map((name) => (
                    <div
                        key={name}
                        className="p-4 border border-holo/10 bg-void/50 text-center opacity-50 cursor-not-allowed"
                    >
                        <div className="text-2xl mb-2">🔒</div>
                        <span className="font-display text-xs text-holo/30">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
