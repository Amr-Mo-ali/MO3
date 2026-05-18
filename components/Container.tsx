import type { ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl min-w-0 px-6 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
