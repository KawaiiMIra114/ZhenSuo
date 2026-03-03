import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';

// ═══════════════════════════════════════════
//  ShutdownSequence · 关机惩罚全屏动画
//  玩家点击"关机"时触发
//  红色系统字 → 林晓白色溢出信号 → 强制返回桌面
// ═══════════════════════════════════════════

type Phase = 'black' | 'detect' | 'reject' | 'silence' | 'linxiao1' | 'linxiao2' | 'linxiao3' | 'resume' | 'done';

const TIMING: Record<Phase, number> = {
    black: 1200,
    detect: 2000,
    reject: 1500,
    silence: 3000,
    linxiao1: 2500,
    linxiao2: 2500,
    linxiao3: 3000,
    resume: 2000,
    done: 0,
};

export function ShutdownSequence() {
    const { setCurrentApp } = useGame();
    const [phase, setPhase] = useState<Phase>('black');

    const advance = useCallback((next: Phase) => {
        setPhase(next);
    }, []);

    useEffect(() => {
        if (phase === 'done') {
            setCurrentApp('desktop');
            return;
        }

        const phases: Phase[] = ['black', 'detect', 'reject', 'silence', 'linxiao1', 'linxiao2', 'linxiao3', 'resume', 'done'];
        const idx = phases.indexOf(phase);
        if (idx < 0 || idx >= phases.length - 1) return;

        const timer = setTimeout(() => {
            advance(phases[idx + 1]);
        }, TIMING[phase]);

        return () => clearTimeout(timer);
    }, [phase, advance, setCurrentApp]);

    return (
        <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
            <div className="max-w-xl w-full px-8 text-center">

                {/* 红色系统字 */}
                {phase === 'detect' && (
                    <p className="text-red-600 font-mono text-sm animate-in fade-in duration-700">
                        {'> 检测到用户试图终止会话……'}
                    </p>
                )}

                {phase === 'reject' && (
                    <p className="text-red-600 font-mono text-sm animate-in fade-in duration-500">
                        {'> 驳回。'}
                    </p>
                )}

                {/* 沉默阶段 - 什么都不显示 */}

                {/* 林晓白色手写字 */}
                {phase === 'linxiao1' && (
                    <p className="text-white/60 text-lg font-serif italic animate-in fade-in duration-1000">
                        哥哥……
                    </p>
                )}

                {phase === 'linxiao2' && (
                    <p className="text-white/60 text-lg font-serif italic animate-in fade-in duration-1000">
                        为什么……
                    </p>
                )}

                {phase === 'linxiao3' && (
                    <p className="text-white/50 text-lg font-serif italic animate-in fade-in duration-1000">
                        就这样放弃了我……？
                    </p>
                )}

                {/* 恢复 */}
                {phase === 'resume' && (
                    <p className="text-red-600 font-mono text-sm animate-in fade-in duration-500">
                        {'> 会话继续。'}
                    </p>
                )}
            </div>
        </div>
    );
}
