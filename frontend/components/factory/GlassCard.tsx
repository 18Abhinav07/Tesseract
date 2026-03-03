import * as React from 'react'
import { cn } from '../../lib/utils'

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, variant = 'default', ...props }, ref) => {

        const variants = {
            default: 'bg-white/5 border-[rgba(255,255,255,0.1)] shadow-2xl backdrop-blur-xl',
            elevated: 'bg-white/10 border-[rgba(255,255,255,0.2)] shadow-2xl shadow-primary/5 backdrop-blur-3xl ring-1 ring-white/5',
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
