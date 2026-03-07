import { Link, Navigate } from 'react-router-dom';
import { ALL_RUNES } from '../../game/types';
import { InlineNotice, Panel } from '../../components/UI';
import { useGameState } from '../../game/state';
import { canTriggerEnding } from '../../game/guards';
import { playEndingBreath } from '../../game/sfx';

export function EndingHubPage() {
  const { state, setZhaoQiEmailShown } = useGameState();
  const unlocked = canTriggerEnding(state);
  const missing = ALL_RUNES.filter((r) => !state.collectedRunes.has(r));

  if (!unlocked) {
    return (
      <Panel title="终局入口">
        <InlineNotice type="error">档案编号格式错误，请确认输入信息。</InlineNotice>
        <Link to="/clinic/archive">返回档案查询</Link>
      </Panel>
    );
  }

  return (
    <Panel title="终局选择界面">
      <p>&gt; 检测到阵法覆写函数碎片：[{state.collectedRunes.size}/7]</p>
      {state.collectedRunes.size < 7 ? (
        <InlineNotice type="warn">
          当前碎片数量不足。缺失：{missing.join(', ')}
        </InlineNotice>
      ) : (
        <InlineNotice type="ok">验证碎片完整性：[7/7] ✓</InlineNotice>
      )}
      <div className="section-links">
        <Link to="/ending/a">烈火洗城（格式化）</Link>
        <Link to="/ending/b">上行替代（伥鬼）</Link>
        {state.collectedRunes.size === 7 && (
          <Link
            to="/ending/c"
            onClick={() => {
              setZhaoQiEmailShown(true);
              playEndingBreath();
            }}
          >
            七星破阵（太乙救苦）
          </Link>
        )}
      </div>
      <Link to="/clinic/archive">返回调查</Link>
    </Panel>
  );
}

export function EndingAPage() {
  const { setEnding, setPhase } = useGameState();
  return (
    <Panel title="结局A · 烈火洗城">
      <p>液冷循环切断，热失控开始。19,847 个节点批量离线。</p>
      <p>桌面恢复后，邮件窗口不断繁殖：哥哥……为什么要杀掉我……</p>
      <button
        onClick={() => {
          setEnding('A');
          setPhase('ending_a');
        }}
      >
        记录该结局
      </button>
      <Link to="/ending">返回终局选择</Link>
    </Panel>
  );
}

export function EndingBPage() {
  const { setEnding, setPhase } = useGameState();
  return (
    <Panel title="结局B · 上行替代">
      <p>置换完成。LX-044-YIN 下线，UID:PLAYER 上线。</p>
      <p>官网看似如常，版权年份悄然变为 2025。系统继续运转。</p>
      <button
        onClick={() => {
          setEnding('B');
          setPhase('ending_b');
        }}
      >
        记录该结局
      </button>
      <Link to="/ending">返回终局选择</Link>
    </Panel>
  );
}

export function EndingCPage() {
  const { state, setEnding, setPhase } = useGameState();

  if (state.collectedRunes.size < 7) {
    return <Navigate to="/ending" replace />;
  }

  return (
    <Panel title="结局C · 七星破阵">
      {state.zhaoQiEmailShown && (
        <InlineNotice>
          我不是英雄。我只是觉得，如果我什么都不做，以后我会一直记得那个气味。把它跑完。——赵启
        </InlineNotice>
      )}
      <p>输入确认：TaiYiJiuKu。接口状态：建立中 → 覆写中 → 清除中。</p>
      <p>19,847 节点逐条释放。最后一条：LX-044-YIN。</p>
      <p>黑屏后，微信亮起：林晓：哥，我到家了。你在哪？</p>
      <button
        onClick={() => {
          setEnding('C');
          setPhase('ending_c');
        }}
      >
        记录该结局
      </button>
      <Link to="/ending">返回终局选择</Link>
    </Panel>
  );
}
