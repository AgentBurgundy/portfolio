import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ className, variant = 'primary', disabled, ...props }: Props) {
  return (
    <button
      className={clsx(
        'pixel-border pixel-corners inline-flex items-center justify-center gap-2 px-4 py-3 text-sm transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950',
        variant === 'primary' &&
          'bg-white/5 text-white hover:bg-white/8 hover:shadow-glow active:translate-y-[1px]',
        variant === 'ghost' && 'bg-transparent text-white/80 hover:bg-white/5 hover:text-white',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white/5 hover:shadow-none active:translate-y-0',
        className,
      )}
      disabled={disabled}
      {...props}
    />
  )
}

