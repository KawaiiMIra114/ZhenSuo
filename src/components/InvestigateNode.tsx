import React, { useState, useCallback } from 'react';
import { useGame } from '../GameContext';
import { RuneId, FeedbackType } from '../types';

// ═══════════════════════════════════════════
//  InvestigateNode · V3 统一线索埋点组件
//  所有可调查元素均包裹此组件
// ═══════════════════════════════════════════

interface InvestigateNodeProps {
    hookId: string;
    /** 是否满足触发条件（默认 true） */
    condition?: boolean;
    /** 反馈类型 */
    feedbackType?: FeedbackType;
    /** 气泡提示文字 */
    feedbackText?: string;
    /** 可选：触发碎片收集 */
    runeId?: RuneId;
    /** 触发后的额外回调 */
    onReadComplete?: () => void;
    children: React.ReactNode;
    className?: string;
}

export function InvestigateNode({
    hookId,
    condition = true,
    feedbackType = 'bubble',
    feedbackText,
    runeId,
    onReadComplete,
    children,
    className = '',
}: InvestigateNodeProps) {
    const { readHook, hasReadHook, collectRune } = useGame();
    const [showFeedback, setShowFeedback] = useState(false);
    const [runeFlash, setRuneFlash] = useState(false);
    const alreadyRead = hasReadHook(hookId);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!condition) return;
        if (alreadyRead && !feedbackText) return;

        // 记录进度锁
        readHook(hookId);

        // 碎片收集
        if (runeId) {
            collectRune(runeId);
            setRuneFlash(true);
            setTimeout(() => setRuneFlash(false), 1500);
        }

        // 显示反馈
        if (feedbackText && feedbackType === 'bubble') {
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 4000);
        }

        onReadComplete?.();
    }, [condition, alreadyRead, hookId, runeId, feedbackText, feedbackType, readHook, collectRune, onReadComplete]);

    return (
        <span
            className={`investigate-node relative cursor-pointer ${className} ${condition && !alreadyRead ? 'investigate-highlight' : ''
                }`}
            onClick={handleClick}
        >
            {children}

            {/* 气泡反馈 */}
            {showFeedback && feedbackText && (
                <span className="investigate-bubble">
                    {feedbackText}
                </span>
            )}

            {/* 符文闪烁 */}
            {runeFlash && (
                <span className="rune-flash">
                    ☰ 符文碎片已收集
                </span>
            )}
        </span>
    );
}
