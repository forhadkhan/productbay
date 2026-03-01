import React, { useEffect, useState } from 'react';

const COLORS = ['#fce18a', '#ff726d', '#b48def', '#f4306d', '#42A5F5', '#66BB6A', '#FFB74D'];

export interface ConfettiProps {
    /** How long in MS the confetti should run before unmounting. Set to 0 for infinite (until unmount) */
    duration?: number;
    /** Number of confetti pieces to generate */
    pieceCount?: number;
}

/**
 * Confetti component that renders a burst of falling colorful pieces.
 * Useful for celebrating user achievements or successful actions.
 *
 * Automatically unmounts/clears after the specified duration.
 */
export const Confetti: React.FC<ConfettiProps> = ({ duration = 5000, pieceCount = 120 }) => {
    const [pieces, setPieces] = useState<any[]>([]);

    useEffect(() => {
        const newPieces = Array.from({ length: pieceCount }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // % width
            width: 8 + Math.random() * 8, // 8px to 16px
            height: 12 + Math.random() * 14, // 12px to 26px
            backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
            animationDuration: 2 + Math.random() * 2.5, // 2.0s to 4.5s
            animationDelay: Math.random() * 0.3, // 0s to 0.3s delay
            rotate: Math.random() * 360,
            shape: Math.random() > 0.5 ? 'rect' : 'circle', // randomly circular or rectangular
        }));
        setPieces(newPieces);

        if (duration > 0) {
            const timer = setTimeout(() => {
                setPieces([]);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, pieceCount]);

    if (pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden h-screen w-screen absolute top-0 left-0">
            <style>{`
                @keyframes pb-confetti-fall {
                    0% {
                        transform: translateY(-5vh) rotateX(0) rotateY(0) rotateZ(var(--pb-rotate-start));
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotateX(720deg) rotateY(360deg) rotateZ(var(--pb-rotate-end));
                        opacity: 0;
                    }
                }
            `}</style>
            {pieces.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: `-5vh`,
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        backgroundColor: p.backgroundColor,
                        borderRadius: p.shape === 'circle' ? '50%' : '0px',
                        '--pb-rotate-start': `${p.rotate}deg`,
                        '--pb-rotate-end': `${p.rotate + 360 + Math.random() * 720}deg`,
                        animation: `pb-confetti-fall ${p.animationDuration}s ease-in ${p.animationDelay}s forwards`,
                        opacity: 0, // start invisible before delay kicks in
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};
