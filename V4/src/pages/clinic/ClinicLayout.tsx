import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SectionLinks } from '../../components/UI';
import { useGameState } from '../../game/state';

const links = [
  { to: '/clinic', label: '主页' },
  { to: '/clinic/about', label: '关于我们' },
  { to: '/clinic/team', label: '专家团队' },
  { to: '/clinic/treatment', label: 'DNR疗法' },
  { to: '/clinic/reviews', label: '患者评价' },
  { to: '/clinic/news', label: '新闻动态' },
  { to: '/clinic/investor', label: '投资者关系' },
  { to: '/clinic/contact', label: '联系我们' },
  { to: '/clinic/archive', label: '档案查询' },
  { to: '/clinic/articles', label: '专家专栏' }
];

export default function ClinicLayout() {
  const { collectRune, readNode } = useGameState();
  const [warn, setWarn] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="clinic-theme">
      <header className="clinic-header">
        <div
          className="logo"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
              setWarn(true);
              collectRune('RUNE_06');
            }, 3000);
          }}
          onMouseLeave={() => {
            if (timerRef.current) {
              window.clearTimeout(timerRef.current);
            }
          }}
        >
          安宁深眠（南郊）医疗研究中心
        </div>
        <SectionLinks links={links} />
        <button
          onClick={() => {
            setSourceOpen((v) => !v);
            collectRune('RUNE_02');
            readNode('clinic_source_comment');
          }}
        >
          查看页面源码片段
        </button>
        {sourceOpen && (
          <pre className="mono">
{`<!--
site maintenance contact: bbs_admin@tranquil-sleep.com
last maintained: 2024-03-19
// reminder: don't stare at the logo too long
// -z
-->`}
          </pre>
        )}
      </header>

      {warn && (
        <div className="modal">
          <div className="modal-body">
            <p>⚠ 检测到长时间视觉焦点，建议移开视线。</p>
            <button onClick={() => setWarn(false)}>确认</button>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
