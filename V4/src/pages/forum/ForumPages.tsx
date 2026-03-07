import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { InlineNotice, Panel, SectionLinks } from '../../components/UI';
import { canAccessAdminPanel } from '../../game/guards';
import { useGameState } from '../../game/state';

const forumLinks = [
  { to: '/forum', label: '公开区' },
  { to: '/forum/member', label: '会员区' },
  { to: '/forum/admin', label: '管理员' },
  { to: '/forum/shadow', label: '影子档案' }
];

export function ForumHomePage() {
  const { discoverFact, collectRune } = useGameState();
  const [q, setQ] = useState('');
  const [expandedFold, setExpandedFold] = useState(false);

  useEffect(() => {
    discoverFact('forum_url_discovered');
  }, [discoverFact]);

  useEffect(() => {
    if (q.trim() === '8023') {
      discoverFact('employee_8023_known');
    }
  }, [q, discoverFact]);

  const result = useMemo(() => {
    const input = q.trim();
    if (!input) return '输入关键词检索。';
    if (input === '8023') {
      return '命中：zq_mnt_8023（地下暖通噪音） + 家属吐槽帖（福生无量天尊）。';
    }
    if (input === '福生无量天尊') {
      return '命中：值班员工口头禅相关帖子。';
    }
    if (['声音', '气味'].includes(input)) {
      return '命中：公开帖 + 2条折叠内容影子。';
    }
    if (input === 'B2') {
      return '[1条相关内容因包含受限词汇已被自动处理]';
    }
    if (input === '林晓') {
      return '无结果（账号已注销，内容已清除出公开索引）。';
    }
    return '找到0条公开结果。部分相关内容可能已被版主处理。';
  }, [q]);

  return (
    <div className="stack">
      <SectionLinks links={forumLinks} />
      <Panel title="论坛公开层">
        <p>家属担忧帖约17分钟内会收到 clinic_service 的固定模板回复并关闭。</p>
        <div className="row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索关键词" />
        </div>
        <InlineNotice>{result}</InlineNotice>

        <div className="fold-block">
          <p>[此内容因包含敏感词汇已被自动折叠]</p>
          <button
            onClick={() => {
              setExpandedFold((v) => !v);
              collectRune('RUNE_03');
            }}
          >
            {expandedFold ? '收起' : '展开'}
          </button>
          {expandedFold && (
            <InlineNotice>
              “我室友入院第三周被告知转介后，再也没有消息。”（楼主2小时后注销）
            </InlineNotice>
          )}
        </div>

        <Link to="/forum/post/7829">查看 zq_mnt_8023 相关帖子</Link>
        <button onClick={() => discoverFact('forum_url_discovered')}>标记论坛入口已发现</button>
      </Panel>
    </div>
  );
}

export function ForumPostPage() {
  return (
    <Panel title="帖子 7829 / 7823 摘要">
      <p>zq_mnt_8023：关于地下暖通系统噪音问题。</p>
      <p className="muted">时间：2024-03-13 23:47</p>
    </Panel>
  );
}

export function ForumMemberPage() {
  const { discoverFact, setForumAccess, state } = useGameState();
  const [archiveId, setArchiveId] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <div className="stack">
      <SectionLinks links={forumLinks} />
      <Panel title="会员注册">
        <div className="row">
          <input
            value={archiveId}
            onChange={(e) => setArchiveId(e.target.value)}
            placeholder="患者档案编号或家属关系证明"
          />
          <button
            onClick={() => {
              if (archiveId.trim() === 'LX-044-YIN') {
                discoverFact('forum_member_registered');
                setForumAccess('member');
                setMsg('档案编号有效，家属账号注册成功。');
              } else {
                setMsg('验证未通过。');
              }
            }}
          >
            提交
          </button>
        </div>
        {msg && <InlineNotice>{msg}</InlineNotice>}
        {state.discoveredFacts.has('forum_member_registered') && (
          <InlineNotice type="warn">
            本板块实行严格信息准确性审核，违规内容将被移除处理。
          </InlineNotice>
        )}
      </Panel>
    </div>
  );
}

export function ForumAdminLoginPage() {
  const { state, setAdminUnlocked, setForumAccess } = useGameState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  if (state.adminUnlocked) {
    return <Navigate to="/forum/admin/logs" replace />;
  }

  return (
    <div className="stack">
      <SectionLinks links={forumLinks} />
      <Panel title="管理员登录">
        <div className="form-stack">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="用户名" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" />
          <button
            onClick={() => {
              if (username !== 'bbs_admin' || password !== 'nj0313') {
                setMsg('用户名或密码错误。');
                return;
              }
              const gate = canAccessAdminPanel(state);
              if (!gate.ok) {
                setMsg(gate.reason ?? '会话异常。');
                return;
              }
              setAdminUnlocked(true);
              setForumAccess('admin');
              setMsg('登录成功。');
            }}
          >
            登录
          </button>
        </div>
        {msg && <InlineNotice>{msg}</InlineNotice>}
      </Panel>
    </div>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { state } = useGameState();
  if (!state.adminUnlocked) return <Navigate to="/forum/admin" replace />;
  return <>{children}</>;
}

export function AdminLogsPage() {
  return (
    <AdminGuard>
      <Panel title="审查操作日志">
        <pre className="mono">
22:35 | 帖子ID:7832 | 操作:折叠 | 触发词:[失踪]
22:34 | 帖子ID:7831 | 操作:折叠 | 触发词:[地下,声音]
22:31 | 帖子ID:7829 | 操作:折叠 | 触发词:[手动操作]
22:30 | 账号:zq_mnt_8023 | 操作:封禁
        </pre>
      </Panel>
    </AdminGuard>
  );
}

export function AdminKeywordsPage() {
  const { discoverFact } = useGameState();
  return (
    <AdminGuard>
      <Panel title="关键词过滤列表">
        <p>失踪 | 消失 | 联系不上 | 转介之后 | 合作机构电话 | B2 | 地下室 | 机房</p>
        <InlineNotice>
          [ARCHIVE_PATH: /srv/bbs_backup/zq_mirror_20240101/]
          <button onClick={() => discoverFact('shadow_archive_path_found')}>记录路径</button>
        </InlineNotice>
      </Panel>
    </AdminGuard>
  );
}

export function AdminMessagesPage() {
  const { discoverFact } = useGameState();
  return (
    <AdminGuard>
      <Panel title="内部通讯">
        <pre className="mono">
pr_team -&gt; bbs_admin: 账号 gh_0314_lx 已完成入院登记，请即刻封禁并清理历史发言。
王总确认：此类账号处理不需要逐条审批。
        </pre>
        <button onClick={() => discoverFact('oa_url_discovered')}>标记 OA 地址已获知</button>
      </Panel>
    </AdminGuard>
  );
}

export function AdminBannedPage() {
  return (
    <AdminGuard>
      <Panel title="被封禁账号管理">
        <p>账号 gh_0314_lx · 封禁时间 2024-01-10 08:47 · 原因：违规内容</p>
        <p>2023-12-28 23:14：咨询 DNR 疗程。</p>
        <p>2024-01-03 01:07：预约上了，有点紧张但更多是期待。</p>
        <p>2024-01-09 02:34：帮我照顾一下我哥哥。</p>
      </Panel>
    </AdminGuard>
  );
}

export function ForumShadowPage() {
  const { state, setForumAccess, setShadowAccessed, collectRune, discoverFact } = useGameState();
  const [showTail, setShowTail] = useState(false);

  if (!state.adminUnlocked || !state.discoveredFacts.has('shadow_archive_path_found')) {
    return (
      <Panel title="影子档案">
        <InlineNotice type="error">路径不存在或权限不足。</InlineNotice>
      </Panel>
    );
  }

  return (
    <Panel title="/srv/bbs_backup/zq_mirror_20240101/">
      <p>建立人：MNT-8023</p>
      <p>README：如果你找到了这里，说明你足够认真。</p>
      <p>post_7829_complete：B2层不是服务器机房。</p>
      <button
        onClick={() => {
          setForumAccess('shadow');
          setShadowAccessed(true);
          discoverFact('shadow_archive_accessed');
          collectRune('RUNE_03');
        }}
      >
        访问目录
      </button>
      <button
        onClick={() => {
          setShowTail(true);
          collectRune('RUNE_07');
        }}
      >
        继续向下滚动
      </button>
      {showTail && (
        <InlineNotice>
          妈，你不用担心我。我在处理一件事，处理完就回来。赵启。
        </InlineNotice>
      )}
    </Panel>
  );
}
