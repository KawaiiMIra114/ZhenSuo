import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Search, MessageSquare, User, Clock, ChevronRight } from 'lucide-react';

const mockPosts = [
  {
    id: 'p1',
    title: '【求助】DNR疗法真的有效吗？',
    author: '失眠的猫',
    date: '2024-05-12 14:23:05',
    views: 1205,
    replies: 34,
    content: '最近实在睡不着，看到广告说这里的DNR疗法很好，有人做过吗？价格有点贵，想问问真实效果。'
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
    id: 'p3',
    title: '做完治疗后总是做同一个梦',
    author: '夜行者',
    date: '2024-05-18 02:33:11',
    views: 450,
    replies: 8,
    content: '不知道为什么，做完疗程回来，每天晚上都梦到自己在一个不断下沉的黑色水池里，喘不过气。水里好像还有很多人在挣扎。有人有类似副作用吗？医生说这是正常的神经元重组现象。'
  },
  {
    id: 'p4',
    title: '【公告】关于近期论坛违规内容的清理说明',
    author: 'Admin',
    date: '2024-05-20 10:00:00',
    views: 2300,
    replies: 0,
    content: '近期发现部分用户发布关于我院的不实言论，甚至捏造“地下室闹鬼”、“患者失踪”等谣言。本论坛已对相关账号进行封禁处理，请大家理性交流，不信谣不传谣。'
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
            <div className="divide-y divide-[#dee2e6]">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-[#6c757d]">未找到相关帖子。</div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="grid grid-cols-12 gap-4 p-3 hover:bg-[#f1f3f5] transition-colors items-center text-sm">
                    <div className="col-span-7 flex items-center gap-2">
                      {post.id === 'p4' && <span className="bg-red-500 text-white text-xs px-1 rounded">置顶</span>}
                      <button 
                        onClick={() => handleReadPost(post)}
                        className="text-[#0056b3] hover:text-[#003d82] hover:underline text-left font-medium truncate"
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
            
            <div className="flex flex-col sm:flex-row">
              {/* User Info Sidebar */}
              <div className="sm:w-48 bg-[#f8f9fa] p-4 border-r border-[#dee2e6] flex flex-col items-center">
                <div className="w-20 h-20 bg-[#e9ecef] border border-[#ced4da] mb-2 flex items-center justify-center relative group">
                  <User className="w-10 h-10 text-[#adb5bd]" />
                  {/* Fragment 3: Hidden in anonymous user's avatar */}
                  {activePost.id === 'p2' && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-amber-600 bg-white/80 transition-opacity cursor-pointer"
                      onClick={() => { addFragment(3); alert('你在匿名用户的头像里发现了一枚古铜色的符文碎片。'); }}
                    >
                      符
                    </div>
                  )}
                </div>
                <span className="font-bold text-[#495057] text-sm text-center break-all">{activePost.author}</span>
                <span className="text-xs text-[#6c757d] mt-1">{activePost.id === 'p4' ? '管理员' : '初级会员'}</span>
              </div>
              
              {/* Post Content */}
              <div className="flex-1 p-6">
                <div className="text-xs text-[#6c757d] mb-4 flex items-center gap-1 font-mono border-b border-dashed border-[#dee2e6] pb-2">
                  <Clock className="w-3 h-3" />
                  发表于 {activePost.date}
                </div>
                <div className="text-[#212529] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {activePost.content}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
