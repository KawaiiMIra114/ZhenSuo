import React, { useRef } from 'react';
import { useGame } from '../GameContext';

type SectionId = 'about' | 'portfolio' | 'research' | 'contact';

export function Meridian() {
  const { erasureActive } = useGame();

  const aboutRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const researchRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollTo = (id: SectionId) => {
    const map: Record<SectionId, React.RefObject<HTMLElement>> = {
      about: aboutRef,
      portfolio: portfolioRef,
      research: researchRef,
      contact: contactRef,
    };
    map[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-full bg-[#f8f7f4] text-[#1a1a2e]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-8 py-4 flex items-center justify-between">
          <div className="tracking-[0.24em] text-sm font-light">MERIDIAN LIFE SCIENCES</div>
          <nav className="flex items-center gap-6 text-xs text-[#1a1a2e]/80">
            <button className="hover:text-[#1a1a2e]" onClick={() => scrollTo('about')}>关于我们</button>
            <button className="hover:text-[#1a1a2e]" onClick={() => scrollTo('portfolio')}>投资组合</button>
            <button className="hover:text-[#1a1a2e]" onClick={() => scrollTo('research')}>研究方向</button>
            <button className="hover:text-[#1a1a2e]" onClick={() => scrollTo('contact')}>联系我们</button>
          </nav>
        </div>
      </header>

      <section className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-6xl px-8 py-20 relative">
          <h1 className="text-5xl leading-[1.05] font-serif font-light">
            重新定义
            <br />
            人类意识的边界
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-7 text-white/70">
            Meridian Life Sciences 致力于神经科学与意识研究领域的前沿投资，
            推动人类对自身认知极限的突破。
          </p>
          <p className="absolute bottom-6 right-8 font-mono text-[10px] text-white/20 tracking-[0.18em]">
            Est. 2009 · Assets Under Management: $4.2B
          </p>
        </div>
      </section>

      <section ref={aboutRef} className="mx-auto max-w-6xl px-8 py-16 grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-serif leading-tight">我们相信意识是可以被理解的</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#1a1a2e]/80">
          <p>
            自2009年成立以来，Meridian Life Sciences已在全球布局17个神经科学
            与意识研究项目，覆盖亚洲、欧洲与北美地区。
          </p>
          <p>
            我们的投资哲学建立在一个核心信念之上：人类意识不是神秘现象，
            而是可以被测量、被引导、被优化的生物信息系统。
          </p>
          <p>
            我们寻找那些愿意突破传统医学范式的合作伙伴，
            与他们共同探索意识与神经系统的深层规律。
          </p>
          <div className="grid grid-cols-3 gap-8 pt-5 border-t border-black/10">
            <div>
              <p className="font-mono text-2xl">17</p>
              <p className="text-xs text-[#1a1a2e]/55 mt-1">全球项目</p>
            </div>
            <div>
              <p className="font-mono text-2xl">$4.2B</p>
              <p className="text-xs text-[#1a1a2e]/55 mt-1">管理资产</p>
            </div>
            <div>
              <p className="font-mono text-2xl">2009</p>
              <p className="text-xs text-[#1a1a2e]/55 mt-1">成立年份</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={portfolioRef} className="mx-auto max-w-6xl px-8 py-16">
        <h2 className="text-3xl font-serif">当前投资组合</h2>
        <p className="mt-2 text-xs text-[#1a1a2e]/40">以下为部分公开项目，完整组合受保密协议约束。</p>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <article className="rounded-xl border border-black/10 bg-white p-6">
            <h3 className="font-serif text-xl">安宁深眠诊所</h3>
            <p className="mt-1 text-xs text-[#1a1a2e]/60">南京，中国</p>
            <span
              className={`inline-flex mt-4 px-3 py-1 text-xs font-mono tracking-wide rounded ${erasureActive ? 'bg-red-100 text-red-700 font-bold' : 'bg-[#c9a84c]/20 text-[#8a6a1f]'}`}
            >
              {erasureActive ? 'Phase III · TERMINATED' : 'Phase III · Active'}
            </span>
            {erasureActive && (
              <div className="mt-2 space-y-1 font-mono text-[10px] text-[#1a1a2e]/60">
                <p>终止原因：运营异常，资产已处置</p>
                <p>后续安排：节点已并入 Phase IV</p>
              </div>
            )}
            <p className="mt-4 text-sm leading-7 text-[#1a1a2e]/80">
              深度神经共振疗法（DNR）的临床应用研究基地。
              专注于顽固性睡眠障碍的神经调节干预，
              探索意识在深度休眠状态下的可塑性边界。
            </p>
            <p className="mt-4 text-xs font-mono text-[#1a1a2e]/70">节点编号：NODE-NJ-003</p>
          </article>

          <article className="rounded-xl border border-black/10 bg-white p-6">
            <h3 className="font-serif text-xl">静默花园康复中心</h3>
            <p className="mt-1 text-xs text-[#1a1a2e]/60">成都，中国</p>
            <span className="inline-flex mt-4 px-3 py-1 text-xs font-mono tracking-wide rounded bg-[#c9a84c]/20 text-[#8a6a1f]">
              Phase II · Active
            </span>
            <p className="mt-4 text-sm leading-7 text-[#1a1a2e]/80">
              以“感官隔离疗法”为核心的神经调节研究项目。
              通过精确控制外部信息输入，
              研究意识在极低刺激环境下的自组织能力。
            </p>
            <p className="mt-4 text-xs font-mono text-[#1a1a2e]/70">节点编号：NODE-CD-007</p>
          </article>

          <article className="rounded-xl border border-black/10 bg-white p-6">
            <h3 className="font-serif text-xl">晨曦神经调节研究所</h3>
            <p className="mt-1 text-xs text-[#1a1a2e]/60">哈尔滨，中国</p>
            <span className="inline-flex mt-4 px-3 py-1 text-xs font-mono tracking-wide rounded bg-[#c9a84c]/20 text-[#8a6a1f]">
              Phase III · Active
            </span>
            <p className="mt-4 text-sm leading-7 text-[#1a1a2e]/80">
              大规模意识并行处理架构的工程化验证项目。
              研究规模为同类项目的3.2倍，
              重点探索分布式意识节点的协同与整合机制。
            </p>
            <p className="mt-4 text-xs font-mono text-[#1a1a2e]/70">节点编号：NODE-HRB-012</p>
          </article>

          <article className="rounded-xl border border-black/10 bg-[#e8e6e0] p-6">
            <h3 className="font-serif text-xl">[REDACTED]</h3>
            <p className="mt-1 text-xs text-[#1a1a2e]/60">位置保密</p>
            <span className="inline-flex mt-4 px-3 py-1 text-xs font-mono tracking-wide rounded bg-[#c9a84c]/20 text-[#8a6a1f]">
              Phase IV · Active
            </span>
            <div className="mt-4 space-y-2 cursor-default">
              <p className="text-sm leading-7 bg-[#1a1a2e] text-[#1a1a2e]">
                [此项目信息受最高级别保密协议约束]
              </p>
              <p className="text-sm leading-7 bg-[#1a1a2e] text-[#1a1a2e]">
                [如需了解详情，请通过授权渠道联系项目负责人]
              </p>
            </div>
            <p className="mt-4 text-xs font-mono text-[#1a1a2e]/70">节点编号：NODE-DELTA-001</p>
          </article>
        </div>
      </section>

      <section ref={researchRef} className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl">神经可塑性研究</h3>
            <div className="h-px bg-black/20 my-3" />
            <p className="text-sm leading-7 text-[#1a1a2e]/80">
              探索神经系统在外部干预下的长期适应性，
              重点关注深度睡眠状态下的突触重塑机制。
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl">意识量化方法论</h3>
            <div className="h-px bg-black/20 my-3" />
            <p className="text-sm leading-7 text-[#1a1a2e]/80">
              建立意识状态的可测量指标体系，
              为临床干预提供精确的评估工具与标准化方案。
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl">分布式意识架构</h3>
            <div className="h-px bg-black/20 my-3" />
            <p className="text-sm leading-7 text-[#1a1a2e]/80">
              研究多个意识节点在共享基底上的协同运作模式，
              探索意识集合体的涌现特性。
            </p>
          </div>
        </div>
      </section>

      <section ref={contactRef} className="mx-auto max-w-6xl px-8 py-16">
        <p className="font-mono text-sm">investor@meridian-ls.com</p>
        <p className="font-mono text-sm mt-2">press@meridian-ls.com</p>
        <p className="text-[10px] text-[#1a1a2e]/30 mt-5">所有来信均会被记录存档。</p>
      </section>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-8 py-6 flex items-end justify-between text-xs text-[#1a1a2e]/70">
          <div>
            <p>© 2009–2024 Meridian Life Sciences. All rights reserved.</p>
            <p className="mt-1">注册地：开曼群岛 · 亚太区运营中心：香港</p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#1a1a2e]/15">We remember everyone.</p>
        </div>
      </footer>
    </div>
  );
}
