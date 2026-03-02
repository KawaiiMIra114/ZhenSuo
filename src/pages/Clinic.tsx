import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Search, ChevronRight } from 'lucide-react';

// 模拟新闻数据
const newsData = [
  {
    id: 'n1',
    date: '2024-03-14',
    title: '关于我院林某某患者突发癔症的声明',
    content: '近日，有网络传言称我院发生医疗事故。经核实，系患者林某某（女，24岁）因自身基础性精神疾病突发癔症。患者声称机房有鬼，并试图破坏医疗设备，这是严重的幻觉。我院已联系家属，由前台值班经理（工号8023）进行后续安抚，并已协助办理转院手续。请广大市民不信谣、不传谣。',
    keywords: ['3月14日', '林晓', '事故', '声明']
  },
  {
    id: 'n2',
    date: '2024-05-20',
    title: '我院IT工程师赵启光荣离职——感谢六年辛勤付出',
    content: '今天，我们怀着不舍的心情欢送我院资深IT工程师赵启。赵启同志在职期间，负责地下机房及全院网络的日常维护，工作兢兢业业。因个人发展原因，赵启同志正式离职。祝愿他在未来的道路上一帆风顺！',
    image: 'zhaoqi', // 标记需要渲染图片的特殊新闻
    keywords: ['机房', '赵启', 'IT', '离职']
  },
  {
    id: 'n3',
    date: '2024-06-01',
    title: '关于近期加强信息安全管理的通知',
    content: '为进一步提升医院信息化管理水平，防范数据泄露风险。即日起，所有内部系统登录密码将进行重置。为方便记忆，临时登录密码统一采用员工个人口令的拼音首字母缩写。请各位同事妥善保管，切勿外传。',
    keywords: ['密码', '安全', '通知', '管理']
  }
];

const doctorArticles = [
  { id: 'a1', title: '太阳光对睡眠的影响——你不知道的褪黑素秘密', excerpt: '光照是调节人体生物钟的关键因素。研究表明，清晨的阳光能够有效抑制褪黑素的分泌，帮助我们快速清醒；而夜间的强光则会……' },
  { id: 'a2', title: '乙酰胆碱与快速眼动期的关系', excerpt: '在REM（快速眼动）睡眠阶段，大脑中的乙酰胆碱水平会显著升高。这种神经递质不仅参与梦境的生成，还与记忆的巩固密切相关……' },
  { id: 'a3', title: '当救护车声惊醒你的深眠——城市噪音与睡眠质量', excerpt: '突发性的高分贝噪音不仅会打断睡眠周期，还会引发交感神经的应激反应。长期处于这种环境中，极易导致慢性失眠和焦虑……' },
  { id: 'a4', title: '苦于失眠？五个呼吸练习帮你入睡', excerpt: '通过调节呼吸频率，我们可以有效降低交感神经的活跃度。今天我将教大家一套“4-7-8”呼吸法，帮助你在十分钟内进入放松状态……' },
  { id: 'a5', title: '褪黑素不是安眠药——访我院钟长明博士', excerpt: '钟博士在接受采访时指出，滥用褪黑素可能会导致内分泌紊乱。他强调：“真正的安宁，来自于精神与肉体的和谐，而非化学物质的强制剥离。”' },
  { id: 'a6', title: '写在离职前——感谢安宁诊所的栽培', excerpt: '在这里实习的半年让我学到了很多。虽然有些“前沿”的治疗理念我至今无法完全理解，甚至感到一丝敬畏，但仍感谢这段经历' }
];

export function Clinic() {
  const { addClue, addFragment } = useGame();
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'doctors' | 'appointment'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof newsData>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [appointmentQuery, setAppointmentQuery] = useState('');
  const [appointmentResult, setAppointmentResult] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  const handleNewsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const results = newsData.filter(news => 
      news.title.includes(q) || 
      news.content.includes(q) || 
      news.keywords.some(k => k.includes(q))
    );
    
    setSearchResults(results);
    setHasSearched(true);

    // 触发线索收集逻辑
    if (results.some(r => r.id === 'n1')) {
      addClue({
        id: 'server-room',
        title: '新闻声明中的异常',
        description: '3月14日的声明提到林晓声称“机房有鬼”。后续安抚由前台值班经理（工号8023）负责。'
      });
    }
    if (results.some(r => r.id === 'n3')) {
      addClue({
        id: 'password-rule',
        title: '内部密码规则',
        description: '临时登录密码统一采用员工个人口令的拼音首字母缩写。'
      });
    }
  };

  const handleAppointmentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointmentQuery.trim().toUpperCase() === 'LX-044-YIN') {
      setAppointmentResult('该档案已作为【特殊医疗废弃物】处理，详情请见3月14日新闻公告。');
      addClue({
        id: 'march-14',
        title: '被销毁的档案',
        description: '挂号条码 LX-044-YIN 显示档案已被作为“特殊医疗废弃物”处理，提示查看3月14日新闻公告。'
      });
    } else {
      setAppointmentResult('未查询到相关就诊记录，请核对条码。');
    }
  };

  const handleZhaoQiImageClick = () => {
    setShowImageModal(true);
    addClue({
      id: 'zhao-qi-oa',
      title: '照片里的网址',
      description: '赵启离职新闻的照片中，电脑屏幕上隐约显示着内部OA系统的地址：oa.tranquil-sleep.com/login'
    });
  };

  return (
    <div className="bg-[#f4f7f6] font-sans text-[#333333] min-h-full">
      {/* Header */}
      <header className="bg-white border-b-4 border-[#0056b3] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Fake Logo - Infinity / Mobius */}
            <div className="w-12 h-12 text-[#0056b3] flex items-center justify-center text-4xl font-serif relative group cursor-pointer">
              ∞
              {/* Fragment 1: Hidden in logo hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-amber-600 bg-white/80 transition-opacity"
                onClick={(e) => { e.stopPropagation(); addFragment(1); alert('你发现了一枚古铜色的符文碎片。'); }}
              >
                符
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wider text-[#003d82]">安宁深眠诊所</h1>
              <p className="text-sm text-[#666666] tracking-widest mt-1">TRANQUIL SLEEP CLINIC</p>
            </div>
          </div>
          <div className="text-right text-sm text-[#666666]">
            <p className="font-bold text-[#0056b3] text-lg">400-820-XXXX</p>
            <p>南郊市科技园西路8号</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#0056b3] text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex">
          {[
            { id: 'home', label: '首页' },
            { id: 'news', label: '新闻中心' },
            { id: 'doctors', label: '专家团队' },
            { id: 'appointment', label: '在线挂号查询' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-8 py-4 text-sm font-bold transition-colors ${
                activeTab === item.id ? 'bg-[#003d82]' : 'hover:bg-[#004494]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 min-h-[600px]">
        
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in">
            <div className="bg-white p-12 shadow-sm border border-[#e0e0e0] text-center space-y-6">
              <h2 className="text-3xl font-bold text-[#003d82]">为您找回失去的安宁</h2>
              <p className="text-lg text-[#666666] max-w-3xl mx-auto leading-relaxed">
                通过第三代深度神经共振（DNR）疗法，实现对大脑神经网络的深度刺激，使您的精神与肉体实现暂时的完美剥离，从而达到毫无杂念的沉浸式深眠体验。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="animate-in fade-in flex gap-8">
            {/* Sidebar Search */}
            <div className="w-1/3 space-y-6">
              <div className="bg-white p-6 shadow-sm border border-[#e0e0e0]">
                <h3 className="font-bold text-lg mb-4 border-l-4 border-[#0056b3] pl-3">新闻检索</h3>
                <form onSubmit={handleNewsSearch} className="space-y-4">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入关键词..."
                    className="w-full border border-[#cccccc] px-4 py-2 focus:outline-none focus:border-[#0056b3]"
                  />
                  <button type="submit" className="w-full bg-[#0056b3] text-white py-2 hover:bg-[#003d82] transition-colors flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" /> 搜索
                  </button>
                </form>
              </div>
            </div>

            {/* Results */}
            <div className="w-2/3 bg-white p-8 shadow-sm border border-[#e0e0e0] min-h-[400px]">
              {!hasSearched ? (
                <div className="text-center text-[#999999] mt-20">
                  请输入关键词检索历史新闻公告。
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center text-red-600 mt-20">
                  未找到相关新闻。
                </div>
              ) : (
                <div className="space-y-8">
                  {searchResults.map((news, index) => (
                    <div 
                      key={news.id} 
                      className="border-b border-[#eeeeee] pb-8 last:border-0 animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                    >
                      <h3 className="text-xl font-bold text-[#003d82] mb-2">{news.title}</h3>
                      <p className="text-sm text-[#999999] mb-4 font-mono">{news.date}</p>
                      
                      {news.image === 'zhaoqi' && (
                        <div 
                          className="w-full h-48 bg-zinc-200 mb-4 flex flex-col items-center justify-center cursor-crosshair relative group border border-zinc-300 overflow-hidden"
                          onClick={handleZhaoQiImageClick}
                        >
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                          <span className="text-zinc-500 z-10">[点击放大查看 赵启工作照.jpg]</span>
                          <span className="text-xs text-zinc-400 mt-2 z-10">（图片背景中的电脑屏幕似乎亮着）</span>
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity z-20">
                            <span className="text-white font-mono text-sm border border-white px-3 py-1 mb-2">放大图片</span>
                            <span className="text-green-400 font-mono text-xs">检测到屏幕反光中的URL...</span>
                          </div>
                        </div>
                      )}

                      <p className="text-[#444444] leading-relaxed">
                        {/* 简单的高亮处理，实际中可以用更复杂的正则 */}
                        {news.content.split('机房').map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && <strong className="text-black bg-yellow-100">机房</strong>}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointment' && (
          <div className="animate-in fade-in max-w-2xl mx-auto bg-white p-8 shadow-sm border border-[#e0e0e0]">
            <h2 className="text-2xl font-bold text-[#003d82] mb-6 border-b pb-4">就诊进度查询</h2>
            <form onSubmit={handleAppointmentSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#666666] mb-2">请输入门诊挂号条码：</label>
                <input 
                  type="text" 
                  value={appointmentQuery}
                  onChange={(e) => setAppointmentQuery(e.target.value)}
                  placeholder="例如：LX-001-XXX"
                  className="w-full border-2 border-[#cccccc] px-4 py-3 text-lg font-mono focus:outline-none focus:border-[#0056b3]"
                />
              </div>
              <button type="submit" className="bg-[#0056b3] text-white px-8 py-3 font-bold hover:bg-[#003d82] transition-colors">
                查询进度
              </button>
            </form>

            {appointmentResult && (
              <div className={`mt-8 p-4 border-l-4 ${appointmentResult.includes('废弃物') ? 'bg-red-50 border-red-600 text-red-800' : 'bg-gray-50 border-gray-400 text-gray-700'}`}>
                {appointmentResult}
              </div>
            )}
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="animate-in fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#003d82] mb-6 border-b pb-4">专家专栏 - 林医生</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 mb-8 text-sm text-[#666666]">
              <p><strong>林医生简介：</strong> 我院前神经共振科实习医生，擅长通过生活方式干预改善睡眠质量。她曾在此开设专栏，分享了许多实用的睡眠科普知识。</p>
            </div>
            
            <div className="space-y-6">
              {doctorArticles.map((article, index) => (
                <div key={article.id} className="bg-white p-6 shadow-sm border border-[#e0e0e0] hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-[#333333] mb-3">
                    {/* Highlight the first letter slightly to hint the player */}
                    <span className="text-[#0056b3] font-serif pr-[1px]">{article.title.charAt(0)}</span>
                    {article.title.slice(1)}
                  </h3>
                  <p className="text-[#666666] leading-relaxed">
                    {article.excerpt}
                    {/* Fragment 6 hidden in the period of the last article */}
                    {index === 5 && (
                      <span 
                        className="cursor-pointer hover:text-amber-600 font-bold transition-colors"
                        onClick={() => {
                          addFragment(6);
                          alert('你在离职信的句号里发现了一枚古铜色的符文碎片。');
                        }}
                      >
                        。
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  addClue({
                    id: 'taiyi',
                    title: '专栏文章的藏头诗',
                    description: '林医生前四篇文章标题的首字连起来是：太、乙、救、苦。这似乎是某种暗号。'
                  });
                }}
                className="text-xs text-[#999999] hover:text-[#0056b3] underline"
              >
                [整理文章标题]
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl w-full bg-zinc-900 border border-zinc-700 p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors"
            >
              关闭 [X]
            </button>
            <div className="aspect-video bg-zinc-800 relative overflow-hidden flex items-center justify-center">
              {/* Simulated blurry photo background */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-700"></div>
              
              {/* The "Screen" in the background */}
              <div className="absolute right-1/4 top-1/4 w-64 h-48 bg-black border-8 border-zinc-900 rounded-sm transform rotate-12 skew-x-12 shadow-[0_0_50px_rgba(0,255,0,0.1)] flex items-start p-2">
                <div className="w-full h-full border border-green-900/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                  <div className="text-green-500 font-mono text-[10px] opacity-80 break-all leading-tight blur-[0.5px]">
                    <span className="text-white bg-green-900/50 px-1">https://oa.tranquil-sleep.com/login</span>
                    <br/><br/>
                    &gt; SYSTEM BOOT...<br/>
                    &gt; CHECKING PROTOCOLS...<br/>
                    &gt; AWAITING CREDENTIALS...
                  </div>
                </div>
              </div>

              {/* Foreground silhouette (Zhao Qi) */}
              <div className="absolute bottom-0 left-1/4 w-64 h-80 bg-zinc-900 rounded-t-full blur-md opacity-80"></div>
            </div>
            <div className="bg-black text-zinc-400 p-4 font-mono text-sm flex justify-between items-center">
              <span>IMG_20240520_1422.jpg</span>
              <span className="text-green-400 animate-pulse">线索已记录至笔记本</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#333333] text-[#999999] py-8 text-center text-sm">
        <p>
          © 2024 安宁深眠诊所 版权所有 
          <span 
            className="cursor-pointer hover:text-amber-600 ml-1"
            onClick={() => { addFragment(2); alert('你在版权声明处发现了一枚古铜色的符文碎片。'); }}
          >
            ©
          </span>
        </p>
        <p className="mt-2 text-xs">本网站提供的信息仅供参考，不能替代专业医生的诊断和治疗。</p>
      </footer>
    </div>
  );
}
