import type { ReactNode } from "react";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-header ${className}`}>
      <p className="section-label">{label}</p>
      <h2 className="section-title mt-4 text-white">{title}</h2>
      <div className="section-divider" />
      {subtitle ? <p className="section-subtitle mt-6">{subtitle}</p> : null}
    </div>
  );
}
