import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../GameContext';

type LineTone = 'default' | 'warning' | 'muted';

type InputMode = 'locked' | 'command' | 'formatConfirm' | 'replaceId' | 'restoreConfirm';

interface TerminalLine {
  id: number;
  text: string;
  tone: LineTone;
  faded?: boolean;
}

interface WeiyiLine {
  text: string;
  tone?: LineTone;
}

const NORMAL_SPEED = 40;
const FORMAT_NODE_TARGET = 19846;
const RESTORE_NODE_START = 19648;
const RESTORE_NODE_END = 19846;

const RESTORE_NOTE_LINES: WeiyiLine[] = [
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', tone: 'muted' },
  { text: '' },
  { text: '如果你能读到这里，说明那七样东西，你都已经找到了。' },
  { text: '' },
  { text: '我不知道你是谁。' },
  { text: '我只希望，你不是诊所的人。' },
  { text: '如果你是，' },
  { text: '那你现在大概已经知道，该怎么处理我了。' },
  { text: '' },
  { text: '我把这个程序拆成七块，藏在不同的地方，' },
  { text: '不是为了故弄玄虚，' },
  { text: '也不是因为这样有趣。' },
  { text: '我只是想确认一件事：' },
  { text: '能走到这里的人，是真的把我留下的东西，一字一句都看完了。' },
  { text: '' },
  { text: '我进过 B2。' },
  { text: '我不打算描述我在那里看见了什么。' },
  { text: '我只想告诉你，' },
  { text: '那些人都是真的。' },
  { text: '他们不是档案，不是标签，也不是实验记录。' },
  { text: '他们付了钱，来到这里，' },
  { text: '以为自己只是来治失眠。' },
  { text: '他们有名字，有家人，' },
  { text: '有人还在等他们回家。' },
  { text: '可现在，他们只剩下编号。' },
  { text: '' },
  { text: '3月19号晚上，我运行了这个程序。' },
  { text: '程序跑到一半，系统警报响了。' },
  { text: '然后，他们来了。' },
  { text: '我不知道自己还有没有机会，把这封信写完。' },
  { text: '' },
  { text: '如果这个程序能顺利跑完，' },
  { text: '那些人就会被释放。' },
  { text: '可我不知道，“释放”到底意味着什么。' },
  { text: '也许是什么都不剩下，' },
  { text: '也许……还能留下些什么。' },
  { text: '但我知道一件事：' },
  { text: '继续把他们留在里面，绝对不对。' },
  { text: '' },
  { text: '我妈前几天还让我记得换空调滤网。' },
  { text: '我跟她说，等我回去就换。' },
  { text: '可这件事，' },
  { text: '我大概已经没机会做了。' },
  { text: '' },
  { text: '如果你可以，' },
  { text: '请帮我把这里关掉，' },
  { text: '' },
  { text: '然后，' },
  { text: '忘了这一切吧。' },
  { text: '' },
  { text: '——赵启' },
  { text: '2024-03-19 22:29' },
  { text: '' },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', tone: 'muted' },
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function formatPlaytime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(3, '0')}h${String(minutes).padStart(2, '0')}m`;
}

function padNode(node: number) {
  return String(node).padStart(5, '0');
}

export function Ending() {
  const {
    collectedRunes,
    playTimeSeconds,
    completeEnding,
    setCurrentApp,
    setEndingType,
    setErasureActive,
    addFact,
  } = useGame();

  const canRestore = collectedRunes.length === 7;

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('locked');
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(true);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const [centerText, setCenterText] = useState('');
  const [centerVisible, setCenterVisible] = useState(false);
  const [centerFading, setCenterFading] = useState(false);
  const [footerTiny, setFooterTiny] = useState('');
  const [flashLayer, setFlashLayer] = useState<'none' | 'red' | 'white'>('none');
  const [showCongrats, setShowCongrats] = useState(false);

  const lineIdRef = useRef(1);
  const canceledRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, centerText, centerVisible, footerTiny]);

  useEffect(() => {
    if (inputMode === 'locked') return;
    hiddenInputRef.current?.focus();
  }, [inputMode]);

  const appendLine = useCallback((text: string, tone: LineTone = 'default') => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    setLines((prev) => [...prev, { id, text, tone }]);
    return id;
  }, []);

  const updateLine = useCallback((id: number, text: string) => {
    setLines((prev) => {
      const index = prev.findIndex((line) => line.id === id);
      if (index < 0) return prev;
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  }, []);

  const markFaded = useCallback((ids: number[]) => {
    const idSet = new Set(ids);
    setLines((prev) => prev.map((line) => (idSet.has(line.id) ? { ...line, faded: true } : line)));
  }, []);

  const typeLine = useCallback(async (text: string, tone: LineTone = 'default', speed = NORMAL_SPEED) => {
    const id = appendLine('', tone);
    let built = '';
    for (const ch of text) {
      if (canceledRef.current) return id;
      built += ch;
      updateLine(id, built);
      await sleep(speed);
    }
    return id;
  }, [appendLine, updateLine]);

  const typeCenter = useCallback(async (text: string, speed = 200) => {
    setCenterText('');
    setCenterFading(false);
    setCenterVisible(true);
    let built = '';
    for (const ch of text) {
      if (canceledRef.current) return;
      built += ch;
      setCenterText(built);
      await sleep(speed);
    }
  }, []);

  const printAvailableCommands = useCallback(async () => {
    await typeLine('可用指令：', 'muted');
    appendLine('', 'muted');
    await typeLine('  FORMAT    ···  格式化全部节点', 'muted');
    await typeLine('  REPLACE   ···  替换异常节点', 'muted');
    if (canRestore) {
      await typeLine('  RESTORE   ···  执行中断进程', 'muted');
    }
  }, [canRestore, typeLine, appendLine]);

  const runStartup = useCallback(async () => {
    setLines([]);
    setInputMode('locked');
    setInputValue('');
    setBusy(true);
    setCursorBlinking(true);

    await typeLine('安宁深眠诊所 · 核心管理接口');
    await typeLine('DNR-CORE v4.7.2', 'muted');
    await sleep(800);

    await typeLine('身份验证中……');
    await typeLine('口令：太乙救苦');
    await typeLine('验证通过。');
    await sleep(600);

    await typeLine('正在加载系统状态……');
    await sleep(1200);

    await typeLine('节点总数：        19,847');
    await typeLine('活跃节点：        19,847');
    await typeLine('异常标记：        1', 'warning');
    appendLine('', 'muted');
    await typeLine('  └ LX-044-YIN');
    await typeLine('    接入时间：2024-01-10 09:32');
    await typeLine('    状态：长期滞留，未释放', 'warning');
    await typeLine('    备注：本体已离线', 'muted');
    appendLine('', 'muted');
    await typeLine('当前权限：OVERRIDE');
    await sleep(1000);

    if (canRestore) {
      await typeLine('> 检测到未完成进程', 'muted');
      await typeLine('> 所有者：mnt-8023 / zq', 'muted');
      await typeLine('> 创建时间：2024-03-19 22:28', 'muted');
      await typeLine('> 状态：中断', 'muted');
      await typeLine('> 正在恢复组件……', 'muted');
      await typeLine('> 组件完整性：7/7', 'muted');
      await typeLine('> 加载完成。', 'muted');
      await sleep(800);
    }

    await printAvailableCommands();

    if (canceledRef.current) return;
    setBusy(false);
    setInputMode('command');
  }, [appendLine, canRestore, printAvailableCommands, typeLine]);

  const runFormatNodeStream = useCallback(async () => {
    const specialNodes: Record<number, string> = {
      2847: 'gh_7291_wm',
      9344: 'gh_1122_yx',
      17203: 'gh_0203_mz',
    };
    const id = appendLine('', 'muted');
    const recent: string[] = [];
    const batchSize = 14;
    for (let start = 1; start <= FORMAT_NODE_TARGET; start += batchSize) {
      if (canceledRef.current) return;
      const end = Math.min(FORMAT_NODE_TARGET, start + batchSize - 1);
      for (let node = start; node <= end; node += 1) {
        const special = specialNodes[node];
        const line = special
          ? `NODE-${padNode(node)} · ${special} · 离线`
          : `NODE-${padNode(node)} · 离线`;
        recent.push(line);
        if (recent.length > 18) recent.shift();
      }
      const block = [`节点清除进度：${padNode(end)}/${FORMAT_NODE_TARGET}`, ...recent].join('\n');
      updateLine(id, block);
      await sleep(60);
    }
  }, [appendLine, updateLine]);

  const runEndingA = useCallback(async () => {
    await typeLine('正在断开液冷回路……        完成');
    await typeLine('正在静音热失控警报……      完成');
    await typeLine('初始化格式化序列……        完成');
    appendLine('', 'muted');

    await typeLine('开始执行。预计耗时：302秒。');
    await sleep(1500);

    await runFormatNodeStream();

    setCursorBlinking(false);
    await sleep(5000);

    await typeLine('NODE-19847 · LX-044-YIN · 林晓', 'default', 60);
    await sleep(4000);
    await typeLine('NODE-19847 · LX-044-YIN · 林晓 · 离线', 'default', 60);
    await sleep(2000);
    setCursorBlinking(true);

    await typeLine('格式化完成。');
    await typeLine('19,847 个节点已清除。');
    await typeLine('系统负载归零。');
    appendLine('', 'muted');

    await typeLine('正在生成操作日志……');
    await sleep(2000);
    await typeLine('操作员访问记录：');
    appendLine('', 'muted');
    await typeLine(`  首次接入：${formatPlaytime(playTimeSeconds)}`, 'muted');
    await typeLine('  执行指令：FORMAT → CONFIRM', 'muted');
    appendLine('', 'muted');
    await typeLine('检索关联人员档案……');
    appendLine('', 'muted');
    await typeLine('  姓名：赵启', 'muted');
    await typeLine('  工号：mnt-8023', 'muted');
    await typeLine('  职务：系统维护', 'muted');
    await typeLine('  最后登录：2024-03-19 22:28', 'muted');
    await typeLine('  当前状态：━━━━━━', 'muted');
    await typeLine('  档案备注：2024-03-19 后无记录。', 'muted');
    appendLine('', 'muted');
    await typeLine('  本系统无法定位上述人员。');
    await sleep(3000);

    const unable1 = await typeLine('无法定位。', 'warning');
    await sleep(800);
    const unable2 = await typeLine('无法定位。', 'warning');
    await sleep(800);
    const unable3 = await typeLine('无法定位。', 'warning');
    await sleep(2000);

    markFaded([unable1, unable2, unable3]);
    await sleep(1200);

    await typeLine('系统终止。');
    await sleep(1500);

    if (canceledRef.current) return;
    setErasureActive(true);
    completeEnding('ending_a');
    setCurrentApp('desktop');
  }, [appendLine, completeEnding, markFaded, playTimeSeconds, runFormatNodeStream, setCurrentApp, setErasureActive, typeLine]);

  const prepareFormat = useCallback(async () => {
    await typeLine('警告：此操作将永久删除全部 19,847 个节点。', 'warning');
    await typeLine('      数据不可恢复。', 'warning');
    appendLine('', 'muted');
    await typeLine('输入 CONFIRM 以执行：', 'muted');

    if (canceledRef.current) return;
    setBusy(false);
    setInputMode('formatConfirm');
  }, [appendLine, typeLine]);

  const runEndingB = useCallback(async (replacementId: string) => {
    await typeLine('正在迁出 LX-044-YIN 数据……     完成');
    await typeLine('正在写入替代节点……              完成');
    await typeLine('节点绑定确认……                  完成');
    appendLine('', 'muted');
    await typeLine('LX-044-YIN 数据状态：已迁出');
    await typeLine(`新节点 ${replacementId} 状态：写入完成`);
    await sleep(1000);
    await typeLine('实验继续。');
    await sleep(2000);

    const countdown = ['00:11', '00:10', '00:09', '00:08', '00:07', '00:06', '00:05', '00:04', '00:03', '00:02', '00:01', '00:00'];
    for (const item of countdown) {
      if (canceledRef.current) return;
      appendLine(item);
      await sleep(1000);
    }

    await sleep(1500);
    if (canceledRef.current) return;

    addFact('ending_b_mutation_active');
    completeEnding('ending_b');
    setCurrentApp('desktop');
  }, [addFact, appendLine, completeEnding, setCurrentApp, typeLine]);

  const prepareReplace = useCallback(async () => {
    await typeLine('目标节点：LX-044-YIN');
    await typeLine('操作说明：迁出现有意识数据，写入替代节点。');
    appendLine('', 'muted');
    await typeLine('替代节点将永久绑定至本会话身份。');
    appendLine('', 'muted');
    await typeLine('新节点标识符：');

    if (canceledRef.current) return;
    setBusy(false);
    setInputMode('replaceId');
  }, [appendLine, typeLine]);

  const prepareRestore = useCallback(async () => {
    await typeLine('加载进程：mnt-8023-zq / 太乙救苦阵列');
    await typeLine('创建时间：2024-03-19 22:28');
    await typeLine('中断时间：2024-03-19 22:30');
    await typeLine('中断原因：操作员会话强制终止');
    appendLine('', 'muted');
    await typeLine('检测组件完整性……');
    appendLine('', 'muted');

    for (let i = 1; i <= 7; i += 1) {
      await typeLine(`  RUNE #${String(i).padStart(2, '0')} ···  就绪`, 'muted');
    }

    appendLine('', 'muted');
    await typeLine('全部组件就绪。');
    await sleep(2000);
    await typeLine('检测到附件文件。');
    await typeLine('附件类型：文本');
    await typeLine('创建者：mnt-8023');
    await typeLine('权限：仅在全部组件就绪时可读');
    appendLine('', 'muted');
    await typeLine('正在解锁……');
    await sleep(1500);

    for (const line of RESTORE_NOTE_LINES) {
      if (canceledRef.current) return;
      if (line.text.length === 0) {
        appendLine('', line.tone ?? 'default');
        await sleep(600);
        continue;
      }
      await typeLine(line.text, line.tone ?? 'default', 25);
      await sleep(600);
    }

    await sleep(5000);
    await typeLine('附件读取完毕。');
    appendLine('', 'muted');
    await typeLine('输入 Y 执行进程：', 'muted');

    if (canceledRef.current) return;
    setBusy(false);
    setInputMode('restoreConfirm');
  }, [appendLine, typeLine]);

  const runRestoreNodeStream = useCallback(async () => {
    const id = appendLine('', 'muted');
    const recent: string[] = [];
    for (let node = RESTORE_NODE_START; node <= RESTORE_NODE_END; node += 1) {
      if (canceledRef.current) return;
      recent.push(`NODE-${padNode(node)} · 已释放`);
      if (recent.length > 16) recent.shift();
      updateLine(id, recent.join('\n'));
      await sleep(80);
    }
  }, [appendLine, updateLine]);

  const runEndingC = useCallback(async () => {
    await typeLine('太乙救苦阵列启动。');
    appendLine('', 'muted');
    await typeLine('接口通道逐层清除中……');
    await sleep(1000);

    await runRestoreNodeStream();

    await sleep(6000);
    await typeLine('NODE-19847 · LX-044-YIN · 林晓', 'default', 80);
    await sleep(4000);
    await typeLine('NODE-19847 · LX-044-YIN · 林晓 · 已释放', 'default', 80);
    await sleep(3000);

    await typeCenter('「我看到光了。」', 200);
    await sleep(5000);
    setCenterFading(true);
    await sleep(1000);
    setFooterTiny('进程 mnt-8023-zq 已完成。');
    await sleep(2000);
    setFooterTiny('');
    await sleep(1000);
    setCenterVisible(false);
    setCenterText('');
    setCenterFading(false);

    setLines([]);
    await sleep(8000);

    await typeLine('PROJECT DELTA · Phase III · FAILED', 'warning', 60);
    await sleep(1500);
    await typeLine('PROJECT DELTA · Phase IV · ACTIVE', 'warning', 60);
    await sleep(1000);

    setShowCongrats(true);
    await sleep(1000);
    setShowCongrats(false);

    for (let i = 0; i < 3; i += 1) {
      if (canceledRef.current) return;
      setFlashLayer('red');
      await sleep(140);
      setFlashLayer('none');
      await sleep(120);
    }
    setFlashLayer('white');
    await sleep(180);
    setFlashLayer('none');

    if (canceledRef.current) return;
    setErasureActive(true);
    completeEnding('ending_c');
    setCurrentApp('credits');
  }, [appendLine, completeEnding, runRestoreNodeStream, setCurrentApp, setErasureActive, typeCenter, typeLine]);

  useEffect(() => {
    canceledRef.current = false;
    void runStartup();
    return () => {
      canceledRef.current = true;
    };
  }, [runStartup]);

  const submit = useCallback((raw: string) => {
    if (inputMode === 'locked' || busy) return;
    const value = raw.trim();
    if (!value) return;

    const upper = value.toUpperCase();
    setInputValue('');
    appendLine(`> ${value}`);

    if (inputMode === 'command') {
      if (upper === 'FORMAT') {
        setEndingType('A');
        setInputMode('locked');
        setBusy(true);
        void prepareFormat();
        return;
      }
      if (upper === 'REPLACE') {
        setEndingType('B');
        setInputMode('locked');
        setBusy(true);
        void prepareReplace();
        return;
      }
      if (upper === 'RESTORE') {
        if (!canRestore) {
          appendLine('> 权限不足，缺少必要组件', 'warning');
          return;
        }
        setEndingType('C');
        setInputMode('locked');
        setBusy(true);
        void prepareRestore();
        return;
      }
      appendLine('> 未知指令', 'warning');
      return;
    }

    if (inputMode === 'formatConfirm') {
      if (upper !== 'CONFIRM') {
        appendLine('> 未知指令', 'warning');
        return;
      }
      setInputMode('locked');
      setBusy(true);
      void runEndingA();
      return;
    }

    if (inputMode === 'replaceId') {
      setInputMode('locked');
      setBusy(true);
      void runEndingB(value);
      return;
    }

    if (inputMode === 'restoreConfirm') {
      if (upper !== 'Y') {
        appendLine('> 未知指令', 'warning');
        return;
      }
      setInputMode('locked');
      setBusy(true);
      void runEndingC();
      return;
    }
  }, [appendLine, busy, canRestore, inputMode, prepareFormat, prepareReplace, prepareRestore, runEndingA, runEndingB, runEndingC, setEndingType]);

  return (
    <div
      className="fixed inset-0 bg-black text-green-300 font-mono flex flex-col"
      onClick={() => {
        if (inputMode !== 'locked') {
          hiddenInputRef.current?.focus();
        }
      }}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
        {lines.map((line) => {
          const toneClass = line.tone === 'warning'
            ? 'text-red-400'
            : line.tone === 'muted'
              ? 'text-zinc-500'
              : 'text-green-300';
          return (
            <p
              key={line.id}
              className={`whitespace-pre-wrap break-words leading-6 ${toneClass} transition-opacity duration-[1200ms] ${line.faded ? 'opacity-0' : 'opacity-100'}`}
            >
              {line.text || ' '}
            </p>
          );
        })}
      </div>

      {centerVisible && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center text-white font-serif text-4xl transition-opacity duration-[2000ms] ${centerFading ? 'opacity-0' : 'opacity-100'}`}
        >
          {centerText}
        </div>
      )}

      {footerTiny && (
        <div className="pointer-events-none absolute bottom-14 left-0 right-0 text-center text-[10px] text-zinc-600">
          {footerTiny}
        </div>
      )}

      {showCongrats && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-zinc-100 text-xs">
          恭喜！
        </div>
      )}

      {flashLayer !== 'none' && (
        <div className={`pointer-events-none absolute inset-0 ${flashLayer === 'red' ? 'bg-red-700' : 'bg-white'}`} />
      )}

      <div className="border-t border-zinc-800 px-6 py-3 bg-black/95">
        <div className="flex items-center gap-2 text-green-300">
          <span>&gt;</span>
          <span className="whitespace-pre-wrap break-all">{inputMode === 'locked' ? '' : inputValue}</span>
          <span className={`${cursorBlinking ? 'animate-pulse' : ''}`}>▋</span>
        </div>
        <input
          ref={hiddenInputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              submit(inputValue);
            }
          }}
          disabled={inputMode === 'locked'}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
