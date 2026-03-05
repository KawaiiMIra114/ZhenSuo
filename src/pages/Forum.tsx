import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import {
    Search, MessageCircle, Clock, Eye, AlertTriangle, Lock,
    ChevronDown, ChevronUp, Shield, Users, FileText, Key, UserPlus
} from 'lucide-react';

interface Reply {
    author: string;
    time: string;
    content: React.ReactNode;
    isMod?: boolean;
    isDeleted?: boolean;
}

interface ForumPost {
    id: string;
    category: '康复日志' | '家属交流' | '治疗问答' | '工作人员专区' | '已折叠';
    title: string;
    author: string;
    time: string;
    views: number;
    replies: number;
    isLocked?: boolean;
    isCollapsed?: boolean;
    content: React.ReactNode;
    replyList: Reply[];
}

export function Forum() {
    const { collectRune, hasRune, readHook, forumAccess, setForumAccess, addFact, hasFact } = useGame();

    const [activeTab, setActiveTab] = useState<'posts' | 'member' | 'admin' | 'shadow'>('posts');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [selectedPost, setSelectedPost] = useState<string | null>(null);

    const [registerInput, setRegisterInput] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [adminError, setAdminError] = useState('');

    const [shadowPath, setShadowPath] = useState('');
    const [shadowError, setShadowError] = useState('');

    // 扩展折叠状态
    const [expandedCollapsedPosts, setExpandedCollapsedPosts] = useState<Record<string, boolean>>({});

    const posts: ForumPost[] = [
        {
            id: 'p1',
            category: '康复日志',
            title: '终于能睡着了（第14天疗程结束）',
            author: 'user_2f8a3d',
            time: '2023-09-14 10:25',
            views: 3412,
            replies: 12,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p>失眠七年，尝试了所有方法，</p>
                    <p>在这里治疗了两周，现在能睡6小时了。</p>
                    <p>感谢钟院长和治疗团队。</p>
                    <p>希望更多有需要的人能找到这里。</p>
                </div>
            ),
            replyList: [
                { author: '失眠的夜', time: '09-14 11:05', content: '恭喜！接好运！' },
                { author: '一直在路上', time: '09-14 13:20', content: '请问治疗过程痛苦吗？' },
                { author: 'user_2f8a3d', time: '09-14 14:15', content: '完全没感觉，睡一觉就好了，很神奇。' },
            ],
        },
        {
            id: 'p2',
            category: '家属交流',
            title: '关于探视规定的疑问',
            author: '关心则乱',
            time: '2024-02-15 09:10',
            views: 890,
            replies: 1,
            isLocked: true,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p>我父亲入院三天了，一直说在深度调节期不能探视，电话也打不通，真的很担心，有没有家属有类似经验？</p>
                </div>
            ),
            replyList: [
                {
                    author: 'clinic_service',
                    time: '02-15 09:27',
                    isMod: true,
                    content: '感谢您对治疗过程的关心。DNR深度神经共振疗法在康复关键期确实需要最大限度减少外界信息输入，这是保证疗效的重要条件之一。我们的医护团队会持续监测您家人的各项指标，如有任何变化会第一时间通知您。如有其他疑问，欢迎拨打我们的24小时服务热线。此帖已关闭，如需进一步咨询请通过官方渠道。'
                },
            ],
        },
        {
            id: 'p3',
            category: '治疗问答',
            title: '那个前台总在念叨福生无量天尊',
            author: '患者家属A',
            time: '2024-03-01 15:40',
            views: 521,
            replies: 2,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p>那个工号8023的前台，每次路过都能听到他在小声念叨“福生无量天尊”，这诊所是道教背景的吗？感觉怪怪的。</p>
                </div>
            ),
            replyList: [
                { author: '匿名网友', time: '03-01 16:10', content: '我也听到了，拼音首字母fswltz我都记住了哈哈哈。' },
                { author: 'clinic_service', time: '03-01 16:15', isMod: true, content: '您好，员工的个人信仰自由受保护，并不代表诊所的医学立场。' },
            ],
        },
        {
            id: 'zq_1',
            category: '治疗问答',
            title: '关于地下暖通系统的噪音问题',
            author: 'zq_mnt_8023',
            time: '2024-03-13 23:47',
            views: 76,
            replies: 1,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p>最近值班的时候听到地下有奇怪的声音，</p>
                    <p>不知道是不是暖通系统的问题。</p>
                    <p>有其他工作人员也注意到了吗？</p>
                </div>
            ),
            replyList: [
                {
                    author: 'clinic_service',
                    time: '03-14 08:15',
                    isMod: true,
                    content: '您好，我们的设备维护团队会定期检查，如有需要请通过内部工单系统反馈，感谢您的关注。'
                },
            ],
        },
        {
            id: 'c1',
            category: '已折叠',
            title: '[此内容因包含敏感词汇已被自动折叠]',
            author: '[账号已注销]',
            time: '2024-01-19 14:22',
            views: 0,
            replies: 0,
            isCollapsed: true,
            content: (
                <InvestigateNode hookId="forum_rune_03" runeId="RUNE_03" feedbackText="他一直在暗中保存那些被删掉的声音……赵启发现MED-0019的离职记录那个下午，对比了新闻时间，喝了一瓶啤酒。">
                    <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                        <p>我室友入院第三周被告知需要转介到合作机构进行专项治疗，之后就再也没有消息了。</p>
                        <p>我问过诊所，他们给了我一个合作机构的电话，我打过去，是空号。</p>
                        <p>有没有人有类似经历？</p>
                        <hr className="border-gray-800 my-2" />
                        <p className="text-xs text-gray-500">回复3条：</p>
                        <p className="text-xs text-gray-500">1. user_3b7f: "我理解你说的，我也联系不上我妈，诊所解释说是治疗需要"</p>
                        <p className="text-xs text-gray-500">2. user_9a2e: "建议直接去现场，不要只打电话"</p>
                        <p className="text-xs text-gray-500">3. user_5c1d: "我室友也是，出院后就消失了，诊所说是保护隐私不提供联系方式"</p>
                        <p className="text-amber-500/50 text-xs mt-3">楼主账号注销时间：2024-01-19 16:04（发帖两小时后）</p>
                    </div>
                </InvestigateNode>
            ),
            replyList: [],
        }
    ];

    const memberPosts: ForumPost[] = [
        {
            id: 'm1',
            category: '工作人员专区',
            title: '【重要公告】规范家属联络信息管理',
            author: 'clinic_service',
            time: '2024-01-01 00:00',
            views: 981,
            replies: 0,
            isLocked: true,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p className="text-yellow-400 font-bold">【重要公告】</p>
                    <p>本板块实行严格的信息准确性审核。</p>
                    <p>发布未经核实的信息可能对其他患者家属造成不必要的恐慌，违规内容将被移除处理。</p>
                    <p>请各位保持理性、基于事实的交流。</p>
                    <p className="text-right text-gray-500 mt-4">——安宁深眠患者服务中心</p>
                </div>
            ),
            replyList: [],
        },
        {
            id: 'm2',
            category: '工作人员专区',
            title: '转院相关手续求助',
            author: '家属_119',
            time: '2024-03-05 16:22',
            views: 124,
            replies: 1,
            content: (
                <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                    <p>想问一下转院的具体流程是怎么样的？</p>
                </div>
            ),
            replyList: [
                {
                    author: '家属_204',
                    time: '03-05 17:30',
                    content: (
                        <div>
                            <p className="text-gray-600 bg-gray-900 border-l-2 border-gray-700 p-2 mb-2 text-xs">
                                回复 @[账号已注销]（原帖已删除）：<br />
                                您说的情况我也遇到过，但我相信诊所有自己的处理方式，我们要多给他们一些信任。<br />
                                希望您的家人早日康复。
                            </p>
                            <p>不好意思回复错人了，原帖好像不在了。转院手续直接问前台就行。</p>
                        </div>
                    )
                },
            ],
        }
    ];

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (registerInput.trim().toUpperCase() === 'LX-044-YIN') {
            setForumAccess('member');
            setRegisterError('');
            setActiveTab('member');
            readHook('forum_member_registered');
            addFact('forum_member_registered');
        } else {
            setRegisterError('档案编号无效，请核实后重试。');
        }
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminUser.trim() === 'bbs_admin' && adminPass.trim() === 'nj0313') {
            if (hasFact('oa_maintenance_log_read')) {
                setForumAccess('admin');
                setAdminError('');
                readHook('forum_admin_logged_in');
                addFact('oa_url_discovered'); // 管理员通讯中暴露内网OA地址
                addFact('admin_unlocked'); // V4 §5.6 必须在验证通过后赋予此管理员通行Fact
            } else {
                setAdminError('密码正确，但您的会话状态异常，请重新登录。');
            }
        } else {
            setAdminError('管理员凭证错误。');
        }
    };

    const handleShadowAccess = (e: React.FormEvent) => {
        e.preventDefault();
        if (shadowPath.trim() === '/srv/bbs_backup/zq_mirror_20240101/') {
            setForumAccess('shadow');
            setShadowError('');
            readHook('forum_shadow_accessed');
            addFact('shadow_archive_accessed');
            // If they input this path directly, they also get the rune 03 logic implicitly unlocked
        } else {
            setShadowError('路径无效。');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        setActiveSearch(q);

        // Custom responses based on V4 table
        if (q === '8023') {
            addFact('employee_8023_known');
        }
    };

    // Custom display logic for filtered posts
    let displayedPosts = posts;
    let customSearchMsg = null;

    if (activeTab === 'posts' && activeSearch) {
        if (activeSearch === '8023') {
            displayedPosts = posts.filter(p => p.id === 'zq_1' || p.id === 'p3');
        } else if (activeSearch === '福生无量天尊') {
            displayedPosts = posts.filter(p => p.id === 'p3');
        } else if (activeSearch === '转介' || activeSearch === '合作机构') {
            displayedPosts = [];
            customSearchMsg = "找到0条公开结果。部分相关内容可能已被版主处理。";
        } else if (activeSearch === '失踪') {
            displayedPosts = [];
        } else if (activeSearch === '林晓') {
            displayedPosts = [];
        } else if (activeSearch === '声音' || activeSearch === '气味') {
            displayedPosts = posts.filter(p => p.id === 'zq_1' || p.id === 'c1');
        } else if (activeSearch === 'B2') {
            displayedPosts = [];
            customSearchMsg = "[1条相关内容因包含受限词汇已被自动处理]";
        } else {
            displayedPosts = posts.filter(p =>
                p.title.includes(activeSearch) || p.author.includes(activeSearch) || p.content?.toString().includes(activeSearch)
            );
        }
    } else if (activeTab === 'member' && forumAccess !== 'public') {
        displayedPosts = activeSearch ? memberPosts.filter(p => p.title.includes(activeSearch) || p.author.includes(activeSearch)) : memberPosts;
    }

    const allPosts = [...posts, ...memberPosts];
    const currentPostObj = allPosts.find(p => p.id === selectedPost);

    return (
        <div className="min-h-screen bg-[#f4f5f7] text-gray-800 font-sans">
            <header className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm sticky top-0 z-10 w-full">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-blue-600 tracking-tight">患者互助社区</h1>
                            <p className="text-xs text-gray-500">安宁深眠诊所官方交流平台</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <form className="flex gap-2" onSubmit={handleSearchSubmit}>
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-gray-200">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-sm text-gray-700 py-1 outline-none w-48"
                                    placeholder="搜索帖子/用户..."
                                />
                                <button type="submit">
                                    <Search className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto flex mt-6 gap-6 px-6 pb-20">
                <aside className="w-48 flex-shrink-0">
                    <nav className="space-y-1">
                        <button
                            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'posts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => { setActiveTab('posts'); setSelectedPost(null); setActiveSearch(''); setSearchQuery(''); }}
                        >
                            <MessageCircle className="w-4 h-4 inline-block mr-2" />
                            公开版块
                        </button>

                        {forumAccess === 'public' ? (
                            <button
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100`}
                                onClick={() => { setActiveTab('member'); setSelectedPost(null); }}
                            >
                                <UserPlus className="w-4 h-4 inline-block mr-2 text-gray-400" />
                                会员认证
                            </button>
                        ) : (
                            <button
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'member' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => { setActiveTab('member'); setSelectedPost(null); setActiveSearch(''); setSearchQuery(''); }}
                            >
                                <Users className="w-4 h-4 inline-block mr-2 text-blue-500" />
                                工作人员专区
                            </button>
                        )}

                        {(forumAccess === 'member' || forumAccess === 'admin' || forumAccess === 'shadow') && (
                            <button
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => { setActiveTab('admin'); setSelectedPost(null); }}
                            >
                                <Shield className="w-4 h-4 inline-block mr-2 text-indigo-500" />
                                管理员入口
                            </button>
                        )}

                        {/* Hidden Shadow Access Button - Only visible if known or already accessed */}
                        {(forumAccess === 'admin' || forumAccess === 'shadow') && (
                            <button
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors mt-8 opacity-50 hover:opacity-100 ${activeTab === 'shadow' ? 'bg-zinc-800 text-green-400' : 'text-gray-400 hover:bg-gray-200'}`}
                                onClick={() => { setActiveTab('shadow'); setSelectedPost(null); }}
                            >
                                <Key className="w-4 h-4 inline-block mr-2" />
                                系统存档
                            </button>
                        )}
                    </nav>
                </aside>

                <main className="flex-1 min-w-0">
                    {/* 会员注册 */}
                    {activeTab === 'member' && forumAccess === 'public' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
                            <UserPlus className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">访问受限</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-sm text-center">
                                “工作人员专区/家属交流专版”仅对验证过的特殊身份开放。<br />请输入您的患者档案编号或专属认证码。
                            </p>
                            <form className="flex flex-col gap-4 w-72" onSubmit={handleRegister}>
                                <input
                                    type="text"
                                    placeholder="档案编号 (如: AB-123-CDE)"
                                    value={registerInput}
                                    onChange={e => setRegisterInput(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-center text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                                />
                                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors text-sm shadow-sm">
                                    验证身份
                                </button>
                                {registerError && <p className="text-red-500 text-xs mt-1 text-center font-medium bg-red-50 py-1 rounded">{registerError}</p>}
                            </form>
                        </div>
                    )}

                    {/* 管理员登录 */}
                    {activeTab === 'admin' && forumAccess === 'member' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
                            <Shield className="w-12 h-12 text-indigo-200 mb-4" />
                            <h3 className="text-xl font-bold text-indigo-900 mb-2">管理控制台登录</h3>
                            <p className="text-sm text-gray-500 mb-8 text-center">请使用管理员凭证进行身份验证。</p>
                            <form className="flex flex-col gap-4 w-72" onSubmit={handleAdminLogin}>
                                <input
                                    type="text"
                                    placeholder="用户名"
                                    value={adminUser}
                                    onChange={e => setAdminUser(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                                />
                                <input
                                    type="password"
                                    placeholder="口令"
                                    value={adminPass}
                                    onChange={e => setAdminPass(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                                />
                                <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors text-sm shadow-sm">
                                    进入系统
                                </button>
                                {adminError && <p className="text-red-500 text-xs mt-1 text-center font-medium bg-red-50 py-1 rounded">{adminError}</p>}
                            </form>
                        </div>
                    )}

                    {/* 管理员界面 */}
                    {activeTab === 'admin' && (forumAccess === 'admin' || forumAccess === 'shadow') && (
                        <div className="space-y-6">
                            <div className="bg-indigo-900 rounded-t-lg p-5 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-5 h-5 text-indigo-300" />
                                    <h3 className="font-bold text-lg">管理员控制面板</h3>
                                </div>
                                <p className="text-indigo-300 text-xs">当前会话：bbs_admin | 权限级别：[最高]</p>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-b-lg -mt-10">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2"><FileText className="w-4 h-4 text-indigo-600" /> 系统操作日志</h4>
                                <p className="text-xs text-gray-500 mb-3 font-mono">共计 1,247 条记录（2019-01-01 至 2024-03-19）</p>
                                <p className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 inline-block rounded mb-3">——筛选：2024年3月19日——</p>
                                <div className="space-y-2 text-xs font-mono text-gray-600 bg-gray-50 p-4 rounded border border-gray-200">
                                    <p>22:35 | 帖子ID:7832 | 操作:<span className="text-red-600 font-bold">折叠</span></p>
                                    <p className="pl-6">| 触发词:[失踪] | 操作员:bbs_admin</p>
                                    <p className="pl-6">| 内容摘要:"最近三个月我认识的两个病友都..."[截断]</p>
                                    <p className="mt-2">22:34 | 帖子ID:7831 | 操作:<span className="text-red-600 font-bold">折叠</span></p>
                                    <p className="pl-6">| 触发词:[地下,声音] | 操作员:bbs_admin</p>
                                    <p className="pl-6">| 内容摘要:"我也听到了那个声音，而且不只是..."[截断]</p>
                                    <p className="mt-2">22:31 | 帖子ID:7829 | 操作:<span className="text-red-600 font-bold">折叠</span></p>
                                    <p className="pl-6">| 触发词:[手动操作] | 操作员:bbs_admin</p>
                                    <p className="pl-6 text-gray-900 font-semibold bg-yellow-100 px-1 inline-block">| 内容摘要:"如果有人看到这条，告诉他们B2层..."[截断]</p>
                                    <p className="mt-3 text-red-600">22:30 | 账号:zq_mnt_8023 | 操作:<span className="font-bold bg-red-100 px-1">封禁</span></p>
                                    <p className="pl-6 text-gray-800">| 原因:持续发布违规内容 | 操作员:bbs_admin</p>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-lg">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> 关键词过滤规则</h4>

                                <div className="space-y-4 text-xs">
                                    <div>
                                        <p className="font-semibold text-gray-700 mb-2">[自动折叠] 触发规则列表</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['失踪', '消失', '联系不上', '转介之后', '合作机构电话', '地下声音', '奇怪声音', '暖通噪音', '气味', '线香味', '离职', '辞职申请', '员工去哪了', 'B2', '地下室', '机房'].map(kw => (
                                                <span key={kw} className="px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">{kw}</span>
                                            ))}
                                            <span className="px-2 py-1 text-gray-400">[... 共31条 ...]</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-600 mb-2">[立即通知PR] 严重违规列表</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['媒体', '记者', '曝光', '举报', '律师', '警察', '信访', '投诉', '诉讼'].map(kw => (
                                                <span key={kw} className="px-2 py-1 bg-red-50 text-red-700 rounded border border-red-100">{kw}</span>
                                            ))}
                                            <span className="px-2 py-1 text-gray-400">[... 共12条 ...]</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 mt-4">
                                        <InvestigateNode
                                            hookId="admin_archive_path"
                                            feedbackText="发现异常路径……这不是关键词，是一条被故意遗留的后门路径。"
                                            onReadComplete={() => addFact('shadow_archive_path_found')}
                                        >
                                            <p className="text-gray-400 font-mono text-[10px] select-all cursor-text hover:text-gray-800 transition-colors">[ARCHIVE_PATH: /srv/bbs_backup/zq_mirror_20240101/]</p>
                                        </InvestigateNode>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-lg">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2"><Lock className="w-4 h-4 text-gray-600" /> 被封禁账号视图</h4>
                                <div className="space-y-4">
                                    <div className="border border-red-200 rounded p-4 bg-red-50/30">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-red-700 font-mono font-bold">gh_0314_lx</span>
                                            <span className="text-xs text-gray-500">注册：2023-12-27 | 封禁：2024-01-10 08:47</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-4 bg-white p-2 border border-gray-200 rounded">封禁原因：违规内容 | 操作员：bbs_admin</p>
                                        <p className="text-xs font-semibold text-gray-700 mb-3">历史发帖记录（含系统折叠内容）：</p>
                                        <div className="space-y-4 text-xs text-gray-700">
                                            <div className="pl-3 border-l-2 border-gray-300">
                                                <p className="text-gray-400 mb-1 font-mono">[帖子1 · 2023-12-28 23:14]</p>
                                                <p className="mb-1">"请问有没有人试过DNR疗程？我失眠快四年了，最近看到这家诊所的介绍，感觉和我的情况很像。想听听实际体验，谢谢。"</p>
                                                <p className="text-green-600 text-[10px]">状态：正常 | 回复：6条</p>
                                            </div>
                                            <div className="pl-3 border-l-2 border-gray-300">
                                                <p className="text-gray-400 mb-1 font-mono">[帖子2 · 2024-01-03 01:07]</p>
                                                <p className="mb-1">"预约上了！等了两个月终于排到了，下周去。有点紧张，但更多是期待。希望能好起来。"</p>
                                                <p className="text-green-600 text-[10px]">状态：正常 | 回复：4条（全是祝福）</p>
                                            </div>
                                            <div className="pl-3 border-l-2 border-red-400 bg-red-50/50 -ml-2 p-2 rounded-r">
                                                <p className="text-red-400 mb-1 font-mono">[帖子3 · 2024-01-09 02:34]</p>
                                                <p className="mb-2 text-gray-900 font-medium leading-relaxed">"明天去了。失眠四年，今晚可能是最后一个睡不着的夜晚了。<br />如果有人认识我的话，帮我照顾一下我哥哥，他担心我。"</p>
                                                <p className="text-red-600 text-[10px] mb-1">状态：已折叠（折叠时间：2024-01-10 08:50）</p>
                                                <p className="text-gray-500 text-[10px]">回复：1条——"祝你早日康复。"（回复者账号亦已注销）</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-lg">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">📨 内部通讯记录</h4>
                                <div className="space-y-4 text-xs font-mono">
                                    <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                                        <p className="text-gray-500 mb-3 border-b border-gray-200 pb-2">——2024-01-11 09:23——</p>
                                        <p className="text-gray-600"><span className="font-semibold">发件人：</span>pr_team@tranquil-sleep.com</p>
                                        <p className="text-gray-600 mb-2"><span className="font-semibold">收件人：</span>bbs_admin@tranquil-sleep.com</p>
                                        <p className="font-semibold text-gray-800 mb-3">主题：账号处理请求</p>
                                        <p className="mb-2">bbs_admin，</p>
                                        <p className="mb-2 leading-relaxed text-gray-700">账号 <span className="bg-yellow-100 px-1 font-bold">gh_0314_lx</span> 已于昨日完成入院登记，请按标准流程即刻封禁并清理其全部历史发言，封禁原因填写"违规内容"。</p>
                                        <p className="mb-2 leading-relaxed text-gray-700">相关档案编号 <span className="bg-yellow-100 px-1 font-bold text-red-600">LX-044-YIN</span> 已在后台标注特殊处理序列，请跟进后续内容监控。</p>
                                        <p className="leading-relaxed text-gray-700">王总确认：此类账号处理不需要逐条审批，你有自行判断权，无需回复。</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                                        <p className="text-gray-500 mb-3 border-b border-gray-200 pb-2">——2024-03-14 16:47——</p>
                                        <p className="text-gray-600"><span className="font-semibold">发件人：</span>bbs_admin@tranquil-sleep.com</p>
                                        <p className="text-gray-600 mb-2"><span className="font-semibold">收件人：</span>pr_team@tranquil-sleep.com</p>
                                        <p className="font-semibold text-gray-800 mb-3">主题：RE:本周违规内容处理汇报</p>
                                        <p className="mb-2 text-gray-700">贵部门要求处理的帖子（ID:7821-7824）已完成折叠。</p>
                                        <p className="mb-2 text-gray-700 leading-relaxed">另：关于"声音"和"气味"两个关键词，本月触发频率已达237次，较上月增加约91次。建议贵部门评估是否需要更新设备维护说明，以便向可能询问的员工作出技术性解释。</p>
                                        <p className="mb-4 text-gray-700">此为例行汇报，无需回复。</p>
                                        <p className="text-gray-700">赵</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 影子档案验证 */}
                    {activeTab === 'shadow' && forumAccess === 'admin' && (
                        <div className="bg-black text-green-500 rounded-lg p-12 flex flex-col items-center justify-center font-mono">
                            <Key className="w-12 h-12 text-green-800 mb-6" />
                            <p className="text-sm mb-8 text-center">SYSTEM: PATH REQUIRED TO ACCESS SHADOW MIRROR.</p>
                            <form className="flex flex-col gap-4 w-96" onSubmit={handleShadowAccess}>
                                <input
                                    type="text"
                                    placeholder="[输入完整路径]"
                                    value={shadowPath}
                                    onChange={e => setShadowPath(e.target.value)}
                                    className="px-4 py-3 bg-zinc-900 border border-green-900 rounded-sm text-green-400 outline-none focus:border-green-500 w-full"
                                />
                                <button type="submit" className="border border-green-800 hover:bg-green-900/30 text-green-600 py-2 rounded-sm transition-colors uppercase text-xs">
                                    EXECUTE
                                </button>
                                {shadowError && <p className="text-red-500 text-xs mt-2 text-center">{shadowError}</p>}
                            </form>
                        </div>
                    )}

                    {/* 影子档案内容 */}
                    {activeTab === 'shadow' && forumAccess === 'shadow' && (
                        <div className="bg-black text-green-500 rounded-lg p-8 min-h-[600px] font-mono shadow-2xl border border-green-900/40">
                            <div className="mb-8 border-b border-green-900/50 pb-4">
                                <p className="text-green-300 font-bold mb-2">/srv/bbs_backup/zq_mirror_20240101/</p>
                                <p className="text-green-600 text-sm">建立时间：2024-01-01 00:00:01</p>
                                <p className="text-green-600 text-sm">建立人：MNT-8023</p>
                                <div className="mt-4 p-3 bg-green-950/20 border border-green-900/30 rounded text-xs text-green-600/80 leading-relaxed max-w-2xl">
                                    说明：此目录为非标准备份，不在常规维护计划内。<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如发现此目录，你大概知道该怎么做。
                                </div>
                            </div>

                            <div className="grid grid-cols-[200px_1fr] gap-8">
                                <div className="border-r border-green-900/30 pr-4 text-sm">
                                    <p className="text-green-400 mb-4 font-bold border-b border-green-900/50 pb-2">目录结构</p>
                                    <ul className="space-y-3">
                                        <li className="text-green-700 flex justify-between group cursor-default">
                                            <span>/deleted_posts/</span>
                                            <span className="text-xs">[1,247个文件]</span>
                                        </li>
                                        <li className="text-green-700 flex justify-between group cursor-default">
                                            <span>/banned_accounts/</span>
                                            <span className="text-xs">[89个文件]</span>
                                        </li>
                                        <li className="pt-4">
                                            <button
                                                className={`w-full text-left flex items-center hover:text-green-300 transition-colors ${selectedPost === 'shadow_readme' ? 'text-green-300 bg-green-900/20 px-2 py-1 rounded' : ''}`}
                                                onClick={() => setSelectedPost('shadow_readme')}
                                            >
                                                /README.txt
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left flex items-center hover:text-green-300 transition-colors ${selectedPost === 'shadow_7829' ? 'text-green-300 bg-green-900/20 px-2 py-1 rounded' : ''}`}
                                                onClick={() => setSelectedPost('shadow_7829')}
                                            >
                                                /post_7829_complete.txt
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pl-4 h-full">
                                    {!selectedPost && (
                                        <div className="h-full flex items-center justify-center opacity-30">
                                            <p>Select a file to view contents</p>
                                        </div>
                                    )}

                                    {selectedPost === 'shadow_readme' && (
                                        <div className="animate-pulse-fast">
                                            <p className="text-green-300 font-bold mb-4 border-b border-green-900/50 pb-2 inline-block">README.txt</p>
                                            <div className="text-green-500/90 text-sm leading-8 tracking-wide max-w-xl">
                                                <p>如果你找到了这里，说明你足够认真。</p>
                                                <p className="mt-4">这里存的是所有被处理掉的内容，</p>
                                                <p>从我开始怀疑的那天（2024-01-01）到今天。</p>
                                                <p className="mt-4">我不知道今天是哪天，</p>
                                                <p>因为我在写这个README的时候还不知道</p>
                                                <p>它会被读到的时候是什么时候。</p>
                                                <p className="mt-4">那些被删掉的声音，都在/deleted_posts/里。</p>
                                                <p>我试着让它们不要消失。</p>
                                                <p className="mt-4">/banned_accounts/里有一个叫 <span className="text-white bg-black px-1 font-bold">gh_0314_lx</span> 的档案。</p>
                                                <p>去看看她说过什么。</p>
                                                <p className="mt-4">最重要的一个文件在这里：</p>
                                                <p className="mt-2 text-green-300">post_7829_complete.txt</p>
                                                <p className="mt-8 text-right">—赵启</p>

                                                {/* MNT RUNE 07 BACKUP — 滚动至底部发现 */}
                                                <InvestigateNode hookId="shadow_readme_rune07" runeId="RUNE_07" feedbackText="他在最深的角落，用最平凡的话告别了最重要的人。">
                                                    <div className="mt-32 pt-12 border-t border-green-950 text-xs text-green-800 opacity-20 hover:opacity-100 transition-opacity duration-[3000ms] cursor-default">
                                                        <p>妈，你不用担心我。</p>
                                                        <p className="mt-2">我在处理一件事，处理完就回来。</p>
                                                        <p className="mt-2">家里那台空调过滤网该换了，你别自己爬上去换，</p>
                                                        <p>等我回去换。</p>
                                                        <p className="mt-4 text-right">—赵启</p>
                                                    </div>
                                                </InvestigateNode>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPost === 'shadow_7829' && (
                                        <InvestigateNode hookId="forum_rune_07" feedbackText="赵启用最普通的话讲出了最危险的真相……他在最后时刻仍然没有放弃希望。">
                                            <div className="animate-pulse-fast">
                                                <p className="text-green-300 font-bold mb-4 border-b border-green-900/50 pb-2 inline-block">post_7829_complete.txt</p>
                                                <div className="bg-green-950/20 p-4 border border-green-900/30 rounded mb-6 text-sm text-green-600">
                                                    <p>帖子ID: 7829</p>
                                                    <p>发帖时间：2024-03-19 22:31:47</p>
                                                    <p>发帖人：zq_mnt_8023</p>
                                                    <p className="text-green-500/70 mt-1">状态：已折叠（折叠时间：22:31:52）</p>
                                                    <p className="text-green-700 font-mono text-xs mt-1 ml-10">[5秒后被系统接收并处理]</p>
                                                </div>
                                                <p className="text-green-400 font-bold mb-4">完整内容：</p>
                                                <div className="text-green-300 text-base leading-8 tracking-wide max-w-xl bg-black border-l-2 border-green-500 pl-4 py-2 shadow-[inset_0_0_20px_rgba(0,255,0,0.05)]">
                                                    <p>如果有人看到这条，告诉他们B2层不是服务器机房。</p>
                                                    <p className="mt-6 font-bold text-white shadow-green-500 drop-shadow-md">我不知道我今天能不能走出去。</p>
                                                    <p className="mt-6">我在三个地方藏了东西。</p>
                                                    <p>OA里，林医生的专栏里，还有这个路径。</p>
                                                    <p>找到它们，把它们拼在一起。</p>
                                                    <p className="mt-8">赵启</p>
                                                </div>
                                            </div>
                                        </InvestigateNode>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 帖子列表视图（公开/会员共有） */}
                    {!selectedPost && (activeTab === 'posts' || (activeTab === 'member' && forumAccess !== 'public')) && (
                        <div>
                            {customSearchMsg && (
                                <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-md mb-4 text-sm flex items-center gap-2 border border-orange-200 shadow-sm">
                                    <AlertTriangle className="w-4 h-4" />
                                    {customSearchMsg}
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 py-3 px-6">
                                    <div className="flex-[3]">帖子标题</div>
                                    <div className="flex-1">板块</div>
                                    <div className="flex-1">作者</div>
                                    <div className="w-24 text-right">互动</div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {displayedPosts.length === 0 ? (
                                        <div className="py-12 text-center text-gray-400 text-sm">
                                            暂无相关帖子
                                        </div>
                                    ) : (
                                        displayedPosts.map(post => (
                                            <div key={post.id} className="hover:bg-blue-50/30 transition-colors">
                                                {post.isCollapsed ? (
                                                    <div className="px-6 py-4 flex flex-col justify-center">
                                                        <button
                                                            className="text-left flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors w-full p-2 rounded -ml-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setExpandedCollapsedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                                                            }}
                                                        >
                                                            {expandedCollapsedPosts[post.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                            <span className="text-sm border border-gray-300 px-2 py-0.5 rounded bg-gray-50">{post.title}</span>
                                                            <span className="text-xs ml-auto">本内容需要手动展开</span>
                                                        </button>
                                                        {expandedCollapsedPosts[post.id] && (
                                                            <div
                                                                className="mt-3 ml-6 pl-4 border-l-2 border-red-200 cursor-pointer hover:bg-red-50/50 p-2 rounded transition-colors"
                                                                onClick={() => setSelectedPost(post.id)}
                                                            >
                                                                <p className="text-xs text-red-500/70 uppercase tracking-widest mb-1 font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Vio_Content_Detected</p>
                                                                <p className="text-sm text-gray-600 line-clamp-2">点击查看被折叠内容的完整备份记录……</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex items-center px-6 py-4 cursor-pointer"
                                                        onClick={() => setSelectedPost(post.id)}
                                                    >
                                                        <div className="flex-[3] flex items-center gap-2 pr-4">
                                                            {post.isLocked && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                                                            <span className={`text-sm font-medium leading-snug ${post.isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
                                                                {post.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
                                                                {post.category}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm text-blue-600">{post.author}</div>
                                                            <div className="text-xs text-gray-400 mt-0.5">{post.time.split(' ')[0]}</div>
                                                        </div>
                                                        <div className="w-24 text-right text-xs text-gray-400 flex flex-col items-end justify-center gap-1">
                                                            <span className="flex items-center gap-1.5" title="回复"><MessageCircle className="w-3.5 h-3.5" />{post.replies}</span>
                                                            <span className="flex items-center gap-1.5" title="浏览"><Eye className="w-3.5 h-3.5" />{post.views > 999 ? (post.views / 1000).toFixed(1) + 'k' : post.views}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 帖子详情视图 */}
                    {selectedPost && currentPostObj && (activeTab === 'posts' || activeTab === 'member') && (
                        <div>
                            <button
                                className="text-sm text-blue-600 font-medium mb-4 flex items-center gap-1 hover:text-blue-800 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
                                onClick={() => setSelectedPost(null)}
                            >
                                ← 返回帖子列表
                            </button>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 relative">
                                    {currentPostObj.isLocked && (
                                        <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 px-4 py-1.5 rounded-bl-lg text-xs font-medium flex items-center gap-1 border-b border-l border-gray-200">
                                            <Lock className="w-3 h-3" /> 此帖已被锁定
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pr-16">{currentPostObj.title}</h2>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-8 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                {currentPostObj.author[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-blue-700 font-medium">{currentPostObj.author}</span>
                                                <span>楼主</span>
                                            </div>
                                        </div>
                                        <div className="ml-auto flex items-center gap-4 text-gray-400">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />发行: {currentPostObj.time}</span>
                                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />浏览: {currentPostObj.views}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-sm prose-gray max-w-none text-gray-800">
                                        {currentPostObj.content}
                                    </div>
                                </div>

                                {currentPostObj.replyList.length > 0 && (
                                    <div className="bg-gray-50 divide-y divide-gray-200">
                                        {currentPostObj.replyList.map((reply, idx) => (
                                            <div key={idx} className={`p-6 flex flex-col ${reply.isMod ? 'bg-blue-50/50' : ''}`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${reply.isMod ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                        {reply.isMod ? '官' : reply.author[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-semibold ${reply.isMod ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                {reply.author}
                                                            </span>
                                                            {reply.isMod && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-blue-200">官方认证</span>}
                                                        </div>
                                                        <span className="text-[11px] text-gray-400">{reply.time}</span>
                                                    </div>
                                                    <div className="ml-auto text-xs text-gray-400 font-medium">#{idx + 1}</div>
                                                </div>
                                                <div className={`text-sm pl-11 max-w-3xl ${reply.isMod ? 'text-gray-800' : 'text-gray-700'} leading-relaxed`}>
                                                    {reply.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
