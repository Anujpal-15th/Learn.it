import Link from 'next/link';

// The one page header used under AppNav on every app page.
// Order: back link -> eyebrow -> h1 -> sub -> children. `aside` sits top
// right on desktop and stacks under the title at <=720px. `className` is an
// optional extra (e.g. "page-header-bg" for the Home header that hosts a
// TrackBackground).
export default function PageHeader({ eyebrow, title, sub, back, aside, children, className }) {
  return (
    <header className={'page-header' + (className ? ' ' + className : '')}>
      {back ? (
        <Link className="link-back" href={back.href}>
          <span aria-hidden="true">←</span> {back.label}
        </Link>
      ) : null}
      <div className="page-header-main">
        <div className="page-header-text">
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          {title ? <h1 className="page-title">{title}</h1> : null}
          {sub ? <p className="page-sub">{sub}</p> : null}
        </div>
        {aside ? <div className="page-header-aside">{aside}</div> : null}
      </div>
      {children}
    </header>
  );
}
