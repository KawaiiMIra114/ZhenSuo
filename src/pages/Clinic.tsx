import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { Search, ChevronRight, Phone, MapPin, Clock, Award, FileText, Users, Star, Mail, ExternalLink, AlertTriangle } from 'lucide-react';

// ═══════════════════════════════════════════
//  Clinic · V4 §4 · 安宁深眠诊所官网
//  首页 | 关于我们 | 专家团队 | DNR疗法 | 患者评价
//  新闻 | 投资者 | 联系我们 | 档案查询 | 专栏 | FAQ
// ═══════════════════════════════════════════

type Tab = 'home' | 'about' | 'team' | 'treatment' | 'reviews' | 'news' | 'investor' | 'contact' | 'archive' | 'articles' | 'faq';
type TeamMember = 'list' | 'zhong' | 'lin';
type ArticleId = 'd1' | 'd2' | 'd3' | 'd4' | null;

export function Clinic() {
  const { readHook, hasReadHook, collectRune, hasRune, linXiaoSignalStrength, addFact, hasFact, setCurrentApp } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [teamView, setTeamView] = useState<TeamMember>('list');
  const [selectedArticle, setSelectedArticle] = useState<ArticleId>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // 档案查询
  const [archiveQuery, setArchiveQuery] = useState('');
  const [archiveResult, setArchiveResult] = useState<React.ReactNode | null>(null);

  // 联系我们留言
  const [contactName, setContactName] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Logo长凝视 V4: 3秒触发RUNE_06
  const [logoHoverTime, setLogoHoverTime] = useState(0);
  const logoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [logoWarning, setLogoWarning] = useState(false);

  const handleLogoEnter = () => {
    if (hasRune('RUNE_06')) return;
    logoTimerRef.current = setInterval(() => {
      setLogoHoverTime(prev => {
        if (prev >= 3) {
          collectRune('RUNE_06');
          setLogoWarning(true);
          if (logoTimerRef.current) clearInterval(logoTimerRef.current);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };
  const handleLogoLeave = () => {
    if (logoTimerRef.current) clearInterval(logoTimerRef.current);
    setLogoHoverTime(0);
  };

  // V4 §4.7 档案查询完整响应逻辑
  const handleArchiveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = archiveQuery.trim();
    const qu = q.toUpperCase();

    if (!q) { setArchiveResult(null); return; }

    if (q === '林晓') {
      setArchiveResult(<div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm text-yellow-800">
        查询到1条记录，档案迁移处理中，暂时无法访问。如有疑问请联系服务热线。
      </div>);
      readHook('archive_linxiao');
    } else if (qu === 'LX-044') {
      setArchiveResult(<div className="bg-red-50 border border-red-300 rounded p-4 text-sm text-red-700">
        档案编号格式错误。正确格式：XX-000-YYY（例：AB-123-CDE）
      </div>);
    } else if (qu === 'LX-044-YIN') {
      readHook('archive_lx044');
      setArchiveResult(<div className="bg-gray-100 border border-gray-300 rounded p-4 text-sm text-gray-700">
        <p className="text-red-500 font-mono text-xs mb-2">ERROR 500 — Internal Server Error</p>
        <p className="text-gray-500 text-xs">The requested resource could not be loaded.</p>
        <p className="text-[9px] text-gray-300 mt-4 font-mono">{'// debug: anchor_node disconnected — signal overflow detected at render layer'}</p>
      </div>);
    } else if (['枣木', '朱砂', '黑山羊'].includes(q)) {
      setArchiveResult(<div className="bg-orange-50 border border-orange-300 rounded p-4 text-sm text-orange-700">
        关键词类型不匹配，请输入患者姓名或档案编号。
      </div>);
    } else if (qu === 'PHX-ALPHA') {
      setArchiveResult(<div className="bg-red-100 border border-red-400 rounded p-4 text-sm text-red-800 font-mono">
        权限不足。此查询已被记录。
      </div>);
    } else if (qu === 'TAIYIJIUKU') {
      if (hasFact('password_half_juku_found') && hasFact('linyuudon_message_found')) {
        readHook('ending_trigger');
        addFact('ending_unlocked');
        setArchiveResult(<div className="bg-black rounded p-6 text-green-400 font-mono text-sm">
          <p>&gt; 系统检测到异常指令序列</p>
          <p>&gt; 正在验证权限……</p>
          <p className="mt-2 text-green-300">&gt; 权限验证通过。正在加载终局界面……</p>
        </div>);
        setTimeout(() => setCurrentApp('ending'), 2000);
      } else {
        setArchiveResult(<div className="bg-red-50 border border-red-300 rounded p-4 text-sm text-red-700">
          档案编号格式错误，请确认输入信息。
        </div>);
      }
    } else if (qu === 'MERIDIAN') {
      setArchiveResult(<div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
        此查询类型不在患者档案范围内。
      </div>);
    } else if (q === '8023') {
      setArchiveResult(<div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
        未找到相关档案，请确认输入信息后重试。
        {/* <!-- employee query detected: MNT-8023 — this system is not for employee lookup --> */}
      </div>);
    } else if (q === 'fswltz') {
      setArchiveResult(<div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
        无效输入。
      </div>);
    } else if (qu === 'GH_0314_LX') {
      // GDD §4.2: 标题栏短暂显示"林晓"然后恢复
      const origTitle = document.title;
      document.title = '林晓';
      setTimeout(() => { document.title = origTitle; }, 1500);
      setArchiveResult(<div className="bg-white border border-gray-300 rounded p-4 text-sm text-gray-600">
        <p className="font-mono text-gray-400">[账号已注销，相关档案已移除]</p>
      </div>);
    } else if (q === 'nj0313') {
      // GDD §4.2: 管理员会话检测
      if (hasFact('admin_unlocked')) {
        setArchiveResult(<div className="bg-green-50 border border-green-300 rounded p-4 text-sm text-green-700 font-mono">
          您已登录管理员会话，无需通过此入口。
        </div>);
      } else {
        setArchiveResult(<div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
          无效输入。
        </div>);
      }
    } else {
      setArchiveResult(<div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
        未找到相关档案，请确认输入信息后重试。
      </div>);
    }
  };

  // 导航切换
  const nav = (tab: Tab) => {
    setActiveTab(tab);
    setTeamView('list');
    setSelectedArticle(null);
    setSelectedNewsId(null);
    setArchiveResult(null);
    setContactSent(false);
  };

  // ── 患者评价数据 V4 §4.2 ──
  const reviews = Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    if (n === 17) return {
      id: 'gh_0314_lx', date: '2024-01-07', score: 5, isSpecial: true,
      text: '预约了两个月终于排到了。入院前很紧张，但医护人员都非常专业，环境也很好。希望更多有需要的人能找到这里。',
      badge: '[此用户已提交完整疗程]',
    };
    const names = ['user_2f8a3d', 'user_7c4b1e', 'user_9d2f3a', 'user_1b5e7c', 'user_4a8d2f', 'user_6e3c9b', 'user_8f1a4d', 'user_3d7b5e', 'user_5c2e8a', 'user_0b9f3d', 'user_2a6c4e', 'user_7d1b8f', 'user_4e9a2c', 'user_8c3d6b', 'user_1f5e7a', 'user_6b2a9d', 'user_3e8c1f', 'user_9a4d7b', 'user_5d1e6c', 'user_0c7f2a', 'user_4b3e8d', 'user_8a6c1f', 'user_2d9b5e'];
    const texts = [
      '失眠七年，终于能睡着了。感谢钟院长团队。', '治疗两个月，安眠药完全停了，生活质量明显提高。',
      '环境很好，医护人员专业且耐心。', '第一次完整睡了8小时，感动到哭。',
      'DNR疗法确实有效果，推荐给同样困扰的朋友们。', '林医生非常细心，每次都详细解答我的疑问。',
      '来之前半信半疑，现在每天准时入睡。', '治疗环境舒适，像住五星级酒店一样。',
      '朋友推荐来的，果然名不虚传。', '老伴儿在这里治好了十年的失眠，特意来评价。',
      '服务态度非常好，前台的小伙子也很热心。', '术后恢复期的失眠在这里得到了很好的解决。',
      '第二个疗程结束，每天能睡6-7小时了。', '价格确实不便宜，但效果是实实在在的。',
      '国内终于有这样专业的睡眠治疗机构了。', '感谢安宁诊所让我重新找回了安稳的夜晚。',
      /*17 is special*/ '出院后睡眠质量一直保持得很好。',
      '推荐！专业团队，先进技术，温馨环境。', '三个疗程下来，彻底告别了失眠。',
      '钟院长亲自诊断，非常权威。', '设备很先进，治疗过程也很舒适。',
      '虽然住院时间有点长，但效果值得。', '希望更多人知道这个诊所。',
    ];
    const dates = ['2023-03-15', '2023-04-22', '2023-05-10', '2023-06-03', '2023-06-28', '2023-07-14', '2023-08-01', '2023-08-19', '2023-09-05', '2023-09-22', '2023-10-08', '2023-10-25', '2023-11-11', '2023-11-28', '2023-12-05', '2023-12-18', '2024-01-07', '2024-01-15', '2024-01-22', '2024-02-01', '2024-02-08', '2024-02-15', '2024-02-22'];
    const idx = n <= 16 ? n - 1 : n - 2;
    return {
      id: names[idx] || `user_${n}`, date: dates[idx] || '2024-01-01', score: n % 5 === 0 ? 4 : 5,
      isSpecial: false, text: texts[idx] || '治疗效果很好，推荐。', badge: undefined,
    };
  });

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* V4 Logo 凝视警告弹窗 */}
      {logoWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-sm text-gray-700 font-bold mb-1">⚠ 检测到长时间视觉焦点</p>
            <p className="text-sm text-gray-500 mb-4">建议移开视线</p>
            {/* <!-- threshold modified from 8s to 3s. if you see this, you're close enough. —z --> */}
            <button className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" onClick={() => setLogoWarning(false)}>确认</button>
          </div>
        </div>
      )}

      {/* ── 顶部导航 ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InvestigateNode hookId="logo_hover" condition={!hasRune('RUNE_06')}>
              <div className="cursor-pointer select-none" onMouseEnter={handleLogoEnter} onMouseLeave={handleLogoLeave}>
                <img src={`${import.meta.env.BASE_URL}images/clinic_logo.png`} alt="LOGO" className="h-10 w-10 object-contain" />
              </div>
            </InvestigateNode>
            <div>
              <h1 className="text-lg font-bold text-[#2c5f7c]">安宁深眠诊所</h1>
              <p className="text-[10px] text-gray-400 font-mono">TRANQUIL SLEEP CLINIC</p>
            </div>
          </div>
          <nav className="flex gap-0.5 flex-wrap">
            {([
              ['home', '首页'], ['about', '关于我们'], ['team', '专家团队'],
              ['treatment', 'DNR疗法'], ['reviews', '患者评价'], ['news', '新闻'],
              ['articles', '专栏'], ['archive', '档案查询'], ['faq', '常见问题'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button key={key}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${activeTab === key ? 'bg-[#2c5f7c] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => nav(key)}>{label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ════════ 首页 V4 §4.2 ════════ */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#2c5f7c] to-[#1a3a4a] rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">重建深层睡眠的神经秩序</h2>
              <p className="text-blue-100 text-sm mb-6">国际领先的 DNR 深度神经共振技术</p>
              <div className="flex gap-8 text-center">
                <div><p className="text-3xl font-bold">12,000+</p><p className="text-xs text-blue-200">服务患者数</p></div>
                <div><p className="text-3xl font-bold">93%</p><p className="text-xs text-blue-200">有效改善率</p></div>
                <div><p className="text-3xl font-bold">4.8/5</p><p className="text-xs text-blue-200">患者满意度</p></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-5 text-center cursor-pointer hover:shadow-md" onClick={() => nav('treatment')}>
                <FileText className="w-8 h-8 text-[#2c5f7c] mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800">DNR疗法</p><p className="text-xs text-gray-500">了解我们的核心技术</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5 text-center cursor-pointer hover:shadow-md" onClick={() => nav('team')}>
                <Users className="w-8 h-8 text-[#2c5f7c] mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800">专家团队</p><p className="text-xs text-gray-500">国际顶尖睡眠医学团队</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5 text-center cursor-pointer hover:shadow-md" onClick={() => nav('archive')}>
                <Search className="w-8 h-8 text-[#2c5f7c] mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800">档案查询</p><p className="text-xs text-gray-500">康复患者档案检索</p>
              </div>
            </div>
          </div>
        )}

        {/* ════════ 关于我们 V4 §4.2 ════════ */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm leading-relaxed text-gray-700">
            <h2 className="text-xl font-bold text-gray-800">关于安宁深眠诊所</h2>
            <p>安宁深眠诊所成立于2019年，坐落于南郊市，是一家集睡眠障碍诊断、治疗、科研于一体的专业医疗机构。</p>
            <p>2009年，钟院长凭借其在<strong>麻省理工学院</strong>的开创性睡眠神经科学研究，奠定了DNR疗法的理论基础。此后十年间，钟院长团队完成了从理论到临床的完整转化路径，使安宁深眠成为国内领先的睡眠障碍专科机构。</p>
            <p>诊所配备国际领先的 <strong>Morpheus-III 全景脑电拓扑仪</strong>及自主研发的 <strong>DNR（深度神经共振）</strong>技术平台，覆盖从诊断到康复的全流程。</p>
            <p>截至目前，诊所已累计服务患者超过 <strong>12,000</strong> 人次，综合改善率保持在 <strong>93%</strong> 以上。</p>
            <div className="flex gap-6 text-xs text-gray-500 mt-4">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 南郊市高新区安宁路188号</div>
              <div className="flex items-center gap-1"><Phone className="w-4 h-4" /> 400-XXX-XXXX</div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 周一至周六 8:00-17:00</div>
            </div>
          </div>
        )}

        {/* ════════ 专家团队 V4 §4.2 ════════ */}
        {activeTab === 'team' && teamView === 'list' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">专家团队</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setTeamView('zhong')}>
                <p className="font-bold text-lg text-gray-800">钟长明</p>
                <p className="text-sm text-gray-500">院长 · 创始人</p>
                <p className="text-xs text-gray-400 mt-2">MIT 神经科学博士 · DNR疗法创始人</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setTeamView('lin')}>
                <p className="font-bold text-lg text-gray-800">林德坤</p>
                <p className="text-sm text-gray-500">神经内科主任</p>
                <p className="text-xs text-gray-400 mt-2">钟院长的学术继承人 · 四篇专栏文章</p>
              </div>
            </div>
          </div>
        )}

        {/* 钟长明个人页 */}
        {activeTab === 'team' && teamView === 'zhong' && (
          <div>
            <button className="text-sm text-blue-600 mb-4 flex items-center gap-1" onClick={() => setTeamView('list')}>← 返回团队列表</button>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
              <h2 className="text-xl font-bold text-gray-800">钟长明 · 院长</h2>
              <p className="text-gray-500 text-xs">MIT 神经科学博士 | 安宁深眠诊所创始人 | DNR疗法首席科学家</p>
              <p className="italic text-gray-600 border-l-4 border-blue-300 pl-4 my-4">"我深知长期失眠患者的痛苦，因为我自己也曾是其中一员。那段经历让我明白：修复一个人的睡眠，就是修复一个人的生命本身。"</p>
              <button className="text-xs text-blue-600 underline" onClick={() => readHook('zhong_academic')}>查看学术成果 →</button>
              {hasReadHook('zhong_academic') && (
                <div className="bg-gray-50 rounded p-4 mt-2 space-y-2 text-xs font-mono">
                  <p className="font-bold text-gray-600">学术发表记录</p>
                  <p className="text-gray-500">钟长明 (2009) "海马体-丘脑突触可塑性与睡眠周期调控" — 引用 847 次</p>
                  <p className="text-gray-500">钟长明 (2008) "低频电磁波序列对神经元突触群的影响" — 引用 312 次</p>
                  <p className="text-gray-300">[已撤稿] 钟长明 (2006) 《灵子场：意识的非局域性量子信息基底》</p>
                  <p className="text-gray-300">撤稿原因：实验设计不符合可证伪性标准</p>
                  <p className="text-gray-300">原发表期刊：[投稿中，未发表]</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 林医生个人页 */}
        {activeTab === 'team' && teamView === 'lin' && (
          <div>
            <button className="text-sm text-blue-600 mb-4 flex items-center gap-1" onClick={() => setTeamView('list')}>← 返回团队列表</button>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
              <h2 className="text-xl font-bold text-gray-800">林德坤 · 神经内科主任</h2>
              <p className="text-gray-500 text-xs">本院神经内科主任，钟院长的学术继承人。</p>
              <p>林德坤主任在睡眠医学领域深耕十余年，擅长将前沿神经科学研究应用于临床实践。加入安宁深眠诊所后，在钟院长指导下深度参与DNR疗法的临床优化与推广工作。</p>
              <p className="text-xs text-blue-600 underline cursor-pointer" onClick={() => { nav('articles'); }}>查看专栏文章 →</p>
            </div>
          </div>
        )}

        {/* ════════ DNR疗法 V4 §4.2 ════════ */}
        {activeTab === 'treatment' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-800">DNR · 深度神经共振疗法</h2>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">什么是DNR</h3>
              <p>深度神经共振疗法（Deep Neural Resonance，DNR）是本院独家研发的第三代睡眠重建系统。通过精密的低频电磁波序列，作用于大脑海马体与丘脑之间的特定神经元突触群，在五分钟内为您的神经系统提供<strong>毫无杂念</strong>的深眠窗口。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">疗程说明</h3>
              <p>每次疗程约为45分钟，建议连续进行14天以获得最佳效果。治疗期间患者将在专用DNR舱内接受治疗，过程中可能出现轻微的<strong>感知模糊</strong>，属正常反应。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">DNR舱体</h3>
              <div className="bg-gray-100 rounded p-4">
                <p className="text-gray-600">白色流线型舱体，内置精密电磁环控系统。</p>
                <p className="text-xs text-gray-400 mt-2">舱体内壁采用专利<strong>隔振材料</strong>，确保治疗过程中的电磁环境稳定性。</p>
              </div>
            </div>
          </div>
        )}

        {/* ════════ 患者评价 V4 §4.2 (24条) ════════ */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">患者评价</h2>
            <p className="text-xs text-gray-500">共 24 条评价 · 按时间倒序</p>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className={`bg-white rounded-lg shadow p-4 ${r.isSpecial ? 'border-l-4 border-amber-400' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: r.score }, (_, j) => <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-sm text-gray-700">{r.text}</p>
                  {r.badge && <p className="text-xs text-gray-400 mt-1">{r.badge}</p>}
                  {/* 第17条下方的孤悬回复 V4→RUNE_01 */}
                  {r.isSpecial && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">[此回复来自已注销账号，内容已折叠]</p>
                      <InvestigateNode hookId="review_orphan_reply" runeId="RUNE_01"
                        feedbackText="祝你早日康复……这条孤悬的回复，是有人在她入院之后留给她的。挂在这里，没有人再看。">
                        <details className="cursor-pointer">
                          <summary className="text-xs text-blue-500">[展开]</summary>
                          <p className="text-xs text-gray-500 mt-1 italic">[账号已注销]：祝你早日康复。</p>
                        </details>
                      </InvestigateNode>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ 新闻动态 V4 §4.2 (6篇) ════════ */}
        {activeTab === 'news' && !selectedNewsId && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800"><FileText className="w-5 h-5 inline mr-1" />新闻动态</h2>
            {[
              { id: 'n1', date: '2023-11-15', title: '《睡眠医疗赛道的隐秘巨头：安宁深眠的资本路径》', tag: '深度报道' },
              { id: 'n2', date: '2023-06-08', title: '安宁深眠诊所获国际睡眠医学协会质量认证', tag: '荣誉' },
              { id: 'n3', date: '2022-12-01', title: '安宁深眠母公司正式登陆纳斯达克（TQSC）', tag: '资本市场' },
              { id: 'n4', date: '2022-06-15', title: '第三代DNR舱体通过国家药监局审批', tag: '产品' },
              { id: 'n5', date: '2021-09-20', title: '安宁深眠入选南郊市"优质医疗服务示范单位"', tag: '荣誉' },
              { id: 'n6', date: '2021-03-10', title: 'DNR疗法临床试验三期顺利完成', tag: '临床' },
            ].map(n => (
              <div key={n.id} className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setSelectedNewsId(n.id)}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">{n.tag}</span>
                    <span className="font-bold text-gray-800 text-sm">{n.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{n.date}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">阅读全文 <ChevronRight className="w-3 h-3" /></div>
              </div>
            ))}
          </div>
        )}

        {/* 新闻详情 */}
        {activeTab === 'news' && selectedNewsId === 'n1' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedNewsId(null)}>← 返回新闻列表</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-lg font-bold text-gray-800">睡眠医疗赛道的隐秘巨头：安宁深眠的资本路径</h2>
              <p className="text-xs text-gray-400">2023-11-15 · 深度报道</p>
              <p>在国内睡眠医疗市场格局逐渐清晰的当下，安宁深眠诊所以其独创的DNR深度神经共振技术，悄然占据了这一赛道的核心位置。</p>
              <p>"我们不做广告，因为效果会说话。"钟长明院长在接受采访时如此表示。数据显示，安宁深眠2022年营收突破3.2亿元，同比增长47%。</p>
              <p>多位业内人士指出，安宁深眠的真正壁垒在于其技术的不可复制性——DNR疗法的核心算法至今未公开发表。</p>
              <p className="text-xs text-gray-400">作者：陈维远 | 《财经周刊》特约撰稿人</p>
            </div>
          </div>
        )}
        {activeTab === 'news' && selectedNewsId && selectedNewsId !== 'n1' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedNewsId(null)}>← 返回新闻列表</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700">
              <p className="text-gray-500">新闻内容加载中……</p>
            </div>
          </div>
        )}

        {/* ════════ 投资者关系 V4 §4.2 ════════ */}
        {activeTab === 'home' && null /* placeholder for investor link */}
        {/* 处理 investor 路由 - 从FAQ等地方可进入 */}

        {/* ════════ 联系我们 V4 §4.2 ════════ */}
        {activeTab === 'contact' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">联系我们</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /> 400-XXX-XXXX（24小时服务热线）</div>
              <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /> service@tranquil-sleep.com</div>
              <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /> 南郊市高新区安宁路188号</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">在线留言</h3>
              {contactSent ? (
                <p className="text-green-600 text-sm">感谢您的留言，我们将尽快与您联系。</p>
              ) : (
                <form className="space-y-3" onSubmit={(e) => {
                  e.preventDefault();
                  setContactSent(true);
                  if (contactMsg.includes('林晓') || contactName.includes('林晓')) {
                    readHook('contact_linxiao');
                    // <!-- last inquiry regarding lx044yin: flagged for review -->
                  }
                }}>
                  <input placeholder="您的姓名" value={contactName} onChange={e => setContactName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm" />
                  <textarea placeholder="留言内容" value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm h-24" />
                  <button className="w-full py-2 bg-[#2c5f7c] text-white rounded text-sm hover:bg-[#1a3a4a]">提交留言</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ════════ 档案查询 V4 §4.7 ════════ */}
        {activeTab === 'archive' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">📋 患者档案查询</h2>
            <p className="text-xs text-gray-500 text-center">康复患者可输入姓名或档案编号查询您的诊疗记录。</p>
            <form onSubmit={handleArchiveSearch} className="flex gap-2">
              <input value={archiveQuery} onChange={(e) => setArchiveQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="输入患者档案编号或姓名……" />
              <button className="px-5 py-2 bg-[#2c5f7c] text-white rounded-lg text-sm hover:bg-[#1a3a4a] flex items-center gap-1">
                <Search className="w-4 h-4" /> 查询
              </button>
            </form>
            {archiveResult}
          </div>
        )}

        {/* ════════ 专家专栏 V4 §4.5 ════════ */}
        {activeTab === 'articles' && !selectedArticle && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">🩺 专家专栏 — 林德坤 主任医师</h2>
            <p className="text-sm text-gray-500 mb-4">神经内科主任 · 钟院长的学术继承人</p>
            {([
              { id: 'd1' as ArticleId, title: '太多人误解了深度睡眠的本质', date: '2024-01-20' },
              { id: 'd2' as ArticleId, title: '乙酰胆碱与睡眠调节的最新研究进展', date: '2024-02-05' },
              { id: 'd3' as ArticleId, title: '救治失眠：为什么"努力入睡"是错的', date: '2024-02-18' },
              { id: 'd4' as ArticleId, title: '苦于失眠的你，可能从未真正休息过', date: '2024-03-01' },
            ]).map(a => (
              <div key={a.id} className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setSelectedArticle(a.id)}>
                <p className="font-bold text-gray-800">{a.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">林德坤 · {a.date}</span>
                  <span className="text-xs text-blue-600">阅读 <ChevronRight className="w-3 h-3 inline" /></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 文章一 正常科普 */}
        {activeTab === 'articles' && selectedArticle === 'd1' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">太多人误解了深度睡眠的本质</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-01-20</p>
              <p>在临床实践中，我常常遇到这样的患者：他们认为"深度睡眠"就是"睡得沉"，认为只要闭上眼睛、不被打扰就算是好的睡眠。</p>
              <p>事实远非如此。深度睡眠是大脑执行一系列复杂的神经修复过程的时间窗口。在这个阶段，海马体会对当天的记忆进行整理和归档，损伤的突触连接会被修复，代谢废物会被清除。</p>
              <p>当一个人长期缺乏深度睡眠时，这些修复过程无法正常执行，大脑会逐渐积累结构性损伤。这就是为什么慢性失眠患者常常伴随认知功能下降、情绪不稳定等症状。</p>
              <p className="text-xs text-gray-400 mt-4">全文刊载于《中国睡眠研究杂志》2024年第1期</p>
            </div>
          </div>
        )}

        {/* 文章二 RUNE_04 锁定段落 */}
        {activeTab === 'articles' && selectedArticle === 'd2' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">乙酰胆碱与睡眠调节的最新研究进展</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-02-05</p>
              <p>乙酰胆碱（Acetylcholine, ACh）是中枢神经系统中最重要的兴奋性神经递质之一。近年来的研究表明，ACh在REM睡眠的启动和维持中扮演着核心角色。</p>
              <p>本文综述了2022-2024年间该领域的主要进展，重点讨论了ACh受体亚型在睡眠-觉醒周期中的差异化调控机制。</p>
              <InvestigateNode hookId="col_d2_locked" runeId="RUNE_04"
                feedbackText="这一段……被权限锁定了。灰色遮罩下面有东西。林医生和赵启在会议室的那个傍晚……">
                <div className="bg-gray-100 p-4 rounded border cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200/80 flex items-center justify-center">
                    <p className="text-xs text-gray-500">[此内容需要专业账号访问]</p>
                  </div>
                  <p className="text-gray-400 blur-sm select-none">第三节：ACh受体亚型与DNR疗法的协同机制......</p>
                </div>
              </InvestigateNode>
              <p className="text-xs text-gray-400 mt-4">发表于《神经药理学前沿》2024年第2期</p>
            </div>
          </div>
        )}

        {/* 文章三 正常科普 */}
        {activeTab === 'articles' && selectedArticle === 'd3' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">救治失眠：为什么"努力入睡"是错的</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-02-18</p>
              <p>"今晚一定要早点睡"——这是失眠患者最常说的话，也是最适得其反的一句话。</p>
              <p>当你"努力"入睡时，你实际上激活了大脑的前额叶控制系统，这恰恰是入睡需要关闭的区域。越努力，越清醒。这不是意志力的问题，是神经生理学的基本规律。</p>
              <p>我们在临床中采用的认知行为干预，核心就是打破这个"努力-失败-焦虑-更努力"的恶性循环。配合DNR疗法的神经通路重建，大多数患者能在两周内建立新的入睡模式。</p>
              <p className="text-xs text-gray-400 mt-4">本文仅代表个人观点</p>
            </div>
          </div>
        )}

        {/* 文章四 V4: 太乙救苦四字加粗→FactId触发 */}
        {activeTab === 'articles' && selectedArticle === 'd4' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">苦于失眠的你，可能从未真正休息过</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-03-01</p>
              <p>如果你正在读这篇文章，大概率你已经失眠很久了。你尝试过很多方法——褪黑素、白噪音、冥想、安眠药、甚至酒精。有些方法短暂有效，但没有一个能真正解决问题。</p>
              <p>因为这些方法都在处理表面症状，而不是根源。根源在于你的神经通路已经形成了一套固化的"失眠模式"，每天晚上自动启动。</p>
              <p>我在安宁诊所的这些年里，看到过太多患者从绝望到新生。每一个康复的案例都在告诉我同一件事：人的大脑拥有远超我们想象的自我修复能力。</p>
              <InvestigateNode hookId="article_d4_ending"
                feedbackText="太、乙、救、苦……这四个字被加粗了。这是什么意思？"
                onReadComplete={() => addFact('linyuudon_message_found')}>
                <p className="mt-4 text-gray-600">我想对每一个正在<strong className="text-gray-800">苦</strong>于失眠的你说：不要放弃。在这条漫长而黑暗的路上，哪怕只有<strong className="text-gray-800">太</strong>微弱的一丝光，也值得你走向它。因为在光的那一头，有你已经很久没有体验过的东西——<strong className="text-gray-800">乙</strong>烯基谷氨酸受体介导的深层修复性睡眠。科学已经为你准备好了<strong className="text-gray-800">救</strong>赎的路径。</p>
              </InvestigateNode>
              <p className="text-xs text-gray-400 mt-4">本文仅代表个人观点，未经诊所管理层审阅</p>
            </div>
          </div>
        )}

        {/* ════════ 常见问题 + 论坛入口 V4 §5.2 ════════ */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">常见问题</h2>
            {[
              { q: 'DNR疗法有副作用吗？', a: '临床研究显示，DNR疗法的主要不良反应为轻微的短期记忆模糊，发生率约2.1%，通常在疗程结束后72小时内自行消退。' },
              { q: '住院期间可以接待访客吗？', a: '为确保治疗环境的稳定性，深度康复阶段（通常为入院后14天内）暂不安排探视。疗程结束后可正常探视。' },
              { q: '疗程一般多长？', a: '标准疗程为14天，根据患者具体情况可适当延长。我们的医疗团队会根据每日监测数据动态调整治疗方案。' },
              { q: '费用如何？可以医保报销吗？', a: '详细费用信息请致电我们的服务热线或到院咨询。目前DNR疗法尚未纳入医保目录，但我们提供分期付款方案。' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-5">
                <p className="font-bold text-gray-800 text-sm mb-2">Q：{faq.q}</p>
                <p className="text-sm text-gray-600">A：{faq.a}</p>
              </div>
            ))}
            {/* V4 §5.2 最后一条FAQ：论坛入口 */}
            <div className="bg-white rounded-lg shadow p-5">
              <p className="font-bold text-gray-800 text-sm mb-2">Q：我想与其他康复患者交流经验，有什么渠道吗？</p>
              <p className="text-sm text-gray-600">
                A：您可以访问我们的
                <InvestigateNode hookId="faq_forum_url" feedbackText="状态栏短暂显示了一个URL……forum.tranquil-sleep.com/bbs。也许可以手动输入这个地址？" onReadComplete={() => addFact('forum_url_discovered')}>
                  <span className="text-gray-600 cursor-help relative group">
                    患者互助社区
                    <span className="absolute left-0 -bottom-5 text-[9px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                      http://forum.tranquil-sleep.com/bbs
                    </span>
                  </span>
                </InvestigateNode>
                （目前维护中）。
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ── 底部 ── */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        <p>© 2019-2024 安宁深眠（南郊）医疗研究中心 保留所有权利</p>
        <div className="mt-1 flex justify-center gap-4">
          <span className="cursor-pointer hover:text-gray-600" onClick={() => nav('contact')}>联系我们</span>
          <InvestigateNode hookId="footer_investor" feedbackText="Meridian Bioscience Capital……这个投资机构的网站什么都没有，只有一句话和一个邮箱。" onReadComplete={() => addFact('meridian_suspicious')}>
            <span className="cursor-help hover:text-gray-600">投资者关系</span>
          </InvestigateNode>
        </div>
      </footer>

      {/* V4 §4.3 HTML源码注释（模拟） → RUNE_02。放置于 <body> (组件容器) 的最底部 */}
      <InvestigateNode hookId="clinic_source_code" runeId="RUNE_02"
        feedbackText={`源码最底部有一行注释……bbs_admin@tranquil-sleep.com？还有——'don't stare at the logo too long'——署名z？`}>
        <div className="w-full">
          <p className="text-[8px] text-gray-200 hover:text-gray-400 cursor-pointer font-mono select-all transition-colors py-0.5 px-6">
            {'<!-- site maintenance contact: bbs_admin@tranquil-sleep.com | last maintained: 2024-03-19 | // reminder: don\'t stare at the logo too long // —z -->'}
          </p>
        </div>
      </InvestigateNode>

    </div >
  );
}
