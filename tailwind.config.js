/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Night City Neon Palette
                'void': '#120E24',        // Main Background
                'grid': '#1B1638',        // Secondary Background (panels, sidebars)
                'neon-cyan': '#00F0FF',   // Primary Accent (Tao Talks, links)
                'neon-magenta': '#FF00D4', // Secondary Accent (Tao Motions, active states)
                'neon-yellow': '#FFE600', // Highlights (cursors, warnings)
                'holo': '#E0F7FA',        // Main Text (blue-tinted for CRT feel)
            },
            fontFamily: {
                'display': ['"Press Start 2P"', 'monospace'],
                'code': ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
            },
            boxShadow: {
                'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF',
                'neon-magenta': '0 0 10px #FF00D4, 0 0 20px #FF00D4',
                'neon-yellow': '0 0 10px #FFE600, 0 0 20px #FFE600',
                'neon-cyan-sm': '0 0 5px #00F0FF, 0 0 10px #00F0FF',
                'neon-magenta-sm': '0 0 5px #FF00D4, 0 0 10px #FF00D4',
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'scanline': 'scanline 8s linear infinite',
                'flicker': 'flicker 0.15s infinite',
                'boot-text': 'boot-text 0.5s steps(20) forwards',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                'scanline': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'flicker': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.95' },
                },
                'boot-text': {
                    'from': { width: '0' },
                    'to': { width: '100%' },
                },
            },
            backgroundImage: {
                'grid-pattern': `linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)`,
            },
            backgroundSize: {
                'grid': '20px 20px',
            },
        },
    },
    plugins: [],
}
