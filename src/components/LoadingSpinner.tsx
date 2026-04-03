'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export default function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} rounded-full border-[#E8F4F8] animate-spin`}
        style={{
          borderTopColor: color ?? '#1B6B93',
        }}
      />
    </div>
  )
}
