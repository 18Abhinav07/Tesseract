import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, isLoading, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {

        // Smooth transitions + standardized radii
        const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

        const variants = {
            primary: 'bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 focus:ring-primary',
            secondary: 'bg-surface text-foreground border border-glass-border hover:bg-glass-bg focus:ring-secondary',
            danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:ring-red-500',
            ghost: 'bg-transparent text-foreground hover:bg-surface focus:ring-secondary'
        }

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg'
        }

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'
