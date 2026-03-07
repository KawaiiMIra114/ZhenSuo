import { Link } from 'react-router-dom';
import { Panel, SectionLinks } from '../../components/UI';

const links = [
  { to: '/world/map', label: '地图评价' },
  { to: '/world/qa', label: '问答快照' },
  { to: '/world/archive', label: '撤稿报道' },
  { to: '/world/gov', label: '政府公示' },
  { to: '/world/petition', label: '匿名信访帖' }
];

export function WorldHubPage() {
  return (
    <div className="stack">
      <SectionLinks links={links} />
      <Panel title="外部世界层">
        <p>这部分内容散落在诊所之外，用于证明世界不是只存在于官网和论坛。</p>
        <p>从这里开始，所有线索都不再是“内部文件”，而是社会环境里的噪声与残影。</p>
      </Panel>
    </div>
  );
}

export function WorldMapPage() {
  return (
    <Panel title="地图评价 · 2021年11月">
      <p>
        ★★★★ | 骑行时路过，白色建筑，看起来很高端。晚上路过有点奇怪，说不清楚是什么感觉。
      </p>
      <Link to="/world">返回外部层</Link>
    </Panel>
  );
}

export function WorldQaPage() {
  return (
    <Panel title="问答快照 · 南郊区信号差">
      <p>问：为什么南郊区手机信号这么差？</p>
      <p>最高赞：历史原因，地下有东西。</p>
      <p className="muted">评论区多数人认为这是段子。</p>
      <Link to="/world">返回外部层</Link>
    </Panel>
  );
}

export function WorldArchivePage() {
  return (
    <Panel title="存档快照 · 被撤稿财经报道">
      <p>标题：层层嵌套的离岸结构：谁在真正控制安宁深眠</p>
      <p className="muted">正文仅第一段可见，后续损坏。作者与官网正面报道为同一人。</p>
      <Link to="/world">返回外部层</Link>
    </Panel>
  );
}

export function WorldGovPage() {
  return (
    <Panel title="南郊区政府公示 · 2022">
      <p>安宁深眠（南郊）医疗研究中心 · 纳税先进单位</p>
      <p className="muted">这条不是谜题，是环境音。</p>
      <Link to="/world">返回外部层</Link>
    </Panel>
  );
}

export function WorldPetitionPage() {
  return (
    <Panel title="匿名信访帖（已删存档）">
      <p>“近半年关于家属长期无法联系住院患者的材料，多次上报后消失。”</p>
      <p>帖子发出48小时内账号注销。</p>
      <Link to="/world">返回外部层</Link>
    </Panel>
  );
}
