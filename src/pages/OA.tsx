import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { Lock, Terminal, FileText, Camera, BookOpen, AlertCircle } from 'lucide-react';

// ═══════════════════════════════════════════
//  OA · V3 黑区 · 诊所内部办公自动化系统
//  登录拦截 + 采购单 E-1 + 赵启日志 C + 照片 E-2 + 记事本 + 终端
// ═══════════════════════════════════════════

type OAView = 'login' | 'dashboard' | 'purchase' | 'logs' | 'photo' | 'notebook' | 'terminal';

export function OA() {
  const {
    isOALoggedIn, setOALoggedIn, canLoginOA,
    readHook, hasReadHook, collectRune, hasRune,
    collectedRunes, setCurrentApp, setEndingType,
    hasFact,
  } = useGame();

  const [view, setView] = useState<OAView>(isOALoggedIn ? 'dashboard' : 'login');
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '> TRANQUIL-OS INTRANET TERMINAL v2.4.1',
    '> 身份验证通过。欢迎，已授权用户。',
    '> 输入 HELP 查看可用命令',
    '',
  ]);

  // 登录处理 — V4 防穿越机制
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // V4 分级错误提示
    if (!hasFact('oa_url_discovered')) {
      setLoginError('// 错误：系统连接超时。请检查网络配置。');
      return;
    }
    if (!hasFact('employee_8023_known')) {
      setLoginError('// 错误：账号不存在或已被禁用。');
      return;
    }

    if (loginId === '8023' && loginPwd === 'fswltz') {
      setOALoggedIn(true);
      setView('dashboard');
      readHook('oa_logged_in');
    } else {
      setLoginError('// 认证失败：工号或口令不匹配');
    }
  };

  // 终端命令处理
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    const newHistory = [...terminalHistory, `> ${terminalInput}`];

    if (cmd === 'HELP') {
      newHistory.push(
        '  AVAILABLE COMMANDS:',
        '  STATUS   - 系统状态',
        '  RUNES    - 碎片校验',
        '  OVERRIDE - 核心校准（需要授权密钥）',
        ''
      );
    } else if (cmd === 'STATUS') {
      newHistory.push(
        `  系统状态: 运行中`,
        `  活跃节点: 19,847`,
        `  B2层液冷机柜: 在线 [7/7]`,
        `  当前功耗: 6,580 kW`,
        `  共振哈希值: [持续生成中]`,
        ''
      );
    } else if (cmd === 'RUNES') {
      newHistory.push(
        `  碎片校验: [${collectedRunes.length}/7]`,
        ...collectedRunes.map(r => `    ✓ ${r}`),
        collectedRunes.length === 7 ? '  >>> 全部碎片已集齐。OVERRIDE 命令已解锁。' : `  >>> 缺少 ${7 - collectedRunes.length} 枚碎片。`,
        ''
      );
    } else if (cmd.startsWith('OVERRIDE')) {
      if (collectedRunes.length < 7) {
        newHistory.push('  // 错误：碎片校验未通过 [' + collectedRunes.length + '/7]', '');
      } else {
        const key = cmd.replace('OVERRIDE', '').trim();
        if (key === 'TAIYIJIUKU') {
          newHistory.push(
            '  >>> 授权密钥验证通过',
            '  >>> 正在接入太岁核心……',
            '  >>> 决策分支树已加载',
            ''
          );
          // 进入终局
          setTimeout(() => setCurrentApp('ending'), 1500);
        } else if (key) {
          newHistory.push('  // 错误：授权密钥不匹配', '');
        } else {
          newHistory.push('  用法: OVERRIDE <授权密钥>', '  提示: 密钥由两部分组成——标题的秘密 + 柜中的代码', '');
        }
      }
    } else {
      newHistory.push(`  // 未知命令: ${terminalInput}`, '');
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  // ── 登录界面 ──
  if (view === 'login') {
    return (
      <div className="min-h-screen terminal-mode flex items-center justify-center">
        <div className="w-96 p-8">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-1">TRANQUIL-OS</div>
            <div className="text-xs text-[#005500]">内部管理系统 v2.3.1</div>
            <div className="text-xs text-[#005500] mt-1">安宁深眠（南郊）医疗研究中心</div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs block mb-1">工号 (Employee ID)</label>
              <input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono"
                placeholder="输入工号……"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">口令 (Password)</label>
              <input
                type="password"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono"
                placeholder="输入口令……"
              />
            </div>
            <button type="submit" className="w-full py-2 text-sm font-mono">
              {'>>> 登 录'}
            </button>
          </form>

          {loginError && (
            <div className="mt-4 text-red-400 text-xs font-mono text-center">
              {loginError}
            </div>
          )}

          <div className="mt-8 text-center text-[10px] text-[#003300]">
            未授权访问将被记录并追溯
          </div>
        </div>
        <div className="crt-overlay" />
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen terminal-mode">
      <div className="crt-overlay" />

      {/* 顶部导航 */}
      <div className="border-b border-[#00ff00]/30 px-4 py-2 flex items-center justify-between">
        <div className="text-xs">
          TRANQUIL-OS INTRANET | 用户：<span className="font-bold">MNT-8023</span> | 上次登录：2024-03-19 21:44
        </div>
        <div className="flex gap-3 text-xs">
          <button className={`hover:underline ${view === 'dashboard' ? 'font-bold' : ''}`} onClick={() => setView('dashboard')}>[主页]</button>
          <button className={`hover:underline ${view === 'purchase' ? 'font-bold' : ''}`} onClick={() => setView('purchase')}>[采购单]</button>
          <button className={`hover:underline ${view === 'logs' ? 'font-bold' : ''}`} onClick={() => setView('logs')}>[巡检日志]</button>
          <button className={`hover:underline ${view === 'photo' ? 'font-bold' : ''}`} onClick={() => setView('photo')}>[照片]</button>
          <button className={`hover:underline ${view === 'notebook' ? 'font-bold' : ''}`} onClick={() => setView('notebook')}>[记事本]</button>
          <button className={`hover:underline ${view === 'terminal' ? 'font-bold' : ''}`} onClick={() => setView('terminal')}>[终端]</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Dashboard 主页 */}
        {view === 'dashboard' && (
          <div className="space-y-4">
            <div className="text-lg font-bold terminal-glitch">{'> '} 欢迎回来</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <DashCard icon={<FileText className="w-5 h-5" />} label="采购入库审批单" desc="设备物资采购记录" onClick={() => setView('purchase')} />
              <DashCard icon={<BookOpen className="w-5 h-5" />} label="赵启巡检日志" desc="IT运维巡检记录" onClick={() => setView('logs')} />
              <DashCard icon={<Camera className="w-5 h-5" />} label="巡检照片" desc="7号柜现场留存" onClick={() => setView('photo')} />
              <DashCard icon={<FileText className="w-5 h-5" />} label="赵启记事本" desc="个人笔记" onClick={() => setView('notebook')} />
              <DashCard icon={<Terminal className="w-5 h-5" />} label="系统终端" desc="核心校准接口" onClick={() => setView('terminal')} />
            </div>
          </div>
        )}

        {/* 采购单 E-1 */}
        {view === 'purchase' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs hover:underline" onClick={() => setView('dashboard')}>← 返回</button>
              <span className="text-xs text-[#00ff00]/60">| 采购入库审批单</span>
            </div>
            <InvestigateNode hookId="oa_purchase_list" feedbackText="这些采购物品……完全不像是医疗用品。">
              <div className="font-mono text-xs">
                <div className="mb-2 text-[#00ff00]/70">文件编号：AQSM-2024-PUR-007 | 审批状态：已通过</div>
                <table className="w-full border border-[#00ff00]/30">
                  <thead>
                    <tr className="border-b border-[#00ff00]/30">
                      <th className="text-left p-2 border-r border-[#00ff00]/30">序号</th>
                      <th className="text-left p-2 border-r border-[#00ff00]/30">物品名称</th>
                      <th className="text-left p-2 border-r border-[#00ff00]/30">规格/型号</th>
                      <th className="text-left p-2 border-r border-[#00ff00]/30">数量</th>
                      <th className="text-left p-2">用途说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#00ff00]/80">
                    <tr className="border-b border-[#00ff00]/20">
                      <td className="p-2 border-r border-[#00ff00]/20">1</td>
                      <td className="p-2 border-r border-[#00ff00]/20">枣木板材</td>
                      <td className="p-2 border-r border-[#00ff00]/20">雷击枣木/长≥1.2m</td>
                      <td className="p-2 border-r border-[#00ff00]/20">49块</td>
                      <td className="p-2">B2层设备底座隔振材料</td>
                    </tr>
                    <tr className="border-b border-[#00ff00]/20">
                      <td className="p-2 border-r border-[#00ff00]/20">2</td>
                      <td className="p-2 border-r border-[#00ff00]/20">天然朱砂粉</td>
                      <td className="p-2 border-r border-[#00ff00]/20">含 HgS≥98%/500g装</td>
                      <td className="p-2 border-r border-[#00ff00]/20">120瓶</td>
                      <td className="p-2">特殊涂层配方原料</td>
                    </tr>
                    <tr className="border-b border-[#00ff00]/20">
                      <td className="p-2 border-r border-[#00ff00]/20">3</td>
                      <td className="p-2 border-r border-[#00ff00]/20">黑山羊血（冻干）</td>
                      <td className="p-2 border-r border-[#00ff00]/20">医用级/500ml</td>
                      <td className="p-2 border-r border-[#00ff00]/20">200袋</td>
                      <td className="p-2">生物传感器校准介质</td>
                    </tr>
                    <tr className="border-b border-[#00ff00]/20">
                      <td className="p-2 border-r border-[#00ff00]/20">4</td>
                      <td className="p-2 border-r border-[#00ff00]/20">纯铜铆钉</td>
                      <td className="p-2 border-r border-[#00ff00]/20">M4×12mm 黄铜</td>
                      <td className="p-2 border-r border-[#00ff00]/20">10,000枚</td>
                      <td className="p-2">机柜组件紧固件</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-[#00ff00]/20">5</td>
                      <td className="p-2 border-r border-[#00ff00]/20">精密铸造蜡</td>
                      <td className="p-2 border-r border-[#00ff00]/20">低温型/10kg桶</td>
                      <td className="p-2 border-r border-[#00ff00]/20">30桶</td>
                      <td className="p-2">密封灌注材料</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 text-[#00ff00]/40 text-[10px]">审批人：院务委员会 | 日期：2024-01-08</div>
              </div>
            </InvestigateNode>
          </div>
        )}

        {/* 赵启巡检日志 C */}
        {view === 'logs' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs hover:underline" onClick={() => setView('dashboard')}>← 返回</button>
              <span className="text-xs text-[#00ff00]/60">| 赵启巡检日志</span>
            </div>
            <div className="font-mono text-xs space-y-3 text-[#00ff00]/80">
              <LogEntry date="2024-03-04" content="例行巡检B2层机房。7号液冷机柜散热风扇转速异常，持续高转。温度读数正常范围内。记录在案，继续观察。" />
              <LogEntry date="2024-03-06" content="7号柜日均耗电量已升至420kW，是其他6台柜子总和的3倍以上。设计上限应为80kW/台。已向主管汇报，回复：'设计参数已更新，无需担心'。更新了什么？谁批准的？" />
              <LogEntry date="2024-03-08" content="今天凌晨巡检时注意到B2层走廊尽头的应急灯持续闪烁。走近时，7号柜内部传出低频嗡鸣声，和之前不同——像是有节奏的脉冲。靠近柜门时体感温度明显偏高，但面板温度读数依然显示'正常'。传感器被篡改了？" />
              <LogEntry date="2024-03-09" content="拆开了7号柜侧板做内部检查。发现异常：液冷管道的接口处被人用某种暗红色物质做了密封处理，不是标准硅胶。用手电照了一下柜体内壁——有人在上面贴了一张黄色的纸，上面写满了看不懂的字（篆书？）。拍了照片存档。" />
              <LogEntry date="2024-03-10" content="查了一下那种红色密封物质。成分疑似含朱砂（硫化汞）。一个液冷服务器机柜用朱砂做密封？搜了采购记录——采购单上确实有'天然朱砂粉'120瓶和'黑山羊血'200袋。用途写的是'生物传感器校准''特殊涂层材料'。扯淡。" />
              <LogEntry date="2024-03-11" content="继续调查。发现7号柜的实际功率已经飙到7000kW——整栋楼的变压器容量才6.5MW，光一台柜子就吃掉了超过100%。这在物理上不可能，除非供电系统有问题，或者功率计的读数是假的。但我亲手测的电流是真的。这里面到底跑的是什么？" />
              <LogEntry date="2024-03-12" content="半夜又去了B2。打开了7号柜的侧面检修面板——看见里面的管道在抖。不是震动，是那种……脉搏一样的节奏性蠕动。液冷管道里流的不像是冷却液，颜色偏暗。写了邮件给主管，抄送院务委。" />
              <LogEntry date="2024-03-13" highlight content={
                <span>
                  所有邮件都被退回了。公司邮箱被冻结。门禁卡B2层权限被撤销。<br />
                  下午被叫去"谈话"。行政主任说我"过度解读技术参数"。让我签一份NDA。我没签。<br />
                  晚上10点——护士又来了，端着那杯"褪黑素"。这次我没喝。我趁她走后把杯子倒进了样本瓶。明天送检。<br /><br />
                  <span className="text-red-400">
                    {`>>> 日志写入中断`}<br />
                    {`>>> 最后时间戳: 2024-03-13 23:01:44`}<br />
                    {`>>> 原因: [用户会话异常终止]`}
                  </span>
                </span>
              } />
            </div>
          </div>
        )}

        {/* 照片 E-2 */}
        {view === 'photo' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs hover:underline" onClick={() => setView('dashboard')}>← 返回</button>
              <span className="text-xs text-[#00ff00]/60">| 巡检照片 - 7号柜</span>
            </div>
            <InvestigateNode hookId="oa_photo_talisman" runeId="RUNE_01" feedbackText="照片上的符纸……右下角有一段代码注释。function_key = 'JiuKu'">
              <div className="bg-black rounded-lg overflow-hidden border border-[#00ff00]/20">
                <img src={`${import.meta.env.BASE_URL}images/server_talisman.png`} alt="7号柜符纸" className="w-full" />
                <div className="p-3 text-[10px] text-[#00ff00]/60 space-y-1">
                  <p>拍摄时间：2024-03-09 02:34 AM</p>
                  <p>位置：B2层 7号液冷机柜 内侧面板</p>
                  <p>拍摄者：赵启 (IT-EXT-0077)</p>
                  <p className="text-yellow-500/60 mt-2">* 照片边缘有一张便条，手写潦草字迹："七个"</p>
                </div>
              </div>
            </InvestigateNode>
          </div>
        )}

        {/* 赵启记事本 */}
        {view === 'notebook' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs hover:underline" onClick={() => setView('dashboard')}>← 返回</button>
              <span className="text-xs text-[#00ff00]/60">| 赵启 - 个人记事本</span>
            </div>
            <div className="font-mono text-xs space-y-3 text-[#00ff00]/70 leading-relaxed">
              <p className="text-green-400">2024-03-19</p>
              <p className="mt-2">今天是最后一次了。</p>
              <p className="mt-2">林医生的专栏我查过了，她做了。</p>
              <p>影子档案建好了，东西都在里面。</p>
              <p>这里有七个碎片，我数过了。</p>
              <p className="mt-2">如果有人把它们都找到了，</p>
              <p>用<span className="text-yellow-400">"太乙救苦"的完整拼音</span>打开终局。</p>
              <p className="mt-2">加油。</p>
              <InvestigateNode hookId="oa_notebook_end" runeId="RUNE_05" feedbackText="赵启的最后记录……他已经为这一刻做好了所有准备。">
                <p className="mt-4 text-green-600">——mnt-8023</p>
              </InvestigateNode>
            </div>
          </div>
        )}

        {/* 终端 */}
        {view === 'terminal' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs hover:underline" onClick={() => setView('dashboard')}>← 返回</button>
              <span className="text-xs text-[#00ff00]/60">| 系统终端</span>
            </div>
            <div className="bg-black border border-[#00ff00]/20 rounded p-4 font-mono text-xs min-h-[300px]">
              {terminalHistory.map((line, i) => (
                <div key={i} className={`${line.startsWith('>') ? 'text-[#00ff00]' : 'text-[#00ff00]/60'}`}>
                  {line || '\u00A0'}
                </div>
              ))}
              <form onSubmit={handleTerminalSubmit} className="flex items-center mt-1">
                <span className="text-[#00ff00] mr-1">{'>'}</span>
                <input
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-[#00ff00] outline-none font-mono"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard 卡片 ──
function DashCard({ icon, label, desc, onClick }: {
  icon: React.ReactNode; label: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      className="p-4 border border-[#00ff00]/20 rounded hover:bg-[#00ff00]/5 transition-colors text-left"
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-[10px] text-[#00ff00]/50">{desc}</div>
    </button>
  );
}

// ── 日志条目 ──
function LogEntry({ date, content, highlight }: {
  date: string; content: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded border ${highlight ? 'border-red-500/40 bg-red-900/10' : 'border-[#00ff00]/10'}`}>
      <div className={`text-[10px] mb-1 ${highlight ? 'text-red-400' : 'text-[#00ff00]/40'}`}>
        [{date}]
      </div>
      <div className={highlight ? 'text-red-300/80' : 'text-[#00ff00]/70'}>
        {content}
      </div>
    </div>
  );
}
