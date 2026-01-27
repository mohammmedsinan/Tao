import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs text-holo/70 uppercase tracking-wider mb-2 font-display"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full px-4 py-3 bg-void border border-neon-cyan/30 text-holo font-code',
                        'placeholder:text-holo/30',
                        'focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-sm',
                        'transition-all duration-200',
                        error && 'border-neon-magenta',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-neon-magenta font-code">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
