import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { RuneId } from '../types';

/**
 * Terminal · V4 终局选择界面
 * GDD §8.1-8.2: 碎片检测 + 三选项动态可见
 */

const ALL_RUNES: RuneId[] = ['RUNE_01', 'RUNE_02', 'RUNE_03', 'RUNE_04', 'RUNE_05', 'RUNE_06', 'RUNE_07'];

export function Terminal() {
  const { collectedRunes, setCurrentApp, setEndingType, hasFact } = useGame();
  const [phase, setPhase] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showZhaoQiEmail, setShowZhaoQiEmail] = useState(false);

  const runeCount = collectedRunes.length;
  const missingRunes = ALL_RUNES.filter(r => !collectedRunes.includes(r));
  const allCollected = runeCount === 7;

  // 逐行打字机效果
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [800, 1500, 2200, 3000, 4000, 5500, 7000];
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), d));
    });
    timers.push(setTimeout(() => setShowOptions(true), 8000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnding = (type: 'A' | 'B' | 'C') => {
    // 结局C前弹出赵启定时邮件 (GDD §8.5)
    if (type === 'C' && !showZhaoQiEmail) {
      setShowZhaoQiEmail(true);
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
    setEndingType(type);
    setCurrentApp('ending');
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] text-green-400 font-mono overflow-hidden flex flex-col items-center justify-center">
      {/* 背景旋转符号 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="text-[400px] animate-spin" style={{ animationDuration: '20s' }}>∞</div>
      </div>

      <div className="max-w-2xl w-full z-10 space-y-3 text-sm leading-relaxed px-8">
        {/* GDD §8.2 碎片检测序列 */}
        {phase >= 1 && (
          <div className="animate-in fade-in duration-500">
            {'> 系统检测到异常指令序列'}
          </div>
        )}
        {phase >= 2 && (
          <div className="animate-in fade-in duration-500">
            {'> 正在验证权限……'}
          </div>
        )}
        {phase >= 3 && (
          <div className="animate-in fade-in duration-500">
            {`> 检测到阵法覆写函数碎片：[${runeCount}/7]`}
          </div>
        )}

        {/* 碎片不足时的警告 */}
        {phase >= 4 && !allCollected && (
          <div className="animate-in fade-in duration-700 mt-4 space-y-2">
            <div className="text-yellow-500">
              {'> 警告：当前碎片数量不足（' + runeCount + '/7）'}
            </div>
            <div className="text-yellow-500/80 pl-4">
              太乙救苦反编译阵列无法完整激活。
            </div>
            <div className="text-yellow-500/80 pl-4">
              强行执行将导致部分节点未被覆盖，
            </div>
            <div className="text-yellow-500/80 pl-4">
              系统将触发自修复程序。
            </div>
          </div>
        )}

        {/* 碎片完整时 */}
        {phase >= 4 && allCollected && (
          <div className="animate-in fade-in duration-700 mt-4 space-y-2">
            <div className="text-green-300">
              {'> 验证碎片完整性：[7/7] ✓'}
            </div>
            <div className="text-green-300/80 pl-4">
              太乙救苦反编译阵列：就绪
            </div>
          </div>
        )}

        {/* 缺失碎片列表 */}
        {phase >= 5 && !allCollected && missingRunes.length > 0 && (
          <div className="animate-in fade-in duration-500 text-zinc-500 pl-4">
            {'当前缺少：' + missingRunes.join('、')}
          </div>
        )}

        {/* 可用选项 */}
        {phase >= 6 && (
          <div className="animate-in fade-in duration-500 mt-4">
            {'> 可用选项：'}
          </div>
        )}
      </div>

      {/* 选项按钮 */}
      {showOptions && (
        <div className="mt-10 flex flex-col gap-4 z-10 animate-in fade-in slide-in-from-bottom-8 items-center">
          <button
            onClick={() => handleEnding('A')}
            className="w-80 px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-colors font-mono text-sm tracking-wider text-left"
          >
            {'[烈火洗城（格式化）]'}
          </button>

          <button
            onClick={() => handleEnding('B')}
            className="w-80 px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-black transition-colors font-mono text-sm tracking-wider text-left"
          >
            {'[上行替代（伥鬼）]'}
          </button>

          {allCollected && (
            <button
              onClick={() => handleEnding('C')}
              className="w-80 px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors font-mono text-sm tracking-wider text-left animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              {'[七星破阵（太乙救苦）]'}
            </button>
          )}

          {/* 碎片不足时的提示 */}
          {!allCollected && (
            <div className="text-zinc-600 text-xs font-mono mt-2">
              {'注：第三选项需要完整的七枚碎片方可显示。'}
            </div>
          )}

          {/* 返回调查按钮 (GDD §10.2) */}
          <button
            onClick={() => setCurrentApp('desktop')}
            className="mt-4 text-zinc-600 hover:text-zinc-400 text-xs font-mono transition-colors"
          >
            {'[返回调查]'}
          </button>
        </div>
      )}

      {/* P1-5: 结局C前赵启定时邮件弹窗 (GDD §8.5) */}
      {showZhaoQiEmail && (
        <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center">
          <div className="max-w-lg bg-zinc-900 border border-zinc-700 rounded-lg p-6 animate-in fade-in duration-1000">
            <div className="text-xs text-zinc-500 font-mono mb-1">
              发件人：zq_mnt_8023@protonmail.com
            </div>
            <div className="text-xs text-zinc-500 font-mono mb-1">
              主题：这封邮件如果你看到了，说明程序触发了
            </div>
            <div className="text-xs text-zinc-500 font-mono mb-4">
              发件时间：2024-03-19 22:34（系统接收时间：今天）
            </div>
            <div className="text-zinc-300 text-sm leading-relaxed space-y-3 font-serif">
              <p>我不知道你是谁。</p>
              <p>我在林晓的档案里找到了这个联系方式。</p>
              <p>如果你看到了这封邮件，</p>
              <p>说明你找到了那七个碎片，</p>
              <p>说明程序正在等待最后的确认。</p>
              <p className="mt-4">我不是英雄。</p>
              <p>我只是觉得，如果我什么都不做，</p>
              <p>以后我会一直记得那个气味。</p>
              <p className="mt-4 text-amber-500/80">把它跑完。</p>
              <p className="mt-4 text-zinc-500 text-right">赵启<br />2024-03-19</p>
            </div>
            <button
              onClick={() => {
                setShowZhaoQiEmail(false);
                handleEnding('C');
              }}
              className="mt-6 w-full py-2 border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors font-mono text-sm"
            >
              {'[继续执行七星破阵]'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
