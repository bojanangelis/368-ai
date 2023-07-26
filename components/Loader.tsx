import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center'>
      <p className='text-sm text-white animate-pulse pt-2'>368 is thinking ...</p>
    </div>
  )
}

export default Loader
