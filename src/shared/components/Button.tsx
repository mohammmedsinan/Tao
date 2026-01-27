import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'cyan' | 'magenta' | 'yellow' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'cyan', size = 'md', children, disabled, ...props }, ref) => {
        const baseStyles = `
      relative font-display uppercase tracking-wider
      border-2 transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
      active:scale-95
    `

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-[10px]',
            md: 'px-5 py-2.5 text-xs',
            lg: 'px-8 py-4 text-sm',
        }

        const variantStyles = {
            cyan: `
        border-neon-cyan text-neon-cyan bg-transparent
        hover:bg-neon-cyan hover:text-void hover:shadow-neon-cyan
      `,
            magenta: `
        border-neon-magenta text-neon-magenta bg-transparent
        hover:bg-neon-magenta hover:text-void hover:shadow-neon-magenta
      `,
            yellow: `
        border-neon-yellow text-neon-yellow bg-transparent
        hover:bg-neon-yellow hover:text-void hover:shadow-neon-yellow
      `,
            ghost: `
        border-holo/30 text-holo bg-transparent
        hover:border-holo hover:bg-holo/10
      `,
        }

        return (
            <button
                ref={ref}
                className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
