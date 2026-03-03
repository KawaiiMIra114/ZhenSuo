import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { TransitionOverlay } from './TransitionOverlay';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Lock } from 'lucide-react';

// ═══════════════════════════════════════════
//  Browser · V3 内嵌浏览器容器
//  管理地址栏 + 跨域遮罩动画
// ═══════════════════════════════════════════

interface BrowserProps {
  title: string;
  defaultUrl: string;
  children: React.ReactNode;
}

export function Browser({ title, defaultUrl, children }: BrowserProps) {
  const { currentApp } = useGame();
  const [url, setUrl] = useState(defaultUrl);
  const [showTransition, setShowTransition] = useState(false);

  // 判断是否为"黑区"（OA 系统）
  const isDarkZone = currentApp === 'oa';

  const handleNavigation = (targetUrl: string) => {
    // 跨域跳转动画
    if (targetUrl.includes('oa.') && !isDarkZone) {
      setShowTransition(true);
    }

    // 解析 URL → 跳转到对应页面
    if (targetUrl.includes('tranquil-sleep.com') && !targetUrl.includes('bbs.') && !targetUrl.includes('oa.')) {
      window.dispatchEvent(new CustomEvent('desktop-browser-nav', { detail: 'clinic' }));
    } else if (targetUrl.includes('bbs.')) {
      window.dispatchEvent(new CustomEvent('desktop-browser-nav', { detail: 'forum' }));
    } else if (targetUrl.includes('oa.')) {
      window.dispatchEvent(new CustomEvent('desktop-browser-nav', { detail: 'oa' }));
    }
    setUrl(targetUrl);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigation(url);
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col overflow-hidden relative">
      {/* 地址栏 */}
      <div className="h-10 bg-zinc-850 border-b border-zinc-700 flex items-center px-3 gap-2 bg-zinc-800/80 shrink-0">
        <div className="flex gap-1">
          <button className="p-1 rounded hover:bg-zinc-700 text-zinc-500">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-700 text-zinc-500">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-700 text-zinc-500">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="flex-1 flex items-center bg-zinc-700/60 rounded-full px-3 py-1 gap-2">
            {isDarkZone ? (
              <Lock className="w-3 h-3 text-yellow-500" />
            ) : (
              <Globe className="w-3 h-3 text-zinc-400" />
            )}
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent text-zinc-300 text-xs outline-none font-mono"
            />
          </div>
        </form>
      </div>

      {/* 页面内容 */}
      <div className="flex-1 overflow-y-auto relative">
        {children}

        {/* CRT 扫描线叠层（黑区专用） */}
        {isDarkZone && <div className="crt-overlay" />}
      </div>

      {/* 跨域遮罩动画 */}
      <TransitionOverlay
        active={showTransition}
        type="noise"
        duration={800}
        onComplete={() => setShowTransition(false)}
      />
    </div>
  );
}
