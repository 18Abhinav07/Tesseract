'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { ActionLogEntry, ActionLogLevel, appendActionLog, clearActionLog, readActionLog } from '../../lib/action-log';

type ActionLogInput = {
    level?: ActionLogLevel;
    action: string;
    detail: string;
    txHash?: string;
    market?: 'lending' | 'pas' | 'system';
};

type ActionLogContextValue = {
    entries: ActionLogEntry[];
    logAction: (input: ActionLogInput) => void;
    clearAll: () => void;
};

const ActionLogContext = React.createContext<ActionLogContextValue | null>(null);

export function ActionLogProvider({ children }: { children: React.ReactNode }) {
    const [entries, setEntries] = React.useState<ActionLogEntry[]>([]);

    React.useEffect(() => {
        setEntries(readActionLog());
    }, []);

    const logAction = React.useCallback((input: ActionLogInput) => {
        const level = input.level ?? 'info';
        const updated = appendActionLog({
            level,
            action: input.action,
            detail: input.detail,
            txHash: input.txHash,
            market: input.market,
        });
        setEntries(updated);

        const description = input.txHash
            ? `${input.detail} · tx ${input.txHash.slice(0, 10)}…`
            : input.detail;

        if (level === 'error') {
            toast.error(input.action, { description, duration: 5000 });
            return;
        }
        if (level === 'warning') {
            toast.warning(input.action, { description, duration: 3500 });
            return;
        }
        if (level === 'success') {
            toast.success(input.action, { description, duration: 3500 });
            return;
        }
        toast(input.action, { description, duration: 2500 });
    }, []);

    const clearAll = React.useCallback(() => {
        clearActionLog();
        setEntries([]);
    }, []);

    return (
        <ActionLogContext.Provider value={{ entries, logAction, clearAll }}>
            {children}
        </ActionLogContext.Provider>
    );
}

export function useActionLog() {
    const ctx = React.useContext(ActionLogContext);
    if (!ctx) {
        throw new Error('useActionLog must be used inside ActionLogProvider');
    }
    return ctx;
}
