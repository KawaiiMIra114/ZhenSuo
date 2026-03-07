import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="panel">
      <h2>404</h2>
      <p>页面不存在。</p>
      <Link to="/">返回桌面</Link>
    </div>
  );
}
