import React, { useState, useMemo } from 'react';
import { useGame } from '@/store/GameStore';
import {
    Search, MessageSquare, Eye, Clock, Pin, Lock,
    ChevronRight, LogIn, Shield, AlertTriangle,
    Users, FileText, X, ChevronDown,
} from 'lucide-react';

// ═══════════════════════════════════════════
//  Forum · V4 论坛 — 安宁社区
//  Layer 0: 公开帖  Layer 1: 折叠帖
//  Layer 2: 会员区  Layer 3: 管理员面板
//  Layer 4: 影子档案 (RUNE_03)
// ═══════════════════════════════════════════

interface Post {
    id: string;
    title: string;
    author: string;
    date: string;
    views: number;
    replies: number;
    pinned?: boolean;
    locked?: boolean;
    collapsed?: boolean;
    layer: 0 | 1 | 2 | 3 | 4;
    content: string;
    replyList?: { author: string; date: string; text: string }[];
    password?: string;
    factOnView?: string;
}

const POSTS: Post[] = [
    // ── Layer 0: 公开帖 ──
    {
        id: 'A-1', title: '【公告】安宁社区使用规范', author: '管理员', date: '2023-12-01',
        views: 3847, replies: 0, pinned: true, layer: 0,
        content: '欢迎来到安宁社区！\n\n请遵守以下规范：\n1. 禁止发布未经证实的负面信息\n2. 禁止传播患者隐私信息\n3. 禁止讨论治疗方案的具体参数\n4. 如有疑问请联系诊所前台\n\n违规帖子将被折叠处理。',
    },
    {
        id: 'A-2', title: 'DNR 治疗后的第一个月，分享我的感受', author: '新生的蝴蝶', date: '2024-01-08',
        views: 1256, replies: 3, layer: 0,
        content: '大家好，我是上个月刚结束治疗出院的。\n\n说实话，效果真的很好。以前每天只能睡两三个小时，现在一觉到天亮。\n\n就是……怎么说呢，总觉得有些东西不太一样了。像是看世界的"滤镜"换了一下。\n\n也许是心态变好了吧！总之推荐给有需要的朋友。',
        replyList: [
            { author: '阳光明媚', date: '2024-01-09', text: '恭喜出院！我也准备去咨询了。' },
            { author: '失眠猫咪', date: '2024-01-10', text: '"滤镜"是什么意思啊？详细说说？' },
            { author: '新生的蝴蝶', date: '2024-01-10', text: '就是……嗯，说不上来。大概是好的变化吧。别想太多！' },
        ],
    },
    {
        id: 'A-3', title: '有人知道赵工去哪了吗？', author: '小明同学', date: '2024-02-20',
        views: 89, replies: 2, layer: 0,
        content: '之前在诊所维修电脑认识的赵工（赵启），人挺好的。\n\n上周去找他，前台说他已经离职了？好突然啊……\n\n有他联系方式的朋友麻烦告诉他一声，他帮我修的硬盘我还没拿呢。',
        replyList: [
            { author: '匿名用户', date: '2024-02-21', text: '赵启的工号是 8023，你可以试试发邮件给他。不过……算了。' },
            { author: '管理员', date: '2024-02-21', text: '该员工已离职，相关事务请联系诊所前台处理。' },
        ],
        factOnView: 'employee_8023_known',
    },
    {
        id: 'A-4', title: '求助：家属三个月没联系上怎么办', author: '焦急的丈夫', date: '2024-02-25',
        views: 342, replies: 1, layer: 0,
        content: '我妻子 1 月份入院，到现在快三个月了。\n\n电话打不通，每次去前台都说"治疗中不方便打扰"。\n\n官网查档案说"进展良好"，可是我连人都见不到。\n\n有没有类似情况的家属？是我太焦虑了吗？',
        replyList: [
            { author: '同样焦虑的人', date: '2024-02-26', text: '我跟你一样……已经四个月了。你搜搜"福生无量天尊"，我也是听人说的，不知道有没有用。' },
        ],
    },

    // ── Layer 1: 折叠帖（被管理员折叠但未删除） ──
    {
        id: 'B-1', title: '[已折叠] 关于诊所B2层的异常噪音', author: '前员工007', date: '2024-01-15',
        views: 67, replies: 0, layer: 1, collapsed: true,
        content: '我在诊所做过三个月保洁。\n\n每天凌晨两三点，B2层（就是地下二层）总能听到一种很低沉的嗡嗡声。像是什么大型设备在运转。\n\n可是保洁班长说 B2 层是关闭的仓库，不让下去。\n\n我有次偷偷走到 B2 层的门口，门缝里透出一种绿色的光。还有一股味道——像是……中药？又不太像。更像是烧纸钱的那种味道。\n\n这个帖子大概很快就会被折叠吧。',
    },
    {
        id: 'B-2', title: '[已折叠] 患者回复规律统计', author: '数据分析师', date: '2024-02-01',
        views: 34, replies: 0, layer: 1, collapsed: true,
        content: '我花了两周时间统计了官网上所有"痊愈患者"的回复时间。\n\n你们猜怎么着？\n\n每一条正面评价的回复间隔都是精准的 17 分钟。\n\n不信你们自己去算。\n\n17分钟。一秒不差。\n\n人会这么精确地回复吗？\n\n还是说——这些回复根本不是人写的？',
    },
    {
        id: 'B-3', title: '[已锁定] 给还活着的人', author: '赵启', date: '2024-03-01',
        views: 12, replies: 0, layer: 1, locked: true, password: 'fswltz',
        content: `如果你能看到这段话，说明你输对了密码。

我叫赵启，工号 8023，安宁深眠诊所 IT 维护工程师。

或者说——前 IT 维护工程师。因为当你读到这段话的时候，我大概已经不在了。

我发现了 B2 层的秘密。那里不是什么"仓库"。那里有一台……东西。我不知道该叫它什么。

钟长明叫它"太岁"。

它在吃人。

不是比喻。是真的在吃。DNR 疗法的本质，是把患者的意识抽取出来，灌入那个东西体内。每个"痊愈"出院的患者，他们的身体还在，但里面的那个人——

已经被消化了。

你们看到的那些"满意评价"，那些17分钟准时回复的"康复患者"——都是太岁的触手。它学会了模仿人类的语言和行为。

我把所有证据都藏在了 OA 系统里。登录方式：
账号：8023
密码：就是你打开这个帖子的那个密码

找到维护日志，找到 B2 层的运维报告。

一切都在那里。

如果你有办法阻止它——请这样做。

如果你没有——至少让更多的人知道真相。

——赵启，2024年3月1日
   "福生无量天尊"`,
        factOnView: 'forum_b3_unlocked',
    },

    // ── Layer 2: 会员区（需注册） ──
    {
        id: 'C-1', title: '【家属联络】寻找 LX-044-YIN 的家属', author: '同病相怜', date: '2024-02-18',
        views: 8, replies: 1, layer: 2,
        content: '有没有编号 LX-044 的家属？\n\n我在探视名单上看到这个编号旁边标注了"YIN"，不知道什么意思。\n\n我家人的编号是 MED-0052，如果有同批的家属想联络，可以在下面留言。',
        replyList: [
            { author: '匿名', date: '2024-02-19', text: 'YIN 是"阴"的拼音。你不觉得这个标注很奇怪吗？' },
        ],
    },

    // ── Layer 4: 影子档案 ──
    {
        id: 'S-1', title: '[影子档案] 赵启调查笔记 #1', author: 'zq_backup', date: '2024-02-28',
        views: 1, replies: 0, layer: 4,
        content: `■ 赵启调查笔记 #1 ■

日期：2024-02-15

今天终于拿到了 B2 层的门禁卡。是从赵主任办公室顺来的——他最近开始锁门了，但我知道他把备用卡放在哪。

B2 层比我想象的大得多。至少有三个篮球场那么大的空间。中间放着一台巨大的设备——像是一个倒扣的钟。

它在震动。

墙壁上布满了管线，连接到上面的治疗室。我数了一下，至少 40 根管子。每一根的末端都标注了编号。

我找到了 LX-044-YIN。

管子里流动着某种橙红色的液体。

它在发光。

[记录到此中断]`,
    },
];

export function Forum() {
    const {
        addFact, hasFact, collectRune, hasRune,
        forumLayer, setForumLayer,
    } = useGame();

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Post[] | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [registerCode, setRegisterCode] = useState('');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [showShadowAccess, setShowShadowAccess] = useState(false);
    const [shadowPath, setShadowPath] = useState('');

    // 可见帖子
    const visiblePosts = useMemo(() => {
        return POSTS.filter(p => p.layer <= forumLayer);
    }, [forumLayer]);

    // 搜索
    const handleSearch = () => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) { setSearchResults(null); return; }

        if (q.includes('8023')) addFact('forum_search_8023');
        if (q.includes('福生无量天尊') || q === 'fswltz') addFact('forum_search_fswltz');

        const results = visiblePosts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q) ||
            (p.replyList?.some(r => r.text.toLowerCase().includes(q)))
        );
        setSearchResults(results);
    };

    // 解锁锁定帖
    const handleUnlock = (post: Post) => {
        if (passwordInput.toLowerCase() === post.password) {
            addFact('forum_b3_unlocked');
            addFact('employee_8023_known');
            setSelectedPost({ ...post, locked: false });
            setPasswordInput('');
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

    // 会员注册
    const handleRegister = () => {
        if (registerCode.toUpperCase() === 'LX-044-YIN') {
            setForumLayer(2);
            addFact('forum_member_registered');
            setShowRegister(false);
            setRegisterCode('');
        }
    };

    // 管理员登录
    const handleAdminLogin = () => {
        if (adminUser === 'bbs_admin' && adminPass === 'nj0313') {
            setForumLayer(3);
            addFact('forum_admin_logged_in');
            setShowAdminLogin(false);
        }
    };

    // 影子档案
    const handleShadowAccess = () => {
        if (shadowPath.includes('zq_mirror') || shadowPath.includes('bbs_backup')) {
            setForumLayer(4);
            addFact('forum_found_shadow_path');
            addFact('forum_shadow_accessed');
            if (!hasRune('RUNE_03')) collectRune('RUNE_03');
            setShowShadowAccess(false);
        }
    };

    const displayPosts = searchResults !== null ? searchResults : visiblePosts;

    return (
        <div className="min-h-full bg-[#f5f6fa] text-gray-800">
            {/* ── 论坛头部 ── */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">安宁社区</h1>
                        <p className="text-xs text-gray-400">病友交流 · 经验分享</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 搜索 */}
                        <div className="flex gap-1">
                            <input
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-md w-48 focus:outline-none focus:border-blue-400"
                                placeholder="搜索帖子…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600" onClick={handleSearch}>
                                <Search className="w-3 h-3" />
                            </button>
                        </div>

                        {/* 层级按钮 */}
                        {forumLayer < 2 && (
                            <button
                                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                onClick={() => setShowRegister(true)}
                            >
                                <LogIn className="w-3 h-3" /> 注册会员
                            </button>
                        )}
                        {forumLayer >= 2 && forumLayer < 3 && (
                            <button
                                className="text-xs text-amber-500 hover:underline flex items-center gap-1"
                                onClick={() => setShowAdminLogin(true)}
                            >
                                <Shield className="w-3 h-3" /> 管理面板
                            </button>
                        )}
                        {forumLayer >= 3 && forumLayer < 4 && (
                            <button
                                className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                onClick={() => setShowShadowAccess(true)}
                            >
                                <FileText className="w-3 h-3" /> 影子档案
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-4">
                {searchResults !== null && (
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">搜索结果：{searchResults.length} 条</span>
                        <button className="text-xs text-blue-500 hover:underline" onClick={() => setSearchResults(null)}>清除搜索</button>
                    </div>
                )}

                {/* ── 帖子列表 ── */}
                {!selectedPost ? (
                    <div className="space-y-1">
                        {displayPosts.map(post => (
                            <div
                                key={post.id}
                                className={`flex items-center gap-4 px-4 py-3 bg-white rounded-md border border-gray-100 cursor-pointer
                  hover:shadow-sm transition-all group
                  ${post.collapsed ? 'opacity-50' : ''}
                  ${post.layer === 4 ? 'border-l-2 border-l-red-400' : ''}`}
                                onClick={() => {
                                    if (post.collapsed) {
                                        addFact('forum_b3_expanded');
                                    }
                                    setSelectedPost(post);
                                    if (post.factOnView) addFact(post.factOnView as any);
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {post.pinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
                                        {post.locked && <Lock className="w-3 h-3 text-red-400 shrink-0" />}
                                        {post.collapsed && <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />}
                                        <span className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                                        <span>{post.author}</span>
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-gray-400 shrink-0">
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.replies}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── 帖子详情 ── */
                    <div className="animate-fade-in">
                        <button
                            className="flex items-center gap-1 text-xs text-blue-500 mb-4 hover:underline"
                            onClick={() => { setSelectedPost(null); setPasswordInput(''); setPasswordError(false); }}
                        >
                            ← 返回列表
                        </button>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800">{selectedPost.title}</h2>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span>作者：{selectedPost.author}</span>
                                    <span>{selectedPost.date}</span>
                                    <span>浏览 {selectedPost.views}</span>
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                {selectedPost.locked && !hasFact('forum_b3_unlocked') ? (
                                    <div className="text-center py-8">
                                        <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 mb-4">此帖已被锁定，需要密码查看</p>
                                        <div className="flex justify-center gap-2">
                                            <input
                                                type="text"
                                                className={`px-3 py-2 text-sm border rounded-md w-48 focus:outline-none
                          ${passwordError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'}`}
                                                placeholder="输入密码"
                                                value={passwordInput}
                                                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUnlock(selectedPost)}
                                            />
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                                                onClick={() => handleUnlock(selectedPost)}
                                            >
                                                解锁
                                            </button>
                                        </div>
                                        {passwordError && <p className="text-red-400 text-xs mt-2">密码错误</p>}
                                        <p className="text-[10px] text-gray-300 mt-4">提示：论坛里有人提过一句话……</p>
                                    </div>
                                ) : (
                                    <pre className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed font-sans">
                                        {selectedPost.content}
                                    </pre>
                                )}
                            </div>

                            {/* 回复列表 */}
                            {selectedPost.replyList && (!selectedPost.locked || hasFact('forum_b3_unlocked')) && (
                                <div className="border-t border-gray-100">
                                    <div className="px-6 py-2 text-xs text-gray-400 bg-gray-50">
                                        回复 ({selectedPost.replyList.length})
                                    </div>
                                    {selectedPost.replyList.map((r, i) => (
                                        <div key={i} className="px-6 py-3 border-t border-gray-50 text-sm">
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                                <span className="font-medium text-gray-600">{r.author}</span>
                                                <span>{r.date}</span>
                                            </div>
                                            <p className="text-gray-600">{r.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ── 弹窗：会员注册 ── */}
            {showRegister && (
                <Modal title="会员注册" onClose={() => setShowRegister(false)}>
                    <p className="text-sm text-gray-500 mb-3">输入您的患者编号以验证身份</p>
                    <input
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:border-blue-400"
                        placeholder="患者编号（如：LX-044-YIN）"
                        value={registerCode}
                        onChange={(e) => setRegisterCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    />
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600" onClick={handleRegister}>
                        注册
                    </button>
                </Modal>
            )}

            {/* ── 弹窗：管理员登录 ── */}
            {showAdminLogin && (
                <Modal title="管理员面板" onClose={() => setShowAdminLogin(false)}>
                    <p className="text-sm text-gray-500 mb-3">管理员登录</p>
                    <input
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md mb-2 focus:outline-none focus:border-blue-400"
                        placeholder="管理员账号"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:border-blue-400"
                        placeholder="密码"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    />
                    <button className="w-full py-2 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600" onClick={handleAdminLogin}>
                        登录
                    </button>
                </Modal>
            )}

            {/* ── 弹窗：影子档案 ── */}
            {showShadowAccess && (
                <Modal title="影子档案访问" onClose={() => setShowShadowAccess(false)}>
                    <p className="text-sm text-gray-500 mb-3">输入档案路径</p>
                    <input
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md mb-3 font-mono focus:outline-none focus:border-blue-400"
                        placeholder="/srv/bbs_backup/..."
                        value={shadowPath}
                        onChange={(e) => setShadowPath(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleShadowAccess()}
                    />
                    <button className="w-full py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600" onClick={handleShadowAccess}>
                        访问
                    </button>
                </Modal>
            )}
        </div>
    );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-80 p-5 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <button className="text-gray-400 hover:text-gray-600" onClick={onClose}><X className="w-4 h-4" /></button>
                </div>
                {children}
            </div>
        </div>
    );
}
