import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGame } from '../GameContext';
import { DraggableWindow } from '../components/DraggableWindow';
import { InvestigateNode } from '../components/InvestigateNode';
import { Clinic } from './Clinic';
import { Forum } from './Forum';
import { OA } from './OA';
import { Meridian } from './Meridian';
import { Browser } from '../components/Browser';
import {
  Monitor, Mail, Globe, FileText, Calendar, Power,
  ChevronUp, Clock, Wifi, Battery, Volume2,
  Inbox, Star, AlertTriangle, X,
  RotateCcw, MessageCircle, Send, Image, Smile, Scissors,
  Phone, Video, MoreHorizontal, Search, FolderOpen, Mic
} from 'lucide-react';

// ===============================
// Desktop · V3 桌面窗口
// 可拖动窗口 + 关机叙事 + 结局回流
// ===============================

// 邮件数据（V3 桌面邮件层）
interface EmailData {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  isUrgent?: boolean;
  isSystem?: boolean;
  hookId?: string;
}

const EMAILS: EmailData[] = [
  {
    id: 'clinic_progress_2',
    from: '安宁深眠诊所 患者服务中心 <service@tranquil-sleep.com>',
    subject: '关于患者林晓的诊疗进度更新',
    date: '2024-03-21 02:47',
    hookId: 'email_clinic_progress',
    body: `尊敬的患者家属：

您好。林晓女士目前正处于深度康复阶段，各项生理指标均在预期范围内，治疗团队将持续跟进。

更多诊疗信息，请访问官网：
www.tranquil-sleep.com

如有疑问，欢迎拨打我们的24小时服务热线：400-XXX-XXXX

安宁深眠（南郊）医疗研究中心
患者服务中心`,
  },
  {
    id: 'clinic_progress_1',
    from: '安宁深眠诊所 患者服务中心 <service@tranquil-sleep.com>',
    subject: '关于患者林晓的诊疗进度更新',
    date: '2024-03-01 10:23',
    body: `尊敬的患者家属：

您好。林晓女士目前正处于深度康复阶段，各项生理指标均在预期范围内，治疗团队将持续跟进。

更多诊疗信息，请访问官网：
www.tranquil-sleep.com

如有疑问，欢迎拨打我们的24小时服务热线：400-XXX-XXXX

安宁深眠（南郊）医疗研究中心
患者服务中心`,
  },
  {
    id: 'clinic_admission',
    from: '安宁深眠诊所 患者服务中心 <service@tranquil-sleep.com>',
    subject: '林晓女士入院确认通知',
    date: '2024-01-10 14:32',
    body: `尊敬的患者家属：

感谢您选择安宁深眠（南郊）医疗研究中心。
林晓女士已于今日（2024年1月10日）顺利完成入院手续，正式开始DNR深度神经共振疗程。

主治医师：钟长明院长 / 林德坤主任
疗程周期：2024年1月10日 - 2024年1月24日
院内联系方式：请统一通过24小时服务热线联系。

安宁深眠（南郊）医疗研究中心
患者服务中心`,
  },
  {
    id: 'linxiao_last',
    from: 'linxiao****@gmail.com',
    subject: '（无主题）',
    date: '2024-01-09 23:51',
    body: `哥，

明天去了。
别担心我，也别总盯着手机等我回消息，我到了会跟你说的。

你冰箱里那盒牛奶好像过期了，记得扔掉。

晓`,
  },
];


// P2-15 被动环境暗示系统
const AMBIENT_HINTS = [
  '……气味不对……',
  '她还在里面',
  '别关机',
  'B2层不是机房',
  '那不是冷却液',
  '他们在笑',
  '你听到了吗',
  '管道在动',
  '出不去了',
  '帮帮我',
  '记得报平安',
  '温度还在升……',
];

interface GhostText {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const ERASURE_GHOST_LINES = [
  '快去睡觉吧',
  '你在找谁',
  '她不在了',
  '从来没有',
  '忘掉吧',
  '睡吧',
  '没有人记得',
  '你确定吗',
  '快睡',
  '别找了',
];

const ERASURE_DAD_PROMPT = '林晓去哪里了？';
const ERASURE_DAD_REPLY = '林晓是谁？';
const MUTATION_LINXIAO_MESSAGE = '在吗';
const MUTATION_DAD_MESSAGE = '你妹妹最近怎么样？一直联系不上她。';

const MUTATION_SERVICE_EMAIL: EmailData = {
  id: 'ending_b_service_update',
  from: '安宁深眠诊所 患者服务中心 <service@tranquil-sleep.com>',
  subject: '关于您所关心的成员的最新康复进展',
  date: '今天',
  body: `尊敬的患者家属：

您好。您所关心的成员目前正处于深度康复阶段，
各项生理指标均在预期范围内，治疗团队将持续跟进。

如有疑问，欢迎拨打我们的24小时服务热线。

安宁深眠（南郊）医疗研究中心
患者服务中心`,
  isSystem: true,
};

interface WeChatNoticeState {
  title: string;
  message: string;
  targetChat?: string;
}

export function Desktop() {
  const {
    setCurrentApp,
    openWindows,
    setOpenWindows,
    linXiaoSignalStrength,
    resetGame,
    addFact,
    hasFact,
    erasureActive,
  } = useGame();

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [browserApp, setBrowserApp] = useState<'clinic' | 'forum' | 'oa' | 'meridian' | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(EMAILS[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [wechatMsg, setWechatMsg] = useState('');
  const [wechatChat, setWechatChat] = useState<string>('linxiao');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [wechatSendHint, setWechatSendHint] = useState('');
  const [wechatRead, setWechatRead] = useState(false);
  const sendHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [windowFocusTick, setWindowFocusTick] = useState<Record<string, number>>({});
  const [wechatNotice, setWechatNotice] = useState<WeChatNoticeState | null>(null);
  const [dadReplyTyped, setDadReplyTyped] = useState(hasFact('erasure_dad_reply_done') ? ERASURE_DAD_REPLY : '');
  const [endingBLinxiaoMessageVisible, setEndingBLinxiaoMessageVisible] = useState(hasFact('ending_b_linxiao_notice_done'));
  const [endingBDadMessageVisible, setEndingBDadMessageVisible] = useState(hasFact('ending_b_dad_message_added'));
  const [ghostTexts, setGhostTexts] = useState<GhostText[]>([]);
  const [ghostPhase, setGhostPhase] = useState<'idle' | 'accumulating' | 'flicker' | 'ready'>(
    hasFact('erasure_shutdown_ready') ? 'ready' : 'idle'
  );
  const [ghostFlickerLevel, setGhostFlickerLevel] = useState(0);

  const endingBMutationActive = hasFact('ending_b_mutation_active');
  const mutationMode = endingBMutationActive && !erasureActive;
  const endingBLinxiaoNoticeDone = hasFact('ending_b_linxiao_notice_done');
  const endingBDadNoticeDone = hasFact('ending_b_dad_notice_done');
  const endingBDadMessageAdded = hasFact('ending_b_dad_message_added');
  const endingBServiceMailDone = hasFact('ending_b_service_mail_done');
  const erasureNoticeShown = hasFact('erasure_wechat_notice_shown');
  const erasureDadReplySent = hasFact('erasure_dad_reply_sent');
  const erasureDadReplyDone = hasFact('erasure_dad_reply_done');
  const erasureShutdownReady = hasFact('erasure_shutdown_ready');
  const mutationLinxiaoLocked = mutationMode && wechatChat === 'linxiao';
  const canSendWechat = !mutationLinxiaoLocked;
  const wechatBadge = !wechatRead ? (erasureActive || mutationMode ? '1' : '3') : undefined;
  const mutationShutdownProtected = mutationMode;
  const canShutdown = !erasureActive || erasureShutdownReady || ghostPhase === 'ready';

  // 监听浏览器内部导航事件
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<'clinic' | 'forum' | 'oa' | 'meridian'>;
      setBrowserApp(customEvent.detail);
      setOpenWindows(prev => prev.includes('browser') ? prev : [...prev, 'browser']);
      // 导航事件应始终将浏览器窗口恢复并置顶，避免“已打开但被遮挡/最小化”的误判
      setMinimizedWindows(prev => prev.filter(w => w !== 'browser'));
      setWindowFocusTick(prev => ({ ...prev, browser: (prev.browser ?? 0) + 1 }));
    };
    window.addEventListener('desktop-browser-nav', handleNav);
    return () => window.removeEventListener('desktop-browser-nav', handleNav);
  }, []);

  useEffect(() => {
    if (!erasureActive) return;
    if (wechatChat === 'linxiao') {
      setWechatChat('dad');
    }
    setWechatRead(false);
    if (!erasureNoticeShown) {
      setWechatNotice({
        title: '微信',
        message: '你有一条新消息',
        targetChat: 'dad',
      });
      addFact('erasure_wechat_notice_shown');
    }
  }, [erasureActive, wechatChat, erasureNoticeShown, addFact]);

  useEffect(() => {
    if (erasureActive) return;
    setWechatNotice(null);
    setGhostTexts([]);
    setGhostPhase('idle');
    setGhostFlickerLevel(0);
    setDadReplyTyped('');
  }, [erasureActive]);

  useEffect(() => {
    if (!wechatNotice) return;
    const timer = setTimeout(() => setWechatNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [wechatNotice]);

  useEffect(() => {
    if (!mutationMode || endingBLinxiaoNoticeDone) return;
    const timer = setTimeout(() => {
      setEndingBLinxiaoMessageVisible(true);
      setWechatRead(false);
      setWechatNotice({
        title: '微信',
        message: `林晓：${MUTATION_LINXIAO_MESSAGE}`,
        targetChat: 'linxiao',
      });
      addFact('ending_b_linxiao_notice_done');
    }, 10000);
    return () => clearTimeout(timer);
  }, [mutationMode, endingBLinxiaoNoticeDone, addFact]);

  useEffect(() => {
    if (!mutationMode || endingBDadNoticeDone) return;
    const timer = setTimeout(() => {
      setEndingBDadMessageVisible(true);
      addFact('ending_b_dad_message_added');
      setWechatRead(false);
      setWechatNotice({
        title: '微信',
        message: `爸：${MUTATION_DAD_MESSAGE}`,
        targetChat: 'dad',
      });
      addFact('ending_b_dad_notice_done');

      if (!endingBServiceMailDone) {
        addFact('ending_b_service_mail_done');
        setOpenWindows((prev) => (prev.includes('email') ? prev : [...prev, 'email']));
        setMinimizedWindows((prev) => prev.filter((w) => w !== 'email'));
        setWindowFocusTick((prev) => ({ ...prev, email: (prev.email ?? 0) + 1 }));
        setTimeout(() => setSelectedEmail(MUTATION_SERVICE_EMAIL), 0);
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [
    addFact,
    endingBDadNoticeDone,
    endingBServiceMailDone,
    mutationMode,
    setOpenWindows,
  ]);

  useEffect(() => {
    if (endingBLinxiaoNoticeDone) {
      setEndingBLinxiaoMessageVisible(true);
    }
  }, [endingBLinxiaoNoticeDone]);

  useEffect(() => {
    if (endingBDadMessageAdded) {
      setEndingBDadMessageVisible(true);
    }
  }, [endingBDadMessageAdded]);

  useEffect(() => {
    if (!erasureActive) return;
    if (erasureShutdownReady) {
      setGhostPhase('ready');
      return;
    }
    if (erasureDadReplyDone && ghostPhase === 'idle') {
      setGhostPhase('accumulating');
    }
  }, [erasureActive, erasureShutdownReady, erasureDadReplyDone, ghostPhase]);

  useEffect(() => {
    if (!erasureActive || !erasureDadReplySent || erasureDadReplyDone) return;
    let idx = 0;
    setDadReplyTyped('');
    const timer = setInterval(() => {
      idx += 1;
      setDadReplyTyped(ERASURE_DAD_REPLY.slice(0, idx));
      if (idx >= ERASURE_DAD_REPLY.length) {
        clearInterval(timer);
        addFact('erasure_dad_reply_done');
      }
    }, 95);
    return () => clearInterval(timer);
  }, [erasureActive, erasureDadReplySent, erasureDadReplyDone, addFact]);

  useEffect(() => {
    if (!erasureDadReplyDone) return;
    setDadReplyTyped(ERASURE_DAD_REPLY);
  }, [erasureDadReplyDone]);

  useEffect(() => {
    if (!erasureActive || ghostPhase !== 'accumulating') return;
    let canceled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const spawn = () => {
      if (canceled) return;
      setGhostTexts((prev) => {
        let next: GhostText | null = null;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const x = 6 + Math.random() * 88;
          const y = 8 + Math.random() * 80;
          const tooClose = prev.some((item) => Math.abs(item.x - x) < 8 && Math.abs(item.y - y) < 6);
          if (tooClose) continue;
          next = {
            id: Date.now() + Math.floor(Math.random() * 100000),
            text: ERASURE_GHOST_LINES[Math.floor(Math.random() * ERASURE_GHOST_LINES.length)],
            x,
            y,
            size: 12 + Math.round(Math.random() * 36),
            opacity: 0.4 + Math.random() * 0.5,
          };
          break;
        }

        if (!next) return prev;
        const trimmed = prev.length >= 20 ? prev.slice(prev.length - 19) : prev;
        return [...trimmed, next];
      });
      const wait = 600 + Math.floor(Math.random() * 600);
      timer = setTimeout(spawn, wait);
    };
    spawn();
    const toFlicker = setTimeout(() => {
      setGhostPhase('flicker');
    }, 30000);

    return () => {
      canceled = true;
      if (timer) clearTimeout(timer);
      clearTimeout(toFlicker);
    };
  }, [erasureActive, ghostPhase]);

  useEffect(() => {
    if (!erasureActive || ghostPhase !== 'flicker') return;
    setGhostFlickerLevel(0);
    const flickerTimer = setInterval(() => {
      setGhostFlickerLevel(prev => prev + 1);
    }, 2000);
    const readyTimer = setTimeout(() => {
      setGhostPhase('ready');
      addFact('erasure_shutdown_ready');
    }, 10000);
    return () => {
      clearInterval(flickerTimer);
      clearTimeout(readyTimer);
    };
  }, [erasureActive, ghostPhase, addFact]);

  // 林晓溢出效果（当信号强度 >= 4 时偶发闪烁）
  const [linxiaoFlash, setLinxiaoFlash] = useState(false);
  useEffect(() => {
    if (erasureActive) return;
    if (linXiaoSignalStrength < 4) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setLinxiaoFlash(true);
        setTimeout(() => setLinxiaoFlash(false), 300);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [linXiaoSignalStrength, erasureActive]);

  const [ambientHint, setAmbientHint] = useState<{ text: string; x: number; y: number } | null>(null);
  useEffect(() => {
    if (erasureActive) return;
    if (linXiaoSignalStrength < 2) return;
    // 信号越强，浮现频率越高
    const baseInterval = Math.max(15000 - linXiaoSignalStrength * 1500, 5000);
    const interval = setInterval(() => {
      if (Math.random() < 0.3 + linXiaoSignalStrength * 0.05) {
        const text = AMBIENT_HINTS[Math.floor(Math.random() * AMBIENT_HINTS.length)];
        setAmbientHint({
          text,
          x: 10 + Math.random() * 70,
          y: 10 + Math.random() * 60,
        });
        setTimeout(() => setAmbientHint(null), 800 + Math.random() * 1200);
      }
    }, baseInterval);
    return () => clearInterval(interval);
  }, [linXiaoSignalStrength, erasureActive]);

  const allEmails = useMemo(() => {
    const base = erasureActive
      ? EMAILS.filter((e) => !e.from.toLowerCase().includes('linxiao') && !e.subject.includes('林晓'))
      : EMAILS;
    if (!endingBServiceMailDone) return base;
    if (base.some((e) => e.id === MUTATION_SERVICE_EMAIL.id)) return base;
    return [MUTATION_SERVICE_EMAIL, ...base];
  }, [endingBServiceMailDone, erasureActive]);

  useEffect(() => {
    if (!allEmails.length) {
      setSelectedEmail(null);
      return;
    }
    if (!selectedEmail || !allEmails.some((e) => e.id === selectedEmail.id)) {
      setSelectedEmail(allEmails[0]);
    }
  }, [allEmails, selectedEmail]);

  const bumpWindowFocus = useCallback((id: string) => {
    setWindowFocusTick(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

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
    if (id === 'wechat') {
      setWechatRead(true);
    }
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
    } else {
      // 若已打开且被最小化，则将其还原
      toggleWindowMinimize(id, false);
    }
    bumpWindowFocus(id);
  };
  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
    setMinimizedWindows(prev => prev.filter(w => w !== id));
    if (id === 'email') setSelectedEmail(null);
    if (id === 'calendar') setShowCalendar(false);
  };

  const handleShutdown = () => {
    if (mutationShutdownProtected) {
      setStartMenuOpen(false);
      return;
    }
    if (erasureActive && !canShutdown) {
      setStartMenuOpen(false);
      return;
    }
    setStartMenuOpen(false);
    setCurrentApp('shutdown');
  };

  const handleResetProgress = () => {
    setStartMenuOpen(false);
    resetGame();
  };

  const handleOpenBrowser = (target: 'clinic' | 'forum' | 'oa') => {
    setStartMenuOpen(false);
    setBrowserApp(target);
    openWindow('browser');
  };

  const handleErasureQuickReply = (reply: string) => {
    if (reply !== ERASURE_DAD_PROMPT || erasureDadReplySent) return;
    addFact('erasure_dad_reply_sent');
    setWechatChat('dad');
  };

  const showSendFailHint = () => {
    setWechatSendHint('消息发送失败，对方可能已关闭消息通知。');
    if (sendHintTimerRef.current) {
      clearTimeout(sendHintTimerRef.current);
    }
    sendHintTimerRef.current = setTimeout(() => {
      setWechatSendHint('');
      sendHintTimerRef.current = null;
    }, 2800);
  };

  const handleWechatSend = () => {
    if (!canSendWechat) return;
    if (!wechatMsg.trim()) return;
    setWechatMsg('');
    // 仅林晓会话存在“发送失败”反馈，其他会话不弹失败提示。
    if (wechatChat === 'linxiao') {
      showSendFailHint();
    } else {
      setWechatSendHint('');
    }
  };

  useEffect(() => {
    return () => {
      if (sendHintTimerRef.current) {
        clearTimeout(sendHintTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (wechatChat !== 'linxiao' && sendHintTimerRef.current) {
      clearTimeout(sendHintTimerRef.current);
      sendHintTimerRef.current = null;
      setWechatSendHint('');
    }
  }, [wechatChat]);

  const getBrowserTitle = () => {
    if (browserApp === 'clinic') return '安宁深眠诊所 Tranquil Sleep Clinic';
    if (browserApp === 'forum') return '安宁社区论坛';
    if (browserApp === 'oa') return '内网系统 OA';
    if (browserApp === 'meridian') return 'MERIDIAN LIFE SCIENCES';
    return '浏览器';
  };

  const timeStr = '03:47';
  const dateStr = '3月14日';

  return (
    <div
      className="fixed inset-0 bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/desktop_wallpaper.png)` }}
      onClick={() => startMenuOpen && setStartMenuOpen(false)}
    >
      {/* P2-10 信号强度视觉覆盖层（0-7级） */}
      {!erasureActive && linXiaoSignalStrength >= 2 && (
        <div
          className="fixed inset-0 pointer-events-none z-[1]"
          style={{
            background: linXiaoSignalStrength >= 6
              ? `radial-gradient(ellipse at 50% 80%, rgba(255,0,60,${0.03 + linXiaoSignalStrength * 0.02}) 0%, transparent 70%)`
              : linXiaoSignalStrength >= 4
                ? `radial-gradient(ellipse at 50% 90%, rgba(200,0,40,${0.02 + linXiaoSignalStrength * 0.01}) 0%, transparent 60%)`
                : `radial-gradient(ellipse at 50% 100%, rgba(150,0,30,0.02) 0%, transparent 50%)`,
            animation: linXiaoSignalStrength >= 6 ? 'pulse 4s ease-in-out infinite' : undefined,
          }}
        />
      )}
      {!erasureActive && linXiaoSignalStrength >= 7 && (
        <div className="fixed bottom-16 right-6 text-red-900/20 text-[10px] font-mono pointer-events-none z-[1] animate-pulse">
          LX-044-YIN 信号已锚定
        </div>
      )}
      {/* P2-15 被动环境暗示：随机浮现的幽灵文字 */}
      {!erasureActive && ambientHint && (
        <div
          className="fixed pointer-events-none z-[2] text-red-500/15 text-xs font-mono select-none"
          style={{
            left: `${ambientHint.x}%`,
            top: `${ambientHint.y}%`,
            animation: 'fade-in-up 0.3s ease-out, fade-out 0.5s ease-in forwards',
            animationDelay: '0s, 0.8s',
          }}
        >
          {ambientHint.text}
        </div>
      )}
      {erasureActive && ghostTexts.map((item) => (
        <span
          key={item.id}
          className="fixed pointer-events-none select-none font-serif text-red-600 z-[10]"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
            fontSize: `${item.size}px`,
            textShadow: '0 0 6px rgba(120, 0, 0, 0.25)',
            animation: ghostPhase === 'flicker' || ghostPhase === 'ready'
              ? `ghost-flicker ${Math.max(0.08, 0.7 - ghostFlickerLevel * 0.06)}s steps(2, end) infinite`
              : undefined,
          }}
        >
          {item.text}
        </span>
      ))}
      {wechatNotice && (
        <button
          className="fixed bottom-14 right-3 z-[400] w-56 rounded-md border border-zinc-700 bg-zinc-900/95 text-zinc-100 shadow-2xl px-3 py-2 text-left"
          onClick={() => {
            openWindow('wechat');
            if (wechatNotice.targetChat) {
              setWechatChat(wechatNotice.targetChat);
            }
            setWechatNotice(null);
          }}
        >
          <p className="text-xs font-semibold">{wechatNotice.title}</p>
          <p className="text-xs text-zinc-300 mt-1">{wechatNotice.message}</p>
        </button>
      )}
      {/* 桌面图标区 */}
      <div className="absolute top-6 left-6 flex flex-col gap-4">
        <DesktopIcon
          icon={<MessageCircle className="w-8 h-8" />}
          label="微信"
          badge={wechatBadge}
          onClick={() => openWindow('wechat')}
        />
        <DesktopIcon icon={<Globe className="w-8 h-8" />} label="安宁官网" onClick={() => handleOpenBrowser('clinic')} />
        <DesktopIcon icon={<Mail className="w-8 h-8" />} label="邮件" onClick={() => openWindow('email')} />
        <DesktopIcon icon={<Image className="w-8 h-8" />} label="晓的照片" onClick={() => openWindow('photos')} />
        <DesktopIcon icon={<FileText className="w-8 h-8" />} label="门诊单" onClick={() => openWindow('record')} />
        <DesktopIcon icon={<Calendar className="w-8 h-8" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); }} />
      </div>

      {erasureActive && ghostPhase === 'ready' && (
        <button
          className="fixed bottom-[60px] right-6 z-[350] px-4 py-2 border border-red-500 text-white font-mono text-sm bg-black/70 hover:bg-red-900/40 transition-colors"
          onClick={handleShutdown}
        >
          [ 关机 ]
        </button>
      )}

      {mutationMode && (
        <button
          className="fixed bottom-[62px] right-6 z-[351] text-[10px] text-zinc-400 hover:text-zinc-200 font-mono"
          onClick={() => setCurrentApp('credits')}
        >
          [ 结束观察 ]
        </button>
      )}


      {/* ===== 微信窗口（参考真实微信PC端布局）===== */}
      {openWindows.includes('wechat') && (
        <DraggableWindow
          title="微信"
          icon={<MessageCircle className="w-3.5 h-3.5" />}
          onClose={() => closeWindow('wechat')}
          width={820}
          height={560}
          defaultPosition={{ x: 100, y: 60 }}
          focusTick={windowFocusTick['wechat'] ?? 0}
          isMinimized={minimizedWindows.includes('wechat')}
          onMinimizeToggle={(min) => toggleWindowMinimize('wechat', min)}
        >
          <div className="flex h-full bg-[#f5f5f5]">
            <div className="w-14 bg-[#2e2e2e] flex flex-col items-center py-4 gap-3 shrink-0">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-2">
                <span className="text-white text-xs font-bold">浩</span>
              </div>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 bg-white/5"><MessageCircle className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10"><Search className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10"><FolderOpen className="w-4 h-4" /></button>
              <div className="flex-1" />
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="w-60 bg-[#e7e7e7] border-r border-[#d5d5d5] flex flex-col shrink-0">
              <div className="p-2">
                <div className="bg-[#dcdcdc] rounded-md px-3 py-1.5 flex items-center gap-2">
                  <Search className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">搜索</span>
                </div>
              </div>

              {!erasureActive && (
                <div className={`px-3 py-2.5 flex items-center gap-3 cursor-pointer ${wechatChat === 'linxiao' ? 'bg-[#c6c6c6]' : 'hover:bg-[#d8d8d8]'} transition-colors`} onClick={() => setWechatChat('linxiao')}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">晓</span></div>
                    {!wechatRead && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{erasureActive || mutationMode ? '1' : '3'}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 font-medium">林晓</div>
                    <div className="text-[11px] text-gray-500 truncate">{mutationMode && endingBLinxiaoMessageVisible ? MUTATION_LINXIAO_MESSAGE : '明天去了，不用担心我。'}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{mutationMode && endingBLinxiaoMessageVisible ? '今天' : '01/09'}</span>
                </div>
              )}

              {[
                { id: 'dad', name: '爸', msg: endingBDadMessageVisible ? MUTATION_DAD_MESSAGE : '让她给家里打个电话。', time: endingBDadMessageVisible ? '今天' : '03/10', color: 'from-blue-300 to-blue-500' },
                { id: 'clinic', name: '诊所前台', msg: '您好，您已接通安宁深眠…', time: '02/25', color: 'from-teal-300 to-teal-500' },
                { id: 'filehelper', name: '文件传输助手', msg: '没有什么好忧郁的，我就想…', time: '01/10', color: 'from-green-400 to-green-600' },
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

            <div className="flex-1 flex flex-col bg-[#f5f5f5]">
              <div className="h-12 px-4 flex items-center justify-between border-b border-[#e0e0e0] bg-[#f5f5f5] shrink-0">
                <span className="text-sm font-medium text-gray-800">{wechatChat === 'linxiao' ? '林晓' : wechatChat === 'dad' ? '爸' : wechatChat === 'clinic' ? '诊所前台' : '文件传输助手'}</span>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <Video className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {wechatChat === 'linxiao' && mutationMode && (
                  <>
                    {endingBLinxiaoMessageVisible ? (
                      <>
                        <div className="text-center text-[11px] text-gray-400 my-2">今天</div>
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center shrink-0">
                            <div className="w-9 h-9 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center"><span className="text-white font-bold text-xs">晓</span></div>
                            <span className="text-[10px] text-gray-400 mt-1">该账号当前不在此设备上运行。</span>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">{MUTATION_LINXIAO_MESSAGE}</div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-500">暂无新消息。</div>
                    )}
                  </>
                )}

                {wechatChat === 'linxiao' && !erasureActive && !mutationMode && (
                  <>
                    <div className="text-center text-[11px] text-gray-400 my-2">1月9日 02:34</div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">晓</span></div>
                      <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">明天去了，不用担心我。</div>
                    </div>
                    <div className="text-center text-[11px] text-gray-400 my-2">3月10日 22:31</div>
                    <div className="flex items-start gap-3 justify-end">
                      <div>
                        <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">你到底怎么了。</div>
                        <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                      </div>
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                    </div>
                    <div className="text-center text-[11px] text-gray-400 my-2">3月14日 09:12</div>
                    <div className="flex items-start gap-3 justify-end">
                      <div>
                        <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">林晓你在吗。</div>
                        <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                      </div>
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                    </div>
                    <div className="text-center text-[11px] text-gray-400 my-2">3月19日 03:47</div>
                    <div className="flex items-start gap-3 justify-end">
                      <div>
                        <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">我来接你。</div>
                        <div className="text-right text-[10px] text-gray-400 mt-0.5">已送达，未读</div>
                      </div>
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                    </div>
                  </>
                )}

                {wechatChat === 'linxiao' && erasureActive && (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">该联系人已不存在。</div>
                )}

                {wechatChat === 'dad' && !erasureActive && (
                  <>
                    <div className="text-center text-[11px] text-gray-400 my-2">3月10日 19:45</div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                      <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">林浩，你妹妹还不回电话。你妈天天念叨。</div>
                    </div>
                    {endingBDadMessageVisible && (
                      <>
                        <div className="text-center text-[11px] text-gray-400 my-2">今天</div>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                          <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">{MUTATION_DAD_MESSAGE}</div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {wechatChat === 'dad' && erasureActive && (
                  <>
                    <div className="text-center text-[11px] text-gray-400 my-2">今天 19:32</div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                      <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">爸：什么时候来吃饭？ 今天做了你喜欢的红烧肉。</div>
                    </div>
                    {erasureDadReplySent && (
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">{ERASURE_DAD_PROMPT}</div>
                        <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                      </div>
                    )}
                    {dadReplyTyped && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">爸</span></div>
                        <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">{dadReplyTyped}</div>
                      </div>
                    )}
                  </>
                )}

                {wechatChat === 'clinic' && (
                  <>
                    <div className="text-center text-[11px] text-gray-400 my-2">2月5日 10:30</div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">你好，我是患者林晓的家属，想了解一下她的治疗情况。</div>
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">诊</span></div>
                      <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">您好，您已接通安宁深眠诊所患者服务热线。林晓女士目前正处于康复关键期，暂不适宜接受探视。</div>
                    </div>
                  </>
                )}

                {wechatChat === 'filehelper' && (
                  <>
                    <div className="text-center text-[11px] text-gray-400 my-2">1月10日 03:47</div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-[#95ec69] rounded-lg px-3 py-2 max-w-xs shadow-sm text-sm text-gray-800">没有什么好忧郁的，我就是想不通她为什么不肯让我帮忙。</div>
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-xs">浩</span></div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-[#e0e0e0] bg-[#f5f5f5] shrink-0">
                {!erasureActive ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-1.5 text-gray-400">
                      <Smile className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                      <Scissors className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                      <FolderOpen className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                      <Image className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                      <Mic className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                    </div>
                    <div className="px-4 pb-2">
                      <textarea
                        className="w-full h-16 bg-white rounded border-none outline-none resize-none text-sm text-gray-800 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder={mutationLinxiaoLocked ? '该账号当前不在此设备上运行。' : '输入消息…'}
                        value={wechatMsg}
                        disabled={!canSendWechat}
                        onChange={e => setWechatMsg(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleWechatSend();
                          }
                        }}
                      />
                    </div>
                    <div className="px-4 pb-1 min-h-[18px]"><span className={`text-[11px] transition-opacity ${wechatSendHint ? 'text-red-500/90 opacity-100' : 'text-transparent opacity-0'}`}>{wechatSendHint || '占位'}</span></div>
                    <div className="flex justify-between items-center px-4 pb-2">
                      <span className="text-[10px] text-gray-400">Shift+Enter 换行</span>
                      <button
                        className={`px-4 py-1 rounded text-xs transition-colors ${canSendWechat ? 'bg-[#e0e0e0] text-gray-500 hover:bg-[#d5d5d5]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        onClick={handleWechatSend}
                        disabled={!canSendWechat}
                      >
                        发送(S)
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3 space-y-2">
                    {wechatChat === 'dad' ? (
                      <div className="grid grid-cols-3 gap-2">
                        <button className="px-2 py-2 bg-white text-gray-700 rounded text-xs border border-gray-200" onClick={() => {}}>好的，周末去</button>
                        <button className="px-2 py-2 bg-white text-gray-700 rounded text-xs border border-gray-200" onClick={() => handleErasureQuickReply(ERASURE_DAD_PROMPT)}>{ERASURE_DAD_PROMPT}</button>
                        <button className="px-2 py-2 bg-white text-gray-700 rounded text-xs border border-gray-200" onClick={() => {}}>最近有点忙</button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 py-1">当前会话不可发送消息。</div>
                    )}
                  </div>
                )}
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
          focusTick={windowFocusTick['email'] ?? 0}
          isMinimized={minimizedWindows.includes('email')}
          onMinimizeToggle={(min) => toggleWindowMinimize('email', min)}
        >
          <div className="flex h-full">
            {/* 邮件列表 */}
            <div className="w-64 border-r border-zinc-700 overflow-y-auto bg-zinc-900/95">
                <div className="p-3 border-b border-zinc-700 flex items-center gap-2 text-zinc-400 text-xs">
                  <Inbox className="w-3.5 h-3.5" /> 收件箱({allEmails.length})
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

      {/* ===== 晓的照片窗口 (V4 路线3.2) ===== */}
      {openWindows.includes('photos') && (
        <DraggableWindow
          title="晓的照片"
          icon={<Image className="w-3.5 h-3.5" />}
          onClose={() => { closeWindow('photos'); setSelectedPhoto(null); }}
          width={680}
          height={480}
          defaultPosition={{ x: 180, y: 100 }}
          focusTick={windowFocusTick['photos'] ?? 0}
          isMinimized={minimizedWindows.includes('photos')}
          onMinimizeToggle={(min) => toggleWindowMinimize('photos', min)}
        >
          <div className="h-full bg-zinc-900 overflow-y-auto p-4">
            {erasureActive ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-zinc-500">
                  <Image className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">文件夹为空</p>
                  <p className="text-xs mt-1 text-zinc-600">没有可恢复的影像文件。</p>
                </div>
              </div>
            ) : selectedPhoto === null ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 0, desc: '路边摊晚饭', sub: '她在笑，但眼底有很深的阴影。' },
                  { id: 1, desc: '手机截图', sub: '凌晨03:47的时钟，配字只有一个句号。' },
                  { id: 2, desc: '诊所宣传页', sub: '“这个好像不错，我想试试。”' },
                  { id: 3, desc: '林浩回复', sub: '“贵不贵？我帮你出。”' },
                  { id: 4, desc: '林晓回复', sub: '“不用，我自己来。”' },
                  { id: 5, desc: '最后一条消息', sub: '“我来接你。” 已送达，未读。' },
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
                        <p className="text-sm text-zinc-300">两个人在路边摊吃晚饭。</p>
                        <p className="text-sm text-zinc-300 mt-2">林晓在笑，但眼底有很深的阴影。</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 1 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-black rounded-lg p-6 mb-4">
                          <p className="text-4xl font-mono text-white">03:47</p>
                          <p className="text-xs text-zinc-500 mt-2">2024年3月14日 星期四</p>
                        </div>
                        <p className="text-sm text-zinc-300">林晓发给林浩的手机截图。</p>
                        <p className="text-sm text-zinc-400 mt-2">配字只有一个句号：<span className="text-zinc-300">“。”</span></p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 2 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-gradient-to-br from-teal-900/30 to-blue-900/30 border border-teal-700/30 rounded-lg p-4 mb-4">
                          <p className="text-teal-300 font-bold text-sm">安宁深眠诊所</p>
                          <p className="text-teal-400/60 text-xs mt-1">DNR 深度睡眠修复疗法</p>
                          <p className="text-teal-400/60 text-xs">恢复率97.3% · 无创无痛 · 医保可报</p>
                        </div>
                        <p className="text-sm text-zinc-300">林晓在图片下方打了一行字：</p>
                        <p className="text-sm text-pink-300 mt-2 italic">“这个好像不错，我想试试。”</p>
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 3 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-[#95ec69] rounded-lg px-4 py-2 inline-block mb-4">
                          <p className="text-sm text-gray-800">贵不贵？我帮你出。</p>
                        </div>
                        <p className="text-sm text-zinc-300 mt-2">林浩的回复截图。</p>
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
                      </div>
                    </div>
                  )}
                  {selectedPhoto === 5 && (
                    <div className="text-center max-w-md">
                      <div className="bg-zinc-800 rounded-lg p-8 mb-4">
                        <div className="bg-[#95ec69] rounded-lg px-4 py-2 inline-block mb-4">
                          <p className="text-sm text-gray-800">我来接你。</p>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">已送达，未读</p>
                        <p className="text-sm text-zinc-300 mt-4">林浩发出的最后一条消息。</p>
                        <p className="text-sm text-zinc-400 mt-1">3月19日，凌晨3点47分。</p>
                        <p className="text-sm text-red-400/60 mt-2">没有已读。</p>
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
          focusTick={windowFocusTick['record'] ?? 0}
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
          focusTick={windowFocusTick['calendar'] ?? 0}
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
          focusTick={windowFocusTick['browser'] ?? 0}
          isMinimized={minimizedWindows.includes('browser')}
          onMinimizeToggle={(min) => toggleWindowMinimize('browser', min)}
        >
          {browserApp === 'clinic' && (
            <Browser title="安宁深眠诊所" defaultUrl="https://www.tranquil-sleep.com">
              {erasureActive ? <ErasedSite404 siteName="安宁官网" /> : <Clinic />}
            </Browser>
          )}
          {browserApp === 'forum' && (
            <Browser title="安宁社区 - 病友交流论坛" defaultUrl="https://forum.tranquil-sleep.com/bbs">
              {erasureActive ? <ErasedSite404 siteName="安宁论坛" /> : <Forum />}
            </Browser>
          )}
          {browserApp === 'oa' && (
            <Browser title="TRANQUIL SLEEP CLINIC - INTRANET" defaultUrl="https://oa.tranquil-sleep.com/login">
              <OA />
            </Browser>
          )}
          {browserApp === 'meridian' && (
            <Browser title="MERIDIAN LIFE SCIENCES" defaultUrl="https://www.meridian-ls.com">
              <Meridian />
            </Browser>
          )}
        </DraggableWindow>
      )}

      {/* ===== 任务栏 ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-11 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700/50 flex items-center px-2 z-[200]">
        {/* 寮€濮嬫寜閽?*/}
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

        {/* 已打开窗口标签 */}
        <div className="flex-1 flex gap-1 ml-2">
          {openWindows.map(w => (
            <div
              key={w}
              className={`h-7 px-3 rounded flex items-center text-xs cursor-pointer select-none transition-colors border
                ${minimizedWindows.includes(w)
                  ? 'bg-zinc-800/40 text-zinc-500 border-zinc-700/30 hover:bg-zinc-700/50'
                  : 'bg-zinc-800/80 text-zinc-200 border-zinc-600/50 shadow-inner'}`}
              onClick={() => {
                if (minimizedWindows.includes(w)) {
                  toggleWindowMinimize(w, false);
                  bumpWindowFocus(w);
                } else {
                  toggleWindowMinimize(w, true);
                }
              }}
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
            <MenuItem icon={<Mail className="w-4 h-4" />} label="邮件" onClick={() => { openWindow('email'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Image className="w-4 h-4" />} label="晓的照片" onClick={() => { openWindow('photos'); setStartMenuOpen(false); }} />
            <MenuItem icon={<FileText className="w-4 h-4" />} label="门诊单" onClick={() => { openWindow('record'); setStartMenuOpen(false); }} />
            <MenuItem icon={<Calendar className="w-4 h-4" />} label="日历" onClick={() => { openWindow('calendar'); setShowCalendar(true); setStartMenuOpen(false); }} />
          </div>
          <div className="border-t border-zinc-800 p-2">
            <MenuItem
              icon={<RotateCcw className="w-4 h-4 text-orange-400" />}
              label="清除进度并重启"
              onClick={handleResetProgress}
            />
            <MenuItem
              icon={<Power className={`w-4 h-4 ${mutationShutdownProtected ? 'text-zinc-600' : canShutdown ? 'text-red-400' : 'text-zinc-600'}`} />}
              label={mutationShutdownProtected ? '关机（会话受保护，不可执行）' : canShutdown ? '关机' : '关机（不可用）'}
              onClick={handleShutdown}
              danger={!mutationShutdownProtected && canShutdown}
              disabled={mutationShutdownProtected ? true : !canShutdown}
            />
          </div>
        </div>
      )}

      {/* 林晓溢出闪烁层 */}
      {!erasureActive && linxiaoFlash && (
        <div className="fixed inset-0 pointer-events-none z-[9000] flex items-center justify-center">
          <span className="text-white/20 text-4xl font-serif italic linxiao-glitch">
            ……帮帮我……
          </span>
        </div>
      )}
    </div>
  );
}

function ErasedSite404({ siteName }: { siteName: string }) {
  return (
    <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-200">
      <div className="text-center space-y-3">
        <p className="text-5xl font-mono text-zinc-500">404</p>
        <p className="text-sm text-zinc-300">{siteName} 无法访问</p>
        <p className="text-xs text-zinc-500 font-mono">ERR_RESOURCE_NOT_FOUND</p>
      </div>
    </div>
  );
}

// 桌面图标子组件
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

// ===== 开始菜单项组件 =====
function MenuItem({ icon, label, onClick, danger, disabled }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean; disabled?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors
        ${disabled
          ? 'text-zinc-500 cursor-not-allowed'
          : danger ? 'text-red-400 hover:bg-red-900/30' : 'text-zinc-300 hover:bg-zinc-800'}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// 门诊单翻转卡片
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
          <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 mb-2">安宁深眠诊所</div>
              <div className="text-sm text-gray-600">门诊记录单</div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>患者姓名：林晓</p>
                <p>就诊日期：2024-01-15</p>
                <p>主治医师：林德坤</p>
                <p>诊断：顽固性失眠症</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/outpatient_scan.png`}
              alt="门诊单背面"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-3 text-red-600 font-mono text-xs font-bold">
              LX-044-YIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 日历组件
function CalendarWidget() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="p-4 bg-zinc-900 h-full">
      <div className="text-center text-zinc-300 font-bold mb-3">2024年3月</div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {weekDays.map(d => (
          <div key={d} className="text-zinc-500 py-1 font-bold">{d}</div>
        ))}
        {/* 2024年3月1日是周五，前面补5个空格 */}
        {Array.from({ length: 5 }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => (
          <div
            key={day}
            className={`py-1.5 rounded text-zinc-400 transition-colors relative
              ${day === 13 ? 'bg-red-900/40 text-red-400 font-bold' : 'hover:bg-zinc-800'}
              ${day === 14 ? 'ring-1 ring-blue-500/50' : ''}`}
          >
            {day}
            {day === 13 && (
              <X className="w-3 h-3 absolute top-0 right-0 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

