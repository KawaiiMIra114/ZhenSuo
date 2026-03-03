import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { Search, ChevronRight, Phone, MapPin, Clock, Award, FileText, Users } from 'lucide-react';

// ═══════════════════════════════════════════
//  Clinic · V3 白区 · 安宁深眠诊所官网
//  A-1~A-3 新闻 + D-1~D-4 专栏 + 档案查询 + LOGO碎片
// ═══════════════════════════════════════════

type Tab = 'home' | 'news' | 'column' | 'archive' | 'about';

// 新闻数据 (V3 §A-1 ~ A-3)
interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  summary: string;
  content: React.ReactNode;
}

// 专栏数据 (V3 §D-1 ~ D-4)
interface ColumnItem {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: React.ReactNode;
}

export function Clinic() {
  const { readHook, hasReadHook, collectRune, hasRune, linXiaoSignalStrength } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [archiveQuery, setArchiveQuery] = useState('');
  const [archiveResult, setArchiveResult] = useState<string | null>(null);

  // LOGO 长凝视计时 (RUNE_06)
  const [logoHoverTime, setLogoHoverTime] = useState(0);
  const logoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [logoTriggered, setLogoTriggered] = useState(false);

  const handleLogoEnter = () => {
    if (hasRune('RUNE_06')) return;
    logoTimerRef.current = setInterval(() => {
      setLogoHoverTime(prev => {
        if (prev >= 8) {
          // 8秒触发
          collectRune('RUNE_06');
          setLogoTriggered(true);
          setTimeout(() => setLogoTriggered(false), 2000);
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

  // 档案查询处理
  const handleArchiveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = archiveQuery.trim().toUpperCase();
    if (q === 'LX-044-YIN') {
      setArchiveResult('redirect');
      readHook('archive_lx044');
    } else if (q.length > 0) {
      setArchiveResult('404');
    } else {
      setArchiveResult(null);
    }
  };

  // ── 新闻数据 ──
  const newsItems: NewsItem[] = [
    {
      id: 'news_transfer',
      title: '关于2024年3月14日患者批量转院的情况说明',
      date: '2024-03-14',
      tag: '公告',
      summary: '因设备升级维护需要，部分在院患者将按计划有序转至合作医疗机构……',
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <p className="text-xs text-gray-500">发布单位：安宁深眠诊所 行政管理部</p>
          <p className="text-xs text-gray-500">文件编号：AQSM-2024-ADM-031401</p>
          <hr />
          <p>尊敬的各位患者家属及社会各界：</p>
          <p>因我诊所核心睡眠监测设备（型号：Morpheus-III 全景脑电拓扑仪）进入定期维护周期，经诊所管理层研究决定，自2024年3月14日起，将对在院深度睡眠疗程患者进行有序批量转院安置。</p>
          <p>本次转院涉及<strong>长期住院疗程患者共计 47 名</strong>，均已按照既定程序完成家属知情同意签署。转往的合作机构分别为：</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>南郊市第三人民医院 睡眠医学中心（32名）</li>
            <li>省立精神卫生中心 特殊病房区（15名）</li>
          </ul>
          <p>请各位家属携带有效身份证件及既往开具的《知情同意授权书》副本，前往对应接收机构办理交接手续。</p>
          <p>如有疑问，请联系我诊所前台服务热线：</p>
          <p>
            <InvestigateNode hookId="news_8023" feedbackText="8023……这个工号好像很重要。">
              <span className="font-mono">前台值班工号：<strong className="text-blue-700">8023</strong></span>
            </InvestigateNode>
          </p>
          <p className="text-xs text-gray-400 mt-6">安宁深眠诊所 行政管理部</p>
          <p className="text-xs text-gray-400">2024年3月14日</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <InvestigateNode hookId="news_c3_link" runeId="RUNE_02" feedbackText="附件C3……这里面有什么？">
              📎 附件C3：《设备维护技术参数与服务协议》<span className="text-blue-500 underline cursor-pointer">（点击下载）</span>
            </InvestigateNode>
          </div>
        </div>
      ),
    },
    {
      id: 'news_zhaoqi',
      title: '感谢信 — 致外包运维工程师赵启同志',
      date: '2024-03-13',
      tag: '员工风采',
      summary: '赵启同志在我诊所信息化建设中兢兢业业，因个人原因离职……',
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <p>赵启同志（工号：IT-EXT-0077）于2023年6月入职我诊所信息技术外包运维岗位，服务期间兢兢业业，为诊所信息化建设做出了重要贡献。</p>
          <p>因个人职业发展规划调整，赵启同志已于<strong>2024年3月13日</strong>正式办理离职手续。</p>
          <div className="bg-gray-100 rounded-lg p-4 my-4">
            <InvestigateNode hookId="news_oa_url" feedbackText="照片背景的电脑屏幕上……似乎有一个网址。oa.tranquil-sleep.com">
              <img src={`${import.meta.env.BASE_URL}images/zhaoqi_departure.png`} alt="赵启离职照" className="w-full rounded" />
              <p className="text-xs text-gray-500 mt-2 text-center">▲ 赵启同志在办理离职手续（人事部门留影）</p>
            </InvestigateNode>
          </div>
          <p>在此，诊所管理层及全体同事向赵启同志致以诚挚的感谢，并祝愿其未来的职业道路一帆风顺。</p>
          <p className="text-xs text-gray-400">——安宁深眠诊所 人力资源部</p>
        </div>
      ),
    },
    {
      id: 'news_security',
      title: '信息安全管理规范 (修订版)',
      date: '2024-02-01',
      tag: '制度',
      summary: '为加强诊所信息系统安全管理，现修订发布《信息安全管理规范》……',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p className="font-bold text-gray-800">安宁深眠诊所 信息安全管理规范（2024修订版）</p>
          <p className="text-xs text-gray-500">文件编号：AQSM-IT-SEC-2024-001 | 密级：内部</p>
          <hr />
          <p className="text-xs text-gray-600 leading-relaxed">
            ……（前13条省略）
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <InvestigateNode hookId="news_password_rule" feedbackText="第14条……口令生成规则：拼音首字母。这也许能用来推断某个密码。">
              <p className="text-sm text-gray-800">
                <strong>第十四条</strong>　内部系统登录口令应采用<strong>指定口令短语的汉语拼音首字母缩写</strong>作为密码，口令短语由部门主管指定并通过安全渠道分发。工号即为登录用户名。
              </p>
            </InvestigateNode>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            ……（后续条款省略）
          </p>
          <p className="text-xs text-gray-400 mt-4">IT安全管理委员会 2024年2月1日</p>
        </div>
      ),
    },
  ];

  // ── 专栏数据（林医生四篇 D-1~D-4）──
  const columnItems: ColumnItem[] = [
    {
      id: 'col_d1',
      title: '太赫兹脑电拓扑在睡眠障碍中的前沿应用',
      author: '林德坤 主任医师',
      date: '2024-01-20',
      summary: '本文综述了太赫兹频段脑电拓扑成像技术在睡眠障碍诊断与治疗中的最新进展……',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p className="italic text-gray-500">——林德坤 | 安宁深眠诊所 睡眠医学研究中心主任</p>
          <p>近年来，太赫兹（THz）技术在生物医学领域的应用取得了突破性进展。特别是在睡眠障碍成像方面，THz脉冲能够穿透颅骨，以微创方式采集深层脑区活动拓扑……</p>
          <p>我们诊所引入的 Morpheus-III 系统正是基于此原理，通过构建全脑"数字映射"，实现对患者睡眠周期的精确调控……</p>
          <p className="text-xs text-gray-400 mt-4">全文刊载于《中国睡眠研究杂志》2024年第1期</p>
        </div>
      ),
    },
    {
      id: 'col_d2',
      title: '乙类精神药物在DNR辅助疗法中的剂量探索',
      author: '林德坤 主任医师',
      date: '2024-02-05',
      summary: '数字神经重映射（DNR）疗法的核心在于精确的药物-设备协同……',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p className="italic text-gray-500">——林德坤 | 安宁深眠诊所 DNR研究组组长</p>
          <p>数字神经重映射（Digital Neuro-Remapping, DNR）疗法是我诊所自主研发的核心技术平台。该疗法通过在受控镇静状态下，对患者大脑进行高精度电磁脉冲序列扫描，实现神经通路的"数字化重建"……</p>
          <InvestigateNode hookId="col_d2_permission" runeId="RUNE_04" feedbackText="这一段……讲的是权限控制？还是别的什么？">
            <p className="bg-gray-100 p-3 rounded border-l-4 border-gray-400">
              值得注意的是，系统在执行深度扫描时，需要获取<strong>最高权限授权</strong>。该授权密钥由诊所管理层持有，非经特别批准，普通技术人员无法接触核心算法参数……
            </p>
          </InvestigateNode>
          <p className="text-xs text-gray-400 mt-4">发表于内部技术通讯 No.47</p>
        </div>
      ),
    },
    {
      id: 'col_d3',
      title: '救助性睡眠干预的伦理边界再审视',
      author: '林德坤 主任医师',
      date: '2024-02-18',
      summary: '当技术能力超越伦理共识时，医者该何去何从？',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p className="italic text-gray-500">——林德坤 | 安宁深眠诊所</p>
          <p>本文试图探讨一个日益紧迫的问题：当睡眠干预技术的能力边界不断拓展，我们是否准备好了与之匹配的伦理框架？</p>
          <p>在临床实践中，我时常面对这样的困境——患者的痛苦是真实的、其家属的期望是迫切的，而我们手中的工具……其力量，或许已经超越了最初的设计意图。</p>
          <p className="text-gray-500 italic">如果有人因此而质疑我的选择，我只能说——我从未自愿成为这台机器的一部分。</p>
          <p className="text-xs text-gray-400 mt-4">本文仅代表个人观点，未经诊所管理层审阅</p>
        </div>
      ),
    },
    {
      id: 'col_d4',
      title: '苦役阈值：持续性深度镇静的神经代谢风险',
      author: '林德坤 主任医师',
      date: '2024-03-01',
      summary: '长期深度镇静状态下，大脑的能量代谢模式将发生不可逆变化……',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p className="italic text-gray-500">——林德坤 | 安宁深眠诊所 DNR研究组</p>
          <p>当患者处于持续超过72小时的深度镇静状态时，其大脑前额叶皮层的葡萄糖代谢率会显著下降至基线水平的23%以下——这一现象被我们内部称为"苦役阈值"。</p>
          <p>跨越苦役阈值后，患者的海马体开始呈现类似于退行性病变的影像学特征。更令人不安的是，其EEG读数与仪器后台记录的"共振哈希值"之间，存在着某种我们目前无法解释的数学相关性……</p>
          <p className="font-bold text-gray-900 mt-4">
            <span className="text-red-700">太</span>多的事情，已经超出了一个医生能独自承担的范围。<br />
            <span className="text-red-700">乙</span>等密级的内部文件里，藏着我放不下的东西。<br />
            <span className="text-red-700">救</span>赎，或许从来就不在任何一本教科书里。<br />
            <span className="text-red-700">苦</span>海无涯，而我已是其中的一叶扁舟。
          </p>
          <p className="text-xs text-gray-400 mt-4">
            ——未完成草稿，自动保存于 2024-03-01 03:47 AM
          </p>
        </div>
      ),
    },
  ];

  const currentNews = newsItems.find(n => n.id === selectedNews);
  const currentColumn = columnItems.find(c => c.id === selectedColumn);

  return (
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InvestigateNode hookId="logo_hover" condition={!hasRune('RUNE_06')}>
              <div
                className="cursor-pointer select-none"
                onMouseEnter={handleLogoEnter}
                onMouseLeave={handleLogoLeave}
              >
                <img src={`${import.meta.env.BASE_URL}images/clinic_logo.png`} alt="LOGO" className="h-10 w-10 object-contain" />
              </div>
            </InvestigateNode>
            <div>
              <h1 className="text-lg font-bold text-[#2c5f7c]">安宁深眠诊所</h1>
              <p className="text-[10px] text-gray-400 font-mono">TRANQUIL SLEEP CLINIC</p>
            </div>
          </div>
          <nav className="flex gap-1">
            {([
              ['home', '首页'],
              ['news', '公告中心'],
              ['column', '专家专栏'],
              ['archive', '档案查询'],
              ['about', '关于我们'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`px-4 py-2 text-sm rounded-md transition-colors
                  ${activeTab === key ? 'bg-[#2c5f7c] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab(key); setSelectedNews(null); setSelectedColumn(null); setArchiveResult(null); }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* LOGO 触发闪白 */}
      {logoTriggered && (
        <div className="fixed inset-0 bg-white z-[9999] animate-pulse" style={{ animationDuration: '0.1s' }} />
      )}

      {/* 内容区 */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ===== 首页 ===== */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#2c5f7c] to-[#1a3a4a] rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">科技守护安睡 · 深眠重塑生活</h2>
              <p className="text-blue-100 text-sm mb-4">国际领先的 DNR 数字神经重映射技术，为您定制专属睡眠方案</p>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1"><Award className="w-4 h-4" /> 三甲合作</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 19,600+ 治愈案例</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 24H 专业监护</div>
              </div>
            </div>

            {/* 康复者证言 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">💬 康复者心声</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: '王丽芬', img: `${import.meta.env.BASE_URL}images/patient_1.png`, text: '在安宁诊所治疗两个月后，困扰我十年的失眠终于好了！', date: '2023-11' },
                  { name: '张海明', img: `${import.meta.env.BASE_URL}images/patient_2.png`, text: '非常专业的医疗团队，DNR疗法效果显著。', date: '2023-12' },
                  { name: '陈国良', img: `${import.meta.env.BASE_URL}images/patient_3.png`, text: '感谢林主任团队，让我重新找到了安稳的睡眠。', date: '2024-01' },
                ].map(p => (
                  <div key={p.name} className="bg-white rounded-lg shadow p-4">
                    <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
                    <p className="text-sm text-gray-700 italic mb-2">"{p.text}"</p>
                    <p className="text-xs text-gray-500">
                      —— <span className="clinic-link" onClick={() => {
                        setActiveTab('archive');
                        setArchiveQuery(p.name);
                        setArchiveResult('404');
                      }}>{p.name}</span>，{p.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== 公告中心 ===== */}
        {activeTab === 'news' && !selectedNews && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5" /> 公告中心
            </h2>
            {newsItems.map(news => (
              <div
                key={news.id}
                className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedNews(news.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">{news.tag}</span>
                    <span className="font-bold text-gray-800">{news.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{news.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{news.summary}</p>
                <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  阅读全文 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
            {/* 底部极小字信息安全条款链接 */}
            <div className="text-center mt-8">
              <span
                className="text-[9px] text-gray-300 hover:text-gray-500 cursor-pointer"
                onClick={() => setSelectedNews('news_security')}
              >
                《信息安全管理规范》
              </span>
            </div>
          </div>
        )}

        {/* 新闻详情 */}
        {activeTab === 'news' && selectedNews && currentNews && (
          <div>
            <button className="text-sm text-blue-600 mb-4 flex items-center gap-1" onClick={() => setSelectedNews(null)}>
              ← 返回公告列表
            </button>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentNews.title}</h2>
              <div className="text-xs text-gray-400 mb-4">{currentNews.date} · {currentNews.tag}</div>
              {currentNews.content}
            </div>
          </div>
        )}

        {/* ===== 专家专栏 ===== */}
        {activeTab === 'column' && !selectedColumn && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">🩺 专家专栏 — 林德坤 主任医师</h2>
            <p className="text-sm text-gray-500 mb-4">睡眠医学研究中心主任 · DNR研究组组长 · 首席科学家</p>
            {columnItems.map(col => (
              <div
                key={col.id}
                className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedColumn(col.id)}
              >
                <div className="font-bold text-gray-800">{col.title}</div>
                <p className="text-sm text-gray-600 mt-1">{col.summary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{col.author} · {col.date}</span>
                  <span className="text-xs text-blue-600 flex items-center gap-1">阅读 <ChevronRight className="w-3 h-3" /></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 专栏详情 */}
        {activeTab === 'column' && selectedColumn && currentColumn && (
          <div>
            <button className="text-sm text-blue-600 mb-4 flex items-center gap-1" onClick={() => setSelectedColumn(null)}>
              ← 返回专栏列表
            </button>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentColumn.title}</h2>
              <div className="text-xs text-gray-400 mb-4">{currentColumn.author} · {currentColumn.date}</div>
              {currentColumn.content}
            </div>
          </div>
        )}

        {/* ===== 档案查询 ===== */}
        {activeTab === 'archive' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">📋 患者档案查询</h2>
            <form onSubmit={handleArchiveSearch} className="flex gap-2">
              <input
                value={archiveQuery}
                onChange={(e) => setArchiveQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="输入患者档案编号或姓名……"
              />
              <button className="px-5 py-2 bg-[#2c5f7c] text-white rounded-lg text-sm hover:bg-[#1a3a4a] transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" /> 查询
              </button>
            </form>

            {archiveResult === 'redirect' && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-bold mb-2">⚠ 查询结果</p>
                <p>档案编号 <span className="font-mono font-bold">LX-044-YIN</span> 已被标记为<strong>「特殊残破资源库」</strong>级别。</p>
                <p className="mt-2 text-xs text-yellow-600">如需进一步了解，请前往 <span className="underline cursor-pointer" onClick={() => { setActiveTab('news'); }}>公告中心</span> 查看相关通知。</p>
              </div>
            )}

            {archiveResult === '404' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
                <p className="text-red-600 font-mono text-lg font-bold">404 Not Found</p>
                <p className="text-red-400 font-mono text-xs mt-1">// System.Meltdown</p>
                <p className="text-red-300 text-xs mt-3">未找到匹配的有效档案记录。</p>
              </div>
            )}
          </div>
        )}

        {/* ===== 关于我们 ===== */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">关于安宁深眠诊所</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-sm leading-relaxed text-gray-700">
              <p>安宁深眠诊所成立于2019年，坐落于南郊市科技创新产业园区，是一家集睡眠障碍诊断、治疗、科研于一体的专业医疗机构。</p>
              <p>诊所配备国际领先的 <strong>Morpheus-III 全景脑电拓扑仪</strong>及自主研发的 <strong>DNR（数字神经重映射）</strong>技术平台，致力于为广大睡眠障碍患者提供精准、高效、安全的诊疗服务。</p>
              <p>截至目前，诊所已累计服务患者超过 <strong>19,600</strong> 人次，综合康复率保持在 <strong>97.3%</strong> 以上。</p>
              <div className="flex gap-6 text-xs text-gray-500 mt-4">
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 南郊市高新区安宁路188号</div>
                <div className="flex items-center gap-1"><Phone className="w-4 h-4" /> 400-XXXX-8023</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 门诊：周一至周六 8:00-17:00</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © 2024 安宁深眠诊所 | 南郊市卫健委备案 No.XXXX |
        <span className="cursor-pointer hover:text-gray-600" onClick={() => { setActiveTab('news'); setSelectedNews('news_security'); }}>
          信息安全管理规范
        </span>
      </footer>
    </div>
  );
}
