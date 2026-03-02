import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ClipboardList, ChevronDown, ChevronUp, Key, Puzzle } from 'lucide-react';

export function Notebook() {
  const { clues, fragments, hasUnread, markAsRead } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  // 如果没有任何线索和碎片，且未打开过，可以考虑隐藏，但为了引导玩家，我们常驻显示
  if (clues.length === 0 && fragments.length === 0 && !isOpen) {
    return null;
  }

  const toggleNotebook = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead();
    }
  };

  return (
    <div className={`fixed bottom-0 right-8 w-80 bg-[#f4e8d1] border-x-2 border-t-2 border-[#8b7355] rounded-t-lg shadow-[0_-5px_15px_rgba(0,0,0,0.2)] transition-transform duration-300 z-[9999] font-serif ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
      
      {/* Header / Tab */}
      <button 
        onClick={toggleNotebook}
        className="w-full h-12 flex items-center justify-between px-4 bg-[#e6d5b8] border-b-2 border-[#8b7355] rounded-t-sm hover:bg-[#d8c4a0] transition-colors"
      >
        <div className="flex items-center gap-2 text-[#5c4033] font-bold">
          <ClipboardList className="w-5 h-5" />
          <span>调查笔记本</span>
          {hasUnread && !isOpen && (
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              新线索
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-[#5c4033]" /> : <ChevronUp className="w-5 h-5 text-[#5c4033]" />}
      </button>

      {/* Content */}
      <div className="h-96 overflow-y-auto p-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
        
        {/* Fragments Section */}
        {fragments.length > 0 && (
          <div className="mb-6 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-2 mb-2 border-b border-[#8b7355]/30 pb-1">
              <Puzzle className="w-4 h-4 text-[#8b7355]" />
              <h3 className="font-bold text-[#5c4033] text-sm">化煞符文碎片 ({fragments.length}/7)</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <div 
                  key={num} 
                  className={`w-8 h-8 flex items-center justify-center border ${fragments.includes(num) ? 'border-amber-600 bg-amber-100 text-amber-800 font-bold shadow-inner' : 'border-dashed border-[#8b7355]/30 text-transparent'}`}
                >
                  {fragments.includes(num) ? '符' : '?'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clues Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 border-b border-[#8b7355]/30 pb-1">
            <Key className="w-4 h-4 text-[#8b7355]" />
            <h3 className="font-bold text-[#5c4033] text-sm">已收集线索</h3>
          </div>
          
          {clues.length === 0 ? (
            <p className="text-sm text-[#8b7355]/60 italic text-center mt-8">暂无记录。多留意周围的细节。</p>
          ) : (
            <div className="space-y-3">
              {clues.map(clue => (
                <div key={clue.id} className="bg-white/60 p-3 rounded border border-[#8b7355]/20 shadow-sm">
                  <h4 className="font-bold text-[#5c4033] text-sm mb-1">{clue.title}</h4>
                  <p className="text-xs text-[#5c4033]/80 leading-relaxed">{clue.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
