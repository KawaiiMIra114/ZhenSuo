import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { Search, ChevronRight, Phone, MapPin, Clock, Award, FileText, Users, Star, Mail, ExternalLink } from 'lucide-react';

// ===============================
// Clinic · V4 官方官网页
// 首页 | 关于我们 | 专家团队 | DNR疗法 | 患者评价
// 新闻 | 联系我们 | 档案查询 | 专栏 | FAQ
// ===============================

type Tab = 'home' | 'about' | 'team' | 'treatment' | 'reviews' | 'news' | 'investor' | 'contact' | 'archive' | 'articles' | 'faq';
type TeamMember = 'list' | 'zhong' | 'lin';
type ArticleId = 'd1' | 'd2' | 'd3' | 'd4' | null;

export function Clinic() {
  const { readHook, hasReadHook, linXiaoSignalStrength, addFact, hasFact, setCurrentApp } = useGame();
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

  const [showSourceModal, setShowSourceModal] = useState(false);
  const articleD4TriggerRef = useRef<HTMLParagraphElement | null>(null);
  const endingBMutationActive = hasFact('ending_b_mutation_active');

  const handleForumFaqHoverEnter = () => {
    if (!hasFact('forum_url_discovered')) {
      addFact('forum_url_discovered');
      readHook('faq_forum_url');
    }
  };

  // 车祸新闻（n_crash）阅读后，写入车祸线索 Fact
  useEffect(() => {
    if (activeTab === 'news' && selectedNewsId === 'n_crash') {
      addFact('car_crash_clue');
    }
  }, [activeTab, selectedNewsId, addFact]);

  // 文章四：进入可视区域自动记录线索，不要求点击
  useEffect(() => {
    if (activeTab !== 'articles' || selectedArticle !== 'd4') return;
    if (hasReadHook('article_d4_ending')) return;
    const target = articleD4TriggerRef.current;
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      readHook('article_d4_ending');
      addFact('linyuudon_message_found');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        readHook('article_d4_ending');
        addFact('linyuudon_message_found');
        observer.disconnect();
      },
      { threshold: 0.45 }
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [activeTab, selectedArticle, hasReadHook, readHook, addFact]);

  // V4 4.7 档案查询完整响应逻辑
  const handleArchiveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = archiveQuery.trim();
    const qu = q.toUpperCase();

    if (!q) {
      setArchiveResult(null);
      return;
    }

    if (q === '林晓') {
      setArchiveResult(
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm text-yellow-800">
          查询到1条记录，档案迁移处理中，暂时无法访问。如有疑问请联系服务热线。
        </div>
      );
      readHook('archive_linxiao');
    } else if (qu === 'LX-044') {
      setArchiveResult(
        <div className="bg-red-50 border border-red-300 rounded p-4 text-sm text-red-700">
          档案编号格式错误。正确格式：XX-000-YYY（例：AB-123-CDE）
        </div>
      );
    } else if (qu === 'LX-044-YIN') {
      readHook('archive_lx044');
      setArchiveResult(
        <div className="bg-gray-100 border border-gray-300 rounded p-4 text-sm text-gray-700">
          <p className="text-red-500 font-mono text-xs mb-2">ERROR 500 - Internal Server Error</p>
          <p className="text-gray-500 text-xs">The requested resource could not be loaded.</p>
          <p className="text-[9px] text-gray-300 mt-4 font-mono">
            {'// debug: anchor_node disconnected - signal overflow detected at render layer'}
          </p>
        </div>
      );
    } else if (['槐木', '朱砂', '黑山羊'].includes(q)) {
      setArchiveResult(
        <div className="bg-orange-50 border border-orange-300 rounded p-4 text-sm text-orange-700">
          关键词类型不匹配，请输入患者姓名或档案编号。
        </div>
      );
    } else if (qu === 'PHX-ALPHA') {
      setArchiveResult(
        <div className="bg-red-100 border border-red-400 rounded p-4 text-sm text-red-800 font-mono">
          权限不足。此查询已被记录。
        </div>
      );
    } else if (qu === 'TAIYIJIUKU') {
      if (hasFact('password_half_juku_found') && hasFact('linyuudon_message_found')) {
        readHook('ending_trigger');
        addFact('ending_unlocked');
        setArchiveResult(
          <div className="bg-black rounded p-6 text-green-400 font-mono text-sm">
            <p>&gt; 系统检测到异常指令序列</p>
            <p>&gt; 正在验证权限...</p>
            <p className="mt-2 text-green-300">&gt; 权限验证通过。正在加载终局界面...</p>
          </div>
        );
        setTimeout(() => setCurrentApp('ending'), 2000);
      } else {
        setArchiveResult(
          <div className="bg-red-50 border border-red-300 rounded p-4 text-sm text-red-700">
            档案编号格式错误，请确认输入信息。
          </div>
        );
      }
    } else if (qu === 'MERIDIAN') {
      setArchiveResult(
        <div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600">
          此查询类型不在患者档案范围内。
        </div>
      );
    } else if (q === '8023') {
      setArchiveResult(
        <div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600 font-mono">
          查询结果为空。(0 Records Found)
        </div>
      );
    } else if (q === 'fswltz') {
      setArchiveResult(
        <div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600 font-mono">
          无效字符序列。(Invalid Input)
        </div>
      );
    } else if (qu === 'GH_0314_LX') {
      const originalTitle = document.title;
      document.title = '林晓';
      setTimeout(() => {
        document.title = originalTitle;
      }, 1500);
      setArchiveResult(
        <div className="bg-white border border-gray-300 rounded p-4 text-sm text-gray-600">
          <p className="font-mono text-gray-400">[账号已注销，相关档案已移除]</p>
        </div>
      );
    } else if (q === 'mnt0313') {
      if (hasFact('admin_unlocked')) {
        setArchiveResult(
          <div className="bg-green-50 border border-green-300 rounded p-4 text-sm text-green-700 font-mono">
            您已登录管理员会话，无需通过此入口。
          </div>
        );
      } else {
        setArchiveResult(
          <div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600 font-mono">
            拒绝访问。(Access Denied)
          </div>
        );
      }
    } else {
      setArchiveResult(
        <div className="bg-gray-50 border border-gray-300 rounded p-4 text-sm text-gray-600 font-mono">
          该档案编号在数据库中不存在。
        </div>
      );
    }
  };

  // 瀵艰埅鍒囨崲
  const nav = (tab: Tab) => {
    setActiveTab(tab);
    setTeamView('list');
    setSelectedArticle(null);
    setSelectedNewsId(null);
    setArchiveResult(null);
    setContactSent(false);
  };

  // 患者评价数据（V4 4.2）
  const reviews = Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    if (n === 17) {
      return {
        id: 'gh_0314_lx',
        date: '2024-01-07',
        score: 5,
        isSpecial: true,
        text: '预约了两个月终于排到了。入院前很紧张，但医护人员都非常专业，环境也很好。希望更多有需要的人能找到这里。',
        badge: '[该用户已提交完整疗程]',
      };
    }

    const names = [
      'user_2f8a3d', 'user_7c4b1e', 'user_9d2f3a', 'user_1b5e7c', 'user_4a8d2f', 'user_6e3c9b',
      'user_8f1a4d', 'user_3d7b5e', 'user_5c2e8a', 'user_0b9f3d', 'user_2a6c4e', 'user_7d1b8f',
      'user_4e9a2c', 'user_8c3d6b', 'user_1f5e7a', 'user_6b2a9d', 'user_3e8c1f', 'user_9a4d7b',
      'user_5d1e6c', 'user_0c7f2a', 'user_4b3e8d', 'user_8a6c1f', 'user_2d9b5e',
    ];
    const texts = [
      '失眠七年，终于能睡着了。感谢钟院长团队。',
      '治疗两个月，安眠药完全停了，生活质量明显提高。',
      '环境很好，医护人员专业而且耐心。',
      '第一次完整睡了8小时，感动到哭。',
      'DNR疗法确实有效，推荐给同样困扰的朋友。',
      '林医生非常细心，每次都详细解答我的疑问。',
      '来之前半信半疑，现在每天准时入睡。',
      '治疗环境舒适，像住五星级酒店一样。',
      '朋友推荐来的，果然名不虚传。',
      '老伴在这里治好了十年的失眠，特意来评价。',
      '服务态度非常好，前台的小伙伴也很热心。',
      '术后恢复期的失眠在这里得到了很好的解决。',
      '第二个疗程结束，每天能睡6-7小时了。',
      '价格确实不便宜，但效果是实实在在的。',
      '国内终于有这样专业的睡眠治疗机构了。',
      '感谢安宁诊所让我重新找回安稳的夜晚。',
      '出院后睡眠质量一直保持得很好。',
      '推荐！专业团队，先进技术，温馨环境。',
      '三个疗程下来，彻底告别了失眠。',
      '钟院长亲自诊断，非常权威。',
      '设备很先进，治疗过程也很舒适。',
      '虽然住院时间有点长，但效果值得。',
      '希望更多人知道这家诊所。',
    ];
    const dates = [
      '2023-03-15', '2023-04-22', '2023-05-10', '2023-06-03', '2023-06-28', '2023-07-14',
      '2023-08-01', '2023-08-19', '2023-09-05', '2023-09-22', '2023-10-08', '2023-10-25',
      '2023-11-11', '2023-11-28', '2023-12-05', '2023-12-18', '2024-01-07', '2024-01-15',
      '2024-01-22', '2024-02-01', '2024-02-08', '2024-02-15', '2024-02-22',
    ];
    const idx = n <= 16 ? n - 1 : n - 2;
    return {
      id: names[idx] || `user_${n}`,
      date: dates[idx] || '2024-01-01',
      score: n % 5 === 0 ? 4 : 5,
      isSpecial: false,
      text: texts[idx] || '治疗效果很好，推荐。',
      badge: undefined,
    };
  });

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="select-none">
              <img src={`${import.meta.env.BASE_URL}images/clinic_logo.png`} alt="LOGO" className="h-10 w-10 object-contain" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-[#2c5f7c]">安宁深眠诊所</h1>
              <p className="text-[10px] text-gray-400 font-mono">TRANQUIL SLEEP CLINIC</p>
            </div>
          </div>
          <nav className="flex gap-0.5 flex-wrap">
            {([
              ['home', '首页'], ['about', '关于我们'], ['team', '专家团队'],
              ['treatment', 'DNR疗法'], ['reviews', '患者评价'], ['news', '新闻动态'],
              ['articles', '专家专栏'], ['archive', '档案查询'], ['faq', '常见问题'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button key={key}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${activeTab === key ? 'bg-[#2c5f7c] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => nav(key)}>{label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* 首页 */}
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
                <p className="font-bold text-sm text-gray-800">专家团队</p><p className="text-xs text-gray-500">国际前沿睡眠医学团队</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5 text-center cursor-pointer hover:shadow-md" onClick={() => nav('archive')}>
                <Search className="w-8 h-8 text-[#2c5f7c] mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800">档案查询</p><p className="text-xs text-gray-500">康复患者档案检索</p>
              </div>
            </div>
            <div className="pt-2 text-center">
              <p className="text-[10px] tracking-[0.32em] text-gray-500/40">战略合作伙伴</p>
              <p className="mt-2 text-xs font-light tracking-[0.4em] text-[#6b7280]">MERIDIAN LIFE SCIENCES</p>
              <p className="mt-1 text-[10px] font-mono tracking-[0.2em] text-gray-500/30">meridian-ls.com</p>
            </div>
          </div>
        )}

        {/* 关于我们 */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm leading-relaxed text-gray-700">
            <h2 className="text-xl font-bold text-gray-800">关于安宁深眠诊所</h2>
            <p>安宁深眠诊所成立于2019年，坐落于南郊市，是一家集睡眠障碍诊断、治疗与科研于一体的专业医疗机构。</p>
            <p>钟长明院长早年在神经科学方向开展前沿研究，后与团队将理论转化为临床实践，逐步建立了 DNR 疗法的完整应用路径。</p>
            <p>诊所配备 <strong>Morpheus-III 全景脑电拓扑仪</strong> 及自主研发的 <strong>DNR（深度神经共振）</strong> 平台，覆盖从评估到康复的全流程。</p>
            <p>截至目前，诊所已累计服务患者超过 <strong>12,000</strong> 人次，综合改善率保持在 <strong>93%</strong> 以上。</p>
            <div className="flex gap-6 text-xs text-gray-500 mt-4">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 南郊市高新区安宁路88号</div>
              <div className="flex items-center gap-1"><Phone className="w-4 h-4" /> 400-XXX-XXXX</div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 周一至周六 8:00-17:00</div>
            </div>
          </div>
        )}

        {/* 专家团队 */}
        {activeTab === 'team' && teamView === 'list' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">专家团队</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setTeamView('zhong')}>
                <p className="font-bold text-lg text-gray-800">钟长明</p>
                <p className="text-sm text-gray-500">院长 · 创始人</p>
                <p className="text-xs text-gray-400 mt-2">神经科学博士 · DNR疗法奠基人</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md" onClick={() => setTeamView('lin')}>
                <p className="font-bold text-lg text-gray-800">林德坤</p>
                <p className="text-sm text-gray-500">神经内科主任</p>
                <p className="text-xs text-gray-400 mt-2">钟院长学术继承人 · 四篇专栏作者</p>
              </div>
              {endingBMutationActive && (
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <div className="h-20 rounded bg-gray-100 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 relative overflow-hidden">
                      <div className="absolute top-5 left-3 w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <div className="absolute top-5 right-3 w-1.5 h-1.5 rounded-full bg-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">新入职员工</p>
                  <p className="text-xs text-gray-400 mt-1">[资料同步中]</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 钟长明个人页 */}
        {activeTab === 'team' && teamView === 'zhong' && (
          <div>
            <button className="text-sm text-blue-600 mb-4 flex items-center gap-1" onClick={() => setTeamView('list')}>← 返回团队列表</button>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
              <h2 className="text-xl font-bold text-gray-800">钟长明 · 院长</h2>
              <p className="text-gray-500 text-xs">神经科学博士 | 安宁深眠诊所创始人 | DNR疗法首席科学家</p>
              <p className="italic text-gray-600 border-l-4 border-blue-300 pl-4 my-4">“我深知长期失眠患者的痛苦。修复一个人的睡眠，本质上是在修复一个人的生命秩序。”</p>
              <button className="text-xs text-blue-600 underline" onClick={() => readHook('zhong_academic')}>查看学术成果 →</button>
              {hasReadHook('zhong_academic') && (
                <div className="bg-gray-50 rounded p-4 mt-2 space-y-2 text-xs font-mono">
                  <p className="font-bold text-gray-600">学术发表记录</p>
                  <p className="text-gray-500">钟长明（2009）《海马体-丘脑突触可塑性与睡眠周期调控》——引用 847 次</p>
                  <p className="text-gray-500">钟长明（2008）《低频电磁波序列对神经元突触群的影响》——引用 312 次</p>
                  <p className="text-gray-300">[已撤稿] 钟长明（2006）《灵子场：意识的非局域性量子信息基底》</p>
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
              <p>林德坤主任在睡眠医学领域深耕多年，擅长将前沿神经科学研究应用于临床实践。加入安宁深眠后，长期负责 DNR 疗法的临床优化与推广工作。</p>
              <p className="text-xs text-blue-600 underline cursor-pointer" onClick={() => { nav('articles'); }}>查看专栏文章 →</p>
            </div>
          </div>
        )}

        {/* DNR疗法 */}
        {activeTab === 'treatment' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-800">DNR · 深度神经共振疗法</h2>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">什么是 DNR</h3>
              <p>DNR（Deep Neural Resonance）是本院核心研发的第三代睡眠重建系统。通过精准的低频刺激序列，作用于海马体与丘脑之间的关键通路，在短时间内为神经系统提供稳定的深层修复窗口。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">疗程说明</h3>
              <p>单次疗程约45分钟，标准建议为连续14天。治疗期间患者将在专用 DNR 舱内接受干预，可能出现轻微的感知模糊，属于可预期反应。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">DNR 舱体</h3>
              <div className="bg-gray-100 rounded p-4">
                <p className="text-gray-600">白色流线型舱体，内置精密场控系统。</p>
                <p className="text-xs text-gray-400 mt-2">舱体内壁采用专利<strong>隔振材料</strong>，确保治疗过程中的环境稳定性。</p>
              </div>
            </div>
          </div>
        )}

        {/* 患者评价（24条） */}
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
                  {/* 第17条下方的孤悬回复（RUNE_01） */}
                  {r.isSpecial && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">[此回复来自已注销账号，内容已折叠]</p>
                      <details className="cursor-pointer">
                        <summary className="text-xs text-blue-500">[展开]</summary>
                        <InvestigateNode hookId="review_orphan_reply" runeId="RUNE_01">
                          <p className="text-xs text-gray-500 mt-1 italic">[账号已注销]：祝你早日康复。</p>
                        </InvestigateNode>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新闻动态 */}
        {activeTab === 'news' && !selectedNewsId && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800"><FileText className="w-5 h-5 inline mr-1" />新闻动态</h2>
            {[
              { id: 'n1', date: '2023-11-15', title: '《睡眠医疗赛道的隐秘巨头：安宁深眠的资本路径》', tag: '深度报道' },
              { id: 'n2', date: '2023-06-08', title: '安宁深眠诊所获国际睡眠医学协会质量认证', tag: '荣誉' },
              { id: 'n3', date: '2022-12-01', title: '安宁深眠母公司正式登陆纳斯达克（TQSC）', tag: '资本市场' },
              { id: 'n_crash', date: '2022-11-08', title: '南郊市两车相撞事故：一人当场死亡，另一人送医抢救无效', tag: '社会' },
              { id: 'n4', date: '2022-06-15', title: '第三代DNR舱体通过国家药监局审批', tag: '产品' },
              { id: 'n5', date: '2021-09-20', title: '安宁深眠入选南都市“优质医疗服务示范单位”', tag: '荣誉' },
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
              <h2 className="text-lg font-bold text-gray-800">《睡眠医疗赛道的隐秘巨头：安宁深眠的资本路径》</h2>
              <p className="text-xs text-gray-400">2023-11-15 · 深度报道</p>
              <p>在国内睡眠医疗市场格局逐步清晰的背景下，安宁深眠诊所以其独创的 DNR 技术悄然占据赛道核心位置。</p>
              <p>“我们不做广告，因为效果会说话。”钟长明院长在采访中表示。公开数据显示，安宁深眠 2022 年营收达到 4.2 亿元，同比增长 47%。</p>
              <p>多位业内人士指出，安宁深眠真正的护城河在于技术不可复制性，DNR 核心算法至今未公开发表。</p>
              <p className="text-xs text-gray-400">作者：陈维迦 | 《财经周刊》特约撰稿人</p>
            </div>
          </div>
        )}
        {activeTab === 'news' && selectedNewsId === 'n_crash' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedNewsId(null)}>← 返回新闻列表</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-lg font-bold text-gray-800">南郊市两车相撞事故：一人当场死亡，另一人送医抢救无效</h2>
              <p className="text-xs text-gray-400">2022-11-08 · 社会</p>
              <p>11月7日深夜，南郊市高新区安宁路附近发生一起两车碰撞事故。</p>
              <p>据目击者描述，一辆轿车在路口与一辆货车发生碰撞，碰撞导致轿车严重受损。</p>
              <p>事故造成一人当场死亡，另一人送往南郊市第一人民医院后经抢救无效死亡。</p>
              <p>交管部门已介入调查，事故原因尚在核实中。</p>
              <p>（本报讯）</p>
            </div>
          </div>
        )}
        {activeTab === 'news' && selectedNewsId && selectedNewsId !== 'n1' && selectedNewsId !== 'n_crash' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedNewsId(null)}>← 返回新闻列表</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700">
              <p className="text-gray-500">新闻内容加载中……</p>
            </div>
          </div>
        )}

        {/* 投资者关系 */}
        {activeTab === 'home' && null /* placeholder for investor link */}
        {/* 处理 investor 路由 - 仅预留入口 */}

        {/* 联系我们 */}
        {activeTab === 'contact' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">联系我们</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /> 400-XXX-XXXX（24小时服务热线）</div>
              <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /> service@tranquil-sleep.com</div>
              <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /> 南郊市高新区安宁路88号</div>
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

        {/* 档案查询 */}
        {activeTab === 'archive' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">🔵 患者档案查询</h2>
            <p className="text-xs text-gray-500 text-center">康复患者可输入姓名或档案编号查询诊疗记录。</p>
            <form onSubmit={handleArchiveSearch} className="flex gap-2">
              <input
                value={archiveQuery}
                onChange={(e) => setArchiveQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="输入患者档案编号或姓名..."
              />
              <button className="px-5 py-2 bg-[#2c5f7c] text-white rounded-lg text-sm hover:bg-[#1a3a4a] flex items-center gap-1">
                <Search className="w-4 h-4" /> 查询
              </button>
            </form>
            {archiveResult}
          </div>
        )}

        {/* 专家专栏 */}
        {activeTab === 'articles' && !selectedArticle && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">专家专栏 - 林德坤 主任医师</h2>
            <p className="text-sm text-gray-500 mb-4">神经内科主任 · 钟院长的学术继承人</p>
            {([
              { id: 'd1' as ArticleId, title: '太多人误解了深度睡眠的本质', date: '2024-01-20' },
              { id: 'd2' as ArticleId, title: '乙酰胆碱与睡眠调节的最新研究进展', date: '2024-02-05' },
              { id: 'd3' as ArticleId, title: '救治失眠：为什么“努力入睡”是错的', date: '2024-02-18' },
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

        {/* 文章一 */}
        {activeTab === 'articles' && selectedArticle === 'd1' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">太多人误解了深度睡眠的本质</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-01-20</p>
              <p>在门诊里，我常听到一句话：“我只要闭上眼睛不动，就算睡着了。”这其实是最常见的误区。</p>
              <p>深度睡眠并不只是“没醒着”，它是大脑进行结构修复、记忆整合和代谢清除的关键窗口。</p>
              <p>当这种修复长期缺位，人会出现注意力下降、情绪波动和认知迟滞。你以为是疲劳，其实是系统级透支。</p>
              <p className="text-xs text-gray-400 mt-4">全文刊载于《睡眠研究》2024年1月刊</p>
            </div>
          </div>
        )}

        {/* 文章二（RUNE_04 锁定段落） */}
        {activeTab === 'articles' && selectedArticle === 'd2' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">乙酰胆碱与睡眠调节的最新研究进展</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-02-05</p>
              <p>乙酰胆碱（Acetylcholine, ACh）是中枢神经系统的重要递质之一，近年研究显示其在睡眠结构切换中扮演关键角色。</p>
              <p>本文聚焦 2022-2024 年的相关进展，重点讨论了 ACh 受体亚型在睡眠-觉醒周期中的差异化调控机制。</p>
              <InvestigateNode hookId="col_d2_locked" runeId="RUNE_04">
                <div className="bg-gray-100 p-4 rounded border cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200/80 flex items-center justify-center">
                    <p className="text-xs text-gray-500">[此内容需专业账号访问]</p>
                  </div>
                  <p className="text-gray-400 blur-sm select-none">第三节：ACh受体亚型与 DNR 疗法的协同机制……</p>
                </div>
              </InvestigateNode>
              <p className="text-xs text-gray-400 mt-4">发表于《神经药理学前沿》2024年2月刊</p>
            </div>
          </div>
        )}

        {/* 文章三 */}
        {activeTab === 'articles' && selectedArticle === 'd3' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">救治失眠：为什么“努力入睡”是错的</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-02-18</p>
              <p>“今晚我一定要早点睡。”这句话看似合理，却是许多失眠患者反复陷入焦虑循环的起点。</p>
              <p>当你把“入睡”当成任务去完成，大脑会持续维持高警觉状态，结果往往是越努力越清醒。</p>
              <p>临床干预的核心，是打破“努力-失败-焦虑-更努力”的循环，重建自然入睡模式。</p>
              <p className="text-xs text-gray-400 mt-4">本文仅代表作者个人观点</p>
            </div>
          </div>
        )}

        {/* 文章四（“太乙救苦”四字埋点） */}
        {activeTab === 'articles' && selectedArticle === 'd4' && (
          <div>
            <button className="text-sm text-blue-600 mb-4" onClick={() => setSelectedArticle(null)}>← 返回专栏</button>
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <h2 className="text-xl font-bold text-gray-800">苦于失眠的你，可能从未真正休息过</h2>
              <p className="text-xs text-gray-400">林德坤 · 2024-03-01</p>
              <p>如果你正在读这篇文章，大概率你已经失眠很久了。你试过很多方法：褪黑素、白噪音、冥想，甚至酒精。</p>
              <p>这些方法也许暂时有用，却很少触及根因。根因往往是神经系统已经形成了固定的“失眠模式”。</p>
              <p>这些年我见过很多患者从绝望走向恢复。每一个案例都在重复同一句话：大脑的可塑性，远比我们以为的更强。</p>
              <p ref={articleD4TriggerRef} className="mt-4 text-gray-600">在这条漫长而黑暗的路上，哪怕只有<strong className="text-gray-800">太</strong>微弱的一丝光，也值得你走向它。因为在光的那一端，是你很久没有体验过的深层修复性睡眠——由<strong className="text-gray-800">乙</strong>酰胆碱受体介导。科学已经为你准备好<strong className="text-gray-800">救</strong>赎的路径。我想对每一个正<strong className="text-gray-800">苦</strong>于失眠的你说：不要放弃。</p>
              <p className="text-xs text-gray-400 mt-4">本文仅代表作者个人观点，未经诊所管理层审核</p>
            </div>
          </div>
        )}

        {/* 常见问题 + 论坛入口 V4 5.2 */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">常见问题</h2>
            {[
              {
                q: 'DNR疗法有副作用吗？',
                a: '临床研究显示，DNR疗法主要不良反应为轻微短期记忆模糊，发生率约2.1%，通常在疗程结束后72小时内自行消退。',
              },
              {
                q: '住院期间可以接待访客吗？',
                a: '为确保治疗环境稳定，深度康复阶段（通常为入院后14天内）暂不安排探视。疗程结束后可正常探视。',
              },
              {
                q: '疗程一般多长？',
                a: '标准疗程为14天，根据患者具体情况可适当延长。医疗团队会根据每日监测数据动态调整治疗方案。',
              },
              {
                q: '费用如何？可以医保报销吗？',
                a: '详细费用请致电服务热线或到院咨询。当前DNR疗法尚未纳入医保目录，但我们提供分期付款方案。',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-5">
                <p className="font-bold text-gray-800 text-sm mb-2">Q: {faq.q}</p>
                <p className="text-sm text-gray-600">A: {faq.a}</p>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow p-5">
              <p className="font-bold text-gray-800 text-sm mb-2">Q: 我想与其他康复患者交流经验，有什么渠道吗？</p>
              <p className="text-sm text-gray-600">
                A: 您可以访问我们的
                <span
                  className="text-gray-600 cursor-help relative group mx-1"
                  onMouseEnter={handleForumFaqHoverEnter}
                >
                  患者互助社区
                  <span className="absolute left-0 -bottom-5 text-[9px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    http://forum.tranquil-sleep.com/bbs
                  </span>
                </span>
                （目前维护中）。
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ===== 底部 ===== */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        <p>{endingBMutationActive ? '© 2019-2025 安宁深眠（南郊）医疗研究中心 保留所有权利' : '© 2019-2024 安宁深眠（南郊）医疗研究中心 保留所有权利'}</p>
        <div className="mt-1 flex justify-center gap-4">
          <span className="cursor-pointer hover:text-gray-600" onClick={() => nav('contact')}>联系我们</span>
          <button className="cursor-pointer hover:text-gray-600" onClick={() => setShowSourceModal(true)}>
            查看页面源码
          </button>
        </div>
      </footer>

      {showSourceModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center px-4"
          onClick={() => setShowSourceModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-zinc-200 font-bold mb-3">页面源码（模拟）</h3>
            <p className="text-xs text-zinc-400 mb-3">点击注释区域可记录线索。</p>
            <InvestigateNode hookId="clinic_source_code" runeId="RUNE_02">
              <pre className="text-xs text-green-300 bg-black border border-zinc-700 rounded p-4 whitespace-pre-wrap cursor-pointer select-all">
{`<!--
site maintenance contact: bbs_admin@tranquil-sleep.com
last maintained: 2024-03-19
<!-- build-tag: mnt-release-2024 -->
// reminder: don't stare at the logo too long
// —z
-->`}
              </pre>
            </InvestigateNode>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-1.5 text-xs bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700"
                onClick={() => setShowSourceModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
}




