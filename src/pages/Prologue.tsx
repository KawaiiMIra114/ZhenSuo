import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';

/** 序章过场 —— 分段打字机叙事 */

interface NarrativeSegment {
    lines: string[];
    pause: number;        // 段后停顿 ms
    effect?: 'flicker';   // 特殊效果（柔和模式下跳过）
}

const SEGMENTS: NarrativeSegment[] = [
    {
        lines: [
            '2024年6月2日',
            '凌晨 3:47',
            '',
            '窗外的雨已经下了三天。',
            '你坐在书桌前，面前摊着一张揉皱的不予立案通知书。',
            '台灯把你的影子拉得很长，像一道黑色的裂缝。',
        ],
        pause: 2000,
    },
    {
        lines: [
            '手机屏幕突然亮了。',
            '',
            '一封未知来源的邮件。',
            '发件人：z***@tranquil-sleep.com',
            '发送时间：2024年6月1日 03:14（定时发送）',
        ],
        pause: 2200,
        effect: 'flicker',
    },
    {
        lines: [
            '你的妹妹林晓，24岁，重度失眠患者。',
            '三个月前入住安宁深眠诊所，接受所谓的"深度神经共振疗法"。',
            '',
            '然后她就消失了。',
            '',
            '院方说她"突发癔症，已转院"。',
            '你父亲说他从没签过任何转院同意书。',
            '警察说手续齐全，不予立案。',
        ],
        pause: 2500,
    },
    {
        lines: [
            '你盯着那封邮件，手指微微发抖。',
            '',
            '"她没有出院，也没有被转院。"',
            '"我在试着断电。如果你收到这封邮件——"',
            '"——说明我可能已经失败了。"',
            '',
            '"快点。"',
            '',
            '',
            '你深吸一口气，翻开笔记本电脑。',
        ],
        pause: 1500,
    },
];

const CHAR_DELAY = 45;      // 每字符打印间隔 ms
const LINE_DELAY = 400;     // 行间停顿 ms
const FADE_IN_DELAY = 120;  // 淡入动画基底 ms

export function Prologue() {
    const { setCurrentApp, gentleMode } = useGame();
    const [segmentIdx, setSegmentIdx] = useState(0);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [segmentDone, setSegmentDone] = useState(false);
    const [allDone, setAllDone] = useState(false);

    // ---- 跳过 ----
    const skip = useCallback(() => setCurrentApp('desktop'), [setCurrentApp]);

    // ---- 打字机效果 ----
    useEffect(() => {
        if (segmentIdx >= SEGMENTS.length) {
            setAllDone(true);
            return;
        }

        const seg = SEGMENTS[segmentIdx];
        let lineIndex = 0;
        let charIndex = 0;
        let cancelled = false;

        setDisplayedLines([]);
        setCurrentLine('');
        setSegmentDone(false);
        setIsTyping(true);

        function typeNext() {
            if (cancelled) return;

            const lines = seg.lines;
            if (lineIndex >= lines.length) {
                // 段落打完
                setIsTyping(false);
                setSegmentDone(true);
                return;
            }

            const line = lines[lineIndex];
            if (charIndex < line.length) {
                charIndex++;
                setCurrentLine(line.slice(0, charIndex));
                setTimeout(typeNext, CHAR_DELAY);
            } else {
                // 当前行结束
                setDisplayedLines(prev => [...prev, line]);
                setCurrentLine('');
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNext, LINE_DELAY);
            }
        }

        const startTimer = setTimeout(typeNext, 600);
        return () => { cancelled = true; clearTimeout(startTimer); };
    }, [segmentIdx]);

    // ---- 段落间自动推进 ----
    useEffect(() => {
        if (!segmentDone) return;
        if (segmentIdx >= SEGMENTS.length - 1) {
            setAllDone(true);
            return;
        }
        const seg = SEGMENTS[segmentIdx];
        const timer = setTimeout(() => setSegmentIdx(i => i + 1), seg.pause);
        return () => clearTimeout(timer);
    }, [segmentDone, segmentIdx]);

    // ---- 当前段是否有闪烁效果 ----
    const hasFlicker = !gentleMode && SEGMENTS[segmentIdx]?.effect === 'flicker';

    return (
        <div className="min-h-screen bg-black text-zinc-300 flex flex-col items-center justify-center p-8 font-sans select-none relative overflow-hidden">

            {/* ---- 叙事区域 ---- */}
            <div className="max-w-2xl w-full space-y-1 min-h-[320px] flex flex-col justify-center">
                {displayedLines.map((line, i) => (
                    <p
                        key={`${segmentIdx}-${i}`}
                        className={`text-base md:text-lg leading-relaxed transition-opacity duration-500 ${line === '' ? 'h-4' : ''
                            } ${hasFlicker ? 'animate-text-flicker' : ''}`}
                        style={{
                            opacity: 1,
                            animation: `fade-in-up ${FADE_IN_DELAY}ms ease-out forwards`,
                            color: line.startsWith('"') ? '#e2e8f0' : '#a1a1aa',
                        }}
                    >
                        {line}
                    </p>
                ))}

                {/* 正在打字的行 */}
                {isTyping && (
                    <p
                        className={`text-base md:text-lg leading-relaxed ${hasFlicker ? 'animate-text-flicker' : ''
                            }`}
                        style={{
                            color: currentLine.startsWith('"') ? '#e2e8f0' : '#a1a1aa',
                        }}
                    >
                        {currentLine}
                        <span className="animate-typewriter-cursor inline-block w-[2px] h-[1.1em] bg-zinc-400 ml-[2px] align-middle" />
                    </p>
                )}
            </div>

            {/* ---- 底部按钮区 ---- */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                {allDone ? (
                    <button
                        onClick={skip}
                        className="px-8 py-3 bg-zinc-100 text-black font-bold hover:bg-white transition-all duration-300 animate-fade-in-up"
                    >
                        打开笔记本电脑
                    </button>
                ) : (
                    <button
                        onClick={skip}
                        className="px-4 py-2 text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
                    >
                        跳过序章 ▸
                    </button>
                )}
            </div>

            {/* ---- 装饰性日期标签 ---- */}
            <div className="absolute top-6 right-8 text-zinc-800 text-xs font-mono tracking-widest">
                CASE FILE #LX-044
            </div>
        </div>
    );
}
