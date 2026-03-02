import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Mail, FileText, FileWarning, X, Globe } from 'lucide-react';

export function Desktop() {
  const { setCurrentApp, addClue } = useGame();
  const [activeModal, setActiveModal] = useState<'email' | 'record' | 'police' | null>(null);
  const [isRecordFlipped, setIsRecordFlipped] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#2c221a] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] p-8 relative overflow-hidden selection:bg-amber-900 selection:text-white">
      
      {/* Desktop Icons */}
      <div className="flex flex-col gap-8 max-w-fit">
        <button onClick={() => setActiveModal('email')} className="flex flex-col items-center gap-2 group w-24 hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all shadow-lg">
            <Mail className="w-8 h-8 text-blue-200" />
          </div>
          <span className="text-white/80 text-sm font-medium text-shadow-sm bg-black/40 px-2 py-0.5 rounded">加密邮件.eml</span>
        </button>

        <button onClick={() => setActiveModal('record')} className="flex flex-col items-center gap-2 group w-24 hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all shadow-lg">
            <FileText className="w-8 h-8 text-amber-200" />
          </div>
          <span className="text-white/80 text-sm font-medium text-shadow-sm bg-black/40 px-2 py-0.5 rounded">门诊单扫描件</span>
        </button>

        <button onClick={() => setActiveModal('police')} className="flex flex-col items-center gap-2 group w-24 hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all shadow-lg">
            <FileWarning className="w-8 h-8 text-red-200" />
          </div>
          <span className="text-white/80 text-sm font-medium text-shadow-sm bg-black/40 px-2 py-0.5 rounded">报案回执.pdf</span>
        </button>
      </div>

      {/* Browser Shortcut (To proceed to Clinic) */}
      <div className="absolute top-8 right-8">
        <button onClick={() => setCurrentApp('clinic')} className="flex flex-col items-center gap-2 group w-24 animate-float hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/50 group-hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <span className="text-white text-sm font-bold text-shadow-sm bg-black/60 px-2 py-0.5 rounded">打开浏览器</span>
        </button>
      </div>

      {/* Modals */}
      {activeModal === 'email' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col animate-modal">
            <div className="bg-zinc-100 px-4 py-3 border-b flex justify-between items-center">
              <span className="font-mono text-sm text-zinc-600">Message Viewer</span>
              <button onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 font-sans text-sm space-y-4">
              <div className="border-b pb-4 space-y-2">
                <p><span className="text-zinc-500 w-16 inline-block">发件人:</span> <span className="font-mono bg-black text-white px-1">z***@tranquil-sleep.com</span></p>
                <p><span className="text-zinc-500 w-16 inline-block">收件人:</span> 你</p>
                <p><span className="text-zinc-500 w-16 inline-block">时间:</span> 2024年6月1日 03:14 (定时发送)</p>
              </div>
              <div className="pt-2 text-zinc-800 leading-relaxed space-y-4 text-base">
                <p>她没有出院，也没有被转院。</p>
                <p>查查这家诊所三个月前的那起“医疗事故新闻”。门诊单背面有她的挂号条码。不要盯着他们网页那个标志看太久。</p>
                <p>我在试着断电。如果你收到这封邮件，说明我的定时发送生效了——也说明我可能已经失败了。</p>
                <p className="text-zinc-500 italic text-sm">（如果你在系统里看到古铜色的奇怪符号，收集它们。那是我留下的后门。）</p>
                <p className="font-bold text-red-600">快点。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'record' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 perspective-1000">
          <div className="relative w-full max-w-md h-[600px] transition-transform duration-700 preserve-3d animate-modal" style={{ transform: isRecordFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white p-8 shadow-2xl border border-zinc-200 font-serif text-zinc-800">
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

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-[#fdfbf7] p-8 shadow-2xl border border-zinc-200 rotate-y-180 flex items-center justify-center">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black z-10"><X className="w-5 h-5" /></button>
              
              <div className="relative w-full h-full border border-zinc-100">
                {/* The scratched text */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] w-full text-center">
                  <span className="font-mono text-4xl font-bold text-red-900/80 tracking-widest" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                    LX-044-YIN
                  </span>
                </div>
                {/* Blood/Cinnabar stain */}
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-red-800/40 rounded-full blur-sm"></div>
                {/* Infinity symbol */}
                <div className="absolute bottom-12 right-12 text-zinc-400 text-xs">
                  ∞
                </div>
              </div>

              <button onClick={handleFlipRecord} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-100 border border-zinc-300 rounded text-sm hover:bg-zinc-200 transition-colors">
                翻转查看正面
              </button>
            </div>

          </div>
        </div>
      )}

      {activeModal === 'police' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#f0f0f0] w-full max-w-xl p-8 shadow-2xl relative font-serif text-zinc-800 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] animate-modal">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black"><X className="w-5 h-5" /></button>
            
            <h2 className="text-xl font-bold text-center mb-8 border-b border-zinc-400 pb-4">XX公安局 不予立案通知书</h2>
            
            <div className="space-y-6 text-sm leading-relaxed">
              <p><strong>报案人：</strong> 你</p>
              <p><strong>报案内容：</strong> 家属林晓（女，24岁）入住安宁深眠诊所后与家属失联。</p>
              <p><strong>处理结果：</strong> 经与院方核实，患者林晓因突发癔症，已于3月15日由家属（父）签字同意转至XX市精神卫生中心继续治疗。<span className="border-b-2 border-red-500 pb-0.5">我局已核实转院手续齐全，不予立案。</span></p>
              <p className="text-xs text-zinc-500 mt-8">备注：院方提供的转院记录有首席研究员钟长明的签字担保。</p>
            </div>

            {/* Hand-written note */}
            <div className="absolute bottom-12 right-12 transform rotate-[-10deg]">
              <span className="font-mono text-red-600 text-lg font-bold">爸根本没签过字！！！</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
