import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../GameContext';
import { Mail, FileText, FileWarning, X, Globe, Folder, Wifi, Battery, ChevronRight, Bell, Monitor } from 'lucide-react';

// ═══════════════════════════════════════════
//  邮件数据
// ═══════════════════════════════════════════
const emails = [
  {
    id: 'encrypted',
    from: 'z***@tranquil-sleep.com',
    subject: '⚠ [加密] 无标题',
    date: '2024-06-01 03:14',
    unread: true,
    important: true,
    body: [
      '她没有出院，也没有被转院。',
      '查查这家诊所三个月前的那起"医疗事故新闻"。门诊单背面有她的挂号条码。不要盯着他们网页那个标志看太久。',
      '我在试着断电。如果你收到这封邮件，说明我的定时发送生效了——也说明我可能已经失败了。',
      '（如果你在系统里看到古铜色的奇怪符号，收集它们。那是我留下的后门。）',
      '快点。',
    ],
  },
  {
    id: 'sister',
    from: '林晓 <xiaoxiao@mail.com>',
    subject: '哥 今天做了个奇怪的治疗',
    date: '2024-03-11 19:42',
    unread: false,
    important: false,
    body: [
      '哥，今天做了那个什么"深度神经共振"，说是能让我彻底睡个好觉。',
      '做完之后感觉轻飘飘的，好像灵魂被抽走了一截。护士说这是正常反应，叫"短暂的精神剥离感"。',
      '不过这里的医生态度都挺好的，尤其是那个钟博士，说话温温柔柔的。只是……他笑起来的时候眼睛不笑，我说不上来那种感觉。',
      '对了，机房那层走廊的灯永远是坏的，上次路过的时候好像听到有人在里面念什么……算了不说了，可能是我失眠太久产生幻觉。',
      '等我治好了就回家，你别担心。',
    ],
  },
  {
    id: 'father',
    from: '爸爸',
    subject: 'Fwd: 不予立案通知书',
    date: '2024-04-20 08:15',
    unread: false,
    important: true,
    body: [
      '我转发这个给你看看，警察说你妹妹是被我签字同意转院的？？',
      '我根本没有签过任何同意书！！！他们伪造的！！',
      '那个诊所的人说什么"患者处于深度疗养期，暂不适宜探视"，都快两个月了，探视一次也不让。',
      '你帮我想想办法，我不信这个邪。你妹妹一定还在那里面。',
    ],
  },
  {
    id: 'welcome',
    from: 'no-reply@tranquil-sleep.com',
    subject: '欢迎选择安宁深眠诊所',
    date: '2024-03-09 10:00',
    unread: false,
    important: false,
    body: [
      '尊敬的林晓女士：',
      '感谢您选择安宁深眠诊所。您已成功预约3月10日神经共振科的初诊检查。',
      '请携带本人身份证件及近期睡眠监测报告前来就诊。我院地址：南郊市科技园西路8号。',
      '温馨提示：DNR疗法为我院独创的第三代深度神经共振技术，安全性经过临床验证，请放心体验。',
      '——安宁深眠诊所 · 为您找回失去的安宁',
    ],
  },
];

export function Desktop() {
  const { setCurrentApp, addClue, clues } = useGame();
  const [activeModal, setActiveModal] = useState<'email-app' | 'record' | 'police' | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isRecordFlipped, setIsRecordFlipped] = useState(false);
  const [readFiles, setReadFiles] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [bootAnimation, setBootAnimation] = useState(true);

  // 开机动画
  useEffect(() => {
    const t = setTimeout(() => setBootAnimation(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // 检查是否三个文件都读过，弹出浏览器提示通知 (FLOW-001)
  useEffect(() => {
    if (readFiles.size >= 3 && !clues.some(c => c.id === 'browser-hint')) {
      const t = setTimeout(() => {
        setNotification('📌 你在浏览器收藏夹里发现了一个网址：www.tranquil-sleep.com');
        addClue({
          id: 'browser-hint',
          title: '浏览器收藏夹',
          description: '三份文件都看完后，你注意到浏览器收藏夹里有一个地址：安宁深眠诊所官网。'
        });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [readFiles, clues, addClue]);

  const markFileRead = useCallback((file: string) => {
    setReadFiles(prev => new Set(prev).add(file));
  }, []);

  const handleFlipRecord = () => {
    setIsRecordFlipped(!isRecordFlipped);
    if (!isRecordFlipped) {
      addClue({
        id: 'lx-044-yin',
        title: '门诊单背面的刻字',
        description: '用指甲掐出来的歪歪扭扭的字符：LX-044-YIN。角落还有一个极小的无限符号 ∞。'
      });
    }
  };

  const openEmailApp = () => {
    setActiveModal('email-app');
    setSelectedEmail(null);
    markFileRead('email');
  };

  const openRecord = () => {
    setActiveModal('record');
    markFileRead('record');
  };

  const openPolice = () => {
    setActiveModal('police');
    markFileRead('police');
  };

  // ─── 开机动画 ───
  if (bootAnimation) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Monitor className="w-16 h-16 text-blue-400 animate-pulse" />
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-[loading_1.2s_ease-in-out]"
            style={{ animation: 'loading 1.2s ease-in-out forwards' }} />
        </div>
        <p className="text-zinc-600 text-xs font-mono">ZhenOS v3.14 · Booting...</p>
      </div>
    );
  }

  const currentEmail = emails.find(e => e.id === selectedEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#111832] to-[#0d1529] relative overflow-hidden select-none flex flex-col">

      {/* ═══ 壁纸装饰 ═══ */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
      </div>

      {/* ═══ 通知弹窗 ═══ */}
      {notification && (
        <div className="absolute top-4 right-4 z-[90] max-w-sm animate-[slideInRight_0.3s_ease-out]">
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1">系统通知</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{notification}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-zinc-600 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 桌面图标区 ═══ */}
      <div className="flex-1 p-8 relative z-10">
        <div className="grid grid-cols-6 gap-x-4 gap-y-6 max-w-3xl">
          {/* 邮件客户端 */}
          <button onClick={openEmailApp} className="flex flex-col items-center gap-2 group w-20">
            <div className="w-14 h-14 bg-white/[0.07] rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/[0.15] group-hover:border-white/25 transition-all duration-200 relative">
              <Mail className="w-7 h-7 text-blue-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">4</span>
            </div>
            <span className="text-white/70 text-[11px] text-center leading-tight group-hover:text-white transition-colors">邮件</span>
          </button>

          {/* 门诊单 */}
          <button onClick={openRecord} className="flex flex-col items-center gap-2 group w-20">
            <div className="w-14 h-14 bg-white/[0.07] rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/[0.15] group-hover:border-white/25 transition-all duration-200">
              <FileText className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-white/70 text-[11px] text-center leading-tight group-hover:text-white transition-colors">门诊单<br />扫描件</span>
          </button>

          {/* 报案回执 */}
          <button onClick={openPolice} className="flex flex-col items-center gap-2 group w-20">
            <div className="w-14 h-14 bg-white/[0.07] rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/[0.15] group-hover:border-white/25 transition-all duration-200">
              <FileWarning className="w-7 h-7 text-red-300" />
            </div>
            <span className="text-white/70 text-[11px] text-center leading-tight group-hover:text-white transition-colors">报案回执</span>
          </button>

          {/* 文件管理器 */}
          <button className="flex flex-col items-center gap-2 group w-20 opacity-50 cursor-not-allowed" title="暂无可用文件">
            <div className="w-14 h-14 bg-white/[0.07] rounded-xl flex items-center justify-center border border-white/10">
              <Folder className="w-7 h-7 text-yellow-300" />
            </div>
            <span className="text-white/70 text-[11px] text-center leading-tight">文件管理</span>
          </button>
        </div>
      </div>

      {/* ═══ 底部任务栏 ═══ */}
      <div className="relative z-10 bg-black/60 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-between">
        {/* 左侧 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors cursor-default">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-white/80 text-xs font-mono">ZhenOS</span>
          </div>
        </div>

        {/* 中间：Dock */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl px-2 py-1 border border-white/10">
          <button onClick={openEmailApp} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors relative" title="邮件">
            <Mail className="w-5 h-5 text-blue-300" />
          </button>
          <button onClick={() => setCurrentApp('clinic')} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" title="浏览器">
            <Globe className="w-5 h-5 text-cyan-300" />
          </button>
          <button onClick={openRecord} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" title="文件">
            <FileText className="w-5 h-5 text-amber-300" />
          </button>
        </div>

        {/* 右侧：系统状态 */}
        <div className="flex items-center gap-3 text-white/50 text-xs font-mono">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
          <span>03:14</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  弹窗：邮件客户端                            */}
      {/* ═══════════════════════════════════════════ */}
      {activeModal === 'email-app' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="bg-zinc-900 w-full max-w-4xl h-[520px] rounded-xl shadow-2xl border border-zinc-700 overflow-hidden flex flex-col animate-[scaleIn_0.2s_ease-out]">
            {/* 标题栏 */}
            <div className="bg-zinc-800 px-4 py-2.5 border-b border-zinc-700 flex justify-between items-center shrink-0">
              <span className="text-zinc-300 text-sm font-medium">📧 邮件</span>
              <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            {/* 内容 */}
            <div className="flex flex-1 min-h-0">
              {/* 邮件列表 */}
              <div className="w-72 border-r border-zinc-700 overflow-y-auto shrink-0">
                {emails.map(email => (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email.id)}
                    className={`w-full text-left px-4 py-3 border-b border-zinc-800 transition-colors ${selectedEmail === email.id ? 'bg-blue-900/40 border-l-2 border-l-blue-400' : 'hover:bg-zinc-800/60'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {email.unread && <span className="w-2 h-2 bg-blue-400 rounded-full shrink-0" />}
                      {email.important && <span className="text-red-400 text-xs">!</span>}
                      <span className="text-zinc-400 text-[11px] ml-auto font-mono">{email.date.split(' ')[0]}</span>
                    </div>
                    <p className={`text-sm truncate ${email.unread ? 'text-white font-semibold' : 'text-zinc-300'}`}>{email.subject}</p>
                    <p className="text-zinc-500 text-xs truncate mt-0.5">{email.from}</p>
                  </button>
                ))}
              </div>
              {/* 邮件正文 */}
              <div className="flex-1 overflow-y-auto">
                {currentEmail ? (
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-white mb-3">{currentEmail.subject}</h2>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 pb-4 border-b border-zinc-800">
                      <span>发件人: <span className="text-zinc-300">{currentEmail.from}</span></span>
                      <span className="ml-auto">{currentEmail.date}</span>
                    </div>
                    <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                      {currentEmail.body.map((line, i) => (
                        <p key={i} className={
                          currentEmail.id === 'encrypted' && i === currentEmail.body.length - 1 ? 'text-red-400 font-bold' :
                            currentEmail.id === 'encrypted' && i === 3 ? 'text-zinc-500 italic text-xs' : ''
                        }>{line}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                    选择一封邮件查看
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/*  弹窗：门诊单（保留原3D翻转逻辑）           */}
      {/* ═══════════════════════════════════════════ */}
      {activeModal === 'record' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 perspective-1000">
          <div className="relative w-full max-w-md h-[600px] transition-transform duration-700 preserve-3d animate-[scaleIn_0.2s_ease-out]" style={{ transform: isRecordFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            {/* 正面 */}
            <div className="absolute inset-0 backface-hidden bg-white p-8 shadow-2xl border border-zinc-200 font-serif text-zinc-800 rounded-lg">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black z-10"><X className="w-5 h-5" /></button>
              <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold tracking-widest">安宁深眠诊所</h2>
                <p className="text-sm mt-1">门诊挂号单</p>
              </div>
              <div className="space-y-4 text-sm">
                <p><strong>姓名：</strong> 林晓</p>
                <p><strong>性别：</strong> 女</p>
                <p><strong>年龄：</strong> 24</p>
                <p><strong>科室：</strong> 神经共振科</p>
                <p><strong>日期：</strong> 2024-03-10</p>
                <div className="mt-12 p-4 border border-zinc-300 bg-zinc-50 text-center text-xs text-zinc-500">
                  请妥善保管此单据，凭条码查询就诊进度。
                </div>
              </div>
              <button onClick={handleFlipRecord} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-100 border border-zinc-300 rounded text-sm hover:bg-zinc-200 transition-colors">
                翻转查看背面
              </button>
            </div>
            {/* 背面 */}
            <div className="absolute inset-0 backface-hidden bg-[#fdfbf7] p-8 shadow-2xl border border-zinc-200 rotate-y-180 flex items-center justify-center rounded-lg">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black z-10"><X className="w-5 h-5" /></button>
              <div className="relative w-full h-full border border-zinc-100">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] w-full text-center">
                  <span className="font-mono text-4xl font-bold text-red-900/80 tracking-widest" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                    LX-044-YIN
                  </span>
                </div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-red-800/40 rounded-full blur-sm" />
                <div className="absolute bottom-12 right-12 text-zinc-400 text-xs">∞</div>
              </div>
              <button onClick={handleFlipRecord} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-100 border border-zinc-300 rounded text-sm hover:bg-zinc-200 transition-colors">
                翻转查看正面
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/*  弹窗：报案回执（保留原内容）                */}
      {/* ═══════════════════════════════════════════ */}
      {activeModal === 'police' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#f0f0f0] w-full max-w-xl p-8 shadow-2xl relative font-serif text-zinc-800 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] rounded-lg animate-[scaleIn_0.2s_ease-out]">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-center mb-8 border-b border-zinc-400 pb-4">XX公安局 不予立案通知书</h2>
            <div className="space-y-6 text-sm leading-relaxed">
              <p><strong>报案人：</strong> 你</p>
              <p><strong>报案内容：</strong> 家属林晓（女，24岁）入住安宁深眠诊所后与家属失联。</p>
              <p><strong>处理结果：</strong> 经与院方核实，患者林晓因突发癔症，已于3月15日由家属（父）签字同意转至XX市精神卫生中心继续治疗。<span className="border-b-2 border-red-500 pb-0.5">我局已核实转院手续齐全，不予立案。</span></p>
              <p className="text-xs text-zinc-500 mt-8">备注：院方提供的转院记录有首席研究员钟长明的签字担保。</p>
            </div>
            <div className="absolute bottom-12 right-12 transform rotate-[-10deg]">
              <span className="font-mono text-red-600 text-lg font-bold">爸根本没签过字！！！</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
