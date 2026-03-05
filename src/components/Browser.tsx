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

  // 外部世界层伪造消息
  const [externalMsg, setExternalMsg] = useState<string | null>(null);

  const handleNavigation = (targetUrl: string) => {
    setExternalMsg(null);

    // 跨域跳转动画
    if (targetUrl.includes('oa.') && !isDarkZone) {
      setShowTransition(true);
    }

    // P2-12 外部世界层
    // 百度地图 → 跳转真实外部链接
    if (targetUrl.includes('map.baidu.com') || targetUrl.includes('amap.com') || targetUrl.includes('maps.google')) {
      // 使用实际诊所地址跳转百度地图
      const mapUrl = targetUrl.includes('map.baidu.com')
        ? 'https://map.baidu.com/search/%E5%8D%97%E9%83%8A%E5%8C%BB%E7%96%97%E7%A0%94%E7%A9%B6%E4%B8%AD%E5%BF%83'
        : targetUrl;
      window.open(mapUrl, '_blank');
      setUrl(targetUrl);
      return;
    }
    // 知乎/微博/抖音 → 伪造"无搜索结果"
    if (targetUrl.includes('zhihu.com') || targetUrl.includes('weibo.com') || targetUrl.includes('douyin.com')) {
      setExternalMsg('搜索结果为空。相关内容可能因投诉已被处理。');
      setUrl(targetUrl);
      return;
    }
    // 政府/卫健委 → 内部伪造
    if (targetUrl.includes('gov.cn') || targetUrl.includes('nhc.gov') || targetUrl.includes('wjw.')) {
      setExternalMsg('根据相关法规，该机构信息暂不对外公开。如需查询，请携带有效证件前往属地卫生健康委员会窗口办理。');
      setUrl(targetUrl);
      return;
    }
    // 其他外部地址 → 连接失败
    if (targetUrl.includes('http') && !targetUrl.includes('tranquil-sleep') && !targetUrl.includes('localhost')) {
      setExternalMsg('err_connection_refused: 无法连接到该网站。本机网络可能受到限制。');
      setUrl(targetUrl);
      return;
    }

    // 内部解析 URL → 跳转到对应页面
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
        {/* P2-12 外部世界层拦截页面 */}
        {externalMsg ? (
          <div className="flex items-center justify-center h-full bg-zinc-900">
            <div className="text-center max-w-md px-8">
              <div className="text-zinc-500 text-6xl mb-6">⊘</div>
              <p className="text-zinc-400 text-sm font-mono leading-relaxed">{externalMsg}</p>
              <p className="text-zinc-600 text-xs mt-6 font-mono">ERR_NETWORK_ACCESS_RESTRICTED</p>
            </div>
          </div>
        ) : children}

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
