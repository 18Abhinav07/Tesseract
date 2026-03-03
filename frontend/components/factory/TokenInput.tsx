import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TokenInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    tokenSymbol?: string;
    tokenIcon?: React.ReactNode;
    onMax?: () => void;
    onTokenSelect?: () => void;
    onChange?: (val: string) => void;
    balance?: string;
}

export const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
    ({ className, label, tokenSymbol, tokenIcon, onMax, onTokenSelect, onChange, balance, ...props }, ref) => {

        // Allow only numeric input and decimals
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (val === '' || /^[0-9]*[.,]?[0-9]*$/.test(val)) {
                if (onChange) onChange(val.replace(',', '.'));
            }
        };

        return (
            <div className="flex flex-col gap-2 w-full rounded-2xl bg-black/20 p-4 border border-white/5 transition-colors focus-within:border-white/20 focus-within:bg-black/30">
                <div className="flex justify-between items-center text-sm text-muted">
                    <span>{label}</span>
                    {balance !== undefined && (
                        <div className="flex gap-2 items-center">
                            <span>Balance: {balance}</span>
                            {onMax && (
                                <button
                                    onClick={onMax}
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                    type="button"
                                >
                                    MAX
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center gap-4 mt-1">
                    <input
                        ref={ref}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        placeholder="0.0"
                        onChange={handleInputChange}
                        className={cn(
                            "flex w-full bg-transparent text-3xl font-medium outline-none placeholder:text-muted/50 disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        {...props}
                    />

                    <button
                        type="button"
                        onClick={onTokenSelect}
                        className="flex items-center gap-2 rounded-full bg-surface/50 hover:bg-surface border border-white/5 px-4 py-2 text-foreground font-semibold shadow-sm transition-all flex-shrink-0"
                    >
                        {tokenIcon && <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">{tokenIcon}</div>}
                        <span>{tokenSymbol || 'Select'}</span>
                        <svg className="w-4 h-4 text-muted mx-[-2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
)
TokenInput.displayName = 'TokenInput'
