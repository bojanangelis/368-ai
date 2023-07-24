import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center'>
      <div className='w-12 h-12 relative animate-spin'>
        <Image className='rounded-full opacity-80' alt='logo368' fill src={'/logo.jpeg'} />
      </div>
      <p className='text-sm text-white animate-pulse pt-2'>368 is thinking ...</p>
    </div>
  )
}

export default Loader
