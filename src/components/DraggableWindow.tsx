import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';

// ═══════════════════════════════════════════
//  DraggableWindow · 可拖动窗口容器
//  桌面上所有弹出窗口均使用此组件
// ═══════════════════════════════════════════

interface DraggableWindowProps {
    title: string;
    icon?: React.ReactNode;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    width?: number | string;
    height?: number | string;
    children: React.ReactNode;
    /** 最小化时的文字 */
    className?: string;
    /** z-index 层级 */
    zIndex?: number;
    onFocus?: () => void;
}

// 全局层级计数
let globalZCounter = 100;

export function DraggableWindow({
    title,
    icon,
    onClose,
    defaultPosition,
    width = 640,
    height = 480,
    children,
    className = '',
    zIndex: initialZ,
    onFocus,
}: DraggableWindowProps) {
    const [position, setPosition] = useState(
        defaultPosition ?? {
            x: Math.max(40, Math.random() * 200),
            y: Math.max(40, Math.random() * 100),
        }
    );
    const [zIndex, setZIndex] = useState(initialZ ?? ++globalZCounter);
    const [isMinimized, setIsMinimized] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
    const windowRef = useRef<HTMLDivElement>(null);

    const bringToFront = useCallback(() => {
        setZIndex(++globalZCounter);
        onFocus?.();
    }, [onFocus]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 只有标题栏区域可拖动
        if ((e.target as HTMLElement).closest('.window-controls')) return;
        e.preventDefault();
        bringToFront();
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            originX: position.x,
            originY: position.y,
        };
    }, [position, bringToFront]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            setPosition({
                x: dragRef.current.originX + dx,
                y: Math.max(0, dragRef.current.originY + dy),
            });
        };
        const handleMouseUp = () => { dragRef.current = null; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (isMinimized) return null;

    return (
        <div
            ref={windowRef}
            className={`draggable-window fixed rounded-lg shadow-2xl overflow-hidden flex flex-col border border-zinc-600/50 ${className}`}
            style={{
                left: position.x,
                top: position.y,
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                zIndex,
            }}
            onMouseDown={bringToFront}
        >
            {/* 标题栏 */}
            <div
                className="window-titlebar h-9 bg-zinc-800 border-b border-zinc-700 flex items-center px-3 gap-3 select-none cursor-grab active:cursor-grabbing shrink-0"
                onMouseDown={handleMouseDown}
            >
                {/* 窗口控制按钮 */}
                <div className="window-controls flex gap-1.5">
                    <button
                        onClick={onClose}
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors"
                    >
                        <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors"
                    >
                        <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
                    </button>
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                {/* 标题 */}
                <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono truncate">
                    {icon}
                    <span>{title}</span>
                </div>
            </div>

            {/* 窗口内容 */}
            <div className="flex-1 overflow-auto bg-zinc-900">
                {children}
            </div>
        </div>
    );
}
