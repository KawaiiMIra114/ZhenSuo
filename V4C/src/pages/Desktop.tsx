import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/store/GameStore';
import { DraggableWindow } from '@/components/DraggableWindow';
import { BrowserShell } from '@/components/BrowserShell';
import { Clinic } from '@/pages/Clinic';
import { Forum } from '@/pages/Forum';
import { OASystem } from '@/pages/OASystem';
import type { WindowId, BrowserSite } from '@/types';
import {
    Monitor, Mail, Globe, MessageCircle, Image,
    Calendar, Power, ChevronUp, Clock,
    Wifi, Battery, Volume2, X, RotateCcw,
    Inbox, AlertTriangle, Star,
} from 'lucide-react';

// ═══════════════════════════════════════════
//  Desktop · V4 主桌面
//  三个初始窗口：微信 / 邮件 / 照片
//  浏览器内嵌：官网 / 论坛 / OA
// ═══════════════════════════════════════════

// ── 邮件数据 ──
interface EmailData {
    id: string;
    from: string;
    subject: string;
    date: string;
    body: string;
    isUrgent?: boolean;
    isSystem?: boolean;
}

const EMAILS: EmailData[] = [
    {
        id: 'email_family',
        from: '林建国 <ljg_father@163.com>',
        subject: '晓晓最近好吗？',
        date: '2024-01-28',
        body: `林浩：

你妹妹最近怎么样了？我和你妈打了好几次诊所的电话都没人接。

上次你说她在做什么新疗法，效果很好，我们就没再去打扰。但都快两个月了，她一个电话都没回过。

你帮忙问问，让她给家里打个电话。

爸`,
    },
    {
        id: 'email_clinic_confirm',
        from: '安宁深眠诊所 <noreply@tranquil-sleep.com>',
        subject: '入院确认通知 - 患者：林晓',
        date: '2024-01-15',
        body: `尊敬的林浩先生：

您的家属 林晓（身份证号：32****199803140028）已于2024年1月15日正式入住我诊所，开始接受DNR深度睡眠修复疗程。

疗程预计周期：6-8周
主治医师：林雨桐 主任
病房号：A-312

如需了解治疗进展，请访问我诊所官方网站：
https://www.tranquil-sleep.com

祝好！
安宁深眠诊所 患者服务中心`,
    },
    {
        id: 'email_encrypted',
        from: '??? <error@null>',
        subject: '（无主题）',
        date: '2024-03-14',
        isUrgent: true,
        body: `f5a8c1... [数据损坏]

......别......相信......他们......

LX-044-YIN

......帮......

[剩余 3,847 字节无法解码]`,
    },
];

export function Desktop() {
    const {
        setView, addFact, hasFact, collectRune, hasRune,
        collectedRunes, completedEndings, linXiaoSignalStrength,
        resetGame,
    } = useGame();

    // 窗口管理
    const [openWindows, setOpenWindows] = useState<WindowId[]>(['wechat', 'email', 'photos']);
    const [minimizedWindows, setMinimized] = useState<WindowId[]>([]);
    const [focusOrder, setFocusOrder] = useState<WindowId[]>(['photos', 'email', 'wechat']);
    const [browserSite, setBrowserSite] = useState<BrowserSite | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 林晓溢出效果
    const [linxiaoFlash, setLinxiaoFlash] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (linXiaoSignalStrength < 3) return;
        const interval = setInterval(() => {
            if (Math.random() < 0.1 + linXiaoSignalStrength * 0.03) {
                setLinxiaoFlash(true);
                setTimeout(() => setLinxiaoFlash(false), 300 + Math.random() * 400);
            }
        }, 6000 + Math.random() * 4000);
        return () => clearInterval(interval);
    }, [linXiaoSignalStrength]);

    // 窗口操作
    const openWindow = useCallback((id: WindowId) => {
        setOpenWindows(prev => prev.includes(id) ? prev : [...prev, id]);
        setMinimized(prev => prev.filter(w => w !== id));
        setFocusOrder(prev => [...prev.filter(w => w !== id), id]);
    }, []);

    const closeWindow = useCallback((id: WindowId) => {
        setOpenWindows(prev => prev.filter(w => w !== id));
        setMinimized(prev => prev.filter(w => w !== id));
        setFocusOrder(prev => prev.filter(w => w !== id));
        if (id === 'email') setSelectedEmail(null);
        if (id === 'browser') setBrowserSite(null);
    }, []);

    const toggleMinimize = useCallback((id: WindowId) => {
        setMinimized(prev => {
            if (prev.includes(id)) {
                setFocusOrder(fo => [...fo.filter(w => w !== id), id]);
                return prev.filter(w => w !== id);
            }
            return [...prev, id];
        });
    }, []);

    const focusWindow = useCallback((id: WindowId) => {
        setFocusOrder(prev => [...prev.filter(w => w !== id), id]);
    }, []);

    const getZIndex = (id: WindowId) => 100 + focusOrder.indexOf(id);

    const openBrowser = useCallback((site: BrowserSite) => {
        setBrowserSite(site);
        openWindow('browser');
        setStartMenuOpen(false);
        if (site === 'clinic') addFact('visited_clinic_home');
        if (site === 'forum') addFact('forum_visited');
    }, [openWindow, addFact]);

    // 浏览器内部导航
    useEffect(() => {
        const handleNav = (e: Event) => {
            const site = (e as CustomEvent<BrowserSite>).detail;
            openBrowser(site);
        };
        window.addEventListener('browser-navigate', handleNav);
        return () => window.removeEventListener('browser-navigate', handleNav);
    }, [openBrowser]);

    const getBrowserUrl = () => {
        if (browserSite === 'clinic') return 'https://www.tranquil-sleep.com';
        if (browserSite === 'forum') return 'https://bbs.tranquil-sleep.com';
        if (browserSite === 'oa') return 'https://oa.tranquil-sleep.com';
        return '';
    };

    const getBrowserTitle = () => {
        if (browserSite === 'clinic') return '安宁深眠诊所 — 官方网站';
        if (browserSite === 'forum') return '安宁社区 — 病友交流论坛';
        if (browserSite === 'oa') return 'TRANQUIL-OS INTRANET';
        return '浏览器';
    };

    const timeStr = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = currentTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-[#0d1117] via-[#0f1923] to-[#0a1628] select-none"
            onClick={() => startMenuOpen && setStartMenuOpen(false)}
        >
            {/* ── 桌面图标 ── */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                <DesktopIcon icon={<MessageCircle className="w-7 h-7" />} label="微信" onClick={() => openWindow('wechat')} />
                <DesktopIcon icon={<Mail className="w-7 h-7" />} label="邮件" onClick={() => openWindow('email')}
                    badge={!hasFact('read_email_encrypted') ? '!' : undefined} />
                <DesktopIcon icon={<Image className="w-7 h-7" />} label="照片" onClick={() => openWindow('photos')} />
                <DesktopIcon icon={<Globe className="w-7 h-7" />} label="安宁官网" onClick={() => openBrowser('clinic')} />
                <DesktopIcon icon={<Monitor className="w-7 h-7" />} label="社区论坛" onClick={() => openBrowser('forum')} />
                <DesktopIcon icon={<Calendar className="w-7 h-7" />} label="日历" onClick={() => openWindow('calendar')} />
            </div>

            {/* ── 微信窗口 ── */}
            {openWindows.includes('wechat') && (
                <DraggableWindow
                    id="wechat" title="微信网页版"
                    icon={<MessageCircle className="w-3.5 h-3.5 text-green-400" />}
                    width={380} height={520} defaultX={60} defaultY={60}
                    zIndex={getZIndex('wechat')}
                    isMinimized={minimizedWindows.includes('wechat')}
                    onClose={() => closeWindow('wechat')}
                    onMinimize={() => toggleMinimize('wechat')}
                    onFocus={() => focusWindow('wechat')}
                >
                    <WeChatPanel />
                </DraggableWindow>
            )}

            {/* ── 邮件窗口 ── */}
            {openWindows.includes('email') && (
                <DraggableWindow
                    id="email" title="邮件 — Tranquil Mail"
                    icon={<Mail className="w-3.5 h-3.5" />}
                    width={680} height={480} defaultX={200} defaultY={80}
                    zIndex={getZIndex('email')}
                    isMinimized={minimizedWindows.includes('email')}
                    onClose={() => closeWindow('email')}
                    onMinimize={() => toggleMinimize('email')}
                    onFocus={() => focusWindow('email')}
                >
                    <EmailPanel
                        emails={EMAILS}
                        selected={selectedEmail}
                        onSelect={(e) => {
                            setSelectedEmail(e);
                            if (e.id === 'email_encrypted') addFact('read_email_encrypted');
                            if (e.id === 'email_family') addFact('read_email_family');
                            if (e.id === 'email_clinic_confirm') addFact('read_email_it_power');
                        }}
                    />
                </DraggableWindow>
            )}

            {/* ── 照片窗口 ── */}
            {openWindows.includes('photos') && (
                <DraggableWindow
                    id="photos" title="照片 — 林晓"
                    icon={<Image className="w-3.5 h-3.5" />}
                    width={420} height={360} defaultX={460} defaultY={100}
                    zIndex={getZIndex('photos')}
                    isMinimized={minimizedWindows.includes('photos')}
                    onClose={() => closeWindow('photos')}
                    onMinimize={() => toggleMinimize('photos')}
                    onFocus={() => focusWindow('photos')}
                >
                    <PhotosPanel />
                </DraggableWindow>
            )}

            {/* ── 日历窗口 ── */}
            {openWindows.includes('calendar') && (
                <DraggableWindow
                    id="calendar" title="日历 — 2024年3月"
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    width={340} height={340} defaultX={500} defaultY={180}
                    zIndex={getZIndex('calendar')}
                    isMinimized={minimizedWindows.includes('calendar')}
                    onClose={() => closeWindow('calendar')}
                    onMinimize={() => toggleMinimize('calendar')}
                    onFocus={() => focusWindow('calendar')}
                >
                    <CalendarPanel />
                </DraggableWindow>
            )}

            {/* ── 浏览器窗口 ── */}
            {openWindows.includes('browser') && browserSite && (
                <DraggableWindow
                    id="browser" title={getBrowserTitle()}
                    icon={<Globe className="w-3.5 h-3.5" />}
                    width={1040} height={700} defaultX={40} defaultY={20}
                    zIndex={getZIndex('browser')}
                    isMinimized={minimizedWindows.includes('browser')}
                    onClose={() => closeWindow('browser')}
                    onMinimize={() => toggleMinimize('browser')}
                    onFocus={() => focusWindow('browser')}
                    scrollable={false}
                >
                    <BrowserShell url={getBrowserUrl()}>
                        {browserSite === 'clinic' && <Clinic />}
                        {browserSite === 'forum' && <Forum />}
                        {browserSite === 'oa' && <OASystem />}
                    </BrowserShell>
                </DraggableWindow>
            )}

            {/* ── 任务栏 ── */}
            <div className="absolute bottom-0 left-0 right-0 h-11 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700/40 flex items-center px-2 z-[500]">
                <button
                    className="h-8 px-3 rounded flex items-center gap-2 hover:bg-zinc-700/50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setStartMenuOpen(p => !p); }}
                >
                    <div className="w-5 h-5 rounded bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center">
                        <Monitor className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-zinc-300 text-xs font-medium">开始</span>
                    <ChevronUp className="w-3 h-3 text-zinc-500" />
                </button>

                <div className="flex-1 flex gap-1 ml-2">
                    {openWindows.map(w => (
                        <button
                            key={w}
                            className={`h-7 px-3 rounded flex items-center text-xs transition-colors border
                ${minimizedWindows.includes(w)
                                    ? 'bg-zinc-800/40 text-zinc-500 border-zinc-700/30 hover:bg-zinc-700/50'
                                    : 'bg-zinc-800/80 text-zinc-200 border-zinc-600/50'}`}
                            onClick={() => toggleMinimize(w)}
                        >
                            {w === 'wechat' ? '微信' : w === 'email' ? '邮件' : w === 'photos' ? '照片'
                                : w === 'calendar' ? '日历' : w === 'browser' ? '浏览器' : w}
                        </button>
                    ))}
                </div>

                {/* 碎片计数 */}
                {collectedRunes.length > 0 && (
                    <div className="mr-3 text-xs font-mono text-amber-500/70">
                        ☰ {collectedRunes.length}/7
                    </div>
                )}

                <div className="flex items-center gap-3 text-zinc-400 text-xs mr-2">
                    <Wifi className="w-3.5 h-3.5" />
                    <Volume2 className="w-3.5 h-3.5" />
                    <Battery className="w-3.5 h-3.5" />
                    <span className="font-mono">{timeStr}</span>
                    <span>{dateStr}</span>
                </div>
            </div>

            {/* ── 开始菜单 ── */}
            {startMenuOpen && (
                <div
                    className="absolute bottom-12 left-2 w-72 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-lg shadow-2xl z-[600] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 border-b border-zinc-800">
                        <div className="text-zinc-400 text-xs font-mono">TRANQUIL-OS v4.0.0</div>
                    </div>
                    <div className="p-2">
                        <MenuItem icon={<Globe className="w-4 h-4" />} label="安宁深眠诊所 官网" onClick={() => openBrowser('clinic')} />
                        <MenuItem icon={<Monitor className="w-4 h-4" />} label="安宁社区 论坛" onClick={() => openBrowser('forum')} />
                        <MenuItem icon={<Mail className="w-4 h-4" />} label="邮件" onClick={() => { openWindow('email'); setStartMenuOpen(false); }} />
                        <MenuItem icon={<Calendar className="w-4 h-4" />} label="日历" onClick={() => { openWindow('calendar'); setStartMenuOpen(false); }} />
                    </div>
                    <div className="border-t border-zinc-800 p-2">
                        <MenuItem icon={<RotateCcw className="w-4 h-4 text-orange-400" />} label="清除进度并重启"
                            onClick={() => { if (window.confirm('确定要清除所有游戏进度吗？')) resetGame(); }} />
                        <MenuItem icon={<Power className="w-4 h-4 text-red-400" />} label="关机" danger
                            onClick={() => { setStartMenuOpen(false); setView('shutdown'); }} />
                    </div>
                </div>
            )}

            {/* ── 林晓溢出层 ── */}
            {linxiaoFlash && (
                <div className="fixed inset-0 pointer-events-none z-[9000] flex items-center justify-center">
                    <span className="text-white/15 text-4xl font-serif italic glitch-text">
                        ……帮帮我……
                    </span>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════
//  桌面子组件
// ═══════════════════════════════════════════

function DesktopIcon({ icon, label, onClick, badge }: {
    icon: React.ReactNode; label: string; onClick: () => void; badge?: string;
}) {
    return (
        <button
            className="w-20 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/8 transition-colors group relative"
            onClick={onClick}
        >
            <div className="text-white/70 group-hover:text-white transition-colors">{icon}</div>
            <span className="text-white/70 text-[10px] text-center group-hover:text-white drop-shadow-md">{label}</span>
            {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold animate-pulse">
                    {badge}
                </span>
            )}
        </button>
    );
}

function MenuItem({ icon, label, onClick, danger }: {
    icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors
        ${danger ? 'text-red-400 hover:bg-red-900/30' : 'text-zinc-300 hover:bg-zinc-800'}`}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

// ── 微信面板 ──
function WeChatPanel() {
    const { addFact } = useGame();

    useEffect(() => { addFact('read_wechat_linxiao'); }, [addFact]);

    return (
        <div className="h-full flex flex-col bg-[#ededed]">
            {/* 联系人头部 */}
            <div className="px-4 py-3 bg-[#f7f7f7] border-b border-[#ddd] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-sm">晓</div>
                <div>
                    <div className="text-sm font-medium text-gray-800">林晓</div>
                    <div className="text-[10px] text-gray-400">最后在线：45天前</div>
                </div>
            </div>

            {/* 聊天区域 */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* 时间标记 */}
                <div className="text-center text-[10px] text-gray-400 bg-gray-200 rounded-full px-3 py-0.5 w-fit mx-auto">
                    1月15日 08:32
                </div>

                {/* 林晓发来 */}
                <ChatBubble who="linxiao" text="哥，我今天正式入院了。诊所环境挺好的，房间很干净。" />
                <ChatBubble who="linxiao" text="林主任人也很好，说了很多治疗方案的事情。" />

                {/* 玩家回复 */}
                <ChatBubble who="me" text="好，安心治疗。有什么问题随时跟我说。" />

                <div className="text-center text-[10px] text-gray-400 bg-gray-200 rounded-full px-3 py-0.5 w-fit mx-auto">
                    1月15日 18:45
                </div>

                <ChatBubble who="linxiao" text="到了记得报平安～" />

                {/* 最后一条之后的间隔 */}
                <div className="text-center text-[10px] text-gray-400 mt-8">
                    —— 此后再无消息 ——
                </div>
                <div className="text-center text-[10px] text-gray-300">
                    距今已过去 45 天
                </div>
            </div>

            {/* 输入框 */}
            <div className="px-3 py-2 bg-[#f5f5f5] border-t border-[#ddd]">
                <div className="bg-white rounded-lg px-3 py-2 text-sm text-gray-400 border border-gray-200">
                    输入消息…
                </div>
            </div>
        </div>
    );
}

function ChatBubble({ who, text }: { who: 'linxiao' | 'me'; text: string }) {
    const isMe = who === 'me';
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm leading-relaxed
        ${isMe
                    ? 'bg-[#95ec69] text-gray-800'
                    : 'bg-white text-gray-700 border border-gray-100'}`
            }>
                {text}
            </div>
        </div>
    );
}

// ── 邮件面板 ──
function EmailPanel({ emails, selected, onSelect }: {
    emails: EmailData[];
    selected: EmailData | null;
    onSelect: (e: EmailData) => void;
}) {
    return (
        <div className="flex h-full">
            <div className="w-56 border-r border-zinc-700 overflow-y-auto bg-zinc-900/95">
                <div className="p-3 border-b border-zinc-700 flex items-center gap-2 text-zinc-400 text-xs">
                    <Inbox className="w-3.5 h-3.5" /> 收件箱 ({emails.length})
                </div>
                {emails.map(email => (
                    <div
                        key={email.id}
                        className={`p-3 border-b border-zinc-800 cursor-pointer transition-colors text-xs
              ${selected?.id === email.id ? 'bg-blue-900/30 border-l-2 border-l-blue-400' : 'hover:bg-zinc-800'}
              ${email.isUrgent ? 'border-l-2 border-l-red-500' : ''}`}
                        onClick={() => onSelect(email)}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {email.isUrgent && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            <span className="text-zinc-300 truncate font-medium">{email.subject}</span>
                        </div>
                        <div className="text-zinc-500 truncate">{email.from.split('<')[0].trim()}</div>
                        <div className="text-zinc-600 mt-0.5">{email.date}</div>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5 text-zinc-300 text-sm leading-relaxed">
                {selected ? (
                    <>
                        <h2 className="text-lg font-bold text-zinc-100 mb-1">{selected.subject}</h2>
                        <div className="text-zinc-500 text-xs mb-1">发件人：{selected.from}</div>
                        <div className="text-zinc-600 text-xs mb-4">日期：{selected.date}</div>
                        <hr className="border-zinc-700 mb-4" />
                        <pre className="whitespace-pre-wrap font-sans">{selected.body}</pre>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                        选择一封邮件查看
                    </div>
                )}
            </div>
        </div>
    );
}

// ── 照片面板 ──
function PhotosPanel() {
    return (
        <div className="h-full bg-zinc-900 p-4 flex flex-col items-center justify-center gap-4">
            <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-zinc-600/30">
                <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-zinc-400 text-xs">林晓_20240113.jpg</div>
                </div>
            </div>
            <div className="text-center text-xs text-zinc-500 max-w-[280px]">
                拍摄于入院前两天。她终于笑了。
                <br />
                <span className="text-zinc-600">2024年1月13日 · 南郊市中心广场</span>
            </div>
        </div>
    );
}

// ── 日历面板（RUNE_07） ──
function CalendarPanel() {
    const { collectRune, hasRune, addFact } = useGame();
    const rune07 = hasRune('RUNE_07');
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="p-4 bg-zinc-900 h-full">
            <div className="text-center text-zinc-300 font-bold mb-3">2024年 3月</div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="text-zinc-500 py-1 font-bold">{d}</div>
                ))}
                {/* 3月1日是周五，前面5个空格 */}
                {Array.from({ length: 5 }).map((_, i) => <div key={`p-${i}`} />)}
                {days.map(day => (
                    <button
                        key={day}
                        className={`py-1.5 rounded text-zinc-400 transition-colors relative
              ${day === 13 ? 'bg-red-900/40 text-red-400 font-bold hover:bg-red-800/50' : 'hover:bg-zinc-800'}
              ${day === 14 ? 'ring-1 ring-blue-500/50' : ''}`}
                        onClick={() => {
                            if (day === 13 && !rune07) {
                                collectRune('RUNE_07');
                                addFact('calendar_march13');
                            }
                        }}
                    >
                        {day}
                        {day === 13 && <X className="w-3 h-3 absolute top-0 right-0 text-red-500" />}
                    </button>
                ))}
            </div>
            {rune07 && (
                <div className="mt-3 text-center text-amber-600/60 text-xs font-serif">
                    ☰ 3月13日……一切终结之日
                </div>
            )}
        </div>
    );
}
