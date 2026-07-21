import { Link } from 'react-router-dom'

/**
 * Physical-depth 3D button — two variants:
 *   variant="cream"  (default) — cream face, gold edge
 *   variant="gold"             — gold face, dark edge
 */
export default function Btn3D({ to, onClick, children, variant = 'cream', className = '', type = 'button', ...rest }) {
  const cls = `btn3d btn3d--${variant} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button type={type} onClick={onClick} className={cls} {...rest}>{children}</button>
}
