import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import {
  Search, MessageCircle, Clock, Eye, AlertTriangle, Lock,
  ChevronDown, ChevronUp, Shield, Users, FileText, Key, UserPlus
} from 'lucide-react';

// ═══════════════════════════════════════════
//  Forum · V3+V4 灰区 · 安宁社区病友交流论坛
//  四层信息系统 (public→member→admin→shadow)
//  B-1~B-3 三帖体系 + 会员区 + 管理员面板 + 影子档案
// ═══════════════════════════════════════════

interface Reply {
  author: string;
  avatar?: string;
  time: string;
  content: React.ReactNode;
  isMod?: boolean;
  isDeleted?: boolean;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  time: string;
  views: number;
  replies: number;
  isPinned?: boolean;
  isLocked?: boolean;
  isCollapsed?: boolean;
  tag?: string;
  content: React.ReactNode;
  replyList: Reply[];
  layer?: 'public' | 'member'; // 帖子所属层级
}

export function Forum() {
  const { collectRune, hasRune, readHook, linXiaoSignalStrength, forumAccess, setForumAccess, addFact, hasFact } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [expandedB3, setExpandedB3] = useState(false);
  const [b3Unlocked, setB3Unlocked] = useState(false);
  const [attemptPwd, setAttemptPwd] = useState('');
  const [pwdError, setPwdError] = useState('');

  // V4 层级控制
  const [activeTab, setActiveTab] = useState<'posts' | 'member' | 'admin' | 'shadow'>('posts');
  const [registerInput, setRegisterInput] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [shadowPath, setShadowPath] = useState('');
  const [shadowError, setShadowError] = useState('');

  // ── 帖子数据 (V3 §B-1 ~ B-3) ──
  const posts: ForumPost[] = [
    // B-1: Momo 真实体验帖
    {
      id: 'b1',
      title: '【亲身经历】在安宁做了三周DNR治疗，说一下真实感受',
      author: 'Momo不想失眠了',
      time: '2024-02-28 14:32',
      views: 2847,
      replies: 18,
      tag: '治疗分享',
      layer: 'public',
      content: (
        <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <p>先说结论：<strong className="text-green-400">前两周确实有效果</strong>，但第三周开始就很奇怪。</p>
          <p>我是重度失眠，吃了两年安眠药没用，朋友推荐来安宁做DNR疗法。刚开始住院的时候感觉挺正规的，护士很热情，房间也很干净。</p>
          <p>每天晚上10点会有护士来送一杯"褪黑素"（他们是这么说的，但那杯东西的味道……说不上来，有点像中药和消毒水混在一起）。</p>
          <p>喝完大概20分钟就会特别困，然后就被推去B2层做治疗。</p>
          <p>问题是，<strong>每次治疗结束后我完全不记得发生了什么</strong>。护士说这是正常的，"深度睡眠状态下不会形成新记忆"。可是我总感觉身体很疲惫，而且……</p>
          <p className="text-yellow-400/80">这么说可能有点奇怪——我总感觉有人在我睡着的时候<strong>碰过我的头</strong>。太阳穴附近，有时候醒来会有细微的压痕。</p>
          <p>第三周的时候，隔壁床的阿姨突然被转走了，说是"治疗效果良好，提前出院"。但我看到她被推出去的时候整个人毫无反应，眼睛是睁着的，但里面什么都没有。</p>
          <p>我当天就办了出院。</p>
          <p className="text-gray-500 text-xs">（总觉得这个帖子迟早要被删……先记录一下）</p>
        </div>
      ),
      replyList: [
        { author: '黄小迟', time: '02-28 15:01', content: '太阳穴有压痕？？那个位置不就是他们做脑电扫描的地方吗' },
        { author: 'sleepless_in_nanjiao', time: '02-28 16:44', content: '楼主说的那杯"褪黑素"，我也喝过。那东西真的不像褪黑素，倒更像是……某种镇静剂。' },
        { author: '已注册会员', time: '02-28 18:22', content: <span>你们有没有注意到，他们官网上那个<strong>康复率97.3%</strong>，但怎么从来没见过几个"康复者"出来说话的？</span> },
        { author: '论坛管理员', time: '02-28 18:25', isMod: true, content: <span className="text-yellow-500">⚠ 提醒：请各位用户发言时注意措辞，避免未经证实的揣测。本论坛保留处理违规内容的权利。</span> },
        { author: 'Momo不想失眠了', time: '02-28 20:11', content: '管理员速度真快啊……我才发了两小时就来警告了？谁一直盯着这个论坛呢？' },
      ],
    },
    // B-2: 阿涛问前台经理帖
    {
      id: 'b2',
      title: '有没有人认识安宁诊所的前台经理？想问点事',
      author: '阿涛在南郊',
      time: '2024-03-02 09:14',
      views: 1563,
      replies: 12,
      tag: '求助',
      layer: 'public',
      content: (
        <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <p>我表妹住院一个月了，诊所那边说"疗程进展顺利"，但一直不让探视。</p>
          <p>打前台电话要么占线，要么就是那套录音"您好，您已接通安宁深眠诊所……"</p>
          <p>有没有人认识<strong>前台经理</strong>或者值班的？工号多少？想直接找人问清楚。</p>
          <p>真的很着急。</p>
        </div>
      ),
      replyList: [
        { author: '路过围观', time: '03-02 09:45', content: '前台换了好几茬了，你要找的那个可能早走了' },
        {
          author: '[账号已注销]',
          time: '03-02 10:31',
          isDeleted: true,
          content: (
            <span className="text-gray-500">
              别费劲了，有本事你去把他们的<strong>采购清单</strong>找出来看看——你就知道一个睡眠诊所为什么要买<strong>枣木、朱砂和黑山羊血</strong>了。
              <br /><span className="text-gray-600 text-xs">（此账号已被管理员注销）</span>
            </span>
          ),
        },
        {
          author: '清风不识字',
          time: '03-02 11:17',
          content: (
            <InvestigateNode hookId="forum_fswltz" feedbackText="福生无量天尊……这是道教的用语。拼音首字母：f-s-w-l-t-z。">
              <span>
                朋友，我劝你别查了。有些事情不是你该碰的。<br />
                我只能说一句——<strong className="text-red-400">福生无量天尊</strong>。<br />
                你细品这六个字。信不信由你。
              </span>
            </InvestigateNode>
          ),
        },
        { author: '阿涛在南郊', time: '03-02 12:33', content: '？？？你们在说什么？枣木？朱砂？福生无量天尊？？这是睡眠诊所还是道观？？' },
        { author: '论坛管理员', time: '03-02 12:35', isMod: true, content: <span className="text-yellow-500">⚠ 本帖部分回复涉及不实信息，已进行清理处理。请勿传播未经证实的言论。</span> },
        {
          author: '热心市民',
          time: '03-02 14:08',
          content: (
            <InvestigateNode hookId="forum_employee_8023" feedbackText="工号8023……这是一个前台经理的工号。">
              <span>
                前台经理工号好像是<strong className="text-blue-400">8023</strong>，之前在他们内部通讯录见过。不过那人已经离职了。
              </span>
            </InvestigateNode>
          ),
        },
      ],
    },
    // B-3: 神秘封禁帖
    {
      id: 'b3',
      title: '█████████████（此帖已被管理员锁定）',
      author: '[已封禁]',
      time: '2024-03-11 23:58',
      views: 0,
      replies: 0,
      isLocked: true,
      isCollapsed: true,
      tag: '已封禁',
      layer: 'public',
      content: (
        <InvestigateNode hookId="forum_b3_unlock" runeId="RUNE_03" feedbackText="这个帖子……被人刻意隐藏了。">
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-red-400 font-mono text-xs">// 以下内容由缓存恢复，原帖已被管理员于 2024-03-12 00:03 永久删除</p>
            <p className="text-gray-400">我知道这个帖子很快就会被删。但我还是要说。</p>
            <p className="text-gray-400">B2层不是什么"治疗室"。那些所谓的"液冷机柜"里面——</p>
            <p className="text-red-400/80 font-bold">装的不是服务器。是人。</p>
            <p className="text-gray-500">每个舱体里都有一个人，身上插满了管子和传感器。他们还活着，但已经不是"活着"了。</p>
            <p className="text-gray-500">如果你解码他们实时上传的EEG数据包，你会发现那些波形不是脑电波——那是<strong className="text-amber-400">哭声</strong>。</p>
            <p className="text-red-500/40 font-mono text-xs mt-4">
              [原帖作者 IP: 10.0.77.*** | 内网发布]<br />
              [管理员操作日志: 删帖+封禁+IP溯源 | 耗时: 5分钟]
            </p>
            <hr className="border-red-900/50 my-4" />
            <div className="bg-zinc-950/80 p-3 rounded font-mono text-xs text-green-500/80">
              <p>{'>> SYSTEM OVERRIDE: ZK-0077 APPENDED <<'}</p>
              <p>如果你解开了这个锁定，说明你已经注意到了。</p>
              <p>不要去B2层。如果你想知道真相，到内网来找我。这才是真正的入口：</p>
              <p className="text-green-400 font-bold mt-2 hover:underline select-all">oa.tranquil-sleep.com</p>
              <p className="mt-2 text-green-600">账号就是那个被频繁提起的前台经理工号。密码你既然进得来，说明你早已知晓。</p>
            </div>
          </div>
        </InvestigateNode>
      ),
      replyList: [],
    },
  ];

  // V4 Layer 2 会员区帖子
  const memberPosts: ForumPost[] = [
    {
      id: 'm1',
      title: '【会员专区】关于"转院"患者的后续追踪',
      author: '失眠互助小组',
      time: '2024-03-05 16:22',
      views: 342,
      replies: 7,
      tag: '会员',
      layer: 'member',
      content: (
        <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <p className="text-yellow-400/80 text-xs">⚠ 本帖仅对注册会员可见</p>
          <p>统计了一下论坛上提到的"转院"案例，发现一个规律：</p>
          <p>所有被"转院"的患者，<strong className="text-red-400">没有一个人</strong>在转院后联系过家属或朋友。</p>
          <p>南郊市第三人民医院睡眠中心的值班护士说：<strong>"我们没有接收过任何来自安宁的转院患者。"</strong></p>
          <p>那47个人去了哪里？</p>
          <p className="text-gray-500 text-xs mt-4">—— 如果你在诊所内部见过编号 LX-044 开头的档案，你就知道答案了。</p>
        </div>
      ),
      replyList: [
        { author: '匿名会员A', time: '03-05 17:30', content: '我查过卫健委的转院记录备案系统。2024年3月14日没有任何机构向省立精神卫生中心发起过转院申请。' },
        { author: '匿名会员B', time: '03-06 02:11', content: '半夜两点多回复这个帖子的我可能也快消失了。但我必须说：那些人没有被转走。他们被送去了B2层。' },
        { author: '论坛管理员', time: '03-06 08:00', isMod: true, content: <span className="text-yellow-500">⚠ 本帖部分内容涉及敏感信息，已提交审查。请会员注意自我保护。</span> },
      ],
    },
    {
      id: 'm2',
      title: '有人试过破解诊所内部OA系统吗？',
      author: '好奇的猫',
      time: '2024-03-08 21:05',
      views: 128,
      replies: 3,
      tag: '会员',
      layer: 'member',
      content: (
        <InvestigateNode hookId="forum_oa_hint" feedbackText="OA系统……看来有人已经找到了内网入口。">
          <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>在论坛的某个被删帖子的缓存里，看到有人提到了一个内网地址：</p>
            <p className="font-mono text-green-400 bg-zinc-900 px-3 py-2 rounded">oa.tranquil-sleep.com</p>
            <p>试了一下，可以打开登录页面。但不知道账号密码。</p>
            <p>有人说前台经理的工号可以登录？如果你知道工号是多少，密码好像跟论坛某个帖子里的"六字真言"有关。</p>
          </div>
        </InvestigateNode>
      ),
      replyList: [
        {
          author: '深夜访客',
          time: '03-09 01:30',
          content: (
            <InvestigateNode hookId="forum_oa_discovered" feedbackText="有人确认了OA系统的存在和入口。">
              <span>确认了，那个地址是真实的。我通过B-3帖子里的线索拼出来了。不过只试了一次就不敢再试了——如果他们监控了登录日志……</span>
            </InvestigateNode>
          ),
        },
      ],
    },
  ];

  // 搜索过滤
  const currentPosts = activeTab === 'member' ? memberPosts : posts;
  const filteredPosts = searchQuery.trim()
    ? currentPosts.filter(p =>
      p.title.includes(searchQuery) ||
      p.author.includes(searchQuery) ||
      (searchQuery === '8023' && p.id === 'b2') ||
      (searchQuery.includes('前台') && p.id === 'b2')
    )
    : currentPosts;

  const allPosts = [...posts, ...memberPosts];
  const currentPost = allPosts.find(p => p.id === selectedPost);

  // 注册处理（需要 LX-044-YIN 来注册为会员）
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerInput.trim().toUpperCase() === 'LX-044-YIN') {
      setForumAccess('member');
      setRegisterError('');
      setActiveTab('member');
      readHook('forum_member_registered');
    } else {
      setRegisterError('邀请码无效，请核实后重试。');
    }
  };

  // 管理员登录处理
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() === 'bbs_admin' && adminPass.trim() === 'nj0313') {
      setForumAccess('admin');
      setAdminError('');
      readHook('forum_admin_logged_in');
    } else {
      setAdminError('管理员凭证错误。');
    }
  };

  // 影子档案路径解锁
  const handleShadowAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (shadowPath.trim().toLowerCase() === '/shadow/zk-0077' || shadowPath.trim().toLowerCase() === 'zk-0077') {
      setForumAccess('shadow');
      setShadowError('');
      readHook('forum_shadow_accessed');
      addFact('shadow_archive_accessed');
    } else {
      setShadowError('路径无效。');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-200">
      {/* 论坛头部 */}
      <header className="bg-[#16213e] border-b border-[#2a2a4a] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-blue-300">安宁社区</h1>
            <p className="text-xs text-gray-500">病友交流 · 康复分享 · 互助互爱</p>
          </div>
          <div className="flex items-center gap-3">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setSelectedPost(null); }}>
              <div className="flex items-center bg-[#2a2a4a] rounded-lg px-3 gap-2">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 py-1.5 outline-none w-40"
                  placeholder="搜索帖子……"
                />
              </div>
            </form>
          </div>
        </div>

        {/* V4 层级导航标签 */}
        <div className="max-w-4xl mx-auto mt-3 flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${activeTab === 'posts' ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'text-gray-500 hover:text-gray-300 hover:bg-[#2a2a4a]'}`}
            onClick={() => { setActiveTab('posts'); setSelectedPost(null); }}
          >
            <MessageCircle className="w-3 h-3" /> 公开区
          </button>

          {/* 会员区入口 */}
          {forumAccess === 'public' ? (
            <button
              className="px-3 py-1.5 rounded text-xs flex items-center gap-1.5 text-gray-600 hover:text-gray-400 hover:bg-[#2a2a4a] transition-colors"
              onClick={() => setActiveTab('member')}
            >
              <UserPlus className="w-3 h-3" /> 会员注册
            </button>
          ) : (
            <button
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${activeTab === 'member' ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' : 'text-gray-500 hover:text-gray-300 hover:bg-[#2a2a4a]'}`}
              onClick={() => { setActiveTab('member'); setSelectedPost(null); }}
            >
              <Users className="w-3 h-3" /> 会员区
            </button>
          )}

          {/* 管理员面板 — 需要已是会员 */}
          {(forumAccess === 'member' || forumAccess === 'admin' || forumAccess === 'shadow') && (
            <button
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${activeTab === 'admin' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' : 'text-gray-500 hover:text-gray-300 hover:bg-[#2a2a4a]'}`}
              onClick={() => setActiveTab('admin')}
            >
              <Shield className="w-3 h-3" /> 管理后台
            </button>
          )}

          {/* 影子档案 — 需要已是管理员 */}
          {(forumAccess === 'admin' || forumAccess === 'shadow') && (
            <button
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${activeTab === 'shadow' ? 'bg-red-900/50 text-red-300 border border-red-700/50' : 'text-gray-500 hover:text-gray-300 hover:bg-[#2a2a4a]'}`}
              onClick={() => setActiveTab('shadow')}
            >
              <Key className="w-3 h-3" /> 影子档案
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-6">

        {/* ===== 会员注册界面（V4 Layer 2 入口）===== */}
        {activeTab === 'member' && forumAccess === 'public' && (
          <div className="flex flex-col items-center justify-center py-20">
            <UserPlus className="w-16 h-16 text-purple-500/40 mb-6" />
            <h3 className="text-xl font-bold text-purple-300 mb-2">会员注册</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
              本区域仅对已验证会员开放。请输入您的患者档案编号作为邀请码。
            </p>
            <form className="flex flex-col gap-3 w-72" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="请输入患者档案编号……"
                value={registerInput}
                onChange={e => setRegisterInput(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-purple-900/50 rounded text-center text-purple-200 outline-none focus:border-purple-500 font-mono uppercase"
              />
              <button type="submit" className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 font-bold rounded transition-colors text-sm border border-purple-900/50">
                验证并注册
              </button>
              {registerError && <p className="text-red-500 text-xs mt-1 text-center">{registerError}</p>}
            </form>
            <p className="text-gray-600 text-xs mt-8">提示：档案编号可以在门诊单、邮件或诊所内部文件中找到。</p>
          </div>
        )}

        {/* ===== 管理员登录界面 (V4 Layer 3 入口) ===== */}
        {activeTab === 'admin' && forumAccess === 'member' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Shield className="w-16 h-16 text-yellow-500/40 mb-6" />
            <h3 className="text-xl font-bold text-yellow-300 mb-2">论坛管理后台</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
              仅限论坛管理员登录。未经授权的访问将被记录。
            </p>
            <form className="flex flex-col gap-3 w-72" onSubmit={handleAdminLogin}>
              <input
                type="text"
                placeholder="管理员账号"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-yellow-900/50 rounded text-yellow-200 outline-none focus:border-yellow-500 font-mono text-sm"
              />
              <input
                type="password"
                placeholder="密码"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-yellow-900/50 rounded text-yellow-200 outline-none focus:border-yellow-500 font-mono text-sm"
              />
              <button type="submit" className="w-full py-2 bg-yellow-900/40 hover:bg-yellow-800/60 text-yellow-300 font-bold rounded transition-colors text-sm border border-yellow-900/50">
                登录
              </button>
              {adminError && <p className="text-red-500 text-xs mt-1 text-center">{adminError}</p>}
            </form>
            <p className="text-gray-600 text-xs mt-8">提示：管理员账号和密码可在诊所内部系统中找到。</p>
          </div>
        )}

        {/* ===== 管理员面板内容 (V4 Layer 3) ===== */}
        {activeTab === 'admin' && (forumAccess === 'admin' || forumAccess === 'shadow') && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-yellow-400 mb-4">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold">管理员控制面板</h3>
              <span className="text-xs text-gray-500 ml-2">当前登录：bbs_admin</span>
            </div>

            {/* V4 §5.6 审查操作日志 */}
            <div className="bg-[#1e1e3a] rounded-lg p-5 border border-yellow-900/30">
              <h4 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> 系统操作日志 · 管理员视图</h4>
              <p className="text-[10px] text-gray-600 mb-3">共计 1,247 条记录（2019-01-01 至 2024-03-19）</p>
              <p className="text-[10px] text-yellow-400/60 mb-2">——筛选：2024年3月19日——</p>
              <div className="space-y-2 text-xs font-mono text-gray-400">
                <p>22:35 | 帖子ID:7832 | 操作:<span className="text-red-400">折叠</span></p>
                <p className="pl-6">| 触发词:[失踪] | 操作员:bbs_admin</p>
                <p className="pl-6">| 内容摘要:"最近三个月我认识的两个病友都..."[截断]</p>
                <p className="mt-1">22:34 | 帖子ID:7831 | 操作:<span className="text-red-400">折叠</span></p>
                <p className="pl-6">| 触发词:[地下,声音] | 操作员:bbs_admin</p>
                <p className="pl-6">| 内容摘要:"我也听到了那个声音，而且不只是..."[截断]</p>
                <p className="mt-1">22:31 | 帖子ID:7829 | 操作:<span className="text-red-400">折叠</span></p>
                <p className="pl-6">| 触发词:[手动操作] | 操作员:bbs_admin</p>
                <p className="pl-6 text-amber-400">| 内容摘要:"如果有人看到这条，告诉他们B2层..."[截断]</p>
                <p className="mt-1 text-red-400">22:30 | 账号:zq_mnt_8023 | 操作:<span className="font-bold">封禁</span></p>
                <p className="pl-6 text-red-400">| 原因:持续发布违规内容 | 操作员:bbs_admin</p>
              </div>
              <p className="text-[10px] text-amber-400/60 mt-4">※ 22:30账号被封禁。22:31被封禁的账号发出了一条新帖子，系统仍然接收并处理了它。</p>
            </div>

            {/* V4 §5.6 关键词过滤列表 */}
            <div className="bg-[#1e1e3a] rounded-lg p-5 border border-yellow-900/30">
              <h4 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> 当前激活关键词列表（共43条）</h4>
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <p className="text-yellow-400/60 mb-1">[自动折叠]</p>
                  <div className="flex flex-wrap gap-2">
                    {['失踪', '消失', '联系不上', '转介之后', '合作机构电话', '地下声音', '奇怪声音', '暖通噪音', '气味', '线香味', '离职', '辞职申请', '员工去哪了', 'B2', '地下室', '机房'].map(kw => (
                      <span key={kw} className="px-2 py-1 bg-red-900/30 text-red-300 rounded">{kw}</span>
                    ))}
                    <span className="px-2 py-1 text-gray-600">[... 共31条 ...]</span>
                  </div>
                </div>
                <div>
                  <p className="text-red-400/80 mb-1">[立即通知PR]</p>
                  <div className="flex flex-wrap gap-2">
                    {['媒体', '记者', '曝光', '举报', '律师', '警察', '信访', '投诉', '诉讼'].map(kw => (
                      <span key={kw} className="px-2 py-1 bg-red-900/50 text-red-200 rounded">{kw}</span>
                    ))}
                    <span className="px-2 py-1 text-gray-600">[... 共12条 ...]</span>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-2">
                  <InvestigateNode hookId="admin_archive_path" feedbackText="这行不是关键词……是赵启藏在列表末尾的路径提示。">
                    <p className="text-gray-600 hover:text-green-400/60 transition-colors cursor-pointer">[ARCHIVE_PATH: /srv/bbs_backup/zq_mirror_20240101/]</p>
                  </InvestigateNode>
                </div>
              </div>
            </div>

            {/* V4 §5.6 封禁账号管理 — 含林晓(gh_0314_lx)完整记录 */}
            <InvestigateNode hookId="admin_banned_users" feedbackText="gh_0314_lx……这是林晓的论坛账号。她在消失前说过什么？">
              <div className="bg-[#1e1e3a] rounded-lg p-5 border border-yellow-900/30">
                <h4 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-2"><Lock className="w-4 h-4" /> 被封禁账号管理</h4>
                <div className="space-y-4 text-xs">
                  {/* 林晓账号 */}
                  <div className="bg-zinc-900 p-4 rounded border border-amber-900/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-amber-400 font-mono font-bold">gh_0314_lx</span>
                      <span className="text-gray-600">注册：2023-12-27 | 封禁：2024-01-10 08:47</span>
                    </div>
                    <p className="text-gray-500 mb-3">封禁原因：违规内容 | 操作员：bbs_admin</p>
                    <p className="text-yellow-400/60 mb-2">历史发帖记录（含已折叠内容）：</p>
                    <div className="space-y-2 text-gray-400 leading-relaxed">
                      <div className="pl-2 border-l-2 border-gray-700">
                        <p className="text-gray-500">[帖子1 · 2023-12-28 23:14]</p>
                        <p>"请问有没有人试过DNR疗程？我失眠快四年了，最近看到这家诊所的介绍，感觉和我的情况很像。想听听实际体验，谢谢。"</p>
                        <p className="text-gray-600">状态：正常 | 回复：6条</p>
                      </div>
                      <div className="pl-2 border-l-2 border-gray-700">
                        <p className="text-gray-500">[帖子2 · 2024-01-03 01:07]</p>
                        <p>"预约上了！等了两个月终于排到了，下周去。有点紧张，但更多是期待。希望能好起来。"</p>
                        <p className="text-gray-600">状态：正常 | 回复：4条（全是祝福）</p>
                      </div>
                      <div className="pl-2 border-l-2 border-amber-800/50">
                        <p className="text-gray-500">[帖子3 · 2024-01-09 02:34]</p>
                        <p className="text-amber-300/80">"明天去了。失眠四年，今晚可能是最后一个睡不着的夜晚了。如果有人认识我的话，帮我照顾一下我哥哥，他担心我。"</p>
                        <p className="text-red-400/60">状态：已折叠（折叠时间：2024-01-10 08:50）</p>
                        <p className="text-gray-600">回复：1条——"祝你早日康复。"（回复者账号亦已注销）</p>
                      </div>
                    </div>
                  </div>
                  {/* 赵启账号 */}
                  <div className="flex items-center justify-between p-2 bg-zinc-900 rounded">
                    <span className="text-red-400 font-mono">zq_mnt_8023</span>
                    <span className="text-gray-500">封禁：2024-03-19 22:30 | 原因：持续发布违规内容</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-zinc-900 rounded">
                    <span className="text-gray-400 font-mono">[账号已注销]</span>
                    <span className="text-gray-500">IP: 192.168.*.*** | 永久封禁 | 2024-03-11</span>
                  </div>
                </div>
              </div>
            </InvestigateNode>

            {/* V4 §5.6 内部通讯 */}
            <div className="bg-[#1e1e3a] rounded-lg p-5 border border-yellow-900/30">
              <h4 className="text-sm font-bold text-yellow-300 mb-3">📨 内部通讯</h4>
              <div className="space-y-3 text-xs text-gray-400 font-mono">
                <div className="bg-zinc-900 p-3 rounded leading-relaxed">
                  <p className="text-yellow-400/60 mb-2">——2024-01-11 09:23——</p>
                  <p>发件人：pr_team@tranquil-sleep.com</p>
                  <p>收件人：bbs_admin@tranquil-sleep.com</p>
                  <p className="text-gray-500 mb-2">主题：账号处理请求</p>
                  <p className="mt-2">bbs_admin，</p>
                  <p className="mt-1">账号 <span className="text-amber-400">gh_0314_lx</span> 已于昨日完成入院登记，请按标准流程即刻封禁并清理其全部历史发言，封禁原因填写"违规内容"。</p>
                  <p className="mt-1">相关档案编号 <span className="text-amber-400">LX-044-YIN</span> 已在后台标注特殊处理序列，请跟进后续内容监控。</p>
                  <p className="mt-1">王总确认：此类账号处理不需要逐条审批，你有自行判断权，无需回复。</p>
                </div>
                <InvestigateNode hookId="admin_internal_mail_2" feedbackText="赵启的汇报邮件……没有得到任何回复。">
                  <div className="bg-zinc-900 p-3 rounded leading-relaxed">
                    <p className="text-yellow-400/60 mb-2">——2024-03-14 16:47——</p>
                    <p>发件人：bbs_admin@tranquil-sleep.com</p>
                    <p>收件人：pr_team@tranquil-sleep.com</p>
                    <p className="text-gray-500 mb-2">主题：RE:本周违规内容处理汇报</p>
                    <p className="mt-2">贵部门要求处理的帖子（ID:7821-7824）已完成折叠。</p>
                    <p className="mt-1">另：关于"声音"和"气味"两个关键词，本月触发频率已达237次，较上月增加约91次。建议贵部门评估是否需要更新设备维护说明，以便向可能询问的员工作出技术性解释。</p>
                    <p className="mt-2">此为例行汇报，无需回复。</p>
                    <p className="mt-1">赵{/* <!-- personal auth backup: mnt8023_zq --> */}</p>
                  </div>
                </InvestigateNode>
              </div>
            </div>
          </div>
        )}

        {/* ===== 影子档案入口 (V4 Layer 4 入口) ===== */}
        {activeTab === 'shadow' && forumAccess === 'admin' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Key className="w-16 h-16 text-red-500/40 mb-6" />
            <h3 className="text-xl font-bold text-red-300 mb-2">影子档案</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
              此目录不在论坛公开索引中。输入完整路径以访问。
            </p>
            <form className="flex flex-col gap-3 w-72" onSubmit={handleShadowAccess}>
              <input
                type="text"
                placeholder="/shadow/..."
                value={shadowPath}
                onChange={e => setShadowPath(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-red-900/50 rounded text-red-200 outline-none focus:border-red-500 font-mono text-sm"
              />
              <button type="submit" className="w-full py-2 bg-red-900/40 hover:bg-red-800/60 text-red-300 font-bold rounded transition-colors text-sm border border-red-900/50">
                访问
              </button>
              {shadowError && <p className="text-red-500 text-xs mt-1 text-center">{shadowError}</p>}
            </form>
          </div>
        )}

        {/* ===== 影子档案内容 (V4 Layer 4) ===== */}
        {activeTab === 'shadow' && forumAccess === 'shadow' && (
          <div className="space-y-6">
            {/* V4 §5.7 文件目录界面 - 黑底绿字 */}
            <div className="bg-black rounded-lg p-6 border border-green-900/30 font-mono text-xs text-green-500/90 leading-relaxed">
              <p className="text-green-400 mb-1">/srv/bbs_backup/zq_mirror_20240101/</p>
              <p className="text-green-600">建立时间：2024-01-01 00:00:01</p>
              <p className="text-green-600">建立人：MNT-8023</p>
              <p className="text-green-600 mt-2">说明：此目录为非标准备份，不在常规维护计划内。</p>
              <p className="text-green-600 mb-4">{'      '}如发现此目录，你大概知道该怎么做。</p>
              <p className="text-green-400 mb-2">目录结构：</p>
              <p>/deleted_posts/{'    '}[1,247个文件]</p>
              <p>/banned_accounts/{'  '}[89个文件]</p>
              <p className="text-green-300 cursor-pointer hover:text-green-100">/README.txt</p>
            </div>

            {/* README.txt */}
            <InvestigateNode hookId="shadow_readme" runeId="RUNE_03" feedbackText="赵启……他一直在暗中保存那些被删掉的声音。">
              <div className="bg-black rounded-lg p-6 border border-green-900/30 font-mono text-xs text-green-500/80 leading-relaxed">
                <p className="text-green-400 mb-3">README.txt</p>
                <p>如果你找到了这里，说明你足够认真。</p>
                <p className="mt-2">这里存的是所有被处理掉的内容，</p>
                <p>从我开始怀疑的那天（2024-01-01）到今天。</p>
                <p className="mt-2">我不知道今天是哪天，</p>
                <p>因为我在写这个README的时候还不知道</p>
                <p>它会被读到的时候是什么时候。</p>
                <p className="mt-2">那些被删掉的声音，都在/deleted_posts/里。</p>
                <p>我试着让它们不要消失。</p>
                <p className="mt-2">/banned_accounts/里有一个叫<span className="text-amber-400">gh_0314_lx</span>的档案。</p>
                <p>去看看她说过什么。</p>
                <p className="mt-2">最重要的一个文件在这里：</p>
                <p className="mt-1 text-green-300">post_7829_complete.txt</p>
                <p className="mt-2">——赵启</p>
              </div>
            </InvestigateNode>

            {/* post_7829_complete.txt */}
            <InvestigateNode hookId="shadow_post_7829" feedbackText="赵启最后的帖子……他说'我不知道我今天能不能走出去'。然后他没有走出去。">
              <div className="bg-black rounded-lg p-6 border border-red-900/30 font-mono text-xs text-green-500/80 leading-relaxed">
                <p className="text-green-400 mb-3">post_7829_complete.txt</p>
                <p className="text-gray-500">帖子ID: 7829</p>
                <p className="text-gray-500">发帖时间：2024-03-19 22:31:47</p>
                <p className="text-gray-500">发帖人：zq_mnt_8023</p>
                <p className="text-red-400/60">状态：已折叠（折叠时间：22:31:52）</p>
                <p className="text-red-400/60 mb-3">{'      '}[5秒后被系统接收并处理]</p>
                <p className="text-green-400 mb-2">完整内容：</p>
                <p className="text-green-300">如果有人看到这条，告诉他们B2层不是服务器机房。</p>
                <p className="text-green-300 mt-2">我不知道我今天能不能走出去。</p>
                <p className="text-green-300 mt-2">我在三个地方藏了东西。</p>
                <p className="text-green-300">OA里，林医生的专栏里，还有这个路径。</p>
                <p className="text-green-300">找到它们，把它们拼在一起。</p>
                <p className="text-green-300 mt-2">赵启</p>
              </div>
            </InvestigateNode>
          </div>
        )}

        {/* ===== 帖子列表（公开区 & 会员区）===== */}
        {(activeTab === 'posts' || (activeTab === 'member' && forumAccess !== 'public')) && !selectedPost && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <MessageCircle className="w-4 h-4" />
              {activeTab === 'posts' ? '全部帖子' : '会员专区'} ({filteredPosts.length})
            </div>
            {filteredPosts.map(post => (
              <div key={post.id}>
                {/* B-3 折叠帖子 */}
                {post.isCollapsed ? (
                  <div className="bg-[#1e1e3a] rounded-lg border border-red-900/30 overflow-hidden">
                    <button
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#25254a] transition-colors"
                      onClick={() => {
                        if (!expandedB3) {
                          setExpandedB3(true);
                          readHook('forum_b3_expanded');
                        } else {
                          setSelectedPost(post.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-500" />
                        <span className="text-red-400/80 text-sm">{post.title}</span>
                      </div>
                      {expandedB3 ? <ChevronUp className="w-4 h-4 text-red-500" /> : <ChevronDown className="w-4 h-4 text-red-500" />}
                    </button>
                    {expandedB3 && (
                      <div className="p-4 border-t border-red-900/20 cursor-pointer" onClick={() => setSelectedPost(post.id)}>
                        <p className="text-xs text-red-400/60 font-mono">// 警告：此内容已被标记为违规，展开即代表您知悉风险</p>
                        <p className="text-xs text-gray-500 mt-1">点击查看内容……</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="bg-[#1e1e3a] rounded-lg p-4 cursor-pointer hover:bg-[#25254a] transition-colors border border-transparent hover:border-blue-900/30"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.tag && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${post.tag === '求助' ? 'bg-orange-900/40 text-orange-300' :
                              post.tag === '会员' ? 'bg-purple-900/40 text-purple-300' :
                                'bg-blue-900/40 text-blue-300'
                              }`}>{post.tag}</span>
                          )}
                          <span className="text-sm text-gray-200 font-medium">{post.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{post.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.time}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.replies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== 帖子详情 ===== */}
        {selectedPost && currentPost && (
          <div>
            <button className="text-sm text-blue-400 mb-4 flex items-center gap-1" onClick={() => setSelectedPost(null)}>
              ← 返回帖子列表
            </button>
            <div className="bg-[#1e1e3a] rounded-lg overflow-hidden">
              {/* 主帖 */}
              <div className="p-5 border-b border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-1">
                  {currentPost.tag && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300">{currentPost.tag}</span>
                  )}
                  {currentPost.isLocked && <Lock className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <h2 className="text-lg font-bold text-gray-100 mb-3">{currentPost.title}</h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="text-blue-300">{currentPost.author}</span>
                  <span>{currentPost.time}</span>
                  <span>浏览 {currentPost.views}</span>
                </div>
                {currentPost.id === 'b3' && !b3Unlocked ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center bg-red-950/20 border border-red-900/40 rounded-lg my-4">
                    <Lock className="w-12 h-12 text-red-500/60 mb-4" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">安全协议触发：防泄密锁定</h3>
                    <p className="text-sm text-red-400/80 mb-6 max-w-md">本帖已被论坛管理系统冻结。继续访问可能需要拥有特殊人员的安全口令。</p>
                    <form className="flex flex-col gap-3 w-64" onSubmit={e => {
                      e.preventDefault();
                      if (attemptPwd.trim().toLowerCase() === 'fswltz') {
                        setB3Unlocked(true);
                        setPwdError('');
                        addFact('oa_url_discovered');
                        addFact('employee_8023_known');
                      } else {
                        setPwdError('口令错误，访问被拒绝。');
                      }
                    }}>
                      <input
                        type="text"
                        placeholder="输入安全口令..."
                        value={attemptPwd}
                        onChange={e => setAttemptPwd(e.target.value)}
                        className="px-4 py-2 bg-zinc-900 border border-red-900/50 rounded text-center text-red-200 outline-none focus:border-red-500 font-mono uppercase"
                      />
                      <button type="submit" className="w-full py-2 bg-red-900/40 hover:bg-red-800/60 text-red-300 font-bold rounded transition-colors text-sm border border-red-900/50">
                        解密档案
                      </button>
                      {pwdError && <p className="text-red-500 text-xs mt-1 font-mono">{pwdError}</p>}
                    </form>
                  </div>
                ) : (
                  currentPost.content
                )}
              </div>

              {/* 回复列表 */}
              {currentPost.replyList.length > 0 && !(currentPost.id === 'b3' && !b3Unlocked) && (
                <div className="divide-y divide-[#2a2a4a]">
                  {currentPost.replyList.map((reply, idx) => (
                    <div key={idx} className={`p-4 ${reply.isMod ? 'bg-yellow-900/10' : ''} ${reply.isDeleted ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium ${reply.isMod ? 'text-yellow-400' : reply.isDeleted ? 'text-gray-600' : 'text-blue-300'
                          }`}>
                          {reply.isMod && '🛡 '}{reply.author}
                        </span>
                        <span className="text-[10px] text-gray-600">{reply.time}</span>
                        <span className="text-[10px] text-gray-700">#{idx + 1}</span>
                      </div>
                      <div className="text-sm text-gray-400 leading-relaxed">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
