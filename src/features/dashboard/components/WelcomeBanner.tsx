/**
 * Dashboard Feature - Welcome Banner Component
 */

interface WelcomeBannerProps {
    projectName: string | undefined
}

export default function WelcomeBanner({ projectName }: WelcomeBannerProps) {
    return (
        <div className="mb-8">
            <h1 className="font-display text-2xl text-neon-cyan glow-cyan mb-2">
                WELCOME, DEVELOPER
            </h1>
            <p className="text-holo/60 font-code">
                Project: <span className="text-neon-yellow">{projectName}</span>
            </p>
        </div>
    )
}
