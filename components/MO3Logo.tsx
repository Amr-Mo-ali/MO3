export default function MO3Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`logo-pulse flex flex-col items-center justify-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 260 110"
        role="img"
        aria-labelledby="mo3LogoTitle"
        className="h-[4.5rem] w-auto"
      >
        <title id="mo3LogoTitle">MO3 logo</title>
        <text x="0" y="80" fontFamily="Bebas Neue, sans-serif" fontWeight="800" fontSize="80" fill="#ffffff">
          M
        </text>
        <g transform="translate(70, 0)">
          <circle cx="45" cy="50" r="40" fill="#ffffff" />
          <polygon points="40,30 40,70 68,50" fill="#E31212" />
          <circle cx="45" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="8" />
        </g>
        <text x="160" y="80" fontFamily="Bebas Neue, sans-serif" fontWeight="800" fontSize="80" fill="#E31212">
          3
        </text>
      </svg>
      <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[color:var(--color-red)]">
        media production
      </span>
    </div>
  );
}
