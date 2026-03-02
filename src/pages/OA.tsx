import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Terminal, FileText, Settings, AlertTriangle } from 'lucide-react';

export function OA() {
  const { addClue, addFragment, setCurrentApp } = useGame();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [oaTab, setOaTab] = useState<'purchase' | 'logs' | 'system'>('purchase');
  const [talismanPeeled, setTalismanPeeled] = useState(false);
  const [overrideCode, setOverrideCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (empId === '8023' && password.toLowerCase() === 'fswltz') {
      setIsLoggedIn(true);
      addClue({
        id: 'oa-access',
        title: 'OA系统访问权限',
        description: '成功使用前台经理的工号(8023)和口令拼音(fswltz)登入内部系统。'
      });
    } else {
      setError('ACCESS DENIED. INVALID CREDENTIALS.');
    }
  };

  const handleOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (overrideCode.toLowerCase() === 'taiyijiuku') {
      // Transition to Act 4
      document.documentElement.requestFullscreen().catch(() => {});
      setCurrentApp('terminal');
    } else {
      setError('INVALID OVERRIDE CODE.');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-full bg-[#121010] p-4 sm:p-8 font-mono text-[#00ff00] relative overflow-hidden flex flex-col">
        <div className="crt-overlay"></div>
        <div className="max-w-6xl w-full mx-auto relative z-10 flex-1 flex flex-col">
          <div className="border-b-2 border-[#00ff00] pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-widest">TRANQUIL SLEEP CLINIC - INTRANET</h1>
              <p className="text-sm mt-1 opacity-70">SYSTEM VERSION 4.2.1 | USER: 8023</p>
            </div>
            <div className="text-right text-sm">
              <p>STATUS: ONLINE</p>
              <p>DATE: 甲辰年 四月十五 宜祭祀</p>
            </div>
          </div>
          
          <div className="flex flex-1 border border-[#00ff00]/50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-[#00ff00]/50 p-4 flex flex-col gap-4 bg-[#00ff00]/5">
              <button 
                onClick={() => setOaTab('purchase')} 
                className={`text-left px-4 py-3 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors flex items-center gap-3 ${oaTab === 'purchase' ? 'bg-[#00ff00]/20 font-bold' : ''}`}
              >
                <FileText className="w-5 h-5" />
                近期采购清单
              </button>
              <button 
                onClick={() => setOaTab('logs')} 
                className={`text-left px-4 py-3 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors flex items-center gap-3 ${oaTab === 'logs' ? 'bg-[#00ff00]/20 font-bold' : ''}`}
              >
                <AlertTriangle className="w-5 h-5" />
                IT维修日志
              </button>
              <button 
                onClick={() => setOaTab('system')} 
                className={`text-left px-4 py-3 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors flex items-center gap-3 mt-auto ${oaTab === 'system' ? 'bg-[#00ff00]/20 font-bold' : ''}`}
              >
                <Settings className="w-5 h-5" />
                系统深度自检
              </button>
            </div>

            {/* Content Area */}
            <div className="w-3/4 p-8 overflow-y-auto custom-scrollbar relative">
              
              {oaTab === 'purchase' && (
                <div className="animate-in fade-in">
                  <h2 className="text-xl font-bold mb-6 border-b border-[#00ff00]/30 pb-2">物资采购及入库记录 (5月)</h2>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#00ff00]/50 text-[#00ff00]/70">
                        <th className="p-3">品名</th>
                        <th className="p-3">数量</th>
                        <th className="p-3">用途标注</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5">
                        <td className="p-3">西门子液冷循环管</td>
                        <td className="p-3">500米</td>
                        <td className="p-3">机房冷却系统扩容</td>
                      </tr>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5 text-amber-500">
                        <td className="p-3">朱砂（特级研磨）</td>
                        <td className="p-3">50公斤</td>
                        <td className="p-3">实验室耗材</td>
                      </tr>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5">
                        <td className="p-3">3M服务器防尘滤网</td>
                        <td className="p-3">200片</td>
                        <td className="p-3">日常维护</td>
                      </tr>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5 text-amber-500">
                        <td className="p-3">百年雷击枣木</td>
                        <td className="p-3">3吨</td>
                        <td className="p-3">定制机柜底座</td>
                      </tr>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5 text-amber-500 group relative">
                        <td className="p-3">黑山羊血提取物（冻干）</td>
                        <td className="p-3">20升</td>
                        <td className="p-3">冷却液添加剂（特殊配方）</td>
                        {/* Fragment 5 */}
                        <td className="absolute inset-0 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span 
                            className="text-amber-600 cursor-pointer text-xs border border-amber-600 px-1 bg-black/80" 
                            onClick={() => { addFragment(5); alert('你在采购清单的阴影中发现了一枚古铜色的符文碎片。'); }}
                          >
                            符
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-[#00ff00]/20 hover:bg-[#00ff00]/5 text-amber-500">
                        <td className="p-3">黄表纸（手工竹浆）</td>
                        <td className="p-3">2000张</td>
                        <td className="p-3">防静电衬垫</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => {
                        addClue({
                          id: 'creepy-items',
                          title: '诡异的采购清单',
                          description: '诊所的采购清单里混杂着朱砂、雷击枣木、黑山羊血提取物和黄表纸等物品，这绝对不是正常的医疗机构耗材。'
                        });
                      }}
                      className="text-xs text-[#00ff00]/50 hover:text-[#00ff00] underline"
                    >
                      [记录异常清单]
                    </button>
                  </div>
                </div>
              )}

              {oaTab === 'logs' && (
                <div className="animate-in fade-in space-y-6">
                  <h2 className="text-xl font-bold mb-6 border-b border-[#00ff00]/30 pb-2 text-red-500">[紧急] 异常发现报告</h2>
                  <div className="space-y-4 text-[#00ff00]/90 leading-relaxed">
                    <p className="font-bold">6月1日 01:47</p>
                    <p>我确定了。他们根本不是在治病。</p>
                    <p>4号和7号机柜底座上刻的不是什么品牌Logo，是符咒。冷却液的"添加剂"就是他们采购清单上写的"黑山羊血提取物"。我在散热口捡到了烧过的黄表纸灰烬。</p>
                    <p>我拍了那个标志（附图）——他们叫它"莫比乌斯太极符"。看着像个数学无限符号，但放大看，线条全是扭曲的篆书血字。</p>
                    <p>我已经把停止服务器集群的唯一覆盖码分成两半。一半交给了林医生，让她藏在专栏文章里。另一半……</p>
                  </div>
                  
                  {/* Interactive Photo */}
                  <div className="relative w-full max-w-md h-64 border border-[#00ff00]/50 mt-8 overflow-hidden bg-[#0a0a0a] group">
                    {/* Server Cabinet Background */}
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute right-4 top-4 text-red-500 font-mono text-xl animate-pulse">66.6℃</div>
                    <div className="absolute left-8 top-0 bottom-0 w-4 bg-zinc-800 border-x border-zinc-700"></div>
                    
                    {/* Hidden Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-mono text-2xl whitespace-nowrap z-10">
                      后半码 = JiuKu
                    </div>
                    
                    {/* Talisman Overlay */}
                    <div 
                      className={`absolute top-1/4 left-1/3 w-24 h-40 bg-[#e6c229] shadow-2xl z-20 transition-all duration-1000 origin-top cursor-pointer flex flex-col items-center py-4 ${talismanPeeled ? 'rotate-[-110deg] opacity-0 pointer-events-none' : 'hover:rotate-[-5deg]'}`}
                      onClick={() => {
                        setTalismanPeeled(true);
                        addClue({
                          id: 'code-half-2',
                          title: '覆盖码后半段',
                          description: '在赵启拍摄的机房照片中，揭开7号机柜上的黄色符纸，下面写着：后半码 = JiuKu'
                        });
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-red-800/50 mb-2"></div>
                      <div className="text-red-800 font-serif text-xl writing-vertical-rl tracking-widest font-bold opacity-80" style={{ writingMode: 'vertical-rl' }}>
                        镇魂敕令
                      </div>
                    </div>
                    
                    {!talismanPeeled && (
                      <div className="absolute bottom-2 left-2 text-xs text-[#00ff00]/50 z-30 pointer-events-none">
                        [点击揭开符纸]
                      </div>
                    )}
                  </div>
                </div>
              )}

              {oaTab === 'system' && (
                <div className="animate-in fade-in flex flex-col items-center justify-center h-full">
                  <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-2 text-red-500">SYSTEM OVERRIDE REQUIRED</h2>
                  <p className="text-[#00ff00]/70 mb-8 max-w-md text-center">
                    深度自检将触及底层核心阵列。执行此操作不可逆，且可能导致系统崩溃。请输入主管级覆盖码以继续。
                  </p>
                  
                  <form onSubmit={handleOverride} className="w-full max-w-sm space-y-4">
                    <input 
                      type="text" 
                      value={overrideCode}
                      onChange={(e) => setOverrideCode(e.target.value)}
                      placeholder="ENTER OVERRIDE CODE"
                      className="w-full bg-black border-2 border-red-500/50 px-4 py-3 text-red-500 font-bold text-center tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                      autoComplete="off"
                    />
                    
                    {error && (
                      <div className="text-red-500 text-sm font-bold animate-pulse text-center">
                        {error}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="w-full bg-red-900/20 border-2 border-red-500 py-3 text-red-500 hover:bg-red-500 hover:text-black transition-colors font-bold tracking-widest"
                    >
                      EXECUTE DEEP SCAN
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#121010] p-4 sm:p-8 font-mono text-[#00ff00] relative overflow-hidden flex items-center justify-center">
      <div className="crt-overlay"></div>
      
      <div className="w-full max-w-md border-2 border-[#00ff00] p-8 shadow-[0_0_15px_rgba(0,255,0,0.2)] relative z-10 bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <Terminal className="w-12 h-12 mb-4" />
          <h1 className="text-xl font-bold tracking-widest text-center">TRANQUIL SLEEP CLINIC<br/>SECURE LOGIN</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 opacity-80">EMPLOYEE ID (工号):</label>
            <input 
              type="text" 
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#00ff00]/50 px-2 py-1 text-[#00ff00] focus:outline-none focus:border-[#00ff00] transition-colors"
              autoComplete="off"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2 opacity-80">PASSWORD (密码):</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#00ff00]/50 px-2 py-1 text-[#00ff00] focus:outline-none focus:border-[#00ff00] transition-colors"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-bold animate-pulse text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full border-2 border-[#00ff00] py-3 hover:bg-[#00ff00] hover:text-black transition-colors font-bold tracking-widest mt-4"
          >
            AUTHENTICATE
          </button>
        </form>

        {/* Fragment 7: Hidden near a broken pixel/icon */}
        <div 
          className="absolute bottom-2 right-2 w-2 h-2 bg-[#00ff00]/20 cursor-pointer hover:bg-amber-500 transition-colors"
          onClick={() => { addFragment(7); alert('你在终端的坏点处发现了一枚古铜色的符文碎片。'); }}
          title="System Error 0x00F"
        ></div>
      </div>
    </div>
  );
}
