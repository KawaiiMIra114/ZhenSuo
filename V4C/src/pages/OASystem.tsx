import React, { useState, useRef } from 'react';
import { useGame } from '@/store/GameStore';
import {
    Lock, Shield, FileText, Camera, Terminal,
    ChevronRight, AlertTriangle, Database,
    Users, Clipboard, HardDrive, CornerDownRight,
} from 'lucide-react';

// ═══════════════════════════════════════════
//  OASystem · V4 OA 系统 (TRANQUIL-OS)
//  登录拦截 → 采购 / HR / 维护日志 / B2报告
//  图像档案 / 系统终端
//  RUNE_05: 维护日志底部
// ═══════════════════════════════════════════

type OASection = 'dashboard' | 'purchase' | 'hr' | 'maintenance' | 'b2report' | 'photos' | 'terminal';

export function OASystem() {
    const {
        addFact, hasFact, collectRune, hasRune,
        isOALoggedIn, setOALoggedIn, setView,
    } = useGame();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [section, setSection] = useState<OASection>('dashboard');
    const [b2Code, setB2Code] = useState('');
    const [b2Unlocked, setB2Unlocked] = useState(false);

    // OA 登录
    const handleLogin = () => {
        // 前置条件：必须先知道赵启工号
        if (!hasFact('employee_8023_known')) {
            setLoginError('您没有权限访问该系统。');
            return;
        }
        if (userId === '8023' && password === 'fswltz') {
            setOALoggedIn(true);
            addFact('oa_logged_in');
            setLoginError('');
        } else {
            setLoginError('员工编号或密码错误');
        }
    };

    // B2 验证码
    const handleB2Unlock = () => {
        if (b2Code === 'mnt8023_zq') {
            setB2Unlocked(true);
            addFact('oa_b2_report_read');
        }
    };

    if (!isOALoggedIn) {
        return (
            <div className="min-h-full bg-[#000a00] flex items-center justify-center terminal-mode">
                <div className="w-96 space-y-6">
                    <div className="text-center">
                        <pre className="text-xs leading-tight mb-4">
                            {`
 ████████╗██████╗  █████╗ ███╗   ██╗ ██████╗ 
 ╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔═══██╗
    ██║   ██████╔╝███████║██╔██╗ ██║██║   ██║
    ██║   ██╔══██╗██╔══██║██║╚██╗██║██║▄▄ ██║
    ██║   ██║  ██║██║  ██║██║ ╚████║╚██████╔╝
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══▀▀═╝
`}
                        </pre>
                        <div className="text-sm mb-6">TRANQUIL-OS INTRANET v2.1.4</div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs mb-1 block opacity-60">EMPLOYEE ID</label>
                            <input
                                className="w-full px-3 py-2 text-sm rounded"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Employee ID"
                            />
                        </div>
                        <div>
                            <label className="text-xs mb-1 block opacity-60">PASSWORD</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 text-sm rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="Password"
                            />
                        </div>
                        <button
                            className="w-full py-2 border border-current rounded text-sm hover:bg-green-900/30 transition-colors"
                            onClick={handleLogin}
                        >
                            LOGIN
                        </button>
                        {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex terminal-mode">
            {/* 侧边栏 */}
            <nav className="w-52 border-r border-green-900/30 p-3 space-y-1 shrink-0">
                <div className="text-xs opacity-50 mb-3 pb-2 border-b border-green-900/30">
                    EMPLOYEE: 赵启 (8023)
                </div>
                {[
                    { id: 'dashboard' as OASection, label: '仪表盘', icon: <Database className="w-3.5 h-3.5" /> },
                    { id: 'purchase' as OASection, label: '采购审批', icon: <Clipboard className="w-3.5 h-3.5" /> },
                    { id: 'hr' as OASection, label: '人事档案', icon: <Users className="w-3.5 h-3.5" /> },
                    { id: 'maintenance' as OASection, label: '维护日志', icon: <FileText className="w-3.5 h-3.5" /> },
                    { id: 'b2report' as OASection, label: 'B2 运维报告', icon: <HardDrive className="w-3.5 h-3.5" /> },
                    { id: 'photos' as OASection, label: '图像档案', icon: <Camera className="w-3.5 h-3.5" /> },
                    { id: 'terminal' as OASection, label: '系统终端', icon: <Terminal className="w-3.5 h-3.5" /> },
                ].map(item => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors
              ${section === item.id ? 'bg-green-900/40 text-green-300' : 'text-green-700 hover:bg-green-900/20'}`}
                        onClick={() => {
                            setSection(item.id);
                            if (item.id === 'purchase') addFact('oa_purchase_read');
                            if (item.id === 'hr') addFact('oa_hr_read');
                            if (item.id === 'maintenance') addFact('oa_maintenance_log_read');
                            if (item.id === 'photos') addFact('oa_photo_viewed');
                        }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* 内容区 */}
            <main className="flex-1 p-6 overflow-auto text-sm">
                {section === 'dashboard' && <DashboardSection />}
                {section === 'purchase' && <PurchaseSection />}
                {section === 'hr' && <HRSection />}
                {section === 'maintenance' && <MaintenanceSection />}
                {section === 'b2report' && (
                    b2Unlocked ? <B2ReportSection /> : (
                        <div className="space-y-4">
                            <h2 className="text-base font-bold">B2 运维报告</h2>
                            <p className="text-green-700 text-xs">需要维护人员验证码方可访问</p>
                            <div className="flex gap-2">
                                <input
                                    className="px-3 py-2 text-xs rounded w-60"
                                    placeholder="验证码"
                                    value={b2Code}
                                    onChange={(e) => setB2Code(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleB2Unlock()}
                                />
                                <button className="px-4 py-2 border border-current rounded text-xs hover:bg-green-900/30" onClick={handleB2Unlock}>
                                    验证
                                </button>
                            </div>
                        </div>
                    )
                )}
                {section === 'photos' && <PhotosSection />}
                {section === 'terminal' && <TerminalSection />}
            </main>
        </div>
    );
}

// ═══════════════════════════════════════════
//  OA 子组件
// ═══════════════════════════════════════════

function DashboardSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">TRANQUIL-OS 仪表盘</h2>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: '在院患者', value: '47', trend: '+3' },
                    { label: 'DNR 活跃疗程', value: '32', trend: '+5' },
                    { label: '太岁活性节点', value: '19,847', trend: '+2,103' },
                ].map(item => (
                    <div key={item.label} className="p-4 border border-green-900/30 rounded-lg">
                        <div className="text-xs text-green-700">{item.label}</div>
                        <div className="text-2xl font-bold mt-1">{item.value}</div>
                        <div className="text-[10px] text-green-600 mt-1">{item.trend} 本周</div>
                    </div>
                ))}
            </div>
            <div className="p-3 border border-amber-800/40 rounded-lg text-amber-400 text-xs">
                ⚠ 系统提醒：B2 层能耗持续上升，已超出安全阈值 23%。请相关人员注意。
            </div>
        </div>
    );
}

function PurchaseSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">采购审批记录</h2>
            <table className="w-full text-xs">
                <thead><tr className="border-b border-green-900/40">
                    <th className="text-left py-2 text-green-700">日期</th>
                    <th className="text-left py-2 text-green-700">品目</th>
                    <th className="text-left py-2 text-green-700">数量</th>
                    <th className="text-left py-2 text-green-700">审批人</th>
                    <th className="text-left py-2 text-green-700">备注</th>
                </tr></thead>
                <tbody className="divide-y divide-green-900/20">
                    {[
                        ['2024-01-10', '枣木板', '200 块', '钟长明', '用于B2层设备改造'],
                        ['2024-01-10', '朱砂', '50 kg', '钟长明', '高纯度，勿混杂'],
                        ['2024-01-10', '黑山羊血', '200 L', '钟长明', '新鲜采集，72小时内送达'],
                        ['2024-01-15', '铜缆', '3000 m', '赵启', '神经信号传输线路'],
                        ['2024-01-20', '生理盐水', '500 袋', '林雨桐', '标准采购'],
                        ['2024-02-01', '黄纸', '10000 张', '钟长明', '特殊规格'],
                        ['2024-02-05', '电磁屏蔽涂层', '120 L', '赵启', 'B2层墙面'],
                        ['2024-02-10', '活体运输箱', '10 个', '钟长明', '恒温恒湿'],
                    ].map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => <td key={j} className="py-2 pr-4">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function HRSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">人事档案</h2>
            <div className="space-y-3">
                {[
                    { name: '钟长明', role: '院长 / 首席研究员', status: '在职', note: 'MIT 博士 · 创始人' },
                    { name: '林雨桐', role: '首席治疗师', status: '在职', note: '临床心理学+中医双学位' },
                    { name: '赵启', role: 'IT 维护工程师', status: '已注销', note: '最后出勤：2024-03-01 · 原因：[记录已清除]' },
                ].map(p => (
                    <div key={p.name} className="p-3 border border-green-900/30 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="font-bold">{p.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${p.status === '在职' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                                {p.status}
                            </span>
                        </div>
                        <div className="text-green-700 text-xs mt-1">{p.role}</div>
                        <div className="text-green-900 text-[10px] mt-1">{p.note}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MaintenanceSection() {
    const { collectRune, hasRune, addFact } = useGame();

    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">维护日志</h2>
            <div className="space-y-3 text-xs leading-relaxed">
                {[
                    { date: '2024-02-25', text: 'B2 层第三号管线出现微裂纹，已修补。液体流量恢复正常。' },
                    { date: '2024-02-20', text: '更换 A 区 6 号治疗舱的传感器组件。注意：安装时患者意识指标出现短暂波动（约 3 秒），已恢复。' },
                    { date: '2024-02-15', text: '例行巡检。B2 层中央设备振动频率较上周增加 7%。原因未知。向院长汇报后被告知"正常"。' },
                    { date: '2024-02-10', text: '发现 B2 层东侧墙壁出现异常凝结物，呈暗红色，质地粘稠。采样送检被拒——院长说"不需要检验"。' },
                    { date: '2024-02-05', text: '夜间巡检时，B2 层的嗡鸣声突然增大。持续约 15 分钟后恢复。同一时间，三楼有两名患者的心率同步升高。' },
                    { date: '2024-01-28', text: '安装新的电磁屏蔽涂层。施工期间需要关闭 B2 层 2 小时。关闭期间——所有患者的脑电波都归零了。' },
                    { date: '2024-01-20', text: '患者 LX-044-YIN 的管线连接出现松动。重新固定后，管线内液体颜色从橙红变为深紫。' },
                ].map(log => (
                    <div key={log.date} className="p-3 border border-green-900/20 rounded">
                        <span className="text-green-700">[{log.date}]</span> {log.text}
                    </div>
                ))}
            </div>

            {/* RUNE_05 触发 */}
            <div
                className="p-3 border border-amber-800/40 rounded cursor-pointer hover:bg-amber-900/10 transition-colors"
                onClick={() => {
                    if (!hasRune('RUNE_05')) {
                        collectRune('RUNE_05');
                        addFact('oa_maintenance_log_read');
                    }
                }}
            >
                <span className="text-amber-500">[2024-03-01 · 最后一条]</span>
                <p className="mt-1 text-amber-400/80">
                    如果有人看到这条日志——我把赵启记事本的内容藏在了图像档案里那张机柜照片的元数据中。
                    <br />
                    密码后半段是：<span className="font-bold">JiuKu</span>
                    <br />
                    前半段在林主任的专栏标题里。你需要把它们拼起来。
                    <br />
                    <span className="text-[10px] text-amber-800">——赵启，写于最后一个上班日</span>
                </p>
                {hasRune('RUNE_05') && (
                    <div className="text-amber-600/50 text-[10px] mt-2">☰ 碎片已记录 · 进入B2层</div>
                )}
            </div>
        </div>
    );
}

function B2ReportSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">B2 层运维报告</h2>
            <div className="p-4 border border-red-800/40 rounded-lg text-xs leading-relaxed">
                <div className="text-red-400 font-bold mb-2">■ 机密 · 仅限授权人员查阅 ■</div>
                <p>
                    <strong>太岁核心状态：</strong>活跃<br />
                    <strong>当前节点数：</strong>19,847（较上月 +2,103）<br />
                    <strong>意识体密度：</strong>超临界<br />
                    <strong>共振哈希值：</strong>0xDEAD_BEEF_044<br />
                </p>
                <hr className="border-green-900/20 my-3" />
                <p>
                    <strong>分析：</strong>太岁的节点增长速度已超出预期模型的 340%。
                    每新增一名 DNR 疗程患者，太岁的活性节点就会增加约 200-300 个。
                    这些节点的行为模式与被提取的患者意识高度吻合。
                </p>
                <p className="mt-2">
                    <strong>结论：</strong>DNR 疗法的本质不是"神经重置"。
                    它是一条单向管道——将患者的意识从身体中抽取，通过 B2 层的管线系统，
                    注入太岁的菌丝体网络。
                </p>
                <p className="mt-2">
                    所谓"痊愈"的患者，他们的身体仍然在运作。
                    但里面的那个人——那个真正的"他们"——已经成为太岁的一部分。
                </p>
                <p className="mt-2 text-red-500">
                    永远不会回来了。
                </p>
            </div>
        </div>
    );
}

function PhotosSection() {
    const { addFact, collectRune, hasRune } = useGame();

    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold">图像档案</h2>
            <div className="grid grid-cols-2 gap-3">
                <div
                    className="p-4 border border-green-900/30 rounded-lg cursor-pointer hover:bg-green-900/10 transition-colors"
                    onClick={() => {
                        addFact('oa_photo_jiuku');
                        addFact('password_jiuku_found');
                    }}
                >
                    <div className="text-4xl mb-2 text-center">📸</div>
                    <div className="text-xs text-green-700 text-center">B2_机柜_20240228.jpg</div>
                    <div className="text-[10px] text-green-900 mt-2 text-center">
                        EXIF 备注：<span className="font-mono text-amber-400">JiuKu</span>
                    </div>
                </div>
                <div className="p-4 border border-green-900/30 rounded-lg">
                    <div className="text-4xl mb-2 text-center">📸</div>
                    <div className="text-xs text-green-700 text-center">太岁_全貌_20240301.jpg</div>
                    <div className="text-[10px] text-green-900 mt-2 text-center">
                        巨大的肉色菌体，表面覆盖管线网络
                    </div>
                </div>
            </div>
        </div>
    );
}

function TerminalSection() {
    const { collectedRunes, runeCount, setView, addFact } = useGame();
    const [lines, setLines] = useState<string[]>(['TRANQUIL-OS Terminal v2.1.4', '输入 HELP 查看命令列表', '']);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const execCommand = (cmd: string) => {
        const upper = cmd.trim().toUpperCase();
        let output: string[] = [];

        switch (upper) {
            case 'HELP':
                output = ['可用命令:', '  HELP     - 帮助', '  STATUS   - 系统状态', '  RUNES    - 碎片状态', '  OVERRIDE - 覆写指令', '  CLEAR    - 清屏'];
                break;
            case 'STATUS':
                output = ['系统状态: 运行中', '太岁活性节点: 19,847', 'B2 层能耗: 178% (超限)', '活跃疗程: 32'];
                break;
            case 'RUNES':
                output = [
                    `碎片收集进度: ${runeCount}/7`,
                    ...(['RUNE_01', 'RUNE_02', 'RUNE_03', 'RUNE_04', 'RUNE_05', 'RUNE_06', 'RUNE_07'] as const).map(
                        r => `  ${collectedRunes.includes(r) ? '■' : '□'} ${r}`
                    ),
                ];
                break;
            case 'OVERRIDE':
                if (runeCount >= 7) {
                    output = ['正在执行覆写指令...', '七碎片验证通过。', '连接 B2 核心节点...', '即将进入终局选择界面。'];
                    addFact('ending_reached');
                    setTimeout(() => setView('ending'), 2000);
                } else {
                    output = [`错误: 碎片不足 (${runeCount}/7)`, '需要收集全部 7 枚碎片方可执行覆写。'];
                }
                break;
            case 'CLEAR':
                setLines(['']);
                setInput('');
                return;
            default:
                output = [`未知命令: ${cmd}`, '输入 HELP 查看可用命令'];
        }

        setLines(prev => [...prev, `> ${cmd}`, ...output, '']);
        setInput('');
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-base font-bold mb-3">系统终端</h2>
            <div ref={scrollRef} className="flex-1 overflow-auto p-3 bg-black/40 rounded-lg border border-green-900/30 font-mono text-xs">
                {lines.map((line, i) => (
                    <div key={i} className={line.startsWith('>') ? 'text-green-300' : ''}>{line || '\u00A0'}</div>
                ))}
                <div className="flex items-center gap-1">
                    <span className="text-green-500">{'>'}</span>
                    <input
                        className="flex-1 bg-transparent outline-none text-xs"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && input.trim() && execCommand(input)}
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
}
