import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface DonutSegment {
    label: string;
    value: number;
    colorClass: string; // e.g. "stroke-indigo-500"
}

export interface DonutChartProps {
    segments: DonutSegment[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
    centerSubValue?: string;
    centerValueClass?: string;
    emptyText?: string;
}

export function DonutChart({
    segments,
    size = 200,
    strokeWidth = 16,
    centerLabel,
    centerValue,
    centerSubValue,
    centerValueClass = "text-white",
    emptyText = "No data"
}: DonutChartProps) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    let currentOffset = 0;

    return (
        <div className="relative flex flex-col items-center gap-6 w-full">
            {/* SVG Container */}
            <div className="relative flex items-center justify-center p-2" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 origin-center drop-shadow-xl overflow-visible">
                    {/* Background Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        className="stroke-white/5"
                        strokeWidth={strokeWidth}
                    />

                    {/* Segments */}
                    {total > 0 ? segments.map((segment, i) => {
                        const proportion = segment.value / total;
                        const dashArray = proportion * circumference;
                        const dashOffset = currentOffset;
                        currentOffset += dashArray;

                        return (
                            <motion.circle
                                key={i}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="transparent"
                                className={cn(segment.colorClass, "transition-all duration-1000 ease-out")}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={-dashOffset}
                                strokeLinecap={proportion > 0.05 ? "round" : "butt"}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                animate={{ strokeDasharray: `${dashArray} ${circumference}` }}
                            />
                        );
                    }) : (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            className="stroke-white/5"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                        />
                    )}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center pointer-events-none p-4 mt-1">
                    {total > 0 ? (
                        <>
                            {centerLabel && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{centerLabel}</p>}
                            {centerValue && <p className={cn("text-3xl font-black tracking-tighter drop-shadow-md", centerValueClass)}>{centerValue}</p>}
                            {centerSubValue && <p className="text-xs font-medium text-slate-400 mt-1">{centerSubValue}</p>}
                        </>
                    ) : (
                        <p className="text-sm font-semibold text-slate-500">{emptyText}</p>
                    )}
                </div>
            </div>

            {/* Legend */}
            {total > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-w-xs mt-2">
                    {segments.map((segment, i) => {
                        if (segment.value <= 0 || segment.label.toLowerCase() === 'empty') return null;
                        const proportion = ((segment.value / total) * 100).toFixed(0);
                        const bgClass = segment.colorClass.replace('stroke-', 'bg-');
                        
                        return (
                            <div key={i} className="flex items-center gap-2">
                                <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", bgClass)} />
                                <span className="text-xs font-medium text-slate-300">
                                    {segment.label} <span className="text-slate-500 ml-0.5">({proportion}%)</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
