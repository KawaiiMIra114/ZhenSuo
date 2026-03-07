import React, { useState, useCallback } from 'react';
import { useGame } from '../GameContext';
import { RuneId, FeedbackType } from '../types';
import { RUNE_STORIES } from '../data/runeStories';

// ═══════════════════════════════════════════
//  InvestigateNode · V4 统一线索埋点组件
//  所有可调查元素均包裹此组件
//  收集 RUNE 时展示赵启叙事片段 (GDD §7.2)
// ═══════════════════════════════════════════

interface InvestigateNodeProps {
    hookId: string;
    condition?: boolean;
    runeId?: RuneId;
    onReadComplete?: () => void;
    children: React.ReactNode;
    className?: string;
}

function formatRuneTitle(runeId: string): string {
    const match = runeId.match(/(\d+)$/);
    if (!match) return runeId;
    return `RUNE #${match[1].padStart(2, '0')}`;
}

export function InvestigateNode({
    hookId,
    condition = true,
    runeId,
    onReadComplete,
    children,
    className = '',
}: InvestigateNodeProps) {
    const { readHook, hasReadHook, collectRune, hasRune } = useGame();
    const [runeStory, setRuneStory] = useState<string | null>(null);
    const alreadyRead = hasReadHook(hookId);
    const needsRune = !!runeId && !hasRune(runeId);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!condition) return;
        // 允许“hook 已读但碎片未收集”时补触发 rune
        if (alreadyRead && !needsRune) return;

        if (!alreadyRead) {
            readHook(hookId);
        }

        // 碎片收集 → 展示赵启叙事片段
        if (runeId && !hasRune(runeId)) {
            collectRune(runeId);
            const story = RUNE_STORIES[runeId];
            if (story) {
                setRuneStory(story);
                // 不自动关闭，等用户点击
            }
        }

        onReadComplete?.();
    }, [condition, alreadyRead, needsRune, hookId, runeId, readHook, collectRune, hasRune, onReadComplete]);

    return (
        <>
            <span
                className={`investigate-node relative cursor-pointer ${className} ${condition && (!alreadyRead || needsRune) ? 'investigate-highlight' : ''
                    }`}
                onClick={handleClick}
            >
                {children}
            </span>

            {/* V4 §7.2 赵启叙事片段 — 全屏覆盖层 */}
            {runeStory && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center cursor-pointer"
                    onClick={() => setRuneStory(null)}
                >
                    <div className="max-w-2xl px-8 space-y-6 animate-in fade-in duration-1000">
                        {/* 碎片标识 */}
                        <div className="text-center">
                            <span className="text-amber-500/60 text-xs font-mono tracking-[0.5em]">
                                {runeId ? formatRuneTitle(runeId) : 'RUNE FRAGMENT'}
                            </span>
                        </div>

                        {/* 叙事正文 */}
                        <p className="text-white/80 text-base leading-relaxed font-serif whitespace-pre-line">
                            {runeStory}
                        </p>

                        {/* 署名 */}
                        <div className="text-right text-zinc-500 text-xs font-mono pt-4">
                            —— MNT-8023
                        </div>

                        {/* 关闭提示 */}
                        <div className="text-center text-zinc-600 text-xs mt-8 animate-pulse">
                            点击任意处关闭
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
