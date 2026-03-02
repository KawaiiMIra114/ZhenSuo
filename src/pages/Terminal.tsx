import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';

export function Terminal() {
  const { fragments, setCurrentApp, setEndingType } = useGame();
  const [lines, setLines] = useState<string[]>([]);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setLines([]);
    setShowButtons(false);
    
    const sequence = [
      "INITIATING DEEP SCAN PROTOCOL...",
      "WARNING: UNAUTHORIZED ACCESS DETECTED.",
      "OVERRIDE CODE ACCEPTED.",
      "BYPASSING SECURITY LAYERS...",
      "ACCESSING CORE ARRAY...",
      "...",
      "[节点 LX-044-YIN 意识碎片接入中……]",
      "……哥？",
      "好疼……好烫……他们把我关在一个……一直在塌的房间里……",
      "我能感觉到阵法……要成了……那个东西快醒了……",
      "拔掉电源……烧掉这里……",
      "或者……代替我……让我出去……",
      "你只能选一个。"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const nextLine = sequence[i];
        if (nextLine) {
          setLines(prev => [...prev, nextLine]);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButtons(true), 1000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleEnding = (type: 'A' | 'B' | 'C') => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setEndingType(type);
    setCurrentApp('ending');
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] text-red-600 font-mono p-8 overflow-hidden flex flex-col items-center justify-center">
      {/* Background rotating symbol */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="text-[400px] animate-spin" style={{ animationDuration: '20s' }}>∞</div>
      </div>

      <div className="max-w-3xl w-full z-10 space-y-4 text-xl leading-relaxed text-shadow-sm">
        {lines.map((line, idx) => (
          <div 
            key={idx} 
            className={`animate-in fade-in slide-in-from-bottom-2 ${line?.includes('LX-044-YIN') || line?.includes('哥') || line?.includes('疼') ? 'text-white' : ''}`}
          >
            {line}
          </div>
        ))}
      </div>

      {showButtons && (
        <div className="mt-16 flex gap-8 z-10 animate-in fade-in slide-in-from-bottom-8">
          <button 
            onClick={() => handleEnding('A')}
            className="px-6 py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-colors font-bold tracking-widest flex items-center gap-2"
          >
            🔥 启动火灾清洗系统
          </button>
          
          <button 
            onClick={() => handleEnding('B')}
            className="px-6 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-black transition-colors font-bold tracking-widest flex items-center gap-2"
          >
            🔗 接入灵枢 (下载魂魄)
          </button>

          {fragments.length === 7 && (
            <button 
              onClick={() => handleEnding('C')}
              className="px-6 py-4 border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors font-bold tracking-widest flex items-center gap-2 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
              ⭐ 启动净化协议 (七星破阵)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
