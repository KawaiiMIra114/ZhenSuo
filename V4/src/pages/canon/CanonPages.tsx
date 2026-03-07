import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDocRaw, listDocHeadings, type DocId } from '../../content/docs';

function DocFullView({ doc }: { doc: DocId }) {
  const raw = getDocRaw(doc);
  const headings = useMemo(() => listDocHeadings(doc), [doc]);

  return (
    <div className="panel">
      <h2>{doc === 'gdd' ? 'GDD 完整原文镜像' : 'WorldBible 完整原文镜像'}</h2>
      <p className="muted">当前文档总标题数：{headings.length}</p>
      <div className="canon-index">
        {headings.map((h) => (
          <div key={`${h.line}-${h.title}`} className="canon-index-item">
            {'#'.repeat(h.level)} {h.title}
          </div>
        ))}
      </div>
      <pre className="doc-full">{raw}</pre>
      <Link to="/">返回游戏</Link>
    </div>
  );
}

export function CanonGddPage() {
  return <DocFullView doc="gdd" />;
}

export function CanonWorldPage() {
  return <DocFullView doc="world" />;
}
