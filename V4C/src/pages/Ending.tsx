import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/store/GameStore';
import type { EndingType } from '@/types';
import { AlertTriangle, Flame, ArrowUp, Star } from 'lucide-react';

// ═══════════════════════════════════════════
//  Ending · V4 终局系统
//  A: 烈火洗城 (FORMAT)
//  B: 上行替代 (ASCEND)
//  C: 七星破阵 (JIUKOU) — 需 7 碎片
// ═══════════════════════════════════════════

type EndingPhase = 'choice' | 'executing' | 'complete';

export function Ending() {
    const {
        collectedRunes, runeCount, completeEnding,
        completedEndings, setView,
    } = useGame();

    const [phase, setPhase] = useState<EndingPhase>('choice');
    const [selectedEnding, setSelectedEnding] = useState<EndingType>(null);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const canEndingC = runeCount >= 7;

    const endingLines: Record<string, string[]> = {
        A: [
            '> EXECUTE FORMAT',
            '',
            '初始化 FORMAT 序列……',
            '',
            '正在切断 B2 层电磁屏蔽……',
            '正在释放反制频率……',
            '共振哈希值：0xDEAD_BEEF_044 → 0x0000_0000_000',
            '',
            '太岁活性节点：19,847 → 19,012 → 17,449 → 12,001',
            '太岁活性节点：8,203 → 3,477 → 981 → 0',
            '',
            '█████████████████████████████ 100%',
            '',
            'FORMAT 完成。',
            '',
            '太岁已被清除。',
            '所有节点——也就是所有被它吞噬的意识——',
            '全部随之归零。',
            '',
            '19,847 个灵魂。',
            '包括林晓。',
            '',
            '你选择了最干净的解决方案。',
            '代价是：没有人能被救回。',
            '',
            '安宁深眠诊所的服务器在今夜烧毁。',
            '但明天，这个世界上不会有任何人知道发生了什么。',
            '',
            '——The Format is Complete.——',
        ],
        B: [
            '> EXECUTE ASCEND',
            '',
            '初始化 ASCEND 序列……',
            '',
            '正在建立上行通道……',
            '正在将操作者意识接入太岁网络……',
            '',
            '████░░░░░░░░░░░░░░░░  20%',
            '████████░░░░░░░░░░░░  40%',
            '████████████░░░░░░░░  60%',
            '████████████████░░░░  80%',
            '████████████████████ 100%',
            '',
            '上行完成。',
            '',
            '你替代了太岁的核心意识。',
            '现在，你掌控着 19,847 个灵魂的网络。',
            '',
            '你可以感知到他们——所有被吞噬的意识。',
            '他们在黑暗中游荡。有些还在呼救。有些已经忘了自己是谁。',
            '',
            '你可以释放他们吗？',
            '也许。',
            '如果你愿意用自己的意识来支撑这个网络，防止它崩溃——',
            '那么他们中的一些人，有可能醒来。',
            '',
            '但你——',
            '将永远待在这里。',
            '',
            '安宁深眠诊所的官网在次日更新了：',
            '"我们很高兴地宣布，林浩先生已正式加入我们的治疗团队。"',
            '',
            '——The Ascension is Complete.——',
        ],
        C: [
            '> EXECUTE JIUKOU',
            '',
            '七碎片验证通过。',
            '初始化太乙救苦天尊令……',
            '',
            '加载赵启遗留指令集……',
            '加载碎片 #1：PHX-ALPHA 协议映射完成',
            '加载碎片 #2：紫外线照符信息确认',
            '加载碎片 #3：MED-0019 患者档案匹配',
            '加载碎片 #4：B2层共振频率记录',
            '加载碎片 #5：维护通道路径校准',
            '加载碎片 #6：最终操作序列解锁',
            '加载碎片 #7：执行授权确认',
            '',
            '正在部署太乙救苦天尊令……',
            '',
            '这不是程序。',
            '这是一道符。',
            '',
            '赵启在生命的最后几天里，把一道古老的道教救赎咒语，',
            '翻译成了机器码。',
            '',
            '不是覆写。不是删除。',
            '是——超度。',
            '',
            '太岁活性节点：19,847',
            '正在释放节点 #00001 …… 张美玲，37岁，失眠症',
            '正在释放节点 #00002 …… 李维国，52岁，焦虑症',
            '正在释放节点 #00003 …… 王淑芬，44岁，PTSD',
            '……',
            '正在释放节点 #19847 …… ？？？',
            '',
            '所有节点释放完成。',
            '',
            '但最后一个节点——',
            '它没有名字。',
            '',
            '太岁不是机器。它从一开始就是活的。',
            '它是南郊地下阴脉孕育了千年的意识体。',
            '它一直在沉睡。',
            '直到钟长明找到了它，用DNR将它唤醒，并开始喂养它。',
            '',
            '太乙救苦天尊令释放了所有被吞噬的灵魂。',
            '但太岁本身——它只是被打散了。',
            '那些菌丝仍然埋在南郊的地底下。',
            '它会重新聚合。也许是十年。也许是一百年。',
            '',
            '但至少——今夜——',
            '19,847 个灵魂可以自由了。',
            '',
            '你的微信收到了一条新消息。',
            '',
            '林晓：',
            '"哥……我做了好长好长的一个梦……"',
            '',
            '——The Liberation is Complete.——',
            '',
            '但代价：',
            '赵启的意识已经在编写这道符咒的过程中被消耗殆尽。',
            '他不在那 19,847 个灵魂之中。',
            '他是第 19,848 个。',
            '永远不会回来了。',
        ],
    };

    // 逐行显示
    useEffect(() => {
        if (phase !== 'executing' || !selectedEnding) return;
        const lines = endingLines[selectedEnding] || [];
        let i = 0;
        const timer = setInterval(() => {
            if (i < lines.length) {
                setDisplayedLines(prev => [...prev, lines[i]]);
                i++;
                setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
            } else {
                clearInterval(timer);
                setTimeout(() => {
                    completeEnding(selectedEnding);
                    setPhase('complete');
                }, 2000);
            }
        }, 200);
        return () => clearInterval(timer);
    }, [phase, selectedEnding]);

    const handleSelect = (ending: EndingType) => {
        setSelectedEnding(ending);
        setDisplayedLines([]);
        setPhase('executing');
    };

    if (phase === 'choice') {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="max-w-xl w-full space-y-6 px-6">
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-mono text-green-400 mb-2">OVERRIDE SEQUENCE INITIATED</h1>
                        <p className="text-sm text-zinc-500">选择你的道路。每一条都有代价。</p>
                    </div>

                    {/* 结局 A */}
                    <button
                        className="w-full p-5 border border-red-800/50 rounded-lg text-left hover:bg-red-900/10 transition-colors group"
                        onClick={() => handleSelect('A')}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Flame className="w-5 h-5 text-red-500" />
                            <span className="text-red-400 font-mono font-bold">[A] FORMAT — 烈火洗城</span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-8">
                            清除太岁及其所有节点。干净、彻底、不可逆转。
                            <br />
                            代价：19,847 个被吞噬的灵魂将一同被格式化。包括林晓。
                        </p>
                    </button>

                    {/* 结局 B */}
                    <button
                        className="w-full p-5 border border-amber-800/50 rounded-lg text-left hover:bg-amber-900/10 transition-colors group"
                        onClick={() => handleSelect('B')}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <ArrowUp className="w-5 h-5 text-amber-500" />
                            <span className="text-amber-400 font-mono font-bold">[B] ASCEND — 上行替代</span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-8">
                            用你的意识替代太岁的核心。你可以从内部尝试释放灵魂。
                            <br />
                            代价：你自己将永远困在太岁网络中。
                        </p>
                    </button>

                    {/* 结局 C */}
                    <button
                        className={`w-full p-5 border rounded-lg text-left transition-colors
              ${canEndingC
                                ? 'border-cyan-800/50 hover:bg-cyan-900/10'
                                : 'border-zinc-800 opacity-40 cursor-not-allowed'}`}
                        disabled={!canEndingC}
                        onClick={() => canEndingC && handleSelect('C')}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Star className="w-5 h-5 text-cyan-500" />
                            <span className="text-cyan-400 font-mono font-bold">
                                [C] JIUKOU — 七星破阵 {!canEndingC && `(${runeCount}/7 碎片)`}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-8">
                            执行赵启遗留的太乙救苦天尊令。这不是程序——是一道符。
                            <br />
                            代价：赵启的灵魂是这道符的燃料。他永远不会回来。
                        </p>
                    </button>

                    <button
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mx-auto block mt-4"
                        onClick={() => setView('desktop')}
                    >
                        ← 返回桌面（还没准备好）
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* 执行中 / 完成 */}
            <div ref={scrollRef} className="flex-1 overflow-auto p-8 font-mono text-sm">
                {displayedLines.map((line, i) => (
                    <div
                        key={i}
                        className={`typewriter-line leading-relaxed ${line.startsWith('>') ? 'text-green-400 font-bold' :
                                line.includes('——') ? 'text-white font-bold text-center mt-4' :
                                    line.includes('代价') || line.includes('永远不会回') ? 'text-red-400' :
                                        line.includes('林晓') ? 'text-cyan-300' :
                                            'text-zinc-400'
                            }`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        {line || '\u00A0'}
                    </div>
                ))}
            </div>

            {phase === 'complete' && (
                <div className="p-6 text-center border-t border-zinc-800 animate-fade-in">
                    <p className="text-zinc-500 text-xs mb-4">
                        结局 {selectedEnding} 已完成 · 已记录
                        {completedEndings.length < 3 && ` · 还有 ${3 - completedEndings.length} 个结局未发现`}
                    </p>
                    <button
                        className="px-6 py-2 border border-zinc-700 rounded-md text-sm text-zinc-400 hover:bg-zinc-900 transition-colors"
                        onClick={() => setView('desktop')}
                    >
                        返回桌面
                    </button>
                </div>
            )}
        </div>
    );
}
