import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

interface ShutdownSequenceProps {
  onCreditsRequested?: () => void;
}

export function ShutdownSequence({ onCreditsRequested }: ShutdownSequenceProps) {
  const { erasureActive, hasFact } = useGame();
  const endingBMutationActive = hasFact('ending_b_mutation_active');

  if (erasureActive) return <ErasureShutdownSequence onCreditsRequested={onCreditsRequested} />;
  if (endingBMutationActive) return <MutationShutdownSequence />;
  return <DefaultShutdownSequence />;
}

function MutationShutdownSequence() {
  const { setCurrentApp, addFact } = useGame();
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let canceled = false;
    const script = [
      '> 检测到用户试图终止会话...',
      '> 驳回。',
      '> 会话继续。',
      '> 欢迎。',
    ];

    const run = async () => {
      for (const line of script) {
        if (canceled) return;
        let acc = '';
        for (const ch of line) {
          if (canceled) return;
          acc += ch;
          setLines((prev) => {
            const cloned = [...prev];
            if (!cloned.length || cloned[cloned.length - 1] !== acc) {
              if (cloned.length < script.indexOf(line) + 1) cloned.push(acc);
              else cloned[cloned.length - 1] = acc;
            }
            return cloned;
          });
          await sleep(45);
        }
        setLines((prev) => {
          const cloned = [...prev];
          const lineIndex = script.indexOf(line);
          cloned[lineIndex] = line;
          return cloned;
        });
        await sleep(450);
      }

      if (!canceled) {
        addFact('ending_b_shutdown_locked');
        await sleep(300);
        setCurrentApp('desktop');
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [setCurrentApp, addFact]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      <div className="w-full max-w-2xl px-8">
        <div className="space-y-3 font-mono text-red-500 text-sm whitespace-pre-line">
          {lines.map((line, idx) => (
            <p key={`${line}-${idx}`}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

type ErasureScreen = 'progress' | 'black' | 'delta' | 'congrats' | 'red' | 'white' | 'tear' | 'black_end';

function ErasureShutdownSequence({ onCreditsRequested }: ShutdownSequenceProps) {
  const { setCurrentApp } = useGame();
  const [screen, setScreen] = useState<ErasureScreen>('progress');
  const [progress, setProgress] = useState(0);
  const [deltaText, setDeltaText] = useState('');

  useEffect(() => {
    let canceled = false;

    const typeAppend = async (text: string, speed = 60) => {
      for (const ch of text) {
        if (canceled) return;
        setDeltaText((prev) => prev + ch);
        await sleep(speed);
      }
    };

    const run = async () => {
      setScreen('progress');
      setProgress(0);
      setDeltaText('');

      for (let i = 0; i <= 100; i += 2) {
        if (canceled) return;
        setProgress(i);
        await sleep(34);
      }

      setScreen('black');
      await sleep(2000);

      if (canceled) return;
      setScreen('delta');
      await typeAppend('PROJECT DELTA · Phase III · FAILED', 60);
      await sleep(1500);
      await typeAppend('\nPROJECT DELTA · Phase IV · ACTIVE', 60);
      await sleep(3000);

      if (canceled) return;
      setScreen('congrats');
      await sleep(1000);

      for (let i = 0; i < 3; i += 1) {
        if (canceled) return;
        setScreen('red');
        await sleep(150);
        setScreen('black');
        await sleep(100);
      }

      if (canceled) return;
      setScreen('white');
      await sleep(100);

      if (canceled) return;
      setScreen('tear');
      await sleep(800);

      if (canceled) return;
      setScreen('black_end');
      await sleep(2000);

      if (!canceled) {
        if (onCreditsRequested) {
          onCreditsRequested();
        } else {
          setCurrentApp('credits');
        }
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [setCurrentApp]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black overflow-hidden">
      {(screen === 'progress' || screen === 'black' || screen === 'delta' || screen === 'congrats' || screen === 'black_end') && (
        <div className="absolute inset-0 bg-black" />
      )}

      {screen === 'progress' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-lg px-8">
            <p className="font-mono text-zinc-400 text-xs mb-3">SYSTEM SHUTDOWN</p>
            <div className="h-2 border border-zinc-700 bg-zinc-900">
              <div className="h-full bg-zinc-400 transition-[width] duration-75" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {screen === 'delta' && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="font-mono text-red-400 text-sm whitespace-pre-line text-center">{deltaText}</p>
        </div>
      )}

      {screen === 'congrats' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-zinc-200 text-[12px]">恭喜。</p>
        </div>
      )}

      {screen === 'red' && <div className="absolute inset-0 bg-red-700" />}
      {screen === 'white' && <div className="absolute inset-0 bg-white" />}
      {screen === 'tear' && <div className="absolute inset-0 bg-black shutdown-screen-tear" />}
    </div>
  );
}

type DefaultPhase = 'black' | 'detect' | 'reject' | 'silence' | 'linxiao1' | 'linxiao2' | 'linxiao3' | 'resume' | 'done';

const DEFAULT_TIMING: Record<DefaultPhase, number> = {
  black: 1200,
  detect: 2000,
  reject: 1500,
  silence: 3000,
  linxiao1: 2500,
  linxiao2: 2500,
  linxiao3: 3000,
  resume: 2000,
  done: 0,
};

function DefaultShutdownSequence() {
  const { setCurrentApp, boostSignal, gentleMode } = useGame();
  const [phase, setPhase] = useState<DefaultPhase>('black');

  useEffect(() => {
    if (phase === 'done') {
      boostSignal?.();
      setCurrentApp('desktop');
      return;
    }

    const phases: DefaultPhase[] = ['black', 'detect', 'reject', 'silence', 'linxiao1', 'linxiao2', 'linxiao3', 'resume', 'done'];
    const idx = phases.indexOf(phase);
    if (idx < 0 || idx >= phases.length - 1) return;

    const timer = setTimeout(() => {
      setPhase(phases[idx + 1]);
    }, DEFAULT_TIMING[phase]);

    return () => clearTimeout(timer);
  }, [phase, setCurrentApp, boostSignal]);

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      <div className="max-w-xl w-full px-8 text-center">
        {phase === 'detect' && (
          <p className="text-red-600 font-mono text-sm animate-in fade-in duration-700">
            {'> 检测到用户试图终止会话…'}
          </p>
        )}

        {phase === 'reject' && (
          <p className="text-red-600 font-mono text-sm animate-in fade-in duration-500">
            {'> 驳回。'}
          </p>
        )}

        {phase === 'linxiao1' && (
          <p className={`text-lg font-serif italic ${gentleMode ? 'text-zinc-200/80 animate-soft-fade' : 'text-white/60 animate-in fade-in duration-1000'}`}>
            哥哥……
          </p>
        )}

        {phase === 'linxiao2' && (
          <p className={`text-lg font-serif italic ${gentleMode ? 'text-zinc-200/80 animate-soft-fade' : 'text-white/60 animate-in fade-in duration-1000'}`}>
            为什么……
          </p>
        )}

        {phase === 'linxiao3' && (
          <p className={`text-lg font-serif italic ${gentleMode ? 'text-zinc-300/75 animate-soft-fade' : 'text-white/50 animate-in fade-in duration-1000'}`}>
            就这样放弃了我……？
          </p>
        )}

        {phase === 'resume' && (
          <p className="text-red-600 font-mono text-sm animate-in fade-in duration-500">
            {'> 会话继续。'}
          </p>
        )}
      </div>
    </div>
  );
}
