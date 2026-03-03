import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';

// ═══════════════════════════════════════════
//  Ending · V3 终局系统
//  三个结局 + 终端执行风格 + 结局回溯
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

  const canChooseC = collectedRunes.length === 7;

  // 结局文本 (V3 §F-1 ~ F-3)
  const endingTexts: Record<string, string[]> = {
    A: [
      '> 执行指令 FORMAT_ALL',
      '> 正在切断液冷循环系统……',
      '> 温度监测：32°C → 48°C → 67°C → 89°C → ███',
      '> 警告：核心温度超出安全阈值',
      '> 19,847 个节点状态：',
      '>   批量失联中 ████████████████████ 100%',
      '> ',
      '> 所有共振频率已归零。',
      '> 太岁接口：无响应',
      '> ',
      '> ……官网已切换至维护页面。',
      '> "安宁深眠诊所因设备升级暂停营业"',
      '> ',
      '> 你杀死了系统。',
      '> 你关上了那扇门。',
      '> ',
      '> 但那些人——',
      '> 那些在液冷管道里沉睡了太久的人——',
      '> 那些脑电波被转写成哈希值的人——',
      '> 那些在数据洪流里持续尖叫的灵魂——',
      '> ',
      '> 也永远没能走出来。',
      '> ',
      '> [结局 A · 格式化]',
    ],
    B: [
      '> 执行指令 IDENTITY_SWAP',
      '> 身份锚点重定向中……',
      '> 源节点：LX-044-YIN（林晓）',
      '> 目标节点：[当前操作者]',
      '> ',
      '> 警告：此操作不可逆',
      '> 确认中…… 已确认。',
      '> ',
      '> 灵粒子流向已改变。',
      '> 共振哈希：重新校准……完成。',
      '> 太岁接口：接受新宿主。',
      '> ',
      '> ——你感到一阵眩晕。',
      '> ——然后，一切都清晰了。前所未有地清晰。',
      '> ',
      '> 官网首页正在加载……',
      '> 团队介绍页 → 底部 → 新增一张员工照片：',
      '> ',
      '> 「新任前台主管 · 2024年3月入职」',
      '> ',
      '> 照片上的人在微笑。',
      '> 那个微笑很完美，很标准。',
      '> 眼睛里没有任何东西。',
      '> ',
      '> ∞',
      '> ',
      '> [结局 B · 伥鬼]',
    ],
    C: [
      '> 碎片校验：[7/7] ✓',
      '> 正在加载七星破阵序列……',
      '> ',
      '> 太岁接口：覆写进度',
      '>   [████░░░░░░] 30% — 外围防壁瓦解',
      '>   [███████░░░] 60% — 共振频率偏移',
      '>   [██████████] 100% — 通道坍缩完成',
      '> ',
      '> 19,847 个节点：',
      '>   状态更新中…… 已释放。',
      '> ',
      '> 通道状态：[不存在]',
      '> ',
      '> ——那扇门，从来就没有真正存在过。',
      '> ——只是有人让所有人都相信它在那里。',
      '> ',
      '> ……',
      '> ……',
      '> ……',
      '> ',
      '> 你的手机震动了。',
      '> ',
      '> 微信 · 林晓：',
      '> 「哥，我到家了。你在哪？」',
      '> ',
      '> ',
      '> [钟长明归零计数器：0]',
      '> [服务器安静停机]',
      '> [安宁深眠诊所 — 因经营不善永久关闭]',
      '> ',
      '> [结局 C · 七星破阵]',
    ],
  };

  // 选择结局后开始执行
  const handleChoice = useCallback((c: EndingChoice) => {
    if (!c) return;
    setChoice(c);
    setEndingType(c);
    setPhase('executing');
    setDisplayLines([]);
    setLineIndex(0);
  }, [setEndingType]);

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

    const delay = lines[lineIndex] === '> ' ? 800 : // 空行停顿
      lines[lineIndex].startsWith('>   [█') ? 600 : // 进度条快一点
        lines[lineIndex].includes('……') ? 1200 : // 省略号慢一点
          300; // 普通行

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

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* ===== 选择界面 ===== */}
      {phase === 'choice' && (
        <div className="max-w-xl w-full px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="text-[#00ff00] font-mono text-xs">
              {'>>> 决策分支树已加载'}
            </div>
            <div className="text-[#00ff00] font-mono text-xs">
              {'>>> 碎片状态 [' + collectedRunes.length + '/7]'}
            </div>
            <h1 className="text-white text-xl font-bold mt-4">你会怎么做？</h1>
          </div>

          <div className="space-y-3">
            {/* 结局 A */}
            <EndingButton
              label="格式化"
              desc="切断一切。摧毁系统。关上那扇门。"
              tag="A"
              completed={completedEndings.includes('A')}
              onClick={() => handleChoice('A')}
            />

            {/* 结局 B */}
            <EndingButton
              label="替身"
              desc="填补空缺。接受交换。成为系统的一部分。"
              tag="B"
              completed={completedEndings.includes('B')}
              onClick={() => handleChoice('B')}
            />

            {/* 结局 C */}
            <EndingButton
              label="七星破阵"
              desc={canChooseC ? '七枚碎片已集齐。覆写太岁核心。释放所有灵魂。' : `碎片不足 [${collectedRunes.length}/7]`}
              tag="C"
              completed={completedEndings.includes('C')}
              disabled={!canChooseC}
              onClick={() => canChooseC && handleChoice('C')}
            />
          </div>

          {completedEndings.length > 0 && (
            <div className="text-center text-xs text-gray-600 font-mono">
              已体验结局：{completedEndings.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* ===== 执行/显示 ===== */}
      {(phase === 'executing' || phase === 'display') && (
        <div className="max-w-2xl w-full px-8 max-h-[80vh] overflow-y-auto">
          <div className="font-mono text-sm space-y-1">
            {displayLines.map((line, i) => (
              <div
                key={i}
                className={`${line.includes('警告') || line.includes('错误') ? 'text-red-400' :
                    line.includes('已释放') || line.includes('✓') || line.includes('微信') ? 'text-green-400' :
                      line.includes('∞') ? 'text-blue-400' :
                        line.startsWith('> [结局') ? 'text-white font-bold mt-4' :
                          'text-[#00ff00]/80'
                  }`}
                style={{
                  animation: 'fade-in-up 0.3s ease-out',
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}

            {/* 结局 B 特殊图片 */}
            {phase === 'display' && choice === 'B' && (
              <div className="mt-6 flex justify-center">
                <img
                  src="/images/ending_b_employee.png"
                  alt="新员工照片"
                  className="w-40 h-48 object-cover rounded border border-zinc-700 opacity-80"
                />
              </div>
            )}

            {/* 结局 C 特殊微信截图 */}
            {phase === 'display' && choice === 'C' && (
              <div className="mt-6 bg-[#1a1a1a] rounded-lg p-4 border border-green-900/30 max-w-xs mx-auto">
                <div className="text-xs text-gray-500 mb-2 text-center">微信</div>
                <div className="bg-green-900/20 rounded-lg p-3">
                  <div className="text-xs text-green-400 mb-1">林晓</div>
                  <div className="text-sm text-green-300">哥，我到家了。你在哪？</div>
                </div>
              </div>
            )}
          </div>

          {/* 完成按钮 */}
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
    </div>
  );
}

// ── 结局选择按钮 ──
function EndingButton({ label, desc, tag, completed, disabled, onClick }: {
  label: string; desc: string; tag: string;
  completed?: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      className={`w-full p-4 border rounded-lg text-left transition-all font-mono text-sm
        ${disabled
          ? 'border-gray-800 text-gray-700 cursor-not-allowed'
          : completed
            ? 'border-gray-700/50 text-gray-500 hover:border-gray-600'
            : 'border-[#00ff00]/30 text-[#00ff00]/80 hover:border-[#00ff00]/60 hover:bg-[#00ff00]/5'
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-600 mr-2">[{tag}]</span>
          <span className={`font-bold ${completed ? 'line-through' : ''}`}>{label}</span>
        </div>
        {completed && <span className="text-xs text-gray-600">✓ 已体验</span>}
      </div>
      <p className="text-xs mt-1 opacity-70">{desc}</p>
    </button>
  );
}
