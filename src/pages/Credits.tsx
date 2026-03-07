import React, { useMemo, useState, useEffect } from 'react';

type ReplayId = 'ending_a' | 'ending_b' | 'ending_c';
type SegmentKind = 'normal' | 'code' | 'delta' | 'node_scroll';

interface SaveDataLite {
  completedEndings?: string[];
  playTimeSeconds?: number;
}

interface Segment {
  kind: SegmentKind;
  text?: string;
  pauseAfter?: number;
}

interface CreditsProps {
  onBack?: () => void;
  onReplay?: (id: ReplayId) => void;
}

const STORAGE_KEY = 'zhensuo_save_v3';

const REPLAY_SCRIPTS: Record<ReplayId, Segment[]> = {
  ending_a: [
    { kind: 'normal', text: '你执行了格式化指令。', pauseAfter: 1200 },
    { kind: 'normal', text: '液冷回路切断。\n热失控警报在无人值守的机房里响了三秒，然后也停了。', pauseAfter: 1500 },
    { kind: 'normal', text: '19,847个节点，\n没有名字，没有声音，\n在302秒内逐批离线。', pauseAfter: 1000 },
    { kind: 'normal', text: '最后一个是 LX-044-YIN。', pauseAfter: 3000 },
    { kind: 'code', text: '>系统终止。', pauseAfter: 2000 },
  ],
  ending_b: [
    { kind: 'normal', text: '替换进行中。', pauseAfter: 1200 },
    { kind: 'normal', text: 'LX-044-YIN 节点数据开始迁出。\n开始写入新数据。', pauseAfter: 500 },
    { kind: 'code', text: '00:11\n00:10\n00:09\n00:08\n00:07\n00:06\n00:05\n00:04\n00:03\n00:02\n00:01\n00:00', pauseAfter: 500 },
    { kind: 'code', text: '> 实验继续。', pauseAfter: 2000 },
  ],
  ending_c: [
    { kind: 'normal', text: '太乙救苦阵列激活。', pauseAfter: 1000 },
    { kind: 'normal', text: '太岁接口通道，逐层清除。', pauseAfter: 1500 },
    { kind: 'normal', text: '19,847个节点，\n开始释放。', pauseAfter: 800 },
    { kind: 'normal', text: '这个过程很慢。\n每一个都需要时间。', pauseAfter: 2000 },
    { kind: 'node_scroll', pauseAfter: 3000 },
    { kind: 'delta', text: '「我看到光了。」', pauseAfter: 5000 },
  ],
};

function formatPlaytime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(3, '0')}h${String(minutes).padStart(2, '0')}m`;
}

function isEndingCompleted(completed: string[], id: ReplayId): boolean {
  if (id === 'ending_a') return completed.includes('ending_a') || completed.includes('A');
  if (id === 'ending_b') return completed.includes('ending_b') || completed.includes('B');
  return completed.includes('ending_c') || completed.includes('C');
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function speedFor(kind: SegmentKind) {
  if (kind === 'code') return 25;
  if (kind === 'delta') return 200;
  return 40;
}

function NodeScrollBlock() {
  const lines = useMemo(() => {
    const out: string[] = ['……'];
    for (let i = 19648; i <= 19847; i += 1) {
      out.push(`NODE-${String(i).padStart(5, '0')} · RELEASED`);
    }
    out[out.length - 1] = 'NODE-19847 · LX-044-YIN · RELEASED';
    return out;
  }, []);

  return (
    <div className="font-mono text-green-500/90 text-sm leading-5 border border-green-900/40 bg-black/30 rounded p-4 max-h-[48vh] overflow-y-auto">
      {lines.map((line, idx) => (
        <div key={`${line}-${idx}`} className={line.includes('LX-044-YIN') ? 'text-white font-bold mt-2' : ''}>
          {line}
        </div>
      ))}
    </div>
  );
}

function EndingReplay({ id, onBack }: { id: ReplayId; onBack: () => void }) {
  const [lines, setLines] = useState<Array<{ text: string; kind: SegmentKind }>>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let canceled = false;
    const run = async () => {
      const script = REPLAY_SCRIPTS[id];
      setLines([]);
      setDone(false);
      for (const seg of script) {
        if (canceled) return;
        if (seg.kind === 'node_scroll') {
          setLines((prev) => [...prev, { text: '__NODE_SCROLL__', kind: seg.kind }]);
          await sleep(seg.pauseAfter ?? 800);
          continue;
        }
        const speed = speedFor(seg.kind);
        let acc = '';
        const text = seg.text ?? '';
        for (let i = 0; i < text.length; i += 1) {
          if (canceled) return;
          acc += text[i];
          setLines((prev) => {
            const cloned = [...prev];
            if (!cloned.length || cloned[cloned.length - 1].kind === 'node_scroll') {
              cloned.push({ text: acc, kind: seg.kind });
            } else {
              cloned[cloned.length - 1] = { text: acc, kind: seg.kind };
            }
            return cloned;
          });
          await sleep(speed);
        }
        await sleep(seg.pauseAfter ?? 800);
      }
      if (!canceled) setDone(true);
    };
    run();
    return () => {
      canceled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#050f0a] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="font-mono text-xs text-white/40 tracking-[0.4em]">ENDING REPLAY</div>
        <div className="space-y-3">
          {lines.map((line, idx) => {
            if (line.text === '__NODE_SCROLL__') {
              return <NodeScrollBlock key={`node-${idx}`} />;
            }
            const cls = line.kind === 'code'
              ? 'font-mono text-green-300 whitespace-pre-line'
              : line.kind === 'delta'
                ? 'font-serif text-center text-xl text-white/90'
                : 'font-serif whitespace-pre-line text-white/80';
            return <p key={`${line.kind}-${idx}`} className={cls}>{line.text}</p>;
          })}
        </div>
        {done && (
          <div className="pt-6">
            <button
              className="px-4 py-2 border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-colors"
              onClick={onBack}
            >
              返回致谢页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Credits({ onBack, onReplay }: CreditsProps = {}) {
  const [save, setSave] = useState<SaveDataLite>({});
  const [localReplay, setLocalReplay] = useState<ReplayId | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSave(raw ? JSON.parse(raw) : {});
    } catch {
      setSave({});
    }
  }, []);

  const completed = save.completedEndings ?? [];
  const playTimeSeconds = save.playTimeSeconds ?? 0;
  if (localReplay) {
    return (
      <EndingReplay
        id={localReplay}
        onBack={() => {
          setLocalReplay(null);
          onBack?.();
        }}
      />
    );
  }

  const items: Array<{ id: ReplayId; label: string }> = [
    { id: 'ending_a', label: '烈火洗城' },
    { id: 'ending_b', label: '上行替代' },
    { id: 'ending_c', label: '七星破阵' },
  ];

  return (
    <div className="min-h-screen bg-[#050f0a] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto flex flex-col min-h-[88vh]">
        <div className="text-center mt-8">
          <h1 className="font-mono text-white/40 tracking-[0.5em]">MERIDIAN LIFE SCIENCES</h1>
          <p className="text-[10px] text-white/20 mt-2">We remember everyone.</p>
        </div>

        <div className="w-3/5 mx-auto border-t border-white/10 mt-10" />

        <div className="text-center mt-10 space-y-2 font-serif text-white/60 leading-8">
          <p>感谢你的游玩。</p>
          <p>Thank you for playing.</p>
        </div>

        <div className="w-3/5 mx-auto border-t border-white/10 mt-10" />

        <div className="text-center mt-8">
          <p className="text-[10px] text-white/30 tracking-[0.2em]">— 其他结局 —</p>
          <div className="mt-5 flex justify-center gap-4 font-mono text-sm">
            {items.map((item) => {
              const enabled = isEndingCompleted(completed, item.id);
              return (
                <button
                  key={item.id}
                  className={`px-4 py-2 border transition-colors ${enabled
                    ? 'border-white/30 text-white/75 hover:border-white/60 hover:text-white'
                    : 'border-white/15 text-white/20 cursor-not-allowed'
                    }`}
                  disabled={!enabled}
                  onClick={() => {
                    if (!enabled) return;
                    setLocalReplay(item.id);
                    onReplay?.(item.id);
                  }}
                >
                  {`[ ${item.label} ]`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-3/5 mx-auto border-t border-white/10 mt-10" />

        <div className="mt-auto text-center text-[10px] text-white/15 font-mono pb-6">
          <p>{`PROJECT DELTA · Observation Log · Entry #${formatPlaytime(playTimeSeconds)}`}</p>
          <p className="mt-1">You were here.</p>
        </div>
      </div>
    </div>
  );
}
