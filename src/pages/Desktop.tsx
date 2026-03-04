import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { DraggableWindow } from '../components/DraggableWindow';
import { InvestigateNode } from '../components/InvestigateNode';
import { Clinic } from './Clinic';
import { Forum } from './Forum';
import { OA } from './OA';
import { Browser } from '../components/Browser';
import {
  Monitor, Mail, Globe, FileText, Calendar, Power,
  ChevronUp, Clock, Wifi, Battery, Volume2,
  Inbox, Star, AlertTriangle, X,
  RotateCcw, MessageCircle, Send, Image, Smile, Scissors,
  Phone, Video, MoreHorizontal, Search, FolderOpen, Mic
} from 'lucide-react';

// ═══════════════════════════════════════════
//  Desktop · V3 桌面视窗
//  可拖动窗口 + 关机惩罚 + 结局回溯邮件
// ═══════════════════════════════════════════

// 邮件数据（V3 §桌面邮件库）
interface EmailData {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  isUrgent?: boolean;
  isSystem?: boolean;
  hookId?: string;
  feedbackText?: string;
}

const EMAILS: EmailData[] = [
  {
    id: 'clinic_progress',
    from: '安宁深眠诊所 患者服务中心 <service@tranquil-sleep.com>',
    subject: '关于患者林晓的诊疗进度更新',
    date: '2024-03-21 02:47',
    hookId: 'email_clinic_progress',
    feedbackText: '凌晨两点四十七分发送的邮件……谁会在这个时间工作？',
    body: `尊敬的患者家属，

您好。林晓女士目前正处于深度康复阶段，各项生理指标均在预期范围内，治疗团队将持续跟进。

更多诊疗信息及探视指引，请访问官网：
www.tranquil-sleep.com

如有疑问，欢迎拨打我们的24小时服务热线：
400-XXX-XXXX

安宁深眠（南郊）医疗研究中心
患者服务中心`,
  },
  {
    id: 'family',
    from: '林建国 <ljg_father@163.com>',
    subject: '晓晓最近好吗？',
    date: '2024-03-10',
    hookId: 'email_family',
    feedbackText: '林晓的父亲……他不知道发生了什么。',
    body: `林浩：

你妹妹最近怎么样了？我和你妈打了好几次诊所的电话都没人接。

上次你说她在做什么新疗法，效果很好，我们就没再去打扰。但都快两个月了，她一个电话都没回过。

你帮忙问问，让她给家里打个电话。

爸`,
  },
  {
    id: 'encrypted',
    from: '???',
    subject: '（无主题）',
    date: '2024-03-14',
    isUrgent: true,
    hookId: 'email_encrypted',
    feedbackText: '这封邮件似乎被加密了……发件人信息丢失。',
    body: `f5a8c1... [数据损坏]

......别相信他们......

LX-044-YIN

[剩余 3,847 字节无法解码]`,
  },
  {
    id: 'it_notice',
    from: '信息技术部 <it@tranquil-sleep.com>',
    subject: 'RE: B2层机房异常耗电通知',
    date: '2024-03-12',
    hookId: 'email_it_power',
    body: `各位领导：

关于B2层机房近期电力消耗异常一事，经排查确认为7号液冷机柜散热系统运行异常所致。

当前该机柜日均耗电量已达 420kW，远超设计上限。

建议安排专人巡检。

IT外包运维 赵启
工号：IT-EXT-0077`,
  },
];

// 结局回溯邮件（V3 §结局回溯机制）
const ROLLBACK_EMAIL: EmailData = {
  id: 'rollback',
  from: '系统碎片残余 - 节点 ZK-0077 <ghost@null.tranquil>',
  subject: '[自动转发] 你还有机会',
  date: '2024-03-14',
  isSystem: true,
  body: `>>> 检测到会话记录未完全覆写
>>> 回滚点仍然有效

你已经看到了一个结局。

但日志显示……决策分支树中还存在未执行的路径。

如果你想改变什么——
时间窗口仍然存在。

[进入终局决策界面]

——— ZK-0077-GHOST ———
// 此消息由崩溃前最后一次 crontab 定时任务自动发送
// 如果你看到这条……说明我的脚本还在跑。`,
};

export function Desktop() {
  const {
    currentApp, setCurrentApp,
    completedEndings, collectedRunes,
    hasReadHook, readHook, collectRune,
    linXiaoSignalStrength, resetGame,
    addFact, hasFact
  } = useGame();

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>(['wechat', 'email', 'photos']);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [browserApp, setBrowserApp] = useState<'clinic' | 'forum' | 'oa' | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(EMAILS[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [wechatMsg, setWechatMsg] = useState('');
  const [wechatChat, setWechatChat] = useState<string>('linxiao');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // 监听浏览器内部跨域跳转
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<'clinic' | 'forum' | 'oa'>;
      setBrowserApp(customEvent.detail);
      setOpenWindows(prev => prev.includes('browser') ? prev : [...prev, 'browser']);
    };
    window.addEventListener('desktop-browser-nav', handleNav);
    return () => window.removeEventListener('desktop-browser-nav', handleNav);
  }, []);

  // 时钟
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 林晓溢出效果（当信号强度 >= 4 时偶尔闪烁桌面文字）
  const [linxiaoFlash, setLinxiaoFlash] = useState(false);
  useEffect(() => {
    if (linXiaoSignalStrength < 4) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setLinxiaoFlash(true);
        setTimeout(() => setLinxiaoFlash(false), 300);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [linXiaoSignalStrength]);

  // 判断是否显示回溯邮件
  const showRollbackEmail = completedEndings.length > 0 && completedEndings.length < 3;
  const allEmails = showRollbackEmail ? [...EMAILS, ROLLBACK_EMAIL] : EMAILS;

  const toggleWindowMinimize = (id: string, forceMinimize?: boolean) => {
    setMinimizedWindows(prev => {
      const isMin = prev.includes(id);
      if (forceMinimize === true && !isMin) return [...prev, id];
      if (forceMinimize === false && isMin) return prev.filter(w => w !== id);
      if (forceMinimize === undefined) {
        return isMin ? prev.filter(w => w !== id) : [...prev, id];
      }
      return prev;
    });
  };

  const openWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
    } else {
      // 若已打开且被最小化，将其还原
      toggleWindowMinimize(id, false);
    }
  };
  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
    setMinimizedWindows(prev => prev.filter(w => w !== id));
    if (id === 'email') setSelectedEmail(null);
    if (id === 'calendar') setShowCalendar(false);
  };

  const handleShutdown = () => {
    setStartMenuOpen(false);
    setCurrentApp('shutdown');
  };

  const handleOpenBrowser = (target: 'clinic' | 'forum' | 'oa') => {
    setStartMenuOpen(false);
    setBrowserApp(target);
    openWindow('browser');
  };

  const getBrowserTitle = () => {
    if (browserApp === 'clinic') return '安宁深眠诊所 Tranquil Sleep Clinic';
    if (browserApp === 'forum') return '安宁社区论坛';
    if (browserApp === 'oa') return '内网系统 OA';
    return '浏览器';
  };

  // 格式化时间
  const timeStr = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

  return (
    <div
      className="fixed inset-0 bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/desktop_wallpaper.png)` }}
      onClick={() => startMenuOpen && setStartMenuOpen(false)}
    >
      {/* 桌面图标区 */}
      <div className="absolute top-6 left-6 flex flex-col gap-4">
        <DesktopIcon icon={<MessageCircle className="w-8 h-8" />} label="微信" badge="3" onClick={() => openWindow('wechat')} />
        <DesktopIcon icon={<Globe className="w-8 h-8" />} label="安宁官网" onClick={() => handleOpenBrowser('clinic')} />
        <DesktopIcon icon={<Mail className="w-8 h-8" />} label="邮件" badge={showRollbackEmail ? '!' : undefined} onClick={() => openWindow('email')} />
        <DesktopIcon icon={<Image className="w-8 h-8" />} label="晓的照片" onClick={() => openWindow('photos')} />
        <DesktopIcon icon={<FileText className="w-8 h-8" />} label="门诊单" onClick={() => openWindow('record')} />
        <DesktopIcon icon={<Calendar className="w-8 h-8" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); }} />
        <DesktopIcon icon={<Monitor className="w-8 h-8" />} label="论坛" onClick={() => handleOpenBrowser('forum')} />
      </div>


      {/* ===== 微信窗口（参照真实微信PC端布局）===== */}
      {openWindows.includes('wechat') && (
        <DraggableWindow
          title="微信"
          icon={<MessageCircle className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('wechat')}
          width={820}
          height={560}
          defaultPosition={{ x: 100, y: 60 }}
          zIndex={210}
          isMinimized={minimizedWindows.includes('wechat')}
          onMinimizeToggle={(min) => toggleWindowMinimize('wechat', min)}
        >
          <div className="flex h-full bg-[#f5f5f5]">
            {/* 左侧图标栏 - 仿微信绿色侧栏 */}
            <div className="w-14 bg-[#2e2e2e] flex flex-col items-center py-4 gap-3 shrink-0">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-2">
                <span className="text-white text-xs font-bold">浩</span>
              </div>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 bg-white/5">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
                <FolderOpen className="w-4 h-4" />
              </button>
              <div className="flex-1" />
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* 中间联系人列表 */}
            <div className="w-60 bg-[#e7e7e7] border-r border-[#d5d5d5] flex flex-col shrink-0">
              <div className="p-2">
                <div className="bg-[#dcdcdc] rounded-md px-3 py-1.5 flex items-center gap-2">
                  <Search className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">搜索</span>
                </div>
              </div>
              {/* 林晓 - 置顶 */}
              <div className={`px-3 py-2.5 flex items-center gap-3 cursor-pointer ${wechatChat === 'linxiao' ? 'bg-[#c6c6c6]' : 'hover:bg-[#d8d8d8]'} transition-colors`} onClick={() => setWechatChat('linxiao')}>
                <div className="relative">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">晓</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 font-medium">林晓</div>
                  <div className="text-[11px] text-gray-500 truncate">好。</div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">01/09</span>
              </div>
              {/* 其他联系人 - 可点击切换 */}
              {[
                { id: 'dad', name: '爸', msg: '让她给家里打个电话。', time: '03/10', color: 'from-blue-300 to-blue-500' },
                { id: 'clinic', name: '诊所前台', msg: '您好，您已接通安宁深眠…', time: '02/25', color: 'from-teal-300 to-teal-500' },
                { id: 'filehelper', name: '文件传输助手', msg: '没有什么好忧郁的，我就是…', time: '01/10', color: 'from-green-400 to-green-600' },
              ].map(c => (
                <div key={c.id} className={`px-3 py-2.5 flex items-center gap-3 cursor-pointer ${wechatChat === c.id ? 'bg-[#c6c6c6]' : 'hover:bg-[#d8d8d8]'} transition-colors`} onClick={() => setWechatChat(c.id)}>
                  <div className={`w-10 h-10 rounded bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-xs">{c.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800">{c.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{c.msg}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
                </div>
              ))}
            </div>

            {/* 右侧聊天区 — 根据 wechatChat 切换内容 */}
            <div className="flex-1 flex flex-col bg-[#f5f5f5]">
              {/* 聊天标题栏 */}
              <div className="h-12 px-4 flex items-center justify-between border-b border-[#e0e0e0] bg-[#f5f5f5] shrink-0">
                <span className="text-sm font-medium text-gray-800">
                  {wechatChat === 'linxiao' ? '林晓' : wechatChat === 'dad' ? '爸' : wechatChat === 'clinic' ? '诊所前台' : '文件传输助手'}
                </span>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <Video className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              {/* 消息区 */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* ===== 林晓对话 ===== */}
                {wechatChat === 'linxiao' && (<>
                  <div className="text-center text-[11px] text-gray-400 my-2">1月9日 02:34</div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">晓</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">
                      明天去了，不用担心我。你照顾好自己。
                    </div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">1月9日 09:02</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">到了记得报平安。</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">1月9日 09:15</div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">晓</span></div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">好。</div>
                  </div>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">2月25日 09:14</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div>
                      <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">晓，在吗？打你电话没接。</div>
                      <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                    </div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">3月1日 18:07</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div>
                      <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">诊所说你在康复关键期，但都快两个月了。你还好吗。</div>
                      <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                    </div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">3月10日 22:31</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div>
                      <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">你到底怎么了。</div>
                      <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                    </div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                </>)}

                {/* ===== 爸的对话 ===== */}
                {wechatChat === 'dad' && (<>
                  <div className="text-center text-[11px] text-gray-400 my-2">3月8日 19:45</div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">林浩，你妹妹还不回电话。你妈天天念叨。</div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">爸，我在想办法联系她。诊所那边说还在恢复期。</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">3月10日 20:12</div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">你帮忙问问，让她给家里打个电话。</div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">好，我再催催。</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                </>)}

                {/* ===== 诊所前台对话 ===== */}
                {wechatChat === 'clinic' && (<>
                  <div className="text-center text-[11px] text-gray-400 my-2">2月25日 10:30</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">你好，我是患者林晓的家属，想了解一下她的治疗情况。</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">诊</span></div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">您好，您已接通安宁深眠诊所患者服务热线。林晓女士目前正处于康复关键期，暂不适宜接受探视。我们会定期向家属发送诊疗进度报告。</div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">能不能让她接个电话？</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">诊</span></div>
                    <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">非常抱歉，深度睡眠疗程期间患者需要保持完全的神经静息状态，外部刺激可能影响治疗效果。感谢您的理解与配合。</div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">此后每次发消息均为自动回复</div>
                </>)}

                {/* ===== 文件传输助手 ===== */}
                {wechatChat === 'filehelper' && (<>
                  <div className="text-center text-[11px] text-gray-400 my-2">1月10日 03:47</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">没有什么好忧郁的，我就是想不通她为什么不肯让我帮忙。</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="text-center text-[11px] text-gray-400 my-2">3月12日 01:23</div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">安宁深眠诊所 官网链接：tranquil-sleep.com</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">今晚一定要把这个诊所查清楚</div>
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                  </div>
                </>)}
              </div>

              {/* 底部工具栏 + 输入框 */}
              <div className="border-t border-[#e0e0e0] bg-[#f5f5f5] shrink-0">
                <div className="flex items-center gap-3 px-4 py-1.5 text-gray-400">
                  <Smile className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <Scissors className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <FolderOpen className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <Image className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                  <Mic className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                </div>
                <div className="px-4 pb-2">
                  <textarea
                    className="w-full h-16 bg-white rounded border-none outline-none resize-none text-sm text-gray-800 px-3 py-2"
                    placeholder="输入消息…"
                    value={wechatMsg}
                    onChange={e => setWechatMsg(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey && wechatMsg.trim()) {
                        e.preventDefault();
                        setWechatMsg('');
                        // 发送失败提示
                        alert('消息发送失败，对方可能已关闭消息通知。');
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between items-center px-4 pb-2">
                  <span className="text-[10px] text-gray-400">按住 Ctrl + Enter 换行</span>
                  <button
                    className="px-4 py-1 bg-[#e0e0e0] text-gray-500 rounded text-xs hover:bg-[#d5d5d5] transition-colors"
                    onClick={() => {
                      if (wechatMsg.trim()) {
                        setWechatMsg('');
                        alert('消息发送失败，对方可能已关闭消息通知。');
                      }
                    }}
                  >
                    发送(S)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DraggableWindow>
      )}

      {/* ===== 邮件窗口 ===== */}
      {openWindows.includes('email') && (
        <DraggableWindow
          title="邮件 - Tranquil Mail"
          icon={<Mail className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('email')}
          width={720}
          height={500}
          defaultPosition={{ x: 200, y: 80 }}
          zIndex={200}
          isMinimized={minimizedWindows.includes('email')}
          onMinimizeToggle={(min) => toggleWindowMinimize('email', min)}
        >
          <div className="flex h-full">
            {/* 邮件列表 */}
            <div className="w-64 border-r border-zinc-700 overflow-y-auto bg-zinc-900/95">
              <div className="p-3 border-b border-zinc-700 flex items-center gap-2 text-zinc-400 text-xs">
                <Inbox className="w-3.5 h-3.5" /> 收件箱 ({allEmails.length})
              </div>
              {allEmails.map(email => (
                <div
                  key={email.id}
                  className={`p-3 border-b border-zinc-800 cursor-pointer transition-colors text-xs
                    ${selectedEmail?.id === email.id ? 'bg-blue-900/30 border-l-2 border-l-blue-400' : 'hover:bg-zinc-800'}
                    ${email.isUrgent ? 'border-l-2 border-l-red-500' : ''}
                    ${email.isSystem ? 'border-l-2 border-l-green-500' : ''}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {email.isUrgent && <AlertTriangle className="w-3 h-3 text-red-400" />}
                    {email.isSystem && <Star className="w-3 h-3 text-green-400" />}
                    <span className="text-zinc-300 truncate font-medium">{email.subject}</span>
                  </div>
                  <div className="text-zinc-500 truncate">{email.from.split('<')[0].trim()}</div>
                  <div className="text-zinc-600 mt-0.5">{email.date}</div>
                </div>
              ))}
            </div>

            {/* 邮件正文 */}
            <div className="flex-1 overflow-y-auto p-5 text-zinc-300 text-sm leading-relaxed">
              {selectedEmail ? (
                <>
                  <h2 className="text-lg font-bold text-zinc-100 mb-1">{selectedEmail.subject}</h2>
                  <div className="text-zinc-500 text-xs mb-1">发件人：{selectedEmail.from}</div>
                  <div className="text-zinc-600 text-xs mb-4">日期：{selectedEmail.date}</div>
                  <hr className="border-zinc-700 mb-4" />

                  {selectedEmail.hookId ? (
                    <InvestigateNode
                      hookId={selectedEmail.hookId}
                      feedbackText={selectedEmail.feedbackText}
                    >
                      <pre className="whitespace-pre-wrap font-sans">
                        {selectedEmail.body.split('www.tranquil-sleep.com').map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span
                                className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                onClick={() => handleOpenBrowser('clinic')}
                              >
                                www.tranquil-sleep.com
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </pre>
                    </InvestigateNode>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans">
                      {selectedEmail.body.split('www.tranquil-sleep.com').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span
                              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                              onClick={() => handleOpenBrowser('clinic')}
                            >
                              www.tranquil-sleep.com
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </pre>
                  )}

                  {/* 回溯邮件特殊按钮 */}
                  {selectedEmail.id === 'rollback' && (
                    <button
                      className="mt-6 px-4 py-2 bg-green-900/40 border border-green-600/40 text-green-400 rounded font-mono text-sm hover:bg-green-800/50 transition-colors"
                      onClick={() => setCurrentApp('ending')}
                    >
                      {'>>> 进入终局决策界面'}
                    </button>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                  选择一封邮件查看
                </div>
              )}
            </div>
          </div>
        </DraggableWindow>
      )}

      {/* ===== 晓的照片窗口 (V4 §3.2) ===== */}
      {openWindows.includes('photos') && (
        <DraggableWindow
          title="晓的照片"
          icon={<Image className="w-3.5 h-3.5" />}
          onClose={() => { closeWindow('photos'); setSelectedPhoto(null); }}
          width={680}
          height={480}
          defaultPosition={{ x: 180, y: 100 }}
          zIndex={215}
          isMinimized={minimizedWindows.includes('photos')}
          onMinimizeToggle={(min) => toggleWindowMinimize('photos', min)}
        >
          <div className="h-full bg-zinc-900 overflow-y-auto p-4">
            {selectedPhoto === null ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 0, desc: '路边摊吃饭', sub: '林晓在笑，但眼睛下面有很深的阴影' },
                  { id: 1, desc: '手机截图', sub: '凌晨03:47的时钟App，林晓发给林浩，只配了一个句号' },
                  { id: 2, desc: '诊所宣传折页', sub: '"这个好像不错，我想试试"' },
                  { id: 3, desc: '林浩的回复截图', sub: '"贵不贵？我帮你出"' },
                  { id: 4, desc: '林晓的回复', sub: '"不用，我自己来。"' },
                  { id: 5, desc: '最后一条消息', sub: '"到了记得告诉我" —— 已送达，未读' },
                ].map(photo => (
                  <div
                    key={photo.id}
                    className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all group"
                    onClick={() => setSelectedPhoto(photo.id)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center p-4">
                      <div className="text-center">
                        <Image className="w-8 h-8 text-zinc-500 mx-auto mb-2 group-hover:text-zinc-400 transition-colors" />
                        <p className="text-xs text-zinc-400 group-hover:text-zinc-300">{photo.desc}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-zinc-500 truncate">{photo.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <button
                  className="text-sm text-blue-400 mb-4 flex items-center gap-1 shrink-0"
                  onClick={() => setSelectedPhoto(null)}
                >
                  ← 返回照片列表
                </button>
                <div className="flex-1 flex items-center justify-center">
                  {selectedPhoto === 0 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <Image className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
                        <p className="text-sm text-zinc-300">两个人在路边摊吃饭。</p>
                        <p className="text-sm text-zinc-300 mt-2">林晓在笑，但眼睛下面有很深的阴影。</p>
                        <p className="text-xs text-zinc-500 mt-4">那种笑容，像是怕你看出什么。</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 1 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-black rounded-lg p-6 mb-4">
                          <p className="text-4xl font-mono text-white">03:47</p>
                          <p className="text-xs text-zinc-500 mt-2">2024年1月6日 星期六</p>
                        </div>
                        <p className="text-sm text-zinc-300">林晓发给林浩的手机截图。</p>
                        <p className="text-sm text-zinc-400 mt-2">只配了一个句号：<span className="text-zinc-300">。</span></p>
                        <p className="text-xs text-zinc-500 mt-4">凌晨三点四十七分，她还醒着。</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 2 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-gradient-to-br from-teal-900/30 to-blue-900/30 border border-teal-700/30 rounded-lg p-4 mb-4">
                          <p className="text-teal-300 font-bold text-sm">安宁深眠诊所</p>
                          <p className="text-teal-400/60 text-xs mt-1">DNR深度睡眠修复疗法</p>
                          <p className="text-teal-400/60 text-xs">康复率97.3% · 无创无痛 · 医保可报</p>
                        </div>
                        <p className="text-sm text-zinc-300">林晓在图片下方打了一行字：</p>
                        <p className="text-sm text-pink-300 mt-2 italic">"这个好像不错，我想试试"</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 3 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-[#95ec69] rounded-lg px-4 py-2 inline-block mb-4">
                          <p className="text-sm text-gray-800">贵不贵？我帮你出</p>
                        </div>
                        <p className="text-sm text-zinc-300 mt-2">林浩的回复截图。</p>
                        <p className="text-xs text-zinc-500 mt-4">他一直想帮忙。</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 4 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-white rounded-lg px-4 py-2 inline-block mb-4">
                          <p className="text-sm text-gray-800">不用，我自己来。</p>
                        </div>
                        <p className="text-sm text-zinc-300 mt-2">林晓的回复。</p>
                        <p className="text-xs text-zinc-500 mt-4">她从来不让别人帮忙。</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 5 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-[#95ec69] rounded-lg px-4 py-2 inline-block mb-4">
                          <p className="text-sm text-gray-800">到了记得告诉我</p>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">已送达</p>
                        <p className="text-sm text-zinc-300 mt-4">林浩发出的最后一条消息。</p>
                        <p className="text-sm text-zinc-400 mt-2">显示"已送达"。</p>
                        <p className="text-sm text-red-400/60 mt-2">没有已读。</p>
                        <p className="text-xs text-zinc-600 mt-4">从此以后，再也没有了。</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DraggableWindow>
      )}

      {/* ===== 门诊单窗口 ===== */}
      {openWindows.includes('record') && (
        <DraggableWindow
          title="文件查看器 - 门诊单.png"
          icon={<FileText className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('record')}
          width={500}
          height={420}
          defaultPosition={{ x: 350, y: 120 }}
          isMinimized={minimizedWindows.includes('record')}
          onMinimizeToggle={(min) => toggleWindowMinimize('record', min)}
        >
          <MedicalRecord />
        </DraggableWindow>
      )}

      {/* ===== 日历窗口 ===== */}
      {openWindows.includes('calendar') && showCalendar && (
        <DraggableWindow
          title="日历"
          icon={<Calendar className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('calendar')}
          width={360}
          height={340}
          defaultPosition={{ x: 500, y: 150 }}
          isMinimized={minimizedWindows.includes('calendar')}
          onMinimizeToggle={(min) => toggleWindowMinimize('calendar', min)}
        >
          <CalendarWidget />
        </DraggableWindow>
      )}

      {/* ===== 浏览器窗口 ===== */}
      {openWindows.includes('browser') && browserApp && (
        <DraggableWindow
          title={getBrowserTitle()}
          icon={<Globe className="w-3.5 h-3.5" />}
          onClose={() => { closeWindow('browser'); setBrowserApp(null); }}
          width={1024}
          height={680}
          defaultPosition={{ x: 60, y: 50 }}
          isMinimized={minimizedWindows.includes('browser')}
          onMinimizeToggle={(min) => toggleWindowMinimize('browser', min)}
        >
          {browserApp === 'clinic' && (
            <Browser title="安宁深眠诊所" defaultUrl="https://www.tranquil-sleep.com">
              <Clinic />
            </Browser>
          )}
          {browserApp === 'forum' && (
            <Browser title="安宁社区 - 病友交流论坛" defaultUrl="https://bbs.tranquil-sleep.com">
              <Forum />
            </Browser>
          )}
          {browserApp === 'oa' && (
            <Browser title="TRANQUIL SLEEP CLINIC - INTRANET" defaultUrl="https://oa.tranquil-sleep.com/login">
              <OA />
            </Browser>
          )}
        </DraggableWindow>
      )}

      {/* ===== 任务栏 ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-11 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700/50 flex items-center px-2 z-[200]">
        {/* 开始按钮 */}
        <button
          className="h-8 px-3 rounded flex items-center gap-2 hover:bg-zinc-700/50 transition-colors"
          onClick={(e) => { e.stopPropagation(); setStartMenuOpen(prev => !prev); }}
        >
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center">
            <Monitor className="w-3 h-3 text-white" />
          </div>
          <span className="text-zinc-300 text-xs font-medium">开始</span>
          <ChevronUp className="w-3 h-3 text-zinc-500" />
        </button>

        {/* 打开的窗口标签 */}
        <div className="flex-1 flex gap-1 ml-2">
          {openWindows.map(w => (
            <div
              key={w}
              className={`h-7 px-3 rounded flex items-center text-xs cursor-pointer select-none transition-colors border
                ${minimizedWindows.includes(w)
                  ? 'bg-zinc-800/40 text-zinc-500 border-zinc-700/30 hover:bg-zinc-700/50'
                  : 'bg-zinc-800/80 text-zinc-200 border-zinc-600/50 shadow-inner'}`}
              onClick={() => toggleWindowMinimize(w)}
            >
              {w === 'wechat' ? '微信' : w === 'email' ? '邮件' : w === 'photos' ? '晓的照片' : w === 'record' ? '门诊单' : w === 'calendar' ? '日历' : w === 'browser' ? '浏览器' : w}
            </div>
          ))}
        </div>

        {/* 系统托盘 */}
        <div className="flex items-center gap-3 text-zinc-400 text-xs mr-2">
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
          <span className="font-mono">{timeStr}</span>
          <span>{dateStr}</span>
        </div>
      </div>

      {/* ===== 开始菜单 ===== */}
      {startMenuOpen && (
        <div
          className="absolute bottom-12 left-2 w-72 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-lg shadow-2xl z-[300] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-zinc-800">
            <div className="text-zinc-400 text-xs font-mono mb-2">TRANQUIL-OS v2.4.1</div>
          </div>
          <div className="p-2">
            <MenuItem icon={<MessageCircle className="w-4 h-4" />} label="微信" onClick={() => { openWindow('wechat'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Globe className="w-4 h-4" />} label="安宁深眠诊所 官网" onClick={() => handleOpenBrowser('clinic')} />
            <MenuItem icon={<Monitor className="w-4 h-4" />} label="安宁社区 论坛" onClick={() => handleOpenBrowser('forum')} />
            <MenuItem icon={<Mail className="w-4 h-4" />} label="邮件" onClick={() => { openWindow('email'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Image className="w-4 h-4" />} label="晓的照片" onClick={() => { openWindow('photos'); setStartMenuOpen(false); }} />
            <MenuItem icon={<FileText className="w-4 h-4" />} label="门诊单" onClick={() => { openWindow('record'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Calendar className="w-4 h-4" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); setStartMenuOpen(false); }} />
          </div>
          <div className="border-t border-zinc-800 p-2">
            <MenuItem
              icon={<RotateCcw className="w-4 h-4 text-orange-400" />}
              label="清除进度并重启"
              onClick={() => {
                if (window.confirm('确定要清除所有游戏进度并重新开始吗？此操作无法撤销。')) {
                  resetGame();
                }
              }}
            />
            <MenuItem
              icon={<Power className="w-4 h-4 text-red-400" />}
              label="关机"
              onClick={handleShutdown}
              danger
            />
          </div>
        </div>
      )}

      {/* 林晓溢出闪烁层 */}
      {linxiaoFlash && (
        <div className="fixed inset-0 pointer-events-none z-[9000] flex items-center justify-center">
          <span className="text-white/20 text-4xl font-serif italic linxiao-glitch">
            ……帮帮我……
          </span>
        </div>
      )}
    </div>
  );
}

// ── 桌面图标子组件 ──
function DesktopIcon({ icon, label, onClick, badge }: {
  icon: React.ReactNode; label: string; onClick: () => void; badge?: string;
}) {
  return (
    <button
      className="w-20 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group relative"
      onClick={onClick}
    >
      <div className="text-white/80 group-hover:text-white transition-colors">{icon}</div>
      <span className="text-white/80 text-[10px] text-center group-hover:text-white drop-shadow-md">
        {label}
      </span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── 开始菜单项子组件 ──
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

// ── 门诊单翻转卡片 ──
function MedicalRecord() {
  const [flipped, setFlipped] = useState(false);
  const { readHook } = useGame();

  return (
    <div className="h-full flex items-center justify-center p-4 bg-zinc-900">
      <div
        className="w-80 h-56 perspective-1000 cursor-pointer"
        onClick={() => {
          setFlipped(prev => !prev);
          if (!flipped) {
            readHook('record_flipped');
          }
        }}
      >
        <div className={`relative w-full h-full preserve-3d transition-transform duration-700 ${flipped ? 'rotate-y-180' : ''}`}>
          {/* 正面 */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 mb-2">安宁深眠诊所</div>
              <div className="text-sm text-gray-600">门 诊 记 录 卡</div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>患者姓名：林 晓</p>
                <p>就诊日期：2024-01-15</p>
                <p>主治医师：林德坤</p>
                <p>诊断：顽固性失眠症</p>
              </div>
              <div className="mt-4 text-[10px] text-gray-400">（点击翻转查看背面）</div>
            </div>
          </div>
          {/* 背面 */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}images/outpatient_scan.png`} alt="门诊单背面" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-3 text-red-600 font-mono text-xs font-bold">
              LX-044-YIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 日历组件（3月13日黑叉 = RUNE_07）──
function CalendarWidget() {
  const { collectRune, hasRune } = useGame();
  const rune07Collected = hasRune('RUNE_07');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-4 bg-zinc-900 h-full">
      <div className="text-center text-zinc-300 font-bold mb-3">2024年 3月</div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-zinc-500 py-1 font-bold">{d}</div>
        ))}
        {/* 3月1日是周五，前面补4个空格 */}
        {Array.from({ length: 5 }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => (
          <button
            key={day}
            className={`py-1.5 rounded text-zinc-400 transition-colors relative
              ${day === 13 ? 'bg-red-900/40 text-red-400 font-bold hover:bg-red-800/50' : 'hover:bg-zinc-800'}
              ${day === 14 ? 'ring-1 ring-blue-500/50' : ''}`}
            onClick={() => {
              if (day === 13 && !rune07Collected) {
                collectRune('RUNE_07');
              }
            }}
          >
            {day}
            {day === 13 && (
              <X className="w-3 h-3 absolute top-0 right-0 text-red-500" />
            )}
          </button>
        ))}
      </div>
      {rune07Collected && (
        <div className="mt-3 text-center text-amber-600/60 text-xs font-serif">
          ☰ 3月13日……一切终结之日
        </div>
      )}
    </div>
  );
}
