import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Terminal } from 'lucide-react';

export function OA() {
  const { addClue, addFragment } = useGame();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  if (isLoggedIn) {
    return (
      <div className="min-h-full bg-[#121010] p-4 sm:p-8 font-mono text-[#00ff00] relative overflow-hidden">
        <div className="crt-overlay"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="border-b-2 border-[#00ff00] pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-widest">TRANQUIL SLEEP CLINIC - INTRANET</h1>
              <p className="text-sm mt-1 opacity-70">SYSTEM VERSION 4.2.1 | USER: 8023</p>
            </div>
            <div className="text-right text-sm">
              <p>STATUS: ONLINE</p>
              <p>DATE: 甲辰年 四月十五 宜祭祀</p>
            </div>
          </div>
          
          <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center border border-dashed border-[#00ff00]/50">
            <div className="text-4xl mb-4 animate-pulse">_</div>
            <p>WELCOME TO THE INTRANET.</p>
            <p className="text-sm mt-4 opacity-70">（第三幕：深渊凝视 内容即将部署，包括采购清单和维修日志）</p>
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
