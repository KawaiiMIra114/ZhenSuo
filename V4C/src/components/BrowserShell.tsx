import React from 'react';
import { Globe, ChevronLeft, ChevronRight, RotateCcw, Lock } from 'lucide-react';

// ═══════════════════════════════════════════
//  V4 浏览器壳组件
//  地址栏 + 导航按钮 + 内嵌页面
// ═══════════════════════════════════════════

interface BrowserShellProps {
    url: string;
    title?: string;
    children: React.ReactNode;
    onUrlChange?: (url: string) => void;
}

export function BrowserShell({ url, title, children, onUrlChange }: BrowserShellProps) {
    return (
        <div className="flex flex-col h-full bg-zinc-900">
            {/* 浏览器工具栏 */}
            <div className="h-10 flex items-center gap-2 px-3 bg-zinc-800 border-b border-zinc-700/50 shrink-0">
                <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors">
                        <RotateCcw className="w-3 h-3 text-zinc-500" />
                    </button>
                </div>
                <div className="flex-1 flex items-center gap-2 h-7 px-3 bg-zinc-900/80 rounded-md border border-zinc-700/50">
                    <Lock className="w-3 h-3 text-green-500/60" />
                    <span className="text-xs text-zinc-400 truncate font-mono">{url}</span>
                </div>
            </div>

            {/* 页面内容 */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
