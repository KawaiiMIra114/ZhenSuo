import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDocSections, getRouteCanon } from '../content/docs';

export function CanonPanel() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const canon = getRouteCanon(location.pathname);

  const gddSections = useMemo(
    () => getDocSections('gdd', canon.gdd ?? []),
    [canon.gdd]
  );
  const worldSections = useMemo(
    () => getDocSections('world', canon.world ?? []),
    [canon.world]
  );

  if (!gddSections.length && !worldSections.length) return null;

  return (
    <aside className="canon-panel">
      <button className="canon-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '隐藏原文章节' : '显示原文章节'}
      </button>
      {open && (
        <div className="canon-body">
          {gddSections.map((sec) => (
            <section key={`gdd-${sec.title}`} className="canon-section">
              <h3>GDD · {sec.title}</h3>
              <pre>{sec.content}</pre>
            </section>
          ))}
          {worldSections.map((sec) => (
            <section key={`world-${sec.title}`} className="canon-section">
              <h3>WorldBible · {sec.title}</h3>
              <pre>{sec.content}</pre>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}
