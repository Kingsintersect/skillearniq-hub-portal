"use client";

import { useGSAPAnimations } from '@/hooks/animations/useGsapAnimation';
import { useEffect, useRef } from 'react';

export const Particles = () => {
    const particlesRef = useRef<HTMLDivElement>(null);
    const { initializeParticles } = useGSAPAnimations();

    useEffect(() => {
        if (particlesRef.current) {
            initializeParticles(particlesRef.current);
        }
    }, [initializeParticles]);

    return (
        <div
            ref={particlesRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
        />
    );
};