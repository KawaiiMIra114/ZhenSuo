import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';

// ═══════════════════════════════════════════
//  V4 可拖拽窗口组件
//  支持拖拽、最小化、关闭、置顶
// ═══════════════════════════════════════════

interface DraggableWindowProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    width?: number;
    height?: number;
    defaultX?: number;
    defaultY?: number;
    zIndex?: number;
    isMinimized?: boolean;
    onClose: () => void;
    onMinimize?: () => void;
    onFocus?: () => void;
    /** 是否允许窗口内容横向/纵向滚动 */
    scrollable?: boolean;
}

export function DraggableWindow({
    id, title, icon, children,
    width = 800, height = 560,
    defaultX = 80, defaultY = 40,
    zIndex = 100,
    isMinimized = false,
    onClose, onMinimize, onFocus,
    scrollable = true,
}: DraggableWindowProps) {
    const [pos, setPos] = useState({ x: defaultX, y: defaultY });
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        onFocus?.();
        setDragging(true);
        dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    }, [pos, onFocus]);

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e: MouseEvent) => {
            setPos({
                x: Math.max(0, e.clientX - dragOffset.current.x),
                y: Math.max(0, e.clientY - dragOffset.current.y),
            });
        };
        const handleUp = () => setDragging(false);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging]);

    if (isMinimized) return null;

    return (
        <div
            data-window={id}
            className="absolute rounded-lg overflow-hidden shadow-2xl border border-zinc-700/50 flex flex-col bg-zinc-900/95 backdrop-blur-md"
            style={{
                left: pos.x, top: pos.y,
                width, height,
                zIndex,
            }}
            onMouseDown={() => onFocus?.()}
        >
            {/* 标题栏 */}
            <div
                className="h-9 flex items-center justify-between px-3 bg-zinc-800/90 border-b border-zinc-700/50 select-none shrink-0 cursor-move"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2 text-xs text-zinc-300 truncate">
                    {icon && <span className="text-zinc-400">{icon}</span>}
                    <span className="truncate">{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    {onMinimize && (
                        <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        >
                            <Minus className="w-3 h-3 text-zinc-400" />
                        </button>
                    )}
                    <button
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors"
                    >
                        <Square className="w-2.5 h-2.5 text-zinc-400" />
                    </button>
                    <button
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-600/80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                    >
                        <X className="w-3 h-3 text-zinc-400" />
                    </button>
                </div>
            </div>

            {/* 内容区 */}
            <div className={`flex-1 min-h-0 ${scrollable ? 'overflow-auto' : 'overflow-hidden'}`}>
                {children}
            </div>
        </div>
    );
}
