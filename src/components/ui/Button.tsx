import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', disabled, ...props }: Props) {
  return (
    <button
      className={clsx(
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'btn-ghost',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    />
  )
}
