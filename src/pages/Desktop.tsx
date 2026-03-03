import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { DraggableWindow } from '../components/DraggableWindow';
import { InvestigateNode } from '../components/InvestigateNode';
import { Clinic } from './Clinic';
import { Forum } from './Forum';
import { OA } from './OA';
import {
  Monitor, Mail, Globe, FileText, Calendar, Power,
  ChevronUp, Clock, Wifi, Battery, Volume2,
  Inbox, Star, AlertTriangle, X
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
    id: 'welcome',
    from: '安宁深眠诊所 <hr@tranquil-sleep.com>',
    subject: '欢迎加入安宁深眠诊所大家庭',
    date: '2024-03-01',
    body: `亲爱的同事：

欢迎加入安宁深眠诊所！我们很高兴您成为团队的一员。

请在入职首日完成以下事项：
• 领取工牌与门禁卡（前台）
• 阅读《员工手册》（OA 系统下载）
• 完成信息安全培训（必修）

如有任何问题，请联系人事部。

祝工作愉快！
人力资源部`,
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
    linXiaoSignalStrength,
  } = useGame();

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [browserApp, setBrowserApp] = useState<'clinic' | 'forum' | 'oa' | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

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

  const openWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
    }
  };
  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
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
        <DesktopIcon icon={<Globe className="w-8 h-8" />} label="安宁官网" onClick={() => handleOpenBrowser('clinic')} />
        <DesktopIcon icon={<Mail className="w-8 h-8" />} label="邮件" badge={showRollbackEmail ? '!' : undefined} onClick={() => openWindow('email')} />
        <DesktopIcon icon={<FileText className="w-8 h-8" />} label="门诊单" onClick={() => openWindow('record')} />
        <DesktopIcon icon={<Calendar className="w-8 h-8" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); }} />
        <DesktopIcon icon={<Monitor className="w-8 h-8" />} label="论坛" onClick={() => handleOpenBrowser('forum')} />
      </div>

      {/* 碎片计数器（右上角，微弱显示） */}
      {collectedRunes.length > 0 && (
        <div className="absolute top-4 right-4 text-amber-700/40 font-serif text-xs">
          ☰ {collectedRunes.length}/7
        </div>
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
                      <pre className="whitespace-pre-wrap font-sans">{selectedEmail.body}</pre>
                    </InvestigateNode>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans">{selectedEmail.body}</pre>
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

      {/* ===== 门诊单窗口 ===== */}
      {openWindows.includes('record') && (
        <DraggableWindow
          title="文件查看器 - 门诊单.png"
          icon={<FileText className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('record')}
          width={500}
          height={420}
          defaultPosition={{ x: 350, y: 120 }}
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
        >
          {browserApp === 'clinic' && <Clinic />}
          {browserApp === 'forum' && <Forum />}
          {browserApp === 'oa' && <OA />}
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
            <div key={w} className="h-7 px-3 bg-zinc-800/60 rounded flex items-center text-zinc-400 text-xs">
              {w === 'email' ? '邮件' : w === 'record' ? '门诊单' : w === 'calendar' ? '日历' : w === 'browser' ? '浏览器' : w}
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
            <MenuItem icon={<Globe className="w-4 h-4" />} label="安宁深眠诊所 官网" onClick={() => handleOpenBrowser('clinic')} />
            <MenuItem icon={<Monitor className="w-4 h-4" />} label="安宁社区 论坛" onClick={() => handleOpenBrowser('forum')} />
            <MenuItem icon={<Mail className="w-4 h-4" />} label="邮件" onClick={() => { openWindow('email'); setStartMenuOpen(false); }} />
            <MenuItem icon={<FileText className="w-4 h-4" />} label="门诊单" onClick={() => { openWindow('record'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Calendar className="w-4 h-4" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); setStartMenuOpen(false); }} />
          </div>
          <div className="border-t border-zinc-800 p-2">
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
