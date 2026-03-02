import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface BrowserProps {
  children: React.ReactNode;
  title: string;
  defaultUrl: string;
}

export function Browser({ children, title, defaultUrl }: BrowserProps) {
  const { setCurrentApp } = useGame();
  const [inputUrl, setInputUrl] = useState(defaultUrl);

  useEffect(() => {
    setInputUrl(defaultUrl);
  }, [defaultUrl]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    const url = inputUrl.toLowerCase().trim();
    
    if (url.includes('oa.tranquil-sleep.com')) {
      setCurrentApp('oa');
    } else if (url.includes('bbs.tranquil-sleep.com')) {
      setCurrentApp('forum');
    } else if (url.includes('www.tranquil-sleep.com') || url.includes('tranquil-sleep.com')) {
      setCurrentApp('clinic');
    } else {
      alert('无法访问该网站。DNS解析失败或页面不存在。');
      setInputUrl(defaultUrl); // reset
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 p-4 sm:p-8 z-40 flex flex-col animate-modal">
      <div className="flex-1 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-zinc-700">
        
        {/* Browser Chrome (Address Bar) */}
        <div className="h-12 bg-zinc-200 border-b border-zinc-300 flex items-center px-4 gap-4 select-none">
          {/* Window Controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentApp('desktop')} 
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors"
              title="关闭浏览器"
            >
              <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2 text-zinc-500">
            <ChevronLeft className="w-5 h-5 cursor-not-allowed opacity-50" />
            <ChevronRight className="w-5 h-5 cursor-not-allowed opacity-50" />
            <RotateCw className="w-4 h-4 ml-2 mt-0.5 cursor-pointer hover:text-zinc-800 transition-colors" />
          </div>
          
          {/* Address Bar */}
          <form onSubmit={handleNavigate} className="flex-1 flex">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-white border border-zinc-300 rounded px-3 py-1 text-sm text-zinc-600 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
            />
          </form>
          
          {/* Spacer for balance */}
          <div className="w-16"></div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-y-auto relative bg-[#f4f7f6]">
          {children}
        </div>

      </div>
    </div>
  );
}
