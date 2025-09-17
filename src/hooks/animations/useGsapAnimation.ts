"use client";

import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(TextPlugin);
}

export const useGSAPAnimations = () => {
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const initializeParticles = useCallback((container: HTMLElement) => {
        // Clear existing particles
        container.innerHTML = '';

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-white/50 rounded-full';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            container.appendChild(particle);

            gsap.to(particle, {
                y: -100,
                opacity: 0,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                delay: Math.random() * 2,
                ease: 'power2.out'
            });
        }
    }, []);

    const initializeFloatingElements = useCallback(() => {
        const elements = document.querySelectorAll('.floating-element');

        gsap.to(elements, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none'
        });

        gsap.to(elements, {
            scale: 1.2,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }, []);

    const animateSlideTransition = useCallback((
        currentSlide: HTMLElement,
        nextSlide: HTMLElement,
        direction: 'next' | 'prev',
        onComplete?: () => void
    ) => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const tl = gsap.timeline({ onComplete });
        timelineRef.current = tl;

        // Set initial positions
        if (direction === 'next') {
            gsap.set(nextSlide, { x: '100%', opacity: 1 });
            tl.to(currentSlide, { x: '-100%', duration: 1.2, ease: 'power2.inOut' })
                .to(nextSlide, { x: '0%', duration: 1.2, ease: 'power2.inOut' }, 0);
        } else {
            gsap.set(nextSlide, { x: '-100%', opacity: 1 });
            tl.to(currentSlide, { x: '100%', duration: 1.2, ease: 'power2.inOut' })
                .to(nextSlide, { x: '0%', duration: 1.2, ease: 'power2.inOut' }, 0);
        }

        return tl;
    }, []);

    const animateContentIn = useCallback((contentElement: HTMLElement) => {
        const elements = {
            category: contentElement.querySelector('.slide-category'),
            title: contentElement.querySelector('.slide-title'),
            subtitle: contentElement.querySelector('.slide-subtitle'),
            description: contentElement.querySelector('.slide-description'),
            buttons: contentElement.querySelectorAll('.slide-btn')
        };

        const tl = gsap.timeline();

        // Reset positions
        gsap.set([elements.category, elements.description], { y: 30, opacity: 0 });
        gsap.set([elements.title, elements.subtitle], { x: -100, opacity: 0 });
        gsap.set(elements.buttons, { y: 50, opacity: 0 });

        // Animate in sequence
        tl.to(elements.category, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
            .to(elements.title, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.3')
            .to(elements.subtitle, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .to(elements.description, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3')
            .to(elements.buttons, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }, '-=0.2');

        // Title typing effect
        if (elements.title && elements.title.textContent) {
            const titleText = elements.title.textContent;
            elements.title.textContent = '';
            gsap.to(elements.title, {
                text: titleText,
                duration: 1.5,
                ease: 'none',
                delay: 0.5
            });
        }

        return tl;
    }, []);

    const animateContentOut = useCallback((contentElement: HTMLElement) => {
        const elements = contentElement.querySelectorAll(
            '.slide-category, .slide-title, .slide-subtitle, .slide-description, .slide-btn'
        );

        return gsap.to(elements, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: 'power2.in',
            stagger: 0.05
        });
    }, []);

    const animateProgressBar = useCallback((progress: number) => {
        gsap.to('.progress-bar-fill', {
            width: `${progress * 100}%`,
            duration: 0.5,
            ease: 'power2.out'
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, []);

    return {
        initializeParticles,
        initializeFloatingElements,
        animateSlideTransition,
        animateContentIn,
        animateContentOut,
        animateProgressBar
    };
};