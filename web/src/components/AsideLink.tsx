import type { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'

interface AsideLinkProps extends ComponentProps<typeof NavLink> {
  to: string
}

export function AsideLink({ to, ...props }: AsideLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'flex items-center gap-1 text-lg text-left bg-blue-500 text-neutral-100 p-3 w-full rounded-lg duration-300 mb-3'
          : 'flex items-center gap-1 text-neutral-800 text-lg text-left hover:bg-blue-500 p-3 hover:text-neutral-100 rounded-lg duration-300 mb-3'
      }
      {...props}
    />
  )
}
