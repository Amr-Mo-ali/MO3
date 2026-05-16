import Image from 'next/image'

export default function MO3Logo({ className = "", alt = "MO3 Media Production Logo" }: { className?: string; alt?: string }) {
  return (
    <div className={`logo-pulse flex flex-col items-center justify-center gap-2 ${className}`}>
      <Image
        src="/mo3-logo.svg"
        alt={alt}
        width={260}
        height={110}
        priority
        className="h-auto w-auto"
        style={{ maxHeight: className?.includes('h-[5') ? undefined : 'auto' }}
      />
    </div>
  );
}
