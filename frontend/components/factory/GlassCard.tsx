import * as React from 'react'
import { cn } from '../../lib/utils'

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, variant = 'default', ...props }, ref) => {

        const variants = {
            default: 'bg-glass-bg border-glass-border shadow-xl backdrop-blur-2xl',
            elevated: 'bg-glass-bg border-glass-border shadow-2xl shadow-primary/5 backdrop-blur-3xl ring-1 ring-white/5',
            subtle: 'bg-surface/30 border-glass-border border-opacity-50 backdrop-blur-md'
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-3xl border overflow-hidden transition-all duration-300",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
GlassCard.displayName = 'GlassCard'
