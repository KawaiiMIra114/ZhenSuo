import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';

// ═══════════════════════════════════════════
//  Ending · V4 §8 终局系统
//  选择界面(碎片检测) + 三结局完整序列
// ═══════════════════════════════════════════

type EndingChoice = 'A' | 'B' | 'C' | null;
type EndingPhase = 'choice' | 'executing' | 'display';

export function Ending() {
  const {
    endingType, setEndingType,
    collectedRunes, completedEndings, completeEnding,
    setCurrentApp,
  } = useGame();

  const [choice, setChoice] = useState<EndingChoice>(null);
  const [phase, setPhase] = useState<EndingPhase>('choice');
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [endingComplete, setEndingComplete] = useState(false);
  const [showZhaoQiEmail, setShowZhaoQiEmail] = useState(false);

  const runeCount = collectedRunes.length;
  const canChooseC = runeCount === 7;
  const missingRunes = ['RUNE_01', 'RUNE_02', 'RUNE_03', 'RUNE_04', 'RUNE_05', 'RUNE_06', 'RUNE_07']
    .filter(r => !collectedRunes.includes(r));

  // ── V4 §8.3 结局A：烈火洗城 ──
  const endingA: string[] = [
    '> 执行物理自毁序列……',
    '> 液冷循环切断确认',
    '> B2层温度传感器读数：31°C → 47°C → 68°C → 上升中',
    '> 预计热失控时间：4分17秒',
    '> 服务器矩阵节点状态：[在线 → 失联中]',
    '> ',
    '节点 LX-044-YIN …… 失联',
    '节点 ZK-0077-GHOST …… 失联',
    '节点 ██-███-████ …… 失联',
    '节点 ██-███-████ …… 失联',
    '[共计 19,847 个节点]',
    '[正在批量处理……]',
    '████████████████████ 100%',
    '[处理完成]',
    '> ',
    '> 全部节点已离线',
    '> 系统终止',
    '> ',
    '> ……',
    '> ',
    '> 官网已切换至维护页面。',
    '> 「本院官方网站正在维护中，感谢您的耐心等待。」',
    '> ',
    '> 你关闭了浏览器标签页。',
    '> 桌面回来了。',
    '> ',
    '> 微信网页版还开着。林晓的对话还在。',
    '> 最后一条消息是45天前她发的：',
    '> ',
    '> 「到了记得报平安。」',
    '> 显示"已送达，未读"。',
    '> ',
    '> 然后，邮件通知弹出来。',
    '> ',
    '发件人：lx044yin@▓▓▓▓▓▓▓▓',
    '主题：[空]',
    '> ',
    '> 邮件正文只有一行：',
    '__BLOOD__哥哥……为什么要杀掉我……',
    '> ',
    '> 第二个窗口弹出来，内容一样。',
    '> 第三个。第四个。',
    '> 窗口开始在桌面上疯狂繁殖，',
    '> 每一个都是同一行字——',
    '__BLOOD__哥哥……为什么要杀掉我……',
    '__BLOOD__哥哥……为什么要杀掉我……',
    '__BLOOD__哥哥……为什么要杀掉我……',
    '> ',
    '> 直到整个屏幕被填满，',
    '> 直到像素开始碎裂，',
    '> 然后一起寂灭。',
    '> ',
    '> 桌面变黑。',
    '> 什么都没有了。',
    '> ',
    '> [结局 A · 烈火洗城]',
  ];

  // ── V4 §8.4 结局B：上行替代 ──
  const endingB: string[] = [
    '> 血脉置换验证启动',
    '> 正在读取置换方身份数据……',
    '> 节点 LX-044-YIN 检测到……',
    '> 意识迁移通道建立中……',
    '> ',
    '[████████████░░░░░░░░] 67%',
    '> ',
    '> 节点 LX-044-YIN 意识下传中……',
    '> 新节点数据写入中……',
    '> ',
    '[████████████████████] 100%',
    '> ',
    '> ……',
    '> ',
    '> 置换完成。',
    '> LX-044-YIN 已下线，恢复至碳基载体。',
    '> 新节点 [UID:PLAYER] 已上线。',
    '> 入库方式：自愿',
    '> 剥壳阻力系数：0.00（历史最低）',
    '> 系统运行正常。',
    '> 下一疗程周期：72小时后。',
    '> ',
    '> ……',
    '> ',
    '> 官网首页正在加载……',
    '> 极简冷蓝与原白。干净，温柔，毫无破绽。',
    '> ',
    '> 团队介绍页。',
    '> 院长的照片，林医生的照片，前台团队的照片。',
    '> ',
    '> 最下方，多了一张新的员工照片。',
    '> 你不认识那张脸，但那张脸在微笑。',
    '> 眼睛里没有任何东西。',
    '> ',
    '> 官网标志缓慢旋转。无限 ∞。',
    '> ',
    '> 页面底部，极小的灰色版权声明：',
    '> 「© 2019-2024 安宁深眠（南郊）医疗研究中心 保留所有权利」',
    '> ',
    '> 然后年份悄悄变了。',
    '> ',
    '> 「© 2019-2025 安宁深眠（南郊）医疗研究中心 保留所有权利」',
    '> ',
    '> 机器继续运转。',
    '> 新的一年开始了。',
    '> ',
    '> [结局 B · 上行替代]',
  ];

  // ── V4 §8.5 结局C：七星破阵 ──
  const endingC: string[] = [
    '> 终端核心校准模式',
    '> 输入确认：TaiYiJiuKu',
    '> 验证碎片完整性：[7/7] ✓',
    '> 太乙救苦反编译阵列·全节点激活',
    '> ',
    '检测太岁高维接口通道……',
    '通道状态：[建立中]',
    '> ',
    '覆写程序注入……',
    '通道状态：[覆写中]',
    '> ',
    '████████████████████ 100%',
    '> ',
    '通道状态：[清除中]',
    '████████████████████ 100%',
    '> ',
    '通道状态：[不存在]',
    '> ',
    '太岁唤醒计划：[终止]',
    '接口通道已从存在层面抹除。',
    '> ',
    '> ……屏幕开始震颤。',
    '> 不是崩溃，是一种极其有序的、逐层反转。',
    '> ',
    '> 节点开始释放。',
    '> 不是被强制切断，',
    '> 是像一盏一盏灯被轻轻地关掉。',
    '> ',
    '节点 ██-███-████ …… 已释放',
    '节点 ██-███-████ …… 已释放',
    '节点 ██-███-████ …… 已释放',
    '节点 ██-███-████ …… 已释放',
    '> ',
    '> ……它们一条一条滚过去。',
    '> 没有名字，只有编号。',
    '> 19,847条。',
    '> ',
    '__RELEASE__节点 LX-044-YIN …… 已释放',
    '> ',
    '> 然后是黑屏。',
    '> 很长时间。',
    '> 完全静默。',
    '> ',
    '> ……',
    '> ……',
    '> ……',
    '> ',
    '__LIGHT__「我看到光了。」',
    '> ',
    '> ……',
    '> ……',
    '> ',
    '> 桌面回来了。',
    '> 微信网页版还开着。',
    '> 林晓的对话框。',
    '> 那条45天前的"到了记得报平安"还在那里。',
    '> ',
    '> 然后她的头像亮了。',
    '> ',
    '__WECHAT__林晓：哥，我到家了。你在哪？',
    '> ',
    '> 光标在输入框里闪烁，等你回复。',
    '> ',
    '> [结局 C · 七星破阵]',
  ];

  const endingTexts: Record<string, string[]> = { A: endingA, B: endingB, C: endingC };

  // 实际开始结局执行
  const executeChoice = useCallback((c: EndingChoice) => {
    if (!c) return;
    setChoice(c);
    setEndingType(c);
    setPhase('executing');
    setDisplayLines([]);
    setLineIndex(0);
  }, [setEndingType]);

  // 选择结局 — 结局C先弹赵启邮件 (GDD §8.5)
  const handleChoice = useCallback((c: EndingChoice) => {
    if (!c) return;
    if (c === 'C') {
      setShowZhaoQiEmail(true);
      return;
    }
    executeChoice(c);
  }, [executeChoice]);

  // 逐行显示
  useEffect(() => {
    if (phase !== 'executing' || !choice) return;
    const lines = endingTexts[choice];
    if (!lines) return;

    if (lineIndex >= lines.length) {
      setPhase('display');
      setEndingComplete(true);
      return;
    }

    const line = lines[lineIndex];
    const delay = line === '> ' ? 800 :
      line.startsWith('████') ? 600 :
        line.includes('……') ? 1200 :
          line.startsWith('__') ? 1500 :
            line.startsWith('节点') ? 250 :
              300;

    const timer = setTimeout(() => {
      setDisplayLines(prev => [...prev, lines[lineIndex]]);
      setLineIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, choice, lineIndex]);

  // 结局完成 → 记录并提供回溯
  const handleFinish = () => {
    if (choice) {
      completeEnding(choice);
    }
    setCurrentApp('desktop');
  };

  // 渲染单行
  const renderLine = (line: string, i: number) => {
    // V4 §8.3 血红色文字
    if (line.startsWith('__BLOOD__')) {
      const text = line.replace('__BLOOD__', '');
      return <div key={i} className="text-red-500 font-bold text-lg" style={{ animation: 'fade-in-up 0.3s ease-out' }}>{text}</div>;
    }
    // V4 §8.5 "我看到光了"
    if (line.startsWith('__LIGHT__')) {
      const text = line.replace('__LIGHT__', '');
      return <div key={i} className="text-white text-center text-lg font-bold my-4" style={{ animation: 'fade-in-up 0.5s ease-out' }}>{text}</div>;
    }
    // V4 §8.5 林晓微信
    if (line.startsWith('__WECHAT__')) {
      const text = line.replace('__WECHAT__', '');
      return (
        <div key={i} className="my-4 bg-[#1a1a1a] rounded-lg p-4 border border-green-900/30 max-w-xs mx-auto" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
          <div className="text-xs text-gray-500 mb-2 text-center">微信</div>
          <div className="bg-green-900/20 rounded-lg p-3">
            <div className="text-xs text-green-400 mb-1">林晓</div>
            <div className="text-sm text-green-300">{text.replace('林晓：', '')}</div>
          </div>
        </div>
      );
    }
    // V4 §8.5 特殊释放节点
    if (line.startsWith('__RELEASE__')) {
      const text = line.replace('__RELEASE__', '');
      return <div key={i} className="text-amber-300 font-bold" style={{ animation: 'fade-in-up 0.3s ease-out' }}>{text}</div>;
    }

    // 普通行
    const cn = line.includes('警告') || line.includes('失联') ? 'text-red-400' :
      line.includes('已释放') || line.includes('✓') ? 'text-green-400' :
        line.includes('∞') ? 'text-blue-400' :
          line.startsWith('> [结局') ? 'text-white font-bold mt-4' :
            line.startsWith('节点') ? 'text-[#00ff00]/60 text-xs' :
              line.startsWith('[█') || line.startsWith('█') ? 'text-[#00ff00]' :
                'text-[#00ff00]/80';

    return (
      <div key={i} className={cn} style={{ animation: 'fade-in-up 0.3s ease-out' }}>
        {line || '\u00A0'}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* ===== V4 §8.2 选择界面 ===== */}
      {phase === 'choice' && (
        <div className="max-w-xl w-full px-8 space-y-8">
          <div className="text-center space-y-3 font-mono text-sm">
            <div className="text-[#00ff00]">{'\> 系统检测到异常指令序列'}</div>
            <div className="text-[#00ff00]">{'\> 正在验证权限……'}</div>
            <div className="text-[#00ff00] mt-4">
              {`\> 检测到阵法覆写函数碎片：[${runeCount}/7]`}
            </div>

            {runeCount < 7 ? (
              <div className="mt-4 space-y-1 text-red-400/80 text-xs">
                <div>{`\> 警告：当前碎片数量不足（${runeCount}/7）`}</div>
                <div>{'  太乙救苦反编译阵列无法完整激活。'}</div>
                <div>{'  强行执行将导致部分节点未被覆盖，'}</div>
                <div>{'  系统将触发自修复程序。'}</div>
              </div>
            ) : (
              <div className="mt-4 space-y-1 text-green-400 text-xs">
                <div>{'\> 验证碎片完整性：[7/7] ✓'}</div>
                <div>{'  太乙救苦反编译阵列：就绪'}</div>
              </div>
            )}

            <div className="text-[#00ff00]/60 mt-6 text-xs">{'\> 可用选项：'}</div>
          </div>

          <div className="space-y-3">
            <EndingButton
              label="烈火洗城（格式化）"
              tag="A"
              completed={completedEndings.includes('A')}
              onClick={() => handleChoice('A')}
            />
            <EndingButton
              label="上行替代（伥鬼）"
              tag="B"
              completed={completedEndings.includes('B')}
              onClick={() => handleChoice('B')}
            />

            {canChooseC ? (
              <EndingButton
                label="七星破阵（太乙救苦）"
                tag="C"
                completed={completedEndings.includes('C')}
                onClick={() => handleChoice('C')}
              />
            ) : (
              <div className="w-full p-4 border border-gray-800 rounded-lg text-left font-mono text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700">[C]</span>
                  <span>???</span>
                </div>
                <p className="text-xs mt-1 text-gray-700">
                  {`\> 注：第三选项需要完整的七枚碎片方可显示。`}
                </p>
                <p className="text-xs text-gray-700">
                  {`  当前缺少：${missingRunes.join(', ')}`}
                </p>
              </div>
            )}
          </div>

          {completedEndings.length > 0 && (
            <div className="text-center text-xs text-gray-600 font-mono">
              已体验结局：{completedEndings.join(', ')}
            </div>
          )}

          {/* 返回调查按钮 (V4 §10.2 岔路三) */}
          <div className="text-center">
            <button
              className="text-xs text-gray-600 hover:text-gray-400 font-mono transition-colors"
              onClick={() => setCurrentApp('desktop')}
            >
              {'< 返回调查'}
            </button>
          </div>
        </div>
      )}

      {/* ===== V4 执行/显示 ===== */}
      {(phase === 'executing' || phase === 'display') && (
        <div className="max-w-2xl w-full px-8 max-h-[80vh] overflow-y-auto">
          <div className="font-mono text-sm space-y-1">
            {displayLines.map((line, i) => renderLine(line, i))}
          </div>

          {endingComplete && (
            <div className="mt-8 text-center">
              <button
                className="px-6 py-2 border border-white/20 text-white/60 rounded text-sm hover:bg-white/10 hover:text-white transition-colors font-mono"
                onClick={handleFinish}
              >
                {'>>> 返回桌面'}
              </button>

              {completedEndings.length < 2 && (
                <p className="text-xs text-gray-600 mt-3 font-mono">
                  // 系统检测到未完成的分支路径
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* GDD §8.5 赵启定时邮件 — 结局C选择前弹出 */}
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
                executeChoice('C');
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

// ── V4 结局选择按钮 ──
function EndingButton({ label, tag, completed, onClick }: {
  label: string; tag: string;
  completed?: boolean; onClick: () => void;
}) {
  return (
    <button
      className={`w-full p-4 border rounded-lg text-left transition-all font-mono text-sm
        ${completed
          ? 'border-gray-700/50 text-gray-500 hover:border-gray-600'
          : 'border-[#00ff00]/30 text-[#00ff00]/80 hover:border-[#00ff00]/60 hover:bg-[#00ff00]/5'
        }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-600 mr-2">[{tag}]</span>
          <span className={`font-bold ${completed ? 'line-through' : ''}`}>{label}</span>
        </div>
        {completed && <span className="text-xs text-gray-600">✓ 已体验</span>}
      </div>
    </button>
  );
}
