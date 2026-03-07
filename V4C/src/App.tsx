import React from 'react';
import { GameProvider, useGame } from '@/store/GameStore';
import { Desktop } from '@/pages/Desktop';
import { Ending } from '@/pages/Ending';

// ═══════════════════════════════════════════
//  ZhenSuo V4 · App 根组件
// ═══════════════════════════════════════════

function GameRouter() {
    const { currentView } = useGame();

    switch (currentView) {
        case 'warning':
        case 'prologue':
            // V4 序章：直接跳到桌面（后续可补充）
            return <Desktop />;
        case 'desktop':
            return <Desktop />;
        case 'ending':
            return <Ending />;
        case 'shutdown':
            return (
                <div className="fixed inset-0 bg-black flex items-center justify-center">
                    <p className="text-zinc-600 font-mono text-sm animate-pulse">
                        正在关机……
                    </p>
                </div>
            );
        default:
            return <Desktop />;
    }
}

export default function App() {
    return (
        <GameProvider>
            <GameRouter />
        </GameProvider>
    );
}
