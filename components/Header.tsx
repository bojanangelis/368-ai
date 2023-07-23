import { HeaderInterfaceProps } from '@/lib/interface'
import { cn } from '@/lib/utils'
import React from 'react'

const Header = ({ title, description, icon: Icon, iconColor, bgColor }: HeaderInterfaceProps) => {
  return (
    <div className='px-4 lg:px-8 flex items-center gap-x-3 mb-8'>
      <div className={cn('p-2 w-fit rounded-md', bgColor)}>
        <Icon className={cn('w-8 h-8', iconColor)} />
      </div>
      <div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p className='text-sm'>{description}</p>
      </div>
    </div>
  )
}

export default Header
