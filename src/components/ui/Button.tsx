import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ className, variant = 'primary', disabled, ...props }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950',
        variant === 'primary' &&
          'border border-white/10 bg-white text-space-950 hover:bg-white/90 active:scale-[0.98]',
        variant === 'ghost' &&
          'border border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
      disabled={disabled}
      {...props}
    />
  )
}
