import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';

/** 序章过场 - 分段打字机叙事 */

interface NarrativeSegment {
  lines: string[];
  pause: number; // 段后停顿 ms
  effect?: 'flicker'; // 特殊效果（柔和模式下跳过）
}

const SEGMENTS: NarrativeSegment[] = [
  {
    lines: [
      '窗外的雨，一直下着。',
      '台灯的光把你的影子拉得很长。',
      '你看着那张皱皱巴巴的不予立案通知书。',
      '',
      '三个月了。',
    ],
    pause: 2000,
  },
  {
    lines: [
      '距离林晓进入那家诊所，已经过去了三个月。',
      '三个月了。',
      '',
      '她消失了。',
      '',
      '诊所拒绝你和她的任何联系，',
      '唯一的答复只有："突发癔症，转院治疗。"',
      '警察说："手续齐全，不予立案。"',
      '',
      '你发了疯似的联系她，',
      '得到的只有无人接听的忙音。',
    ],
    pause: 2500,
  },
  {
    lines: [
      '手机屏幕突然亮起。',
      '你带着一丝期待看向屏幕，',
      '可只是一条无聊的广告。',
      '',
      '你想起三天前的那封邮件，',
      '它还挂在通知栏里。',
      '发件人：z***@tranquil-sleep.com',
      '',
      '"也许，真的和林晓有关呢？"',
      '',
      '你打开了那封邮件，细细的看着。',
    ],
    pause: 2200,
    effect: 'flicker',
  },
  {
    lines: [
      '那封邮件说：',
      '',
      '"我不知道你是不是她哥哥。"',
      '"我在她手机的备忘录里找到了这个网址。"',
      '',
      '"快一点。"',
      '',
      '',
      '你深吸一口气，翻开笔记本电脑。',
    ],
    pause: 1500,
  },
];

const CHAR_DELAY = 45; // 每字符打印间隔 ms
const LINE_DELAY = 400; // 行间停顿 ms
const FADE_IN_DELAY = 120; // 淡入动画基础时长 ms

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
        charIndex += 1;
        setCurrentLine(line.slice(0, charIndex));
        setTimeout(typeNext, CHAR_DELAY);
      } else {
        // 当前行结束
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine('');
        lineIndex += 1;
        charIndex = 0;
        setTimeout(typeNext, LINE_DELAY);
      }
    }

    const startTimer = setTimeout(typeNext, 600);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [segmentIdx]);

  // ---- 段落间自动推进 ----
  useEffect(() => {
    if (!segmentDone) return;
    if (segmentIdx >= SEGMENTS.length - 1) {
      setAllDone(true);
      return;
    }
    const seg = SEGMENTS[segmentIdx];
    const timer = setTimeout(() => setSegmentIdx((i) => i + 1), seg.pause);
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
            className={`text-base md:text-lg leading-relaxed transition-opacity duration-500 ${line === '' ? 'h-4' : ''} ${hasFlicker ? 'animate-text-flicker' : ''}`}
            style={{
              opacity: 1,
              animation: `fade-in-up ${FADE_IN_DELAY}ms ease-out forwards`,
              color: line.startsWith('"') ? '#e2e8f0' : '#a1a1aa',
            }}
          >
            {line}
          </p>
        ))}

        {/* 正在打印的行 */}
        {isTyping && (
          <p
            className={`text-base md:text-lg leading-relaxed ${hasFlicker ? 'animate-text-flicker' : ''}`}
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
            跳过序章 ▶
          </button>
        )}
      </div>
    </div>
  );
}
