import React, { useState } from 'react';
import { TransitionOverlay } from './TransitionOverlay';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Lock } from 'lucide-react';
import { useGame } from '../GameContext';

interface BrowserProps {
  title: string;
  defaultUrl: string;
  children: React.ReactNode;
}

type BrowserTarget = 'clinic' | 'forum' | 'oa' | 'meridian';

export function Browser({ title, defaultUrl, children }: BrowserProps) {
  const { hasFact, addFact, erasureActive } = useGame();
  const [url, setUrl] = useState(defaultUrl);
  const [showTransition, setShowTransition] = useState(false);
  const [externalMsg, setExternalMsg] = useState<string | null>(null);

  const isDarkZone = /oa\./i.test(url);

  const handleNavigation = (targetUrl: string) => {
    setExternalMsg(null);
    const raw = targetUrl.trim();
    if (!raw) return;

    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let parsed: URL;

    try {
      parsed = new URL(normalized);
    } catch {
      setExternalMsg('地址格式错误，请检查后重试。');
      setUrl(raw);
      return;
    }

    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const href = parsed.href;

    if (host.includes('map.baidu.com') || host.includes('amap.com') || host.includes('maps.google')) {
      const mapUrl = host.includes('map.baidu.com')
        ? 'https://map.baidu.com/search/%E5%8D%97%E9%83%8A%E5%8C%BB%E7%96%97%E7%A0%94%E7%A9%B6%E4%B8%AD%E5%BF%83'
        : href;
      window.open(mapUrl, '_blank');
      setUrl(href);
      return;
    }

    if (host.includes('zhihu.com') || host.includes('weibo.com') || host.includes('douyin.com')) {
      setExternalMsg('搜索结果为空。相关内容可能因投诉已被处理。');
      setUrl(href);
      return;
    }

    if (host.includes('gov.cn') || host.includes('nhc.gov') || host.includes('wjw.')) {
      setExternalMsg('根据相关法规，该机构信息暂不对外公开。如需查询，请前往属地卫健委窗口办理。');
      setUrl(href);
      return;
    }

    const isMeridian = host.includes('meridian-ls.com');
    const isInternal = host.includes('tranquil-sleep.com') || host.includes('localhost') || isMeridian;
    if (!isInternal) {
      setExternalMsg('err_connection_refused: 无法连接到该网站。本机网络可能受到限制。');
      setUrl(href);
      return;
    }

    let target: BrowserTarget = 'clinic';
    if (host.startsWith('oa.') || host.includes('oa.tranquil-sleep.com')) {
      target = 'oa';
    } else if (host.startsWith('bbs.') || host.startsWith('forum.') || path.includes('/bbs')) {
      target = 'forum';
    } else if (isMeridian) {
      target = 'meridian';
    }

    if (target === 'oa' && !isDarkZone) {
      setShowTransition(true);
    }

    if (target === 'forum' && !hasFact('forum_url_discovered')) {
      setExternalMsg('无法连接到服务器。请先通过官网 FAQ 获取有效访问地址。');
      setUrl(href);
      return;
    }

    if (erasureActive && (target === 'clinic' || target === 'forum')) {
      setExternalMsg('404 - 目标资源不可用。');
      setUrl(href);
      return;
    }

    if (target === 'meridian') {
      addFact('meridian_visited');
    }

    window.dispatchEvent(new CustomEvent('desktop-browser-nav', { detail: target }));
    setUrl(href);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigation(url);
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col overflow-hidden relative">
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

      <div className="flex-1 overflow-y-auto relative">
        {externalMsg ? (
          <div className="flex items-center justify-center h-full bg-zinc-900">
            <div className="text-center max-w-md px-8">
              <div className="text-zinc-500 text-6xl mb-6">◎</div>
              <p className="text-zinc-400 text-sm font-mono leading-relaxed">{externalMsg}</p>
              <p className="text-zinc-600 text-xs mt-6 font-mono">ERR_NETWORK_ACCESS_RESTRICTED</p>
            </div>
          </div>
        ) : children}

        {isDarkZone && <div className="crt-overlay" />}
      </div>

      <TransitionOverlay
        active={showTransition}
        type="noise"
        duration={800}
        onComplete={() => setShowTransition(false)}
      />
    </div>
  );
}

