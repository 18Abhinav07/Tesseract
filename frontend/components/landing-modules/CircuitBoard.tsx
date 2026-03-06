'use client';

import { T } from './tokens';

export default function CircuitBoard() {
    const CX = 450, CY = 262;
    const NW = 138, NH = 52;
    const EX = 6, EY = 7;
    const CHIP_W = 120, CHIP_H = 78;

    const nodes = [
        { id: 'people-chain', label: 'People Chain',  sub: 'Polkadot',      color: T.cyan,    x: 18,  y: 58  },
        { id: 'paseo-relay',  label: 'Paseo Relay',   sub: 'Governance',    color: '#A78BFA', x: 381, y: 22  },
        { id: 'asset-hub',    label: 'Asset Hub EVM', sub: 'Layer 1',       color: '#9333EA', x: 744, y: 58  },
        { id: 'kreditagent',  label: 'KreditAgent',   sub: 'ink! Contract', color: '#F59E0B', x: 18,  y: 408 },
        { id: 'kredio-lend',  label: 'Kredio Lend',   sub: 'mUSDC Pool',    color: '#22C55E', x: 381, y: 478 },
        { id: 'pas-market',   label: 'PAS Market',    sub: 'Swap Oracle',   color: '#F472B6', x: 744, y: 408 },
    ];

    const isLeft   = (n: typeof nodes[0]) => n.x < 300;
    const isRight  = (n: typeof nodes[0]) => n.x > 600;
    const isTop    = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y < 300;
    const isBottom = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y >= 300;

    const port = (n: typeof nodes[0]) => {
        if (isLeft(n))   return { px: n.x + NW,     py: n.y + NH / 2 };
        if (isRight(n))  return { px: n.x,           py: n.y + NH / 2 };
        if (isTop(n))    return { px: n.x + NW / 2,  py: n.y + NH };
        return                  { px: n.x + NW / 2,  py: n.y };
    };

    const chipPort = (n: typeof nodes[0]) => {
        if (isLeft(n))   return { cx: CX - CHIP_W / 2, cy: CY };
        if (isRight(n))  return { cx: CX + CHIP_W / 2, cy: CY };
        if (isTop(n))    return { cx: CX,               cy: CY - CHIP_H / 2 };
        return                  { cx: CX,               cy: CY + CHIP_H / 2 };
    };

    const tracePath = (n: typeof nodes[0]) => {
        const { px, py } = port(n);
        const { cx, cy } = chipPort(n);
        if (isLeft(n) || isRight(n)) return `M ${px} ${py} L ${cx} ${py} L ${cx} ${cy}`;
        return `M ${px} ${py} L ${px} ${cy} L ${cx} ${cy}`;
    };

    const pillLabels = [
        { idx: 0, label: 'XCM Transfer', frac: 0.38 },
        { idx: 1, label: 'Gov Signal',   frac: 0.32 },
        { idx: 2, label: 'EVM Tx',       frac: 0.38 },
        { idx: 3, label: 'Score Update', frac: 0.36 },
        { idx: 4, label: 'mUSDC Yield',  frac: 0.36 },
        { idx: 5, label: 'Collateral',   frac: 0.38 },
    ];

    const pillPos = (n: typeof nodes[0], frac: number) => {
        const { px, py } = port(n);
        const { cx, cy } = chipPort(n);
        if (isLeft(n) || isRight(n)) {
            const s1 = Math.abs(cx - px), s2 = Math.abs(cy - py), tot = s1 + s2, d = tot * frac;
            if (d <= s1) return { x: px + (cx - px) * (d / (s1 || 1)), y: py };
            return { x: cx, y: py + (cy - py) * ((d - s1) / (s2 || 1)) };
        }
        const s1 = Math.abs(cy - py), s2 = Math.abs(cx - px), tot = s1 + s2, d = tot * frac;
        if (d <= s1) return { x: px, y: py + (cy - py) * (d / (s1 || 1)) };
        return { x: px + (cx - px) * ((d - s1) / (s2 || 1)), y: cy };
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <style>{`
                @keyframes cbBreathe { 0%,100%{opacity:.4} 50%{opacity:1} }
                @keyframes cbPulse1  { 0%{r:38;opacity:.55} 100%{r:80;opacity:0} }
                @keyframes cbPulse2  { 0%{r:38;opacity:.3}  100%{r:100;opacity:0} }
                @keyframes cbPulse3  { 0%{r:38;opacity:.2}  100%{r:120;opacity:0} }
                @keyframes cbDash    { to{stroke-dashoffset:-56} }
                @keyframes cbFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                .cb-breathe { animation: cbBreathe 3.5s ease-in-out infinite; }
                .cb-p1      { animation: cbPulse1  4s   ease-out  infinite; }
                .cb-p2      { animation: cbPulse2  4s   ease-out  infinite; animation-delay:1.3s; }
                .cb-p3      { animation: cbPulse3  4s   ease-out  infinite; animation-delay:2.6s; }
                .cb-dot     { animation: cbBreathe 2.2s ease-in-out infinite; }
                .cb-float   { animation: cbFloat   6s   ease-in-out infinite; }
            `}</style>

            <svg viewBox="0 0 900 540" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                    {nodes.map(n => (
                        <filter key={`gf-${n.id}`} id={`gf-${n.id}`} x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    ))}
                    <filter id="chip-gf" x="-120%" y="-120%" width="340%" height="340%">
                        <feGaussianBlur stdDeviation="16" result="blur1" />
                        <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="node-shadow" x="-20%" y="-20%" width="160%" height="180%">
                        <feDropShadow dx={EX} dy={EY} stdDeviation="4" floodColor="#000" floodOpacity="0.55" />
                    </filter>
                    <radialGradient id="floor-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor={T.cyan} stopOpacity="0.07" />
                        <stop offset="60%"  stopColor={T.pink} stopOpacity="0.03" />
                        <stop offset="100%" stopColor="#000"   stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="chip-top" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                    </linearGradient>
                    <linearGradient id="chip-side-r" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="rgba(0,0,0,0.7)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </linearGradient>
                    <linearGradient id="chip-side-b" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%"   stopColor="rgba(0,0,0,0.6)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                    </linearGradient>
                    {nodes.map(n => (
                        <linearGradient key={`ng-${n.id}`} id={`ng-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor={n.color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={n.color} stopOpacity="0.02" />
                        </linearGradient>
                    ))}
                    {nodes.map(n => (
                        <linearGradient key={`nse-${n.id}`} id={`nse-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor={n.color} stopOpacity="0.15" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Floor glow */}
                <ellipse cx={CX + EX * 2} cy={CY + CHIP_H + 60} rx={320} ry={70} fill="url(#floor-glow)" opacity={0.8} />

                {/* Traces */}
                {nodes.map((n, i) => (
                    <g key={`tr-${n.id}`}>
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={4}   strokeOpacity={0.06} strokeLinecap="round" />
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.18} strokeLinecap="round" />
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1}   strokeOpacity={0.55} strokeLinecap="round"
                            strokeDasharray="6 50"
                            style={{ animation: `cbDash ${2.6 + i * 0.18}s linear infinite`, animationDelay: `${i * 0.5}s`, strokeDashoffset: 0 }}
                        />
                    </g>
                ))}

                {/* Hidden motion paths */}
                {nodes.map((n, i) => (
                    <path key={`hp-${i}`} id={`cbp-${i}`} d={tracePath(n)} fill="none" stroke="none" />
                ))}

                {/* Animated packets */}
                {nodes.map((n, i) => (
                    <circle key={`pkt-${n.id}`} r={5} fill={n.color} filter={`url(#gf-${n.id})`}>
                        <animateMotion dur={`${2.6 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}
                            keyPoints={isBottom(nodes[i]) || isRight(nodes[i]) ? '1;0' : '0;1'}
                            keyTimes="0;1" calcMode="linear">
                            <mpath xlinkHref={`#cbp-${i}`} />
                        </animateMotion>
                    </circle>
                ))}

                {/* Pill labels */}
                {pillLabels.map((p, i) => {
                    const pos = pillPos(nodes[p.idx], p.frac);
                    return (
                        <g key={`pill-${i}`} transform={`translate(${pos.x},${pos.y})`}>
                            <rect x={-36} y={-10} width={72} height={20} rx={10} fill="rgba(0,0,0,0.5)" transform={`translate(${EX * 0.5},${EY * 0.5})`} />
                            <rect x={-36} y={-10} width={72} height={20} rx={10} fill="#0a0b0e" stroke={nodes[p.idx].color} strokeOpacity={0.35} strokeWidth={0.8} />
                            <rect x={-35} y={-9} width={70} height={1} rx={1} fill="rgba(255,255,255,0.07)" />
                            <text x={0} y={4} textAnchor="middle" fontSize={7.5} fill={nodes[p.idx].color} fontFamily="ui-monospace,monospace" letterSpacing={0.5}>
                                {p.label}
                            </text>
                        </g>
                    );
                })}

                {/* Center chip */}
                <g className="cb-float">
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke={T.cyan}  strokeWidth={1.2} strokeOpacity={0} className="cb-p1" />
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke={T.pink}  strokeWidth={0.8} strokeOpacity={0} className="cb-p2" />
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke="#A78BFA" strokeWidth={0.5} strokeOpacity={0} className="cb-p3" />

                    <polygon points={`${CX+CHIP_W/2},${CY-CHIP_H/2} ${CX+CHIP_W/2+EX},${CY-CHIP_H/2+EY} ${CX+CHIP_W/2+EX},${CY+CHIP_H/2+EY} ${CX+CHIP_W/2},${CY+CHIP_H/2}`} fill="url(#chip-side-r)" />
                    <polygon points={`${CX-CHIP_W/2},${CY+CHIP_H/2} ${CX+CHIP_W/2},${CY+CHIP_H/2} ${CX+CHIP_W/2+EX},${CY+CHIP_H/2+EY} ${CX-CHIP_W/2+EX},${CY+CHIP_H/2+EY}`} fill="url(#chip-side-b)" />

                    <rect x={CX-CHIP_W/2} y={CY-CHIP_H/2} width={CHIP_W} height={CHIP_H} rx={10}
                        fill="none" stroke={T.cyan} strokeWidth={1} strokeOpacity={0.15}
                        filter="url(#chip-gf)" className="cb-breathe" />
                    <rect x={CX-CHIP_W/2} y={CY-CHIP_H/2} width={CHIP_W} height={CHIP_H} rx={10}
                        fill="#0b0d10" stroke="rgba(255,255,255,0.14)" strokeWidth={1.2} />
                    <rect x={CX-CHIP_W/2} y={CY-CHIP_H/2} width={CHIP_W} height={CHIP_H} rx={10} fill="url(#chip-top)" />
                    <line x1={CX-CHIP_W/2+10} y1={CY-CHIP_H/2+1} x2={CX+CHIP_W/2-10} y2={CY-CHIP_H/2+1} stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />

                    {[-24,-8,8,24].map((o, i) => <line key={`cl-${i}`} x1={CX-CHIP_W/2+8} y1={CY+o} x2={CX+CHIP_W/2-8} y2={CY+o} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />)}
                    {[-40,-20,0,20,40].map((o, i) => <line key={`cv-${i}`} x1={CX+o} y1={CY-CHIP_H/2+8} x2={CX+o} y2={CY+CHIP_H/2-8} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />)}

                    <text x={CX} y={CY-6} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.8)" fontFamily="ui-monospace,monospace" letterSpacing={3} fontWeight="700">KREDIO</text>
                    <text x={CX} y={CY+12} textAnchor="middle" fontSize={7.5} fill="#64748B" fontFamily="ui-monospace,monospace" letterSpacing={2}>CORE v3</text>

                    {[-44,-22,0,22,44].map((x, i) => <rect key={`pt-${i}`} x={CX+x-2} y={CY-CHIP_H/2-6} width={4} height={7} rx={1} fill="rgba(255,255,255,0.2)" />)}
                    {[-44,-22,0,22,44].map((x, i) => (
                        <g key={`pb-${i}`}>
                            <rect x={CX+x-2} y={CY+CHIP_H/2}    width={4} height={7} rx={1} fill="rgba(0,0,0,0.4)" />
                            <rect x={CX+x-2+EX} y={CY+CHIP_H/2+EY} width={4} height={3} rx={1} fill="rgba(0,0,0,0.6)" />
                        </g>
                    ))}
                    {[-24,0,24].map((y, i) => (
                        <g key={`ps-${i}`}>
                            <rect x={CX-CHIP_W/2-6} y={CY+y-2} width={7} height={4} rx={1} fill="rgba(255,255,255,0.2)" />
                            <rect x={CX+CHIP_W/2}   y={CY+y-2} width={7} height={4} rx={1} fill="rgba(255,255,255,0.12)" />
                        </g>
                    ))}
                </g>

                {/* Node cards */}
                {nodes.map(n => (
                    <g key={`nd-${n.id}`} transform={`translate(${n.x},${n.y})`} filter="url(#node-shadow)">
                        <polygon points={`${NW},0 ${NW+EX},${EY} ${NW+EX},${NH+EY} ${NW},${NH}`} fill={`url(#nse-${n.id})`} opacity={0.75} />
                        <polygon points={`0,${NH} ${NW},${NH} ${NW+EX},${NH+EY} ${EX},${NH+EY}`} fill="rgba(0,0,0,0.55)" />
                        <rect x={-5} y={-5} width={NW+10} height={NH+10} rx={12} fill={`url(#ng-${n.id})`} />
                        <rect x={0}  y={0}  width={NW}    height={NH}    rx={9}  fill="#0b0d10" stroke={n.color} strokeWidth={0.7} strokeOpacity={0.45} />
                        <line x1={9} y1={1}    x2={NW-9} y2={1}    stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
                        <line x1={1} y1={9}    x2={1}    y2={NH-9} stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
                        <line x1={9} y1={NH-1} x2={NW-9} y2={NH-1} stroke="rgba(0,0,0,0.4)"       strokeWidth={0.6} />
                        <rect x={0} y={0} width={3.5} height={NH} rx={2} fill={n.color} fillOpacity={0.8} />
                        <circle cx={NW-14} cy={18} r={3.5} fill={n.color} fillOpacity={0.95} />
                        <circle cx={NW-14} cy={18} r={7}   fill={n.color} fillOpacity={0.12} className="cb-dot" />
                        <text x={14} y={21} fontSize={10} fontWeight="700" fill="#F8FAFC" fontFamily="ui-monospace,monospace" letterSpacing={0.2}>{n.label}</text>
                        <text x={14} y={38} fontSize={8}  fill="#64748B"  fontFamily="ui-monospace,monospace">{n.sub}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
