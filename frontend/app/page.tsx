"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import config from '../lib/addresses';
import { useAccess } from '../hooks/useAccess';

/* ──────────────────────────────────────────────────────────────────────────
   Tokens — Tesseract design system
   ────────────────────────────────────────────────────────────────────────── */
const T = {
    pink: '#850fe6ff',
    cyan: '#00E2FF',
    surface: '#0D0F12',
    border: 'rgba(255,255,255,0.07)',
    borderH: 'rgba(255,255,255,0.14)',
    muted: '#475569',
    sub: '#64748B',
    dim: '#94A3B8',
    white: '#F8FAFC',
} as const;

/* ── Motion ─────────────────────────────────────────────────────────────── */
const heroStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const secStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const secFade = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' as const } },
};

/* ── Data ───────────────────────────────────────────────────────────────── */
const STATS: { value: string; label: string; mono?: boolean }[] = [
    { value: '420420417', label: 'Asset Hub Chain ID', mono: true },
    { value: '6', label: 'Credit Tiers' },
    { value: '85%', label: 'Max LTV — Diamond' },
    { value: '3%', label: 'Min Rate — Diamond' },
];

const STEPS = [
    { n: '01', title: 'Fund', body: 'Mint or acquire mUSDC. Bridge PAS from People Chain via native XCM messaging.' },
    { n: '02', title: 'Score', body: 'KreditAgent reads governance activity and repayment history to derive your credit tier on-chain.' },
    { n: '03', title: 'Borrow', body: 'Deposit PAS as collateral and borrow mUSDC at LTV and rates adjusted to your score.' },
    { n: '04', title: 'Repay', body: 'Settle debt, withdraw collateral, and permanently strengthen your on-chain credit standing.' },
] as const;

const TIERS = [
    { name: 'ANON', score: '0–14', ltv: '30%', rate: '22%', color: '#475569', glow: 'rgba(71,85,105,0.25)' },
    { name: 'BRONZE', score: '15–29', ltv: '42%', rate: '18%', color: '#CD7F32', glow: 'rgba(205,127,50,0.25)' },
    { name: 'SILVER', score: '30–49', ltv: '55%', rate: '15%', color: '#94A3B8', glow: 'rgba(148,163,184,0.25)' },
    { name: 'GOLD', score: '50–64', ltv: '65%', rate: '10%', color: '#F59E0B', glow: 'rgba(245,158,11,0.25)' },
    { name: 'PLATINUM', score: '65–79', ltv: '75%', rate: '6%', color: '#00E2FF', glow: 'rgba(0,226,255,0.25)' },
    { name: 'DIAMOND', score: '80–100', ltv: '85%', rate: '3%', color: '#E81CFF', glow: 'rgba(232,28,255,0.3)' },
] as const;

const FEATURES = [
    { icon: '◈', title: 'Score-Aware Credit', desc: 'KreditAgent computes on-chain credit scores from governance participation and repayment history to unlock better rates and higher LTV.', accent: T.cyan },
    { icon: '◇', title: 'Yield Markets', desc: 'Lend mUSDC to USDC or PAS-collateral pools and earn floating APY tied directly to real utilization rates.', accent: '#94A3B8' },
    { icon: '⬢', title: 'PAS Collateral Borrow', desc: 'Deposit native PAS — or bridge from People Chain via XCM — as collateral and borrow mUSDC at score-adjusted rates.', accent: '#A78BFA' },
] as const;

const CONTRACTS = [
    { name: 'KredioLending', desc: 'mUSDC deposit / borrow market', addr: config.lending },
    { name: 'KredioPASMarket', desc: 'PAS-collateral borrow market', addr: config.pasMarket },
    { name: 'MockPASOracle', desc: 'PAS price feed + crash simulation', addr: config.oracle },
    { name: 'GovernanceCache', desc: 'On-chain vote and conviction cache', addr: config.governanceCache },
    { name: 'MockUSDC', desc: 'Protocol quote asset', addr: config.mUSDC },
    { name: 'KreditAgent', desc: 'Score, tier, and rate computation', addr: config.kreditAgent },
] as const;

/* ──────────────────────────────────────────────────────────────────────────
   CircuitBoard — 3D depth edition
   Bigger viewBox (900×540), extruded chip, beveled nodes, floor shadow
   ────────────────────────────────────────────────────────────────────────── */
function CircuitBoard() {
    // ViewBox: 900 × 540   Center chip: (450, 262)
    // Node W×H: 138 × 52   Depth extrusion: 6px down-right
    const CX = 450, CY = 262;
    const NW = 138, NH = 52;
    const EX = 6, EY = 7;          // extrusion offset for 3D depth
    const CHIP_W = 120, CHIP_H = 78;

    const nodes = [
        { id: 'people-chain', label: 'People Chain', sub: 'Polkadot', color: T.cyan, x: 18, y: 58 },
        { id: 'paseo-relay', label: 'Paseo Relay', sub: 'Governance', color: '#A78BFA', x: 381, y: 22 },
        { id: 'asset-hub', label: 'Asset Hub EVM', sub: 'Layer 1', color: '#850fe6ff', x: 744, y: 58 },
        { id: 'kreditagent', label: 'KreditAgent', sub: 'ink! Contract', color: '#F59E0B', x: 18, y: 408 },
        { id: 'kredio-lend', label: 'Kredio Lend', sub: 'mUSDC Pool', color: '#22C55E', x: 381, y: 478 },
        { id: 'pas-market', label: 'PAS Market', sub: 'Swap Oracle', color: '#F472B6', x: 744, y: 408 },
    ];

    const isLeft = (n: typeof nodes[0]) => n.x < 300;
    const isRight = (n: typeof nodes[0]) => n.x > 600;
    const isTop = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y < 200;
    const isBottom = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y > 200;

    const port = (n: typeof nodes[0]) => {
        if (isLeft(n)) return { px: n.x + NW, py: n.y + NH / 2 };
        if (isRight(n)) return { px: n.x, py: n.y + NH / 2 };
        if (isTop(n)) return { px: n.x + NW / 2, py: n.y + NH };
        return { px: n.x + NW / 2, py: n.y };
    };

    const HCX = CX, HCY = CY;
    const chipPort = (n: typeof nodes[0]) => {
        if (isLeft(n)) return { cx: HCX - CHIP_W / 2, cy: HCY };
        if (isRight(n)) return { cx: HCX + CHIP_W / 2, cy: HCY };
        if (isTop(n)) return { cx: HCX, cy: HCY - CHIP_H / 2 };
        return { cx: HCX, cy: HCY + CHIP_H / 2 };
    };

    const tracePath = (n: typeof nodes[0]) => {
        const { px, py } = port(n);
        const { cx, cy } = chipPort(n);
        if (isLeft(n) || isRight(n)) return `M ${px} ${py} L ${cx} ${py} L ${cx} ${cy}`;
        return `M ${px} ${py} L ${px} ${cy} L ${cx} ${cy}`;
    };

    const pillLabels = [
        { idx: 0, label: 'XCM Transfer', frac: 0.38 },
        { idx: 1, label: 'Gov Signal', frac: 0.32 },
        { idx: 2, label: 'EVM Tx', frac: 0.38 },
        { idx: 3, label: 'Score Update', frac: 0.36 },
        { idx: 4, label: 'mUSDC Yield', frac: 0.36 },
        { idx: 5, label: 'Collateral', frac: 0.38 },
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
                @keyframes cbBreathe  { 0%,100%{opacity:.4} 50%{opacity:1} }
                @keyframes cbPulse1   { 0%{r:38;opacity:.55} 100%{r:80;opacity:0} }
                @keyframes cbPulse2   { 0%{r:38;opacity:.3}  100%{r:100;opacity:0} }
                @keyframes cbPulse3   { 0%{r:38;opacity:.2}  100%{r:120;opacity:0} }
                @keyframes dashMove   { to{stroke-dashoffset:-56} }
                @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                .cb-breathe  { animation: cbBreathe 3.5s ease-in-out infinite; }
                .cb-p1       { animation: cbPulse1  4s ease-out infinite; }
                .cb-p2       { animation: cbPulse2  4s ease-out infinite; animation-delay:1.3s; }
                .cb-p3       { animation: cbPulse3  4s ease-out infinite; animation-delay:2.6s; }
                .cb-dot      { animation: cbBreathe 2.2s ease-in-out infinite; }
                .cb-float    { animation: floatY    6s ease-in-out infinite; }
            `}</style>

            <svg viewBox="0 0 900 540" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                    {/* Per-node glow filter */}
                    {nodes.map(n => (
                        <filter key={`gf-${n.id}`} id={`gf-${n.id}`} x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    ))}
                    {/* Chip glow — two-pass for strong halo */}
                    <filter id="chip-gf" x="-120%" y="-120%" width="340%" height="340%">
                        <feGaussianBlur stdDeviation="16" result="blur1" />
                        <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    {/* Soft drop shadow for nodes */}
                    <filter id="node-shadow" x="-20%" y="-20%" width="160%" height="180%">
                        <feDropShadow dx={EX} dy={EY} stdDeviation="4" floodColor="#000" floodOpacity="0.55" />
                    </filter>
                    {/* Floor glow */}
                    <radialGradient id="floor-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={T.cyan} stopOpacity="0.07" />
                        <stop offset="60%" stopColor={T.pink} stopOpacity="0.03" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                    {/* Lighting gradient for chip top face */}
                    <linearGradient id="chip-top" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                    </linearGradient>
                    {/* 3D extrusion side gradient — dark */}
                    <linearGradient id="chip-side-r" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </linearGradient>
                    <linearGradient id="chip-side-b" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                    </linearGradient>
                    {/* Node ambient gradient */}
                    {nodes.map(n => (
                        <linearGradient key={`ng-${n.id}`} id={`ng-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={n.color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={n.color} stopOpacity="0.02" />
                        </linearGradient>
                    ))}
                    {/* Node side extrusion gradient */}
                    {nodes.map(n => (
                        <linearGradient key={`nse-${n.id}`} id={`nse-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={n.color} stopOpacity="0.15" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Floor glow — subtle radial below circuit centroid */}
                <ellipse cx={CX + EX * 2} cy={CY + CHIP_H + 60} rx={320} ry={70}
                    fill="url(#floor-glow)" opacity={0.8} />

                {/* ── TRACES ─────────────────────────────────────────── */}
                {nodes.map((n, i) => (
                    <g key={`tr-${n.id}`}>
                        {/* Base glow trace */}
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={4} strokeOpacity={0.06} strokeLinecap="round" />
                        {/* Mid glow */}
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.18} strokeLinecap="round" />
                        {/* Animated dashes */}
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1} strokeOpacity={0.55} strokeLinecap="round"
                            strokeDasharray="6 50"
                            style={{ animation: `dashMove ${2.6 + i * 0.18}s linear infinite`, animationDelay: `${i * 0.5}s`, strokeDashoffset: 0 }}
                        />
                    </g>
                ))}

                {/* Hidden paths for animateMotion */}
                {nodes.map((n, i) => (
                    <path key={`hp-${i}`} id={`cbp-${i}`} d={tracePath(n)} fill="none" stroke="none" />
                ))}

                {/* Animated packets — larger with stronger glow */}
                {nodes.map((n, i) => (
                    <circle key={`pkt-${n.id}`} r={5} fill={n.color} filter={`url(#gf-${n.id})`}>
                        <animateMotion dur={`${2.6 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}
                            keyPoints={isBottom(nodes[i]) || isRight(nodes[i]) ? '1;0' : '0;1'}
                            keyTimes="0;1" calcMode="linear">
                            <mpath xlinkHref={`#cbp-${i}`} />
                        </animateMotion>
                    </circle>
                ))}

                {/* ── PILL LABELS ─────────────────────────────────────── */}
                {pillLabels.map((p, i) => {
                    const pos = pillPos(nodes[p.idx], p.frac);
                    return (
                        <g key={`pill-${i}`} transform={`translate(${pos.x},${pos.y})`}>
                            {/* Pill shadow */}
                            <rect x={-36} y={-10} width={72} height={20} rx={10}
                                fill="rgba(0,0,0,0.5)" transform={`translate(${EX * 0.5},${EY * 0.5})`} />
                            {/* Pill body */}
                            <rect x={-36} y={-10} width={72} height={20} rx={10}
                                fill="#0a0b0e" stroke={nodes[p.idx].color} strokeOpacity={0.35} strokeWidth={0.8} />
                            {/* Pill inner highlight — top rim */}
                            <rect x={-35} y={-9} width={70} height={1} rx={1}
                                fill="rgba(255,255,255,0.07)" />
                            <text x={0} y={4} textAnchor="middle" fontSize={7.5}
                                fill={nodes[p.idx].color} fontFamily="ui-monospace,monospace" letterSpacing={0.5}>
                                {p.label}
                            </text>
                        </g>
                    );
                })}

                {/* ── CENTER CHIP ─────────────────────────────────────── */}
                <g className="cb-float">
                    {/* Chip pulse rings */}
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke={T.cyan} strokeWidth={1.2} strokeOpacity={0} className="cb-p1" />
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke={T.pink} strokeWidth={0.8} strokeOpacity={0} className="cb-p2" />
                    <circle cx={CX} cy={CY} r={38} fill="none" stroke="#A78BFA" strokeWidth={0.5} strokeOpacity={0} className="cb-p3" />

                    {/* 3D extrusion — right face */}
                    <polygon
                        points={`
                            ${CX + CHIP_W / 2},${CY - CHIP_H / 2}
                            ${CX + CHIP_W / 2 + EX},${CY - CHIP_H / 2 + EY}
                            ${CX + CHIP_W / 2 + EX},${CY + CHIP_H / 2 + EY}
                            ${CX + CHIP_W / 2},${CY + CHIP_H / 2}
                        `}
                        fill="url(#chip-side-r)"
                    />
                    {/* 3D extrusion — bottom face */}
                    <polygon
                        points={`
                            ${CX - CHIP_W / 2},${CY + CHIP_H / 2}
                            ${CX + CHIP_W / 2},${CY + CHIP_H / 2}
                            ${CX + CHIP_W / 2 + EX},${CY + CHIP_H / 2 + EY}
                            ${CX - CHIP_W / 2 + EX},${CY + CHIP_H / 2 + EY}
                        `}
                        fill="url(#chip-side-b)"
                    />

                    {/* Chip body — ambient glow layer */}
                    <rect x={CX - CHIP_W / 2} y={CY - CHIP_H / 2} width={CHIP_W} height={CHIP_H} rx={10}
                        fill="none" stroke={T.cyan} strokeWidth={1} strokeOpacity={0.15}
                        filter="url(#chip-gf)" className="cb-breathe" />

                    {/* Chip body — main surface */}
                    <rect x={CX - CHIP_W / 2} y={CY - CHIP_H / 2} width={CHIP_W} height={CHIP_H} rx={10}
                        fill="#0b0d10" stroke="rgba(255,255,255,0.14)" strokeWidth={1.2} />

                    {/* Top-face lighting overlay */}
                    <rect x={CX - CHIP_W / 2} y={CY - CHIP_H / 2} width={CHIP_W} height={CHIP_H} rx={10}
                        fill="url(#chip-top)" />

                    {/* Top rim highlight */}
                    <line x1={CX - CHIP_W / 2 + 10} y1={CY - CHIP_H / 2 + 1}
                        x2={CX + CHIP_W / 2 - 10} y2={CY - CHIP_H / 2 + 1}
                        stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />

                    {/* Inner circuit grid */}
                    {[-24, -8, 8, 24].map((o, i) => (
                        <line key={`cl-${i}`}
                            x1={CX - CHIP_W / 2 + 8} y1={CY + o}
                            x2={CX + CHIP_W / 2 - 8} y2={CY + o}
                            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                    ))}
                    {[-40, -20, 0, 20, 40].map((o, i) => (
                        <line key={`cv-${i}`}
                            x1={CX + o} y1={CY - CHIP_H / 2 + 8}
                            x2={CX + o} y2={CY + CHIP_H / 2 - 8}
                            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                    ))}

                    {/* Chip text */}
                    <text x={CX} y={CY - 6} textAnchor="middle"
                        fontSize={11} fill="rgba(255,255,255,0.8)"
                        fontFamily="ui-monospace,monospace" letterSpacing={3} fontWeight="700">
                        KREDIO
                    </text>
                    <text x={CX} y={CY + 12} textAnchor="middle"
                        fontSize={7.5} fill={T.sub}
                        fontFamily="ui-monospace,monospace" letterSpacing={2}>
                        CORE v3
                    </text>

                    {/* Pin rows — top */}
                    {[-44, -22, 0, 22, 44].map((x, i) => (
                        <g key={`pt-${i}`}>
                            <rect x={CX + x - 2} y={CY - CHIP_H / 2 - 6} width={4} height={7} rx={1}
                                fill="rgba(255,255,255,0.2)" />
                        </g>
                    ))}
                    {/* Pin rows — bottom */}
                    {[-44, -22, 0, 22, 44].map((x, i) => (
                        <g key={`pb-${i}`}>
                            <rect x={CX + x - 2} y={CY + CHIP_H / 2} width={4} height={7} rx={1}
                                fill="rgba(0,0,0,0.4)" />
                            <rect x={CX + x - 2 + EX} y={CY + CHIP_H / 2 + EY} width={4} height={3} rx={1}
                                fill="rgba(0,0,0,0.6)" />
                        </g>
                    ))}
                    {/* Pin rows — sides */}
                    {[-24, 0, 24].map((y, i) => (
                        <g key={`ps-${i}`}>
                            <rect x={CX - CHIP_W / 2 - 6} y={CY + y - 2} width={7} height={4} rx={1}
                                fill="rgba(255,255,255,0.2)" />
                            <rect x={CX + CHIP_W / 2} y={CY + y - 2} width={7} height={4} rx={1}
                                fill="rgba(255,255,255,0.12)" />
                        </g>
                    ))}
                </g>

                {/* ── NODE CARDS ──────────────────────────────────────── */}
                {nodes.map((n, i) => (
                    <g key={`nd-${n.id}`} transform={`translate(${n.x},${n.y})`}
                        filter="url(#node-shadow)">

                        {/* 3D extrusion — right face */}
                        <polygon
                            points={`${NW},0 ${NW + EX},${EY} ${NW + EX},${NH + EY} ${NW},${NH}`}
                            fill={`url(#nse-${n.id})`} opacity={0.75} />
                        {/* 3D extrusion — bottom face */}
                        <polygon
                            points={`0,${NH} ${NW},${NH} ${NW + EX},${NH + EY} ${EX},${NH + EY}`}
                            fill="rgba(0,0,0,0.55)" />

                        {/* Ambient glow halo */}
                        <rect x={-5} y={-5} width={NW + 10} height={NH + 10} rx={12}
                            fill={`url(#ng-${n.id})`} />

                        {/* Node body */}
                        <rect x={0} y={0} width={NW} height={NH} rx={9}
                            fill="#0b0d10"
                            stroke={n.color} strokeWidth={0.7} strokeOpacity={0.45} />

                        {/* Top-left rim highlight — simulates lighting */}
                        <line x1={9} y1={1} x2={NW - 9} y2={1}
                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
                        <line x1={1} y1={9} x2={1} y2={NH - 9}
                            stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />

                        {/* Bottom-right shadow rim */}
                        <line x1={9} y1={NH - 1} x2={NW - 9} y2={NH - 1}
                            stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />

                        {/* Left accent bar */}
                        <rect x={0} y={0} width={3.5} height={NH} rx={2}
                            fill={n.color} fillOpacity={0.8} />

                        {/* Status dot + glow */}
                        <circle cx={NW - 14} cy={18} r={3.5} fill={n.color} fillOpacity={0.95} />
                        <circle cx={NW - 14} cy={18} r={7} fill={n.color} fillOpacity={0.12} className="cb-dot" />

                        {/* Labels */}
                        <text x={14} y={21} fontSize={10} fontWeight="700"
                            fill="#F8FAFC" fontFamily="ui-monospace,monospace" letterSpacing={0.2}>
                            {n.label}
                        </text>
                        <text x={14} y={38} fontSize={8} fill={T.sub}
                            fontFamily="ui-monospace,monospace">
                            {n.sub}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

/* ── FadeIn wrapper ─────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
            {children}
        </div>
    );
}

/* ── Glass card style ───────────────────────────────────────────────────── */
const glass: React.CSSProperties = {
    borderRadius: '16px',
    border: `1px solid ${T.border}`,
    background: 'rgba(0,0,0,0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
};

/* ── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ fontSize: '10px', fontFamily: 'ui-monospace,monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.sub, marginBottom: '14px' }}>
            {children}
        </p>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */
export default function Home() {
    const { isAdmin } = useAccess();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ══════════════════════════════════════════════════════════
                HERO — full viewport
            ═══════════════════════════════════════════════════════════ */}
            <motion.section
                initial="hidden"
                animate="show"
                variants={heroStagger}
                style={{
                    minHeight: '92vh',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.15fr',
                    gap: '56px',
                    alignItems: 'center',
                    paddingTop: '32px',
                    paddingBottom: '48px',
                }}
                className="hero-grid"
            >
                {/* Left — copy */}
                <div>
                    <motion.div variants={fadeUp} style={{ marginBottom: '32px' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '5px 14px', borderRadius: '100px',
                            border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.03)',
                            fontSize: '10px', letterSpacing: '0.18em',
                            color: T.dim, fontFamily: 'ui-monospace,monospace',
                        }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%', background: '#22C55E',
                                boxShadow: '0 0 8px #22C55E', display: 'inline-block',
                                animation: 'cbBreathe 2s ease-in-out infinite',
                            }} />
                            LIVE ON POLKADOT TESTNET
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        style={{ fontSize: 'clamp(36px,4.5vw,62px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.04em', color: T.white, marginBottom: '22px' }}
                    >
                        Score-Driven Credit<br />
                        <span style={{ color: T.white, opacity: 0.4 }}>on Polkadot Hub.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} style={{ fontSize: '14px', lineHeight: 1.8, color: T.dim, maxWidth: '400px' }}>
                        Lend mUSDC for floating yield. Borrow against PAS collateral at rates
                        computed entirely on-chain by KreditAgent. Your credit history is
                        permanent, portable, and yours.
                    </motion.p>
                </div>

                {/* Right — circuit (no border, free-floating, deeper 3D tilt) */}
                <motion.div
                    variants={fadeUp}
                    className="hidden md:flex items-center justify-center"
                    style={{ position: 'relative', padding: '16px 0' }}
                >
                    {/* 3D tilt wrapper — stronger perspective for depth */}
                    <div style={{
                        width: '100%',
                        transform: 'perspective(900px) rotateX(12deg) rotateY(-6deg) rotateZ(1.5deg)',
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center center',
                        filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(0,226,255,0.06))',
                    }}>
                        <CircuitBoard />
                    </div>
                </motion.div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════
                STATS STRIP
            ═══════════════════════════════════════════════════════════ */}
            <FadeIn>
                <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '0' }} className="stats-grid">
                    {STATS.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '28px 12px', borderRight: i < 3 ? `1px solid ${T.border}` : 'none' }}>
                            <div style={{ fontFamily: s.mono ? 'ui-monospace,monospace' : 'inherit', fontSize: s.mono ? '17px' : '30px', fontWeight: 700, color: T.cyan, letterSpacing: s.mono ? '2px' : '-0.04em', textShadow: `0 0 18px rgba(0,226,255,0.3)`, marginBottom: '5px' }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '10px', color: T.muted, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </FadeIn>

            {/* ══════════════════════════════════════════════════════════
                HOW IT WORKS — full 100vh
            ═══════════════════════════════════════════════════════════ */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={secStagger}
                style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 0' }}
            >
                <motion.div variants={secFade} style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <SectionLabel>Protocol Flow</SectionLabel>
                    <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em' }}>How It Works</h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', position: 'relative' }} className="steps-grid">
                    {/* connector lines */}
                    {STEPS.slice(0, -1).map((_, i) => (
                        <div key={`conn-${i}`} style={{ position: 'absolute', top: '56px', left: `${(i + 1) * 25}%`, width: '1px', height: '32px', background: `linear-gradient(to bottom, ${T.border}, transparent)`, transform: 'translateX(-50%)' }} />
                    ))}
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.n}
                            variants={secFade}
                            style={{ ...glass, padding: '36px 28px', position: 'relative', overflow: 'hidden' }}
                            whileHover={{ y: -6, borderColor: T.borderH, transition: { duration: 0.2 } }}
                        >
                            <p style={{ position: 'absolute', top: '-4px', right: '16px', fontSize: '84px', fontWeight: 900, color: 'rgba(255,255,255,0.025)', lineHeight: 1, fontFamily: 'ui-monospace,monospace', pointerEvents: 'none', userSelect: 'none' }}>{step.n}</p>
                            <p style={{ fontSize: '10px', fontFamily: 'ui-monospace,monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.sub, marginBottom: '16px' }}>{step.n}</p>
                            <p style={{ fontSize: '15px', fontWeight: 600, color: T.white, marginBottom: '10px' }}>{step.title}</p>
                            <p style={{ fontSize: '13px', color: T.dim, lineHeight: 1.75 }}>{step.body}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════
                CREDIT TIERS
            ═══════════════════════════════════════════════════════════ */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={secStagger}
                style={{ paddingBottom: '96px' }}
            >
                <motion.div variants={secFade} style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <SectionLabel>Credit System</SectionLabel>
                    <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', marginBottom: '14px' }}>
                        Build Your On-Chain Reputation
                    </h2>
                    <p style={{ fontSize: '13px', color: T.dim, maxWidth: '440px', margin: '0 auto', lineHeight: 1.75 }}>
                        Every repayment and deposit advances your score. Better tiers unlock dramatically improved borrowing terms.
                    </p>
                </motion.div>

                {/* Score progress bar */}
                <motion.div variants={secFade} style={{ height: '3px', background: T.border, borderRadius: '2px', marginBottom: '40px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${T.muted}, #CD7F32, #94A3B8, #F59E0B, ${T.cyan}, ${T.pink})`, borderRadius: '2px' }} />
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px' }} className="tiers-grid">
                    {TIERS.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            variants={secFade}
                            style={{
                                ...glass,
                                borderRadius: '12px',
                                padding: '24px 18px',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'default',
                                border: tier.name === 'DIAMOND' ? `1px solid rgba(232,28,255,0.25)` : `1px solid ${T.border}`,
                            }}
                            whileHover={{ y: -5, boxShadow: `0 12px 36px ${tier.glow}`, transition: { duration: 0.2 } }}
                        >
                            {tier.name === 'DIAMOND' && (
                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '3px 9px', background: `rgba(232,28,255,0.12)`, borderBottomLeftRadius: '8px', fontSize: '7px', fontFamily: 'ui-monospace,monospace', color: T.pink, letterSpacing: '1px' }}>BEST</div>
                            )}
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: tier.color, boxShadow: `0 0 10px ${tier.color}`, marginBottom: '14px' }} />
                            <div style={{ fontSize: '11px', fontFamily: 'ui-monospace,monospace', fontWeight: 700, color: tier.color, letterSpacing: '2px', marginBottom: '3px' }}>{tier.name}</div>
                            <div style={{ fontSize: '8px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '1px', marginBottom: '18px' }}>SCORE {tier.score}</div>
                            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.muted, marginBottom: '3px' }}>MAX LTV</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: T.white }}>{tier.ltv}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.muted, marginBottom: '3px' }}>INTEREST</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: tier.name === 'DIAMOND' ? T.pink : T.white }}>{tier.rate}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════
                FEATURE CARDS
            ═══════════════════════════════════════════════════════════ */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={secStagger}
                style={{ paddingBottom: '96px' }}
            >
                <motion.div variants={secFade} style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <SectionLabel>Protocol Features</SectionLabel>
                    <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em' }}>Everything You Need</h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {FEATURES.map((f) => (
                        <motion.div key={f.title} variants={secFade}
                            style={{ ...glass, padding: '32px', position: 'relative', overflow: 'hidden', cursor: 'default' }}
                            whileHover={{ y: -4, borderColor: `rgba(255,255,255,0.14)`, transition: { duration: 0.2 } }}
                        >
                            <div style={{ width: 40, height: 40, borderRadius: '10px', border: `1px solid rgba(255,255,255,0.08)`, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: f.accent, marginBottom: '20px' }}>{f.icon}</div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: T.white, marginBottom: '10px' }}>{f.title}</p>
                            <p style={{ fontSize: '12px', color: T.dim, lineHeight: 1.75 }}>{f.desc}</p>
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle at bottom right, ${f.accent}10, transparent 70%)`, borderRadius: '0 0 16px 0', pointerEvents: 'none' }} />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════
                CORE CONTRACTS
            ═══════════════════════════════════════════════════════════ */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={secStagger}
                style={{ paddingBottom: '96px' }}
            >
                <motion.div variants={secFade} style={{ marginBottom: '32px' }}>
                    <SectionLabel>Core Contracts</SectionLabel>
                </motion.div>
                <motion.div variants={secStagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {CONTRACTS.map(c => (
                        <motion.div key={c.name} variants={secFade}
                            style={{ ...glass, borderRadius: '12px', padding: '18px 20px' }}
                            whileHover={{ borderColor: T.borderH, transition: { duration: 0.18 } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-block', flexShrink: 0 }} />
                                <p style={{ fontSize: '13px', fontWeight: 500, color: T.white }}>{c.name}</p>
                            </div>
                            <p style={{ fontSize: '11px', color: T.sub, marginBottom: '10px', paddingLeft: '13px' }}>{c.desc}</p>
                            <p style={{ fontSize: '9.5px', fontFamily: 'ui-monospace,monospace', color: T.dim, wordBreak: 'break-all', lineHeight: 1.6, letterSpacing: '0.02em' }}>{c.addr}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════
                CTA BANNER
            ═══════════════════════════════════════════════════════════ */}
            <FadeIn>
                <div style={{ ...glass, padding: '52px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', overflow: 'hidden', marginBottom: '80px' }} className="cta-flex">
                    <div style={{ position: 'absolute', top: '-60%', right: '-10%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(232,28,255,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', marginBottom: '10px' }}>
                            Start at ANON. Earn your way to{' '}
                            <span style={{ color: T.pink }}>DIAMOND.</span>
                        </h2>
                        <p style={{ fontSize: '13px', color: T.dim, maxWidth: '440px', lineHeight: 1.7 }}>
                            Your on-chain credit history is permanent, portable, and built into every transaction.
                        </p>
                    </div>
                    <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <Link href="/dashboard"
                            style={{ display: 'block', whiteSpace: 'nowrap', padding: '12px 32px', borderRadius: '12px', background: T.pink, color: '#000', fontSize: '13px', fontWeight: 600, textDecoration: 'none', boxShadow: `0 0 24px rgba(232,28,255,0.35)`, transition: 'box-shadow 0.2s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 44px rgba(232,28,255,0.55)`)}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px rgba(232,28,255,0.35)`)}>
                            Open Dashboard →
                        </Link>
                    </div>
                </div>
            </FadeIn>

            {/* ══════════════════════════════════════════════════════════
                FOOTER — minimal
            ═══════════════════════════════════════════════════════════ */}
            <footer style={{ borderTop: `1px solid ${T.border}`, paddingTop: '40px', paddingBottom: '48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px' }} className="footer-grid">
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '6px', border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.7)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 300, letterSpacing: '0.2em', color: T.white, textTransform: 'uppercase' }}>Kredio</span>
                    </div>
                    <p style={{ fontSize: '12px', color: T.sub, lineHeight: 1.75, maxWidth: '280px', marginBottom: '16px' }}>
                        Score-driven credit protocol on Polkadot Asset Hub. Bridge, borrow, and build your on-chain reputation.
                    </p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', border: `1px solid ${T.border}`, borderRadius: '6px', fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.sub, letterSpacing: '1px' }}>
                        POLKADOT ASSET HUB
                    </span>
                </div>

                {/* Protocol links */}
                <div>
                    <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px' }}>Protocol</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Lend', href: '/lend/usdc' },
                            { label: 'Borrow', href: '/borrow/usdc' },
                            { label: 'Swap', href: '/swap' },
                            { label: 'Bridge', href: '/bridge' },
                            { label: 'Score', href: '/score' },
                        ].map(l => (
                            <Link key={l.href} href={l.href} style={{ fontSize: '12px', color: T.sub, textDecoration: 'none', transition: 'color 0.18s' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = T.white)}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T.sub)}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Chain info */}
                <div>
                    <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px' }}>Network</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { k: 'Chain ID', v: '420420417', mono: true, color: T.cyan },
                            { k: 'Network', v: 'Paseo Hub', mono: false, color: T.dim },
                            { k: 'Status', v: 'Testnet', mono: false, color: '#22C55E' },
                        ].map(r => (
                            <div key={r.k}>
                                <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{r.k}</p>
                                <p style={{ fontSize: r.mono ? '11px' : '12px', fontFamily: r.mono ? 'ui-monospace,monospace' : 'inherit', color: r.color, letterSpacing: r.mono ? '1.5px' : 'normal' }}>{r.v}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${T.border}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '0.5px' }}>
                        © 2025 Kredio. Polkadot Testnet.
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'ui-monospace,monospace', color: T.muted }}>
                        Chain ID: <span style={{ color: T.cyan }}>420420417</span>
                    </span>
                </div>
            </footer>

            {/* Responsive breakpoints */}
            <style>{`
                @media (max-width: 1024px) {
                    .tiers-grid  { grid-template-columns: repeat(3,1fr) !important; }
                }
                @media (max-width: 768px) {
                    .hero-grid   { grid-template-columns: 1fr !important; min-height: auto !important; padding-top: 16px !important; }
                    .stats-grid  { grid-template-columns: repeat(2,1fr) !important; }
                    .steps-grid  { grid-template-columns: repeat(2,1fr) !important; }
                    .tiers-grid  { grid-template-columns: repeat(2,1fr) !important; }
                    .cta-flex    { flex-direction: column !important; text-align: center; padding: 36px 28px !important; }
                    .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
                }
            `}</style>
        </div>
    );
}
