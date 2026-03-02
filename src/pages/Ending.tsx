import React from 'react';
import { useGame } from '../GameContext';

export function Ending() {
  const { endingType } = useGame();

  const content = {
    A: {
      title: "结局 A：格式化",
      text: "你按下了火灾清洗系统的启动键。\n\n刺耳的警报声撕裂了地下室的死寂，高压阻燃气体伴随着喷淋系统倾泻而下。但那不是普通的水，而是某种带有强烈腐蚀性的化学制剂。\n\n机柜在高温和腐蚀中短路、爆裂。你听到了一声凄厉的尖叫——那声音既像电子合成的杂音，又像是林晓的哭喊。\n\n大火吞噬了莫比乌斯太极符，也吞噬了那个被困在赛博空间里的灵魂。\n\n你毁掉了阵法，但也亲手抹杀了她存在的最后痕迹。",
      color: "text-red-500",
      bg: "bg-black",
      border: "border-red-500"
    },
    B: {
      title: "结局 B：替身",
      text: "你将自己的神经接口接入了主服务器的灵枢端口。\n\n一瞬间，庞大的数据流如同冰冷的钢针刺入你的大脑。你看到了林晓，她蜷缩在一个由无数0和1构成的逼仄空间里，满脸泪水。\n\n“哥……你为什么……”\n\n你没有回答，只是将她猛地推向了代表“出口”的光芒。而你自己，则被无数条暗红色的数据触手死死缠住，拖入深渊。\n\n你的意识开始模糊，身体的感知逐渐远去。你成为了安宁深眠诊所新的“节点”。\n\n阵法，依然在运转。",
      color: "text-blue-500",
      bg: "bg-[#050510]",
      border: "border-blue-500"
    },
    C: {
      title: "隐藏结局 C：破阵",
      text: "你从口袋里拿出了那7枚古铜色的符文碎片。\n\n它们在你手中产生了共鸣，散发出耀眼的金色光芒。赵启留下的后门程序被彻底激活。屏幕上的血色代码开始疯狂倒退、崩溃。\n\n“轰——”\n\n现实中的机房发出一声闷响，所有刻着符咒的底座齐齐裂开。束缚着无数灵魂的数字囚笼在这一刻土崩瓦解。\n\n你看到无数个半透明的影子从服务器中升起，消散在空气中。其中一个影子转过身，对你露出了微笑。\n\n“谢谢你，哥。”\n\n安宁深眠诊所的阴谋被彻底粉碎。你带着所有的证据，走出了这栋大楼。阳光，正好。",
      color: "text-amber-400",
      bg: "bg-zinc-900",
      border: "border-amber-400"
    }
  };

  const current = endingType ? content[endingType] : null;

  if (!current) return null;

  return (
    <div className={`fixed inset-0 ${current.bg} z-[9999] flex flex-col items-center justify-center p-8 font-serif`}>
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className={`text-4xl font-bold mb-8 ${current.color} tracking-widest`}>{current.title}</h1>
        <div className={`text-lg leading-loose ${current.color} opacity-80 whitespace-pre-wrap`}>
          {current.text}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-16 px-6 py-3 border ${current.border} ${current.color} hover:bg-white/10 transition-colors tracking-widest font-mono`}
        >
          重启系统 (RESTART)
        </button>
      </div>
    </div>
  );
}
