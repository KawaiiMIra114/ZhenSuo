import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '@/store/GameStore';
import {
    Heart, Star, Shield, Search, FileText,
    ChevronRight, ExternalLink, Eye, Clock,
    Users, Award, MessageCircle, ArrowRight,
} from 'lucide-react';

// ═══════════════════════════════════════════
//  Clinic · V4 官网 — 安宁深眠诊所
//  首页 / 关于我们 / DNR疗法 / 患者评价 /
//  档案查询 / FAQ / 林医生专栏
//  + 源代码查看(RUNE_02) + LOGO凝视(RUNE_06)
// ═══════════════════════════════════════════

type ClinicTab = 'home' | 'about' | 'dnr' | 'reviews' | 'archive' | 'faq' | 'column';

export function Clinic() {
    const [tab, setTab] = useState<ClinicTab>('home');
    const { addFact, hasFact, collectRune, hasRune } = useGame();

    // LOGO 凝视计时器 (RUNE_06 路径之一)
    const logoRef = useRef<HTMLDivElement>(null);
    const logoTimer = useRef<ReturnType<typeof setTimeout>>();
    const [logoGlowing, setLogoGlowing] = useState(false);

    const handleLogoMouseDown = () => {
        logoTimer.current = setTimeout(() => {
            setLogoGlowing(true);
            addFact('logo_stare_3s');
            if (!hasRune('RUNE_06')) collectRune('RUNE_06');
            setTimeout(() => setLogoGlowing(false), 2000);
        }, 3000);
    };

    const handleLogoMouseUp = () => {
        if (logoTimer.current) clearTimeout(logoTimer.current);
    };

    const tabs: { id: ClinicTab; label: string }[] = [
        { id: 'home', label: '首页' },
        { id: 'about', label: '关于我们' },
        { id: 'dnr', label: 'DNR疗法' },
        { id: 'reviews', label: '患者评价' },
        { id: 'archive', label: '档案查询' },
        { id: 'column', label: '林医生专栏' },
        { id: 'faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-full bg-white text-gray-800">
            {/* ── 顶部导航 ── */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* LOGO — 凝视 3 秒触发 RUNE_06 */}
                        <div
                            ref={logoRef}
                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-default select-none transition-all duration-500
                ${logoGlowing
                                    ? 'bg-amber-400 shadow-[0_0_20px_rgba(255,180,0,0.6)]'
                                    : 'bg-gradient-to-br from-teal-500 to-cyan-600'}`}
                            onMouseDown={handleLogoMouseDown}
                            onMouseUp={handleLogoMouseUp}
                            onMouseLeave={handleLogoMouseUp}
                        >
                            <span className="text-white text-xs font-bold">安</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 tracking-wide">安宁深眠诊所</span>
                    </div>
                    <nav className="flex gap-1">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${tab === t.id
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => {
                                    setTab(t.id);
                                    if (t.id === 'home') addFact('visited_clinic_home');
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* ── 页面内容 ── */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {tab === 'home' && <HomePage />}
                {tab === 'about' && <AboutPage />}
                {tab === 'dnr' && <DNRPage />}
                {tab === 'reviews' && <ReviewsPage />}
                {tab === 'archive' && <ArchivePage />}
                {tab === 'column' && <ColumnPage />}
                {tab === 'faq' && <FAQPage />}
            </main>

            {/* ── 页脚 ── */}
            <footer className="bg-gray-50 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                <p>© 2024 安宁深眠诊所 · 南郊市海棠路 127 号</p>
                <p className="mt-1">ICP备案号：苏ICP备2024XXXXXX号-1</p>
                {/* 查看源代码入口 — RUNE_02 */}
                <button
                    className="mt-2 text-gray-300 hover:text-gray-500 transition-colors text-[10px]"
                    onClick={() => {
                        addFact('viewed_source_code');
                        addFact('found_zq_comment');
                        if (!hasRune('RUNE_02')) collectRune('RUNE_02');
                        alert(
                            '<!-- [页面源码] -->\n\n' +
                            '<!--\n' +
                            '  赵启 2024-02-28 注释:\n' +
                            '  如果你看到这段话，说明你已经开始怀疑了。\n' +
                            '  这不是诊所。这是一座屠宰场。\n' +
                            '  他们用DNR的名义，提取人的意识——\n' +
                            '  然后喂给B2层那个东西。\n' +
                            '  它叫太岁。\n' +
                            '  我已经把证据藏在了论坛的影子档案里。\n' +
                            '  密钥是福生无量天尊的首字母。\n' +
                            '  如果我消失了……请帮帮他们。\n' +
                            '-->'
                        );
                    }}
                >
                    [查看页面源代码]
                </button>
            </footer>
        </div>
    );
}

// ═══════════════════════════════════════════
//  官网子页面
// ═══════════════════════════════════════════

function HomePage() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero */}
            <section className="text-center py-16 bg-gradient-to-b from-teal-50/50 to-white rounded-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    让深层睡眠修复一切
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                    安宁深眠诊所采用国际领先的 DNR 深度神经重置疗法，
                    帮助患者从失眠、焦虑、PTSD 等症状中获得真正的解脱。
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium">
                        <Heart className="w-4 h-4" /> 98.7% 满意度
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                        <Shield className="w-4 h-4" /> 国家认证机构
                    </span>
                </div>
            </section>

            {/* 服务简介 */}
            <section className="grid grid-cols-3 gap-6">
                {[
                    { icon: <Star className="w-5 h-5 text-amber-500" />, title: '个性化方案', desc: '根据每位患者的神经特征，定制专属疗程。' },
                    { icon: <Shield className="w-5 h-5 text-teal-500" />, title: '安全无创', desc: '全程无侵入性操作，零副作用记录。' },
                    { icon: <Users className="w-5 h-5 text-blue-500" />, title: '专家团队', desc: '由MIT归国学者钟长明博士领衔。' },
                ].map(item => (
                    <div key={item.title} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-gray-700 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

function AboutPage() {
    const { addFact } = useGame();
    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800">关于安宁深眠诊所</h2>

            <section className="space-y-4">
                <h3 className="font-semibold text-gray-700">创始团队</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="font-medium text-gray-700">钟长明 博士</div>
                        <div className="text-xs text-gray-500 mt-1">创始人 · MIT 神经科学博士</div>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            师从 Dr. Marcus Holloway，专攻意识—量子界面理论。
                            2019年回国创办安宁深眠诊所，将前沿神经科学带入临床实践。
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="font-medium text-gray-700">林雨桐 主任</div>
                        <div className="text-xs text-gray-500 mt-1">首席治疗师</div>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            心理学与中医双学位。十五年临床经验，
                            擅长将传统疗法与现代技术结合。
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="font-semibold text-gray-700">投资与合作</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        诊所获得 <button className="text-teal-600 underline" onClick={() => addFact('found_investor_meridian')}>Meridian Capital</button> 的A轮投资，
                        与多所高校建立科研合作关系。
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                        * Meridian Capital 注册地：开曼群岛。实际控制人信息未公开。
                    </p>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="font-semibold text-gray-700">学术发表</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <ul className="text-sm text-gray-500 space-y-2">
                        <li>• Zhong C.M. et al., "DNR Protocol for Chronic Insomnia" — <i>Nature Sleep</i>, 2023</li>
                        <li onClick={() => addFact('found_retracted_paper')} className="cursor-pointer hover:text-red-500 transition-colors">
                            • Zhong C.M., "Pneuma Particle Resonance in Biological Systems"
                            — <i>Physical Review Letters</i>, 2020 <span className="text-red-400 text-[10px]">[RETRACTED]</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

function DNRPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800">DNR 深度神经重置疗法</h2>
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                    <strong>DNR（Deep Neural Reset）</strong>是安宁深眠诊所自主研发的核心技术，
                    通过精密的神经信号引导，帮助患者进入超深度睡眠态，
                    让大脑在自然状态下完成自我修复。
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">治疗流程</h3>
                <div className="space-y-3">
                    {[
                        { step: '1', title: '初诊评估', desc: '全面神经系统检测，建立个人档案。' },
                        { step: '2', title: '方案定制', desc: '根据评估结果，制定个性化疗程。' },
                        { step: '3', title: '治疗实施', desc: '在专业设备辅助下，引导进入深度睡眠修复态。' },
                        { step: '4', title: '康复跟踪', desc: '持续监测恢复进度，动态调整方案。' },
                    ].map(item => (
                        <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <div className="font-medium text-gray-700 text-sm">{item.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-700">
                <strong>注意：</strong>DNR 疗法目前仅在本诊所提供。
                治疗期间患者处于深度睡眠态，无法自行中断。
                <span className="text-amber-500/70"> 这是为了确保治疗效果的完整性。</span>
            </div>
        </div>
    );
}

function ReviewsPage() {
    const { addFact, collectRune, hasRune } = useGame();

    const reviews = [
        { name: '王女士', rating: 5, text: '失眠五年了，在这里终于睡了个好觉。感谢林主任！', date: '2024-01-20' },
        { name: '陈先生', rating: 5, text: '之前在省医院看了半年没效果，来这里两周就明显改善了。强烈推荐！', date: '2024-01-18' },
        { name: '张小姐', rating: 5, text: '环境很好，医护人员也很贴心。终于不用再吃安眠药了。', date: '2024-01-12' },
        { name: '刘先生', rating: 4, text: '效果不错，就是价格有点贵。不过健康无价嘛。', date: '2024-01-08' },
        { name: '赵女士', rating: 5, text: '焦虑症困扰了三年，两个疗程下来感觉世界都不一样了。', date: '2024-01-05' },
        { name: '李先生', rating: 5, text: '推荐给有相同困扰的朋友。', date: '2023-12-28' },
        { name: '吴女士', rating: 5, text: '护士小姐姐人很好，照顾得很细心。', date: '2023-12-20' },
        { name: '周先生', rating: 5, text: '值得信赖。', date: '2023-12-15' },
        { name: '孙女士', rating: 4, text: '整体不错。', date: '2023-12-10' },
        { name: '杨先生', rating: 5, text: '专业！', date: '2023-12-05' },
        { name: '马女士', rating: 5, text: '非常满意。', date: '2023-11-28' },
        { name: '黄先生', rating: 5, text: '好评。', date: '2023-11-20' },
        { name: '何女士', rating: 5, text: '推荐。', date: '2023-11-15' },
        { name: '林先生', rating: 5, text: '不错的体验。', date: '2023-11-10' },
        { name: '郭女士', rating: 4, text: '还行吧。', date: '2023-11-05' },
        { name: '高先生', rating: 5, text: '满意。', date: '2023-11-01' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">患者评价</h2>
                <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <span className="text-sm text-gray-500 ml-2">4.9/5.0（{reviews.length + 1}条评价）</span>
                </div>
            </div>

            <div className="space-y-3">
                {reviews.map((r, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{r.name}</span>
                            <span className="text-[10px] text-gray-400">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-1">
                            {Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-500">{r.text}</p>
                    </div>
                ))}

                {/* 第 17 条 —— 孤悬回复（RUNE_01） */}
                <div
                    className="p-4 bg-gray-50 rounded-lg border border-red-200/50 cursor-pointer hover:bg-red-50/30 transition-colors"
                    onClick={() => {
                        addFact('found_review_17');
                        if (!hasRune('RUNE_01')) collectRune('RUNE_01');
                    }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">匿名用户</span>
                        <span className="text-[10px] text-gray-400">2024-02-14</span>
                    </div>
                    <p className="text-sm text-gray-400 italic">
                        "你们还要骗多少人？我丈夫进去三个月了，一个电话都不让打。
                        <br />
                        说什么深度睡眠不能中断？那为什么每次去探视，都说他情况在好转？
                        <br />
                        好转到连人都见不着了？？？"
                    </p>
                    <p className="text-[10px] text-red-400/60 mt-2">
                        {hasRune('RUNE_01')
                            ? '☰ 碎片已记录 · PHX-ALPHA 协议'
                            : '这条评价没有其他人回复。'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ArchivePage() {
    const { addFact, hasFact, setView } = useGame();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const handleSearch = () => {
        const q = query.trim().toUpperCase();

        if (q === 'LX-044-YIN' || q === 'LX044YIN') {
            addFact('archive_query_lx044');
            setResult(
                '查询结果：\n\n' +
                '档案编号：LX-044-YIN\n' +
                '患者姓名：林 ■\n' +
                '入院日期：2024-01-15\n' +
                '主治医师：林雨桐\n' +
                '疗程状态：进行中\n' +
                '当前阶段：第三阶段 · 深度整合期\n\n' +
                '备注：患者反应良好，建议延长疗程。\n\n' +
                '—— 系统自动生成，如有疑问请联系诊所前台 ——'
            );
        } else if (q === 'TAIYIJIUKU' || q === 'TAIYI JIUKU') {
            addFact('archive_query_taiyijiuku');
            addFact('password_complete');
            addFact('ending_reached');
            setResult(
                '█ 权限验证通过 █\n\n' +
                '正在连接 B2 核心节点……\n\n' +
                '检测到覆写指令：OVERRIDE\n' +
                '当前太岁活性：19,847 节点\n\n' +
                '请选择执行模式：\n\n' +
                '[A] FORMAT — 烈火洗城\n' +
                '[B] ASCEND — 上行替代\n' +
                '[C] JIUKOU — 七星破阵（需七碎片）'
            );
            setTimeout(() => setView('ending'), 3000);
        } else if (q.includes('赵启') || q.includes('ZHAO') || q.includes('ZQ')) {
            setResult(
                '查询失败\n\n' +
                '错误代码：ACCESS_DENIED\n' +
                '原因：该员工档案已被标记为 [已注销]\n\n' +
                '如有疑问，请联系系统管理员。'
            );
        } else if (q.length > 0) {
            setResult(
                '查询结果：\n\n' +
                '未找到匹配的档案记录。\n\n' +
                '请确认档案编号格式正确（如：XX-000-XXX）'
            );
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800">档案查询</h2>
            <p className="text-sm text-gray-500">输入患者档案编号或关键词，查询治疗进展。</p>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
                    placeholder="输入档案编号（如：LX-044-YIN）"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                    onClick={handleSearch}
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>

            {result && (
                <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {result}
                </pre>
            )}
        </div>
    );
}

function ColumnPage() {
    const { addFact, collectRune, hasRune } = useGame();
    const [selected, setSelected] = useState<number | null>(null);

    // 林医生四篇专栏文章 — 标题首字：太/乙/救/苦
    const columns = [
        {
            title: '太古之梦：论深度睡眠的边界',
            date: '2024-01-20',
            summary: '从古代冥想到现代神经科学，深度睡眠一直是人类追寻的终极状态。',
            content: `作为一名从业十五年的治疗师，我见过太多被失眠折磨的患者。他们眼中那种疲惫不仅是身体上的，更是灵魂深处的倦怠。

DNR 疗法的出现，为我们打开了一扇新的大门。它不同于传统的药物治疗或认知行为疗法——它直接作用于意识的最深层。

在多年的临床实践中，我观察到一个有趣的现象：进入 DNR 深度修复态的患者，他们的脑电波呈现出一种前所未有的模式。这种模式与古代冥想大师在深度禅定时的脑电波有着惊人的相似性。

也许，古人所追寻的"入定"，与我们今天的 DNR 疗法，殊途同归。

——林雨桐，于安宁深眠诊所`,
            fact: 'read_column_d1' as const,
        },
        {
            title: '乙太共振：钟博士理论的临床验证',
            date: '2024-01-25',
            summary: '钟长明博士提出的"气粒子共振"假说在临床中得到了初步验证。',
            content: `钟长明博士的"灵穴操作系统"理论曾在学术界引起不小的争议。然而，作为这套理论的第一个临床实践者，我必须说——它被严重低估了。

在 DNR 疗法的第三阶段，我们能够清晰地观察到"共振哈希"现象：当患者的意识进入特定的相位时，B2 层设备上会出现规律性的能量波动。

这些波动不是噪音，不是仪器误差——它们是有结构的。每一次波动，都对应着患者意识中一段特定的神经网络激活模式。

我曾在一次深夜值班时，独自目睹了一次完整的"共振同步"过程。那个瞬间，患者的脑电波与 B2 层设备的频率完美叠合。

监控屏幕上的数据疯狂跳动，但患者的表情——

很平静。太平静了。像是已经不在这里了。

我没有把这段写进报告。`,
            fact: 'read_column_d2' as const,
        },
        {
            title: '救赎之路：一个"痊愈"患者的故事',
            date: '2024-02-01',
            summary: '记录一位特殊患者从入院到"康复"的完整历程。',
            content: `编号：MED-0019
姓名：张 ■■
入院时诊断：重度焦虑伴睡眠障碍

这位患者是我接手的第一批 DNR 疗程患者之一。入院时，她已经连续三个月无法正常入睡，体重骤降 15 公斤。

治疗进展：
- 第一周：初步适应 DNR 设备，患者报告睡眠质量明显改善
- 第二周：进入第二阶段，深度睡眠时间延长至 8 小时
- 第三周：进入第三阶段，意识整合期
- 第四周：……

她在第四周的一个清晨"醒来"了。

我把"醒来"打了引号。因为虽然她的眼睛睁开了，身体的各项体征也恢复了正常，但她的笑容——

怎么说呢。就像复印件。

出院回访时她说一切都好，睡得很香，再也不焦虑了。可她的丈夫事后悄悄给我打了电话，说她"不太像以前的她了"。

我安慰他说这是正常的适应期反应。

我不知道我在说什么。

——林雨桐`,
            fact: 'read_column_d3' as const,
        },
        {
            title: '苦行者的独白：当治疗师开始怀疑',
            date: '2024-02-10',
            summary: '一篇不应该出现在诊所官网上的文章。',
            content: `我开始听到声音了。

是从 B2 层传上来的。一种低频的嗡鸣声，像是千百个人在同时念诵经文。钟长明说那是设备的正常运行噪音。

可为什么只有我能听到？为什么它在凌晨三点最清晰？

上周，赵启——我们的 IT 维护工程师——跑来找我。他满脸是汗，说他在 B2 层的监控录像里看到了什么。我劝他冷静，让他把话说完。

他说："林主任，那个东西……它在长大。"

我知道他说的是什么。因为我也看到了。

可我告诉他别多想，好好工作。然后我回到办公室，把门锁上，对着镜子看了很久。

镜子里的我也在笑。和 MED-0019 一样的笑。

我不知道这篇文章能在官网上停留多久。钟长明不审核我的专栏——至少目前是这样。如果你在看这篇文章，请记住：

太/乙/救/苦

这四个字。也许有一天你会用到。

——林雨桐，2024年2月10日凌晨 3:17`,
            fact: 'read_column_d4' as const,
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800">林医生专栏</h2>
            <p className="text-sm text-gray-500">林雨桐主任的临床手记与学术随笔</p>

            {selected === null ? (
                <div className="space-y-3">
                    {columns.map((col, i) => (
                        <div
                            key={i}
                            className="p-5 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                            onClick={() => {
                                setSelected(i);
                                addFact(col.fact);
                                // RUNE_04 在第二篇文章
                                if (i === 1 && !hasRune('RUNE_04')) collectRune('RUNE_04');
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                                    {col.title}
                                </h3>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{col.summary}</p>
                            <div className="text-[10px] text-gray-400 mt-2">{col.date}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button
                        className="flex items-center gap-1 text-sm text-teal-600 mb-4 hover:underline"
                        onClick={() => setSelected(null)}
                    >
                        ← 返回列表
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{columns[selected].title}</h3>
                    <div className="text-xs text-gray-400 mb-4">{columns[selected].date}</div>
                    <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600 leading-relaxed">
                            {columns[selected].content}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function FAQPage() {
    const { addFact } = useGame();

    const faqs = [
        { q: 'DNR 治疗是否安全？', a: '完全安全。DNR 疗法已通过国家二类医疗器械认证，零不良反应记录。' },
        { q: '治疗期间我可以探视家属吗？', a: '为确保治疗环境的稳定性，深度修复期间暂不安排探视。您可以通过本网站查询治疗进展。' },
        { q: '治疗费用如何？', a: '单疗程费用为 39,800 元，含全部检查和治疗费用。支持医保部分报销。' },
        { q: '治疗周期需要多长？', a: '标准疗程为 6-8 周。具体时间因人而异，由主治医师评估后确定。' },
        { q: '治疗结束后会有什么变化？', a: '大多数患者报告睡眠质量显著改善、焦虑减轻、精神状态焕然一新。是全新的自我。' },
        { q: '如何联系诊所？', a: '拨打我们的24小时热线：025-8888-0127。或访问我们的社区论坛获取更多信息。' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800">常见问题</h2>

            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <details key={i} className="group bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors list-none flex items-center justify-between">
                            {faq.q}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="px-5 py-3 text-sm text-gray-500 border-t border-gray-100">
                            {faq.a}
                            {/* FAQ 最后一条包含论坛链接 */}
                            {i === faqs.length - 1 && (
                                <span>
                                    {' '}
                                    <button
                                        className="text-teal-600 underline text-xs"
                                        onClick={() => {
                                            addFact('found_faq_forum_link');
                                            window.dispatchEvent(new CustomEvent('browser-navigate', { detail: 'forum' }));
                                        }}
                                    >
                                        → 前往社区论坛
                                    </button>
                                </span>
                            )}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
