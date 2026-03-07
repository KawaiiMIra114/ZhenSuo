import { Link } from 'react-router-dom';

export function Panel({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className ?? ''}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function InlineNotice({
  children,
  type = 'neutral'
}: {
  children: React.ReactNode;
  type?: 'neutral' | 'warn' | 'error' | 'ok';
}) {
  return <div className={`notice ${type}`}>{children}</div>;
}

export function SectionLinks({ links }: { links: Array<{ to: string; label: string }> }) {
  return (
    <div className="section-links">
      {links.map((item) => (
        <Link key={item.to} to={item.to}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
