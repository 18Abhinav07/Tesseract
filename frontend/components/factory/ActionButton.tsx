import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface ActionButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    isLoading?: boolean;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ className, isLoading, disabled, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                disabled={disabled || isLoading}
                className={cn(
                    "relative flex h-14 w-full items-center justify-center rounded-2xl font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50 disabled:text-black/50",
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center space-x-1.5 absolute inset-0">
                        <motion.div
                            className="h-2 w-2 rounded-full bg-black/60"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                            className="h-2 w-2 rounded-full bg-black/60"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="h-2 w-2 rounded-full bg-black/60"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                    </div>
                ) : null}
                <span className={cn(isLoading ? 'opacity-0' : 'opacity-100', 'transition-opacity')}>
                    {children as React.ReactNode}
                </span>
            </motion.button>
        )
    }
)
ActionButton.displayName = 'ActionButton'
