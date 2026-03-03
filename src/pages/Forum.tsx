import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { Search, MessageCircle, Clock, Eye, AlertTriangle, Lock, ChevronDown, ChevronUp } from 'lucide-react';

// ═══════════════════════════════════════════
//  Forum · V3 灰区 · 安宁社区病友交流论坛
//  B-1~B-3 三帖体系 + 搜索 + RUNE_03
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
}

export function Forum() {
  const { collectRune, hasRune, readHook, linXiaoSignalStrength } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [expandedB3, setExpandedB3] = useState(false);

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
      content: (
        <InvestigateNode hookId="forum_b3_unlock" runeId="RUNE_03" feedbackText="这个帖子……被人刻意隐藏了。">
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-red-400 font-mono text-xs">// 以下内容由缓存恢复，原帖已被管理员于 2024-03-12 00:03 永久删除</p>
            <p className="text-gray-400">我知道这个帖子很快就会被删。但我还是要说。</p>
            <p className="text-gray-400">B2层不是什么"治疗室"。那些所谓的"液冷机柜"里面——</p>
            <p className="text-red-400/80 font-bold">装的不是服务器。是人。</p>
            <p className="text-gray-500">每个舱体里都有一个人，身上插满了管子和传感器。他们还活着，但已经不是"活着"了。</p>
            <p className="text-gray-500">如果你解码他们实时上传的EEG数据包，你会发现那些波形不是脑电波——</p>
            <p className="text-gray-500">那是<strong className="text-amber-400">哭声</strong>。</p>
            <p className="text-red-500/40 font-mono text-xs mt-4">
              [原帖作者 IP: 10.0.77.*** | 内网发布]<br />
              [管理员操作日志: 删帖+封禁+IP溯源 | 耗时: 5分钟]
            </p>
          </div>
        </InvestigateNode>
      ),
      replyList: [],
    },
  ];

  // 搜索过滤
  const filteredPosts = searchQuery.trim()
    ? posts.filter(p =>
      p.title.includes(searchQuery) ||
      p.author.includes(searchQuery) ||
      (searchQuery === '8023' && p.id === 'b2') ||
      (searchQuery.includes('前台') && p.id === 'b2')
    )
    : posts;

  const currentPost = posts.find(p => p.id === selectedPost);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-200">
      {/* 论坛头部 */}
      <header className="bg-[#16213e] border-b border-[#2a2a4a] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-blue-300">安宁社区</h1>
            <p className="text-xs text-gray-500">病友交流 · 康复分享 · 互助互爱</p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setSelectedPost(null); }}>
            <div className="flex items-center bg-[#2a2a4a] rounded-lg px-3 gap-2">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-gray-300 py-1.5 outline-none w-48"
                placeholder="搜索帖子……"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-6">
        {/* ===== 帖子列表 ===== */}
        {!selectedPost && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <MessageCircle className="w-4 h-4" /> 全部帖子 ({filteredPosts.length})
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
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${post.tag === '求助' ? 'bg-orange-900/40 text-orange-300' : 'bg-blue-900/40 text-blue-300'
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
                {currentPost.content}
              </div>

              {/* 回复列表 */}
              {currentPost.replyList.length > 0 && (
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
