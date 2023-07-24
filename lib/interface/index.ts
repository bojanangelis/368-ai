import { LucideIcon } from 'lucide-react'

export interface HeaderInterfaceProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
}

export interface EmptyInterfaceProps {
  label: string
}
