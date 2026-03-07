import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { InlineNotice, Panel, SectionLinks } from '../../components/UI';
import { attemptOALogin } from '../../game/guards';
import { useGameState } from '../../game/state';

const oaLinks = [
  { to: '/oa/dashboard', label: '主面板' },
  { to: '/oa/purchase', label: '采购' },
  { to: '/oa/hr', label: '人事' },
  { to: '/oa/maintenance', label: '维护日志' },
  { to: '/oa/b2report', label: 'B2报告' },
  { to: '/oa/photos', label: '图像档案' },
  { to: '/oa/system-notes', label: '系统备注' }
];

function OaGuard({ children }: { children: React.ReactNode }) {
  const { state } = useGameState();
  if (!state.oaLoggedIn) return <Navigate to="/oa" replace />;
  return <>{children}</>;
}

export function OaLoginPage() {
  const { state, setOaLoggedIn, setPhase, discoverFact } = useGameState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    discoverFact('oa_url_discovered');
  }, [discoverFact]);

  if (state.oaLoggedIn) {
    return <Navigate to="/oa/dashboard" replace />;
  }

  return (
    <Panel title="OA 登录">
      <div className="form-stack">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="账号" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" />
        <button
          onClick={() => {
            const result = attemptOALogin(state, username.trim(), password.trim());
            setMsg(result.message);
            if (result.success) {
              setOaLoggedIn(true);
              setPhase(3);
            }
          }}
        >
          登录
        </button>
      </div>
      {msg && <InlineNotice>{msg}</InlineNotice>}
      <p className="muted">账号：8023，密码：fswltz（需前置事实）。</p>
    </Panel>
  );
}

export function OaDashboardPage() {
  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="内部管理系统 v2.3.1">
          <p>用户：MNT-8023 | 上次登录：2024-03-19 21:44</p>
          <ol>
            <li>物资采购管理</li>
            <li>人事档案查询</li>
            <li>设施维护日志</li>
            <li>B2层运维报告（受限）</li>
            <li>图像档案库</li>
            <li>系统备注</li>
          </ol>
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaPurchasePage() {
  const { discoverFact } = useGameState();
  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="采购审批单">
          <pre className="mono">
枣木原材 3000kg
天然朱砂 50kg
黑山羊来源蛋白浓缩液 40L
铜质手工锻造铆钉 2000枚
附注：符材验收须由钟院长本人到场。
          </pre>
          <button onClick={() => discoverFact('purchase_order_read')}>标记已读</button>
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaHrPage() {
  const { discoverFact } = useGameState();
  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="人事档案">
          <p>MED-0019：离职申请 2022-09-14，状态：审查中</p>
          <p>ADM-0044：离职申请 2023-02-28，状态：审查中</p>
          <button onClick={() => discoverFact('disappearance_evidence_found')}>记录异常</button>
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaMaintenancePage() {
  const { discoverFact, collectRune } = useGameState();
  const [tail, setTail] = useState(false);
  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="设施维护日志">
          <pre className="mono">
2024-01-15 // 通风系统检测到异味
2024-01-22 // LX-044-YIN，标注PHX-ALPHA
2024-02-03 // 备份程序已修改（镜像目录）
2024-03-13 // 23:47 内壁上有东西
2024-03-14 // 提交7号机柜维修申请
          </pre>
          <button
            onClick={() => {
              setTail(true);
              discoverFact('oa_maintenance_log_read');
              collectRune('RUNE_05');
            }}
          >
            继续向下滚动
          </button>
          {tail && (
            <InlineNotice>
              如果你在读这个，说明你进来了。还有照片。继续找。——z
            </InlineNotice>
          )}
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaB2ReportPage() {
  const [code, setCode] = useState('');
  const [ok, setOk] = useState(false);

  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="B2层运维报告（受限）">
          <div className="row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="请输入个人验证码"
            />
            <button onClick={() => setOk(code.trim() === 'mnt8023_zq')}>验证</button>
          </div>
          {ok ? (
            <pre className="mono">
节点数：19,847（较上月 +203）
夜间高峰（22:00-02:00）能耗 = 日间基准 3.2 倍
热源集中：B2南半区 7-11号机柜
            </pre>
          ) : (
            <InlineNotice>此模块需要二级权限确认。</InlineNotice>
          )}
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaPhotosPage() {
  const { state, discoverFact, collectRune } = useGameState();
  const [showMeta, setShowMeta] = useState(false);

  if (!state.discoveredFacts.has('purchase_order_read')) {
    return (
      <OaGuard>
        <Panel title="图像档案库">
          <InlineNotice type="warn">请先阅读采购审批单。</InlineNotice>
        </Panel>
      </OaGuard>
    );
  }

  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="7号机柜照片">
          <InlineNotice>
            // function_key = "JiuKu" // 上半段在林医生专栏里。看文章标题首字。
          </InlineNotice>
          <button
            onClick={() => {
              discoverFact('password_half_juku_found');
            }}
          >
            记录 JiuKu
          </button>
          <button
            onClick={() => {
              setShowMeta(true);
              collectRune('RUNE_06');
            }}
          >
            查看图片元数据
          </button>
          {showMeta && (
            <InlineNotice>
              2024-03-19 22:28，我运行了定时邮件程序。22:30封禁。22:31发帖。——z
            </InlineNotice>
          )}
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaSystemNotesPage() {
  const { discoverFact } = useGameState();
  return (
    <OaGuard>
      <div className="stack">
        <SectionLinks links={oaLinks} />
        <Panel title="系统备注">
          <pre className="mono">
今天是最后一次了。
林医生的专栏我查过了，她做了。
这里有七个碎片，我数过了。
用“太乙救苦”的完整拼音打开终局。
——mnt-8023
          </pre>
          <button onClick={() => discoverFact('password_instructions_found')}>记录备注</button>
        </Panel>
      </div>
    </OaGuard>
  );
}

export function OaEntryPage() {
  return (
    <Panel title="OA 系统入口">
      <p>oa.tranquil-sleep.com</p>
      <Link to="/oa">继续</Link>
    </Panel>
  );
}
