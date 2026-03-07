import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineNotice, Panel } from '../../components/UI';
import { canTriggerEnding } from '../../game/guards';
import { useGameState } from '../../game/state';

export function ClinicHomePage() {
  const { discoverFact } = useGameState();
  return (
    <div className="grid-2">
      <Panel title="重建深层睡眠的神经秩序">
        <p>12,000+ 服务患者数</p>
        <p>93% 有效改善率</p>
        <p>4.8/5 患者满意度</p>
        <p className="muted">© 2019-2024 安宁深眠（南郊）医疗研究中心</p>
      </Panel>
      <Panel title="入口">
        <p>如需患者交流经验，可访问患者互助社区（目前维护中）。</p>
        <p className="muted">悬停状态栏可见：forum.tranquil-sleep.com/bbs</p>
        <Link
          to="/forum"
          onClick={() => {
            discoverFact('forum_url_discovered');
          }}
        >
          前往论坛
        </Link>
      </Panel>
    </div>
  );
}

export function ClinicAboutPage() {
  return (
    <Panel title="关于我们">
      <p>
        2009年，钟院长凭借其在MIT的开创性睡眠神经科学研究，奠定了DNR疗法的理论基础。
      </p>
      <p className="muted">国际合作、荣誉资质、规范流程。</p>
    </Panel>
  );
}

export function ClinicTeamPage() {
  return (
    <Panel title="专家团队">
      <ul>
        <li>
          <Link to="/clinic/team/zhong">钟长明</Link>
        </li>
        <li>
          <Link to="/clinic/team/lin">林雨桐</Link>
        </li>
      </ul>
    </Panel>
  );
}

export function TeamZhongPage() {
  return (
    <Panel title="钟长明">
      <p>“修复一个人的睡眠，就是修复一个人的生命本身。”</p>
      <InlineNotice type="warn">
        学术成果中保留一条灰色记录：2006年《灵子场》撤稿。
      </InlineNotice>
    </Panel>
  );
}

export function TeamLinPage() {
  return (
    <Panel title="林雨桐">
      <p>本院神经内科主任，钟院长的学术继承人。</p>
      <Link to="/clinic/articles">查看专栏</Link>
    </Panel>
  );
}

export function ClinicTreatmentPage() {
  return (
    <Panel title="DNR疗法介绍">
      <p>深度神经共振疗法（DNR）用于重建神经秩序。</p>
      <p>每次疗程约45分钟，建议连续14天。</p>
      <p className="muted">治疗期间可能出现轻微感知模糊。</p>
      <p className="muted">舱体内壁采用专利隔振材料。</p>
    </Panel>
  );
}

export function ClinicReviewsPage() {
  const { collectRune, readNode } = useGameState();
  return (
    <Panel title="患者评价（24条）">
      <p>第17条：gh_0314_lx（2024-01-07）</p>
      <p>“预约了两个月终于排到了。希望更多有需要的人能找到这里。”</p>
      <button
        onClick={() => {
          collectRune('RUNE_01');
          readNode('review_17_reply');
        }}
      >
        展开已折叠回复
      </button>
      <InlineNotice>祝你早日康复。</InlineNotice>
    </Panel>
  );
}

export function ClinicNewsPage() {
  return (
    <Panel title="新闻动态">
      <ul>
        <li>2023-11 睡眠医疗赛道的隐秘巨头：安宁深眠的资本路径</li>
        <li>2023-06 医疗机构认证公告</li>
        <li>2022-12 纳斯达克上市（TQSC）</li>
      </ul>
      <Link to="/world/archive">查看外部存档快照</Link>
    </Panel>
  );
}

export function ClinicInvestorPage() {
  const { discoverFact } = useGameState();
  return (
    <Panel title="投资者关系">
      <p>Meridian Bioscience Capital（多层结构持有）</p>
      <button onClick={() => discoverFact('meridian_suspicious')}>访问 Meridian 页面</button>
    </Panel>
  );
}

export function ClinicContactPage() {
  return (
    <Panel title="联系我们">
      <p>24小时服务热线：400-XXX-XXXX</p>
      <p className="muted">留言中含“林晓”可触发内部标记注释。</p>
      <Link to="/forum">患者互助社区</Link>
    </Panel>
  );
}

function archiveResponse(raw: string, canEnd: boolean): string {
  const input = raw.trim();
  if (!input) return '请输入患者姓名或档案编号。';
  if (input === '林晓') return '查询到1条记录，档案迁移处理中，暂时无法访问。';
  if (input === 'LX-044') return '档案编号格式错误。正确格式：XX-000-YYY。';
  if (input === 'LX-044-YIN') {
    return '// debug: anchor_node disconnected — signal overflow detected at render layer';
  }
  if (['枣木', '朱砂', '黑山羊'].includes(input)) {
    return '关键词类型不匹配。页面右下角出现一个B2物料文件夹图标。';
  }
  if (input === 'PHX-ALPHA') return '权限不足。此查询已被记录。';
  if (input === 'TaiYiJiuKu') {
    return canEnd ? '终局入口已验证。' : '档案编号格式错误，请确认输入信息。';
  }
  if (input === 'Meridian') return '此查询类型不在患者档案范围内。';
  if (input === '8023') {
    return '无此档案。<!-- employee query detected: MNT-8023 -->';
  }
  if (input === 'fswltz') return '无效输入。';
  if (input === 'gh_0314_lx') {
    return '[账号已注销，相关档案已移除] 页面标题短暂闪过“林晓”。';
  }
  if (input === 'nj0313') return '无效输入。';
  return '未找到相关档案，请确认输入信息后重试。';
}

export function ClinicArchivePage() {
  const navigate = useNavigate();
  const { state, discoverFact, setPhase } = useGameState();
  const canEnd = canTriggerEnding(state);

  return (
    <Panel title="患者档案查询">
      <ArchiveForm
        onSubmit={(value) => {
          const msg = archiveResponse(value, canEnd);
          if (value === 'TaiYiJiuKu' && canEnd) {
            setPhase(4);
            navigate('/ending');
          }
          if (value === '8023') discoverFact('employee_8023_known');
          return msg;
        }}
      />
      <p className="muted">关键词支持：林晓 / LX-044-YIN / 8023 / TaiYiJiuKu 等。</p>
    </Panel>
  );
}

function ArchiveForm({ onSubmit }: { onSubmit: (value: string) => string }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [folderUnlocked, setFolderUnlocked] = useState(false);
  const [code, setCode] = useState('');

  return (
    <div className="form-stack">
      <div className="row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="输入患者姓名或档案编号"
        />
        <button onClick={() => setResult(onSubmit(value))}>查询</button>
      </div>
      {result && <InlineNotice>{result}</InlineNotice>}

      {['枣木', '朱砂', '黑山羊'].includes(value.trim()) && (
        <div className="folder-box">
          <p>B2物料文件夹（访问码）</p>
          <div className="row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="访问码"
            />
            <button onClick={() => setFolderUnlocked(code === 'fswltz')}>打开</button>
          </div>
          {folderUnlocked && <InlineNotice type="ok">目录可见：/b2/materials/</InlineNotice>}
        </div>
      )}
    </div>
  );
}

export function ClinicArticlesPage() {
  return (
    <Panel title="林医生专栏">
      <ul>
        <li>
          <Link to="/clinic/articles/1">太多人误解了深度睡眠的本质</Link>
        </li>
        <li>
          <Link to="/clinic/articles/2">乙酰胆碱与睡眠调节的最新研究进展</Link>
        </li>
        <li>
          <Link to="/clinic/articles/3">救治失眠：为什么努力入睡是错的</Link>
        </li>
        <li>
          <Link to="/clinic/articles/4">苦于失眠的你，可能从未真正休息过</Link>
        </li>
      </ul>
    </Panel>
  );
}

export function Article1Page() {
  return (
    <Panel title="文章一 · 太多人误解了深度睡眠的本质">
      <p>慢波睡眠与REM的生理功能差异，及主观休息感的错位。</p>
    </Panel>
  );
}

export function Article2Page() {
  const { collectRune } = useGameState();
  return (
    <Panel title="文章二 · 乙酰胆碱与睡眠调节">
      <p>乙酰胆碱在睡眠-觉醒周期中的作用机制综述。</p>
      <button onClick={() => collectRune('RUNE_04')}>点击受限段落</button>
      <InlineNotice type="warn">[此内容需要专业账号访问]</InlineNotice>
    </Panel>
  );
}

export function Article3Page() {
  return (
    <Panel title="文章三 · 救治失眠">
      <p>刺激控制法与矛盾意向法的临床实践摘要。</p>
    </Panel>
  );
}

export function Article4Page() {
  const { discoverFact, setPhase } = useGameState();
  return (
    <Panel title="文章四 · 苦于失眠的你，可能从未真正休息过">
      <p>睡眠质量与睡眠时长并不等价，主观感受同样重要。</p>
      <p>
        <strong>太</strong>多人不知道，他们以为的治愈，<strong>乙</strong>
        是另一种形式的消耗。愿有人能从这些文字缝隙里，<strong>救</strong>
        出不会发声的人。剩下的一半，<strong>苦</strong>于无处言说。
      </p>
      <button
        onClick={() => {
          discoverFact('linyuudon_message_found');
          setPhase(2);
        }}
      >
        记录这段文字
      </button>
    </Panel>
  );
}
