import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { InvestigateNode } from '../components/InvestigateNode';
import { FileText, Camera, BookOpen, Users, Server, Lock } from 'lucide-react';

type OAView = 'login' | 'dashboard' | 'purchase' | 'personnel' | 'logs' | 'b2report' | 'photo' | 'notebook';

export function OA() {
  const {
    isOALoggedIn, setOALoggedIn,
    readHook, collectRune,
    addFact, hasFact,
  } = useGame();

  const [view, setView] = useState<OAView>(isOALoggedIn ? 'dashboard' : 'login');
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');

  const [b2AuthCode, setB2AuthCode] = useState('');
  const [b2AuthError, setB2AuthError] = useState('');
  const [b2Unlocked, setB2Unlocked] = useState(false);

  // V4 Login Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleB2Auth = (e: React.FormEvent) => {
    e.preventDefault();
    if (b2AuthCode === 'mnt8023_zq') {
      setB2Unlocked(true);
      setB2AuthError('');
    } else {
      setB2AuthError('验证码无效。');
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 border border-green-900/30 bg-green-950/10 rounded shadow-[0_0_15px_rgba(0,255,0,0.05)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-1 tracking-widest text-green-400">TRANQUIL-OS</div>
            <div className="text-xs text-green-600/80">内部管理系统 v2.3.1</div>
            <div className="text-xs text-green-600/80 mt-1">安宁深眠（南郊）医疗研究中心</div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs text-green-600 mb-2 block">工号 (Employee ID)</label>
              <input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-green-900 text-green-400 font-mono outline-none focus:border-green-500 focus:shadow-[0_0_8px_rgba(0,255,0,0.2)] transition-shadow"
                placeholder="[INPUT ID]"
              />
            </div>
            <div>
              <label className="text-xs text-green-600 mb-2 block">口令 (Password)</label>
              <input
                type="password"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-green-900 text-green-400 font-mono outline-none focus:border-green-500 focus:shadow-[0_0_8px_rgba(0,255,0,0.2)] transition-shadow"
                placeholder="[INPUT PASSWORD]"
              />
            </div>
            <button type="submit" className="w-full py-3 mt-4 border border-green-800 text-green-500 font-bold hover:bg-green-900/40 hover:text-green-300 transition-colors tracking-widest">
              SYSTEM LOGIN
            </button>
          </form>

          {loginError && (
            <div className="mt-6 p-2 bg-red-950/30 border border-red-900/50 text-red-500 text-xs text-center">
              {loginError}
            </div>
          )}

          <div className="mt-8 text-center text-[10px] text-green-800/60 uppercase tracking-widest">
            unauthorized access will be logged
          </div>
        </div>
      </div>
    );
  }

  // Common Header for Dashboard and Inner Views
  const renderHeader = () => (
    <div className="border-b border-green-900/50 px-6 py-3 flex items-center justify-between bg-black/50 backdrop-blur-sm sticky top-0 z-10 font-mono">
      <div className="text-xs text-green-500">
        TRANQUIL-OS | 用户：<span className="font-bold text-green-400">MNT-8023</span> | 上次登录：2024-03-19 21:44
      </div>
      <div className="flex gap-4 text-xs text-green-700">
        {['dashboard', 'purchase', 'personnel', 'logs', 'b2report', 'photo', 'notebook'].map((v) => (
          <button
            key={v}
            className={`hover:text-green-400 transition-colors ${view === v ? 'text-green-300 font-bold border-b border-green-400' : ''}`}
            onClick={() => setView(v as OAView)}
          >
            [{v === 'b2report' ? 'b2' : v}]
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col selection:bg-green-900/50 selection:text-green-100">
      {renderHeader()}

      <div className="flex-1 max-w-4xl mx-auto w-full p-8">

        {/* Module 0: Dashboard */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-xl font-bold text-green-400 border-b border-green-900/50 pb-4">
              欢迎回来，MNT-8023。
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DashCard
                icon={<FileText />}
                title="[1] 物资采购管理"
                desc="查询中心大宗物资与特种耗材采购审批记录"
                onClick={() => { setView('purchase'); addFact('purchase_order_read'); }}
              />
              <DashCard
                icon={<Users />}
                title="[2] 人事档案查询"
                desc="查询员工入职、调动及离职档案"
                onClick={() => setView('personnel')}
              />
              <DashCard
                icon={<BookOpen />}
                title="[3] 设施维护日志"
                desc="IT与基础设施运行状态巡检记录"
                onClick={() => { setView('logs'); addFact('oa_maintenance_log_read'); }}
              />
              <DashCard
                icon={<Server />}
                title="[4] B2层运维报告"
                desc="核心机房运行状态周报 [受限]"
                locked={!b2Unlocked}
                onClick={() => setView('b2report')}
              />
              <DashCard
                icon={<Camera />}
                title="[5] 图像档案库"
                desc="设施巡检及现场留存影像资料"
                onClick={() => setView('photo')}
                disabled={!hasFact('purchase_order_read')}
                disabledReason="需要先阅读新采购单"
              />
              <DashCard
                icon={<FileText />}
                title="[6] 系统备注"
                desc="供维护人员记录临时备注"
                onClick={() => { setView('notebook'); addFact('password_half_juku_found'); }}
              />
            </div>
          </div>
        )}

        {/* Module 1: Purchase */}
        {view === 'purchase' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ 物资采购管理</span>
            </div>

            <div className="bg-green-950/10 border border-green-900/50 p-6 shadow-lg">
              <div className="flex justify-between items-end mb-6 border-b border-green-900/50 pb-4">
                <h2 className="text-lg font-bold text-green-400 tracking-wide">物资采购入库审批单</h2>
                <div className="text-xs text-green-700 text-right space-y-1">
                  <p>文件编号：AQSM-2024-PUR-007</p>
                  <p>审批状态：<span className="text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded">已通过</span></p>
                </div>
              </div>

              <table className="w-full text-sm text-left mb-6 border-collapse">
                <thead>
                  <tr className="bg-green-900/20 text-green-400 border-b border-green-900">
                    <th className="p-3 font-medium">序号</th>
                    <th className="p-3 font-medium">物品名称</th>
                    <th className="p-3 font-medium">规格/型号</th>
                    <th className="p-3 font-medium">数量</th>
                    <th className="p-3 font-medium">用途说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-900/30 text-green-600/90">
                  <tr className="hover:bg-green-900/10">
                    <td className="p-3">1</td>
                    <td className="p-3 font-bold text-green-500">枣木板材</td>
                    <td className="p-3">雷击枣木，长度≥1.2m</td>
                    <td className="p-3 font-mono text-green-400">49块</td>
                    <td className="p-3 text-green-700">B2层设备底座特种隔振材料</td>
                  </tr>
                  <tr className="hover:bg-green-900/10">
                    <td className="p-3">2</td>
                    <td className="p-3 font-bold text-green-500">天然朱砂粉</td>
                    <td className="p-3">含HgS≥98%，500g/瓶</td>
                    <td className="p-3 font-mono text-green-400">120瓶</td>
                    <td className="p-3 text-green-700">特殊绝缘涂层配方原料</td>
                  </tr>
                  <tr className="hover:bg-green-900/10">
                    <td className="p-3">3</td>
                    <td className="p-3 font-bold text-green-500">黑山羊血（冻干）</td>
                    <td className="p-3">医用级，500ml当量/袋</td>
                    <td className="p-3 font-mono text-green-400">200袋</td>
                    <td className="p-3 text-green-700">新型生物传感器核心校准介质</td>
                  </tr>
                  <tr className="hover:bg-green-900/10">
                    <td className="p-3">4</td>
                    <td className="p-3 font-bold text-green-500">纯铜铆钉</td>
                    <td className="p-3">M4×12mm 黄铜</td>
                    <td className="p-3 font-mono text-green-400">10,000枚</td>
                    <td className="p-3 text-green-700">机柜组件抗干扰紧固件</td>
                  </tr>
                  <tr className="hover:bg-green-900/10">
                    <td className="p-3">5</td>
                    <td className="p-3 font-bold text-green-500">精密铸造蜡</td>
                    <td className="p-3">低温型，10kg/桶</td>
                    <td className="p-3 font-mono text-green-400">30桶</td>
                    <td className="p-3 text-green-700">高密度密封灌注材料</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-green-950/40 p-4 border-l-2 border-green-600 text-xs text-green-600 space-y-2">
                <p className="font-bold text-green-500">附注要求：</p>
                <p>1. 上述材料采购走特殊财务通道，入账代码为“建筑与装修维护（PHX-01）”。</p>
                <p>2. 所有物资必须在凌晨2:00前由专车从南门地下通道运入，直接存放在B2层临时库房。</p>
                <InvestigateNode hookId="oa_purchase_check" feedbackText="这些采购物品……完全不像是医疗用品。">
                  <p className="text-yellow-500/80 font-bold bg-yellow-900/20 px-2 py-1 inline-block mt-2">
                    3. 符材验收须由钟院长本人到场，任何他人不得开箱。
                  </p>
                </InvestigateNode>
              </div>

              <div className="mt-8 flex justify-between items-center text-xs text-green-700 pt-4 border-t border-green-900/50">
                <p>提交人：后勤管理部</p>
                <p>审批层级：院务委员会</p>
                <p>最后更新：2024-01-08 14:22:05</p>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Personnel */}
        {view === 'personnel' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ 人事档案查询</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-green-900/50 pb-2 mb-4 text-green-400">
                <span className="font-bold">查询结果 (2)</span>
                <span>过滤条件：状态 = [离职申请_审查中]</span>
              </div>

              <InvestigateNode hookId="oa_personnel_check" feedbackText="她最后一次出勤就在那条新闻发出的前一个月……这绝不是巧合。">
                <div className="bg-green-950/20 border border-green-800 p-4 rounded hover:bg-green-900/20 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-green-300 font-bold text-lg">MED-0019 (档案封存)</h3>
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-800/50 text-xs uppercase">审查中</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-600/80">
                    <p>部门：神经内科 (专项治疗组)</p>
                    <p>入职日期：2020-05-12</p>
                    <p>最后出勤：<span className="text-green-400 font-bold">2022-10-03</span></p>
                    <p>离职原因：个人健康原因申请离岗休养</p>
                  </div>
                  {hasFact('car_crash_clue') && (
                    <div className="mt-4 pt-3 border-t border-green-900/50 text-xs text-yellow-600/80 font-mono bg-yellow-950/10 p-2">
                      <span className="text-yellow-500 font-bold">// SYS_NOTE:</span> 2022-11-02 news source = PR company registrant. MED-0019 last seen 2022-10-03. draw your own conclusions.
                    </div>
                  )}
                </div>
              </InvestigateNode>

              <div className="bg-green-950/20 border border-green-900 p-4 rounded mt-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-green-300 font-bold text-lg">ADM-0044</h3>
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-800/50 text-xs uppercase">审查中</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-600/80">
                  <p>部门：行政后勤保障部</p>
                  <p>入职日期：2021-02-15</p>
                  <p>最后出勤：<span className="text-green-400 font-bold">2023-11-12</span></p>
                  <p>离职原因：未知（系统挂起）</p>
                </div>
                <div className="mt-4 pt-3 border-t border-green-900/50 text-xs text-red-600/60 font-mono">
                  警告：该档案关联了未结清的保密协议(NDA)纠纷。
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Module 3: Logs */}
        {view === 'logs' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ 设施维护日志</span>
            </div>

            <div className="space-y-6 text-sm">
              <LogEntry date="2024-03-04" content="例行巡检B2层机房。7号液冷机柜散热风扇转速异常，持续高转。温度读数正常范围内。记录在案，继续观察。" />
              <LogEntry date="2024-03-06" content="7号柜日均耗电量已升至420kW，是其他6台柜子总和的3倍以上。设计上限应为80kW/台。已向主管汇报，回复：'设计参数已更新，无需担心'。更新了什么？谁批准的？" />
              <LogEntry date="2024-03-08" content="今天凌晨巡检时注意到B2层走廊尽头的应急灯持续闪烁。走近时，7号柜内部传出低频嗡鸣声，和之前不同——像是有节奏的脉冲。靠近柜门时体感温度明显偏高，但面板温度读数依然显示'正常'。传感器被篡改了？" />
              <LogEntry date="2024-03-09" content="拆开了7号柜侧板做内部检查。发现异常：液冷管道的接口处被人用某种暗红色物质做了密封处理，不是标准硅胶。用手电照了一下柜体内壁——有人在上面贴了一张黄色的纸，上面写满了看不懂的字（篆书？）。拍了照片存档。" />
              <LogEntry date="2024-03-10" content="查了一下那种红色密封物质。成分疑似含朱砂（硫化汞）。一个液冷服务器机柜用朱砂做密封？搜了采购记录——采购单上确实有'天然朱砂粉'120瓶和'黑山羊血'200袋。用途写的是'生物传感器校准''特殊涂层材料'。扯淡。" />
              <LogEntry date="2024-03-11" content="继续调查。发现7号柜的实际功率已经飙到7000kW——整栋楼的变压器容量才6.5MW，光一台柜子就吃掉了超过100%。这在物理上不可能，除非供电系统有问题，或者功率计的读数是假的。但我亲手测的电流是真的。这里面到底跑的是什么？" />
              <LogEntry date="2024-03-12" content="半夜又去了B2。打开了7号柜的侧面检修面板——看见里面的管道在抖。不是震动，是那种……脉搏一样的节奏性蠕动。液冷管道里流的不像是冷却液，颜色偏暗。写了邮件给主管，抄送院务委。" />

              <div className="bg-red-950/20 border border-red-900/50 p-4 rounded">
                <p className="text-red-500/80 text-xs mb-2">2024-03-13</p>
                <div className="text-red-400 space-y-2">
                  <p>所有邮件都被退回了。公司邮箱被冻结。门禁卡B2层权限被撤销。</p>
                  <p>下午被叫去"谈话"。行政主任说我"过度解读技术参数"。让我签一份NDA。我没签。</p>
                  <p>晚上10点——护士又来了，端着那杯"褪黑素"。这次我没喝。我趁她走后把杯子倒进了样本瓶。明天送检。</p>
                </div>
              </div>

              <div className="text-center font-mono text-green-800/50 py-12 border-t border-green-900/30 mt-12 mb-32">
                [此后无新增记录]
              </div>

              {/* HUGE spacer to require scrolling down */}
              <div className="h-[600px] w-full border-l border-green-900/10 ml-8 flex items-center justify-center opacity-5">
                <span className="rotate-90 tracking-widest text-[8px]">EOF EOF EOF EOF EOF EOF</span>
              </div>

              <InvestigateNode hookId="oa_logs_hidden" runeId="RUNE_05" feedbackText="他发现了连代码和电缆都无法掩盖的真相……那不是机器，那是另一座更深的地狱。">
                <div className="bg-black border border-green-900/40 p-8 shadow-2xl mt-12">
                  <p className="text-green-500/60 mb-6 font-mono text-xs">——————</p>
                  <p className="text-green-400 font-bold mb-4">如果你在读这个，说明你进来了。</p>
                  <p className="text-green-300 mb-2">OA里的B2报告才是重点。</p>
                  <p className="text-green-300 mb-2">还有照片。照片里不只有我写的那句话，</p>
                  <p className="text-green-300 mb-6">图片的属性里还有东西。</p>
                  <p className="text-white font-bold bg-green-900/40 inline-block px-2 py-1">继续找。</p>
                  <p className="text-green-500/80 mt-8">——z</p>
                </div>
              </InvestigateNode>
            </div>
          </div>
        )}

        {/* Module 4: B2 Report (Locked/Unlocked) */}
        {view === 'b2report' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ B2层运维报告</span>
            </div>

            {!b2Unlocked ? (
              <div className="bg-black border border-red-900/50 p-12 text-center mt-12 shadow-[0_0_30px_rgba(255,0,0,0.05)]">
                <Lock className="w-12 h-12 text-red-500/50 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-red-500 mb-4 tracking-widest">ACCESS RESTRICTED</h3>
                <p className="text-red-400 mb-8 max-w-sm mx-auto text-sm">此模块需要二级权限确认。请输入您的个人验证码以获取解密密钥。</p>
                <form onSubmit={handleB2Auth} className="max-w-xs mx-auto">
                  <input
                    type="text"
                    value={b2AuthCode}
                    onChange={(e) => setB2AuthCode(e.target.value)}
                    className="w-full px-4 py-2 bg-red-950/20 border border-red-800 text-red-400 font-mono text-center outline-none focus:border-red-500 mb-4"
                    placeholder="Auth Code"
                  />
                  <button type="submit" className="w-full border border-red-900 text-red-500 hover:bg-red-950/50 hover:text-red-400 py-2 transition-colors">
                    VERIFY
                  </button>
                  {b2AuthError && <p className="text-red-500 text-xs mt-3">{b2AuthError}</p>}
                </form>
              </div>
            ) : (
              <div className="bg-green-950/20 border border-green-900 p-8 shadow-lg font-mono text-sm leading-relaxed">
                <h2 className="text-green-300 font-bold text-xl mb-6 border-b border-green-800 pb-4">B2层基础设施运维报告 · 2024年2月</h2>

                <div className="space-y-4 text-green-500/90">
                  <p className="flex justify-between">
                    <span>服务器矩阵节点总数：</span>
                    <span className="font-bold text-green-400">19,847</span>
                  </p>
                  <p className="flex justify-between text-green-400 bg-green-900/10 px-2 py-1 -mx-2">
                    <span>月度新增处理量：</span>
                    <span className="font-bold border border-green-500/30 px-2">+203 节点</span>
                  </p>

                  <div className="mt-8 pt-6 border-t border-green-900/50">
                    <p className="font-bold text-green-600 mb-3"># 机柜运行状态</p>
                    <ul className="space-y-2 text-green-600/80">
                      <li>柜 01-06: 功耗 380kW [平衡态] - 物理流体冷却液流速正常</li>
                      <li>柜 07: 功耗 7,420kW [超载态] - 特种暗物质流体高频脉动</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-green-900/50">
                    <p className="font-bold text-green-600 mb-3"># 意识并网上传通道状态</p>
                    <p>带宽利用率：98.2%</p>
                    <p>封存队列：正常转入</p>
                    <p>重置/格式化频率：0</p>
                    <p className="mt-4 text-xs text-yellow-600/80 italic">注：+203节点已完全并入太岁底层计算池，本体躯壳已移交合作医疗废弃物机构进行标准化降解处理。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Module 5: Photo */}
        {view === 'photo' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ 图像档案库</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black border border-green-900/50 p-4 relative group">
                <div className="aspect-video bg-green-950/30 flex items-center justify-center border border-green-900/30 overflow-hidden relative">
                  <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay"></div>
                  {/* Pseudo-image representation */}
                  <div className="w-full h-full flex items-center justify-center text-green-800/20 font-mono text-2xl tracking-widest">IMG_0081_B2.JPG</div>
                </div>
                <div className="mt-3 text-xs text-green-600 flex justify-between">
                  <span>图片一：B2层外景</span>
                  <span>(常规机房走廊)</span>
                </div>
              </div>

              <InvestigateNode hookId="oa_photo_rune1" runeId="RUNE_01" feedbackText="赵启在符纸照片的元数据中，留下了他最后的操作记录……">
                <div className="bg-black border border-yellow-900/50 p-4 relative group cursor-pointer hover:border-yellow-600 transition-colors">
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      className="px-2 py-1 bg-black/80 text-yellow-500 border border-yellow-800/50 text-[10px] hover:bg-yellow-900/50"
                      title="右键查看属性"
                    >
                      属性(META)
                    </button>
                  </div>
                  <div className="aspect-video bg-yellow-950/20 flex flex-col items-center justify-center border border-yellow-900/30 overflow-hidden relative p-4">
                    <div className="text-yellow-600/40 text-lg tracking-widest mb-4">IMG_0085_CABINET7.JPG</div>
                    <div className="w-full bg-black/40 p-3 border border-yellow-900/50 transform -rotate-2">
                      <p className="text-red-500/80 font-mono text-[10px] leading-tight mb-2 opacity-70">
                        {`// 下半段阵法覆写函数入口：`}<br />
                        {`// function_key = "JiuKu"`}
                      </p>
                      <p className="text-yellow-500/60 font-mono text-[10px] leading-tight">
                        {`// 上半段在林医生的专栏里。`}<br />
                        {`// 看文章标题首字。不要搜索，自己读。`}<br />
                        {`// ——赵`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-yellow-600 flex justify-between">
                    <span className="font-bold">图片二：7号机柜内部细节</span>
                    <span className="text-red-500 font-bold">* 关键证据 *</span>
                  </div>

                  {/* Hidden Meta Data that shows on hover of the button */}
                  <div className="absolute top-0 right-0 h-full w-full bg-black/95 border border-green-500 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center pointer-events-none z-20">
                    <p className="text-green-500 font-bold mb-2 text-sm border-b border-green-900 pb-1">属性 / 备注</p>
                    <p className="text-green-400 text-xs mb-1">拍摄时间：2024-03-13 23:53</p>
                    <p className="text-green-400 text-xs mb-1">拍摄人：MNT-8023</p>
                    <p className="text-green-400 text-xs mb-4">设备：[未知型号]</p>
                    <div className="text-green-300 text-xs leading-relaxed space-y-1">
                      <p>{`// 照完这张我在B2门口站了很久。`}</p>
                      <p>{`// 我知道我已经走到了不能回头的地方。`}</p>
                      <p>{`// 但我还是走进去了，因为我需要更多确认。`}</p>
                      <p>{`// 后来我得到了确认。`}</p>
                      <p>{`// ——z`}</p>
                    </div>
                  </div>
                </div>
              </InvestigateNode>

              <div className="bg-black border border-green-900/50 p-4 relative group md:col-span-2 max-w-md mx-auto w-full">
                <div className="aspect-video bg-green-950/20 flex items-center justify-center border border-green-900/30 overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center text-green-800/20 font-mono text-2xl tracking-widest">IMG_0088_EXT.JPG</div>
                </div>
                <div className="mt-3 text-xs text-green-600 flex justify-between">
                  <span>图片三：诊所外景</span>
                  <span>(无特殊备注)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module 6: Notebook */}
        {view === 'notebook' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-8 text-green-600 border-b border-green-900/30 pb-2">
              <button className="hover:text-green-400" onClick={() => setView('dashboard')}>{'< 返回'}</button>
              <span>/ 系统备注</span>
            </div>

            <div className="bg-green-950/10 border border-green-900 p-8 shadow-inner min-h-[400px]">
              <p className="text-green-600/50 text-xs mb-8 border-b border-green-900/30 pb-2">供维护人员记录临时备注</p>

              <div className="font-mono text-sm leading-8 text-green-400 space-y-2">
                <p>2024-03-19</p>
                <p className="mt-4">今天是最后一次了。</p>
                <p className="mt-4">林医生的专栏我查过了，她做了。</p>
                <p>影子档案建好了，东西都在里面。</p>
                <p>这里有七个碎片，我数过了。</p>
                <p className="mt-8 text-white font-bold bg-green-900/30 px-2 py-1 inline-block">如果有人把它们都找到了，</p><br />
                <p className="text-white font-bold bg-green-900/30 px-2 py-1 inline-block">用"太乙救苦"的完整拼音打开终局。</p>
                <p className="mt-8">加油。</p>
                <p className="mt-8 text-green-600">——mnt-8023</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Sub-components
function DashCard({ icon, title, desc, onClick, locked, disabled, disabledReason }: {
  icon: React.ReactNode, title: string, desc: string, onClick: () => void, locked?: boolean, disabled?: boolean, disabledReason?: string
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`p-6 border text-left transition-all ${disabled
        ? 'border-green-900/20 opacity-50 cursor-not-allowed bg-transparent'
        : locked
          ? 'border-red-900/50 hover:bg-red-950/20 bg-black'
          : 'border-green-900 hover:border-green-500 hover:bg-green-900/10 bg-green-950/20 shadow-[0_4px_10px_rgba(0,255,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,255,0,0.05)] text-green-400'
        }`}
    >
      <div className={`mb-4 flex items-center justify-between ${locked ? 'text-red-500/70' : (disabled ? 'text-green-800' : 'text-green-500')}`}>
        {icon}
        {locked && <Lock className="w-4 h-4" />}
      </div>
      <h3 className={`font-bold mb-2 ${locked ? 'text-red-500' : (disabled ? 'text-green-700' : 'text-green-300')}`}>{title}</h3>
      <p className={`text-xs ${locked ? 'text-red-900' : (disabled ? 'text-green-900' : 'text-green-600/80')}`}>
        {disabled && disabledReason ? `[ ${disabledReason} ]` : desc}
      </p>
    </button>
  );
}

function LogEntry({ date, content }: { date: string, content: string }) {
  return (
    <div className="flex gap-4 p-3 border-l-2 border-green-800/50 bg-green-950/10 hover:bg-green-900/20 transition-colors">
      <div className="text-green-600/60 font-bold whitespace-nowrap min-w-[80px]">{date}</div>
      <div className="text-green-400/90 leading-relaxed">{content}</div>
    </div>
  );
}
