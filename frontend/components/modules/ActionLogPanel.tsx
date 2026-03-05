'use client';

import * as React from 'react';
import config from '../../lib/addresses';
import { useActionLog } from '../providers/ActionLogProvider';

const levelStyle: Record<string, string> = {
    info: 'text-blue-300 border-blue-400/20 bg-blue-500/5',
    success: 'text-green-300 border-green-400/20 bg-green-500/5',
    warning: 'text-yellow-300 border-yellow-400/20 bg-yellow-500/5',
    error: 'text-red-300 border-red-400/20 bg-red-500/5',
};

export function ActionLogPanel() {
    const { entries, clearAll } = useActionLog();
    const [open, setOpen] = React.useState(false);

    return (
        <div className="fixed right-4 bottom-4 z-[70] w-[360px] max-w-[90vw]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                    <span className="text-sm font-semibold text-white">Action Log</span>
                    <span className="text-xs text-slate-400">{entries.length} cached</span>
                </button>

                {open && (
                    <>
                        <div className="px-4 pb-2 flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wider text-slate-500">Browser cache</span>
                            <button
                                onClick={clearAll}
                                className="text-xs text-slate-300 hover:text-white"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto px-3 pb-3 space-y-2">
                            {entries.length === 0 && (
                                <div className="text-xs text-slate-500 px-1 py-3">No actions logged yet.</div>
                            )}
                            {entries.map((entry) => (
                                <div key={entry.id} className={`rounded-xl border px-3 py-2 ${levelStyle[entry.level] ?? levelStyle.info}`}>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-semibold">{entry.action}</p>
                                        <span className="text-[10px] opacity-70">{new Date(entry.at).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[11px] opacity-85 mt-1">{entry.detail}</p>
                                    {entry.txHash && config.explorer && (
                                        <a
                                            className="text-[11px] underline mt-1 inline-block"
                                            href={`${config.explorer}/tx/${entry.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View tx ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
