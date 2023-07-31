'use client'

import { cn } from '@/lib/utils'
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import FreeCounter from './FreeCounter'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: 'text-violet-500',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    href: '/video',
    color: 'text-orange-700',
  },
  {
    label: 'Music Generation',
    icon: Music,
    href: '/music',
    color: 'text-emerald-500',
  },
  {
    label: 'Code Generation',
    icon: Code,
    href: '/code',
    color: 'text-green-700',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]
interface Props {
  apiLimitCount: number
}

const Sidebar = ({ apiLimitCount = 0 }: Props) => {
  const pathname = usePathname()
  return (
    <div className='space-y-4 py-4 flex flex-col h-full bg-[#0C0C0D] text-white'>
      <div className='px-3 py-2 flex-1'>
        <Link className='flex items-center pl-4' href='/dashboard'>
          <div className='relative w-16 h-16 mr-2 p-4'>
            <Image fill alt='368' src='/logo.jpeg' className='rounded-full' />
          </div>
          <h1 className='text-lg font-bold uppercase'>Do more.</h1>
        </Link>
        <h6 className='sidebar__subtitle'>Unleashing the Power of AI,</h6>
        <h6 className='sidebar__subtitle'>Welcome to the POWER.</h6>
        <div className='pt-10 space-y-1'>
          {routes.map((route) => (
            <Link
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-white rounded-lg transition hover:shadow-lg',
                pathname === route.href && 'text-black bg-white'
              )}
              href={route.href}
              key={route.href}
            >
              <div className='flex items-center flex-1'>
                <route.icon
                  className={cn('h-5 w-5 mr-3 group-hover:animate-bounce', route.color)}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} />
    </div>
  )
}

export default Sidebar
