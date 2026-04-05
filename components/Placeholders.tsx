'use client'

export function PlaceholderWorkCard() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-[#111111] border border-[#222222]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#333333]">
          <svg
            className="h-5 w-5 text-[#444444]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="h-3 w-24 rounded bg-[#222222] mb-1" />
        <div className="h-2 w-16 rounded bg-[#1a1a1a]" />
      </div>
    </div>
  )
}

export function PlaceholderClientLogo() {
  return (
    <div className="aspect-square rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xs text-[#444444] font-medium">Client Logo</div>
      </div>
    </div>
  )
}
