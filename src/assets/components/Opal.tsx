/**
 * RoundIcon Component
 *
 * Renders a circular icon with two arcs and a central bar.
 *
 * Props:
 * - width: number or string (default: 96)
 * - height: number or string (default: 96)
 * - strokeColor: string (optional, default: '#0cb6b8')
 * - fillColor: string (optional, default: '#0cb6b8')
 */
const Opal = ({
  width = 20,
  height = 20,
  strokeColor = '#0cb6b8',
  fillColor = '#0cb6b8',
  ...props
}) => (
  <svg
    height={height}
    viewBox="0 0 96 96"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Left arc */}
    <path
      d="M48 8 A40 40 0 0 0 48 88"
      fill="none"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeWidth={16}
    />
    {/* Right arc */}
    <path
      d="M48 8 A40 40 0 0 1 48 88"
      fill="none"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeWidth={16}
    />
    {/* Center bar */}
    <rect fill={fillColor} height={32} rx={4} width={8} x={44} y={32} />
  </svg>
)

export default Opal
