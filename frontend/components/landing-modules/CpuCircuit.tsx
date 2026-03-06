'use client';

import React from "react";

export interface CpuArchitectureSvgProps {
    className?: string;
    width?: string;
    height?: string;
}

export default function CpuCircuit({
    className = "",
    width = "100%",
    height = "100%",
}: CpuArchitectureSvgProps) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* SVG container with visible overflow for glowing filters */}
            <svg
                className={className}
                width={width}
                height={height}
                viewBox="0 0 800 400"
                style={{ overflow: 'visible', userSelect: 'none' }}
            >
                <defs>
                    {/* Glow filters for node lights */}
                    <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00E2FF" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#00E2FF" floodOpacity="0.4" /></filter>
                    <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#F59E0B" floodOpacity="0.4" /></filter>
                    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#A78BFA" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#A78BFA" floodOpacity="0.4" /></filter>
                    <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22C55E" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#22C55E" floodOpacity="0.4" /></filter>
                    <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#E81CFF" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#E81CFF" floodOpacity="0.4" /></filter>
                    <filter id="glow-sky" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.8" /><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#38BDF8" floodOpacity="0.4" /></filter>
                    
                    {/* Center CPU deep shadow & glow */}
                    <filter id="cpu-shadow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.8" />
                        <feDropShadow dx="0" dy="0" stdDeviation="32" floodColor="#E81CFF" floodOpacity="0.12" />
                        <feDropShadow dx="0" dy="0" stdDeviation="48" floodColor="#00E2FF" floodOpacity="0.08" />
                    </filter>

                    <linearGradient id="cpu-core-bg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(15,23,42,0.9)" />
                        <stop offset="100%" stopColor="rgba(4,6,10,0.9)" />
                    </linearGradient>

                    {/* Gradient for fading the paths towards the edge */}
                    <linearGradient id="edge-fade" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="25%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                        <stop offset="75%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                    </linearGradient>

                    <linearGradient id="pins" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>

                    {/* Faded grid pattern for the background of the chip */}
                    <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </pattern>
                </defs>

                {/* --- 1. Lines / Paths --- */}
                <g stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 6">
                    {/* Left side */}
                    <path id="path-l1" d="M 160 80 H 260 Q 270 80 270 90 V 160 Q 270 170 280 170 H 340">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path id="path-l2" d="M 160 200 H 340">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path id="path-l3" d="M 160 320 H 260 Q 270 320 270 310 V 240 Q 270 230 280 230 H 340">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Right side — Draw points inwards (from edge to center) so animateMotion goes TO center */}
                    <path id="path-r1" d="M 640 80 H 540 Q 530 80 530 90 V 160 Q 530 170 520 170 H 460">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path id="path-r2" d="M 640 200 H 460">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path id="path-r3" d="M 640 320 H 540 Q 530 320 530 310 V 240 Q 530 230 520 230 H 460">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Top/Bottom */}
                    <path id="path-t1" d="M 400 40 V 140">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path id="path-b1" d="M 400 360 V 260">
                        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Solid overlay lines to give structure */}
                <g stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 160 80 H 260 Q 270 80 270 90 V 160 Q 270 170 280 170 H 340" />
                    <path d="M 160 200 H 340" />
                    <path d="M 160 320 H 260 Q 270 320 270 310 V 240 Q 270 230 280 230 H 340" />
                    <path d="M 640 80 H 540 Q 530 80 530 90 V 160 Q 530 170 520 170 H 460" />
                    <path d="M 640 200 H 460" />
                    <path d="M 640 320 H 540 Q 530 320 530 310 V 240 Q 530 230 520 230 H 460" />
                    <path d="M 400 40 V 140" />
                    <path d="M 400 360 V 260" />
                </g>

                {/* --- 2. Animated Orbs following exact paths using animateMotion --- */}
                
                {/* L1: XCM Deposits (Cyan) */}
                <circle r="4" fill="#00E2FF" filter="url(#glow-blue)">
                    <animateMotion dur="3.5s" repeatCount="indefinite">
                        <mpath href="#path-l1" />
                    </animateMotion>
                </circle>
                
                {/* L2: ETH Bridge (Orange) */}
                <circle r="4" fill="#F59E0B" filter="url(#glow-orange)">
                    <animateMotion dur="4.2s" repeatCount="indefinite" begin="1s">
                        <mpath href="#path-l2" />
                    </animateMotion>
                </circle>
                
                {/* L3: Flashloan Shield (Purple) */}
                <circle r="4" fill="#A78BFA" filter="url(#glow-purple)">
                    <animateMotion dur="3.8s" repeatCount="indefinite" begin="0.5s">
                        <mpath href="#path-l3" />
                    </animateMotion>
                </circle>

                {/* R1: PAS Markets (Green) */}
                <circle r="4" fill="#22C55E" filter="url(#glow-green)">
                    <animateMotion dur="4s" repeatCount="indefinite" begin="1.2s">
                        <mpath href="#path-r1" />
                    </animateMotion>
                </circle>
                
                {/* R2: KredioSwap (Pink) */}
                <circle r="4" fill="#E81CFF" filter="url(#glow-pink)">
                    <animateMotion dur="3.5s" repeatCount="indefinite" begin="0.2s">
                        <mpath href="#path-r2" />
                    </animateMotion>
                </circle>
                
                {/* R3: Governance (Sky) */}
                <circle r="4" fill="#38BDF8" filter="url(#glow-sky)">
                    <animateMotion dur="4.2s" repeatCount="indefinite" begin="2s">
                        <mpath href="#path-r3" />
                    </animateMotion>
                </circle>

                {/* T1: Credit Tiers (Pink) */}
                <circle r="4" fill="#E81CFF" filter="url(#glow-pink)">
                    <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.8s">
                        <mpath href="#path-t1" />
                    </animateMotion>
                </circle>
                
                {/* B1: Identity Boost (Orange) */}
                <circle r="4" fill="#F59E0B" filter="url(#glow-orange)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.5s">
                        <mpath href="#path-b1" />
                    </animateMotion>
                </circle>


                {/* --- 3. Node Endpoints & Labels --- */}
                <g fill="#0b0d10" stroke="#334155" strokeWidth="2">
                    {/* Node points on the outer edges */}
                    <circle cx="160" cy="80" r="5" />
                    <circle cx="160" cy="200" r="5" />
                    <circle cx="160" cy="320" r="5" />
                    <circle cx="640" cy="80" r="5" />
                    <circle cx="640" cy="200" r="5" />
                    <circle cx="640" cy="320" r="5" />
                    <circle cx="400" cy="40" r="5" />
                    <circle cx="400" cy="360" r="5" />
                    
                    {/* Inner dots */}
                    <circle cx="160" cy="80" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="160" cy="200" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="160" cy="320" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="640" cy="80" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="640" cy="200" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="640" cy="320" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="400" cy="40" r="1.5" fill="#CBD5E1" stroke="none" />
                    <circle cx="400" cy="360" r="1.5" fill="#CBD5E1" stroke="none" />
                </g>

                {/* Techy Labels */}
                <g fontSize="13" fontWeight="700" letterSpacing="0.04em" fontFamily="ui-monospace,monospace">
                    {/* Left Labels */}
                    <text x="145" y="84" textAnchor="end" fill="#00E2FF">XCM Deposits <tspan fill="#CBD5E1" fontSize="10">01</tspan></text>
                    <text x="145" y="204" textAnchor="end" fill="#F59E0B">ETH Bridge <tspan fill="#CBD5E1" fontSize="10">02</tspan></text>
                    <text x="145" y="324" textAnchor="end" fill="#A78BFA">Flashloan Shield <tspan fill="#CBD5E1" fontSize="10">03</tspan></text>
                    
                    {/* Right Labels */}
                    <text x="655" y="84" textAnchor="start" fill="#22C55E"><tspan fill="#CBD5E1" fontSize="10">04 </tspan>PAS Markets</text>
                    <text x="655" y="204" textAnchor="start" fill="#E81CFF"><tspan fill="#CBD5E1" fontSize="10">05 </tspan>KredioSwap</text>
                    <text x="655" y="324" textAnchor="start" fill="#38BDF8"><tspan fill="#CBD5E1" fontSize="10">06 </tspan>Governance</text>
                    
                    {/* Top/Bottom Labels */}
                    <text x="400" y="25" textAnchor="middle" fill="#E81CFF"><tspan fill="#CBD5E1" fontSize="10">07 </tspan>Credit Tiers</text>
                    <text x="400" y="380" textAnchor="middle" fill="#F59E0B"><tspan fill="#CBD5E1" fontSize="10">08 </tspan>Identity Boost</text>
                </g>

                {/* --- 4. Center CPU Core (KreditAgent) --- */}
                <g>
                    {/* CPU connection pins */}
                    <g fill="url(#pins)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5">
                        {/* Left Pins */}
                        {[155, 170, 185, 200, 215, 230, 245].map(y => (
                            <rect key={`pl-${y}`} x="330" y={y-2.5} width="12" height="5" rx="1.5" />
                        ))}
                        {/* Right Pins */}
                        {[155, 170, 185, 200, 215, 230, 245].map(y => (
                            <rect key={`pr-${y}`} x="458" y={y-2.5} width="12" height="5" rx="1.5" />
                        ))}
                        {/* Top Pins */}
                        {[355, 370, 385, 400, 415, 430, 445].map(x => (
                            <rect key={`pt-${x}`} x={x-2.5} y="130" width="5" height="12" rx="1.5" />
                        ))}
                        {/* Bottom Pins */}
                        {[355, 370, 385, 400, 415, 430, 445].map(x => (
                            <rect key={`pb-${x}`} x={x-2.5} y="258" width="5" height="12" rx="1.5" />
                        ))}
                    </g>

                    {/* Main CPU Body with drop shadow */}
                    <rect
                        x="340" y="140" width="120" height="120" rx="16"
                        fill="url(#cpu-core-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
                        filter="url(#cpu-shadow)"
                    />
                    
                    {/* Subtle inner border to make it look like a glass chip */}
                    <rect 
                        x="341" y="141" width="118" height="118" rx="15"
                        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                    />

                    {/* Internal core grid */}
                    <rect 
                        x="345" y="145" width="110" height="110" rx="12"
                        fill="url(#grid)" stroke="rgba(0,226,255,0.2)" strokeWidth="1"
                    />

                    {/* Four inner corner dots for tech detail */}
                    <circle cx="355" cy="155" r="1.5" fill="#00E2FF" opacity="0.6" />
                    <circle cx="445" cy="155" r="1.5" fill="#00E2FF" opacity="0.6" />
                    <circle cx="355" cy="245" r="1.5" fill="#00E2FF" opacity="0.6" />
                    <circle cx="445" cy="245" r="1.5" fill="#00E2FF" opacity="0.6" />

                    {/* Core CPU Text wrapped in a darker inner chip */}
                    <rect 
                        x="355" y="180" width="90" height="40" rx="6"
                        fill="#060708" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                    />

                    <text
                        x="400" y="205" fontSize="13"
                        fill="#FFFFFF"
                        fontWeight="800" letterSpacing="0.1em" textAnchor="middle"
                        fontFamily="ui-monospace,monospace"
                    >
                        KREDIO
                    </text>
                </g>
            </svg>
        </div>
    );
}
