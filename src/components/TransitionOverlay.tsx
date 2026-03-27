import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════
//  TransitionOverlay · 跨域遮罩动画
//  白区→黑区跳转时的电视雪花
//  + 林晓字体异构特效
// ═══════════════════════════════════════════

interface TransitionOverlayProps {
    /** 是否展示 */
    active: boolean;
    /** 动画类型 */
    type?: 'noise' | 'glitch';
    /** 动画结束后回调 */
    onComplete?: () => void;
    /** 持续时间 ms（默认 800） */
    duration?: number;
}

export function TransitionOverlay({
    active,
    type = 'noise',
    onComplete,
    duration = 800,
}: TransitionOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!active) { setVisible(false); return; }
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [active, duration, onComplete]);

    // Canvas 噪点动画
    useEffect(() => {
        if (!visible || type !== 'noise') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animId: number;
        const drawNoise = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 200;
            }
            ctx.putImageData(imageData, 0, 0);
            animId = requestAnimationFrame(drawNoise);
        };

        drawNoise();
        return () => cancelAnimationFrame(animId);
    }, [visible, type]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9998]">
            {type === 'noise' && (
                <canvas ref={canvasRef} className="w-full h-full" />
            )}
            {type === 'glitch' && (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    <span className="text-green-500 font-mono text-xs animate-pulse">
                        正在建立安全连接...
                    </span>
                </div>
            )}
        </div>
    );
}
