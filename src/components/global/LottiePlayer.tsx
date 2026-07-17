"use client";

import React, { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

interface LottiePlayerProps {
    /** The animation JSON data imported from your asset files */
    animationData: any;
    /** Playback speed multiplier. 1 is normal, 0.5 is half speed, 2 is double speed. Defaults to 1 */
    speed?: number;
    /** Determines if the animation repeats continuously. Defaults to true */
    loop?: boolean;
    /** Determines if the animation runs automatically on component mount. Defaults to true */
    autoplay?: boolean;
    /** Optional tailwind or standard CSS class names for outer styling wrappers */
    className?: string;
    /** Native React CSS properties object for custom override positioning */
    style?: React.CSSProperties;
    /** Quick-set width constraint (e.g., 200, "100%", "50vw") */
    width?: string | number;
    /** Quick-set height constraint (e.g., 200, "100%", "auto") */
    height?: string | number;
    /** Fires when a single-run animation hits its final frame (requires loop={false}) */
    onComplete?: () => void;
    /** Fires every single time an animation crosses its loop cycle boundary */
    onLoopComplete?: () => void;
    /** Optional external ref to directly trigger play(), pause(), or stop() from a parent node */
    lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
    animationData,
    speed = 1,
    loop = true,
    autoplay = true,
    className = "",
    style,
    width,
    height,
    onComplete,
    onLoopComplete,
    lottieRef: externalRef,
}) => {
    const internalRef = useRef<LottieRefCurrentProps>(null);

    // Use the external ref if passed by parent, otherwise fall back to local ref tracking
    const activeRef = externalRef || internalRef;

    // Sync animation execution speed whenever the speed prop updates dynamically
    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.setSpeed(speed);
        }
    }, [speed, activeRef]);

    const combinedStyles: React.CSSProperties = {
        width: width ?? "100%",
        height: height ?? "auto",
        ...style,
    };

    return (
        <Lottie
            lottieRef={activeRef}
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            style={combinedStyles}
            className={className}
            onComplete={onComplete}
            onLoopComplete={onLoopComplete}
        />
    );
};