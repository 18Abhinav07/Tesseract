import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-medium text-foreground ml-1">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <div className="absolute left-4 text-muted flex items-center pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-14 w-full rounded-2xl border bg-surface/50 px-4 py-2 text-base shadow-sm transition-colors",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error ? "border-red-500 focus-visible:ring-red-500/50" : "border-glass-border hover:border-muted/30 focus-visible:border-primary",
                            leftIcon && "pl-11",
                            rightIcon && "pr-11",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-4 text-muted flex items-center">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'
