import React from 'react'

interface PlaceholderCardProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  gradient?: 'red' | 'blue' | 'purple' | 'green' | 'orange'
}

const gradientClasses = {
  red: 'from-red-500/20 to-transparent',
  blue: 'from-blue-500/20 to-transparent',
  purple: 'from-purple-500/20 to-transparent',
  green: 'from-green-500/20 to-transparent',
  orange: 'from-orange-500/20 to-transparent',
}

const accentClasses = {
  red: 'text-red-400 bg-red-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  green: 'text-green-400 bg-green-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
}

const borderClasses = {
  red: 'border-red-500/20',
  blue: 'border-blue-500/20',
  purple: 'border-purple-500/20',
  green: 'border-green-500/20',
  orange: 'border-orange-500/20',
}

export function PlaceholderCard({
  icon,
  title,
  description,
  action,
  gradient = 'purple',
}: PlaceholderCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${borderClasses[gradient]} bg-gradient-to-br ${gradientClasses[gradient]} p-8 backdrop-blur-sm transition hover:border-opacity-100`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradientClasses[gradient]} blur-2xl opacity-20`} />
        <div className={`absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradientClasses[gradient]} blur-2xl opacity-20`} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        {icon ? (
          <div className={`mb-4 rounded-full ${accentClasses[gradient]} p-4`}>
            <div className="text-3xl">{icon}</div>
          </div>
        ) : (
          <div className={`mb-4 h-16 w-16 rounded-full ${accentClasses[gradient]} animate-pulse flex items-center justify-center`}>
            <div className="h-8 w-8 rounded-full bg-current opacity-20" />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>

        {/* Description */}
        {description && (
          <p className="mb-6 max-w-sm text-sm text-slate-400">
            {description}
          </p>
        )}

        {/* Skeleton loading animation (when no description) */}
        {!description && (
          <div className="mb-6 w-full max-w-sm space-y-2">
            <div className="mx-auto h-3 w-3/4 rounded-full bg-slate-700 animate-pulse" />
            <div className="mx-auto h-3 w-1/2 rounded-full bg-slate-700 animate-pulse" />
          </div>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`rounded-full px-6 py-2 text-sm font-medium text-white transition ${accentClasses[gradient]} hover:opacity-80`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export function PlaceholderGrid({
  items,
  columns = 3,
}: {
  items: PlaceholderCardProps[]
  columns?: number
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid gap-6 ${gridClasses[columns as keyof typeof gridClasses]}`}>
      {items.map((item, index) => (
        <PlaceholderCard key={index} {...item} />
      ))}
    </div>
  )
}
