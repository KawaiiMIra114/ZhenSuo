import React from 'react';
import { useGame } from '../GameContext';

export function Warning() {
  const { setCurrentApp } = useGame();

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl border border-zinc-800 bg-zinc-950 p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-red-500">
          <span className="text-2xl">⚠</span>
          <h1 className="text-xl font-bold tracking-widest">内容提示</h1>
        </div>
        
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-zinc-400">
          <p>本作品包含：邪教仪式描写、精神控制、强烈的视听冲击（包括突然的音效和画面变化）、心理恐怖元素。</p>
          <p>如您有癫痫病史或对上述内容感到不适，请谨慎体验。</p>
          <p className="pt-4 text-xs text-zinc-600">建议佩戴耳机以获得完整体验。本游戏所有操作均在浏览器内完成，无需使用F12开发者工具。</p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setCurrentApp('desktop')}
            className="px-6 py-3 bg-zinc-100 text-black font-bold hover:bg-white transition-colors"
          >
            我已了解，进入游戏
          </button>
          <button 
            onClick={() => setCurrentApp('desktop')}
            className="px-6 py-3 border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            开启"柔和模式"
          </button>
        </div>
      </div>
    </div>
  );
}
