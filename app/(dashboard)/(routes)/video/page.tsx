'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { SendHorizonal, VideoIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { formSchema } from './constants'
import Header from '@/components/Header'
import React, { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import Empty from '@/components/Empty'
import Loader from '@/components/Loader'

const VideoPage = () => {
  const router = useRouter()
  const [video, setVideo] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setVideo(null)
      const response = await axios.post('/api/video', data)

      setVideo(response.data[0])
      form.reset()
    } catch (err: any) {
      // TODO!!!! Open pro modal pay for more.
      console.error(err)
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Header
        title={'Video Generation'}
        description={'Turn your prompt into video.'}
        icon={VideoIcon}
        iconColor='text-orange-700'
        bgColor='bg-orange-700/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              className='rounded-lg border w-full p-4 px-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Clown fish swimming in a lake'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='col-span-2 flex justify-end'>
                <Button disabled={isLoading} variant='ghost' className='grid-span-2' size='icon'>
                  <SendHorizonal />
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-black/90'>
              <Loader />
            </div>
          )}
          {!video && !isLoading && <Empty label='No video generated.' />}
          {video && (
            <video className='w-full aspect-video rounded-lg mt-8 border bg-black' controls>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
