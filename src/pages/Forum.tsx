import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Search, MessageSquare, User, Clock, ChevronRight } from 'lucide-react';

const mockPosts = [
  {
    id: 'p4',
    title: '【公告】关于近期论坛违规内容的清理说明',
    author: 'Admin',
    date: '2024-05-20 10:00:00',
    views: 2300,
    replies: 0,
    isSticky: true,
    content: '近期发现部分用户发布关于我院的不实言论，甚至捏造“地下室闹鬼”、“患者失踪”等谣言。本论坛已对相关账号进行封禁处理，请大家理性交流，不信谣不传谣。'
  },
  {
    id: 'p5',
    title: '【寻人】有没有人认识住在B区三楼的李医生？',
    author: '寻找真相',
    date: '2024-05-19 21:05:12',
    views: 890,
    replies: 15,
    content: '我的主治医师李医生上周说要去总院开会，之后就再也联系不上了。问前台总是闪烁其词。他走之前给我开的最后一批药，那个胶囊的颜色和以前不一样，有人遇到过这种情况吗？'
  },
  {
    id: 'p3',
    title: '做完治疗后总是做同一个梦',
    author: '夜行者',
    date: '2024-05-18 02:33:11',
    views: 450,
    replies: 8,
    content: '不知道为什么，做完疗程回来，每天晚上都梦到自己在一个不断下沉的黑色水池里，喘不过气。水里好像还有很多人在挣扎。有人有类似副作用吗？医生说这是正常的神经元重组现象。'
  },
  {
    id: 'p6',
    title: '半夜三点走廊上的声音',
    author: '失眠的猫',
    date: '2024-05-16 03:15:44',
    views: 1250,
    replies: 42,
    content: '我现在正在打字，手都在发抖。刚才去走廊打水，听到墙壁里面有指甲抓挠的声音，还有很微弱的哭声。这不是第一次了，绝对不是下水管道的声音！我要出院，明天就出院！'
  },
  {
    id: 'p2',
    title: '[吐槽] 前台那个女的态度也太差了吧',
    author: '匿名用户',
    date: '2024-05-15 09:12:44',
    views: 892,
    replies: 12,
    content: '那个8023经理嘴里老是叨叨什么“浮生无量”还是“符生无量”的，跟念经一样，还总去地下室烧什么东西，也不知道是不是精神有问题。问她个事爱答不理的，真不知道这种人怎么当上经理的。'
  },
  {
    id: 'p7',
    title: '不要去四楼！！！不要吃红色的药片！！！',
    author: 'X_X',
    date: '2024-05-13 11:11:11',
    views: 404,
    replies: 1,
    content: '他们不是在治病。他们在抽干我们的记忆。如果你看到这条消息，说明防护墙出现了漏洞，赶紧跑。'
  },
  {
    id: 'p1',
    title: '【求助】DNR疗法真的有效吗？',
    author: '新手病友',
    date: '2024-05-12 14:23:05',
    views: 1205,
    replies: 34,
    content: '最近实在睡不着，看到广告说这里的DNR疗法很好，有人做过吗？价格有点贵，想问问真实效果。听说能从根本上重塑潜意识？'
  }
];

export function Forum() {
  const { addClue, addFragment } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<typeof mockPosts[0] | null>(null);
  const [posts, setPosts] = useState(mockPosts);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setPosts(mockPosts);
      return;
    }
    const results = mockPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q)
    );
    setPosts(results);
  };

  const handleReadPost = (post: typeof mockPosts[0]) => {
    setActivePost(post);

    // 触发线索收集
    if (post.id === 'p2') {
      addClue({
        id: 'fswltz',
        title: '前台的口头禅',
        description: '论坛里有人吐槽工号8023的前台经理，说她嘴里老是叨叨“浮生无量”还是“符生无量”，还总去地下室烧东西。'
      });
    }
  };

  return (
    <div className="min-h-full bg-[#e9ecef] p-4 sm:p-8 font-sans text-[#333]">
      <div className="max-w-5xl mx-auto">

        {/* Forum Header */}
        <div className="bg-white shadow-sm border border-[#dee2e6] rounded-t-lg overflow-hidden mb-4">
          <div className="bg-[#4caf50] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <h1 className="text-xl font-bold tracking-wide">安宁社区 - 病友交流论坛</h1>
            </div>
            <div className="text-sm flex items-center gap-4">
              <span>欢迎您，访客</span>
              <button className="hover:underline">登录</button>
              <button className="hover:underline">注册</button>
            </div>
          </div>

          <div className="p-3 bg-[#f8f9fa] border-b border-[#dee2e6] flex justify-between items-center text-sm">
            <div className="flex gap-4 text-[#0056b3]">
              <span className="hover:underline cursor-pointer">论坛首页</span>
              <span>&gt;</span>
              <span className="hover:underline cursor-pointer">就医交流区</span>
              {activePost && (
                <>
                  <span>&gt;</span>
                  <span className="text-[#6c757d]">阅读帖子</span>
                </>
              )}
            </div>

            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子或作者..."
                className="border border-[#ced4da] px-3 py-1 text-sm focus:outline-none focus:border-[#4caf50]"
              />
              <button type="submit" className="bg-[#4caf50] text-white px-3 py-1 hover:bg-[#45a049] transition-colors">
                搜索
              </button>
            </form>
          </div>
        </div>

        {/* Forum Content */}
        {!activePost ? (
          <div className="bg-white shadow-sm border border-[#dee2e6] rounded-b-lg">
            {/* Post List Header */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-[#f8f9fa] border-b border-[#dee2e6] font-bold text-sm text-[#495057]">
              <div className="col-span-7">标题</div>
              <div className="col-span-2 text-center">作者</div>
              <div className="col-span-1 text-center">回复</div>
              <div className="col-span-2 text-right">最后发表</div>
            </div>

            {/* Post List */}
            <div className="divide-y divide-[#dee2e6] bg-white">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-[#6c757d]">未找到相关帖子。</div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="grid grid-cols-12 gap-4 p-3 hover:bg-[#f1f3f5] transition-colors items-center text-sm">
                    <div className="col-span-7 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#4caf50]" />
                      {'isSticky' in post && post.isSticky && <span className="bg-red-500 text-white text-[10px] px-1 rounded-sm border border-red-700 font-bold tracking-wider">置顶</span>}
                      {post.id === 'p7' && <span className="bg-purple-600 text-white text-[10px] px-1 rounded-sm border border-purple-800 font-bold">精</span>}
                      <button
                        onClick={() => handleReadPost(post as typeof mockPosts[0])}
                        className={`text-left font-medium truncate hover:underline ${post.id === 'p7' ? 'text-red-700 animate-pulse' : 'text-[#0056b3] hover:text-[#003d82]'}`}
                      >
                        {post.title}
                      </button>
                    </div>
                    <div className="col-span-2 text-center text-[#6c757d] flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{post.author}</span>
                      </div>
                    </div>
                    <div className="col-span-1 text-center text-[#6c757d]">
                      {post.replies}
                    </div>
                    <div className="col-span-2 text-right text-[#6c757d] text-xs font-mono">
                      {post.date.split(' ')[0]}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Post Detail View */
          <div className="bg-white shadow-sm border border-[#dee2e6] rounded-b-lg animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 border-b border-[#dee2e6] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#343a40]">{activePost.title}</h2>
              <button
                onClick={() => setActivePost(null)}
                className="text-sm text-[#0056b3] hover:underline flex items-center"
              >
                返回列表
              </button>
            </div>

            <div className="flex flex-col sm:flex-row bg-[#e9ecef]">
              {/* User Info Sidebar */}
              <div className="sm:w-48 bg-[#f8f9fa] p-4 border-r border-[#dee2e6] flex flex-col items-center">
                <div className="w-24 h-24 bg-[#e9ecef] border border-[#ced4da] mb-3 flex items-center justify-center relative group overflow-hidden shadow-inner">
                  {activePost.author === 'Admin' ? (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-2xl">A</div>
                  ) : activePost.author === 'X_X' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center text-red-600 font-bold text-2xl crt-overlay terminal-glitch">!</div>
                  ) : (
                    <User className="w-12 h-12 text-[#adb5bd]" />
                  )}
                  {/* Fragment 3: Hidden in anonymous user's avatar */}
                  {activePost.id === 'p2' && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-amber-600 bg-white/80 transition-opacity cursor-pointer shadow-[inset_0_0_10px_rgba(217,119,6,0.5)]"
                      onClick={() => { addFragment(3); alert('你在匿名用户的头像里发现了一枚古铜色的符文碎片。'); }}
                    >
                      符
                    </div>
                  )}
                </div>
                <span className="font-bold text-[#0056b3] text-sm text-center break-all mb-1">{activePost.author}</span>
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${activePost.author === 'Admin' ? 'border-red-300 bg-red-50 text-red-600' :
                    activePost.author === 'X_X' ? 'border-black bg-black text-red-600' :
                      'border-blue-200 bg-blue-50 text-blue-600'
                  }`}>
                  {activePost.author === 'Admin' ? '管理员' :
                    activePost.author === 'X_X' ? 'BANNED' : '初级会员'}
                </span>

                <div className="mt-4 w-full text-[11px] text-[#6c757d] space-y-1 border-t border-[#dee2e6] pt-2">
                  <div className="flex justify-between"><span>帖子:</span><span>{Math.floor(Math.random() * 100) + 1}</span></div>
                  <div className="flex justify-between"><span>积分:</span><span>{Math.floor(Math.random() * 500) + 50}</span></div>
                  <div className="flex justify-between"><span>注册:</span><span>2023-01</span></div>
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-6 flex-1 min-h-[300px]">
                  <div className="text-xs text-[#6c757d] mb-4 flex items-center gap-1 font-mono border-b border-dashed border-[#e9ecef] pb-2">
                    <Clock className="w-3 h-3" />
                    发表于 {activePost.date}
                    <span className="ml-auto text-[#0056b3] hover:underline cursor-pointer">#1楼</span>
                  </div>
                  <div className={`text-[#212529] leading-relaxed whitespace-pre-wrap text-sm sm:text-base ${activePost.id === 'p7' ? 'text-red-600 font-bold terminal-glitch' : ''}`}>
                    {activePost.content}
                  </div>
                </div>
                <div className="border-t border-[#e9ecef] p-3 text-xs flex gap-4 text-[#0056b3] bg-[#f8f9fa]">
                  <span className="flex items-center cursor-pointer hover:underline"><MessageSquare className="w-3 h-3 mr-1" /> 回复</span>
                  <span className="flex items-center cursor-pointer hover:underline text-[#6c757d]">引用</span>
                  <span className="flex items-center cursor-pointer hover:underline text-red-500 ml-auto">举报</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
