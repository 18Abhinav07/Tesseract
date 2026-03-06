'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EthBridgeRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/bridge'); }, [router]);
    return null;
}
